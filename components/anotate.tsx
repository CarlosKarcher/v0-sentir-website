"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const ANIOS = Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => 2015 + i).reverse()

const TALLERES = [
  { key: "autoconocimiento", label: "Autoconocimiento" },
  { key: "transformacion", label: "Transformación" },
  { key: "myl", label: "MyL" },
  { key: "guerrero", label: "El Camino del Guerrero" },
  { key: "nino_interior", label: "Sanando mi Niño Interior" },
  { key: "constelaciones", label: "Sesiones de Constelaciones Grupales" },
] as const

type TallerKey = typeof TALLERES[number]["key"]

const schema = z.object({
  nombre_apellido: z.string().min(2, "Ingresá tu nombre y apellido"),
  nombre_gafete: z.string().min(1, "Ingresá el nombre para el gafete"),
  celular_caracteristica: z.string().min(1, "Ingresá la característica del país"),
  celular_numero: z.string().min(6, "Ingresá tu número de celular"),
  comentario: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type TallerState = {
  checked: boolean
  mes: string
  anio: string
}

const tallerInicial = (): TallerState => ({ checked: false, mes: "", anio: "" })

export function Anotate() {
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const toggleTaller = (key: TallerKey) => {
    setTalleres(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked },
    }))
  }

  const setTallerFecha = (key: TallerKey, field: "mes" | "anio", value: string) => {
    setTalleres(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const onSubmit = async (data: FormData) => {
    setEnviando(true)
    setError("")

    const payload = {
      nombre_apellido: data.nombre_apellido,
      nombre_gafete: data.nombre_gafete,
      celular_caracteristica: data.celular_caracteristica,
      celular_numero: data.celular_numero,
      comentario: data.comentario || null,
      taller_autoconocimiento: talleres.autoconocimiento.checked,
      autoconocimiento_mes: talleres.autoconocimiento.checked && talleres.autoconocimiento.mes ? parseInt(talleres.autoconocimiento.mes) : null,
      autoconocimiento_anio: talleres.autoconocimiento.checked && talleres.autoconocimiento.anio ? parseInt(talleres.autoconocimiento.anio) : null,
      taller_transformacion: talleres.transformacion.checked,
      transformacion_mes: talleres.transformacion.checked && talleres.transformacion.mes ? parseInt(talleres.transformacion.mes) : null,
      transformacion_anio: talleres.transformacion.checked && talleres.transformacion.anio ? parseInt(talleres.transformacion.anio) : null,
      taller_myl: talleres.myl.checked,
      myl_mes: talleres.myl.checked && talleres.myl.mes ? parseInt(talleres.myl.mes) : null,
      myl_anio: talleres.myl.checked && talleres.myl.anio ? parseInt(talleres.myl.anio) : null,
      taller_guerrero: talleres.guerrero.checked,
      guerrero_mes: talleres.guerrero.checked && talleres.guerrero.mes ? parseInt(talleres.guerrero.mes) : null,
      guerrero_anio: talleres.guerrero.checked && talleres.guerrero.anio ? parseInt(talleres.guerrero.anio) : null,
      taller_nino_interior: talleres.nino_interior.checked,
      nino_interior_mes: talleres.nino_interior.checked && talleres.nino_interior.mes ? parseInt(talleres.nino_interior.mes) : null,
      nino_interior_anio: talleres.nino_interior.checked && talleres.nino_interior.anio ? parseInt(talleres.nino_interior.anio) : null,
      taller_constelaciones: talleres.constelaciones.checked,
      constelaciones_mes: talleres.constelaciones.checked && talleres.constelaciones.mes ? parseInt(talleres.constelaciones.mes) : null,
      constelaciones_anio: talleres.constelaciones.checked && talleres.constelaciones.anio ? parseInt(talleres.constelaciones.anio) : null,
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

  if (enviado) {
    return (
      <section className="py-12 sm:py-16 w-full" id="anotate">
        <div className="w-full max-w-2xl mx-auto px-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">¡Ya estás anotado!</h2>
          <p className="text-muted-foreground text-lg">Gracias por sumarte a la comunidad Sentir. Pronto estaremos en contacto.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 w-full bg-muted/30" id="anotate">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 text-balance">ANOTATE</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Formá parte del registro de nuestra comunidad Sentir
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Nombre y Apellido */}
              <div>
                <label className="block text-sm font-medium mb-1">Nombre y Apellido *</label>
                <input
                  {...register("nombre_apellido")}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Juan Pérez"
                />
                {errors.nombre_apellido && <p className="text-red-500 text-xs mt-1">{errors.nombre_apellido.message}</p>}
              </div>

              {/* Nombre Gafete */}
              <div>
                <label className="block text-sm font-medium mb-1">Nombre en el Gafete *</label>
                <input
                  {...register("nombre_gafete")}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Juan"
                />
                {errors.nombre_gafete && <p className="text-red-500 text-xs mt-1">{errors.nombre_gafete.message}</p>}
              </div>

              {/* Celular */}
              <div>
                <label className="block text-sm font-medium mb-1">Celular *</label>
                <div className="flex gap-2">
                  <input
                    {...register("celular_caracteristica")}
                    className="w-24 border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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

              {/* Talleres Realizados */}
              <div>
                <label className="block text-sm font-medium mb-3">Talleres Realizados</label>
                <div className="space-y-3">
                  {TALLERES.map(({ key, label }) => (
                    <div key={key}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => toggleTaller(key)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
                            ${talleres[key].checked ? "bg-blue-900 border-blue-900" : "border-border group-hover:border-blue-700"}`}
                        >
                          {talleres[key].checked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium" onClick={() => toggleTaller(key)}>{label}</span>
                      </label>

                      {talleres[key].checked && (
                        <div className="ml-8 mt-2 flex gap-2">
                          <select
                            value={talleres[key].mes}
                            onChange={e => setTallerFecha(key, "mes", e.target.value)}
                            className="flex-1 border border-border rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Mes</option>
                            {MESES.map((mes, i) => (
                              <option key={i} value={i + 1}>{mes}</option>
                            ))}
                          </select>
                          <select
                            value={talleres[key].anio}
                            onChange={e => setTallerFecha(key, "anio", e.target.value)}
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

              {/* Comentario */}
              <div>
                <label className="block text-sm font-medium mb-1">Déjanos un comentario</label>
                <textarea
                  {...register("comentario")}
                  rows={4}
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
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
