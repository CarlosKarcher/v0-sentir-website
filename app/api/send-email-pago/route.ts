import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      tipo,
      nombre,
      apellido,
      email,
      tallerNombre,
      localidad,
      fechaInscripcion,
      montoPagado,
      saldo,
      precioTotal,
    } = body

    const esParcial = tipo === "parcial"

    const subject = esParcial
      ? `💚 Seña recibida — ${tallerNombre}`
      : `✅ ¡Tu inscripción está CONFIRMADA! — ${tallerNombre}`

    const html = esParcial
      ? `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8" /></head>
        <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;background:#f3f4f6;">
          <div style="background:#1a4731;border-radius:16px;padding:32px;margin:24px auto;color:white;text-align:center;">
            <h1 style="font-size:24px;font-weight:bold;margin:0 0 24px;">${nombre} ${apellido}</h1>

            <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">REGISTRAMOS TU SEÑA</p>
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">PARA EL TALLER DE:</p>
              <p style="font-size:20px;font-weight:bold;margin:0;">${tallerNombre}</p>
              ${localidad ? `<p style="font-size:14px;margin:4px 0 0;">📍 ${localidad}</p>` : ""}
            </div>

            <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">FECHA DE INSCRIPCIÓN</p>
              <p style="font-size:16px;font-weight:600;margin:0;">${fechaInscripcion}</p>
            </div>

            ${precioTotal > 0 ? `
            <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:24px;">
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">TU SALDO A PAGAR ES</p>
              <p style="font-size:22px;font-weight:bold;margin:0;">$${saldo.toLocaleString("es-AR")}</p>
            </div>
            ` : ""}

            <p style="font-size:16px;font-weight:bold;margin:0 0 4px;">Gracias, te Esperamos.!!</p>
            <p style="font-size:16px;font-weight:bold;margin:0;">Sentir 🔥</p>
          </div>
          <p style="font-size:12px;color:#9ca3af;text-align:center;padding-bottom:16px;">
            Ante cualquier consulta escribinos a <a href="mailto:Sentir.inscripciones@gmail.com" style="color:#1d4ed8;">Sentir.inscripciones@gmail.com</a>
          </p>
        </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8" /></head>
        <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;background:#f3f4f6;">
          <div style="background:#1e3a5f;border-radius:16px;padding:32px;margin:24px auto;color:white;text-align:center;">
            <p style="color:rgba(255,255,255,0.7);font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">PARA</p>
            <h1 style="font-size:24px;font-weight:bold;margin:0 0 24px;">${nombre} ${apellido}</h1>

            <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:12px;">
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">TALLER</p>
              <p style="font-size:18px;font-weight:bold;margin:0;">${tallerNombre}</p>
              ${localidad ? `<p style="font-size:14px;margin:4px 0 0;">📍 ${localidad}</p>` : ""}
            </div>

            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:16px 24px;margin-bottom:12px;">
              <p style="color:#4ade80;font-size:18px;font-weight:bold;margin:0;">✓ Tu lugar está CONFIRMADO ✓</p>
              <p style="font-size:16px;margin:4px 0 0;">¡Te esperamos!</p>
            </div>

            <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:24px;">
              <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">FECHA DE INSCRIPCIÓN</p>
              <p style="font-size:16px;font-weight:600;margin:0;">${fechaInscripcion}</p>
            </div>

            <p style="font-size:16px;font-weight:bold;margin:0;">Gracias. Sentir 🔥</p>
          </div>
          <p style="font-size:12px;color:#9ca3af;text-align:center;padding-bottom:16px;">
            Ante cualquier consulta escribinos a <a href="mailto:Sentir.inscripciones@gmail.com" style="color:#1d4ed8;">Sentir.inscripciones@gmail.com</a>
          </p>
        </body>
        </html>
      `

    const { error } = await resend.emails.send({
      from: "Sentir <inscripciones@sentir.fun>",
      to: [email],
      replyTo: "Sentir.inscripciones@gmail.com",
      subject,
      html,
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
