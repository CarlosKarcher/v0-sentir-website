"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Verificar si ya se contó esta sesión
        const sessionCounted = sessionStorage.getItem('globalSessionCounted')
        
        // Namespace y key únicos para esta página
        const namespace = 'sentir-website'
        const key = 'total-visitors'
        
        let response
        
        // Solo incrementar si es una nueva sesión
        if (!sessionCounted) {
          // Incrementar y obtener el contador
          response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
          sessionStorage.setItem('globalSessionCounted', 'true')
        } else {
          // Solo obtener el contador actual sin incrementar
          response = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        }
        
        const data = await response.json()
        const count = data.value || 0
        
        // Animación del contador
        const animationDuration = 1000
        const steps = 30
        const startCount = Math.max(0, count - 50)
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
        
        setIsLoading(false)
        
        return () => clearInterval(timer)
      } catch (error) {
        console.error('Error al obtener contador de visitas:', error)
        setDisplayCount(0)
        setIsLoading(false)
      }
    }

    fetchVisitorCount()
  }, [])

  if (isLoading) {
    return (
      <span className="tabular-nums">
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

