"use client"

import { useEffect, useState } from "react"

export function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('visitorCount')
      const lastVisit = localStorage.getItem('lastVisit')
      const today = new Date().toDateString()

      let currentCount = storedCount ? parseInt(storedCount) : 1000

      // Si es una nueva visita (diferente día o primera vez)
      if (!lastVisit || lastVisit !== today) {
        currentCount += 1
        localStorage.setItem('visitorCount', currentCount.toString())
        localStorage.setItem('lastVisit', today)
      }

      setCount(currentCount)

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

