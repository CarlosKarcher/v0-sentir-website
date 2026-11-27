"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ETAPAS, FRASE, MAX_JUGADORES, PERMITIR_PASO } from "@/lib/esencia/cartas";
import type { Modo } from "@/lib/esencia/juego";
import { guardarAnfitrion, leerNombre, guardarNombre, nuevoCodigo } from "@/lib/esencia/local";
import { useUser } from "@/lib/user-context";
import { BotonTutorial } from "@/components/esencia/Tutorial";
import { leerContadores, registrarEsencia, type ContadoresEsencia } from "@/lib/esencia/contador";

export default function Inicio() {
  const router = useRouter();
  // en Sentir ya sabemos quién es: se usa su nombre de Sentir y no se le pregunta
  const { nombre: nombreSentir, email, esAdmin } = useUser();
  const [nombre, setNombre] = useState("");
  const [modo, setModo] = useState<Modo>("facilitador");
  // contador: solo para administradores de Sentir (la base no se lo devuelve a nadie más)
  const [contadores, setContadores] = useState<ContadoresEsencia | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNombre(nombreSentir || leerNombre());
  }, [nombreSentir]);

  useEffect(() => {
    if (esAdmin && email) leerContadores(email).then(setContadores);
  }, [esAdmin, email]);

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return;
    guardarNombre(n);
    const c = nuevoCodigo();
    guardarAnfitrion(c, { nombre: n, modo });
    registrarEsencia("mesa", email); // contador: una mesa abierta
    router.push(`/esencia/sala/${c}`);
  };

  return (
    <main className="inicio">
      {/* con la bienvenida, la barra pasa a 3 columnas para que el saludo quede justo en el centro */}
      <header style={nombreSentir ? { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12 } : undefined}>
        <span className="marca">
          <span className="chispa" /> Nuestra Esencia
        </span>
        {nombreSentir && (
          <span style={{ textAlign: "center", fontFamily: "var(--f-serif), serif", fontSize: "1.6rem", lineHeight: 1.2 }}>
            ¡Bienvenido/a, <b>{nombreSentir}</b>!
          </span>
        )}
        <span className="muted small" style={nombreSentir ? { justifySelf: "end" } : undefined}>
          2 a {MAX_JUGADORES} personas · a distancia
        </span>
      </header>

      <section className="portada">
        <h1>
          Descubrir <em>nuestra esencia</em>
        </h1>
        <p>Un juego de encuentro: empezamos conociéndonos entre nosotros y terminamos descubriendo algo de nosotros mismos.</p>
        <p className="frase" style={{ marginTop: 18 }}>«{FRASE}»</p>
        <BotonTutorial />
      </section>

      {/* acá solo se abre una mesa (quien la abre es el guía). Los invitados entran únicamente con el link de la mesa */}
      <div className="tarjetas" style={{ maxWidth: 560, marginInline: "auto" }}>
        <form className="panel" onSubmit={crear}>
          <h2>Abrir una mesa</h2>
          {nombreSentir ? (
            <p style={{ margin: 0 }}>
              Si abrís una mesa, vas a ser{" "}
              <b>el guía del juego</b>, y podés elegir iniciar el juego <b>«Con guía»</b> o <b>«Por turnos»</b>. Luego invitás
              a los demás y acompañás su recorrido. ¡Disfrutalo!
            </p>
          ) : (
            <label className="campo">
              <span>Tu nombre</span>
              <input className="texto" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamás?" maxLength={30} />
            </label>
          )}
          <div className="campo">
            <span>¿Cómo quieren jugar?</span>
            <div className="opciones">
              <button type="button" className={`opcion ${modo === "facilitador" ? "activo" : ""}`} onClick={() => setModo("facilitador")}>
                <b>Con guía</b>
                <span>Vos sacás las cartas, elegís quién responde y avanzás las etapas.</span>
              </button>
              <button type="button" className={`opcion ${modo === "turnos" ? "activo" : ""}`} onClick={() => setModo("turnos")}>
                <b>Por turnos</b>
                <span>Cada persona saca su carta cuando le toca. El juego avanza solo.</span>
              </button>
            </div>
          </div>
          <button className="btn primario ancho" disabled={!nombre.trim()}>
            Abrir la mesa
          </button>
        </form>
      </div>

      <div className="etapas-lista">
        {ETAPAS.map((e, i) => (
          <div className="etapa-item" key={e.nombre}>
            <b>
              <span className="punto" style={{ background: e.color }} />
              {i + 1}. {e.nombre}
            </b>
            <p>{e.bajada}</p>
          </div>
        ))}
      </div>

      <p className="regla">
        {PERMITIR_PASO
          ? "Nadie está obligado a responder. Se puede pasar una carta, guardar silencio o simplemente escuchar."
          : "Cada respuesta vale. Tomate tu tiempo y respondé desde donde estés hoy."}
      </p>
      <p className="muted small" style={{ textAlign: "right", margin: "28px 0 0" }}>Realizado por Carlos Karcher.</p>
      {/* solo administradores: ingresos al juego · mesas abiertas · juegos realizados (al pasar el mouse se ve qué es cada uno) */}
      {esAdmin && contadores && (
        <p
          className="small"
          title={`Ingresos al juego: ${contadores.ingresos} · Mesas abiertas: ${contadores.mesas} · Juegos realizados: ${contadores.juegos}`}
          style={{ textAlign: "center", margin: "18px 0 0", color: "var(--soft)", letterSpacing: "0.08em" }}
        >
          {contadores.ingresos} · {contadores.mesas} · {contadores.juegos}
        </p>
      )}
    </main>
  );
}
