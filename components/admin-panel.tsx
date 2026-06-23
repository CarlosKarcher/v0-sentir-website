"use client"

import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import * as XLSX from "xlsx"
import { supabase } from "@/lib/supabase-client"
import { X, Download, RefreshCw, ArrowLeft, Users, UserX, Filter, ClipboardList, DollarSign, Check, Ban, Trash2, MessageCircle, Pencil } from "lucide-react"
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
  autoconocimiento_mes: number | null
  autoconocimiento_anio: number | null
  taller_transformacion: boolean
  transformacion_mes: number | null
  transformacion_anio: number | null
  taller_myl: boolean
  myl_mes: number | null
  myl_anio: number | null
  taller_guerrero: boolean
  guerrero_mes: number | null
  guerrero_anio: number | null
  taller_biodecodificacion: boolean
  biodecodificacion_mes: number | null
  biodecodificacion_anio: number | null
  taller_nino_interior: boolean
  nino_interior_mes: number | null
  nino_interior_anio: number | null
  taller_constelaciones: boolean
  constelaciones_mes: number | null
  constelaciones_anio: number | null
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
  const [precioEdit, setPrecioEdit] = useState({ precio: "", sede: "", descuento_tipo: "porcentaje" as "porcentaje" | "monto_fijo" | null, descuento_valor: "", descuento_hasta: "", acepta_transferencia: true, acepta_tarjeta: true, acepta_sena: true, fecha_inicio: "" })
  const [guardandoPrecio, setGuardandoPrecio] = useState(false)
  const [agregandoTaller, setAgregandoTaller] = useState(false)
  const [nuevoTaller, setNuevoTaller] = useState({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "" as "porcentaje" | "monto_fijo" | "", descuento_valor: "", descuento_hasta: "", fecha_inicio: "" })
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

  const enviarEmailPago = async (ins: InscripcionConTaller, tipo: "parcial" | "confirmado", montoPagado: number) => {
    try {
      const precioEfectivo = ins.precio_inscripto ?? calcularPrecioFinal({ precio: ins.taller_precio, descuento_tipo: ins.taller_descuento_tipo, descuento_valor: ins.taller_descuento_valor }).precioFinal
      const saldo = precioEfectivo - montoPagado
      await fetch("/api/send-email-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          nombre: ins.nombre,
          apellido: ins.apellido,
          email: ins.email,
          tallerNombre: ins.taller_nombre,
          localidad: ins.localidad_taller,
          fechaInscripcion: new Date(ins.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
          montoPagado,
          saldo,
          precioTotal: precioEfectivo,
        }),
      })
    } catch { /* silencioso */ }
  }

  const aprobarInscripcion = async (id: string, ins?: InscripcionConTaller, montoPagado?: number) => {
    setAccionInscripcion(id)
    await supabase.rpc("aprobar_inscripcion", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_inscripcion_id: id,
    })
    if (ins) {
      await enviarEmailPago(ins, "confirmado", montoPagado ?? ins.monto_pagado ?? 0)
    }
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
      p_descuento_hasta: precioEdit.descuento_hasta || null,
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
    const { data, error } = await supabase.rpc("insertar_taller_admin", {
      p_admin_caracteristica: adminCaracteristica,
      p_admin_numero: adminNumero,
      p_slug: nuevoTaller.slug,
      p_nombre: nuevoTaller.nombre,
      p_sede: nuevoTaller.sede || null,
      p_precio: parseFloat(nuevoTaller.precio) || 0,
      p_descuento_tipo: nuevoTaller.descuento_tipo || null,
      p_descuento_valor: parseFloat(nuevoTaller.descuento_valor) || null,
      p_descuento_hasta: nuevoTaller.descuento_hasta || null,
      p_fecha_inicio: nuevoTaller.fecha_inicio || null,
    })
    if (error || data?.error) { setConfirmDialog({ titulo: "Error al guardar", mensaje: error?.message || data?.error, tipo: "info" }); setGuardandoPrecio(false); return }
    await cargarTalleres()
    setAgregandoTaller(false)
    setNuevoTaller({ slug: "", nombre: "", sede: "", precio: "", descuento_tipo: "", descuento_valor: "", descuento_hasta: "", fecha_inicio: "" })
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
                      const totalARecaudar = inscFiltradas.filter(i => i.estado !== "cancelado").reduce((acc, i) => acc + (i.precio_inscripto ?? i.taller_precio ?? 0), 0)
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
                          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-1.5">
                            <span className="text-base text-blue-700 dark:text-blue-300 font-medium">Total a Rec:</span>
                            <span className="text-base font-bold text-blue-800 dark:text-blue-200">${totalARecaudar.toLocaleString("es-AR")} ARS</span>
                          </div>
                          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-1.5">
                            <span className="text-base text-green-700 dark:text-green-300 font-medium">Total recaudado:</span>
                            <span className="text-base font-bold text-green-800 dark:text-green-200">${totalPagado.toLocaleString("es-AR")} ARS</span>
                            <span className="text-base text-orange-500 dark:text-orange-400">— Page: ${Math.round(totalPagado * 0.09).toLocaleString("es-AR")} ARS</span>
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
                        onEnviarEmailPago={enviarEmailPago}
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
                                  {nuevoTaller.descuento_tipo && (
                                    <label className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                      Hasta:
                                      <input
                                        type="date"
                                        value={nuevoTaller.descuento_hasta}
                                        onChange={e => setNuevoTaller(p => ({ ...p, descuento_hasta: e.target.value }))}
                                        className="border border-red-400 rounded px-2 py-1 bg-background text-xs"
                                      />
                                    </label>
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
                                        {precioEdit.descuento_tipo && (
                                          <label className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                            Hasta:
                                            <input
                                              type="date"
                                              value={precioEdit.descuento_hasta}
                                              onChange={e => setPrecioEdit(p => ({ ...p, descuento_hasta: e.target.value }))}
                                              className="border border-red-400 rounded px-2 py-1 bg-background text-xs"
                                            />
                                          </label>
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
                                      <div>
                                        {t.descuento_tipo === "porcentaje" ? `${t.descuento_valor}%` :
                                         t.descuento_tipo === "monto_fijo" ? `-$${t.descuento_valor?.toLocaleString("es-AR")}` :
                                         "—"}
                                      </div>
                                      {(t as any).descuento_hasta && (() => {
                                        const [y, m, d] = (t as any).descuento_hasta.slice(0, 10).split("-")
                                        return <div className="text-xs text-red-500 font-medium">hasta {d}/{m}/{y}</div>
                                      })()}
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
                                            descuento_hasta: (t.descuento_hasta ?? "").slice(0, 10),
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
                        <span className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                          {filtradas.length} inscripciones
                          {"  "}
                          <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded-md px-2 py-0.5">
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Total a Rec:</span>
                            <span className="font-bold text-blue-800 dark:text-blue-200">${filtradas.filter(i => i.estado !== "cancelado").reduce((acc, i) => acc + (i.precio_inscripto ?? i.taller_precio ?? 0), 0).toLocaleString("es-AR")} ARS</span>
                          </span>
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            ${filtradas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0).toLocaleString("es-AR")} recaudado — <span className="text-orange-500 dark:text-orange-400">Page: ${Math.round(filtradas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0) * 0.09).toLocaleString("es-AR")} ARS</span>
                          </span>
                        </span>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportarCSVInscripciones(filtradas)}>
                          <Download className="h-4 w-4" /> Exportar CSV
                        </Button>
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
                          onEnviarEmailPago={enviarEmailPago}
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
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-1.5">
                        <span className="text-base text-blue-700 dark:text-blue-300 font-medium">Total a Rec:</span>
                        <span className="text-base font-bold text-blue-800 dark:text-blue-200">
                          ${inscripcionesRealizadas.filter(i => i.estado !== "cancelado").reduce((acc, i) => acc + (i.precio_inscripto ?? i.taller_precio ?? 0), 0).toLocaleString("es-AR")} ARS
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg px-4 py-1.5">
                        <span className="text-base text-purple-700 dark:text-purple-300 font-medium">Total recaudado:</span>
                        <span className="text-base font-bold text-purple-800 dark:text-purple-200">
                          ${inscripcionesRealizadas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0).toLocaleString("es-AR")} ARS
                        </span>
                        <span className="text-base text-purple-600 dark:text-purple-400">— Page: ${Math.round(inscripcionesRealizadas.reduce((acc, i) => acc + (i.monto_pagado ?? 0), 0) * 0.09).toLocaleString("es-AR")} ARS</span>
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
                : <TablaMiembros miembros={miembros} adminCaracteristica={adminCaracteristica} adminNumero={adminNumero} onRefresh={cargarMiembros} />
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
                    : <TablaMiembros miembros={miembrosFiltrados} adminCaracteristica={adminCaracteristica} adminNumero={adminNumero} onRefresh={cargarMiembros} />
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
  onEnviarEmailPago,
}: {
  inscripciones: InscripcionConTaller[]
  accionInscripcion: string | null
  onAprobar: (id: string, ins?: InscripcionConTaller, montoPagado?: number) => void
  onCancelar: (id: string) => void
  onEliminar: (id: string) => void
  onActualizarMonto: (id: string, monto: number) => Promise<void>
  onActualizarPrecio: (id: string, precio: number) => Promise<void>
  onEnviarEmailPago: (ins: InscripcionConTaller, tipo: "parcial" | "confirmado", montoPagado: number) => Promise<void>
}) {
  const [montosEdit, setMontosEdit] = useState<Record<string, string>>({})
  const [guardandoMonto, setGuardandoMonto] = useState<string | null>(null)
  const [preciosEdit, setPreciosEdit] = useState<Record<string, string>>({})
  const [guardandoPrecioInsc, setGuardandoPrecioInsc] = useState<string | null>(null)
  const [inscripcionConfirmada, setInscripcionConfirmada] = useState<InscripcionConTaller | null>(null)
  const [inscripcionMensaje, setInscripcionMensaje] = useState<InscripcionConTaller | null>(null)
  const topScrollRef = React.useRef<HTMLDivElement>(null)
  const tableWrapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const top = topScrollRef.current
    const bottom = tableWrapRef.current
    if (!top || !bottom) return
    let syncing = false
    const syncFromTop = () => {
      if (syncing) return
      syncing = true
      bottom.scrollLeft = top.scrollLeft
      requestAnimationFrame(() => { syncing = false })
    }
    const syncFromBottom = () => {
      if (syncing) return
      syncing = true
      top.scrollLeft = bottom.scrollLeft
      requestAnimationFrame(() => { syncing = false })
    }
    top.addEventListener("scroll", syncFromTop)
    bottom.addEventListener("scroll", syncFromBottom)
    return () => {
      top.removeEventListener("scroll", syncFromTop)
      bottom.removeEventListener("scroll", syncFromBottom)
    }
  }, [])

  React.useEffect(() => {
    const top = topScrollRef.current
    const bottom = tableWrapRef.current
    if (!top || !bottom) return
    const inner = top.firstElementChild as HTMLElement
    if (inner) inner.style.width = bottom.scrollWidth + "px"
  }, [inscripciones.length])

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
      await onAprobar(ins.id, ins, montoPagado)
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

  const formatFechaTaller = (taller_fecha_inicio: string | null | undefined) => {
    if (!taller_fecha_inicio) return ""
    const datePart = taller_fecha_inicio.split("T")[0]
    const [y, m, d] = datePart.split("-").map(Number)
    const fecha = new Date(y, m - 1, d)
    return isNaN(fecha.getTime()) ? taller_fecha_inicio : fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  const enviarMensajeWA = (ins: InscripcionConTaller) => {
    const nombreCliente = `${ins.nombre} ${ins.apellido}`.trim()
    const fechaInscripcion = new Date(ins.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    const fechaTaller = formatFechaTaller(ins.taller_fecha_inicio)
    const sede = ins.localidad_taller || ""
    const lineas = [
      `Hola ${nombreCliente}! 🌟`,
      ``,
      `Registramos tu Seña${ins.monto_pagado ? ` de: $${Number(ins.monto_pagado).toLocaleString("es-AR")}` : ""} en:`,
      ``,
      `Para el Taller de: *${ins.taller_nombre || "Taller"}*`,
      sede ? `📍 ${sede}` : "",
      fechaTaller ? `📅 ${fechaTaller}` : "",
      ``,
      `Fecha de inscripción: ${fechaInscripcion}`,
      ``,
      (() => { const precio = ins.precio_inscripto ?? ins.taller_precio ?? 0; const saldo = precio - (ins.monto_pagado ?? 0); return precio > 0 ? `Tu saldo a pagar es: $${saldo.toLocaleString("es-AR")}` : "" })(),
      ``,
      `Gracias, te Esperamos.!!`,
      ``,
      `*Sentir* 🔥`,
    ].filter(l => l !== undefined)
    const mensaje = lineas.join("\n")
    const telefono = (ins.telefono || "").replace(/\D/g, "")
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank")
  }

  const guardarMonto = async (ins: InscripcionConTaller) => {
    const val = parseFloat(montosEdit[ins.id] ?? "")
    if (isNaN(val)) return
    const precioEfectivo = getPrecioEfectivo(ins)
    const saldo = precioEfectivo - val
    setGuardandoMonto(ins.id)
    await onActualizarMonto(ins.id, val)
    if (saldo > 0) {
      // Pago parcial — enviar email verde
      await onEnviarEmailPago(ins, "parcial", val)
    }
    await checkAutoConfirmar(ins, precioEfectivo, val)
    setGuardandoMonto(null)
  }

  return (
    <>
      {/* Tarjeta de confirmación */}
      {inscripcionConfirmada && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={() => setInscripcionConfirmada(null)}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="relative rounded-2xl shadow-2xl overflow-hidden"
              style={{ width: "min(420px, 96vw)", background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setInscripcionConfirmada(null)}
                className="absolute top-3 right-3 text-white/60 hover:text-white z-10"
                type="button"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Contenido */}
              <div className="flex flex-col items-center text-center px-8 py-10 gap-4">
                {/* Nombre cliente */}
                <div>
                  <p className="text-white/70 text-sm uppercase tracking-widest mb-1">Para</p>
                  <h2 className="text-white text-2xl font-bold">{inscripcionConfirmada.nombre} {inscripcionConfirmada.apellido}</h2>
                </div>

                {/* Taller */}
                <div className="bg-white/10 rounded-xl px-6 py-3 w-full">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Taller</p>
                  <p className="text-white font-semibold text-lg">{inscripcionConfirmada.taller_nombre}</p>
                </div>

                {/* Mensaje confirmación */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Check className="h-6 w-6 text-green-400" />
                    <span className="text-green-400 text-xl font-extrabold tracking-wide">Tu lugar está CONFIRMADO</span>
                    <Check className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-white text-lg font-semibold">¡Te esperamos!</p>
                </div>

                {/* Fecha inicio */}
                {inscripcionConfirmada.taller_fecha_inicio && (
                  <div className="bg-white/10 rounded-xl px-6 py-3 w-full">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Fecha de inicio</p>
                    <p className="text-white font-semibold text-base">
                      {(() => {
                        const raw = inscripcionConfirmada.taller_fecha_inicio!
                        const datePart = raw.split("T")[0]
                        const [y, m, d] = datePart.split("-").map(Number)
                        const fecha = new Date(y, m - 1, d)
                        return isNaN(fecha.getTime())
                          ? raw
                          : fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                      })()}
                    </p>
                  </div>
                )}

                {/* Cierre */}
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-white/80 text-base font-medium">Gracias.</p>
                  <span className="text-white font-bold text-base">Sentir</span>
                  <img src="/fuego-de-sentir.png" alt="" className="h-5 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cartelito de mensaje de seña */}
      {inscripcionMensaje && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={() => setInscripcionMensaje(null)}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="relative rounded-2xl shadow-2xl overflow-hidden"
              style={{ width: "min(420px, 96vw)", background: "linear-gradient(160deg, #0d2b1e 0%, #0f3d2a 50%, #145c3b 100%)" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setInscripcionMensaje(null)}
                className="absolute top-3 right-3 text-white/60 hover:text-white z-10"
                type="button"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center px-8 py-10 gap-4">
                {/* Encabezado — solo nombre */}
                <div>
                  <h2 className="text-white text-2xl font-bold">{inscripcionMensaje.nombre} {inscripcionMensaje.apellido}</h2>
                </div>

                {/* Taller + sede */}
                <div className="bg-white/10 rounded-xl px-6 py-3 w-full">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                    Registramos tu Seña{inscripcionMensaje.monto_pagado ? ` de: $${Number(inscripcionMensaje.monto_pagado).toLocaleString("es-AR")}` : ""}
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Para el Taller de:</p>
                  <p className="text-white font-semibold text-lg">{inscripcionMensaje.taller_nombre}</p>
                  {inscripcionMensaje.localidad_taller && (
                    <p className="text-white/70 text-sm mt-1">📍 {inscripcionMensaje.localidad_taller}</p>
                  )}
                  {inscripcionMensaje.taller_fecha_inicio && (
                    <p className="text-white/70 text-sm mt-1">📅 {formatFechaTaller(inscripcionMensaje.taller_fecha_inicio)}</p>
                  )}
                </div>

                {/* Fecha seña */}
                <div className="bg-white/10 rounded-xl px-6 py-3 w-full">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Fecha de inscripción</p>
                  <p className="text-white font-semibold text-base">
                    {new Date(inscripcionMensaje.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Saldo */}
                {(() => {
                  const precio = inscripcionMensaje.precio_inscripto ?? inscripcionMensaje.taller_precio ?? 0
                  const pagado = inscripcionMensaje.monto_pagado ?? 0
                  const saldo = precio - pagado
                  if (precio <= 0) return null
                  return (
                    <div className="bg-white/10 rounded-xl px-6 py-3 w-full">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Tu saldo a pagar es</p>
                      <p className="text-white font-semibold text-base">
                        ${saldo.toLocaleString("es-AR")}
                      </p>
                    </div>
                  )
                })()}

                {/* Cierre */}
                <div className="flex flex-col items-center gap-1 mt-1">
                  <p className="text-white text-base font-semibold">Gracias, te Esperamos.!!</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-bold text-base">Sentir</span>
                    <img src="/fuego-de-sentir.png" alt="" className="h-5 w-auto" />
                  </div>
                </div>

                {/* Botón enviar */}
                <button
                  onClick={() => enviarMensajeWA(inscripcionMensaje)}
                  className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg text-base"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    {/* Barra de scroll superior sincronizada */}
    <div ref={topScrollRef} style={{ overflowX: "auto", overflowY: "hidden", height: 12 }}>
      <div style={{ height: 1 }} />
    </div>
    <div ref={tableWrapRef} style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
      <table className="w-full text-sm border-collapse min-w-[1100px]">
        <thead className="sticky top-0 z-20">
          <tr className="border-b-2 border-border bg-background">
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap sticky left-0 z-30 bg-background border-r border-border/30" style={{ minWidth: 170, width: 170 }}>Taller</th>
            <th className="text-left px-2 py-2 font-semibold whitespace-nowrap sticky z-30 bg-background border-r border-border/40" style={{ left: 170 }}>Nombre</th>
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
                <td className="px-2 py-2 whitespace-nowrap font-medium text-xs sticky left-0 z-[1] bg-background border-r border-border/30" style={{ minWidth: 170, width: 170 }}>{ins.taller_nombre}</td>
                <td className={`px-2 py-2 whitespace-nowrap font-medium sticky z-[1] bg-background border-r border-border/40 ${ins.metodo_pago === "tarjeta_credito" ? "text-green-600 dark:text-green-400" : ""}`} style={{ left: 170 }}>{ins.nombre} {ins.apellido}</td>
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
                      <button
                        onClick={() => setInscripcionConfirmada(ins)}
                        title="Ver cartel de confirmación"
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm hover:bg-green-600 transition-colors"
                        type="button"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : ins.estado !== "cancelado" && saldo <= 0 && precioEfectivo > 0 ? (
                      <button
                        disabled={accionInscripcion === ins.id}
                        onClick={() => { setInscripcionConfirmada(ins); onAprobar(ins.id, ins, montoPagado) }}
                        title="Aprobar"
                        className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : null}
                    {ins.estado !== "confirmado" && (
                      <button
                        onClick={() => setInscripcionMensaje(ins)}
                        title="Ver y enviar mensaje de seña por WhatsApp"
                        className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-sm"
                        type="button"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    )}
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
    </>
  )
}

const MESES = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

type TallerEditable = {
  key: keyof Miembro
  mesKey: keyof Miembro
  anioKey: keyof Miembro
  label: string
}

const TALLERES_EDIT: TallerEditable[] = [
  { key: "taller_autoconocimiento", mesKey: "autoconocimiento_mes", anioKey: "autoconocimiento_anio", label: "Autoconocimiento" },
  { key: "taller_transformacion",   mesKey: "transformacion_mes",   anioKey: "transformacion_anio",   label: "Transformación" },
  { key: "taller_myl",              mesKey: "myl_mes",              anioKey: "myl_anio",              label: "MyL" },
  { key: "taller_guerrero",         mesKey: "guerrero_mes",         anioKey: "guerrero_anio",         label: "El Camino del Guerrero" },
  { key: "taller_biodecodificacion",mesKey: "biodecodificacion_mes",anioKey: "biodecodificacion_anio",label: "Biodecodificación" },
  { key: "taller_nino_interior",    mesKey: "nino_interior_mes",    anioKey: "nino_interior_anio",    label: "Sanando mi Niño Interior" },
  { key: "taller_constelaciones",   mesKey: "constelaciones_mes",   anioKey: "constelaciones_anio",   label: "Constelaciones Grupales" },
]

function TablaMiembros({ miembros, adminCaracteristica, adminNumero, onRefresh }: { miembros: Miembro[], adminCaracteristica: string, adminNumero: string, onRefresh: () => void }) {
  const t = (v: boolean) => v ? "✅" : "❌"
  const [orden, setOrden] = useState<"numero" | "nombre" | "talleres">("numero")
  const [dir, setDir] = useState<"asc" | "desc">("asc")
  const [busqueda, setBusqueda] = useState("")
  const [editando, setEditando] = useState<Miembro | null>(null)
  const [form, setForm] = useState<Miembro | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)
  const topScrollRef = React.useRef<HTMLDivElement>(null)
  const tableWrapRef = React.useRef<HTMLDivElement>(null)

  // Sync scroll: flag para evitar loop infinito
  React.useEffect(() => {
    const top = topScrollRef.current
    const bottom = tableWrapRef.current
    if (!top || !bottom) return
    let syncing = false
    const syncFromTop = () => {
      if (syncing) return
      syncing = true
      bottom.scrollLeft = top.scrollLeft
      requestAnimationFrame(() => { syncing = false })
    }
    const syncFromBottom = () => {
      if (syncing) return
      syncing = true
      top.scrollLeft = bottom.scrollLeft
      requestAnimationFrame(() => { syncing = false })
    }
    top.addEventListener("scroll", syncFromTop)
    bottom.addEventListener("scroll", syncFromBottom)
    return () => {
      top.removeEventListener("scroll", syncFromTop)
      bottom.removeEventListener("scroll", syncFromBottom)
    }
  }, [])

  // Actualizar ancho del scrollbar superior cuando cambian los datos
  React.useEffect(() => {
    const top = topScrollRef.current
    const bottom = tableWrapRef.current
    if (!top || !bottom) return
    const inner = top.firstElementChild as HTMLElement
    if (inner) inner.style.width = bottom.scrollWidth + "px"
  }, [miembros.length, busqueda, orden, dir])

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

  const abrirEditar = (m: Miembro) => {
    setEditando(m)
    setForm({ ...m })
    setGuardadoOk(false)
  }

  const cerrarEditar = () => {
    setEditando(null)
    setForm(null)
  }

  const setField = (key: keyof Miembro, value: any) => {
    setForm(f => f ? { ...f, [key]: value } : f)
  }

  const guardar = async () => {
    if (!form) return
    setGuardando(true)
    await supabase.rpc("actualizar_miembro", {
      p_admin_caracteristica:    adminCaracteristica,
      p_admin_numero:            adminNumero,
      p_numero:                  form.numero,
      p_nombre_apellido:         form.nombre_apellido,
      p_nombre_gafete:           form.nombre_gafete,
      p_celular_caracteristica:  form.celular_caracteristica,
      p_celular_numero:          form.celular_numero,
      p_email:                   form.email || null,
      p_fecha_nacimiento:        form.fecha_nacimiento || null,
      p_comentario:              form.comentario || null,
      p_taller_autoconocimiento: form.taller_autoconocimiento, p_autoconocimiento_mes: form.autoconocimiento_mes ?? null, p_autoconocimiento_anio: form.autoconocimiento_anio ?? null,
      p_taller_transformacion:   form.taller_transformacion,   p_transformacion_mes:   form.transformacion_mes ?? null,   p_transformacion_anio:   form.transformacion_anio ?? null,
      p_taller_myl:              form.taller_myl,              p_myl_mes:              form.myl_mes ?? null,              p_myl_anio:              form.myl_anio ?? null,
      p_taller_guerrero:         form.taller_guerrero,         p_guerrero_mes:         form.guerrero_mes ?? null,         p_guerrero_anio:         form.guerrero_anio ?? null,
      p_taller_biodecodificacion:form.taller_biodecodificacion,p_biodecodificacion_mes:form.biodecodificacion_mes ?? null,p_biodecodificacion_anio:form.biodecodificacion_anio ?? null,
      p_taller_nino_interior:    form.taller_nino_interior,    p_nino_interior_mes:    form.nino_interior_mes ?? null,    p_nino_interior_anio:    form.nino_interior_anio ?? null,
      p_taller_constelaciones:   form.taller_constelaciones,   p_constelaciones_mes:   form.constelaciones_mes ?? null,   p_constelaciones_anio:   form.constelaciones_anio ?? null,
    })
    setGuardando(false)
    setGuardadoOk(true)
    onRefresh()
    setTimeout(() => cerrarEditar(), 800)
  }

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
    {/* Barra de scroll superior sincronizada */}
    <div ref={topScrollRef} style={{ overflowX: "auto", overflowY: "hidden", height: 12 }}>
      <div style={{ height: 1 }} />
    </div>
    <div ref={tableWrapRef} style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
    <table className="w-full text-sm border-collapse">
      <thead className="sticky top-0 z-20">
        <tr className="border-b-2 border-border bg-background">
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap sticky left-0 z-30 bg-background border-r border-border/30">Nº</th>
          <th className="text-left px-2 py-2 font-semibold whitespace-nowrap sticky left-8 z-30 bg-background border-r border-border/40">Nombre</th>
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
          <th className="text-center px-2 py-2 font-semibold whitespace-nowrap">Editar</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((m, i) => (
          <tr key={m.numero} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
            <td className="px-2 py-2 font-medium sticky left-0 z-[1] bg-background border-r border-border/30">{m.numero}</td>
            <td className="px-2 py-2 whitespace-nowrap sticky left-8 z-[1] bg-background border-r border-border/40">{m.nombre_apellido.trim()}</td>
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
            <td className="text-center px-2 py-2">
              <button
                onClick={() => abrirEditar(m)}
                className="p-1 rounded hover:bg-blue-100 text-blue-700 hover:text-blue-900 transition-colors"
                title="Editar miembro"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

    {/* Modal de edición */}
    {editando && form && (
      <>
        <div className="fixed inset-0 z-[10100] bg-black/60 backdrop-blur-sm" onClick={cerrarEditar} />
        <div className="fixed inset-0 z-[10101] flex items-center justify-center p-3">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background z-10">
              <h2 className="font-bold text-base">Editar — {editando.nombre_apellido.trim()} <span className="text-muted-foreground font-normal text-sm">#{editando.numero}</span></h2>
              <button onClick={cerrarEditar} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Datos personales */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre y Apellido</label>
                  <input className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.nombre_apellido} onChange={e => setField("nombre_apellido", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gafete</label>
                  <input className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.nombre_gafete || ""} onChange={e => setField("nombre_gafete", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Característica</label>
                  <input className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.celular_caracteristica || ""} onChange={e => setField("celular_caracteristica", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Celular</label>
                  <input className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.celular_numero || ""} onChange={e => setField("celular_numero", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                  <input type="email" className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.email || ""} onChange={e => setField("email", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha Nacimiento</label>
                  <input type="date" className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background" value={form.fecha_nacimiento?.slice(0,10) || ""} onChange={e => setField("fecha_nacimiento", e.target.value || null)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Comentario</label>
                <textarea className="mt-1 w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background resize-none" rows={2} value={form.comentario || ""} onChange={e => setField("comentario", e.target.value)} />
              </div>

              {/* Talleres */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Talleres Realizados</p>
                <div className="space-y-2">
                  {TALLERES_EDIT.map(({ key, mesKey, anioKey, label }) => (
                    <div key={key as string} className="flex items-center gap-3 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer min-w-[180px]">
                        <input
                          type="checkbox"
                          checked={!!(form[key])}
                          onChange={e => setField(key, e.target.checked)}
                          className="h-4 w-4 rounded"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                      {form[key] && (
                        <>
                          <select
                            className="border border-border rounded px-2 py-1 text-xs bg-background"
                            value={(form[mesKey] as number) || ""}
                            onChange={e => setField(mesKey, e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">Mes</option>
                            {MESES.slice(1).map((mes, i) => <option key={i+1} value={i+1}>{mes}</option>)}
                          </select>
                          <input
                            type="number"
                            placeholder="Año"
                            min={2020} max={2030}
                            className="border border-border rounded px-2 py-1 text-xs bg-background w-20"
                            value={(form[anioKey] as number) || ""}
                            onChange={e => setField(anioKey, e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border flex justify-end gap-2 sticky bottom-0 bg-background">
              <button onClick={cerrarEditar} className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted">Cancelar</button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="px-5 py-2 text-sm rounded-md bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 font-semibold"
              >
                {guardando ? "Guardando..." : guardadoOk ? "✅ Guardado" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </>
    )}
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
