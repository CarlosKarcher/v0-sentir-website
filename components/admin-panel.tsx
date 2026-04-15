"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-client"
import { X, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Miembro = {
  numero: number
  nombre_apellido: string
  nombre_gafete: string
  celular_caracteristica: string
  celular_numero: string
  email: string | null
  taller_autoconocimiento: boolean
  taller_transformacion: boolean
  taller_myl: boolean
  taller_guerrero: boolean
  taller_biodecodificacion: boolean
  taller_nino_interior: boolean
  taller_constelaciones: boolean
  comentario: string | null
  created_at: string
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  adminCaracteristica: string
  adminNumero: string
}

export function AdminPanel({ isOpen, onClose, adminCaracteristica, adminNumero }: AdminPanelProps) {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [cargando, setCargando] = useState(false)

  const cargarMiembros = async () => {
    setCargando(true)
    const { data } = await supabase.rpc("listar_miembros", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
    })
    if (Array.isArray(data)) setMiembros(data)
    setCargando(false)
  }

  useEffect(() => {
    if (isOpen) cargarMiembros()
  }, [isOpen])

  const exportarCSV = () => {
    const headers = ["Nº", "Nombre", "Gafete", "Celular", "Email", "Auto", "Transf", "MyL", "Guerrero", "Biodec", "Niño Int", "Constel", "Comentario", "Fecha"]
    const rows = miembros.map(m => [
      m.numero,
      m.nombre_apellido.trim(),
      m.nombre_gafete?.trim() || "",
      `${m.celular_caracteristica} ${m.celular_numero}`,
      m.email || "",
      m.taller_autoconocimiento ? "SI" : "NO",
      m.taller_transformacion ? "SI" : "NO",
      m.taller_myl ? "SI" : "NO",
      m.taller_guerrero ? "SI" : "NO",
      m.taller_biodecodificacion ? "SI" : "NO",
      m.taller_nino_interior ? "SI" : "NO",
      m.taller_constelaciones ? "SI" : "NO",
      m.comentario?.trim() || "",
      new Date(m.created_at).toLocaleDateString("es-AR"),
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `miembros_sentir_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  const t = (v: boolean) => v ? "✅" : "❌"

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-xl shadow-2xl pointer-events-auto w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Panel Administrador</h2>
              {!cargando && (
                <span className="text-sm text-muted-foreground">{miembros.length} miembros</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cargarMiembros}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                title="Actualizar"
              >
                <RefreshCw className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`} />
              </button>
              {miembros.length > 0 && (
                <Button onClick={exportarCSV} variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-auto flex-1 px-6 py-4">
            {cargando ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Cargando miembros...</p>
              </div>
            ) : miembros.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay miembros registrados.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-border bg-muted/50">
                    <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nº</th>
                    <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nombre</th>
                    <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Gafete</th>
                    <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Celular</th>
                    <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Email</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Auto</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Transf</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">MyL</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Guerrero</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Biodec</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Niño Int</th>
                    <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Constel</th>
                  </tr>
                </thead>
                <tbody>
                  {miembros.map((m, i) => (
                    <tr key={m.numero} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-2 py-2 font-medium">{m.numero}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{m.nombre_apellido.trim()}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{m.nombre_gafete?.trim()}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{m.celular_caracteristica} {m.celular_numero}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{m.email || "—"}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_autoconocimiento)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_transformacion)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_myl)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_guerrero)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_biodecodificacion)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_nino_interior)}</td>
                      <td className="text-center px-2 py-2">{t(m.taller_constelaciones)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
