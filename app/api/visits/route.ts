import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const COUNTER_KEY = 'sentir:visit-count'

export async function GET() {
  try {
    const count = await kv.get<number>(COUNTER_KEY)
    const finalCount = count !== null ? count : 0
    console.log('GET contador:', finalCount)
    return NextResponse.json({ count: finalCount })
  } catch (error) {
    console.error('Error al obtener contador:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Incrementar el contador en Redis (atómico y global)
    const newCount = await kv.incr(COUNTER_KEY)
    console.log('POST - Visita incrementada. Total:', newCount)
    return NextResponse.json({ count: newCount })
  } catch (error) {
    console.error('Error al incrementar contador:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

