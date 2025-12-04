"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Verificar si ya se contó esta sesión
        const sessionCounted = sessionStorage.getItem('sentirVisitCounted')
        
        let count = 0
        
        // Solo incrementar si es una nueva sesión
        if (!sessionCounted) {
          // Incrementar usando API alternativa más confiable
          const response = await fetch('https://api.countapi.xyz/hit/sentir-website-v2/visits')
          
          if (response.ok) {
            const data = await response.json()
            count = data.value || 1
            sessionStorage.setItem('sentirVisitCounted', 'true')
          } else {
            // Si falla, usar nuestra API interna como fallback
            const localResponse = await fetch('/api/visits', { method: 'POST' })
            if (localResponse.ok) {
              const localData = await localResponse.json()
              count = localData.count || 1
              sessionStorage.setItem('sentirVisitCounted', 'true')
            }
          }
        } else {
          // Obtener el contador actual
          const response = await fetch('https://api.countapi.xyz/get/sentir-website-v2/visits')
          
          if (response.ok) {
            const data = await response.json()
            count = data.value || 0
          } else {
            // Fallback a API local
            const localResponse = await fetch('/api/visits')
            if (localResponse.ok) {
              const localData = await localResponse.json()
              count = localData.count || 0
            }
          }
        }
        
        // Mostrar el contador con animación
        if (count > 0) {
          const startCount = Math.max(1, count - 30)
          const duration = 800
          const steps = 20
          const increment = (count - startCount) / steps
          let current = 0
          
          const timer = setInterval(() => {
            current++
            const newValue = Math.floor(startCount + (increment * current))
            
            if (current >= steps) {
              setDisplayCount(count)
              clearInterval(timer)
            } else {
              setDisplayCount(newValue)
            }
          }, duration / steps)
          
          return () => clearInterval(timer)
        } else {
          setDisplayCount(1)
        }
      } catch (error) {
        console.error('Error contador:', error)
        setDisplayCount(1)
      }
    }

    fetchVisitorCount()
  }, [])

  return (
    <span className="tabular-nums">
      {displayCount > 0 ? displayCount.toLocaleString('es-ES') : '1'}
    </span>
  )
}

