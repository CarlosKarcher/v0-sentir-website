"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { TiendaProductos } from "@/components/tienda-productos"

export function Merchandising() {
  const [showTienda, setShowTienda] = useState(false)

  const handleButtonClick = () => {
    setShowTienda(true)
  }

  const handleCloseTienda = () => {
    setShowTienda(false)
  }

  return (
    <section id="merchandising" className="py-12 sm:py-16 md:py-20 bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center" style={{ marginBottom: "1cm" }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Merchandising</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Descubre nuestros productos oficiales de Sentir
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <div 
            className="relative inline-block cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden group"
            onClick={handleButtonClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleButtonClick()
              }
            }}
            aria-label="Ingresar a la Tienda"
          >
            <img
              src="/logo-tienda-Sentir.jpeg"
              alt="Logo Tienda Sentir - Click para ingresar"
              className="object-contain transition-opacity duration-300 group-hover:opacity-90"
              style={{ width: "8cm", height: "10cm" }}
            />
            {/* Indicador visual de que es clickeable */}
            <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="h-5 w-5" />
            </div>
            {/* Borde sutil al hover */}
            <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
          </div>
          
        </div>
      </div>
      {showTienda && <TiendaProductos onClose={handleCloseTienda} />}
    </section>
  )
}

