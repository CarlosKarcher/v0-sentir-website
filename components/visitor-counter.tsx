"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Verificar si ya se contó esta sesión
        const sessionCounted = sessionStorage.getItem('sentirVisitCounted')
        
        let count = 0
        
        // Solo incrementar si es una nueva sesión
        if (!sessionCounted) {
          // Incrementar usando nuestra propia API
          const response = await fetch('/api/visits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            count = data.count || 1
            
            // Marcar esta sesión como contada
            sessionStorage.setItem('sentirVisitCounted', 'true')
            
            console.log('Nueva visita registrada:', count)
          } else {
            throw new Error('Error al incrementar contador')
          }
        } else {
          // Solo obtener el contador actual sin incrementar
          const response = await fetch('/api/visits', {
            method: 'GET',
          })
          
          if (response.ok) {
            const data = await response.json()
            count = data.count || 0
            
            console.log('Visita existente, contador:', count)
          } else {
            throw new Error('Error al obtener contador')
          }
        }
        
        // Animación del contador
        if (count > 0) {
          const animationDuration = 800
          const steps = 25
          const startCount = Math.max(1, count - 30)
          const increment = (count - startCount) / steps
          let currentStep = 0
          
          const timer = setInterval(() => {
            currentStep++
            const newCount = Math.floor(startCount + (increment * currentStep))
            
            if (currentStep >= steps || newCount >= count) {
              setDisplayCount(count)
              clearInterval(timer)
            } else {
              setDisplayCount(newCount)
            }
          }, animationDuration / steps)
          
          return () => clearInterval(timer)
        } else {
          setDisplayCount(count)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error al obtener contador de visitas:', error)
        // En caso de error, mostrar un valor mínimo
        setDisplayCount(1)
        setIsLoading(false)
      }
    }

    fetchVisitorCount()
  }, [])

  if (isLoading) {
    return (
      <span className="tabular-nums text-muted-foreground">
        ...
      </span>
    )
  }

  return (
    <span className="tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

