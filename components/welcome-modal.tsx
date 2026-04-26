"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useUser } from "@/lib/user-context"
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

            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm text-base"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
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
  )
}
