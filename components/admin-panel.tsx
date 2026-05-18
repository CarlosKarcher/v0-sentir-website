"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import * as XLSX from "xlsx"
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
  fecha_nacimiento: string | null
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

type Vista = "menu" | "inscripciones" | "miembros" | "nomembros" | "taller" | "realizados"
type InscripcionesTab = "inscriptos" | "precios" | "por_taller"

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
  const [inscripcionesRealizadas, setInscripcionesRealizadas] = useState<InscripcionConTaller[]>([])
  const [talleresList, setTalleresList] = useState<Taller[]>([])
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "confirmado" | "cancelado">("todos")
  const [filtroTallerSlug, setFiltroTallerSlug] = useState<string>("")
  const [filtroSede, setFiltroSede] = useState<string>("")
  const [editandoPrecio, setEditandoPrecio] = useState<string | null>(null) // taller id
  const [precioEdit, setPrecioEdit] = useState({ precio: "", sede: "", descuento_tipo: "porcentaje" as "porcentaje" | "monto_fijo" | null, descuento_valor: "", acepta_transferencia: true, acepta_tarjeta: true, acepta_sena: true, fecha_inicio: "" })
  const [guardandoPrecio, setGuardandoPrecio] = useState(false)
  const [agregandoTaller, setAgregandoTaller] = useState(false)
  const [nuevoTaller, setNuevoTaller] = useState({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "" as "porcentaje" | "monto_fijo" | "", descuento_valor: "", fecha_inicio: "" })
  const [accionInscripcion, setAccionInscripcion] = useState<string | null>(null) // inscripcion id en proceso
  const [confirmDialog, setConfirmDialog] = useState<{ titulo: string; mensaje: string; tipo: "confirm" | "info"; onConfirm?: () => void } | null>(null)
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

  const cargarInscripcionesRealizadas = async () => {
    setCargando(true)
    const { data } = await supabase
      .from("inscripciones_realizadas")
      .select("*, talleres(nombre, slug)")
      .order("creado_en", { ascending: false })
    if (Array.isArray(data)) {
      setInscripcionesRealizadas(data.map((r: any) => ({
        ...r,
        taller_nombre: r.talleres?.nombre ?? "",
        taller_slug: r.talleres?.slug ?? "",
      })) as InscripcionConTaller[])
    }
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

  const actualizarPrecioInscripto = async (id: string, precio: number) => {
    await supabase.rpc("actualizar_precio_inscripto", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
      p_precio_inscripto: precio,
    })
    setInscripciones(prev => prev.map(i => i.id === id ? { ...i, precio_inscripto: precio } : i))
  }

  const eliminarInscripcion = (id: string) => {
    setConfirmDialog({
      titulo: "Eliminar inscripción",
      mensaje: "¿Seguro que querés eliminar esta inscripción?",
      tipo: "confirm",
      onConfirm: async () => {
        setConfirmDialog(null)
        setAccionInscripcion(id)
        await supabase.rpc("eliminar_inscripcion", {
          p_admin_caracteristica: adminCaracteristica,
          p_admin_numero: adminNumero,
          p_inscripcion_id: id,
        })
        await cargarInscripciones()
        setAccionInscripcion(null)
      },
    })
  }

  const eliminarTaller = (tallerId: string, nombreTaller: string) => {
    const count = inscripciones.filter(i => i.taller_id === tallerId).length
    if (count > 0) {
      setConfirmDialog({
        titulo: "No se puede eliminar",
        mensaje: `"${nombreTaller}" tiene ${count} inscripción${count !== 1 ? "es" : ""} vinculada${count !== 1 ? "s" : ""}. Para eliminarlo, primero eliminá las inscripciones.`,
        tipo: "info",
      })
      return
    }
    setConfirmDialog({
      titulo: "Confirmar eliminación",
      mensaje: `¿Seguro que querés eliminar "${nombreTaller}"?`,
      tipo: "confirm",
      onConfirm: async () => {
        setConfirmDialog(null)
        const { data, error } = await supabase.rpc("eliminar_taller_admin", {
          p_admin_caracteristica: adminCaracteristica,
          p_admin_numero: adminNumero,
          p_taller_id: tallerId,
        })
        if (error || data?.error) {
          setConfirmDialog({ titulo: "Error al eliminar", mensaje: data?.error || error?.message || "No se pudo eliminar el taller.", tipo: "info" })
          return
        }
        setTalleresList(prev => prev.filter(t => t.id !== tallerId))
      },
    })
  }

  const guardarPrecio = async (tallerId: string) => {
    setGuardandoPrecio(true)
    const { error } = await supabase.rpc("actualizar_precio_taller", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_taller_id: tallerId,
      p_precio: parseFloat(precioEdit.precio) || 0,
      p_descuento_tipo: precioEdit.descuento_tipo ?? "",
      p_descuento_valor: precioEdit.descuento_valor ? parseFloat(precioEdit.descuento_valor) : null,
      p_sede: precioEdit.sede || null,
      p_acepta_transferencia: precioEdit.acepta_transferencia,
      p_acepta_tarjeta: precioEdit.acepta_tarjeta,
      p_acepta_sena: precioEdit.acepta_sena,
      p_fecha_inicio: precioEdit.fecha_inicio || null,
    })
    if (error) { setConfirmDialog({ titulo: "Error al guardar", mensaje: error.message, tipo: "info" }); setGuardandoPrecio(false); return }
    await cargarTalleres()
    setEditandoPrecio(null)
    setGuardandoPrecio(false)
  }

  const guardarNuevoTaller = async () => {
    if (!nuevoTaller.slug || !nuevoTaller.nombre) return
    setGuardandoPrecio(true)
    const { error } = await supabase.from("talleres").insert({
      slug: nuevoTaller.slug,
      nombre: nuevoTaller.nombre,
      sede: nuevoTaller.sede || null,
      precio: parseFloat(nuevoTaller.precio) || 0,
      descuento_tipo: nuevoTaller.descuento_tipo || null,
      descuento_valor: parseFloat(nuevoTaller.descuento_valor) || null,
      fecha_inicio: nuevoTaller.fecha_inicio || null,
      activo: true,
    })
    if (error) { setConfirmDialog({ titulo: "Error al guardar", mensaje: error.message, tipo: "info" }); setGuardandoPrecio(false); return }
    await cargarTalleres()
    setAgregandoTaller(false)
    setNuevoTaller({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "", descuento_valor: "", fecha_inicio: "" })
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
    if (v === "realizados" && inscripcionesRealizadas.length === 0) cargarInscripcionesRealizadas()
    if (v === "miembros" && miembros.length === 0) cargarMiembros()
    if (v === "nomembros" && nomembros.length === 0) cargarNomembros()
    if (v === "taller" && miembros.length === 0) cargarMiembros()
  }

  const recargar = () => {
    if (vista === "inscripciones") { cargarInscripciones(); cargarTalleres() }
    if (vista === "realizados") cargarInscripcionesRealizadas()
    if (vista === "miembros" || vista === "taller") cargarMiembros()
    if (vista === "nomembros") cargarNomembros()
  }

  useEffect(() => {
    if (!isOpen) {
      setVista("menu")
      setMiembros([])
      setNomembros([])
      setInscripciones([])
      setInscripcionesRealizadas([])
      setTalleresList([])
    }
  }, [isOpen])

  const descargarExcel = (headers: string[], rows: (string | number)[][], filename: string) => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Datos")
    XLSX.writeFile(wb, filename)
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
    descargarExcel(headers, rows, filename.replace(".csv", ".xlsx"))
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
    descargarExcel(headers, rows, `nomembros_sentir_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  if (!isOpen) return null

  const miembrosFiltrados = miembros.filter(m =>
    !m[tallerFiltro] &&
    (tallerFiltro !== "taller_myl" || m.taller_transformacion)
  )
  const tallerLabel = TALLERES.find(t => t.key === tallerFiltro)?.label || ""

  const exportarCSVInscripciones = (data: InscripcionConTaller[]) => {
    const headers = ["Taller", "Evento", "Nombre", "Apellido", "Email", "Teléfono", "DNI", "Ciudad", "F. Nacimiento", "Miembro", "Enrolador", "Tel. Enrolador", "Estado", "Método Pago", "Precio Inscripto", "Monto Pagado", "Mensaje", "Fecha"]
    const rows = data.map(i => [
      i.taller_nombre,
      i.evento_descripcion || "",
      i.nombre,
      i.apellido,
      i.email,
      i.telefono,
      i.dni || "",
      i.ciudad || "",
      i.fecha_nacimiento ? new Date(i.fecha_nacimiento).toLocaleDateString("es-AR") : "",
      i.nombre_miembro || "",
      i.enrolador_nombre || "",
      i.enrolador_telefono || "",
      i.estado,
      i.metodo_pago,
      i.precio_inscripto ?? "",
      i.monto_pagado ?? "",
      i.mensaje_inscripto || "",
      new Date(i.creado_en).toLocaleDateString("es-AR"),
    ])
    descargarExcel(headers, rows, `inscripciones_sentir_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const titulos: Record<Vista, string> = {
    menu: "Panel Administrador",
    inscripciones: "Inscripciones",
    realizados: "Talleres Realizados",
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
                  onClick={() => irA("realizados")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all group"
                >
                  <Check className="h-10 w-10 text-purple-700 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg">Talleres Realizados</span>
                  <span className="text-sm text-muted-foreground text-center">Historial de inscriptos en talleres ya realizados</span>
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
                  <button
                    onClick={() => setInscripcionesTab("por_taller")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inscripcionesTab === "por_taller"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    Filtro por Taller-Sede
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
                    {(() => {
                      const inscFiltradas = filtroEstado === "todos" ? inscripciones : inscripciones.filter(i => i.estado === filtroEstado)
                      const totalPagado = inscFiltradas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0)
                      return (
                        <div className="flex items-center gap-6 flex-wrap">
                          <div className="flex items-center gap-3">
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
                          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-1.5">
                            <span className="text-sm text-green-700 dark:text-green-300 font-medium">Total recaudado:</span>
                            <span className="text-sm font-bold text-green-800 dark:text-green-200">${totalPagado.toLocaleString("es-AR")} ARS</span>
                            <span className="text-sm text-green-600 dark:text-green-400">— Page: ${Math.round(totalPagado * 0.07).toLocaleString("es-AR")} ARS</span>
                          </div>
                        </div>
                      )
                    })()}
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
                        onActualizarPrecio={actualizarPrecioInscripto}
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
                            <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Fecha Inicio</th>
                            <th className="text-left px-3 py-2 font-semibold">Sede</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Precio Real</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Descuento</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Precio Final</th>
                            <th className="text-center px-3 py-2 font-semibold whitespace-nowrap">Transfer.</th>
                            <th className="text-center px-3 py-2 font-semibold whitespace-nowrap">Tarjeta</th>
                            <th className="text-center px-3 py-2 font-semibold whitespace-nowrap">Seña</th>
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
                                <input
                                  type="date"
                                  value={nuevoTaller.fecha_inicio ?? ""}
                                  onChange={e => setNuevoTaller(p => ({ ...p, fecha_inicio: e.target.value }))}
                                  className="border border-border rounded px-2 py-1 text-sm bg-background w-36"
                                />
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
                          {talleresList.filter(t => !t.fecha_inicio || t.fecha_inicio.slice(0, 10) >= new Date().toISOString().slice(0, 10)).map((t, i) => {
                            const precios = calcularPrecioFinal(t)
                            const editando = editandoPrecio === t.id
                            return (
                              <tr key={t.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                                <td className="px-3 py-2 font-medium whitespace-nowrap">{t.nombre}</td>
                                {editando ? (
                                  <>
                                    <td className="px-3 py-2">
                                      <input
                                        type="date"
                                        value={precioEdit.fecha_inicio}
                                        onChange={e => setPrecioEdit(p => ({ ...p, fecha_inicio: e.target.value }))}
                                        className="border border-border rounded px-2 py-1 text-sm bg-background w-36"
                                      />
                                    </td>
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
                                      <input type="checkbox" checked={precioEdit.acepta_transferencia} onChange={e => setPrecioEdit(p => ({ ...p, acepta_transferencia: e.target.checked }))} className="w-4 h-4 accent-green-600 cursor-pointer" title="Transferencia" />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <input type="checkbox" checked={precioEdit.acepta_tarjeta} onChange={e => setPrecioEdit(p => ({ ...p, acepta_tarjeta: e.target.checked }))} className="w-4 h-4 accent-green-600 cursor-pointer" title="Tarjeta" />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <input type="checkbox" checked={precioEdit.acepta_sena} onChange={e => setPrecioEdit(p => ({ ...p, acepta_sena: e.target.checked }))} className="w-4 h-4 accent-green-600 cursor-pointer" title="Seña" />
                                    </td>
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
                                    <td className="px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">
                                      {t.fecha_inicio
                                        ? (() => { const [y, m, d] = t.fecha_inicio.slice(0, 10).split("-"); return `${d}/${m}/${y}` })()
                                        : <span className="italic">—</span>}
                                    </td>
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
                                    <td className="px-3 py-2 text-center text-lg">{t.acepta_transferencia ? "✅" : "❌"}</td>
                                    <td className="px-3 py-2 text-center text-lg">{t.acepta_tarjeta ? "✅" : "❌"}</td>
                                    <td className="px-3 py-2 text-center text-lg">{t.acepta_sena ? "✅" : "❌"}</td>
                                    <td className="px-3 py-2 text-center">
                                      <div className="flex gap-1 justify-center items-center">
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
                                            acepta_transferencia: t.acepta_transferencia ?? true,
                                            acepta_tarjeta: t.acepta_tarjeta ?? true,
                                            acepta_sena: t.acepta_sena ?? true,
                                            fecha_inicio: (t.fecha_inicio ?? "").slice(0, 10),
                                          })
                                        }}
                                        className="h-7 px-2 text-xs"
                                      >
                                        <DollarSign className="h-3 w-3 mr-1" /> Editar
                                      </Button>
                                      <button
                                        onClick={() => eliminarTaller(t.id, `${t.nombre}${t.sede ? ` — ${t.sede}` : ""}`)}
                                        title="Eliminar taller"
                                        className="w-7 h-7 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center transition-colors shadow-sm"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                      </div>
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

                {/* Tab Filtro por Taller-Sede */}
                {!cargando && inscripcionesTab === "por_taller" && (() => {
                  // Opciones únicas de taller y sede desde las inscripciones cargadas
                  const talleresUnicos = Array.from(new Map(inscripciones.map(i => [i.taller_slug, i.taller_nombre])).entries())
                  const sedesUnicas = Array.from(new Set(inscripciones.map(i => i.localidad_taller).filter(Boolean))) as string[]

                  const filtradas = inscripciones
                    .filter(i => (!filtroTallerSlug || i.taller_slug === filtroTallerSlug) && (!filtroSede || i.localidad_taller === filtroSede))
                    .sort((a, b) => {
                      const orden: Record<string, number> = { confirmado: 0, pendiente: 1, cancelado: 2 }
                      return (orden[a.estado] ?? 3) - (orden[b.estado] ?? 3)
                    })

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium whitespace-nowrap">Taller:</label>
                          <select
                            value={filtroTallerSlug}
                            onChange={e => setFiltroTallerSlug(e.target.value)}
                            className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Todos</option>
                            {talleresUnicos.map(([slug, nombre]) => (
                              <option key={slug} value={slug}>{nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium whitespace-nowrap">Sede:</label>
                          <select
                            value={filtroSede}
                            onChange={e => setFiltroSede(e.target.value)}
                            className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Todas</option>
                            {sedesUnicas.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {filtradas.length} inscripciones
                          {"  "}
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            ${filtradas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0).toLocaleString("es-AR")} recaudado — Page: ${Math.round(filtradas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0) * 0.07).toLocaleString("es-AR")} ARS
                          </span>
                        </span>
                      </div>

                      {filtradas.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No hay inscripciones para este filtro.</p>
                      ) : (
                        <TablaInscripciones
                          inscripciones={filtradas}
                          accionInscripcion={accionInscripcion}
                          onAprobar={aprobarInscripcion}
                          onCancelar={cancelarInscripcion}
                          onEliminar={eliminarInscripcion}
                          onActualizarMonto={actualizarMontoPagado}
                          onActualizarPrecio={actualizarPrecioInscripto}
                        />
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Spinner */}
            {vista !== "inscripciones" && cargando && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Cargando...</p>
              </div>
            )}

            {/* Vista Talleres Realizados */}
            {vista === "realizados" && (
              <div className="space-y-4">
                {cargando && (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  </div>
                )}
                {!cargando && inscripcionesRealizadas.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay inscripciones realizadas.</p>
                )}
                {!cargando && inscripcionesRealizadas.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm text-muted-foreground">{inscripcionesRealizadas.length} inscripciones realizadas</span>
                      <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg px-4 py-1.5">
                        <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total recaudado:</span>
                        <span className="text-sm font-bold text-purple-800 dark:text-purple-200">
                          ${inscripcionesRealizadas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0).toLocaleString("es-AR")} ARS
                        </span>
                        <span className="text-sm text-purple-600 dark:text-purple-400">— Page: ${Math.round(inscripcionesRealizadas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0) * 0.07).toLocaleString("es-AR")} ARS</span>
                      </div>
                      <Button
                        onClick={() => exportarCSVInscripciones(inscripcionesRealizadas)}
                        variant="outline" size="sm" className="gap-2"
                      >
                        <Download className="h-4 w-4" /> Exportar CSV
                      </Button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-3 py-2 font-semibold">Taller</th>
                            <th className="text-left px-3 py-2 font-semibold">Nombre</th>
                            <th className="text-left px-3 py-2 font-semibold">Apellido</th>
                            <th className="text-left px-3 py-2 font-semibold">Email</th>
                            <th className="text-left px-3 py-2 font-semibold">Teléfono</th>
                            <th className="text-left px-3 py-2 font-semibold">Sede</th>
                            <th className="text-right px-3 py-2 font-semibold">Monto Pagado</th>
                            <th className="text-left px-3 py-2 font-semibold">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inscripcionesRealizadas.map((ins, i) => (
                            <tr key={ins.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                              <td className="px-3 py-2 font-medium">{ins.taller_nombre}</td>
                              <td className="px-3 py-2">{ins.nombre}</td>
                              <td className="px-3 py-2">{ins.apellido}</td>
                              <td className="px-3 py-2 text-xs">{ins.email}</td>
                              <td className="px-3 py-2">{ins.telefono}</td>
                              <td className="px-3 py-2">{ins.localidad_taller || "-"}</td>
                              <td className="px-3 py-2 text-right font-semibold text-green-700 dark:text-green-400">
                                {ins.monto_pagado != null ? `$${ins.monto_pagado.toLocaleString("es-AR")}` : "-"}
                              </td>
                              <td className="px-3 py-2 text-xs text-muted-foreground">
                                {new Date(ins.creado_en).toLocaleDateString("es-AR")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
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
      {/* Diálogo personalizado (confirmación o información) */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
          <div className="relative bg-background rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4 border border-border">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmDialog.tipo === "info" ? "bg-amber-100 dark:bg-amber-900/40" : "bg-red-100 dark:bg-red-900/40"}`}>
                {confirmDialog.tipo === "info"
                  ? <Ban className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  : <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                }
              </div>
              <div>
                <p className="font-semibold text-base">{confirmDialog.titulo}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{confirmDialog.mensaje}</p>
                {confirmDialog.tipo === "confirm" && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Esta acción no se puede deshacer.</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              {confirmDialog.tipo === "confirm" ? (
                <>
                  <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancelar</Button>
                  <Button variant="destructive" onClick={confirmDialog.onConfirm}>Sí, eliminar</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cerrar</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}

const METODO_PAGO_LABEL: Record<string, string> = {
  transferencia_total: "Pago total",
  tarjeta_credito: "Tarjeta de Crédito",
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
  onActualizarPrecio,
}: {
  inscripciones: InscripcionConTaller[]
  accionInscripcion: string | null
  onAprobar: (id: string) => void
  onCancelar: (id: string) => void
  onEliminar: (id: string) => void
  onActualizarMonto: (id: string, monto: number) => Promise<void>
  onActualizarPrecio: (id: string, precio: number) => Promise<void>
}) {
  const [montosEdit, setMontosEdit] = useState<Record<string, string>>({})
  const [guardandoMonto, setGuardandoMonto] = useState<string | null>(null)
  const [preciosEdit, setPreciosEdit] = useState<Record<string, string>>({})
  const [guardandoPrecioInsc, setGuardandoPrecioInsc] = useState<string | null>(null)

  const estadoBadge = (estado: string) => {
    if (estado === "confirmado") return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    if (estado === "cancelado") return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
  }

  const getPrecioEfectivo = (ins: InscripcionConTaller) => {
    const editado = parseFloat(preciosEdit[ins.id] ?? "")
    if (!isNaN(editado)) return editado
    return ins.precio_inscripto ?? calcularPrecioFinal({ precio: ins.taller_precio, descuento_tipo: ins.taller_descuento_tipo, descuento_valor: ins.taller_descuento_valor }).precioFinal
  }

  const checkAutoConfirmar = async (ins: InscripcionConTaller, precio: number, montoPagado: number) => {
    if (ins.estado !== "confirmado" && (precio === 0 || montoPagado >= precio)) {
      await onAprobar(ins.id)
    }
  }

  const guardarPrecioInscripto = async (ins: InscripcionConTaller) => {
    const val = parseFloat(preciosEdit[ins.id] ?? "")
    if (isNaN(val)) return
    setGuardandoPrecioInsc(ins.id)
    await onActualizarPrecio(ins.id, val)
    const montoPagadoEdited = parseFloat(montosEdit[ins.id] ?? "")
    const montoPagado = isNaN(montoPagadoEdited) ? (ins.monto_pagado ?? 0) : montoPagadoEdited
    await checkAutoConfirmar(ins, val, montoPagado)
    setGuardandoPrecioInsc(null)
  }

  const guardarMonto = async (ins: InscripcionConTaller) => {
    const val = parseFloat(montosEdit[ins.id] ?? "")
    if (isNaN(val)) return
    const precioEfectivo = getPrecioEfectivo(ins)
    setGuardandoMonto(ins.id)
    await onActualizarMonto(ins.id, val)
    await checkAutoConfirmar(ins, precioEfectivo, val)
    setGuardandoMonto(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[1100px]">
        <thead>
          <tr className="border-b-2 border-border bg-muted/50">
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Taller</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nombre</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Miembro</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Enrolador</th>
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
            const precioEfectivo = getPrecioEfectivo(ins)
            const precioEditVal = preciosEdit[ins.id]
            const montoEditVal = montosEdit[ins.id]
            const montoPagado = montoEditVal !== undefined ? parseFloat(montoEditVal) || 0 : (ins.monto_pagado ?? 0)
            const saldo = precioEfectivo > 0 ? precioEfectivo - montoPagado : 0
            return (
              <tr key={ins.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                <td className="px-2 py-2 whitespace-nowrap font-medium text-xs">{ins.taller_nombre}</td>
                <td className={`px-2 py-2 whitespace-nowrap font-medium ${ins.metodo_pago === "tarjeta_credito" ? "text-green-600 dark:text-green-400" : ""}`}>{ins.nombre} {ins.apellido}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{ins.nombre_miembro || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">
                  {ins.enrolador_nombre
                    ? `${ins.enrolador_nombre}${ins.enrolador_telefono ? ` — ${ins.enrolador_telefono}` : ""}`
                    : "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{ins.email}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs">{ins.telefono}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{ins.localidad_taller || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      value={precioEditVal ?? (ins.precio_inscripto ?? "")}
                      onChange={e => setPreciosEdit(p => ({ ...p, [ins.id]: e.target.value }))}
                      onBlur={() => guardarPrecioInscripto(ins)}
                      disabled={guardandoPrecioInsc === ins.id}
                      placeholder="0"
                      className="w-24 border border-border rounded px-2 py-0.5 text-right bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {guardandoPrecioInsc === ins.id && <span className="text-muted-foreground text-xs">...</span>}
                  </div>
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs font-semibold ${ins.metodo_pago === "tarjeta_credito" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  {precioEfectivo === 0 ? "Gratuito" : (METODO_PAGO_LABEL[ins.metodo_pago] || ins.metodo_pago || "—")}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      value={montoEditVal ?? (precioEfectivo === 0 ? 0 : (ins.monto_pagado ?? ""))}
                      onChange={e => setMontosEdit(p => ({ ...p, [ins.id]: e.target.value }))}
                      onBlur={() => guardarMonto(ins)}
                      disabled={guardandoMonto === ins.id}
                      placeholder="0"
                      className="w-24 border border-border rounded px-2 py-0.5 text-right bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {guardandoMonto === ins.id && <span className="text-muted-foreground text-xs">...</span>}
                  </div>
                </td>
                <td className={`px-2 py-2 whitespace-nowrap text-xs text-right font-semibold ${saldo > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {precioEfectivo > 0 ? `$${saldo.toLocaleString("es-AR")}` : "$0"}
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
                    {ins.estado === "confirmado" ? (
                      <div title="Confirmado" className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm opacity-70">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : ins.estado !== "cancelado" && saldo <= 0 && precioEfectivo > 0 ? (
                      <button
                        disabled={accionInscripcion === ins.id}
                        onClick={() => onAprobar(ins.id)}
                        title="Aprobar"
                        className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : null}
                    {ins.estado !== "confirmado" && ins.estado !== "cancelado" && (
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
  const [orden, setOrden] = useState<"numero" | "nombre" | "talleres">("numero")
  const [dir, setDir] = useState<"asc" | "desc">("asc")
  const [busqueda, setBusqueda] = useState("")

  const totalTalleres = (m: Miembro) =>
    [m.taller_autoconocimiento, m.taller_transformacion, m.taller_myl,
     m.taller_guerrero, m.taller_biodecodificacion, m.taller_nino_interior, m.taller_constelaciones]
    .filter(Boolean).length

  const talleresLiderazgo = (m: Miembro) =>
    [m.taller_autoconocimiento, m.taller_transformacion, m.taller_myl].filter(Boolean).length

  const filtrados = busqueda.trim()
    ? miembros.filter(m => m.nombre_apellido.toLowerCase().includes(busqueda.toLowerCase()))
    : miembros

  const sorted = [...filtrados].sort((a, b) => {
    let cmp = 0
    if (orden === "nombre") {
      cmp = a.nombre_apellido.trim().localeCompare(b.nombre_apellido.trim(), "es")
    } else if (orden === "talleres") {
      const ta = totalTalleres(a), tb = totalTalleres(b)
      if (ta !== tb) cmp = tb - ta
      else cmp = talleresLiderazgo(b) - talleresLiderazgo(a)
    } else {
      cmp = a.numero - b.numero
    }
    return dir === "asc" ? cmp : -cmp
  })

  const toggleOrden = (nuevo: typeof orden) => {
    if (orden === nuevo) setDir(d => d === "asc" ? "desc" : "asc")
    else { setOrden(nuevo); setDir(nuevo === "talleres" ? "desc" : "asc") }
  }

  const arrow = (col: typeof orden) => orden === col ? (dir === "asc" ? " ▲" : " ▼") : ""

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
          className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary w-64"
        />
        {busqueda && (
          <button onClick={() => setBusqueda("")} className="text-xs text-muted-foreground hover:text-foreground underline">
            Limpiar
          </button>
        )}
        {busqueda && <span className="text-xs text-muted-foreground">{sorted.length} resultado{sorted.length !== 1 ? "s" : ""}</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Ordenar por:</span>
        <button onClick={() => toggleOrden("numero")} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${orden === "numero" ? "bg-blue-900 text-white border-blue-900" : "border-border hover:border-blue-900"}`}>
          Nº{arrow("numero")}
        </button>
        <button onClick={() => toggleOrden("nombre")} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${orden === "nombre" ? "bg-blue-900 text-white border-blue-900" : "border-border hover:border-blue-900"}`}>
          Nombre{arrow("nombre")}
        </button>
        <button onClick={() => toggleOrden("talleres")} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${orden === "talleres" ? "bg-blue-900 text-white border-blue-900" : "border-border hover:border-blue-900"}`}>
          Talleres hechos{arrow("talleres")}
        </button>
      </div>
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b-2 border-border bg-muted/50">
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nº</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Nombre</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Gafete</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Celular</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Fecha Nac.</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap">Email</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Auto</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Transf</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">MyL</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Guerrero</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Biodec</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Niño Int</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Constel</th>
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Total</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((m, i) => (
          <tr key={m.numero} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
            <td className="px-2 py-2 font-medium">{m.numero}</td>
            <td className="px-2 py-2 whitespace-nowrap">{m.nombre_apellido.trim()}</td>
            <td className="px-2 py-2 whitespace-nowrap">{m.nombre_gafete?.trim()}</td>
            <td className="px-2 py-2 whitespace-nowrap">{m.celular_caracteristica} {m.celular_numero}</td>
            <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">
              {m.fecha_nacimiento ? (() => { const [y,mo,d] = m.fecha_nacimiento!.slice(0,10).split("-"); return `${d}/${mo}/${y}` })() : "—"}
            </td>
            <td className="px-2 py-2 whitespace-nowrap text-xs text-muted-foreground">{m.email || "—"}</td>
            <td className="text-center px-2 py-2">{t(m.taller_autoconocimiento)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_transformacion)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_myl)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_guerrero)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_biodecodificacion)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_nino_interior)}</td>
            <td className="text-center px-2 py-2">{t(m.taller_constelaciones)}</td>
            <td className="text-center px-2 py-2 font-semibold text-blue-900 dark:text-blue-300">{totalTalleres(m)}/7</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
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
