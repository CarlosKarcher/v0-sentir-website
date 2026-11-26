import type { Metadata, Viewport } from "next"
import { Fraunces, Inter, Pinyon_Script } from "next/font/google"
import "./esencia.css"
import { EsenciaAcceso } from "@/components/esencia/Acceso"

// Nuestra Esencia: juego de encuentro (ideado por Carlos Karcher), con su propia estética dentro de Sentir
const serif = Fraunces({ subsets: ["latin"], variable: "--f-serif", weight: ["300", "400", "500"], style: ["normal", "italic"] })
const sans = Inter({ subsets: ["latin"], variable: "--f-sans" })
// caligráfica, para la firma del autor en el dorso de las cartas
const firma = Pinyon_Script({ subsets: ["latin"], variable: "--f-firma", weight: "400" })

export const metadata: Metadata = {
  title: "Nuestra Esencia · Sentir",
  description: "Un juego de encuentro para descubrir nuestra esencia. De 2 a 6 personas, a distancia, con video.",
}

export const viewport: Viewport = { themeColor: "#17120f", width: "device-width", initialScale: 1, viewportFit: "cover" }

export default function EsenciaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`esencia ${serif.variable} ${sans.variable} ${firma.variable}`}>
      <EsenciaAcceso>{children}</EsenciaAcceso>
    </div>
  )
}
