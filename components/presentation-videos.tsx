"use client"

import * as React from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_PATHS = ["/01-Guerrero-15-02.mp4", "/02-Guerrero-15-02.mp4"]

function getVideoSrc(path: string): string {
  if (typeof window === "undefined") return path
  return `${window.location.origin}${path}`
}

export function PresentationVideos() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [playing, setPlaying] = React.useState(false)
  const [errors, setErrors] = React.useState<boolean[]>([false, false])
  const [loading, setLoading] = React.useState<boolean[]>([true, true])
  const [retryCount, setRetryCount] = React.useState([0, 0])
  const videoRefs = [React.useRef<HTMLVideoElement>(null), React.useRef<HTMLVideoElement>(null)]

  const hasAnyError = errors[0] || errors[1]
  const isLoading = loading[0] || loading[1]

  const handleClose = () => {
    videoRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })
    setIsOpen(false)
  }

  const handlePlayFirst = async () => {
    const first = videoRefs[0].current
    if (!first) return
    try {
      await first.play()
      setPlaying(true)
      setLoading((prev) => {
        const next = [...prev]
        next[0] = false
        return next
      })
    } catch (err) {
      if ((err as Error).name !== "NotAllowedError") {
        setErrors((prev) => {
          const next = [...prev]
          next[0] = true
          return next
        })
      }
    }
  }

  const handleEnded = (index: number) => () => {
    if (index === 0) {
      videoRefs[1].current?.play().then(() => {
        setLoading((prev) => {
          const next = [...prev]
          next[1] = false
          return next
        })
      }).catch(() => {
        setErrors((prev) => {
          const next = [...prev]
          next[1] = true
          return next
        })
      })
    } else {
      setPlaying(false)
    }
  }

  const handleError = (index: number) => (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const el = e.currentTarget
    const err = el.error
    const url = el.src || getVideoSrc(VIDEO_PATHS[index])
    if (err) {
      const codigos: Record<number, string> = {
        1: "MEDIA_ERR_ABORTED",
        2: "MEDIA_ERR_NETWORK",
        3: "MEDIA_ERR_DECODE",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
      }
      console.error(`[Presentación] Video ${index + 1}:`, codigos[err.code] || err.code, "URL:", url)
    } else {
      console.error("[Presentación] Error sin detalles. URL:", url)
    }
    if (retryCount[index] < 2) {
      setRetryCount((prev) => {
        const next = [...prev]
        next[index] += 1
        return next
      })
      setLoading((prev) => {
        const next = [...prev]
        next[index] = true
        return next
      })
      setErrors((prev) => {
        const next = [...prev]
        next[index] = false
        return next
      })
      setTimeout(() => videoRefs[index].current?.load(), 800)
    } else {
      setErrors((prev) => {
        const next = [...prev]
        next[index] = true
        return next
      })
      setLoading((prev) => {
        const next = [...prev]
        next[index] = false
        return next
      })
    }
  }

  const handleRetry = (index: number) => () => {
    setErrors((prev) => {
      const next = [...prev]
      next[index] = false
      return next
    })
    setRetryCount((prev) => {
      const next = [...prev]
      next[index] = 0
      return next
    })
    setLoading((prev) => {
      const next = [...prev]
      next[index] = true
      return next
    })
    const ref = videoRefs[index].current
    if (ref) {
      ref.src = getVideoSrc(VIDEO_PATHS[index])
      ref.load()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-2">
        <div
          className="relative bg-background rounded-lg shadow-2xl pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(42rem, 96vw)",
            maxWidth: "96vw",
            maxHeight: "90vh",
            padding: "0.5rem",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-[10000] rounded-full hover:bg-destructive hover:text-destructive-foreground cursor-pointer bg-background/80"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleClose()
            }}
            aria-label="Cerrar presentación"
            type="button"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex gap-2 flex-1 min-h-0 mt-8">
            {VIDEO_PATHS.map((path, index) => (
              <div
                key={`${index}-${retryCount[index]}`}
                className="flex-1 min-w-0 flex flex-col items-center justify-center rounded-lg overflow-hidden bg-muted/30"
              >
                {errors[index] ? (
                  <div className="text-center p-4 space-y-2 w-full">
                    <p className="text-sm font-semibold">Error video {index + 1}</p>
                    <p className="text-xs text-muted-foreground break-all">{path}</p>
                    <Button variant="outline" size="sm" onClick={handleRetry(index)}>
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
                    {loading[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-lg">
                        <span className="text-xs text-muted-foreground">Cargando...</span>
                      </div>
                    )}
                    <video
                      ref={videoRefs[index]}
                      src={getVideoSrc(path)}
                      playsInline
                      preload="auto"
                      controls={playing}
                      muted={false}
                      className="w-full h-full rounded-lg object-contain block"
                      onError={handleError(index)}
                      onEnded={handleEnded(index)}
                      onCanPlay={() =>
                        setLoading((prev) => {
                          const next = [...prev]
                          next[index] = false
                          return next
                        })
                      }
                      onPlaying={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    >
                      Tu navegador no soporta el video.
                    </video>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!playing && !hasAnyError && (
            <div className="flex justify-center py-3">
              <Button
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlayFirst()
                }}
                className="rounded-full shadow-lg px-6 py-6 text-white font-semibold"
                style={{ backgroundColor: "#FFB84D", borderColor: "#FFB84D" }}
                aria-label="Reproducir videos"
                type="button"
              >
                <Play className="h-6 w-6 mr-2" />
                Reproducir
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
