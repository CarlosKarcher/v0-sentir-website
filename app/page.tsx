"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Events } from "@/components/events"
import { Inspiration } from "@/components/inspiration"
import { Testimonials } from "@/components/testimonials"
import { Workshops } from "@/components/workshops"
import { Team } from "@/components/team"
import { Merchandising } from "@/components/merchandising"
import { MusicaSentir } from "@/components/musica-sentir"
import { SentirDesdeAdentro } from "@/components/sentir-desde-adentro"
import { Footer } from "@/components/footer"
import { AutoconocimientoVideoPopup } from "@/components/autoconocimiento-video-popup"

export default function Page() {
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window !== "undefined") {
      // Limpiar todas las cookies del dominio actual
      const clearCookies = () => {
        const domain = window.location.hostname
        const cookies = document.cookie.split(";")
        
        cookies.forEach((cookie) => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          
          // Eliminar cookie para el dominio actual
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          // También intentar eliminar para subdominios
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`
        })
        
        // Limpiar también localStorage y sessionStorage
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (e) {
          console.log("Error al limpiar storage:", e)
        }
      }
      
      // Ejecutar limpieza de cookies al cargar
      clearCookies()
      
      // Asegurar que la página comience en el inicio cuando no hay hash
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: "instant" })
      }
      
      // También prevenir el scroll automático del navegador al recargar
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual"
      }
    }
  }, [])

  return (
    <main className="min-h-screen">
      <AutoconocimientoVideoPopup />
      <Header />
      <Hero />
      <About />
      <Events />
      <Inspiration />
      <Testimonials />
      <Workshops />
      <Team />
      <MusicaSentir />
      <Merchandising />
      <SentirDesdeAdentro />
      <Footer />
    </main>
  )
}
