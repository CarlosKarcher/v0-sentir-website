"use client"

import { useEffect, useRef, useState } from "react"

export function VisitorCounter() {
  const [displayCount, setDisplayCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const visitRegistered = useRef(false)

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const timestamp = Date.now()
        const response = await fetch(`/api/visits?t=${timestamp}`, {
          method: "GET",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        if (data.success !== false) {
          setDisplayCount(data.count)
        } else {
          setDisplayCount(0)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error contador:", error)
        setDisplayCount(0)
        setLoading(false)
      }
    }

    const registerVisit = async () => {
      if (visitRegistered.current) return
      visitRegistered.current = true
      try {
        const res = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()
        if (data.success && data.count != null) {
          setDisplayCount(data.count)
        }
      } catch {
        // Si falla el POST, fetchCounter ya mostró el valor actual
      } finally {
        setLoading(false)
      }
    }

    // Mostrar contador actual y registrar esta visita (POST incrementa)
    fetchCounter()
    registerVisit()

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

