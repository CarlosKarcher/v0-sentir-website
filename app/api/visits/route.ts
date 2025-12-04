import { NextResponse } from 'next/server'
import Redis from 'ioredis'

const COUNTER_KEY = 'sentir:visit-count'

// Crear conexión Redis Serverless (solo una instancia)
let redis: Redis | null = null

function getRedisClient() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    })
  }
  return redis
}

export async function GET() {
  try {
    const client = getRedisClient()
    const count = await client.get(COUNTER_KEY)
    const finalCount = count ? parseInt(count) : 0
    console.log('✅ GET contador desde Redis:', finalCount)
    return NextResponse.json({ count: finalCount })
  } catch (error) {
    console.error('❌ Error al obtener contador:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    const client = getRedisClient()
    // Incrementar el contador en Redis (operación atómica)
    const newCount = await client.incr(COUNTER_KEY)
    console.log('✅ POST - Visita incrementada. Total:', newCount)
    return NextResponse.json({ count: newCount })
  } catch (error) {
    console.error('❌ Error al incrementar contador:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

