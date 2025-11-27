"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Función helper para hacer scroll suave a un elemento
  const scrollToElement = (elementId: string) => {
    // Función interna para hacer el scroll
    const performScroll = () => {
      // Buscar el elemento de múltiples formas
      let element = document.getElementById(elementId)
      
      // Si no se encuentra, intentar buscar por selector
      if (!element) {
        element = document.querySelector(`[id="${elementId}"]`) as HTMLElement
      }
      
      // Si aún no se encuentra, buscar en todas las secciones
      if (!element) {
        const sections = document.querySelectorAll('section[id]')
        sections.forEach((section) => {
          if (section.id === elementId) {
            element = section as HTMLElement
          }
        })
      }
      
      if (element) {
        const headerOffset = 80
        // Obtener la posición absoluta del elemento
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop
        const offsetPosition = elementTop - headerOffset
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        })
        return true
      }
      return false
    }
    
    // Esperar un poco para que el DOM esté listo
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!performScroll()) {
          // Reintentar después de más tiempo
          setTimeout(() => {
            performScroll()
          }, 200)
        }
      }, 150)
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-start gap-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">SENTIR</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Nosotros</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#quienes-somos"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement("quienes-somos")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Quiénes Somos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Conoce nuestra comunidad
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#que-hacemos"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement("que-hacemos")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Qué Hacemos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Nuestros programas y metodología
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#ofrecemos"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement("ofrecemos")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Qué Ofrecemos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Nuestros servicios y talleres
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#para-quien"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement("para-quien")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Nuestra Misión va Dirigida</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Nuestra misión y a quién va dirigido
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#proximos-eventos"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement("proximos-eventos")
                  }}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Próximos Eventos
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#inspiracion"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement("inspiracion")
                  }}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Inspiración
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Testimonios</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#testimonios-escritos"
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.hash = "#testimonios-escritos"
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            scrollToElement("testimonios")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Escritos</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#testimonios-video"
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.hash = "#testimonios-video"
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            scrollToElement("testimonios")
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Visuales</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Talleres y Sesiones</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#liderazgo"
                          onClick={(e) => {
                            e.preventDefault()
                            // Cerrar el menú primero
                            const menuContent = e.currentTarget.closest('[role="menu"]')
                            if (menuContent) {
                              const trigger = document.querySelector('[data-state="open"]')
                              if (trigger) {
                                (trigger as HTMLElement).click()
                              }
                            }
                            // Esperar a que el menú se cierre antes de hacer scroll
                            setTimeout(() => {
                              window.location.hash = "#liderazgo"
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement("talleres")
                            }, 200)
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Talleres de Liderazgo</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Autoconocimiento, Transformación y MyL - Metas y Logros
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#otros-talleres"
                          onClick={(e) => {
                            e.preventDefault()
                            // Cerrar el menú primero
                            const menuContent = e.currentTarget.closest('[role="menu"]')
                            if (menuContent) {
                              const trigger = document.querySelector('[data-state="open"]')
                              if (trigger) {
                                (trigger as HTMLElement).click()
                              }
                            }
                            // Esperar a que el menú se cierre antes de hacer scroll
                            setTimeout(() => {
                              window.location.hash = "#otros-talleres"
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement("talleres")
                            }, 200)
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Otros Talleres</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Camino del Guerrero, Sanando Niño Interior y Biodecodificación
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#sesiones"
                          onClick={(e) => {
                            e.preventDefault()
                            // Cerrar el menú primero
                            const menuContent = e.currentTarget.closest('[role="menu"]')
                            if (menuContent) {
                              const trigger = document.querySelector('[data-state="open"]')
                              if (trigger) {
                                (trigger as HTMLElement).click()
                              }
                            }
                            // Esperar a que el menú se cierre antes de hacer scroll
                            setTimeout(() => {
                              window.location.hash = "#sesiones"
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement("talleres")
                            }, 200)
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Sesiones</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Constelaciones Familiares y Sesiones de Coaching
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#equipo"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement("equipo")
                  }}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Equipo
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <a
                href="#quienes-somos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("quienes-somos")
                }}
              >
                Quiénes Somos
              </a>
              <a
                href="#que-hacemos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("que-hacemos")
                }}
              >
                Qué Hacemos
              </a>
              <a
                href="#ofrecemos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("ofrecemos")
                }}
              >
                Qué Ofrecemos
              </a>
              <a
                href="#para-quien"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("para-quien")
                }}
              >
                Nuestra Misión va Dirigida
              </a>
              <a
                href="#proximos-eventos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("proximos-eventos")
                }}
              >
                Próximos Eventos
              </a>
              <a
                href="#inspiracion"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("inspiracion")
                }}
              >
                Inspiración
              </a>
              <div className="text-lg font-medium">Testimonios</div>
              <a
                href="#testimonios-escritos"
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  window.location.hash = "#testimonios-escritos"
                  window.dispatchEvent(new HashChangeEvent("hashchange"))
                  scrollToElement("testimonios")
                }}
              >
                Escritos
              </a>
              <a
                href="#testimonios-video"
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  window.location.hash = "#testimonios-video"
                  window.dispatchEvent(new HashChangeEvent("hashchange"))
                  scrollToElement("testimonios")
                }}
              >
                Visuales
              </a>
              <a
                href="#talleres"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("talleres")
                }}
              >
                Talleres y Sesiones
              </a>
              <a
                href="#equipo"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  scrollToElement("equipo")
                }}
              >
                Equipo
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
