"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useUser } from "@/lib/user-context"
import { GoogleOneTapButton } from "@/components/google-one-tap"
import { X } from "lucide-react"

export function WelcomeModal() {
  const { estado, login } = useUser()
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (estado === "no_logueado") {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [estado])

  if (!mounted || !visible) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={() => setVisible(false)} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl pointer-events-auto w-full max-w-sm text-center overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Cerrar */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          {/* Header azul */}
          <div className="bg-blue-900 px-6 pt-8 pb-6">
            <img src="/fuego-de-sentir.png" alt="Sentir" className="h-14 w-auto mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">¡Bienvenido/a a Sentir!</h2>
            <p className="text-blue-200 text-sm mt-1">
              Ingresá con tu cuenta de Google para acceder a todos los beneficios
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

            <div className="flex justify-center">
              <GoogleOneTapButton />
            </div>

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
  )
}
