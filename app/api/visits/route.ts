import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Contador de visitas global usando Supabase
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // Intentar usar service role key primero (para bypass RLS), luego anon key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de Supabase no configuradas')
    throw new Error('Supabase no está configurado')
  }
  
  const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('✅ Supabase configurado:', supabaseUrl, usingServiceRole ? '(Service Role)' : '(Anon Key)')
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
      // Si la tabla no existe o no hay registro, crear uno inicial
      if (error.code === 'PGRST116' || error.message.includes('No rows')) {
        const { data: newData, error: insertError } = await supabase
          .from('visit_counter')
          .insert({ id: 1, count: 0, updated_at: new Date().toISOString() })
          .select('count')
          .single()
        
        if (insertError) throw insertError
        return NextResponse.json({ count: newData?.count || 0, success: true })
      }
      throw error
    }
    
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
    console.log('🔄 POST /api/visits - Iniciando registro de visita...')
    const supabase = getSupabaseClient()
    
    // Obtener el contador actual
    console.log('📊 Obteniendo contador actual...')
    const { data: currentData, error: selectError } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('id', 1)
      .single()
    
    let currentCount = 0
    
    if (selectError) {
      console.log('⚠️ Error al obtener contador:', selectError.message, selectError.code)
      // Si no existe el registro, crear uno inicial
      if (selectError.code === 'PGRST116' || selectError.message.includes('No rows')) {
        console.log('📝 Creando registro inicial...')
        const { data: newData, error: insertError } = await supabase
          .from('visit_counter')
          .insert({ id: 1, count: 1, updated_at: new Date().toISOString() })
          .select('count')
          .single()
        
        if (insertError) {
          console.error('❌ Error al insertar:', insertError.message)
          throw insertError
        }
        console.log('✅ POST - Visita inicial creada. Total: 1')
        return NextResponse.json({ count: newData?.count || 1, success: true })
      }
      throw selectError
    }
    
    currentCount = currentData?.count || 0
    console.log('📊 Contador actual:', currentCount)
    const newCount = currentCount + 1
    console.log('➕ Nuevo contador:', newCount)
    
    // Actualizar el contador usando upsert para evitar problemas de permisos
    console.log('💾 Actualizando contador en Supabase...')
    const { data: updatedData, error: updateError } = await supabase
      .from('visit_counter')
      .upsert({ id: 1, count: newCount, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      .select('count')
      .single()
    
    if (updateError) {
      console.error('❌ Error al actualizar:', updateError.message)
      console.error('❌ Código de error:', updateError.code)
      console.error('❌ Detalles:', updateError.details)
      console.error('❌ Hint:', updateError.hint)
      
      // Si falla el update, intentar con insert (por si acaso el registro desapareció)
      if (updateError.code === '42501' || updateError.message.includes('permission') || updateError.message.includes('policy')) {
        console.log('⚠️ Error de permisos detectado. Verifica las políticas RLS en Supabase.')
        console.log('⚠️ Asegúrate de usar SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.')
      }
      
      throw updateError
    }
    
    const finalCount = updatedData?.count || newCount
    console.log('✅ POST - Visita incrementada Supabase. Total:', finalCount)
    return NextResponse.json({ count: finalCount, success: true })
  } catch (error: any) {
    console.error('❌ Error Supabase POST:', error.message)
    console.error('❌ Stack:', error.stack)
    return NextResponse.json({ count: 0, success: false, error: error.message }, { status: 500 })
  }
}
