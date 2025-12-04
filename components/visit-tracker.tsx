"use client"

import { useEffect, useRef } from "react"

export function VisitTracker() {
  const trackedRef = useRef(false)

  useEffect(() => {
    // Solo ejecutar una vez por carga de página
    if (trackedRef.current) return
    trackedRef.current = true

    const trackVisit = async () => {
      try {
        await fetch('/api/visits', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        console.log('Visita registrada')
      } catch (error) {
        console.error('Error al registrar visita:', error)
      }
    }

    trackVisit()
  }, [])

  return null
}

