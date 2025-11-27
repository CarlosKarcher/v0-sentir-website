"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Video } from "lucide-react"
import { SECTION_IDS } from "@/lib/constants"

const videos = [
  {
    title: "Tres Días para Vos",
    video: "/tres dias para vos.mp4",
  },
  {
    title: "Autoconocimiento no ha sido fácil",
    video: "/Autoconocimiento no ha sido facil.mp4",
  },
  {
    title: "Quiénes Somos",
    video: "/Quienes Somos.mp4",
  },
]

export function SentirDesdeAdentro() {
  return (
    <section id={SECTION_IDS.SENTIR_DESDE_ADENTRO} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Sentir desde Adentro</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Videos que reflejan nuestra esencia y misión
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <video
                    src={video.video}
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                    playsInline
                    onError={(e) => {
                      console.error(`Error al cargar el video: ${video.video}`, e)
                    }}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">{video.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

