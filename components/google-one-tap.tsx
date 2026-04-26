"use client"

import { useEffect } from "react"
import { useUser } from "@/lib/user-context"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void
          cancel: () => void
          renderButton: (element: HTMLElement, config: object) => void
        }
      }
    }
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export function GoogleOneTap() {
  const { estado, loginWithToken } = useUser()

  useEffect(() => {
    if (estado !== "no_logueado") return
    if (!CLIENT_ID) return

    const init = () => {
      window.google!.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential: string }) => {
          loginWithToken(response.credential)
        },
        auto_select: true,
        cancel_on_tap_outside: false,
        itp_support: true,
      })
      window.google!.accounts.id.prompt()
    }

    if (window.google?.accounts?.id) {
      init()
    } else {
      const existing = document.getElementById("gsi-script")
      if (existing) { existing.addEventListener("load", init); return }
      const script = document.createElement("script")
      script.id = "gsi-script"
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = init
      document.head.appendChild(script)
    }

    return () => {
      window.google?.accounts?.id?.cancel()
    }
  }, [estado, loginWithToken])

  return null
}

// Renders the official Google button inside a container div
export function GoogleOneTapButton({ className }: { className?: string }) {
  const { estado, loginWithToken } = useUser()

  useEffect(() => {
    if (!CLIENT_ID) return

    const render = () => {
      const container = document.getElementById("google-onetap-btn")
      if (!container) return
      window.google!.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential: string }) => {
          loginWithToken(response.credential)
        },
        auto_select: false,
      })
      window.google!.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 280,
        locale: "es",
      })
    }

    if (window.google?.accounts?.id) {
      render()
    } else {
      const existing = document.getElementById("gsi-script")
      if (existing) { existing.addEventListener("load", render); return }
      const script = document.createElement("script")
      script.id = "gsi-script"
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = render
      document.head.appendChild(script)
    }
  }, [estado, loginWithToken])

  return <div id="google-onetap-btn" className={className} />
}
