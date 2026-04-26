"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Mail, KeyRound, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { createClient } from "@/lib/supabase/client"

type Step = "email" | "otp" | "no_encontrado" | "exito"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (data: { nombre: string; nroMiembro: number | null; esAdmin: boolean; email: string }) => void
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [nombreUsuario, setNombreUsuario] = useState("")

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) {
      setStep("email")
      setEmail("")
      setOtp("")
      setError("")
      setCargando(false)
    }
  }, [isOpen])

  const handleEnviarOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) { setError("Ingresá tu email"); return }

    setCargando(true)

    // 1. Verificar que el email esté en miembros o nomembros
    const { data: persona } = await supabase.rpc("buscar_email_registrado", {
      p_email: email.trim().toLowerCase(),
    })

    if (!persona?.encontrado) {
      setCargando(false)
      setStep("no_encontrado")
      return
    }

    // 2. Enviar OTP a ese email
    const supabaseAuth = createClient()
    const { error: otpError } = await supabaseAuth.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    })

    setCargando(false)

    if (otpError) {
      setError("Error al enviar el código: " + otpError.message)
      return
    }

    setStep("otp")
  }

  const handleVerificarOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (otp.trim().length !== 6) { setError("El código tiene 6 dígitos"); return }

    setCargando(true)

    const supabaseAuth = createClient()
    const { data: authData, error: verifyError } = await supabaseAuth.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: "email",
    })

    if (verifyError || !authData.session) {
      setCargando(false)
      setError("Código incorrecto o vencido. Revisá tu email o volvé a intentar.")
      return
    }

    // 3. Obtener datos del usuario desde nuestras tablas
    const { data: persona } = await supabase.rpc("buscar_email_registrado", {
      p_email: email.trim().toLowerCase(),
    })

    setCargando(false)

    const nombre = persona?.nombre_gafete || persona?.nombre_apellido?.split(" ")[0] || ""
    const nroMiembro = persona?.numero ?? null
    const esAdmin = persona?.es_admin ?? false

    setNombreUsuario(nombre)
    setStep("exito")

    onLoginSuccess({ nombre, nroMiembro, esAdmin, email: email.trim().toLowerCase() })

    setTimeout(() => onClose(), 1800)
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

            {/* PASO 1: email */}
            {step === "email" && (
              <form onSubmit={handleEnviarOTP} className="space-y-5">
                <div className="text-center space-y-2 pb-2">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-7 w-7 text-blue-800 dark:text-blue-300" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ingresá tu email y te enviamos un código de acceso
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
                  {cargando ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verificando...</> : "Enviar código"}
                </Button>
              </form>
            )}

            {/* PASO 2: código OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerificarOTP} className="space-y-5">
                <div className="text-center space-y-2 pb-2">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
                    <KeyRound className="h-7 w-7 text-green-700 dark:text-green-300" />
                  </div>
                  <p className="text-sm font-medium">Código enviado a:</p>
                  <p className="text-sm font-bold text-primary">{email}</p>
                  <p className="text-xs text-muted-foreground">Revisá tu bandeja de entrada (y el spam)</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Código de 6 dígitos</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full border border-border rounded-md px-3 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-bold tracking-widest"
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={cargando || otp.length !== 6} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-5">
                  {cargando ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verificando...</> : "Ingresar"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); setError("") }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Cambiar email
                </button>
              </form>
            )}

            {/* Email no encontrado */}
            {step === "no_encontrado" && (
              <div className="text-center space-y-4 py-2">
                <p className="text-base font-semibold">Email no encontrado</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{email}</span> no está registrado en Sentir.
                </p>
                <p className="text-sm text-muted-foreground">
                  Para unirte a la comunidad, completá el formulario de registro.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={onClose}
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    Ir a registrarme
                  </Button>
                  <button
                    onClick={() => { setStep("email"); setError("") }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Probar otro email
                  </button>
                </div>
              </div>
            )}

            {/* Éxito */}
            {step === "exito" && (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                <p className="text-xl font-bold">¡Bienvenido/a, {nombreUsuario}!</p>
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
