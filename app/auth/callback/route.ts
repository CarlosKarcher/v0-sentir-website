import { NextResponse } from "next/server"

// Callback de OAuth — ya no se usa, redirige al inicio
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(origin)
}
