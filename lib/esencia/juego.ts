// Reglas del juego. El anfitrión es la única fuente de verdad: recibe acciones,
// las valida con `aplicar` y reparte el estado nuevo a todos.

import { CARTAS, CIERRES, ETAPAS, MAX_JUGADORES, PERMITIR_PASO, type Comodin } from "./cartas";

export type { Comodin };
export type Modo = "facilitador" | "turnos";
export type Fase = "espera" | "juego" | "cierre" | "fin";

/** Vueltas por etapa si el guía no elige otra cosa (= mínimo de cartas por persona en cada etapa) */
export const VUELTAS_POR_ETAPA = 4;
/** Opciones que puede elegir el guía antes de empezar */
export const OPCIONES_VUELTAS = [3, 4] as const;
/** Vueltas por etapa de esta partida */
export const vueltasDe = (e: Estado) => e.vueltas ?? VUELTAS_POR_ETAPA;

const cartaDe = (id: string) => CARTAS.find((c) => c.id === id);

export interface Jugador {
  id: string;
  nombre: string;
  anfitrion: boolean;
}

export interface Estado {
  modo: Modo;
  fase: Fase;
  jugadores: Jugador[];
  etapa: number;
  vuelta: number; // vuelta dentro de la etapa (1..vueltas)
  vueltas?: number; // vueltas por etapa (3 o 4): lo elige el guía antes de empezar
  turno: string | null; // a quién le toca (saca la carta en modo turnos)
  cartaId: string | null; // carta de etapa en juego
  cierre: number | null; // índice de carta de cierre en juego
  comodin: Comodin | null; // comodín de la carta en juego
  responde: string | null; // quién responde cuando la carta es un regalo (si es null, responde el del turno)
  paso: boolean; // la persona eligió pasar esta carta
  dorso: number; // diseño del dorso de las cartas (lo elige el anfitrión, lo ven todos)
  mazo: string[]; // orden mezclado de todas las cartas (se arma al empezar)
  usadas: string[];
  cierresUsados: number[];
  respondieron: string[]; // modo turnos: quiénes ya tuvieron su carta en esta vuelta
  cartasEtapa: number; // cartas sacadas en esta etapa
  comodinesEtapa: number; // comodines que salieron en esta etapa
  comodinEn: number; // en qué carta de la etapa sale el comodín asegurado
  rev: number; // cambia en cada carta nueva (para animar)
  anterior?: Paso | null; // cómo estaba la mesa antes del último toque (para "Volver atrás")
}

/** Foto de la mesa antes de sacar, guardar, pasar o regalar una carta. Solo se guarda un paso. */
export type Paso = Omit<Estado, "anterior">;

export type Accion =
  | { a: "empezar" }
  | { a: "sacar" }
  | { a: "listo" }
  | { a: "paso" }
  | { a: "elegir"; id: string }
  | { a: "regalar"; id: string }
  | { a: "etapa"; n: number }
  | { a: "cierre" }
  | { a: "terminar" }
  | { a: "modo"; m: Modo }
  | { a: "vueltas"; n: number } // vueltas por etapa (solo antes de empezar)
  | { a: "dorso"; n: number }
  | { a: "nombre"; n: string } // cada jugador puede cambiar su propio nombre
  | { a: "atras" } // deshace el último sacar / guardar / pasar / regalar (por si se tocó sin querer)
  | { a: "reiniciar" };

export const MAX_NOMBRE = 30;

/** Dorsos disponibles (ver components/Dorsos.tsx); el inicial es la Baraja clásica */
export const CANT_DORSOS = 5;
export const DORSO_INICIAL = 3;

/** número al azar en [0, n) usando el generador criptográfico del navegador */
const alAzar = (n: number) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
const azar = <T,>(xs: T[]): T => xs[alAzar(xs.length)];

/** Mezcla (Fisher–Yates) */
export function mezclar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = alAzar(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Campos que se reinician al empezar una etapa. El comodín asegurado cae en la primera mitad de la etapa. */
function inicioDeEtapa(e: Estado, etapa: number): Partial<Estado> {
  const cartasMin = Math.max(1, e.jugadores.length) * vueltasDe(e);
  return {
    etapa,
    vuelta: 1,
    respondieron: [],
    cartaId: null,
    cierre: null,
    comodin: null,
    responde: null,
    paso: false,
    cartasEtapa: 0,
    comodinesEtapa: 0,
    comodinEn: alAzar(Math.max(1, Math.ceil(cartasMin / 2))),
  };
}

export const estadoInicial = (modo: Modo, anfitrion: Jugador): Estado => ({
  modo,
  fase: "espera",
  jugadores: [anfitrion],
  etapa: 0,
  vuelta: 1,
  turno: null,
  cartaId: null,
  cierre: null,
  comodin: null,
  responde: null,
  paso: false,
  dorso: DORSO_INICIAL,
  mazo: [],
  usadas: [],
  cierresUsados: [],
  respondieron: [],
  cartasEtapa: 0,
  comodinesEtapa: 0,
  comodinEn: 0,
  rev: 0,
});

/** Vecino en el orden de la mesa (el orden de los videos): +1 derecha, -1 izquierda */
export function vecino(e: Estado, id: string | null, lado: 1 | -1): string | null {
  const orden = e.jugadores.map((j) => j.id);
  if (!id || orden.length < 2) return null;
  const i = orden.indexOf(id);
  return orden[(i + lado + orden.length) % orden.length];
}

function sacarCarta(e: Estado): Estado {
  const limpio = { comodin: null, responde: null, paso: false, rev: e.rev + 1 };
  if (e.fase === "cierre") {
    let libres = CIERRES.map((_, i) => i).filter((i) => !e.cierresUsados.includes(i));
    const usados = libres.length ? e.cierresUsados : [];
    if (!libres.length) libres = CIERRES.map((_, i) => i);
    const i = azar(libres);
    return { ...e, ...limpio, cierre: i, cartaId: null, cierresUsados: [...usados, i] };
  }
  // el mazo se mezcla al empezar: se toma la próxima carta de esta etapa que no salió
  const deEtapa = (id: string) => CARTAS.find((c) => c.id === id)?.etapa === e.etapa;
  let mazo = e.mazo.length ? e.mazo : mezclar(CARTAS.map((c) => c.id));
  let usadas = e.usadas;
  let id = mazo.find((x) => deEtapa(x) && !usadas.includes(x));
  if (!id) {
    // se terminaron las de esta etapa: se vuelven a mezclar solo esas
    usadas = usadas.filter((x) => !deEtapa(x));
    mazo = [...mazo.filter((x) => !deEtapa(x)), ...mezclar(mazo.filter(deEtapa))];
    id = mazo.find(deEtapa)!;
  }

  // comodines: son cartas marcadas. Si todavía no salió ninguno en esta etapa y llegó el momento
  // asegurado, se toma la próxima carta marcada del mazo (hacen falta 2 o más jugadores).
  if (e.jugadores.length >= 2 && e.comodinesEtapa === 0 && e.cartasEtapa >= e.comodinEn && !cartaDe(id)?.comodin) {
    const marcada = mazo.find((x) => deEtapa(x) && !usadas.includes(x) && cartaDe(x)?.comodin);
    if (marcada) id = marcada;
  }
  const comodin: Comodin | null = e.jugadores.length >= 2 ? cartaDe(id)?.comodin ?? null : null;
  const responde = comodin === "derecha" ? vecino(e, e.turno, 1) : comodin === "izquierda" ? vecino(e, e.turno, -1) : null;

  return {
    ...e,
    ...limpio,
    mazo,
    cartaId: id,
    cierre: null,
    usadas: [...usadas, id],
    comodin,
    responde,
    cartasEtapa: e.cartasEtapa + 1,
    comodinesEtapa: e.comodinesEtapa + (comodin ? 1 : 0),
  };
}

/** Modo turnos: pasa al siguiente que todavía no tuvo carta en esta vuelta;
 *  al completar la vuelta sigue la próxima, y después de la última vuelta avanza la etapa. */
function siguienteTurno(e: Estado): Estado {
  const respondieron = e.turno && !e.respondieron.includes(e.turno) ? [...e.respondieron, e.turno] : e.respondieron;
  const orden = e.jugadores.map((j) => j.id);
  const desde = e.turno ? orden.indexOf(e.turno) : -1;
  const pendientes = [...orden.slice(desde + 1), ...orden.slice(0, desde + 1)].filter((id) => !respondieron.includes(id));
  const limpio = { ...e, cartaId: null, cierre: null, comodin: null, responde: null, paso: false };
  if (pendientes.length) return { ...limpio, turno: pendientes[0], respondieron };
  // vuelta completa
  const proximo = orden[(desde + 1) % orden.length] ?? null;
  if (e.fase === "cierre") return { ...limpio, fase: "fin", turno: null, respondieron: [] };
  if (e.vuelta < vueltasDe(e)) return { ...limpio, vuelta: e.vuelta + 1, turno: proximo, respondieron: [] };
  if (e.etapa < ETAPAS.length - 1) return { ...limpio, ...inicioDeEtapa(e, e.etapa + 1), turno: proximo };
  return { ...limpio, fase: "cierre", turno: proximo, respondieron: [] };
}

/** Acciones que se pueden deshacer con "Volver atrás" */
const DESHACIBLES: Accion["a"][] = ["sacar", "listo", "paso", "regalar"];
/** Acciones que no cambian el recorrido: no borran el paso guardado */
const NEUTRAS: Accion["a"][] = ["nombre", "dorso", "vueltas"];

/** ¿Esta persona puede volver atrás? El guía siempre; en modo turnos, también quien tenía o tiene el turno. */
export function puedeVolver(e: Estado, quien: string): boolean {
  const a = e.anterior;
  if (!a || (e.fase !== "juego" && e.fase !== "cierre")) return false;
  if (e.jugadores.find((j) => j.id === quien)?.anfitrion) return true;
  return e.modo === "turnos" && (a.turno === quien || e.turno === quien);
}

function volverAtras(e: Estado, quien: string): Estado {
  const a = e.anterior;
  if (!a || !puedeVolver(e, quien)) return e;
  // se vuelve a la foto anterior, pero con la gente, el dorso y el modo de ahora
  const ids = new Set(e.jugadores.map((j) => j.id));
  const vivo = (id: string | null) => (id && ids.has(id) ? id : null);
  return {
    ...a,
    jugadores: e.jugadores,
    dorso: e.dorso,
    modo: e.modo,
    turno: vivo(a.turno),
    responde: vivo(a.responde),
    respondieron: a.respondieron.filter((id) => ids.has(id)),
    rev: e.rev + 1,
    anterior: null,
  };
}

export function aplicar(e: Estado, quien: string, ac: Accion): Estado {
  if (ac.a === "atras") return volverAtras(e, quien);
  const n = aplicarAccion(e, quien, ac);
  if (n === e || NEUTRAS.includes(ac.a)) return n;
  if (DESHACIBLES.includes(ac.a)) {
    const { anterior: _, ...foto } = e;
    return { ...n, anterior: foto };
  }
  return { ...n, anterior: null };
}

function aplicarAccion(e: Estado, quien: string, ac: Accion): Estado {
  const esAnfitrion = e.jugadores.find((j) => j.id === quien)?.anfitrion ?? false;
  const esSuTurno = e.turno === quien;
  const enJuego = e.fase === "juego" || e.fase === "cierre";
  const hayCarta = e.cartaId !== null || e.cierre !== null;

  switch (ac.a) {
    case "empezar":
      if (!esAnfitrion || e.fase !== "espera") return e;
      // mazo nuevo y mezclado en cada inicio de juego
      return {
        ...e,
        ...inicioDeEtapa(e, 0),
        fase: "juego",
        turno: e.jugadores[0]?.id ?? null,
        mazo: mezclar(CARTAS.map((c) => c.id)),
        usadas: [],
        cierresUsados: [],
      };

    case "sacar":
      if (!enJuego || (hayCarta && e.modo === "turnos")) return e;
      if (e.modo === "facilitador" ? !esAnfitrion : !esSuTurno) return e;
      return sacarCarta(e);

    case "listo":
      if (!enJuego) return e;
      if (e.modo === "turnos") return esSuTurno || esAnfitrion || (e.responde !== null && e.responde === quien) ? siguienteTurno(e) : e;
      if (!esAnfitrion) return e;
      {
        // con guía: al guardar la carta, el turno pasa a la siguiente persona (el guía puede elegir otra)
        const orden = e.jugadores.map((j) => j.id);
        const i = e.turno ? orden.indexOf(e.turno) : -1;
        const siguiente = orden.length ? orden[(i + 1) % orden.length] : null;
        const nuevaVuelta = orden.length > 0 && i >= 0 && i + 1 >= orden.length && e.fase === "juego";
        return {
          ...e,
          cartaId: null,
          cierre: null,
          comodin: null,
          responde: null,
          paso: false,
          turno: siguiente,
          vuelta: nuevaVuelta ? e.vuelta + 1 : e.vuelta,
        };
      }

    case "paso":
      if (!PERMITIR_PASO || !enJuego || !esSuTurno) return e;
      if (e.modo === "turnos") return siguienteTurno(e);
      return { ...e, paso: true };

    case "elegir":
      if (!esAnfitrion || e.modo !== "facilitador" || !e.jugadores.some((j) => j.id === ac.id)) return e;
      return { ...e, turno: ac.id, paso: false, responde: e.comodin === "derecha" ? vecino(e, ac.id, 1) : e.comodin === "izquierda" ? vecino(e, ac.id, -1) : e.comodin === "elegir" ? null : e.responde };

    case "regalar":
      // comodín "elegir": quien tiene el turno (o el guía) le regala la pregunta a otra persona
      if (!enJuego || e.comodin !== "elegir" || !(esSuTurno || esAnfitrion)) return e;
      if (ac.id === e.turno || !e.jugadores.some((j) => j.id === ac.id)) return e;
      return { ...e, responde: ac.id };

    case "etapa":
      if (!esAnfitrion || !enJuego || ac.n < 0 || ac.n >= ETAPAS.length) return e;
      return { ...e, ...inicioDeEtapa(e, ac.n), fase: "juego" };

    case "cierre":
      if (!esAnfitrion || !enJuego) return e;
      return {
        ...e,
        fase: "cierre",
        cartaId: null,
        cierre: null,
        comodin: null,
        responde: null,
        paso: false,
        respondieron: [],
        turno: e.modo === "turnos" ? e.jugadores[0]?.id ?? null : e.turno,
      };

    case "modo":
      // se puede cambiar en cualquier momento sin cortar el juego
      if (!esAnfitrion || e.modo === ac.m || (ac.m !== "facilitador" && ac.m !== "turnos")) return e;
      if (ac.m === "turnos" && enJuego) {
        // sigue quien estaba elegido (o el primero); la vuelta arranca de nuevo
        return { ...e, modo: ac.m, turno: e.turno ?? e.jugadores[0]?.id ?? null, respondieron: [], paso: false };
      }
      return { ...e, modo: ac.m };

    case "vueltas":
      if (!esAnfitrion || e.fase !== "espera" || !(OPCIONES_VUELTAS as readonly number[]).includes(ac.n)) return e;
      return { ...e, vueltas: ac.n };

    case "dorso":
      if (!esAnfitrion || !Number.isInteger(ac.n) || ac.n < 0 || ac.n >= CANT_DORSOS) return e;
      return { ...e, dorso: ac.n };

    case "nombre": {
      // solo el propio nombre, en cualquier momento de la partida
      const n = String(ac.n ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_NOMBRE);
      const yo = e.jugadores.find((j) => j.id === quien);
      if (!n || !yo || yo.nombre === n) return e;
      return { ...e, jugadores: e.jugadores.map((j) => (j.id === quien ? { ...j, nombre: n } : j)) };
    }

    case "reiniciar":
      // otra partida con la misma gente: vuelve a la sala de espera (se mezcla al empezar)
      if (!esAnfitrion) return e;
      return { ...e, ...inicioDeEtapa(e, 0), fase: "espera", turno: null };

    case "terminar":
      if (!esAnfitrion) return e;
      return { ...e, fase: "fin", cartaId: null, cierre: null, comodin: null, responde: null, turno: null };
  }
  return e;
}

export function sumarJugador(e: Estado, j: Jugador): Estado | null {
  if (e.jugadores.some((x) => x.id === j.id)) return e;
  if (e.jugadores.length >= MAX_JUGADORES) return null;
  return { ...e, jugadores: [...e.jugadores, j] };
}

export function quitarJugador(e: Estado, id: string): Estado {
  if (!e.jugadores.some((j) => j.id === id)) return e;
  let n: Estado = e;
  if (e.turno === id && (e.fase === "juego" || e.fase === "cierre")) {
    n = e.modo === "turnos" ? siguienteTurno({ ...e, respondieron: e.respondieron.filter((x) => x !== id) }) : { ...e, turno: null };
  }
  if (n.responde === id) n = { ...n, responde: null };
  return { ...n, jugadores: n.jugadores.filter((j) => j.id !== id), respondieron: n.respondieron.filter((x) => x !== id) };
}
