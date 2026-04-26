"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { useUser } from "@/lib/user-context"
import { calcularPrecioFinal } from "@/types/database"
import type { Taller } from "@/types/database"
import { Header } from "@/components/header"
import { LoginModal } from "@/components/login-modal"

const TALLERES_LISTA = [
  { slug: "autoconocimiento",         nombre: "Taller de Autoconocimiento" },
  { slug: "transformacion",           nombre: "Taller de Transformación" },
  { slug: "metas-y-logros",           nombre: "Taller de MyL (Metas y Logros)" },
  { slug: "camino-del-guerrero",      nombre: "El Camino del Guerrero" },
  { slug: "biodecodificacion",        nombre: "Taller de Biodecodificación" },
  { slug: "sanando-mi-nino-interior", nombre: "Sanando mi Niño Interior" },
  { slug: "constelaciones-grupales",  nombre: "Constelaciones Grupales" },
]

const PREREQUISITOS: Record<string, string> = {
  "transformacion": "autoconocimiento",
  "metas-y-logros": "transformacion",
}

function InscribirseForm() {
  const searchParams = useSearchParams()
  const tallerSlugParam = searchParams.get("taller") || ""
  const eventoParam = searchParams.get("evento") || ""

  const { estado: estadoAuth, email: emailAuth } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)

  // Estado de carga del usuario desde Supabase Auth + DB
  const [estadoUsuario, setEstadoUsuario] = useState<"cargando" | "no_registrado" | "ok">("cargando")
  const [celularCaracteristica, setCelularCaracteristica] = useState("")
  const [celularNumero, setCelularNumero] = useState("")

  const [tallerSlug, setTallerSlug] = useState(tallerSlugParam)
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

  const [prerequisitoError, setPrerequisitoError] = useState<string | null>(null)
  const [prerequisitoCumplido, setPrerequisitoCumplido] = useState<boolean | null>(null)
  const [verificando, setVerificando] = useState(false)

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  // Cuando el contexto resuelve, cargar datos del usuario
  useEffect(() => {
    if (estadoAuth === "cargando") return
    if (estadoAuth === "no_logueado" || estadoAuth === "sin_registro") {
      setEstadoUsuario("no_registrado")
      return
    }
    if (!emailAuth) { setEstadoUsuario("no_registrado"); return }

    supabase.rpc("buscar_email_registrado", { p_email: emailAuth.toLowerCase() }).then(({ data }) => {
      if (!data?.encontrado) { setEstadoUsuario("no_registrado"); return }
      const parts = (data.nombre_apellido || "").trim().split(" ")
      setNombre(parts[0] || "")
      setApellido(parts.slice(1).join(" ") || "")
      setEmail(emailAuth)
      const caract = data.celular_caracteristica || ""
      const num = data.celular_numero || ""
      setCelularCaracteristica(caract)
      setCelularNumero(num)
      setTelefono(`${caract} ${num}`.trim())
      setEstadoUsuario("ok")
    })
  }, [estadoAuth, emailAuth])

  // Cargar precio del taller seleccionado
  useEffect(() => {
    if (!tallerSlug) { setTallerData(null); return }
    setCargandoTaller(true)
    supabase
      .from("talleres")
      .select("*")
      .eq("slug", tallerSlug)
      .eq("activo", true)
      .single()
      .then(({ data }) => {
        setTallerData(data ?? null)
        setCargandoTaller(false)
      })
  }, [tallerSlug])

  const verificarPrerequisito = async () => {
    const prereqSlug = PREREQUISITOS[tallerSlug]
    if (!prereqSlug || !telefono.trim()) {
      setPrerequisitoError(null)
      setPrerequisitoCumplido(null)
      return
    }
    setVerificando(true)
    const { data } = await supabase.rpc("verificar_prerequisito_taller", {
      p_celular: telefono.trim(),
      p_taller_slug: prereqSlug,
    })
    setVerificando(false)
    if (data === true) {
      setPrerequisitoCumplido(true)
      setPrerequisitoError(null)
    } else {
      setPrerequisitoCumplido(false)
      const tallerNombre = TALLERES_LISTA.find(t => t.slug === prereqSlug)?.nombre || prereqSlug
      setPrerequisitoError(`Para inscribirte en este taller necesitás haber realizado primero: ${tallerNombre}`)
    }
  }

  const handleTallerChange = (slug: string) => {
    setTallerSlug(slug)
    setPrerequisitoError(null)
    setPrerequisitoCumplido(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tallerSlug) { setError("Seleccioná un taller"); return }
    if (!tallerData) { setError("No se pudo cargar el taller seleccionado"); return }
    if (prerequisitoCumplido === false) { setError("No cumplís el prerequisito para este taller"); return }

    setEnviando(true)
    setError(null)

    const mensajeFinal = [
      mensaje.trim() || null,
      tallerSlug === "autoconocimiento" && recomendadoPor.trim()
        ? `¿Quién te recomendó?: ${recomendadoPor.trim()}`
        : null,
    ].filter(Boolean).join("\n\n") || null

    const { error: insertError } = await supabase.from("inscripciones").insert({
      taller_id: tallerData.id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono.trim(),
      dni: dni.trim() || null,
      ciudad: ciudad.trim() || null,
      fecha_nacimiento: fechaNacimiento || null,
      metodo_pago: "transferencia",
      estado: "pendiente",
      mensaje_inscripto: mensajeFinal,
      evento_descripcion: eventoParam ? decodeURIComponent(eventoParam) : null,
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
  const tallerNombreSeleccionado = TALLERES_LISTA.find(t => t.slug === tallerSlug)?.nombre || ""

  // Pantalla de carga inicial
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

  // Pantalla: no está registrado
  if (estadoUsuario === "no_registrado") {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 py-12">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold">Necesitás ingresar primero</h2>
          <p className="text-muted-foreground">
            Para inscribirte en un taller, ingresá con tu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLoginOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Ingresar con mi email
            </button>
            <a href="/" className="inline-block border border-border hover:bg-muted font-medium py-3 px-6 rounded-xl transition-colors text-center">
              Volver al inicio
            </a>
          </div>
          <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={() => setLoginOpen(false)} />
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
          <p className="text-muted-foreground">
            En breve nos pondremos en contacto para confirmar tu lugar.
          </p>
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
          <a href="/" className="inline-block text-primary underline hover:no-underline text-sm">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Inscribirse a un taller</h1>
          {eventoParam && (
            <p className="text-muted-foreground text-sm mt-1">{decodeURIComponent(eventoParam)}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Selector de taller */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Taller *</label>
            <select
              value={tallerSlug}
              onChange={e => handleTallerChange(e.target.value)}
              required
              className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— Seleccioná un taller —</option>
              {TALLERES_LISTA.map(t => (
                <option key={t.slug} value={t.slug}>{t.nombre}</option>
              ))}
            </select>
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

          {/* Nombre y Apellido — pre-rellenados desde DB, editables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Apellido *</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                placeholder="Tu apellido"
                className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Email — pre-rellenado desde DB */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Teléfono — pre-rellenado desde localStorage */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono / Celular *</label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={e => {
                setTelefono(e.target.value)
                setPrerequisitoError(null)
                setPrerequisitoCumplido(null)
              }}
              onBlur={verificarPrerequisito}
              placeholder="Ej: 2966 123456"
              className={`w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                prerequisitoCumplido === false
                  ? "border-red-500 focus:ring-red-500"
                  : prerequisitoCumplido === true
                  ? "border-green-500 focus:ring-green-500"
                  : "border-border"
              }`}
            />
            {verificando && (
              <p className="text-xs text-muted-foreground">Verificando prerequisito...</p>
            )}
            {prerequisitoCumplido === true && (
              <p className="text-sm text-green-600 dark:text-green-400">✅ Prerequisito verificado</p>
            )}
            {prerequisitoError && (
              <p className="text-sm text-red-600 dark:text-red-400">{prerequisitoError}</p>
            )}
          </div>

          {/* DNI y Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">DNI</label>
              <input
                type="text"
                value={dni}
                onChange={e => setDni(e.target.value)}
                placeholder="Número de DNI"
                className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ciudad</label>
              <input
                type="text"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                placeholder="Tu ciudad"
                className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Fecha de nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={e => setFechaNacimiento(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Campo especial Autoconocimiento */}
          {tallerSlug === "autoconocimiento" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">¿Quién te recomendó?</label>
              <input
                type="text"
                value={recomendadoPor}
                onChange={e => setRecomendadoPor(e.target.value)}
                placeholder="Nombre de quien te recomendó"
                className="w-full border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
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

          {/* Comprobante */}
          <div className="space-y-1">
            <p className="text-sm font-bold">Comprobante de pago</p>
            <p className="text-sm text-muted-foreground">
              Enviá el comprobante de transferencia a{" "}
              <a
                href="mailto:Sentir.inscripciones@gmail.com"
                className="font-bold text-foreground underline hover:no-underline"
              >
                Sentir.inscripciones@gmail.com
              </a>
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("Sentir.inscripciones@gmail.com")
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Copiar email
            </button>
          </div>

          {/* Datos de transferencia */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Datos para transferencia:</p>
            <p className="text-amber-700 dark:text-amber-300">Titular: <strong>Fernando Javier Cárcamo</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Banco: <strong>Mercado Pago</strong></p>
            <p className="text-amber-700 dark:text-amber-300">Alias: <strong>coach.fercarcamo.mp</strong></p>
            {precios && precios.precioFinal > 0 && (
              <p className="text-amber-700 dark:text-amber-300">
                Monto a transferir:{" "}
                <strong>
                  {precios.descuentoMonto > 0 ? (
                    <>
                      <span className="line-through font-normal mr-1">
                        ${precios.precioReal.toLocaleString("es-AR")}
                      </span>
                      ${precios.precioFinal.toLocaleString("es-AR")} {tallerData?.moneda}
                    </>
                  ) : (
                    `$${precios.precioFinal.toLocaleString("es-AR")} ${tallerData?.moneda}`
                  )}
                </strong>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando || prerequisitoCumplido === false}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors text-lg"
          >
            {enviando ? "Enviando inscripción..." : "Confirmar inscripción"}
          </button>
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
