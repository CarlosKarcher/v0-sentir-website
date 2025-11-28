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
import { SentirDesdeAdentro } from "@/components/sentir-desde-adentro"
import { Footer } from "@/components/footer"

export default function Page() {
  useEffect(() => {
    // Función para hacer scroll al inicio siempre
    const scrollToTop = () => {
      // Scroll inmediato sin animación - siempre al inicio
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      })
      // También usar scrollTo tradicional como respaldo
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
    }
    
    // Scroll inmediato al montar (antes de que se renderice)
    scrollToTop()
    
    // Usar requestAnimationFrame para asegurar que se ejecute después del render
    requestAnimationFrame(() => {
      scrollToTop()
    })
    
    // También después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      scrollToTop()
    }, 0)
    
    // Manejar cuando se hace refresh o carga nueva
    const handleLoad = () => {
      scrollToTop()
    }
    
    // Manejar cuando se hace refresh (pageshow detecta refresh vs navegación)
    const handlePageshow = (e: PageTransitionEvent) => {
      // Si es una carga nueva (no desde caché), hacer scroll al inicio
      if (!e.persisted) {
        scrollToTop()
      }
    }
    
    // Manejar cuando se hace refresh (beforeunload no es confiable)
    const handleBeforeUnload = () => {
      // Limpiar cualquier posición de scroll guardada
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual'
      }
    }
    
    // Configurar scroll restoration manual
    if (typeof window !== 'undefined' && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
    
    window.addEventListener('load', handleLoad)
    window.addEventListener('pageshow', handlePageshow)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('pageshow', handlePageshow)
      window.removeEventListener('beforeunload', handleBeforeUnload)
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
      <SentirDesdeAdentro />
      <Footer />
    </main>
  )
}
