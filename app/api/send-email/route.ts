import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const METODO_PAGO_LABEL: Record<string, string> = {
  transferencia_total: "Transferencia — Pago Total",
  tarjeta_credito:     "Tarjeta de Crédito",
  sena:                "Seña",
  sena_2_cuotas:       "Seña + 2 cuotas",
  sena_3_cuotas:       "Seña + 3 cuotas",
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()
    const {
      nombre,
      apellido,
      email,
      tallerNombre,
      localidad,
      precioFinal,
      moneda,
      modalidadPago,
      cuotas,
      fechaInicioTaller,
      esPrecioGratis,
    } = body

    const fechaInscripcion = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })

    const montoSena = precioFinal ? Math.ceil(precioFinal * 0.35 / 1000) * 1000 : 0
    const montoAcordado = modalidadPago === "sena" ? montoSena : precioFinal

    const metodoPagoLabel = cuotas
      ? METODO_PAGO_LABEL[`sena_${cuotas}_cuotas`] ?? "Seña en cuotas"
      : METODO_PAGO_LABEL[modalidadPago === "total" ? "transferencia_total" : modalidadPago === "tarjeta" ? "tarjeta_credito" : "sena"] ?? modalidadPago

    const fechaTallerStr = fechaInicioTaller
      ? (() => {
          const [y, m, d] = fechaInicioTaller.slice(0, 10).split("-").map(Number)
          return new Date(y, m - 1, d).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        })()
      : null

    const { error } = await resend.emails.send({
      from: "Sentir <inscripciones@sentir.fun>",
      to: [email],
      replyTo: "Sentir.inscripciones@gmail.com",
      subject: `📋 Inscripción recibida — ${tallerNombre}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8" /></head>
        <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;background:#f3f4f6;">
          <div style="background:#78350f;border-radius:16px;padding:32px;margin:24px auto;color:white;text-align:center;">

            <h1 style="font-size:22px;font-weight:bold;margin:0 0 24px;">${nombre} ${apellido}</h1>

            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">INSCRIPCIÓN RECIBIDA — TALLER</p>
              <p style="font-size:20px;font-weight:bold;margin:0;">${tallerNombre}</p>
              ${localidad ? `<p style="font-size:14px;margin:4px 0 0;">📍 ${localidad}</p>` : ""}
            </div>

            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">FECHA DE INSCRIPCIÓN</p>
              <p style="font-size:16px;font-weight:600;margin:0;">${fechaInscripcion}</p>
            </div>

            ${fechaTallerStr ? `
            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">📅 INICIO DEL TALLER</p>
              <p style="font-size:16px;font-weight:600;margin:0;">${fechaTallerStr}</p>
            </div>
            ` : ""}

            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">FORMA DE PAGO</p>
              <p style="font-size:16px;font-weight:600;margin:0;">${metodoPagoLabel}</p>
            </div>

            ${!esPrecioGratis && precioFinal > 0 ? `
            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:24px;">
              <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">MONTO ACORDADO</p>
              <p style="font-size:22px;font-weight:bold;margin:0;">$${montoAcordado.toLocaleString("es-AR")} ${moneda}</p>
              ${modalidadPago === "sena" ? `<p style="font-size:12px;color:rgba(255,255,255,0.6);margin:4px 0 0;">(total del taller: $${precioFinal.toLocaleString("es-AR")})</p>` : ""}
            </div>
            ` : ""}

            <div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:12px 24px;margin-bottom:24px;">
              <p style="font-size:15px;font-weight:bold;margin:0;">⏳ Estado: PENDIENTE</p>
              <p style="font-size:13px;color:rgba(255,255,255,0.8);margin:6px 0 0;">Tu inscripción quedará confirmada una vez que recibamos el pago acordado.</p>
            </div>

            <p style="font-size:16px;font-weight:bold;margin:0 0 4px;">Gracias, te Esperamos.!!</p>
            <p style="font-size:16px;font-weight:bold;margin:0;">Sentir 🔥</p>
          </div>
          <p style="font-size:12px;color:#9ca3af;text-align:center;padding-bottom:16px;">
            Ante cualquier consulta respondé este email o escribinos a
            <a href="mailto:Sentir.inscripciones@gmail.com" style="color:#1d4ed8;">Sentir.inscripciones@gmail.com</a>
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
