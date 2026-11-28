"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { registrarEsencia } from "@/lib/esencia/contador"

// Control de entrada a Nuestra Esencia. El juego NUNCA pide el mail.
// - Abrir una mesa (la portada /esencia): solo miembros de Sentir con al menos un taller
//   (las constelaciones no cuentan) o administradores, según el usuario que el navegador ya tiene guardado.
// - Entrar con el link de una mesa (/esencia/sala/…): pasa cualquiera que el guía invitó, sin mail
//   ni registro; la sala solo le pide el nombre si el navegador no lo conoce.
export function EsenciaAcceso({ children }: { children: React.ReactNode }) {
  const { estado, puedeEsencia, email } = useUser()
  const invitado = (usePathname() ?? "").startsWith("/esencia/sala/")
  const pasa = puedeEsencia || invitado

  // contador: un «ingreso» cada vez que alguien entra al juego (por el menú o por el link de una mesa)
  const contado = useRef(false)
  useEffect(() => {
    if (pasa && estado !== "cargando" && !contado.current) {
      contado.current = true
      registrarEsencia("ingreso", email)
    }
  }, [pasa, estado, email])

  if (pasa) return <>{children}</>

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
              Aún no estás registrado en la página de Sentir. Registrate primero, por favor. Este espacio es solo para personas
              que realizaron algún taller de Sentir. ¡Abrazo y te esperamos!
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
