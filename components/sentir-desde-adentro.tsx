"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video } from "lucide-react"
import { SECTION_IDS } from "@/lib/constants"

const videosInstitucionales = [
  {
    title: "No ha sido fácil",
    video: "/No ha sido facil.mp4",
  },
  {
    title: "Tres días para vos",
    video: "/tres dias para vos.mp4",
  },
  {
    title: "Círculo Sentir Vialidad",
    video: "/Circulo Sentir Vialidad.mp4",
  },
]

const videosAsiSomos = [
  {
    title: "Fer Pogo uno",
    video: "/Fer Pogo uno.mp4",
  },
  {
    title: "Fer Prevención del Suicidio",
    video: "/Fer Prevencion del Suicidio.mp4",
  },
  {
    title: "Sentir en club Mataderos",
    video: "/Sentir en club Mataderos.mp4",
  },
  {
    title: "Sentir mano 4D",
    video: "/Sentir mano 4D.mp4",
  },
]

export function SentirDesdeAdentro() {
  const [activeTab, setActiveTab] = useState("institucional")

  return (
    <section id={SECTION_IDS.SENTIR_DESDE_ADENTRO} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Sentir desde Adentro</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Videos que reflejan nuestra esencia y misión
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="institucional" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Institucional
            </TabsTrigger>
            <TabsTrigger value="asi-somos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Así Somos...
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institucional">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosInstitucionales.map((video, index) => (
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
          </TabsContent>

          <TabsContent value="asi-somos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosAsiSomos.map((video, index) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

