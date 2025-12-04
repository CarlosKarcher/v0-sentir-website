import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'visit-counter.json')

async function getCount(): Promise<number> {
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf-8')
    const json = JSON.parse(data)
    return json.count || 1500
  } catch {
    // Si no existe el archivo, crear con valor inicial
    await fs.writeFile(COUNTER_FILE, JSON.stringify({ count: 1500 }))
    return 1500
  }
}

async function setCount(count: number): Promise<void> {
  await fs.writeFile(COUNTER_FILE, JSON.stringify({ count }))
}

export async function GET() {
  const count = await getCount()
  return NextResponse.json({ count })
}

export async function POST() {
  const currentCount = await getCount()
  const newCount = currentCount + 1
  await setCount(newCount)
  console.log('Visita incrementada. Total:', newCount)
  return NextResponse.json({ count: newCount })
}

