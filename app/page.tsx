"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Events } from "@/components/events"
import { CalendarioSentir } from "@/components/calendario-sentir"
import { Inspiration } from "@/components/inspiration"
import { Testimonials } from "@/components/testimonials"
import { Workshops } from "@/components/workshops"
import { Team } from "@/components/team"
import { Merchandising } from "@/components/merchandising"
import { MusicaSentir } from "@/components/musica-sentir"
import { SentirDesdeAdentro } from "@/components/sentir-desde-adentro"
import { AnotateModal } from "@/components/anotate"
import { Footer } from "@/components/footer"
export default function Page() {
  const [showAnotate, setShowAnotate] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Asegurar que la página comience en el inicio cuando no hay hash
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: "instant" })
      }
      // Prevenir el scroll automático del navegador al recargar
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual"
      }
    }
  }, [])

  return (
    <main className="min-h-screen">
      <AnotateModal isOpen={showAnotate} onClose={() => setShowAnotate(false)} />
      <Header onAnotate={() => setShowAnotate(true)} />
      <Hero onAnotate={() => setShowAnotate(true)} />
      <About />
      <CalendarioSentir />
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
