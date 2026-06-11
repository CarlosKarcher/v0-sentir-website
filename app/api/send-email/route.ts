import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nombre,
      apellido,
      email,
      tallerNombre,
      localidad,
      eventoDescripcion,
      precioFinal,
      moneda,
      modalidadPago,
      cuotas,
      transferTitular,
      transferBanco,
      transferAlias,
      esPrecioGratis,
    } = body

    const montoSena = precioFinal ? Math.ceil(precioFinal * 0.35 / 1000) * 1000 : 0
    const montoTransferencia = modalidadPago === "sena" ? montoSena : precioFinal

    const detallesPago = esPrecioGratis
      ? `<p>Tu inscripción fue <strong>confirmada automáticamente</strong> ya que el taller no tiene costo.</p>`
      : `
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin:16px 0;">
          <p style="font-weight:bold;color:#92400e;margin:0 0 8px;">Datos para transferencia:</p>
          <p style="color:#b45309;margin:4px 0;">Titular: <strong>${transferTitular}</strong></p>
          <p style="color:#b45309;margin:4px 0;">Banco: <strong>${transferBanco}</strong></p>
          <p style="color:#b45309;margin:4px 0;">Alias: <strong>${transferAlias}</strong></p>
          ${precioFinal > 0 ? `<p style="color:#b45309;margin:4px 0;">Monto a transferir: <strong>$${montoTransferencia.toLocaleString("es-AR")} ${moneda}</strong>${modalidadPago === "sena" ? ` <span style="font-size:12px;">(seña 35% — total: $${precioFinal.toLocaleString("es-AR")})</span>` : ""}</p>` : ""}
        </div>
        ${modalidadPago === "tarjeta"
          ? `<p style="color:#1e40af;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;">Te enviaremos un <strong>link de pago con Tarjeta de Crédito</strong> a la brevedad.</p>`
          : modalidadPago === "sena"
          ? `<p style="color:#b45309;background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:12px;">Al enviar el comprobante de seña, tu lugar queda <strong>reservado</strong>. Debés abonar el total antes del taller.${cuotas ? ` (${cuotas} cuotas)` : ""}</p>`
          : `<p>Enviá el comprobante de transferencia a <a href="mailto:Sentir.inscripciones@gmail.com" style="color:#1d4ed8;">Sentir.inscripciones@gmail.com</a></p>`
        }
      `

    const { error } = await resend.emails.send({
      from: "Sentir <inscripciones@sentir.fun>",
      to: [email],
      replyTo: "Sentir.inscripciones@gmail.com",
      subject: `✅ Inscripción recibida — ${tallerNombre}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8" /></head>
        <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f2937;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#1e3a5f;font-size:28px;margin:0;">🎉 ¡Inscripción recibida!</h1>
          </div>

          <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
          <p>Tu inscripción al <strong>${tallerNombre}</strong>${localidad ? ` en <strong>${localidad}</strong>` : ""} fue registrada exitosamente.</p>
          ${eventoDescripcion ? `<p style="color:#6b7280;">${eventoDescripcion}</p>` : ""}

          ${detallesPago}

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:13px;color:#9ca3af;text-align:center;">
            Este es un mensaje automático de <strong>Sentir</strong>.<br/>
            Ante cualquier consulta escribinos a <a href="mailto:Sentir.inscripciones@gmail.com" style="color:#1d4ed8;">Sentir.inscripciones@gmail.com</a>
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
