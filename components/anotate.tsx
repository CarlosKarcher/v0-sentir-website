"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, Sparkles, Heart, AlertCircle } from "lucide-react"

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const ANIOS = Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => 2015 + i).reverse()

const TALLERES = [
  { key: "autoconocimiento", label: "Autoconocimiento", conFecha: true },
  { key: "transformacion", label: "Transformación", conFecha: true },
  { key: "myl", label: "MyL", conFecha: true },
  { key: "guerrero", label: "El Camino del Guerrero", conFecha: true },
  { key: "nino_interior", label: "Sanando mi Niño Interior", conFecha: true },
  { key: "constelaciones", label: "Sesiones de Constelaciones Grupales", conFecha: false },
] as const

type TallerKey = typeof TALLERES[number]["key"]

const soloLetrasYNumeros = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/

const schemaMiembro = z.object({
  nombre_apellido: z.string()
    .min(2, "Ingresá tu nombre y apellido (mínimo 2 caracteres)")
    .regex(soloLetrasYNumeros, "Solo se permiten letras, números y espacios"),
  nombre_gafete: z.string()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]*$/, "Solo se permiten letras, números y espacios")
    .optional()
    .or(z.literal("")),
  celular_caracteristica: z.string().min(1, "Ingresá la característica"),
  celular_numero: z.string().min(6, "Ingresá tu número"),
  email: z.string().email("Ingresá un email válido").optional().or(z.literal("")),
  comentario: z.string().optional(),
})

const schemaInteresado = z.object({
  nombre_apellido: z.string()
    .min(2, "Ingresá tu nombre y apellido (mínimo 2 caracteres)")
    .regex(soloLetrasYNumeros, "Solo se permiten letras, números y espacios"),
  celular_caracteristica: z.string().min(1, "Ingresá la característica"),
  celular_numero: z.string().min(6, "Ingresá tu número"),
  email: z.string().email("Ingresá un email válido").optional().or(z.literal("")),
})

type MiembroData = z.infer<typeof schemaMiembro>
type InteresadoData = z.infer<typeof schemaInteresado>

type TallerState = { checked: boolean; mes: string; anio: string }
const tallerInicial = (): TallerState => ({ checked: false, mes: "", anio: "" })

type Step = "pregunta" | "ya_registrado" | "miembro" | "interesado"

interface AnotateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AnotateModal({ isOpen, onClose }: AnotateModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>("pregunta")
  const [talleres, setTalleres] = useState<Record<TallerKey, TallerState>>({
    autoconocimiento: tallerInicial(),
    transformacion: tallerInicial(),
    myl: tallerInicial(),
    guerrero: tallerInicial(),
    nino_interior: tallerInicial(),
    constelaciones: tallerInicial(),
  })
  const [celularRegistrado, setCelularRegistrado] = useState("")
  const [recibirInfo, setRecibirInfo] = useState<boolean | null>(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [numeroMiembro, setNumeroMiembro] = useState<number | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleEscape)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep("pregunta")
      setEnviado(false)
      setError("")
      setNumeroMiembro(null)
      setRecibirInfo(null)
      setCelularRegistrado("")
      setTalleres({
        autoconocimiento: tallerInicial(),
        transformacion: tallerInicial(),
        myl: tallerInicial(),
        guerrero: tallerInicial(),
        nino_interior: tallerInicial(),
        constelaciones: tallerInicial(),
      })
    }
  }, [isOpen])

  const formMiembro = useForm<MiembroData>({ resolver: zodResolver(schemaMiembro) })
  const formInteresado = useForm<InteresadoData>({ resolver: zodResolver(schemaInteresado) })

  const checkCelular = async (caracteristica: string, numero: string) => {
    if (!numero || numero.length < 6) return
    const { data: enMiembros } = await supabase
      .from("miembros")
      .select("id")
      .eq("celular_caracteristica", caracteristica.trim())
      .eq("celular_numero", numero.trim())
      .maybeSingle()
    const { data: enNomembros } = await supabase
      .from("nomembros")
      .select("id")
      .eq("celular_caracteristica", caracteristica.trim())
      .eq("celular_numero", numero.trim())
      .maybeSingle()
    if (enMiembros || enNomembros) {
      setCelularRegistrado(`${caracteristica.trim()} ${numero.trim()}`)
      setStep("ya_registrado")
    }
  }

  // Al abrir, verificar si ya se registró antes (guardado en localStorage)
  useEffect(() => {
    if (!isOpen) return
    const guardado = localStorage.getItem("sentir_celular")
    if (!guardado) return
    try {
      const { caracteristica, numero } = JSON.parse(guardado)
      checkCelular(caracteristica, numero)
    } catch {}
  }, [isOpen])

  const toggleTaller = (key: TallerKey) => {
    setTalleres(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }))
  }

  const setFecha = (key: TallerKey, field: "mes" | "anio", value: string) => {
    setTalleres(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const onSubmitMiembro = async (data: MiembroData) => {
    const algunTaller = Object.values(talleres).some(t => t.checked)
    if (!algunTaller) {
      setError("Seleccioná al menos un taller realizado.")
      return
    }
    setEnviando(true)
    setError("")
    const t = talleres
    const payload = {
      nombre_apellido: data.nombre_apellido,
      nombre_gafete: data.nombre_gafete || null,
      celular_caracteristica: data.celular_caracteristica,
      celular_numero: data.celular_numero,
      email: data.email || null,
      comentario: data.comentario || null,
      taller_autoconocimiento: t.autoconocimiento.checked,
      autoconocimiento_mes: t.autoconocimiento.checked && t.autoconocimiento.mes ? parseInt(t.autoconocimiento.mes) : null,
      autoconocimiento_anio: t.autoconocimiento.checked && t.autoconocimiento.anio ? parseInt(t.autoconocimiento.anio) : null,
      taller_transformacion: t.transformacion.checked,
      transformacion_mes: t.transformacion.checked && t.transformacion.mes ? parseInt(t.transformacion.mes) : null,
      transformacion_anio: t.transformacion.checked && t.transformacion.anio ? parseInt(t.transformacion.anio) : null,
      taller_myl: t.myl.checked,
      myl_mes: t.myl.checked && t.myl.mes ? parseInt(t.myl.mes) : null,
      myl_anio: t.myl.checked && t.myl.anio ? parseInt(t.myl.anio) : null,
      taller_guerrero: t.guerrero.checked,
      guerrero_mes: t.guerrero.checked && t.guerrero.mes ? parseInt(t.guerrero.mes) : null,
      guerrero_anio: t.guerrero.checked && t.guerrero.anio ? parseInt(t.guerrero.anio) : null,
      taller_nino_interior: t.nino_interior.checked,
      nino_interior_mes: t.nino_interior.checked && t.nino_interior.mes ? parseInt(t.nino_interior.mes) : null,
      nino_interior_anio: t.nino_interior.checked && t.nino_interior.anio ? parseInt(t.nino_interior.anio) : null,
      taller_constelaciones: t.constelaciones.checked,
      constelaciones_mes: null,
      constelaciones_anio: null,
      recibir_informacion: false,
    }
    const { data: res, error: sbError } = await supabase.rpc('registrar_miembro', payload)
    if (sbError) {
      if (sbError.code === "23505") {
        setCelularRegistrado(`${data.celular_caracteristica} ${data.celular_numero}`)
        setStep("ya_registrado")
      } else {
        setError(`Error ${sbError.code}: ${sbError.message}`)
      }
      setEnviando(false)
      return
    }
    localStorage.setItem("sentir_celular", JSON.stringify({
      caracteristica: data.celular_caracteristica,
      numero: data.celular_numero,
    }))
    setNumeroMiembro(res ?? null)
    setEnviado(true)
    setEnviando(false)
  }

  const onSubmitInteresado = async (data: InteresadoData) => {
    if (recibirInfo === null) {
      setError("Por favor respondé si deseás recibir información.")
      return
    }
    setEnviando(true)
    setError("")
    const payload = {
      nombre_apellido: data.nombre_apellido,
      celular_caracteristica: data.celular_caracteristica,
      celular_numero: data.celular_numero,
      email: data.email || null,
      recibir_informacion: recibirInfo,
    }
    const { error: sbError } = await supabase.from("nomembros").insert(payload)
    if (sbError) {
      if (sbError.code === "23505") {
        setCelularRegistrado(`${data.celular_caracteristica} ${data.celular_numero}`)
        setStep("ya_registrado")
      } else {
        setError(`Error ${sbError.code}: ${sbError.message}`)
      }
      setEnviando(false)
      return
    }
    localStorage.setItem("sentir_celular", JSON.stringify({
      caracteristica: data.celular_caracteristica,
      numero: data.celular_numero,
    }))
    setEnviado(true)
    setEnviando(false)
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-xl shadow-2xl pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-2xl font-bold">REGISTRATE</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-5">
            {/* PANTALLA DE ÉXITO */}
            {enviado ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Ya estás registrado!</h3>
                {numeroMiembro && (
                  <p className="text-3xl font-bold text-blue-900 my-3">Miembro Nº {numeroMiembro}</p>
                )}
                <p className="text-muted-foreground mb-6">
                  {step === "interesado" ? "Gracias por interesarte por nuestra Comunidad." : "Gracias por sumarte a la comunidad Sentir."}
                </p>
                <Button onClick={onClose} className="bg-blue-900 hover:bg-blue-800 text-white">Cerrar</Button>
              </div>

            /* PASO 0: PREGUNTA INICIAL */
            ) : step === "pregunta" ? (
              <div className="py-4 text-center space-y-6">
                {/* Ícono decorativo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center shadow-md">
                      <Heart className="h-9 w-9 text-blue-800 dark:text-blue-300" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-900" />
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground leading-snug">
                    ¿Hiciste alguno de<br />nuestros talleres?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contanos tu experiencia con la comunidad Sentir
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4 justify-center pt-2">
                  <button
                    onClick={() => setStep("miembro")}
                    className="group relative w-36 py-4 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-2xl">✅</span>
                      <span>Sí</span>
                      <span className="text-xs font-normal opacity-80">Ya participé</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setStep("interesado")}
                    className="group relative w-36 py-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-800 dark:text-gray-200 font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🌱</span>
                      <span>No</span>
                      <span className="text-xs font-normal opacity-70">Quiero conocer</span>
                    </span>
                  </button>
                </div>

                {/* Nota al pie */}
                <p className="text-xs text-muted-foreground pt-1">
                  Tu registro nos ayuda a mantenernos en contacto con vos
                </p>
              </div>

            /* YA REGISTRADO */
            ) : step === "ya_registrado" ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shadow-md">
                    <AlertCircle className="h-9 w-9 text-green-700 dark:text-green-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">¡Ya estás registrado!</h3>
                <p className="text-muted-foreground">
                  El número <span className="font-semibold text-foreground">{celularRegistrado}</span> ya figura en nuestra comunidad.
                </p>
                <p className="text-sm text-muted-foreground">
                  Si creés que es un error, comunicate con nosotros.
                </p>
                <Button onClick={onClose} className="bg-blue-900 hover:bg-blue-800 text-white px-8">
                  Cerrar
                </Button>
              </div>

            /* PASO 1: FORMULARIO MIEMBRO (hizo talleres) */
            ) : step === "miembro" ? (
              <form onSubmit={formMiembro.handleSubmit(onSubmitMiembro)} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setStep("pregunta")}
                  className="text-sm text-blue-700 hover:underline mb-1"
                >
                  ← Volver
                </button>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                  <input
                    {...formMiembro.register("nombre_apellido")}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan Pérez"
                  />
                  {formMiembro.formState.errors.nombre_apellido && (
                    <p className="text-red-500 text-xs mt-1">{formMiembro.formState.errors.nombre_apellido.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre en el Gafete</label>
                  <input
                    {...formMiembro.register("nombre_gafete")}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Celular *</label>
                  <div className="flex gap-2">
                    <input
                      {...formMiembro.register("celular_caracteristica")}
                      className="w-20 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+54"
                    />
                    <input
                      {...formMiembro.register("celular_numero")}
                      onBlur={e => checkCelular(
                        formMiembro.getValues("celular_caracteristica"),
                        e.target.value
                      )}
                      className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="9 2966 595803"
                    />
                  </div>
                  {(formMiembro.formState.errors.celular_caracteristica || formMiembro.formState.errors.celular_numero) && (
                    <p className="text-red-500 text-xs mt-1">Ingresá tu celular completo</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Talleres Realizados *</label>
                  <div className="space-y-3">
                    {TALLERES.map(({ key, label, conFecha }) => (
                      <div key={key} className="flex items-center gap-2 flex-wrap">
                        <div
                          onClick={() => toggleTaller(key)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
                            ${talleres[key].checked ? "bg-blue-900 border-blue-900" : "border-border hover:border-blue-700"}`}
                        >
                          {talleres[key].checked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium cursor-pointer" onClick={() => toggleTaller(key)}>{label}</span>
                        {talleres[key].checked && conFecha && (
                          <>
                            <select
                              value={talleres[key].mes}
                              onChange={e => setFecha(key, "mes", e.target.value)}
                              className="border border-border rounded-md px-2 py-1 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Mes</option>
                              {MESES.map((mes, i) => (
                                <option key={i} value={i + 1}>{mes}</option>
                              ))}
                            </select>
                            <select
                              value={talleres[key].anio}
                              onChange={e => setFecha(key, "anio", e.target.value)}
                              className="w-20 border border-border rounded-md px-2 py-1 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Año</option>
                              {ANIOS.map(anio => (
                                <option key={anio} value={anio}>{anio}</option>
                              ))}
                            </select>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    {...formMiembro.register("email")}
                    type="email"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ejemplo@mail.com"
                  />
                  {formMiembro.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{formMiembro.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Déjanos un comentario (Opcional)</label>
                  <textarea
                    {...formMiembro.register("comentario")}
                    rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Contanos algo sobre vos..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-base font-semibold"
                >
                  {enviando ? "Enviando..." : "¡Me anoto!"}
                </Button>
              </form>

            /* PASO 2: FORMULARIO INTERESADO (no hizo talleres) */
            ) : (
              <form onSubmit={formInteresado.handleSubmit(onSubmitInteresado)} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setStep("pregunta")}
                  className="text-sm text-blue-700 hover:underline mb-1"
                >
                  ← Volver
                </button>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                  <input
                    {...formInteresado.register("nombre_apellido")}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan Pérez"
                  />
                  {formInteresado.formState.errors.nombre_apellido && (
                    <p className="text-red-500 text-xs mt-1">{formInteresado.formState.errors.nombre_apellido.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Celular *</label>
                  <div className="flex gap-2">
                    <input
                      {...formInteresado.register("celular_caracteristica")}
                      className="w-20 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+54"
                    />
                    <input
                      {...formInteresado.register("celular_numero")}
                      onBlur={e => checkCelular(
                        formInteresado.getValues("celular_caracteristica"),
                        e.target.value
                      )}
                      className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="9 2966 595803"
                    />
                  </div>
                  {(formInteresado.formState.errors.celular_caracteristica || formInteresado.formState.errors.celular_numero) && (
                    <p className="text-red-500 text-xs mt-1">Ingresá tu celular completo</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    {...formInteresado.register("email")}
                    type="email"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ejemplo@mail.com"
                  />
                  {formInteresado.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{formInteresado.formState.errors.email.message}</p>
                  )}
                </div>

                {/* DIÁLOGO: ¿Deseás recibir información? */}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4 text-center space-y-3">
                  <p className="text-base font-semibold text-blue-900 dark:text-blue-200">
                    ¿Deseás recibir información<br />sobre nuestros talleres?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => setRecibirInfo(true)}
                      className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors border-2
                        ${recibirInfo === true
                          ? "bg-blue-900 border-blue-900 text-white"
                          : "bg-white border-blue-300 text-blue-900 hover:bg-blue-100 dark:bg-transparent dark:text-blue-200 dark:border-blue-600"
                        }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecibirInfo(false)}
                      className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors border-2
                        ${recibirInfo === false
                          ? "bg-gray-600 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-transparent dark:text-gray-300 dark:border-gray-600"
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-base font-semibold"
                >
                  {enviando ? "Enviando..." : "Registrarme"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
