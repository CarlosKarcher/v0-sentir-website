"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-client"
import { X, Download, RefreshCw, ArrowLeft, Users, UserX, Filter } from "lucide-react"
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

type Nomembro = {
  numero: number
  nombre_apellido: string
  celular_caracteristica: string
  celular_numero: string
  email: string | null
  recibir_informacion: boolean
  created_at: string
}

type Vista = "menu" | "miembros" | "nomembros" | "taller"

const TALLERES = [
  { key: "taller_autoconocimiento" as const, label: "Autoconocimiento" },
  { key: "taller_transformacion" as const, label: "Transformación" },
  { key: "taller_myl" as const, label: "MyL" },
  { key: "taller_guerrero" as const, label: "El Camino del Guerrero" },
  { key: "taller_biodecodificacion" as const, label: "Biodecodificación" },
  { key: "taller_nino_interior" as const, label: "Sanando mi Niño Interior" },
  { key: "taller_constelaciones" as const, label: "Constelaciones Grupales" },
]

type TallerKey = typeof TALLERES[number]["key"]

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  adminCaracteristica: string
  adminNumero: string
}

export function AdminPanel({ isOpen, onClose, adminCaracteristica, adminNumero }: AdminPanelProps) {
  const [vista, setVista] = useState<Vista>("menu")
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [nomembros, setNomembros] = useState<Nomembro[]>([])
  const [cargando, setCargando] = useState(false)
  const [tallerFiltro, setTallerFiltro] = useState<TallerKey>("taller_autoconocimiento")

  const cargarMiembros = async () => {
    setCargando(true)
    const { data } = await supabase.rpc("listar_miembros", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
    })
    if (Array.isArray(data)) setMiembros(data)
    setCargando(false)
  }

  const cargarNomembros = async () => {
    setCargando(true)
    const { data } = await supabase.rpc("listar_nomembros", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
    })
    if (Array.isArray(data)) setNomembros(data)
    setCargando(false)
  }

  const irA = (v: Vista) => {
    setVista(v)
    if (v === "miembros" && miembros.length === 0) cargarMiembros()
    if (v === "nomembros" && nomembros.length === 0) cargarNomembros()
    if (v === "taller" && miembros.length === 0) cargarMiembros()
  }

  const recargar = () => {
    if (vista === "miembros" || vista === "taller") cargarMiembros()
    if (vista === "nomembros") cargarNomembros()
  }

  useEffect(() => {
    if (!isOpen) {
      setVista("menu")
      setMiembros([])
      setNomembros([])
    }
  }, [isOpen])

  const descargarCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportarCSVMiembros = (data: Miembro[], filename: string) => {
    const headers = ["Nº", "Nombre", "Gafete", "Celular", "Email", "Auto", "Transf", "MyL", "Guerrero", "Biodec", "Niño Int", "Constel", "Comentario", "Fecha"]
    const rows = data.map(m => [
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
    descargarCSV(headers, rows, filename)
  }

  const exportarCSVNomembros = () => {
    const headers = ["Nº", "Nombre", "Celular", "Email", "Recibir Info", "Fecha"]
    const rows = nomembros.map(n => [
      n.numero,
      n.nombre_apellido.trim(),
      `${n.celular_caracteristica} ${n.celular_numero}`,
      n.email || "",
      n.recibir_informacion ? "SI" : "NO",
      new Date(n.created_at).toLocaleDateString("es-AR"),
    ])
    descargarCSV(headers, rows, `nomembros_sentir_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  if (!isOpen) return null

  const miembrosFiltrados = miembros.filter(m =>
    !m[tallerFiltro] &&
    (tallerFiltro !== "taller_myl" || m.taller_transformacion)
  )
  const tallerLabel = TALLERES.find(t => t.key === tallerFiltro)?.label || ""

  const titulos: Record<Vista, string> = {
    menu: "Panel Administrador",
    miembros: "Miembros de Sentir",
    nomembros: "No Miembros",
    taller: "Filtrar por Taller",
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" onClick={() => vista !== "menu" ? setVista("menu") : onClose()} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-xl shadow-2xl pointer-events-auto w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              {vista !== "menu" && (
                <button
                  onClick={() => setVista("menu")}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  title="Volver al menú"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <h2 className="text-xl font-bold">{titulos[vista]}</h2>
              {!cargando && vista === "miembros" && miembros.length > 0 && (
                <span className="text-sm text-muted-foreground">{miembros.length} registros</span>
              )}
              {!cargando && vista === "nomembros" && nomembros.length > 0 && (
                <span className="text-sm text-muted-foreground">{nomembros.length} registros</span>
              )}
              {!cargando && vista === "taller" && miembros.length > 0 && (
                <span className="text-sm text-muted-foreground">{miembrosFiltrados.length} sin el taller</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {vista !== "menu" && (
                <button
                  onClick={recargar}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  title="Actualizar"
                >
                  <RefreshCw className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`} />
                </button>
              )}
              {vista === "miembros" && miembros.length > 0 && (
                <Button
                  onClick={() => exportarCSVMiembros(miembros, `miembros_sentir_${new Date().toISOString().slice(0, 10)}.csv`)}
                  variant="outline" size="sm" className="gap-2"
                >
                  <Download className="h-4 w-4" /> Exportar CSV
                </Button>
              )}
              {vista === "nomembros" && nomembros.length > 0 && (
                <Button onClick={exportarCSVNomembros} variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Exportar CSV
                </Button>
              )}
              {vista === "taller" && miembrosFiltrados.length > 0 && (
                <Button
                  onClick={() => exportarCSVMiembros(
                    miembrosFiltrados,
                    `sin_${tallerLabel.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
                  )}
                  variant="outline" size="sm" className="gap-2"
                >
                  <Download className="h-4 w-4" /> Exportar CSV
                </Button>
              )}
              <button onClick={() => vista !== "menu" ? setVista("menu") : onClose()} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-auto flex-1 px-6 py-4">

            {/* Menú principal */}
            {vista === "menu" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                <button
                  onClick={() => irA("miembros")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
                >
                  <Users className="h-10 w-10 text-blue-900 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Miembros</span>
                  <span className="text-sm text-muted-foreground text-center">Ver todos los miembros de Sentir registrados</span>
                </button>
                <button
                  onClick={() => irA("nomembros")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
                >
                  <UserX className="h-10 w-10 text-blue-900 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">No Miembros</span>
                  <span className="text-sm text-muted-foreground text-center">Ver los interesados que aún no son miembros</span>
                </button>
                <button
                  onClick={() => irA("taller")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
                >
                  <Filter className="h-10 w-10 text-blue-900 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Filtrar por Taller</span>
                  <span className="text-sm text-muted-foreground text-center">Miembros que no realizaron un taller específico</span>
                </button>
              </div>
            )}

            {/* Spinner */}
            {cargando && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Cargando...</p>
              </div>
            )}

            {/* Vista Miembros */}
            {!cargando && vista === "miembros" && (
              miembros.length === 0
                ? <p className="text-center text-muted-foreground py-8">No hay miembros registrados.</p>
                : <TablaMiembros miembros={miembros} />
            )}

            {/* Vista No Miembros */}
            {!cargando && vista === "nomembros" && (
              nomembros.length === 0
                ? <p className="text-center text-muted-foreground py-8">No hay no-miembros registrados.</p>
                : <TablaNomembros nomembros={nomembros} />
            )}

            {/* Vista Filtrar por Taller */}
            {!cargando && vista === "taller" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-sm font-medium">Taller sin realizar:</label>
                  <select
                    value={tallerFiltro}
                    onChange={e => setTallerFiltro(e.target.value as TallerKey)}
                    className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {TALLERES.map(t => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                  {miembros.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {miembrosFiltrados.length} miembro{miembrosFiltrados.length !== 1 ? "s" : ""} sin {tallerLabel}
                      {tallerFiltro === "taller_myl" && " (con Transformación realizada)"}
                    </span>
                  )}
                </div>
                {miembros.length === 0
                  ? <p className="text-center text-muted-foreground py-8">Cargando miembros...</p>
                  : miembrosFiltrados.length === 0
                    ? <p className="text-center text-muted-foreground py-8">Todos los miembros realizaron este taller. ✅</p>
                    : <TablaMiembros miembros={miembrosFiltrados} />
                }
              </div>
            )}

          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

function TablaMiembros({ miembros }: { miembros: Miembro[] }) {
  const t = (v: boolean) => v ? "✅" : "❌"
  return (
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
  )
}

function TablaNomembros({ nomembros }: { nomembros: Nomembro[] }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b-2 border-border bg-muted/50">
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nº</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nombre</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Celular</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Email</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Recibir Info</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {nomembros.map((n, i) => (
          <tr key={n.numero} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
            <td className="px-2 py-2 font-medium">{n.numero}</td>
            <td className="px-2 py-2 whitespace-nowrap">{n.nombre_apellido.trim()}</td>
            <td className="px-2 py-2 whitespace-nowrap">{n.celular_caracteristica} {n.celular_numero}</td>
            <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{n.email || "—"}</td>
            <td className="text-center px-2 py-2">{n.recibir_informacion ? "✅" : "❌"}</td>
            <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("es-AR")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
