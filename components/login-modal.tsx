"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Mail, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { loginWithEmail } = useUser()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setError("")
      setCargando(false)
      setExito(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) { setError("Ingresá tu email"); return }

    setCargando(true)
    const { encontrado } = await loginWithEmail(email.trim())
    setCargando(false)

    if (encontrado) {
      setExito(true)
      setTimeout(() => { onLoginSuccess(); onClose() }, 1500)
    } else {
      // No está en la BD → ingresa como anónimo
      onLoginSuccess()
      onClose()
    }
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-xl shadow-2xl pointer-events-auto w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold">Acceder a Sentir</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            {!exito ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center space-y-2 pb-2">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-7 w-7 text-blue-800 dark:text-blue-300" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ingresá el email con el que te registraste en Sentir
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={cargando} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-5">
                  {cargando ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verificando...</> : "Ingresar"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                <p className="text-xl font-bold">¡Bienvenido/a!</p>
                <p className="text-sm text-muted-foreground">Tu sesión quedó activa.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
