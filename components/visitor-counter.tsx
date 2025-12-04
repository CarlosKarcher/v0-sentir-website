"use client"

import { useEffect, useState } from "react"

// Base de inicio para el contador
const BASE_COUNT = 1500

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(BASE_COUNT)

  useEffect(() => {
    const updateCounter = async () => {
      try {
        // Obtener contador local guardado
        const localCount = localStorage.getItem('sentirLocalVisits')
        let savedCount = localCount ? parseInt(localCount) : 0
        
        // Verificar si es una nueva sesión
        const sessionCounted = sessionStorage.getItem('sentirVisitCounted')
        
        if (!sessionCounted) {
          // Nueva sesión: incrementar
          savedCount += 1
          localStorage.setItem('sentirLocalVisits', savedCount.toString())
          sessionStorage.setItem('sentirVisitCounted', 'true')
          console.log('Nueva visita local registrada:', savedCount)
        }
        
        // Calcular el contador total (base + visitas locales)
        const totalCount = BASE_COUNT + savedCount
        
        // Intentar sincronizar con API externa (sin bloquear)
        fetch('https://api.countapi.xyz/hit/sentirweb2025/total', { 
          method: 'GET',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(data => {
            if (data.value && data.value > totalCount) {
              console.log('Contador API:', data.value)
              animateCounter(data.value)
            } else {
              animateCounter(totalCount)
            }
          })
          .catch(() => {
            // Si falla la API, usar contador local
            animateCounter(totalCount)
          })
        
        // Función de animación
        function animateCounter(finalCount: number) {
          const startCount = Math.max(BASE_COUNT, finalCount - 50)
          const duration = 1000
          const steps = 30
          const increment = (finalCount - startCount) / steps
          let current = 0
          
          const timer = setInterval(() => {
            current++
            const newValue = Math.floor(startCount + (increment * current))
            
            if (current >= steps) {
              setDisplayCount(finalCount)
              clearInterval(timer)
            } else {
              setDisplayCount(newValue)
            }
          }, duration / steps)
        }
        
      } catch (error) {
        console.error('Error en contador:', error)
        // En caso de error, mostrar base + visitas locales
        const localCount = localStorage.getItem('sentirLocalVisits')
        const savedCount = localCount ? parseInt(localCount) : 0
        setDisplayCount(BASE_COUNT + savedCount)
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

