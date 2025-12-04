"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si ya se contó esta sesión
      const sessionCounted = sessionStorage.getItem('sessionCounted')
      
      // Obtener el contador actual (inicia desde 0)
      const storedCount = localStorage.getItem('visitorCount')
      let currentCount = storedCount ? parseInt(storedCount) : 0

      // Solo incrementar si es una nueva sesión
      if (!sessionCounted) {
        currentCount += 1
        localStorage.setItem('visitorCount', currentCount.toString())
        sessionStorage.setItem('sessionCounted', 'true')
      }

      // Animación del contador
      const animationDuration = 1000 // 1 segundo
      const steps = 30
      const startCount = Math.max(0, currentCount - 50)
      const increment = (currentCount - startCount) / steps
      let currentStep = 0
      
      const timer = setInterval(() => {
        currentStep++
        const newCount = Math.floor(startCount + (increment * currentStep))
        
        if (currentStep >= steps || newCount >= currentCount) {
          setDisplayCount(currentCount)
          clearInterval(timer)
        } else {
          setDisplayCount(newCount)
        }
      }, animationDuration / steps)

      return () => clearInterval(timer)
    }
  }, [])

  return (
    <span className="text-sm font-medium text-black tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

