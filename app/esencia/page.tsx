"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ETAPAS, FRASE, MAX_JUGADORES, PERMITIR_PASO } from "@/lib/esencia/cartas";
import type { Modo } from "@/lib/esencia/juego";
import { guardarAnfitrion, leerNombre, guardarNombre, nuevoCodigo } from "@/lib/esencia/local";
import { useUser } from "@/lib/user-context";

export default function Inicio() {
  const router = useRouter();
  // en Sentir ya sabemos quién es: se usa su nombre de Sentir y no se le pregunta
  const { nombre: nombreSentir } = useUser();
  const [nombre, setNombre] = useState("");
  const [modo, setModo] = useState<Modo>("facilitador");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNombre(nombreSentir || leerNombre());
  }, [nombreSentir]);

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) return;
    guardarNombre(n);
    const c = nuevoCodigo();
    guardarAnfitrion(c, { nombre: n, modo });
    router.push(`/esencia/sala/${c}`);
  };

  const unirse = (e: React.FormEvent) => {
    e.preventDefault();
    const c = codigo.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (c.length >= 4) router.push(`/esencia/sala/${c}`);
  };

  return (
    <main className="inicio">
      {/* con la bienvenida, la barra pasa a 3 columnas para que el saludo quede justo en el centro */}
      <header style={nombreSentir ? { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12 } : undefined}>
        <span className="marca">
          <span className="chispa" /> Nuestra Esencia
        </span>
        {nombreSentir && (
          <span style={{ textAlign: "center" }}>
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
      </section>

      <div className="tarjetas">
        <form className="panel" onSubmit={crear}>
          <h2>Abrir una mesa</h2>
          {nombreSentir ? (
            <p style={{ margin: 0 }}>
              ¡Hola, <b>{nombreSentir}</b>! Te damos la bienvenida a Nuestra Esencia. Si abrís una mesa, vas a ser{" "}
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

        <form className="panel" onSubmit={unirse}>
          <h2>Tengo un código</h2>
          <p className="muted" style={{ margin: 0 }}>
            Si te invitaron, entrá con el link que te mandaron o escribí el código de la mesa.
          </p>
          <label className="campo">
            <span>Código</span>
            <input
              className="texto"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: K7MQ2P"
              maxLength={8}
              style={{ letterSpacing: "0.2em" }}
            />
          </label>
          <button className="btn ancho" disabled={codigo.replace(/[^A-Za-z0-9]/g, "").length < 4}>
            Entrar
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
    </main>
  );
}
