"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useUser } from "@/lib/user-context"
import { LoginModal } from "@/components/login-modal"
import { X } from "lucide-react"

export function WelcomeModal() {
  const { estado } = useUser()
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (estado === "no_logueado") {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [estado])

  if (!mounted) return null

  return (
    <>
      {visible && !loginOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={() => setVisible(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl pointer-events-auto w-full max-w-sm text-center overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setVisible(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="bg-blue-900 px-6 pt-8 pb-6">
                <img src="/fuego-de-sentir.png" alt="Sentir" className="h-14 w-auto mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white">¡Bienvenido/a a Sentir!</h2>
                <p className="text-blue-200 text-sm mt-1">
                  Ingresá con tu email para acceder a todos los beneficios
                </p>
              </div>

              <div className="px-6 py-6 space-y-4">
                <ul className="text-sm text-gray-600 dark:text-gray-300 text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Inscribirte a talleres y eventos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Ver tu historial y número de miembro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Sesión permanente — no volvés a ingresar
                  </li>
                </ul>

                <button
                  onClick={() => { setVisible(false); setLoginOpen(true) }}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-base"
                >
                  Ingresar con mi email
                </button>

                <button
                  onClick={() => setVisible(false)}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Continuar sin ingresar
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => setLoginOpen(false)}
      />
    </>
  )
}
