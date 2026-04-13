"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { X, CheckCircle } from "lucide-react"

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

const schema = z.object({
  nombre_apellido: z.string().min(2, "Ingresá tu nombre y apellido"),
  nombre_gafete: z.string().min(1, "Ingresá el nombre para el gafete"),
  celular_caracteristica: z.string().min(1, "Ingresá la característica"),
  celular_numero: z.string().min(6, "Ingresá tu número"),
  comentario: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type TallerState = { checked: boolean; mes: string; anio: string }
const tallerInicial = (): TallerState => ({ checked: false, mes: "", anio: "" })

interface AnotateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AnotateModal({ isOpen, onClose }: AnotateModalProps) {
  const [mounted, setMounted] = useState(false)
  const [talleres, setTalleres] = useState<Record<TallerKey, TallerState>>({
    autoconocimiento: tallerInicial(),
    transformacion: tallerInicial(),
    myl: tallerInicial(),
    guerrero: tallerInicial(),
    nino_interior: tallerInicial(),
    constelaciones: tallerInicial(),
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const toggleTaller = (key: TallerKey) => {
    setTalleres(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }))
  }

  const setFecha = (key: TallerKey, field: "mes" | "anio", value: string) => {
    setTalleres(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const onSubmit = async (data: FormData) => {
    setEnviando(true)
    setError("")
    const t = talleres
    const payload = {
      nombre_apellido: data.nombre_apellido,
      nombre_gafete: data.nombre_gafete,
      celular_caracteristica: data.celular_caracteristica,
      celular_numero: data.celular_numero,
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
    }
    const { error: sbError } = await supabase.from("miembros").insert(payload)
    if (sbError) {
      setError("Hubo un error al enviar. Por favor intentá de nuevo.")
      setEnviando(false)
      return
    }
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
            <h2 className="text-2xl font-bold">ANOTATE</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-5">
            {enviado ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Ya estás anotado!</h3>
                <p className="text-muted-foreground mb-6">Gracias por sumarte a la comunidad Sentir.</p>
                <Button onClick={onClose} className="bg-blue-900 hover:bg-blue-800 text-white">Cerrar</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                  <input
                    {...register("nombre_apellido")}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.nombre_apellido && <p className="text-red-500 text-xs mt-1">{errors.nombre_apellido.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre en el Gafete *</label>
                  <input
                    {...register("nombre_gafete")}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan"
                  />
                  {errors.nombre_gafete && <p className="text-red-500 text-xs mt-1">{errors.nombre_gafete.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Celular *</label>
                  <div className="flex gap-2">
                    <input
                      {...register("celular_caracteristica")}
                      className="w-20 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+54"
                    />
                    <input
                      {...register("celular_numero")}
                      className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="9 2966 595803"
                    />
                  </div>
                  {(errors.celular_caracteristica || errors.celular_numero) && (
                    <p className="text-red-500 text-xs mt-1">Ingresá tu celular completo</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Talleres Realizados</label>
                  <div className="space-y-3">
                    {TALLERES.map(({ key, label, conFecha }) => (
                      <div key={key}>
                        <label className="flex items-center gap-3 cursor-pointer">
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
                          <span className="text-sm font-medium" onClick={() => toggleTaller(key)}>{label}</span>
                        </label>

                        {talleres[key].checked && conFecha && (
                          <div className="ml-8 mt-2 flex gap-2">
                            <select
                              value={talleres[key].mes}
                              onChange={e => setFecha(key, "mes", e.target.value)}
                              className="flex-1 border border-border rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Mes</option>
                              {MESES.map((mes, i) => (
                                <option key={i} value={i + 1}>{mes}</option>
                              ))}
                            </select>
                            <select
                              value={talleres[key].anio}
                              onChange={e => setFecha(key, "anio", e.target.value)}
                              className="w-28 border border-border rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Año</option>
                              {ANIOS.map(anio => (
                                <option key={anio} value={anio}>{anio}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Déjanos un comentario</label>
                  <textarea
                    {...register("comentario")}
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
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
