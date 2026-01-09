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
import { SentirDesdeAdentro } from "@/components/sentir-desde-adentro"
import { Footer } from "@/components/footer"
import { VideoPresentation } from "@/components/video-presentation"

export default function Page() {
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window !== "undefined") {
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
      <VideoPresentation />
      <Header />
      <Hero />
      <About />
      <Events />
      <Inspiration />
      <Testimonials />
      <Workshops />
      <Team />
      <Merchandising />
      <SentirDesdeAdentro />
      <Footer />
    </main>
  )
}
