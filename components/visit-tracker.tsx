"use client"

import { useEffect } from "react"

export function VisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log('Registrando visita...')
        const response = await fetch('/api/visits', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        console.log('Visita registrada. Contador actual:', data.count)
      } catch (error) {
        console.error('Error al registrar visita:', error)
      }
    }

    trackVisit()
  }, [])

  return null
}

