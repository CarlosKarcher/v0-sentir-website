"use client"

import { Facebook, Instagram, Mail, Phone, Copy, Check } from "lucide-react"
import { useState } from "react"
import { handleNavigationClick } from "@/lib/scroll"
import { SECTION_IDS } from "@/lib/constants"

export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText("Sentirpsc@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="bg-muted/50 border-t" id="contacto">
      <div className="container px-4 py-8 sm:py-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary">SENTIR</h3>
            <p className="text-xs sm:text-sm text-muted-foreground text-pretty">
              Comunidad para el liderazgo y desarrollo personal
            </p>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href={`#${SECTION_IDS.QUIENES_SOMOS}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.QUIENES_SOMOS)}
                >
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a 
                  href={`#${SECTION_IDS.TALLERES}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.TALLERES)}
                >
                  Talleres
                </a>
              </li>
              <li>
                <a 
                  href={`#${SECTION_IDS.TESTIMONIOS}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.TESTIMONIOS)}
                >
                  Testimonios
                </a>
              </li>
              <li>
                <a 
                  href={`#${SECTION_IDS.EQUIPO}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.EQUIPO)}
                >
                  Equipo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                  <a
                    href="mailto:Sentirpsc@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all underline"
                  >
                    Sentirpsc@gmail.com
                  </a>
                  <button
                    onClick={copyEmail}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors flex items-center gap-1 w-fit"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar email
                      </>
                    )}
                  </button>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+542966595803"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    2966-595803
                  </a>
                  <a
                    href="tel:+542966211547"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    2966-211547
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/CARCAMOFERNANDOJAVIER"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/fernandojaviercarcamo"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} SENTIR LIDERES. Todos los derechos reservados.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            © 2025 - Idea y Desarrollo de la Web: Erick Karcher & Carlos Karcher
          </p>
        </div>
      </div>
    </footer>
  )
}
