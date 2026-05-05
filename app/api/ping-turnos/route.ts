import { NextResponse } from 'next/server'

const TURNOS_SUPABASE_URL = "https://lgzndrjklzbtkzkzubld.supabase.co"
const TURNOS_ANON_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnem5kcmprbHpidGt6a3p1YmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDg5NjIsImV4cCI6MjA4OTI4NDk2Mn0.hn2mZbIs8JbScMZxRSCkqGHeen255_w47zavfkV9C2k"

export async function GET() {
  try {
    const res = await fetch(`${TURNOS_SUPABASE_URL}/rest/v1/terapeutas?select=id&limit=1`, {
      headers: {
        "apikey":        TURNOS_ANON_KEY,
        "Authorization": `Bearer ${TURNOS_ANON_KEY}`,
      },
    })
    const ok = res.ok
    return NextResponse.json({ ok, status: res.status, ts: new Date().toISOString() })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
