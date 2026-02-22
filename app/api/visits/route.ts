import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de Supabase no configuradas')
    throw new Error('Supabase no está configurado')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('id', 1)
      .single()

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        const { data: newData, error: insertError } = await supabase
          .from('visit_counter')
          .insert({ id: 1, count: 0, updated_at: new Date().toISOString() })
          .select('count')
          .single()

        if (insertError) throw insertError
        return NextResponse.json({ count: newData?.count ?? 0, success: true })
      }
      throw error
    }

    const count = data?.count ?? 0
    return NextResponse.json({ count, success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('❌ Error Supabase GET:', message)
    return NextResponse.json({ count: 0, success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const init = url.searchParams.get('init')

    if (init === '1000') {
      const supabase = getSupabaseClient()
      const { error: updateError } = await supabase
        .from('visit_counter')
        .upsert({ id: 1, count: 1000, updated_at: new Date().toISOString() }, { onConflict: 'id' })

      if (updateError) throw updateError
      return NextResponse.json({ count: 1000, success: true, message: 'Contador inicializado en 1000' })
    }

    const supabase = getSupabaseClient()

    const { data: currentData, error: selectError } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('id', 1)
      .single()

    let currentCount = 0

    if (selectError) {
      if (selectError.code === 'PGRST116' || selectError.message?.includes('No rows')) {
        const { data: newData, error: insertError } = await supabase
          .from('visit_counter')
          .insert({ id: 1, count: 1001, updated_at: new Date().toISOString() })
          .select('count')
          .single()

        if (insertError) throw insertError
        return NextResponse.json({ count: newData?.count ?? 1001, success: true })
      }
      throw selectError
    }

    currentCount = Number(currentData?.count) ?? 0
    const newCount = currentCount + 1

    const { data: updatedData, error: updateError } = await supabase
      .from('visit_counter')
      .upsert({ id: 1, count: newCount, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      .select('count')
      .single()

    if (updateError) throw updateError

    const finalCount = Number(updatedData?.count) ?? newCount
    return NextResponse.json({ count: finalCount, success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('❌ Error Supabase POST:', message)
    return NextResponse.json({ count: 0, success: false, error: message }, { status: 500 })
  }
}
