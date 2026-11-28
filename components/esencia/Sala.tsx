"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { BotonTutorial } from "./Tutorial";
import { registrarEsencia } from "@/lib/esencia/contador";
import { CARTAS, CIERRES, ETAPAS, FRASE, MAX_JUGADORES, PERMITIR_PASO, TIPOS } from "@/lib/esencia/cartas";
import { DORSO_INICIAL, MAX_NOMBRE, VUELTAS_POR_ETAPA, puedeVolver, type Comodin, type Estado, type Jugador } from "@/lib/esencia/juego";
import { guardarNombre, leerAnfitrion, leerNombre } from "@/lib/esencia/local";
import { conectar, useSala } from "@/lib/esencia/red";
import { DORSOS } from "./Dorsos";


const LUZ_CIERRE = "#e9d8b8";

export default function Sala({ codigo }: { codigo: string }) {
  const [anf] = useState(() => leerAnfitrion(codigo));
  const [nombre, setNombre] = useState<string | null>(anf?.nombre ?? null);
  const [local, setLocal] = useState<MediaStream | null | undefined>(undefined); // undefined = pidiendo

  // cámara y micrófono (baja resolución: con 6 personas cada uno manda 5 videos)
  useEffect(() => {
    let s: MediaStream | null = null;
    let cancelado = false;
    const pedir = navigator.mediaDevices?.getUserMedia({
      video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    if (!pedir) {
      setLocal(null);
      return;
    }
    pedir
      .then((st) => {
        if (cancelado) return st.getTracks().forEach((t) => t.stop());
        s = st;
        setLocal(st);
      })
      .catch(() => !cancelado && setLocal(null));
    return () => {
      cancelado = true;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // conexión a la mesa
  useEffect(() => {
    if (!nombre || local === undefined || codigo.length < 4) return;
    let cortar: (() => void) | undefined;
    let vivo = true;
    conectar({ codigo, nombre, anfitrion: !!anf, modo: anf?.modo ?? "facilitador", local }).then((f) => {
      if (vivo) cortar = f;
      else f();
    });
    return () => {
      vivo = false;
      cortar?.();
    };
  }, [nombre, local, codigo, anf]);

  if (codigo.length < 4) {
    return (
      <div className="centro">
        <div className="lobby">
          <p>Este código de mesa no es válido.</p>
          <Link className="btn" href="/esencia">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!nombre) return <Antesala local={local} onEntrar={(n) => { guardarNombre(n); setNombre(n); }} />;
  return <Mesa codigo={codigo} />;
}

/* ------------------------------------------------------------------ */

function Antesala({ local, onEntrar }: { local: MediaStream | null | undefined; onEntrar: (n: string) => void }) {
  // en Sentir ya sabemos quién es: se usa su nombre de Sentir y no se le pregunta
  const { nombre: nombreSentir } = useUser();
  const [n, setN] = useState(leerNombre);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (nombreSentir) setN(nombreSentir);
  }, [nombreSentir]);
  return (
    <div className="centro">
      <form
        className="antesala"
        onSubmit={(e) => {
          e.preventDefault();
          if (n.trim()) onEntrar(n.trim().slice(0, 30));
        }}
      >
        <span className="marca" style={{ justifySelf: "center" }}>
          <span className="chispa" /> Nuestra Esencia
        </span>
        <div className="vista-previa">
          {local && <Video stream={local} espejo silencio />}
          {!local && (
            <div className="aviso">{local === undefined ? "Activando tu cámara…" : "No pudimos acceder a tu cámara. Revisá los permisos del navegador; igual podés entrar."}</div>
          )}
        </div>
        <p className="frase" style={{ textAlign: "center", margin: 0 }}>«{FRASE}»</p>
        {nombreSentir ? (
          <p style={{ textAlign: "center", margin: 0 }}>
            ¡Hola, <b>{nombreSentir}</b>! Te damos la bienvenida a la mesa.
          </p>
        ) : (
          <label className="campo">
            <span>¿Cómo te llamás?</span>
            <input className="texto" value={n} onChange={(e) => setN(e.target.value)} placeholder="Tu nombre" maxLength={30} autoFocus />
          </label>
        )}
        <button className="btn primario ancho" disabled={!n.trim()}>Entrar a la mesa</button>
        <div style={{ textAlign: "center", marginTop: -10 }}>
          <BotonTutorial />
        </div>
        <p className="muted small" style={{ textAlign: "center", margin: 0 }}>
          {PERMITIR_PASO
            ? "Nadie está obligado a responder. Se puede pasar, guardar silencio o simplemente escuchar."
            : "Tomate tu tiempo. Cada respuesta vale, desde donde estés hoy."}
        </p>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Mesa({ codigo }: { codigo: string }) {
  const { estado, conexion, detalle, miId } = useSala();

  if (!estado || !miId) {
    const textos: Record<string, string> = {
      conectando: "Conectando con la mesa…",
      "esperando-anfitrion": "Esperando que quien te invitó abra la mesa…",
      conectado: "Conectando con la mesa…",
      llena: `Esta mesa ya está completa (${MAX_JUGADORES} personas).`,
      "sala-abierta": "Esta mesa ya está abierta en otra pestaña o dispositivo.",
      expulsado: "El guía cerró tu sesión, por ejemplo porque se había trabado. Podés volver a entrar.",
      cerrada: "El guía terminó el encuentro. Gracias por animarte a jugar.",
      error: detalle ?? "Hubo un problema de conexión.",
    };
    const final = conexion === "llena" || conexion === "sala-abierta" || conexion === "cerrada";
    return (
      <div className="centro">
        <div className="lobby">
          <span className="marca" style={{ justifySelf: "center" }}>
            <span className="chispa" /> Nuestra Esencia
          </span>
          <p className="muted">{textos[conexion]}</p>
          {final && <Link className="btn" href="/esencia">Volver al inicio</Link>}
          {conexion === "expulsado" && (
            <button className="btn primario" onClick={() => window.location.reload()}>Volver a entrar</button>
          )}
        </div>
      </div>
    );
  }

  const yo = estado.jugadores.find((j) => j.id === miId);
  const soyAnfitrion = !!yo?.anfitrion;
  const luz = estado.fase === "cierre" || estado.fase === "fin" ? LUZ_CIERRE : ETAPAS[estado.etapa].color;

  return (
    <div className="sala" style={{ "--luz": luz } as React.CSSProperties}>
      <Barra codigo={codigo} estado={estado} soyAnfitrion={soyAnfitrion} />
      {/* al terminar las cartas todos siguen conectados y viéndose, hasta que el guía sale */}
      <div className="cuerpo">
        <div className="mesa">
          {estado.fase === "fin" ? (
            <Fin estado={estado} soyAnfitrion={soyAnfitrion} />
          ) : estado.fase === "espera" ? (
            <Espera codigo={codigo} estado={estado} soyAnfitrion={soyAnfitrion} />
          ) : (
            <Juego estado={estado} miId={miId} soyAnfitrion={soyAnfitrion} />
          )}
        </div>
        <Videos estado={estado} miId={miId} />
      </div>
    </div>
  );
}

function Barra({ codigo, estado, soyAnfitrion }: { codigo: string; estado: Estado; soyAnfitrion: boolean }) {
  const { conexion } = useSala();
  return (
    <header className="barra">
      <span className="marca">
        <span className="chispa" /> Nuestra Esencia
      </span>
      {estado.fase !== "espera" && estado.fase !== "fin" && (
        <div className="recorrido" aria-label="Etapas">
          {ETAPAS.map((e, i) => (
            <i key={e.nombre} title={e.nombre} style={{ background: estado.fase === "cierre" || i <= estado.etapa ? e.color : undefined, opacity: i === estado.etapa && estado.fase === "juego" ? 1 : 0.55 }} />
          ))}
        </div>
      )}
      <span className="espacio" />
      {conexion !== "conectado" && <span className="estado-red">Reconectando…</span>}
      {soyAnfitrion && estado.fase !== "fin" && estado.fase !== "espera" && (
        <span className="solo-escritorio">
          <Invitar codigo={codigo} chico />
        </span>
      )}
      {soyAnfitrion && estado.fase !== "fin" && estado.fase !== "espera" && (
        <span className="solo-celular">
          <Compartir codigo={codigo} />
        </span>
      )}
      <span className="codigo">{codigo}</span>
      <Link className="btn chico" href="/esencia">Salir</Link>
    </header>
  );
}

/** En el celular: abre el menú de compartir del teléfono (WhatsApp, mensajes, etc.) */
function Compartir({ codigo, grande }: { codigo: string; grande?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const url = `${window.location.origin}/esencia/sala/${codigo}`;
  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Nuestra Esencia", text: "Te invito a jugar a Nuestra Esencia.", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {}
  };
  return (
    <button className={`btn ${grande ? "ancho" : "chico"}`} onClick={compartir}>
      {copiado ? "¡Link copiado!" : "Invitar"}
    </button>
  );
}

function Invitar({ codigo, chico }: { codigo: string; chico?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const url = `${window.location.origin}/esencia/sala/${codigo}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`Te invito a jugar a Nuestra Esencia.\nEntrá desde acá: ${url}`)}`;
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {}
  };
  return (
    <>
      <button className={`btn ${chico ? "chico" : ""}`} onClick={copiar}>{copiado ? "¡Link copiado!" : "Copiar invitación"}</button>
      <a className={`btn ${chico ? "chico" : ""}`} href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
    </>
  );
}

/* ---------------- espera ---------------- */

function Espera({ codigo, estado, soyAnfitrion }: { codigo: string; estado: Estado; soyAnfitrion: boolean }) {
  const enviar = useSala((s) => s.enviar);
  const miId = useSala((s) => s.miId);
  const anfitrion = estado.jugadores.find((j) => j.anfitrion);
  const { email: emailSentir } = useUser(); // para el contador de juegos realizados
  return (
    <div className="lobby">
      <div className="etapa-titulo">
        <span className="eyebrow">{estado.modo === "facilitador" ? "Mesa con guía" : "Mesa por turnos"}</span>
        <h2>Nos vamos reuniendo</h2>
        <p>
          {estado.jugadores.length} de {MAX_JUGADORES} personas en la mesa
        </p>
      </div>
      <div className="chips">
        {estado.jugadores.map((j) =>
          j.id === miId ? (
            <MiNombre key={j.id} nombre={j.nombre} className={`chip ${j.anfitrion ? "anf" : ""}`} />
          ) : (
            <span key={j.id} className={`chip ${j.anfitrion ? "anf" : ""}`}>{j.nombre}</span>
          ),
        )}
      </div>
      {soyAnfitrion ? (
        <>
          <p className="muted small" style={{ margin: 0 }}>
            Compartí el link de la mesa con quienes van a jugar. Solo se puede entrar con ese link.
          </p>
          <ModoSelector estado={estado} />
          <div className="fila solo-escritorio">
            <Invitar codigo={codigo} />
          </div>
          <div className="solo-celular">
            <Compartir codigo={codigo} grande />
          </div>
          <button className="btn primario" onClick={() => { enviar({ a: "empezar" }); registrarEsencia("juego", emailSentir); }}>
            {estado.jugadores.length < 2 ? "Empezar igual" : "Empezar el juego"}
          </button>
        </>
      ) : (
        <p className="muted">Cuando {anfitrion?.nombre ?? "quien abrió la mesa"} lo decida, empezamos.</p>
      )}
      <p className="frase" style={{ margin: 0 }}>«{FRASE}»</p>
    </div>
  );
}

/* ---------------- juego ---------------- */

const TEXTO_COMODIN: Record<Comodin, string> = {
  elegir: "★ Comodín · Regalala a quien elijas",
  todos: "★ Comodín · Pregunta para todos",
  derecha: "★ Regalo para tu derecha",
  izquierda: "★ Regalo para tu izquierda",
};

function Juego({ estado, miId, soyAnfitrion }: { estado: Estado; miId: string; soyAnfitrion: boolean }) {
  const enviar = useSala((s) => s.enviar);
  const cierre = estado.fase === "cierre";
  const carta = estado.cartaId ? CARTAS.find((c) => c.id === estado.cartaId) : null;
  const textoCierre = estado.cierre !== null ? CIERRES[estado.cierre] : null;
  const hayCarta = !!carta || !!textoCierre;
  const quien = estado.jugadores.find((j) => j.id === estado.turno);
  const esMiTurno = estado.turno === miId;
  const guia = estado.modo === "facilitador";
  const etapa = ETAPAS[estado.etapa];
  const nombreDe = (id: string | null) => estado.jugadores.find((j) => j.id === id)?.nombre;
  const responde = estado.responde ? estado.jugadores.find((j) => j.id === estado.responde) : null;
  const comodin = hayCarta ? estado.comodin : null;
  const eligiendo = comodin === "elegir" && !responde; // falta elegir a quién se le regala
  const puedoRegalar = eligiendo && (esMiTurno || soyAnfitrion);
  const vueltaTxt =
    estado.vuelta <= VUELTAS_POR_ETAPA ? `Vuelta ${estado.vuelta} de ${VUELTAS_POR_ETAPA}` : `Vuelta ${estado.vuelta}`;

  return (
    <>
      <div className="etapa-titulo">
        <span className="eyebrow">{cierre ? "Cierre" : `Etapa ${estado.etapa + 1} de ${ETAPAS.length} · ${vueltaTxt}`}</span>
        <h2>{cierre ? "Despedirnos con cuidado" : etapa.nombre}</h2>
        <p>{cierre ? "Una última carta para cada persona, antes de volver." : etapa.bajada}</p>
      </div>

      {soyAnfitrion && (
        <button
          className="btn chico cambiar-dorso"
          onClick={() => enviar({ a: "dorso", n: (estado.dorso + 1) % DORSOS.length })}
          title="Cambia el dorso de las cartas para toda la mesa"
        >
          Cambiar dorso · {DORSOS[estado.dorso]?.nombre}
        </button>
      )}

      <Carta
        dorso={estado.dorso}
        rev={estado.rev}
        visible={hayCarta}
        tipo={carta ? `${TIPOS[carta.tipo].signo}  ${TIPOS[carta.tipo].nombre}` : textoCierre ? "Cierre" : ""}
        etiqueta={carta ? etapa.nombre : ""}
        texto={carta?.texto ?? textoCierre ?? ""}
        cinta={comodin ? TEXTO_COMODIN[comodin] : ""}
      />

      <div className="turno">
        {comodin === "todos" ? (
          <span className="comodin-aviso">★ Esta pregunta la responden <b>todos</b>, uno por uno</span>
        ) : eligiendo ? (
          <div className="regalar">
            <span className="comodin-aviso">
              {esMiTurno ? "★ ¿A quién le regalás esta pregunta?" : `★ ${quien?.nombre ?? "Quien tiene el turno"} está eligiendo a quién regalarle la pregunta…`}
            </span>
            {puedoRegalar && (
              <div className="fila">
                {estado.jugadores
                  .filter((j) => j.id !== estado.turno)
                  .map((j) => (
                    <button key={j.id} className="btn chico" onClick={() => enviar({ a: "regalar", id: j.id })}>
                      {j.id === miId ? `${j.nombre} (vos)` : j.nombre}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ) : responde && comodin ? (
          <span className="comodin-aviso">
            ★ {responde.id === miId ? <>Regalo de {nombreDe(estado.turno)}: <b>respondés vos</b></> : <>Regalo de {nombreDe(estado.turno)} para <b>{responde.nombre}</b></>}
          </span>
        ) : estado.paso && quien ? (
          <span className="paso-aviso">{quien.id === miId ? "Elegiste pasar esta carta." : `${quien.nombre} prefiere pasar esta carta. Está bien.`}</span>
        ) : quien ? (
          esMiTurno ? (
            <>
              <b>Te toca a vos</b>
              {guia && !soyAnfitrion && !hayCarta && <span className="aguarda">(Aguarda que el Guía saque tu Carta)</span>}
            </>
          ) : (
            <>Le toca a <b>{quien.nombre}</b></>
          )
        ) : guia ? (
          <span className="muted">{soyAnfitrion ? "Elegí quién responde." : "Esperando la próxima carta…"}</span>
        ) : null}
      </div>

      <div className="acciones">
        {guia ? (
          <>
            {soyAnfitrion && (
              <button className="btn primario" onClick={() => enviar({ a: "sacar" })}>{hayCarta ? "Otra carta" : "Sacar carta"}</button>
            )}
            {soyAnfitrion && hayCarta && <button className="btn" onClick={() => enviar({ a: "listo" })}>Guardar la carta</button>}
            {PERMITIR_PASO && esMiTurno && hayCarta && !estado.paso && <button className="btn" onClick={() => enviar({ a: "paso" })}>Paso</button>}
          </>
        ) : esMiTurno || (hayCarta && responde?.id === miId) ? (
          hayCarta ? (
            eligiendo ? null : (
              <>
                <button className="btn primario" onClick={() => enviar({ a: "listo" })}>Listo, sigue otra persona</button>
                {PERMITIR_PASO && esMiTurno && <button className="btn" onClick={() => enviar({ a: "paso" })}>Paso</button>}
              </>
            )
          ) : (
            <button className="btn primario" onClick={() => enviar({ a: "sacar" })}>Sacar mi carta</button>
          )
        ) : null}
        {puedeVolver(estado, miId) && (
          <button className="btn chico" onClick={() => enviar({ a: "atras" })} title="Deshace el último paso, por si se tocó sin querer">
            ↶ Volver atrás
          </button>
        )}
      </div>

      {soyAnfitrion ? <Control estado={estado} /> : <Recorrido estado={estado} />}
    </>
  );
}

/** Para los invitados: el mismo panel que ve el guía (quién responde y etapas), solo para mirar.
 *  No son botones: no se pueden tocar. */
function Recorrido({ estado }: { estado: Estado }) {
  const guia = estado.modo === "facilitador";
  return (
    <div className="control solo-mirar">
      {guia && (
        <>
          <div className="titulo">¿Quién responde?</div>
          <div className="fila">
            {estado.jugadores.map((j) => (
              <span key={j.id} className={`btn chico ${estado.turno === j.id ? "activo" : ""}`}>{j.nombre}</span>
            ))}
          </div>
        </>
      )}
      <div className="titulo">Etapas</div>
      <div className="fila">
        {ETAPAS.map((e, i) => (
          <span key={e.nombre} className={`btn chico ${estado.fase === "juego" && estado.etapa === i ? "activo" : ""}`}>
            {i + 1}. {e.nombre}
          </span>
        ))}
        <span className={`btn chico ${estado.fase === "cierre" ? "activo" : ""}`}>Cierre</span>
      </div>
    </div>
  );
}

/** Cambia entre "Con guía" y "Por turnos" sin cortar el juego (solo anfitrión) */
function ModoSelector({ estado }: { estado: Estado }) {
  const enviar = useSala((s) => s.enviar);
  return (
    <div className="modo-selector" role="group" aria-label="Modo de juego">
      <button className={estado.modo === "facilitador" ? "activo" : ""} onClick={() => enviar({ a: "modo", m: "facilitador" })}>
        Con guía
      </button>
      <button className={estado.modo === "turnos" ? "activo" : ""} onClick={() => enviar({ a: "modo", m: "turnos" })}>
        Por turnos
      </button>
    </div>
  );
}

function Control({ estado }: { estado: Estado }) {
  const enviar = useSala((s) => s.enviar);
  const guia = estado.modo === "facilitador";
  const [confirmarFin, setConfirmarFin] = useState(false);
  return (
    <div className="control">
      {confirmarFin && (
        <Confirmar
          titulo="Terminar el juego"
          aceptar="Aceptar"
          onAceptar={() => { enviar({ a: "terminar" }); setConfirmarFin(false); }}
          onCancelar={() => setConfirmarFin(false)}
        >
          ¿Confirmás que querés <b>terminar el juego para todos</b>?<br />
          Toda la mesa pasa a la pantalla final.
        </Confirmar>
      )}
      <div className="titulo">¿Cómo seguimos jugando?</div>
      <ModoSelector estado={estado} />
      {guia && estado.fase === "juego" && (
        <p className="muted small" style={{ textAlign: "center", margin: 0 }}>
          {estado.vuelta > VUELTAS_POR_ETAPA
            ? `Ya completaron las ${VUELTAS_POR_ETAPA} vueltas de esta etapa: cuando quieras, pasá a la siguiente.`
            : `Vuelta ${estado.vuelta} de ${VUELTAS_POR_ETAPA}: mínimo ${VUELTAS_POR_ETAPA} cartas por persona en cada etapa.`}
        </p>
      )}
      {guia && (
        <>
          <div className="titulo">¿Quién responde?</div>
          <div className="fila">
            {estado.jugadores.map((j: Jugador) => (
              <button key={j.id} className={`btn chico ${estado.turno === j.id ? "activo" : ""}`} onClick={() => enviar({ a: "elegir", id: j.id })}>
                {j.nombre}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="titulo">{guia ? "Etapas" : "Como anfitrión podés mover las etapas"}</div>
      <div className="fila">
        {ETAPAS.map((e, i) => (
          <button
            key={e.nombre}
            className={`btn chico ${estado.fase === "juego" && estado.etapa === i ? "activo" : ""}`}
            onClick={() => enviar({ a: "etapa", n: i })}
          >
            {i + 1}. {e.nombre}
          </button>
        ))}
        <button className={`btn chico ${estado.fase === "cierre" ? "activo" : ""}`} onClick={() => enviar({ a: "cierre" })}>Cierre</button>
        <button className="btn chico" onClick={() => setConfirmarFin(true)}>Terminar</button>
      </div>
    </div>
  );
}

function Carta({ rev, visible, tipo, etiqueta, texto, dorso, cinta }: { rev: number; visible: boolean; tipo: string; etiqueta: string; texto: string; dorso: number; cinta: string }) {
  // cada carta nueva: se muestra el dorso y se da vuelta
  const [vuelta, setVuelta] = useState(false);
  const [mostrado, setMostrado] = useState({ tipo, etiqueta, texto, cinta });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVuelta(false);
    if (!visible) return;
    const t = setTimeout(() => {
      setMostrado({ tipo, etiqueta, texto, cinta });
      setVuelta(true);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, visible]);

  const { Dibujo } = DORSOS[dorso] ?? DORSOS[DORSO_INICIAL];

  return (
    <div className="carta-lugar">
      <div className={`carta ${vuelta ? "vuelta" : ""}`}>
        <div className="cara dorso">
          <Dibujo />
        </div>
        <div className="cara frente">
          <div className="tipo">
            <span>{mostrado.tipo}</span>
            <span>{mostrado.etiqueta}</span>
          </div>
          <div className="pregunta">{mostrado.texto}</div>
          <div className={`cinta ${mostrado.cinta ? "" : "vacia"}`}>{mostrado.cinta}</div>
          <div className="pie">{PERMITIR_PASO ? "Podés responder, pasar o simplemente escuchar." : "Respondé desde donde estés hoy."}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- videos ---------------- */

function Videos({ estado, miId }: { estado: Estado; miId: string }) {
  const { local, remotos, expulsar, cambiarCamara } = useSala();
  const [probando, setProbando] = useState(false);
  const [fallo, setFallo] = useState(false);
  // sin cámara: volver a pedirla sin salir de la mesa
  const reintentarCamara = () => {
    setProbando(true);
    setFallo(false);
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((st) => { cambiarCamara(st); setCam(true); setMic(true); })
      .catch(() => setFallo(true))
      .finally(() => setProbando(false));
  };
  const soyAnfitrion = estado.jugadores.find((j) => j.id === miId)?.anfitrion ?? false;
  const [aCerrar, setACerrar] = useState<Jugador | null>(null); // jugador al que el guía quiere cerrarle la sesión
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const alternar = (tipo: "audio" | "video", on: boolean) => local?.getTracks().filter((t) => t.kind === tipo).forEach((t) => (t.enabled = on));

  return (
    <div className={`videos ${estado.jugadores.length === 1 ? "uno" : ""}`}>
      {estado.jugadores.map((j) => {
        const yo = j.id === miId;
        const s = yo ? (cam ? local : null) : remotos[j.id];
        return (
          <div key={j.id} className={`cuadro ${(estado.responde ?? estado.turno) === j.id && estado.fase !== "espera" ? "habla" : ""}`}>
            <span className="inicial">{j.nombre.slice(0, 1).toUpperCase()}</span>
            {s && <Video stream={s} espejo={yo} silencio={yo} />}
            {yo && !local && (
              <div className="sin-camara" title="Revisá el permiso de la cámara (icono a la izquierda de sentir.fun) y cerrá otros programas que la estén usando.">
                <span>{fallo ? "Sigue sin cámara: revisá el permiso o cerrá otros programas que la usen" : "Sin cámara"}</span>
                <button className="btn chico" onClick={reintentarCamara} disabled={probando}>
                  {probando ? "Probando…" : "Reintentar"}
                </button>
              </div>
            )}
            {yo ? <MiNombre nombre={j.nombre} sufijo=" (vos)" className="nombre" /> : <span className="nombre">{j.nombre}</span>}
            {soyAnfitrion && !yo && (
              <button
                className="cerrar-sesion"
                title={`Cerrar la sesión de ${j.nombre}`}
                onClick={() => setACerrar(j)}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        );
      })}
      {local && (
        <div className="mis-controles">
          <button className={`btn chico ${mic ? "" : "activo"}`} onClick={() => { alternar("audio", !mic); setMic(!mic); }}>
            {mic ? "Silenciar" : "Activar micrófono"}
          </button>
          <button className={`btn chico ${cam ? "" : "activo"}`} onClick={() => { alternar("video", !cam); setCam(!cam); }}>
            {cam ? "Apagar cámara" : "Encender cámara"}
          </button>
        </div>
      )}
      {aCerrar && (
        <Confirmar
          titulo="Cerrar sesión"
          aceptar="Aceptar"
          onAceptar={() => { expulsar(aCerrar.id); setACerrar(null); }}
          onCancelar={() => setACerrar(null)}
        >
          ¿Confirmás que querés cerrar la sesión de <b>{aCerrar.nombre}</b>?<br />
          Va a poder volver a entrar con el mismo link.
        </Confirmar>
      )}
    </div>
  );
}

/** Botón con el nombre propio: al tocarlo, cada jugador puede cambiar cómo aparece en la mesa */
function MiNombre({ nombre, className, sufijo = "" }: { nombre: string; className?: string; sufijo?: string }) {
  const enviar = useSala((s) => s.enviar);
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nombre);
  const campo = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editando) setTimeout(() => campo.current?.select(), 0);
  }, [editando]);
  const listo = valor.replace(/\s+/g, " ").trim();
  const guardar = () => {
    if (!listo) return;
    enviar({ a: "nombre", n: listo.slice(0, MAX_NOMBRE) });
    setEditando(false);
  };
  return (
    <>
      <button
        type="button"
        className={`${className ?? ""} mi-nombre`}
        title="Cambiar mi nombre"
        onClick={() => { setValor(nombre); setEditando(true); }}
      >
        {nombre}{sufijo} <span aria-hidden>✎</span>
      </button>
      {editando && (
        <Confirmar titulo="Tu nombre en la mesa" aceptar="Guardar" onAceptar={guardar} onCancelar={() => setEditando(false)}>
          Escribí cómo querés que te vean los demás.
          <input
            ref={campo}
            className="texto"
            style={{ display: "block", width: "100%", marginTop: 12 }}
            value={valor}
            maxLength={MAX_NOMBRE}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); guardar(); } }}
            aria-label="Tu nombre"
          />
        </Confirmar>
      )}
    </>
  );
}

/** Cartel propio del juego para confirmar una acción (en lugar del aviso gris del navegador) */
function Confirmar({ titulo, aceptar, onAceptar, onCancelar, children }: { titulo: string; aceptar: string; onAceptar: () => void; onCancelar: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onCancelar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onCancelar]);
  // se dibuja directo dentro de .esencia, para que ningún contenedor lo recorte y tome los estilos del juego
  const raiz = typeof document !== "undefined" ? document.querySelector(".esencia") : null;
  const cartel = (
    <div className="confirmar-fondo" onClick={onCancelar}>
      <div className="confirmar" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <span className="chispa" />
        <h3>{titulo}</h3>
        <p>{children}</p>
        <div className="acciones">
          <button className="btn" onClick={onCancelar}>Cancelar</button>
          <button className="btn primario" onClick={onAceptar} autoFocus>{aceptar}</button>
        </div>
      </div>
    </div>
  );
  return raiz ? createPortal(cartel, raiz) : cartel;
}

function Video({ stream, espejo, silencio }: { stream: MediaStream; espejo?: boolean; silencio?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={silencio} className={espejo ? "espejo" : undefined} style={{ position: "relative" }} />;
}

/* ---------------- fin ---------------- */

function Fin({ estado, soyAnfitrion }: { estado: Estado; soyAnfitrion: boolean }) {
  const enviar = useSala((s) => s.enviar);
  const guia = estado.jugadores.find((j) => j.anfitrion);
  return (
    <div className="lobby fin" style={{ paddingTop: 24 }}>
      <span className="chispa" style={{ justifySelf: "center", width: 22, height: 22 }} />
      <h2>Gracias por animarse</h2>
      <p className="frase">«{FRASE}»</p>
      <p className="muted">Lo que se compartió en esta mesa, queda en esta mesa.</p>
      {soyAnfitrion ? (
        <>
          <p className="muted small" style={{ margin: 0 }}>
            Siguen conectados: pueden despedirse con calma. La mesa se cierra cuando tocás «Salir».
          </p>
          <div className="fila">
            <button className="btn primario" onClick={() => enviar({ a: "reiniciar" })}>Jugar de nuevo</button>
          </div>
        </>
      ) : (
        <p className="muted small" style={{ margin: 0 }}>
          Siguen conectados para despedirse. La mesa se cierra cuando {guia?.nombre ?? "el guía"} salga.
        </p>
      )}
    </div>
  );
}
