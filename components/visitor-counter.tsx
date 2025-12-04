"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si ya se contó esta sesión
      const sessionCounted = sessionStorage.getItem('sessionCounted')
      
      // Obtener el contador actual
      const storedCount = localStorage.getItem('visitorCount')
      let currentCount = storedCount ? parseInt(storedCount) : 1000

      // Solo incrementar si es una nueva sesión (primera carga de la página en esta sesión del navegador)
      if (!sessionCounted) {
        currentCount += 1
        localStorage.setItem('visitorCount', currentCount.toString())
        sessionStorage.setItem('sessionCounted', 'true')
      }

      // Animación del contador
      let startCount = Math.max(0, currentCount - 50)
      const increment = Math.ceil((currentCount - startCount) / 30)
      
      const timer = setInterval(() => {
        startCount += increment
        if (startCount >= currentCount) {
          setDisplayCount(currentCount)
          clearInterval(timer)
        } else {
          setDisplayCount(startCount)
        }
      }, 30)

      return () => clearInterval(timer)
    }
  }, [])

  if (displayCount === 0) return null

  return (
    <span className="text-sm font-medium text-black tabular-nums">
      {displayCount.toLocaleString('es-ES')}
    </span>
  )
}

