import { NextResponse } from 'next/server'

// Variable global para almacenar el contador
// Se inicializa en 1500 como base
let visitCount = 1500

// Inicializar desde variable de entorno si existe
if (typeof process !== 'undefined' && process.env.VISIT_COUNT) {
  const envCount = parseInt(process.env.VISIT_COUNT)
  if (envCount > visitCount) {
    visitCount = envCount
  }
}

export async function GET() {
  return NextResponse.json({ 
    count: visitCount,
    timestamp: Date.now() 
  })
}

export async function POST() {
  visitCount += 1
  console.log('Visita incrementada. Total:', visitCount)
  return NextResponse.json({ 
    count: visitCount,
    timestamp: Date.now() 
  })
}

