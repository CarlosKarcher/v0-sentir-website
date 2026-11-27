"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/lib/user-context"
import { registrarEsencia } from "@/lib/esencia/contador"

// Control de entrada a Nuestra Esencia: solo juegan miembros de Sentir con al menos un taller
// (las constelaciones no cuentan) o administradores, entren por el menú, por un link o con el código.
// El juego NUNCA pide el mail: usa el usuario que el navegador ya tiene guardado de sentir.fun.
// Si no hay ninguno, se manda a registrarse o ingresar en sentir.fun desde ese mismo navegador.
// No toca el juego: si la persona cumple, se muestra la página tal cual.
export function EsenciaAcceso({ children }: { children: React.ReactNode }) {
  const { estado, puedeEsencia, email } = useUser()

  // contador: un «ingreso» cada vez que un miembro entra al juego (por el menú o por el link de una mesa)
  const contado = useRef(false)
  useEffect(() => {
    if (puedeEsencia && !contado.current) {
      contado.current = true
      registrarEsencia("ingreso", email)
    }
  }, [puedeEsencia, email])

  if (puedeEsencia) return <>{children}</>

  const cargando = estado === "cargando"
  const identificado = estado === "registrado" || estado === "sin_registro"

  return (
    <main className="inicio">
      <header>
        <span className="marca">
          <span className="chispa" /> Nuestra Esencia
        </span>
      </header>
      <section className="portada">
        {cargando ? (
          <p className="muted">Un momento…</p>
        ) : identificado ? (
          <>
            <h1>
              Un juego para <em>quienes ya caminaron</em> con Sentir
            </h1>
            <p>Nuestra Esencia es para quienes hicieron al menos un taller de Sentir.</p>
            <a className="btn" href="/" style={{ marginTop: 18 }}>
              Ir a Sentir
            </a>
          </>
        ) : (
          <>
            <h1>
              Primero, <em>entrá a Sentir</em>
            </h1>
            <p>
              Para jugar, primero registrate o ingresá en <b>sentir.fun</b> desde este mismo navegador. Después volvé a abrir
              el link de la mesa.
            </p>
            <a className="btn primario" href="/" style={{ marginTop: 18 }}>
              Ir a Sentir
            </a>
          </>
        )}
      </section>
    </main>
  )
}
