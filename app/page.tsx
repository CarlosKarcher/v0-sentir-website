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
import { Footer } from "@/components/footer"

export default function Page() {
  useEffect(() => {
    // Scroll al inicio cuando se carga o actualiza la página
    window.scrollTo(0, 0)
    
    // También manejar el evento de carga
    const handleLoad = () => {
      window.scrollTo(0, 0)
    }
    
    window.addEventListener('load', handleLoad)
    
    return () => {
      window.removeEventListener('load', handleLoad)
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
      <Footer />
    </main>
  )
}
