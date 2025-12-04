"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch('/api/visits', { 
          method: 'GET',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }
        })
        
        const data = await response.json()
        
        if (data.success !== false) {
          console.log('✅ Contador:', data.count)
          setDisplayCount(data.count)
        } else {
          console.log('⚠️ API devolvió success=false')
          setDisplayCount(0)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ Error:', error)
        setDisplayCount(0)
        setLoading(false)
      }
    }

    // Obtener contador inicial
    fetchCounter()
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchCounter, 5000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <span className="tabular-nums text-muted-foreground">...</span>
  }

  return (
    <span className="tabular-nums">
      {displayCount !== null ? displayCount.toLocaleString('es-ES') : '0'}
    </span>
  )
}

