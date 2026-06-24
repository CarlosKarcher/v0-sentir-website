"use client"

import { Header } from "@/components/header"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

const TALLERES = [
  { title: "Taller de Transformación", sede: "Río Gallegos", date: "9, 10, 11 y 12 de Julio 2026", fechaInicio: "2026-07-09", slug: "transformacion", id: "2ecd2571-70d4-401c-9a40-56f0a3ab589c", location: "Lugar a Confirmar", nivel: "2do Nivel" },
  { title: "Taller de MyL 7 — 1ra Sala", sede: "Río Gallegos", date: "8 y 9 de Agosto 2026", fechaInicio: "2026-08-08", slug: "metas-y-logros", id: "893c6f59-783e-45ae-bb45-282216b1f616", location: "Río Gallegos", nivel: "3er Nivel" },
  { title: "Taller de MyL 7 — 2da Sala", sede: "Río Gallegos", date: "29 y 30 de Agosto 2026", fechaInicio: "2026-08-29", slug: "metas-y-logros", id: "", location: "Río Gallegos", nivel: "3er Nivel" },
  { title: "Taller de Autoconocimiento", sede: "Río Gallegos", date: "11, 12 y 13 de Septiembre 2026", fechaInicio: "2026-09-11", slug: "autoconocimiento", id: "6fc43f61-dc88-41ed-aa66-77d7d65d6456", location: "Henry Williams Jamieson 548 - Jubilados Legislativos", nivel: "1er Nivel" },
  { title: "Taller de Autoconocimiento", sede: "Córdoba", date: "25, 26 y 27 de Septiembre 2026", fechaInicio: "2026-09-25", slug: "autoconocimiento", id: "", location: "Córdoba", nivel: "1er Nivel" },
  { title: "Taller de Autoconocimiento", sede: "El Calafate", date: "9, 10 y 11 de Octubre 2026", fechaInicio: "2026-10-09", slug: "autoconocimiento", id: "", location: "Lugar a Designar", nivel: "1er Nivel" },
  { title: "Taller de MyL 7 — Campamento y Cierre", sede: "Río Gallegos", date: "31 de Octubre y 1 de Noviembre 2026", fechaInicio: "2026-10-31", slug: "metas-y-logros", id: "", location: "Río Gallegos", nivel: "3er Nivel" },
  { title: "El Camino del Guerrero", sede: "Quequén / Necochea", date: "7 y 8 de Noviembre 2026", fechaInicio: "2026-11-07", slug: "camino-del-guerrero", id: "82cac61c-8f4b-4316-bdd0-126994ed6a81", location: "A Confirmar", nivel: "" },
  { title: "Taller de Autoconocimiento", sede: "Quequén / Necochea", date: "13, 14 y 15 de Noviembre 2026", fechaInicio: "2026-11-13", slug: "autoconocimiento", id: "", location: "A Confirmar", nivel: "1er Nivel" },
  { title: "Taller de Autoconocimiento", sede: "Ciudad de Buenos Aires", date: "4, 5 y 6 de Diciembre 2026", fechaInicio: "2026-12-04", slug: "autoconocimiento", id: "", location: "Ciudad de Buenos Aires", nivel: "1er Nivel" },
]

export default function TalleresInscripcionPage() {
  const hoy = new Date().toISOString().substring(0, 10)
  const talleresFuturos = TALLERES.filter(t => t.fechaInicio >= hoy)
  const [talleresActivos, setTalleresActivos] = useState<Set<string>>(new Set())
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase
      .from("talleres")
      .select("id")
      .eq("activo", true)
      .gte("fecha_inicio", new Date().toISOString())
      .then(({ data }) => {
        if (Array.isArray(data)) setTalleresActivos(new Set(data.map((t: { id: string }) => t.id)))
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
            ) : (
              talleresFuturos
                .filter(t => t.id && talleresActivos.has(t.id))
                .map((t, i) => {
                  const url = `/inscribirse?taller=${t.slug}${t.id ? `&id=${t.id}` : ""}&localidad=${encodeURIComponent(t.sede)}&evento=${encodeURIComponent(`${t.title} — ${t.sede} — ${t.date} — ${t.location}`)}&back=proximos-eventos`
                  return (
                    <a
                      key={i}
                      href={url}
                      className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition-all group"
                    >
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-green-700">{t.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">📍 {t.sede}{t.nivel ? ` · ${t.nivel}` : ""}</p>
                        <p className="text-sm text-gray-400 mt-0.5">📅 {t.date}</p>
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
