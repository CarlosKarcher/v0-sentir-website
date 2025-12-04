import { NextResponse } from 'next/server'

// Variable global compartida entre todas las peticiones
let visitCount = 1500

export async function GET() {
  console.log('GET contador:', visitCount)
  return NextResponse.json({ count: visitCount })
}

export async function POST() {
  visitCount += 1
  console.log('POST - Visita incrementada. Total:', visitCount)
  return NextResponse.json({ count: visitCount })
}

