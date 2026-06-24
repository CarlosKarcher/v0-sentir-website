"use client"

import { Header } from "@/components/header"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

const NIVEL_POR_SLUG: Record<string, string> = {
  "autoconocimiento": "1er Nivel",
  "transformacion": "2do Nivel",
  "metas-y-logros": "3er Nivel",
  "camino-del-guerrero": "",
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function formatFecha(fecha: string) {
  const d = new Date(fecha)
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

type Taller = {
  id: string
  slug: string
  nombre: string
  fecha_inicio: string
  sede: string
}

export default function TalleresInscripcionPage() {
  const [talleres, setTalleres] = useState<Taller[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase
      .from("talleres")
      .select("id, slug, nombre, fecha_inicio, sede")
      .eq("activo", true)
      .gte("fecha_inicio", new Date().toISOString())
      .order("fecha_inicio")
      .then(({ data }) => {
        if (Array.isArray(data)) setTalleres(data)
        setCargando(false)
      })
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </a>

          <div className="text-center mb-8">
            <img src="/fuego-de-sentir.png" alt="" className="h-12 w-auto mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Inscribite a un Taller</h1>
            <p className="text-gray-500">Elegí el taller al que querés inscribirte</p>
          </div>

          <div className="flex flex-col gap-3">
            {cargando ? (
              <p className="text-center text-gray-400 py-8">Cargando...</p>
            ) : talleres.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No hay talleres disponibles en este momento.</p>
            ) : (
              talleres.map((t, i) => {
                const titulo = t.slug === "camino-del-guerrero" ? t.nombre : `Taller de ${t.nombre}`
                const fecha = formatFecha(t.fecha_inicio)
                const nivel = NIVEL_POR_SLUG[t.slug] ?? ""
                const url = `/inscribirse?taller=${t.slug}&id=${t.id}&localidad=${encodeURIComponent(t.sede)}&evento=${encodeURIComponent(`${titulo} — ${t.sede} — ${fecha}`)}&back=proximos-eventos`
                return (
                  <a
                    key={i}
                    href={url}
                    className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-green-700">{titulo}</p>
                      <p className="text-sm text-gray-500 mt-0.5">📍 {t.sede}{nivel ? ` · ${nivel}` : ""}</p>
                      <p className="text-sm text-gray-400 mt-0.5">📅 {fecha}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-green-600 flex-shrink-0 ml-4" />
                  </a>
                )
              })
            )}
          </div>

        </div>
      </main>
    </>
  )
}
