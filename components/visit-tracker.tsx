"use client"

import { useEffect, useRef } from "react"

export function VisitTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Evitar que se ejecute múltiples veces (React Strict Mode en desarrollo)
    if (hasTracked.current) return
    hasTracked.current = true

    const trackVisit = async () => {
      try {
        console.log('🔄 Registrando visita...')
        const response = await fetch('/api/visits', { 
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          console.log('✅ Visita registrada. Contador actual:', data.count)
        } else {
          console.error('❌ Error al registrar visita:', data.error)
        }
      } catch (error) {
        console.error('❌ Error al registrar visita:', error)
      }
    }

    // Pequeño delay para asegurar que la página está completamente cargada
    const timeoutId = setTimeout(trackVisit, 100)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}

