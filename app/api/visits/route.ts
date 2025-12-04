import { NextResponse } from 'next/server'

// Variable global para almacenar el contador (se reinicia con cada deploy)
// Para producción, esto debería usar una base de datos o KV store
let visitCount = 0

// Obtener o inicializar el contador desde variable de entorno
function getInitialCount(): number {
  if (typeof process !== 'undefined' && process.env.VISIT_COUNT) {
    return parseInt(process.env.VISIT_COUNT) || 0
  }
  return 0
}

// Inicializar el contador
if (visitCount === 0) {
  visitCount = getInitialCount()
}

export async function GET() {
  return NextResponse.json({ count: visitCount })
}

export async function POST() {
  visitCount += 1
  return NextResponse.json({ count: visitCount })
}

export const runtime = 'edge'

