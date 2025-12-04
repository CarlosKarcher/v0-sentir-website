import { NextResponse } from 'next/server'
import Redis from 'ioredis'

const COUNTER_KEY = 'sentir:visit-count'

// Configurar cliente Redis con reintentos
function createRedisClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL no está configurada')
  }
  
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    enableReadyCheck: true,
    lazyConnect: false,
  })
}

let redis: Redis | null = null

function getRedisClient() {
  if (!redis || redis.status === 'end') {
    redis = createRedisClient()
  }
  return redis
}

export async function GET() {
  try {
    const client = getRedisClient()
    const count = await client.get(COUNTER_KEY)
    const finalCount = count ? parseInt(count) : 0
    
    console.log('✅ GET contador Redis:', finalCount)
    return NextResponse.json({ count: finalCount, success: true })
  } catch (error: any) {
    console.error('❌ Error Redis GET:', error.message)
    return NextResponse.json({ 
      count: 0, 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    const client = getRedisClient()
    const newCount = await client.incr(COUNTER_KEY)
    
    console.log('✅ POST contador Redis:', newCount)
    return NextResponse.json({ count: newCount, success: true })
  } catch (error: any) {
    console.error('❌ Error Redis POST:', error.message)
    return NextResponse.json({ 
      count: 0, 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

