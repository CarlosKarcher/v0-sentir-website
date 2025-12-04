"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Verificar si ya se contó esta sesión
        const sessionCounted = sessionStorage.getItem('sentirSessionCounted')
        
        // ID único para el contador
        const counterId = 'sentir-liderazgo-website-2025'
        
        let count = 0
        
        // Solo incrementar si es una nueva sesión
        if (!sessionCounted) {
          // Incrementar el contador usando la API hit
          const hitResponse = await fetch(`https://api.countapi.xyz/hit/${counterId}`)
          
          if (!hitResponse.ok) {
            throw new Error('Error en la respuesta de la API')
          }
          
          const hitData = await hitResponse.json()
          count = hitData.value || 1
          
          // Marcar esta sesión como contada
          sessionStorage.setItem('sentirSessionCounted', 'true')
          
          console.log('Nueva visita registrada:', count)
        } else {
          // Solo obtener el contador actual sin incrementar
          const getResponse = await fetch(`https://api.countapi.xyz/get/${counterId}`)
          
          if (!getResponse.ok) {
            throw new Error('Error al obtener contador')
          }
          
          const getData = await getResponse.json()
          count = getData.value || 0
          
          console.log('Visita existente, contador:', count)
        }
        
        // Animación del contador
        if (count > 0) {
          const animationDuration = 1000
          const steps = 30
          const startCount = Math.max(1, count - 50)
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
        } else {
          setDisplayCount(count)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error al obtener contador de visitas:', error)
        // En caso de error, mostrar un valor por defecto
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

