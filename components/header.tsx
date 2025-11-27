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
import { scrollToElement, handleNavigationClick } from "@/lib/scroll"
import { SECTION_IDS, HEADER_OFFSET } from "@/lib/constants"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
                          href={`#${SECTION_IDS.QUIENES_SOMOS}`}
                          onClick={(e) => handleNavigationClick(e, SECTION_IDS.QUIENES_SOMOS)}
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
                          href={`#${SECTION_IDS.QUE_HACEMOS}`}
                          onClick={(e) => handleNavigationClick(e, SECTION_IDS.QUE_HACEMOS)}
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
                          href={`#${SECTION_IDS.OFRECEMOS}`}
                          onClick={(e) => handleNavigationClick(e, SECTION_IDS.OFRECEMOS)}
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
                          href={`#${SECTION_IDS.PARA_QUIEN}`}
                          onClick={(e) => handleNavigationClick(e, SECTION_IDS.PARA_QUIEN)}
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
                  href={`#${SECTION_IDS.PROXIMOS_EVENTOS}`}
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.PROXIMOS_EVENTOS)}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Próximos Eventos
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={`#${SECTION_IDS.INSPIRACION}`}
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.INSPIRACION)}
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
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Cerrar el menú primero
                            const trigger = document.querySelector('[data-state="open"]')
                            if (trigger) {
                              (trigger as HTMLElement).click()
                            }
                            // Esperar a que el menú se cierre
                            setTimeout(() => {
                              window.location.hash = `#${SECTION_IDS.TESTIMONIOS_ESCRITOS}`
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              // Usar scrollIntoView que es más confiable
                              setTimeout(() => {
                                const element = document.getElementById(SECTION_IDS.TESTIMONIOS)
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                  })
                                  // Ajustar el offset del header después del scroll
                                  setTimeout(() => {
                                    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
                                    window.scrollTo({
                                      top: currentScroll - HEADER_OFFSET,
                                      behavior: 'smooth'
                                    })
                                  }, 100)
                                }
                              }, 200)
                            }, 300)
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
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Cerrar el menú primero
                            const trigger = document.querySelector('[data-state="open"]')
                            if (trigger) {
                              (trigger as HTMLElement).click()
                            }
                            // Esperar a que el menú se cierre
                            setTimeout(() => {
                              window.location.hash = `#${SECTION_IDS.TESTIMONIOS_VIDEO}`
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              // Usar scrollIntoView que es más confiable
                              setTimeout(() => {
                                const element = document.getElementById(SECTION_IDS.TESTIMONIOS)
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                  })
                                  // Ajustar el offset del header después del scroll
                                  setTimeout(() => {
                                    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
                                    window.scrollTo({
                                      top: currentScroll - HEADER_OFFSET,
                                      behavior: 'smooth'
                                    })
                                  }, 100)
                                }
                              }, 200)
                            }, 300)
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
                          href={`#${SECTION_IDS.LIDERAZGO}`}
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
                              window.location.hash = `#${SECTION_IDS.LIDERAZGO}`
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement(SECTION_IDS.TALLERES)
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
                          href={`#${SECTION_IDS.OTROS_TALLERES}`}
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
                              window.location.hash = `#${SECTION_IDS.OTROS_TALLERES}`
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement(SECTION_IDS.TALLERES)
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
                          href={`#${SECTION_IDS.SESIONES}`}
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
                              window.location.hash = `#${SECTION_IDS.SESIONES}`
                              window.dispatchEvent(new HashChangeEvent("hashchange"))
                              scrollToElement(SECTION_IDS.TALLERES)
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
                  href={`#${SECTION_IDS.EQUIPO}`}
                  onClick={(e) => handleNavigationClick(e, SECTION_IDS.EQUIPO)}
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
                href={`#${SECTION_IDS.QUIENES_SOMOS}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.QUIENES_SOMOS, () => setIsOpen(false))
                }}
              >
                Quiénes Somos
              </a>
              <a
                href={`#${SECTION_IDS.QUE_HACEMOS}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.QUE_HACEMOS, () => setIsOpen(false))
                }}
              >
                Qué Hacemos
              </a>
              <a
                href={`#${SECTION_IDS.OFRECEMOS}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.OFRECEMOS, () => setIsOpen(false))
                }}
              >
                Qué Ofrecemos
              </a>
              <a
                href={`#${SECTION_IDS.PARA_QUIEN}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.PARA_QUIEN, () => setIsOpen(false))
                }}
              >
                Nuestra Misión va Dirigida
              </a>
              <a
                href={`#${SECTION_IDS.PROXIMOS_EVENTOS}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.PROXIMOS_EVENTOS, () => setIsOpen(false))
                }}
              >
                Próximos Eventos
              </a>
              <a
                href={`#${SECTION_IDS.INSPIRACION}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.INSPIRACION, () => setIsOpen(false))
                }}
              >
                Inspiración
              </a>
              <div className="text-lg font-medium">Testimonios</div>
              <a
                href={`#${SECTION_IDS.TESTIMONIOS_ESCRITOS}`}
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsOpen(false)
                  window.location.hash = `#${SECTION_IDS.TESTIMONIOS_ESCRITOS}`
                  setTimeout(() => {
                    window.dispatchEvent(new HashChangeEvent("hashchange"))
                    const testimoniosElement = document.getElementById(SECTION_IDS.TESTIMONIOS)
                    if (testimoniosElement) {
                      testimoniosElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      })
                      // Ajustar el offset del header después del scroll
                      setTimeout(() => {
                        const currentScroll = window.pageYOffset || document.documentElement.scrollTop
                        window.scrollTo({
                          top: currentScroll - HEADER_OFFSET,
                          behavior: 'smooth'
                        })
                      }, 100)
                    }
                  }, 200)
                }}
              >
                Escritos
              </a>
              <a
                href={`#${SECTION_IDS.TESTIMONIOS_VIDEO}`}
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsOpen(false)
                  window.location.hash = `#${SECTION_IDS.TESTIMONIOS_VIDEO}`
                  setTimeout(() => {
                    window.dispatchEvent(new HashChangeEvent("hashchange"))
                    const testimoniosElement = document.getElementById(SECTION_IDS.TESTIMONIOS)
                    if (testimoniosElement) {
                      testimoniosElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      })
                      // Ajustar el offset del header después del scroll
                      setTimeout(() => {
                        const currentScroll = window.pageYOffset || document.documentElement.scrollTop
                        window.scrollTo({
                          top: currentScroll - HEADER_OFFSET,
                          behavior: 'smooth'
                        })
                      }, 100)
                    }
                  }, 200)
                }}
              >
                Visuales
              </a>
              <a
                href={`#${SECTION_IDS.TALLERES}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.TALLERES, () => setIsOpen(false))
                }}
              >
                Talleres y Sesiones
              </a>
              <a
                href={`#${SECTION_IDS.EQUIPO}`}
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  handleNavigationClick(e, SECTION_IDS.EQUIPO, () => setIsOpen(false))
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
