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
import { Footer } from "@/components/footer"

export default function Page() {
  useEffect(() => {
    // Asegurar que la página comience en el inicio cuando no hay hash
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    
    // También prevenir el scroll automático del navegador al recargar
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Events />
      <Inspiration />
      <Testimonials />
      <Workshops />
      <Team />
      <Merchandising />
      <Footer />
    </main>
  )
}
