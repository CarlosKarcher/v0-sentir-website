import { NextRequest, NextResponse } from "next/server"

// Supabase OTP magic link callback
// Cuando el usuario hace clic en el link del email, aterriza acá
// y es redirigido al inicio con la sesión activa
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    // El fragmento #access_token lo maneja el cliente — solo redirigimos
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/`)
}
