"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(1500)

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        // Simplemente obtener el contador actual del servidor
        const response = await fetch('/api/visits', { 
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          const count = data.count || 1500
          
          console.log('Contador global:', count)
          
          // Mostrar con animación simple
          const startCount = Math.max(1500, count - 30)
          const duration = 800
          const steps = 25
          const increment = (count - startCount) / steps
          let current = 0
          
          const timer = setInterval(() => {
            current++
            const newValue = Math.floor(startCount + (increment * current))
            
            if (current >= steps || newValue >= count) {
              setDisplayCount(count)
              clearInterval(timer)
            } else {
              setDisplayCount(newValue)
            }
          }, duration / steps)
          
          return () => clearInterval(timer)
        }
      } catch (error) {
        console.error('Error al obtener contador:', error)
        setDisplayCount(1500)
      }
    }

    fetchCounter()
  }, [])

  return (
    <span className="tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

