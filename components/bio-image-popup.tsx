"use client"

import React, { useEffect, useState, useCallback } from "react"

const IMAGE_SRC = "/Bio-ni%C3%B1o-7-03-2026.jpeg"
const DURATION_MS = 20 * 1000 // 20 segundos
const MOVE_INTERVAL_MS = 2500
const SIZE_CM = 10

const COUNTDOWN_START = 20

export function BioImagePopup() {
  const [visible, setVisible] = useState(true)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [countdown, setCountdown] = useState(COUNTDOWN_START)

  const moveToRandomPosition = useCallback(() => {
    if (typeof window === "undefined") return
    const cmToPx = (cm: number) => (cm / 2.54) * 96
    const sizePx = cmToPx(SIZE_CM)
    const maxX = Math.max(0, window.innerWidth - sizePx)
    const maxY = Math.max(0, window.innerHeight - sizePx)
    const x = Math.random() * maxX
    const y = Math.random() * maxY
    setPosition({ x, y })
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), DURATION_MS)
    return () => clearTimeout(timer)
  }, [visible])

  useEffect(() => {
    if (!visible || countdown <= 0) return
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [visible, countdown])

  useEffect(() => {
    if (!visible) return
    moveToRandomPosition()
    const interval = setInterval(moveToRandomPosition, MOVE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [visible, moveToRandomPosition])

  if (!visible) return null

  return (
    <div
      className="fixed z-[10001] pointer-events-none transition-all duration-1000 ease-in-out relative"
      style={{
        left: position.x,
        top: position.y,
        width: `${SIZE_CM}cm`,
        height: `${SIZE_CM}cm`,
        minWidth: `${SIZE_CM}cm`,
        minHeight: `${SIZE_CM}cm`,
        maxWidth: "90vw",
        maxHeight: "90vh",
      }}
      aria-hidden
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <img
          src={IMAGE_SRC}
          alt=""
          className="w-full h-full object-contain drop-shadow-2xl rounded-lg"
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex justify-center">
          <span className="tabular-nums text-xl font-bold text-foreground bg-background/90 px-3 py-1 rounded-full shadow-md">
            {countdown}
          </span>
        </div>
      </div>
    </div>
  )
}
