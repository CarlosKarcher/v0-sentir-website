import { NextRequest, NextResponse } from "next/server"

// Callback OAuth de Google / Supabase Auth
// Redirige al inicio preservando el code para que el cliente lo intercambie
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    // Redirigir al inicio con el code para que supabaseAuth (detectSessionInUrl) lo intercambie
    return NextResponse.redirect(`${url.origin}/${url.search}`)
  }

  return NextResponse.redirect(`${url.origin}/`)
}
