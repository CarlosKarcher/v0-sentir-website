"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { LoginModal } from "@/components/login-modal"

// Control de entrada a Nuestra Esencia: solo juegan miembros de Sentir con al menos un taller
// (las constelaciones no cuentan) o administradores, entren por el menú, por un link o con el código.
// No toca el juego: si la persona cumple, se muestra la página tal cual.
export function EsenciaAcceso({ children }: { children: React.ReactNode }) {
  const { estado, puedeEsencia } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)

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
              Ingresá con tu <em>email de Sentir</em>
            </h1>
            <p>Nuestra Esencia es para quienes hicieron al menos un taller de Sentir.</p>
            <button className="btn primario" onClick={() => setLoginOpen(true)} style={{ marginTop: 18 }}>
              Ingresar
            </button>
          </>
        )}
      </section>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={() => setLoginOpen(false)} />
    </main>
  )
}
