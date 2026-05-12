"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { useUser } from "@/lib/user-context"
import { calcularPrecioFinal } from "@/types/database"
import type { Taller } from "@/types/database"
import { Header } from "@/components/header"
import { LoginModal } from "@/components/login-modal"
import { X } from "lucide-react"

const TALLERES_LISTA = [
  { slug: "autoconocimiento",         nombre: "Taller de Autoconocimiento" },
  { slug: "transformacion",           nombre: "Taller de Transformación" },
  { slug: "metas-y-logros",           nombre: "Taller de MyL (Metas y Logros)" },
  { slug: "camino-del-guerrero",      nombre: "El Camino del Guerrero" },
  { slug: "biodecodificacion",        nombre: "Taller de Biodecodificación" },
  { slug: "sanando-mi-nino-interior", nombre: "Sanando mi Niño Interior" },
  { slug: "constelaciones-grupales",  nombre: "Constelaciones Grupales" },
]

// Talleres con prerequisito estricto: verifican columna en tabla miembros
const REQUISITOS_ESTRICTOS: Record<string, { campoDB: string; tallerNombre: string; campoPropio?: string }> = {
  "transformacion": { campoDB: "taller_autoconocimiento", tallerNombre: "Taller de Autoconocimiento", campoPropio: "taller_transformacion" },
  "metas-y-logros": { campoDB: "taller_transformacion",   tallerNombre: "Taller de Transformación" },
}

// Estos talleres bloquean los campos del usuario (deben coincidir con quien se logueó)
const TALLERES_CAMPOS_FIJOS = new Set(["transformacion", "metas-y-logros"])

function InscribirseForm() {
  const searchParams = useSearchParams()
  const tallerSlugParam = searchParams.get("taller") || ""
  const eventoParam = searchParams.get("evento") || ""
  const localidadParam = searchParams.get("localidad") || ""
  const backParam = searchParams.get("back") || ""
  const backUrl = backParam ? `/#${backParam}` : "/"

  const { estado: estadoAuth, email: emailAuth } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)

  const [estadoUsuario, setEstadoUsuario] = useState<"cargando" | "no_registrado" | "sin_prerequisito" | "ya_realizado" | "ok">("cargando")
  const [tallerFaltante, setTallerFaltante] = useState("")

  // Taller siempre fijo desde la URL
  const tallerSlug = tallerSlugParam
  const tallerNombreSeleccionado = TALLERES_LISTA.find(t => t.slug === tallerSlug)?.nombre || tallerSlug
  const camposFijos = TALLERES_CAMPOS_FIJOS.has(tallerSlug)

  const [tallerData, setTallerData] = useState<Taller | null>(null)
  const [cargandoTaller, setCargandoTaller] = useState(false)

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [dni, setDni] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [recomendadoPor, setRecomendadoPor] = useState("")
  const [telefonoRecomendado, setTelefonoRecomendado] = useState("")
  const [modalidadPago, setModalidadPago] = useState<"total" | "tarjeta" | "sena">("total")
  const [cuotas, setCuotas] = useState<2 | 3 | null>(null)

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const [mailCopiado, setMailCopiado] = useState(false)

  // Cargar datos del usuario y verificar prerequisitos
  useEffect(() => {
    if (estadoAuth === "cargando") return

    // Transformacion y MyL requieren login obligatorio
    if (camposFijos && (estadoAuth === "no_logueado" || estadoAuth === "sin_registro" || !emailAuth)) {
      setEstadoUsuario("no_registrado")
      return
    }

    // Otros talleres: puede continuar sin login
    if (estadoAuth === "no_logueado" || estadoAuth === "sin_registro" || !emailAuth) {
      setEstadoUsuario("ok")
      return
    }

    // Tiene sesión: cargar datos del miembro
    supabase.rpc("buscar_email_registrado", { p_email: emailAuth.toLowerCase() }).then(({ data }) => {
      if (!data?.encontrado) {
        setEstadoUsuario(camposFijos ? "no_registrado" : "ok")
        return
      }

      // Pre-rellenar datos desde el registro
      const parts = (data.nombre_apellido || "").trim().split(" ")
      setNombre(parts[0] || "")
      setApellido(parts.slice(1).join(" ") || "")
      setEmail(emailAuth)
      setTelefono(`${data.celular_caracteristica || ""} ${data.celular_numero || ""}`.trim())
      if (data.fecha_nacimiento) setFechaNacimiento(data.fecha_nacimiento.slice(0, 10))

      // Verificar prerequisito usando datos del RPC (evita problemas de RLS)
      const requisito = REQUISITOS_ESTRICTOS[tallerSlug]
      if (requisito) {
        // Ya realizó este taller (solo aplica a Transformación)
        if (requisito.campoPropio && data[requisito.campoPropio]) {
          setEstadoUsuario("ya_realizado")
          return
        }

        // No tiene el prerequisito
        if (!data[requisito.campoDB]) {
          setTallerFaltante(requisito.tallerNombre)
          setEstadoUsuario("sin_prerequisito")
          return
        }
      }

      setEstadoUsuario("ok")
    })
  }, [estadoAuth, emailAuth])

  // Cargar precio del taller — primero busca por slug+sede, si no hay cae al genérico (sede=null)
  useEffect(() => {
    if (!tallerSlug) { setTallerData(null); return }
    setCargandoTaller(true)
    const sede = localidadParam ? decodeURIComponent(localidadParam) : null
    const buscar = async () => {
      // Intentar con sede específica
      if (sede) {
        const { data } = await supabase
          .from("talleres")
          .select("*")
          .eq("slug", tallerSlug)
          .eq("sede", sede)
          .eq("activo", true)
          .maybeSingle()
        if (data) { setTallerData(data); setCargandoTaller(false); return }
      }
      // Fallback: precio genérico (sin sede)
      const { data } = await supabase
        .from("talleres")
        .select("*")
        .eq("slug", tallerSlug)
        .is("sede", null)
        .eq("activo", true)
        .maybeSingle()
      setTallerData(data ?? null)
      setCargandoTaller(false)
    }
    buscar()
  }, [tallerSlug, localidadParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tallerSlug) { setError("No se especificó el taller"); return }
    if (!tallerData) { setError("No se pudo cargar el taller seleccionado"); return }

    setEnviando(true)
    setError(null)

    const mensajeFinal = mensaje.trim() || null

    // Buscar nombre del miembro si está logueado y guardar fecha de nacimiento
    let nombreMiembro: string | null = null
    if (emailAuth) {
      const { data: miembroData } = await supabase
        .rpc("buscar_email_registrado", { p_email: emailAuth.toLowerCase() })
      if (miembroData?.encontrado) {
        nombreMiembro = miembroData.nombre_apellido || null
        if (fechaNacimiento && miembroData.origen === "miembro") {
          await supabase.rpc("actualizar_fecha_nacimiento_miembro", {
            p_email: emailAuth.toLowerCase(),
            p_fecha_nacimiento: fechaNacimiento,
          })
        }
      }
    }

    const { error: insertError } = await supabase.from("inscripciones").insert({
      taller_id: tallerData.id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono.trim(),
      dni: dni.trim() || null,
      ciudad: ciudad.trim() || null,
      fecha_nacimiento: fechaNacimiento || null,
      localidad_taller: localidadParam ? decodeURIComponent(localidadParam) : null,
      metodo_pago: modalidadPago === "total" ? "transferencia_total" : modalidadPago === "tarjeta" ? "tarjeta_credito" : cuotas ? `sena_${cuotas}_cuotas` : "sena",
      estado: (precios?.precioFinal ?? 1) === 0 ? "confirmado" : "pendiente",
      mensaje_inscripto: mensajeFinal,
      evento_descripcion: eventoParam ? decodeURIComponent(eventoParam) : null,
      nombre_miembro: nombreMiembro,
      precio_inscripto: precios?.precioFinal ?? null,
      enrolador_nombre: tallerSlug === "autoconocimiento" && recomendadoPor.trim() ? recomendadoPor.trim() : null,
      enrolador_telefono: tallerSlug === "autoconocimiento" && telefonoRecomendado.trim() ? telefonoRecomendado.trim() : null,
    })

    if (insertError) {
      setError("Error al registrar la inscripción: " + insertError.message)
      setEnviando(false)
      return
    }

    setExito(true)
    setEnviando(false)
  }

  const precios = tallerData ? calcularPrecioFinal(tallerData) : null
  const inputFijo = "w-full border border-border rounded-md px-3 py-2 bg-muted/50 text-muted-foreground cursor-not-allowed"
  const inputEditable = "w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"

  // Pantalla de carga
  if (estadoUsuario === "cargando") {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Verificando tu registro...</p>
        </div>
      </main>
    )
  }

  // No registrado / no logueado
  if (estadoUsuario === "no_registrado") {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-12">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold">Necesitás ingresar primero</h2>
          <p className="text-muted-foreground">
            Para inscribirte en este taller, ingresá con tu email registrado en Sentir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLoginOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Ingresar con mi email
            </button>
            <a href={backUrl} className="inline-block border border-border hover:bg-muted font-medium py-3 px-6 rounded-xl transition-colors text-center">
              Volver al inicio
            </a>
          </div>
          <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={() => setLoginOpen(false)} />
        </div>
      </main>
    )
  }

  // Ya realizó este taller
  if (estadoUsuario === "ya_realizado") {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-12">
          <div className="text-6xl">✨</div>
          <h2 className="text-2xl font-bold">
            Tu{nombre ? `, ${nombre},` : ""} Ya Viviste esta hermosa Experiencia.
          </h2>
          <a
            href={backUrl}
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  // Sin prerequisito
  if (estadoUsuario === "sin_prerequisito") {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-12">
          <div className="text-6xl">🚫</div>
          <h2 className="text-2xl font-bold">No podés inscribirte aún</h2>
          <p className="text-muted-foreground">
            Para acceder al <strong>{tallerNombreSeleccionado}</strong> primero tenés que haber
            realizado el <strong>{tallerFaltante}</strong>.
          </p>
          <a
            href={backUrl}
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  // Pantalla de éxito
  if (exito) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6 py-12">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold">¡Inscripción recibida!</h1>
          <p className="text-muted-foreground text-lg">
            Tu solicitud para <strong>{tallerNombreSeleccionado}</strong> fue registrada exitosamente.
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Enviar Comprobante de Transferencia al mail:
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <a
                href="mailto:Sentir.inscripciones@gmail.com"
                className="text-primary underline hover:no-underline font-medium text-sm"
              >
                Sentir.inscripciones@gmail.com
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("Sentir.inscripciones@gmail.com")
                  setMailCopiado(true)
                  setTimeout(() => setMailCopiado(false), 2000)
                }}
                className="text-xs px-3 py-1 rounded-full border border-border bg-muted hover:bg-muted/70 transition-colors"
              >
                {mailCopiado ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          {(precios?.precioFinal ?? 1) > 0 ? (
            <p className="text-muted-foreground">
              La inscripción está Pendiente hasta recibir el comprobante de la transferencia por Mail.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Tu inscripción fue <strong>Confirmada</strong> automáticamente ya que el taller no tiene costo.
            </p>
          )}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-left space-y-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Datos de transferencia:</p>
            <p className="text-amber-700 dark:text-amber-300">Titular: <strong>Fernando Javier Cárcamo</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Banco: <strong>Mercado Pago</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Alias: <strong>coach.fercarcamo.mp</strong></p>
            {precios && precios.precioFinal > 0 && (
              <p className="text-amber-700 dark:text-amber-300">
                Monto:{" "}
                <strong>
                  ${precios.precioFinal.toLocaleString("es-AR")} {tallerData?.moneda}
                  {precios.descuentoMonto > 0 && (
                    <span className="font-normal text-amber-600 dark:text-amber-400 ml-1">
                      (precio regular: ${precios.precioReal.toLocaleString("es-AR")})
                    </span>
                  )}
                </strong>
              </p>
            )}
          </div>
          <a href={backUrl} className="inline-block text-primary underline hover:no-underline text-sm">
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  // Formulario principal
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inscribirse a un taller</h1>
            {eventoParam && (
              <p className="text-muted-foreground text-sm mt-1">{decodeURIComponent(eventoParam)}</p>
            )}
          </div>
          <a
            href={backUrl}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0 mt-1"
            title="Salir"
          >
            <X className="h-6 w-6" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Taller y Sede — fijos, no editables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Taller</label>
              <div className="w-full border border-border rounded-md px-3 py-2 bg-muted/50 font-medium">
                {tallerNombreSeleccionado || "—"}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sede</label>
              <div className="w-full border border-border rounded-md px-3 py-2 bg-muted/50 font-medium">
                {localidadParam ? decodeURIComponent(localidadParam) : "—"}
              </div>
            </div>
          </div>

          {/* Precio del taller */}
          {cargandoTaller && (
            <p className="text-sm text-muted-foreground animate-pulse">Cargando precio del taller...</p>
          )}
          {tallerData && precios && (
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Precio del taller</p>
              {precios.descuentoMonto > 0 ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="line-through text-muted-foreground text-xl">
                    ${precios.precioReal.toLocaleString("es-AR")} {tallerData.moneda}
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${precios.precioFinal.toLocaleString("es-AR")} {tallerData.moneda}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {tallerData.descuento_tipo === "porcentaje"
                      ? `${tallerData.descuento_valor}% off`
                      : `-$${tallerData.descuento_valor?.toLocaleString("es-AR")}`}
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold">
                  ${precios.precioFinal.toLocaleString("es-AR")} {tallerData.moneda}
                </p>
              )}
            </div>
          )}

          {/* Aviso campos bloqueados */}
          {camposFijos && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300">
              Tus datos se completaron automáticamente con tu registro en Sentir.
            </div>
          )}

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre <span className="text-green-600">del Participante</span> *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => !camposFijos && setNombre(e.target.value)}
                readOnly={camposFijos}
                placeholder="Tu nombre"
                className={camposFijos ? inputFijo : inputEditable}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Apellido <span className="text-green-600">del Participante</span> *</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={e => !camposFijos && setApellido(e.target.value)}
                readOnly={camposFijos}
                placeholder="Tu apellido"
                className={camposFijos ? inputFijo : inputEditable}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email <span className="text-green-600">del Participante</span> *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => !camposFijos && setEmail(e.target.value)}
              readOnly={camposFijos}
              placeholder="tu@email.com"
              className={camposFijos ? inputFijo : inputEditable}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono / Celular <span className="text-green-600">del Participante</span> *</label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={e => !camposFijos && setTelefono(e.target.value)}
              readOnly={camposFijos}
              placeholder="Ej: 2966 123456"
              className={camposFijos ? inputFijo : inputEditable}
            />
          </div>

          {/* DNI y Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">DNI <span className="text-green-600">del Participante</span></label>
              <input
                type="text"
                value={dni}
                onChange={e => setDni(e.target.value)}
                placeholder="Número de DNI"
                className={inputEditable}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ciudad</label>
              <input
                type="text"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                placeholder="Tu ciudad"
                className={inputEditable}
              />
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Fecha de nacimiento <span className="text-green-600">del Participante</span></label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
              className={inputEditable}
            />
          </div>

          {/* Campo especial Autoconocimiento */}
          {tallerSlug === "autoconocimiento" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nombre de quien te recomendó</label>
                <input
                  type="text"
                  value={recomendadoPor}
                  onChange={e => setRecomendadoPor(e.target.value)}
                  placeholder="Nombre y apellido"
                  className={inputEditable}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Teléfono de quien te recomendó</label>
                <input
                  type="tel"
                  value={telefonoRecomendado}
                  onChange={e => setTelefonoRecomendado(e.target.value)}
                  placeholder="Ej: 2966 123456"
                  className={inputEditable}
                />
              </div>
            </div>
          )}

          {/* Mensaje */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Mensaje (opcional)</label>
            <textarea
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              rows={3}
              placeholder="¿Algo que quieras comentarnos?"
              className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Modalidad de pago */}
          {(() => {
            const aceptaTransferencia = tallerData?.acepta_transferencia ?? true
            const aceptaTarjeta = tallerData?.acepta_tarjeta ?? true
            const aceptaSena = tallerData?.acepta_sena ?? true
            return (
          <div className="space-y-3">
            <p className="text-sm font-bold">Modalidad de pago</p>
            <div className="flex flex-wrap gap-3">
              {aceptaTransferencia && (
                <button
                  type="button"
                  onClick={() => { setModalidadPago("total"); setCuotas(null) }}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors ${
                    modalidadPago === "total"
                      ? "bg-blue-900 border-blue-900 text-white"
                      : "bg-background border-border text-foreground hover:border-blue-900"
                  }`}
                >
                  Pago total
                </button>
              )}
              {aceptaTarjeta && (
                <button
                  type="button"
                  onClick={() => { setModalidadPago("tarjeta"); setCuotas(null) }}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors ${
                    modalidadPago === "tarjeta"
                      ? "bg-blue-900 border-blue-900 text-white"
                      : "bg-background border-border text-foreground hover:border-blue-900"
                  }`}
                >
                  Tarjeta de Crédito
                </button>
              )}
              {aceptaSena && (
                <button
                  type="button"
                  onClick={() => setModalidadPago("sena")}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors ${
                    modalidadPago === "sena"
                      ? "bg-blue-900 border-blue-900 text-white"
                      : "bg-background border-border text-foreground hover:border-blue-900"
                  }`}
                >
                  Seña
                </button>
              )}
              {modalidadPago === "sena" && precios && precios.precioFinal > 0 && (
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 self-center ml-2">
                  (${(Math.ceil(precios.precioFinal * 0.35 / 1000) * 1000).toLocaleString("es-AR")}) 35% del valor del taller.
                </span>
              )}
            </div>

            {modalidadPago === "tarjeta" && (
              <div className="pl-1">
                <p className="text-base font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                  Una vez confirmada tu inscripción, te enviaremos un <strong>link de pago con Tarjeta de Crédito</strong> al email que registraste.
                </p>
              </div>
            )}

            {modalidadPago === "sena" && (
              <div className="space-y-3 pl-1">
                <p className="text-base text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  Al enviar el comprobante de Seña, su Lugar está Reservado pero se debe abonar el valor total del taller antes de Concurrir al mismo.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCuotas(cuotas === 2 ? null : 2)}
                    className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors ${
                      cuotas === 2
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-background border-border text-foreground hover:border-orange-500"
                    }`}
                  >
                    2 cuotas
                  </button>
                  <button
                    type="button"
                    onClick={() => setCuotas(cuotas === 3 ? null : 3)}
                    className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors ${
                      cuotas === 3
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-background border-border text-foreground hover:border-orange-500"
                    }`}
                  >
                    3 cuotas
                  </button>
                </div>
              </div>
            )}
          </div>
            )
          })()}

          {/* Comprobante */}
          <div className="space-y-1">
            <p className="text-sm font-bold">Comprobante de pago</p>
            <p className="text-base text-foreground">
              Enviá el comprobante de transferencia a{" "}
              <a
                href="mailto:Sentir.inscripciones@gmail.com"
                className="font-bold underline hover:no-underline"
              >
                Sentir.inscripciones@gmail.com
              </a>
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText("Sentir.inscripciones@gmail.com")}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Copiar email
            </button>
          </div>

          {/* Datos de transferencia */}
          {modalidadPago !== "tarjeta" && <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Datos para transferencia:</p>
            <p className="text-amber-700 dark:text-amber-300">Titular: <strong>Fernando Javier Cárcamo</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Banco: <strong>Mercado Pago</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Alias: <strong>coach.fercarcamo.mp</strong></p>
            {precios && precios.precioFinal > 0 && (() => {
              const montoSena = Math.ceil(precios.precioFinal * 0.35 / 1000) * 1000
              const montoMostrar = modalidadPago === "sena" ? montoSena : precios.precioFinal
              return (
                <>
                  <p className="text-amber-700 dark:text-amber-300">
                    Monto a transferir:{" "}
                    <strong>
                      ${montoMostrar.toLocaleString("es-AR")} {tallerData?.moneda}
                    </strong>
                    {modalidadPago === "sena" && (
                      <span className="ml-2 font-normal text-xs">(seña 35% — total: ${precios.precioFinal.toLocaleString("es-AR")})</span>
                    )}
                  </p>
                </>
              )
            })()}
          </div>}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors text-lg"
          >
            {enviando ? "Enviando inscripción..." : "Confirmar inscripción"}
          </button>

          <a
            href={backUrl}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-lg text-center block"
          >
            Regresar sin Inscribirte
          </a>
        </form>
      </div>
    </main>
  )
}

export default function InscribirsePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </main>
      }>
        <InscribirseForm />
      </Suspense>
    </div>
  )
}
