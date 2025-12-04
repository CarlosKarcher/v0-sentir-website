"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(1500)

  useEffect(() => {
    const updateCounter = async () => {
      try {
        // Verificar si ya contamos esta sesión del navegador
        const sessionCounted = sessionStorage.getItem('sentirGlobalVisitCounted')
        
        let finalCount = 1500
        
        if (!sessionCounted) {
          // Nueva sesión: incrementar en el servidor
          console.log('Nueva sesión detectada, incrementando contador...')
          const response = await fetch('/api/visits', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          
          if (response.ok) {
            const data = await response.json()
            finalCount = data.count
            sessionStorage.setItem('sentirGlobalVisitCounted', 'true')
            console.log('Contador incrementado a:', finalCount)
          }
        } else {
          // Sesión existente: solo obtener el contador actual
          console.log('Sesión existente, obteniendo contador...')
          const response = await fetch('/api/visits', { 
            method: 'GET' 
          })
          
          if (response.ok) {
            const data = await response.json()
            finalCount = data.count
            console.log('Contador actual:', finalCount)
          }
        }
        
        // Animación del contador
        const startCount = Math.max(1500, finalCount - 50)
        const duration = 1000
        const steps = 30
        const increment = (finalCount - startCount) / steps
        let current = 0
        
        const timer = setInterval(() => {
          current++
          const newValue = Math.floor(startCount + (increment * current))
          
          if (current >= steps || newValue >= finalCount) {
            setDisplayCount(finalCount)
            clearInterval(timer)
          } else {
            setDisplayCount(newValue)
          }
        }, duration / steps)
        
        return () => clearInterval(timer)
        
      } catch (error) {
        console.error('Error al obtener contador:', error)
        setDisplayCount(1500)
      }
    }

    updateCounter()
  }, [])

  return (
    <span className="tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

