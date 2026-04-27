"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-client"
import { X, Download, RefreshCw, ArrowLeft, Users, UserX, Filter, ClipboardList, DollarSign, Check, Ban, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calcularPrecioFinal } from "@/types/database"
import type { Taller, InscripcionConTaller } from "@/types/database"

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

type Vista = "menu" | "inscripciones" | "miembros" | "nomembros" | "taller"
type InscripcionesTab = "inscriptos" | "precios"

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

  // Inscripciones
  const [inscripcionesTab, setInscripcionesTab] = useState<InscripcionesTab>("inscriptos")
  const [inscripciones, setInscripciones] = useState<InscripcionConTaller[]>([])
  const [talleresList, setTalleresList] = useState<Taller[]>([])
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "confirmado" | "cancelado">("todos")
  const [editandoPrecio, setEditandoPrecio] = useState<string | null>(null) // taller id
  const [precioEdit, setPrecioEdit] = useState({ precio: "", sede: "", descuento_tipo: "porcentaje" as "porcentaje" | "monto_fijo" | null, descuento_valor: "" })
  const [guardandoPrecio, setGuardandoPrecio] = useState(false)
  const [agregandoTaller, setAgregandoTaller] = useState(false)
  const [nuevoTaller, setNuevoTaller] = useState({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "" as "porcentaje" | "monto_fijo" | "", descuento_valor: "" })
  const [accionInscripcion, setAccionInscripcion] = useState<string | null>(null) // inscripcion id en proceso
  const [sedes, setSedes] = useState<string[]>([])

  const cargarSedes = async () => {
    const { data } = await supabase.from("sedes_sentir").select("nombre").eq("activo", true).order("orden")
    if (Array.isArray(data)) setSedes(data.map((s: { nombre: string }) => s.nombre))
  }

  const cargarInscripciones = async () => {
    setCargando(true)
    const { data } = await supabase.rpc("listar_inscripciones", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
    })
    if (Array.isArray(data)) setInscripciones(data as InscripcionConTaller[])
    setCargando(false)
  }

  const cargarTalleres = async () => {
    const { data } = await supabase.rpc("listar_talleres_admin", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
    })
    if (Array.isArray(data)) setTalleresList(data as Taller[])
  }

  const aprobarInscripcion = async (id: string) => {
    setAccionInscripcion(id)
    await supabase.rpc("aprobar_inscripcion", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
    })
    await cargarInscripciones()
    setAccionInscripcion(null)
  }

  const cancelarInscripcion = async (id: string) => {
    setAccionInscripcion(id)
    await supabase.rpc("cancelar_inscripcion", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
    })
    await cargarInscripciones()
    setAccionInscripcion(null)
  }

  const actualizarMontoPagado = async (id: string, monto: number) => {
    await supabase.rpc("actualizar_monto_pagado", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
      p_monto_pagado: monto,
    })
    setInscripciones(prev => prev.map(i => i.id === id ? { ...i, monto_pagado: monto } : i))
  }

  const eliminarInscripcion = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta inscripción? Esta acción no se puede deshacer.")) return
    setAccionInscripcion(id)
    await supabase.rpc("eliminar_inscripcion", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
    })
    await cargarInscripciones()
    setAccionInscripcion(null)
  }

  const guardarPrecio = async (tallerId: string) => {
    setGuardandoPrecio(true)
    await supabase.rpc("actualizar_precio_taller", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_taller_id: tallerId,
      p_precio: parseFloat(precioEdit.precio) || 0,
      p_descuento_tipo: precioEdit.descuento_tipo,
      p_descuento_valor: parseFloat(precioEdit.descuento_valor) || null,
      p_sede: precioEdit.sede || null,
    })
    await cargarTalleres()
    setEditandoPrecio(null)
    setGuardandoPrecio(false)
  }

  const guardarNuevoTaller = async () => {
    if (!nuevoTaller.slug || !nuevoTaller.nombre) return
    setGuardandoPrecio(true)
    await supabase.rpc("insertar_taller_admin", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_slug: nuevoTaller.slug,
      p_nombre: nuevoTaller.nombre,
      p_sede: nuevoTaller.sede || null,
      p_precio: parseFloat(nuevoTaller.precio) || 0,
      p_descuento_tipo: nuevoTaller.descuento_tipo || null,
      p_descuento_valor: parseFloat(nuevoTaller.descuento_valor) || null,
    })
    await cargarTalleres()
    setAgregandoTaller(false)
    setNuevoTaller({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "", descuento_valor: "" })
    setGuardandoPrecio(false)
  }

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
    if (v === "inscripciones") {
      if (inscripciones.length === 0) cargarInscripciones()
      if (talleresList.length === 0) cargarTalleres()
      if (sedes.length === 0) cargarSedes()
    }
    if (v === "miembros" && miembros.length === 0) cargarMiembros()
    if (v === "nomembros" && nomembros.length === 0) cargarNomembros()
    if (v === "taller" && miembros.length === 0) cargarMiembros()
  }

  const recargar = () => {
    if (vista === "inscripciones") { cargarInscripciones(); cargarTalleres() }
    if (vista === "miembros" || vista === "taller") cargarMiembros()
    if (vista === "nomembros") cargarNomembros()
  }

  useEffect(() => {
    if (!isOpen) {
      setVista("menu")
      setMiembros([])
      setNomembros([])
      setInscripciones([])
      setTalleresList([])
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

  const exportarCSVInscripciones = (data: InscripcionConTaller[]) => {
    const headers = ["Taller", "Evento", "Nombre", "Apellido", "Email", "Teléfono", "DNI", "Ciudad", "Estado", "Método Pago", "Monto Pagado", "Mensaje", "Fecha"]
    const rows = data.map(i => [
      i.taller_nombre,
      (i as any).evento_descripcion || "",
      i.nombre,
      i.apellido,
      i.email,
      i.telefono,
      i.dni || "",
      i.ciudad || "",
      i.estado,
      i.metodo_pago,
      i.monto_pagado ?? "",
      i.mensaje_inscripto || "",
      new Date(i.creado_en).toLocaleDateString("es-AR"),
    ])
    descargarCSV(headers, rows, `inscripciones_sentir_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const titulos: Record<Vista, string> = {
    menu: "Panel Administrador",
    inscripciones: "Inscripciones",
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
              {!cargando && vista === "inscripciones" && inscripciones.length > 0 && (
                <span className="text-sm text-muted-foreground">{inscripciones.length} inscripciones</span>
              )}
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
              {vista === "inscripciones" && inscripcionesTab === "inscriptos" && inscripciones.length > 0 && (
                <Button
                  onClick={() => exportarCSVInscripciones(
                    filtroEstado === "todos" ? inscripciones : inscripciones.filter(i => i.estado === filtroEstado)
                  )}
                  variant="outline" size="sm" className="gap-2"
                >
                  <Download className="h-4 w-4" /> Exportar CSV
                </Button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                <button
                  onClick={() => irA("inscripciones")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all group"
                >
                  <ClipboardList className="h-10 w-10 text-green-700 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Inscripciones</span>
                  <span className="text-sm text-muted-foreground text-center">Gestionar inscriptos y precios de talleres</span>
                </button>
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

            {/* Vista Inscripciones */}
            {vista === "inscripciones" && (
              <div className="space-y-4">
                {/* Sub-tabs */}
                <div className="flex gap-2 border-b border-border pb-3">
                  <button
                    onClick={() => setInscripcionesTab("inscriptos")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inscripcionesTab === "inscriptos"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    Inscriptos
                  </button>
                  <button
                    onClick={() => { setInscripcionesTab("precios"); if (talleresList.length === 0) cargarTalleres() }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inscripcionesTab === "precios"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    Precios
                  </button>
                </div>

                {cargando && (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  </div>
                )}

                {/* Tab Inscriptos */}
                {!cargando && inscripcionesTab === "inscriptos" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="text-sm font-medium">Filtrar por estado:</label>
                      <select
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value as typeof filtroEstado)}
                        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                    {inscripciones.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No hay inscripciones registradas.</p>
                    ) : (
                      <TablaInscripciones
                        inscripciones={filtroEstado === "todos" ? inscripciones : inscripciones.filter(i => i.estado === filtroEstado)}
                        accionInscripcion={accionInscripcion}
                        onAprobar={aprobarInscripcion}
                        onCancelar={cancelarInscripcion}
                        onEliminar={eliminarInscripcion}
                        onActualizarMonto={actualizarMontoPagado}
                      />
                    )}
                  </div>
                )}

                {/* Tab Precios */}
                {!cargando && inscripcionesTab === "precios" && (
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <Button size="sm" onClick={() => setAgregandoTaller(true)} disabled={agregandoTaller} className="gap-2">
                        + Agregar taller
                      </Button>
                    </div>
                    {talleresList.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Cargando talleres...</p>
                    ) : (
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-border bg-muted/50">
                            <th className="text-left px-3 py-2 font-semibold">Taller</th>
                            <th className="text-left px-3 py-2 font-semibold">Sede</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Precio Real</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Descuento</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Precio Final</th>
                            <th className="text-center px-3 py-2 font-semibold">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Fila para agregar nuevo taller */}
                          {agregandoTaller && (
                            <tr className="border-b border-border/50 bg-blue-50 dark:bg-blue-950/20">
                              <td className="px-3 py-2">
                                <select
                                  value={nuevoTaller.slug}
                                  onChange={e => {
                                    const slug = e.target.value
                                    const nombre = { "autoconocimiento": "Autoconocimiento", "transformacion": "Transformación", "metas-y-logros": "Metas & Logros", "camino-del-guerrero": "El Camino del Guerrero", "biodecodificacion": "Biodecodificación", "sanando-mi-nino-interior": "Sanando mi Niño Interior", "constelaciones-grupales": "Constelaciones Grupales" }[slug] || ""
                                    setNuevoTaller(p => ({ ...p, slug, nombre }))
                                  }}
                                  className="border border-border rounded px-2 py-1 text-sm bg-background w-full"
                                >
                                  <option value="">— Taller —</option>
                                  <option value="autoconocimiento">Autoconocimiento</option>
                                  <option value="transformacion">Transformación</option>
                                  <option value="metas-y-logros">Metas & Logros</option>
                                  <option value="camino-del-guerrero">El Camino del Guerrero</option>
                                  <option value="biodecodificacion">Biodecodificación</option>
                                  <option value="sanando-mi-nino-interior">Sanando mi Niño Interior</option>
                                  <option value="constelaciones-grupales">Constelaciones Grupales</option>
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <select
                                  value={nuevoTaller.sede}
                                  onChange={e => setNuevoTaller(p => ({ ...p, sede: e.target.value }))}
                                  className="border border-border rounded px-2 py-1 text-sm bg-background w-36"
                                >
                                  <option value="">General</option>
                                  {sedes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={nuevoTaller.precio}
                                  onChange={e => setNuevoTaller(p => ({ ...p, precio: e.target.value }))}
                                  placeholder="Precio"
                                  className="w-28 border border-border rounded px-2 py-1 text-right bg-background text-sm"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex gap-1 items-center">
                                  <select
                                    value={nuevoTaller.descuento_tipo}
                                    onChange={e => setNuevoTaller(p => ({ ...p, descuento_tipo: e.target.value as any }))}
                                    className="border border-border rounded px-1 py-1 text-xs bg-background"
                                  >
                                    <option value="">Sin desc.</option>
                                    <option value="porcentaje">%</option>
                                    <option value="monto_fijo">$</option>
                                  </select>
                                  {nuevoTaller.descuento_tipo && (
                                    <input
                                      type="number"
                                      value={nuevoTaller.descuento_valor}
                                      onChange={e => setNuevoTaller(p => ({ ...p, descuento_valor: e.target.value }))}
                                      placeholder="Valor"
                                      className="w-20 border border-border rounded px-2 py-1 text-right bg-background text-sm"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground text-xs">—</td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button size="sm" variant="default" disabled={guardandoPrecio} onClick={guardarNuevoTaller} className="h-7 px-2 text-xs">
                                    {guardandoPrecio ? "..." : "Guardar"}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setAgregandoTaller(false)} className="h-7 px-2 text-xs">
                                    Cancelar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )}
                          {talleresList.map((t, i) => {
                            const precios = calcularPrecioFinal(t)
                            const editando = editandoPrecio === t.id
                            return (
                              <tr key={t.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                                <td className="px-3 py-2 font-medium whitespace-nowrap">{t.nombre}</td>
                                {editando ? (
                                  <>
                                    <td className="px-3 py-2">
                                      <select
                                        value={precioEdit.sede}
                                        onChange={e => setPrecioEdit(p => ({ ...p, sede: e.target.value }))}
                                        className="border border-border rounded px-2 py-1 text-sm bg-background w-36"
                                      >
                                        <option value="">General</option>
                                        {sedes.map(s => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    </td>
                                    <td className="px-3 py-2">
                                      <input
                                        type="number"
                                        value={precioEdit.precio}
                                        onChange={e => setPrecioEdit(p => ({ ...p, precio: e.target.value }))}
                                        className="w-28 border border-border rounded px-2 py-1 text-right bg-background text-sm"
                                        placeholder="Precio"
                                      />
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="flex gap-1 items-center">
                                        <select
                                          value={precioEdit.descuento_tipo ?? ""}
                                          onChange={e => setPrecioEdit(p => ({ ...p, descuento_tipo: (e.target.value || null) as any }))}
                                          className="border border-border rounded px-1 py-1 text-xs bg-background"
                                        >
                                          <option value="">Sin descuento</option>
                                          <option value="porcentaje">%</option>
                                          <option value="monto_fijo">$</option>
                                        </select>
                                        {precioEdit.descuento_tipo && (
                                          <input
                                            type="number"
                                            value={precioEdit.descuento_valor}
                                            onChange={e => setPrecioEdit(p => ({ ...p, descuento_valor: e.target.value }))}
                                            className="w-20 border border-border rounded px-2 py-1 text-right bg-background text-sm"
                                            placeholder="Valor"
                                          />
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 text-right text-muted-foreground text-xs">— calcular al guardar —</td>
                                    <td className="px-3 py-2 text-center">
                                      <div className="flex gap-1 justify-center">
                                        <Button size="sm" variant="default" disabled={guardandoPrecio} onClick={() => guardarPrecio(t.id)} className="h-7 px-2 text-xs">
                                          {guardandoPrecio ? "..." : "Guardar"}
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditandoPrecio(null)} className="h-7 px-2 text-xs">
                                          Cancelar
                                        </Button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">{t.sede || <span className="italic">General</span>}</td>
                                    <td className="px-3 py-2 text-right">${precios.precioReal.toLocaleString("es-AR")} {t.moneda}</td>
                                    <td className="px-3 py-2 text-right text-sm text-muted-foreground">
                                      {t.descuento_tipo === "porcentaje" ? `${t.descuento_valor}%` :
                                       t.descuento_tipo === "monto_fijo" ? `-$${t.descuento_valor?.toLocaleString("es-AR")}` :
                                       "—"}
                                    </td>
                                    <td className={`px-3 py-2 text-right font-semibold ${precios.descuentoMonto > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                                      ${precios.precioFinal.toLocaleString("es-AR")} {t.moneda}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditandoPrecio(t.id)
                                          setPrecioEdit({
                                            precio: t.precio.toString(),
                                            sede: t.sede || "",
                                            descuento_tipo: t.descuento_tipo ?? null,
                                            descuento_valor: t.descuento_valor?.toString() ?? "",
                                          })
                                        }}
                                        className="h-7 px-2 text-xs"
                                      >
                                        <DollarSign className="h-3 w-3 mr-1" /> Editar
                                      </Button>
                                    </td>
                                  </>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Spinner */}
            {vista !== "inscripciones" && cargando && (
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

const METODO_PAGO_LABEL: Record<string, string> = {
  transferencia_total: "Pago total",
  sena: "Seña",
  sena_2_cuotas: "Seña 2 cuotas",
  sena_3_cuotas: "Seña 3 cuotas",
  transferencia: "Transferencia",
}

function TablaInscripciones({
  inscripciones,
  accionInscripcion,
  onAprobar,
  onCancelar,
  onEliminar,
  onActualizarMonto,
}: {
  inscripciones: InscripcionConTaller[]
  accionInscripcion: string | null
  onAprobar: (id: string) => void
  onCancelar: (id: string) => void
  onEliminar: (id: string) => void
  onActualizarMonto: (id: string, monto: number) => Promise<void>
}) {
  const [montosEdit, setMontosEdit] = useState<Record<string, string>>({})
  const [guardandoMonto, setGuardandoMonto] = useState<string | null>(null)

  const estadoBadge = (estado: string) => {
    if (estado === "confirmado") return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    if (estado === "cancelado") return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
  }

  const guardarMonto = async (ins: InscripcionConTaller) => {
    const val = parseFloat(montosEdit[ins.id] ?? "")
    if (isNaN(val)) return
    setGuardandoMonto(ins.id)
    await onActualizarMonto(ins.id, val)
    setGuardandoMonto(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[1100px]">
        <thead>
          <tr className="border-b-2 border-border bg-muted/50">
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Taller</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nombre</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Email</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Teléfono</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Sede</th>
            <th className="text-right px-2 py-2 font-semibold whitespace-nowrap">Monto</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Forma de pago</th>
            <th className="text-right px-2 py-2 font-semibold whitespace-nowrap">Pagado</th>
            <th className="text-right px-2 py-2 font-semibold whitespace-nowrap">Saldo</th>
            <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Estado</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Fecha</th>
            <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((ins, i) => {
            const taller = { precio: ins.taller_precio, descuento_tipo: ins.taller_descuento_tipo, descuento_valor: ins.taller_descuento_valor } as any
            const { precioFinal } = calcularPrecioFinal(taller)
            const montoEditVal = montosEdit[ins.id]
            const montoPagado = montoEditVal !== undefined ? parseFloat(montoEditVal) || 0 : (ins.monto_pagado ?? 0)
            const saldo = precioFinal > 0 ? precioFinal - montoPagado : 0
            return (
              <tr key={ins.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                <td className="px-2 py-2 whitespace-nowrap font-medium text-xs">{ins.taller_nombre}</td>
                <td className="px-2 py-2 whitespace-nowrap">{ins.nombre} {ins.apellido}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{ins.email}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs">{ins.telefono}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{ins.localidad_taller || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-right font-medium">
                  {precioFinal > 0 ? `$${precioFinal.toLocaleString("es-AR")} ${ins.taller_moneda}` : "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">
                  {METODO_PAGO_LABEL[ins.metodo_pago] || ins.metodo_pago || "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      value={montoEditVal ?? (ins.monto_pagado ?? "")}
                      onChange={e => setMontosEdit(p => ({ ...p, [ins.id]: e.target.value }))}
                      onBlur={() => guardarMonto(ins)}
                      disabled={guardandoMonto === ins.id}
                      placeholder="0"
                      className="w-24 border border-border rounded px-2 py-0.5 text-right bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {guardandoMonto === ins.id && <span className="text-muted-foreground text-xs">...</span>}
                  </div>
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-right font-semibold ${saldo > 0 ? "text-red-600 dark:text-red-400" : saldo === 0 && precioFinal > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                  {precioFinal > 0 ? `$${saldo.toLocaleString("es-AR")}` : "—"}
                </td>
                <td className="px-2 py-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge(ins.estado)}`}>
                    {ins.estado}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(ins.creado_en).toLocaleDateString("es-AR")}
                </td>
                <td className="px-2 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    {ins.estado !== "confirmado" && ins.estado !== "cancelado" && (
                      <button
                        disabled={accionInscripcion === ins.id}
                        onClick={() => onAprobar(ins.id)}
                        title="Aprobar"
                        className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {ins.estado !== "cancelado" && (
                      <button
                        disabled={accionInscripcion === ins.id}
                        onClick={() => onCancelar(ins.id)}
                        title="Rechazar"
                        className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      disabled={accionInscripcion === ins.id}
                      onClick={() => onEliminar(ins.id)}
                      title="Eliminar"
                      className="w-8 h-8 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
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
