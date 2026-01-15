"use client"

import { Music } from "lucide-react"

export function MusicaSentir() {
  return (
    <section id="musica-sentir" className="py-12 sm:py-16 md:py-20 bg-secondary/30 w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
              Música de Sentir
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Disfruta de nuestra playlist especial con música que inspira y conecta
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6">
            <iframe
              src="https://open.spotify.com/embed/playlist/0syWJWrkHEPSAwvZVp3fXI?utm_source=generator&theme=0"
              width="100%"
              height="500"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
              title="Playlist SENTIR - Coach Fernando Cárcamo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
