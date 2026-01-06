"use client"

import { Button } from "@/components/ui/button"

export function Merchandising() {
  return (
    <section id="merchandising" className="py-12 sm:py-16 md:py-20 bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Merchandising</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Descubre nuestros productos oficiales de Sentir
          </p>
        </div>

        <div className="flex justify-center items-center">
          <Button
            size="lg"
            className="px-8 py-6 text-base sm:text-lg font-semibold"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.open("https://tienda-sentir.com", "_blank")
              }
            }}
          >
            Ingresar a la Tienda oficial de Sentir
          </Button>
        </div>
      </div>
    </section>
  )
}

