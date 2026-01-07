"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const productos = [
  { nombre: "Logo Fabi & Sandro", imagen: "/Tienda/logo de fabi & Sandro.jpeg" },
  { nombre: "Remeras Sentir y El Camino del Guerrero", imagen: "/Tienda/remeras Sentir y el camino del guerrero.jpeg" },
  { nombre: "Remeras Sentir", imagen: "/Tienda/remeras sentir.jpeg" },
  { nombre: "Agendas Sentir", imagen: "/Tienda/Agendas Sentir.jpeg" },
  { nombre: "Bitácoras", imagen: "/Tienda/Bitacoras.jpeg" },
  { nombre: "Dije Pines Lápices", imagen: "/Tienda/dije pines lapices.jpeg" },
  { nombre: "Lápices Ecológicos", imagen: "/Tienda/lapices ecologicos.jpeg" },
  { nombre: "Pines", imagen: "/Tienda/Pines.jpeg" },
]

interface TiendaProductosProps {
  onClose: () => void
}

export function TiendaProductos({ onClose }: TiendaProductosProps) {
  return (
    <div className="fixed inset-0 z-[10000] bg-background overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header con botón de cerrar */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance mb-2">
              Tienda Sentir - Productos diseñados por Faby & Brown
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Contacto → Fabi: 2966 540082 - Sandro: 2966 489050
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Cerrar tienda"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-center line-clamp-2">
                  {producto.nombre}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de cerrar al final */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            onClick={onClose}
            className="px-8 py-6 text-base sm:text-lg font-semibold"
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  )
}

