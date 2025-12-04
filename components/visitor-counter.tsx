"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch('/api/visits', { 
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Contador desde KV:', data.count)
          setDisplayCount(data.count)
          setError(false)
        } else {
          console.error('❌ Error HTTP:', response.status)
          setError(true)
        }
      } catch (error) {
        console.error('❌ Error al obtener contador:', error)
        setError(true)
      }
    }

    // Obtener contador inicial
    fetchCounter()
    
    // Actualizar cada 3 segundos para ver cambios
    const interval = setInterval(fetchCounter, 3000)
    
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <span className="tabular-nums text-red-500">Error</span>
  }

  return (
    <span className="tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

