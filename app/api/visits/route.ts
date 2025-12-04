import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Contador de visitas global usando Supabase
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de Supabase no configuradas')
    throw new Error('Supabase no está configurado')
  }
  
  console.log('✅ Supabase configurado:', supabaseUrl)
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
    
    if (error) throw error
    
    const count = data?.count || 0
    console.log('✅ GET contador Supabase:', count)
    return NextResponse.json({ count, success: true })
  } catch (error: any) {
    console.error('❌ Error Supabase GET:', error.message)
    return NextResponse.json({ count: 0, success: false, error: error.message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = getSupabaseClient()
    
    // Obtener el contador actual
    const { data: currentData, error: selectError } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('id', 1)
      .single()
    
    if (selectError) throw selectError
    
    const currentCount = currentData?.count || 0
    const newCount = currentCount + 1
    
    // Actualizar el contador
    const { error: updateError } = await supabase
      .from('visit_counter')
      .update({ count: newCount, updated_at: new Date().toISOString() })
      .eq('id', 1)
    
    if (updateError) throw updateError
    
    console.log('✅ POST - Visita incrementada Supabase. Total:', newCount)
    return NextResponse.json({ count: newCount, success: true })
  } catch (error: any) {
    console.error('❌ Error Supabase POST:', error.message)
    return NextResponse.json({ count: 0, success: false, error: error.message }, { status: 500 })
  }
}
