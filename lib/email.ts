// Stub de envío de email — conectar con Resend / SendGrid en Fase 3

export interface EmailConfirmacionInscripcion {
  to: string
  nombre: string
  taller_nombre: string
  evento_descripcion: string | null
  precio_final: number
  moneda: string
}

export async function enviarConfirmacionInscripcion(
  data: EmailConfirmacionInscripcion
): Promise<void> {
  // TODO Fase 3: implementar con Resend o SendGrid
  // Ejemplo con Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'Sentir <noreply@sentir.fun>',
  //   to: data.to,
  //   subject: `¡Tu inscripción a ${data.taller_nombre} fue confirmada!`,
  //   html: `<p>Hola ${data.nombre}, tu lugar está confirmado...</p>`
  // })
  console.log('[EMAIL STUB] Confirmación pendiente de enviar a:', data.to, '| Taller:', data.taller_nombre)
}
