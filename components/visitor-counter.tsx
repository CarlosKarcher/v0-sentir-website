"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(1500)

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch('/api/visits', { 
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          const count = data.count || 1500
          
          console.log('Mostrando contador:', count)
          setDisplayCount(count)
        }
      } catch (error) {
        console.error('Error al obtener contador:', error)
        setDisplayCount(1500)
      }
    }

    // Obtener contador inicial
    fetchCounter()
    
    // Actualizar cada 3 segundos para ver cambios
    const interval = setInterval(fetchCounter, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

