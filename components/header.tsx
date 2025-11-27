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
                            const element = document.getElementById("quienes-somos")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            const element = document.getElementById("que-hacemos")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            const element = document.getElementById("ofrecemos")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            const element = document.getElementById("para-quien")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  Próximos Eventos
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#inspiracion"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
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
                            // Cambiar el hash para que el componente lo detecte
                            window.location.hash = "#testimonios-escritos"
                            // Disparar evento hashchange manualmente para que se detecte inmediatamente
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            const element = document.getElementById("testimonios")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            // Cambiar el hash para que el componente lo detecte
                            window.location.hash = "#testimonios-video"
                            // Disparar evento hashchange manualmente para que se detecte inmediatamente
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            const element = document.getElementById("testimonios")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            window.location.hash = "#liderazgo"
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            const element = document.getElementById("talleres")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            window.location.hash = "#otros-talleres"
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            const element = document.getElementById("talleres")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                            window.location.hash = "#sesiones"
                            window.dispatchEvent(new HashChangeEvent("hashchange"))
                            const element = document.getElementById("talleres")
                            if (element) {
                              const headerOffset = 80
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              })
                            }
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
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
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
                href="#que-hacemos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Qué Hacemos
              </a>
              <a
                href="#ofrecemos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Qué Ofrecemos
              </a>
              <a
                href="#para-quien"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Nuestra Misión va Dirigida
              </a>
              <a
                href="#proximos-eventos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Próximos Eventos
              </a>
              <a
                href="#inspiracion"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Inspiración
              </a>
              <div className="text-lg font-medium">Testimonios</div>
              <a
                href="#testimonios-escritos"
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={() => setIsOpen(false)}
              >
                Escritos
              </a>
              <a
                href="#testimonios-video"
                className="text-base font-medium hover:text-primary transition-colors ml-4"
                onClick={() => setIsOpen(false)}
              >
                Visuales
              </a>
              <a
                href="#talleres"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Talleres y Sesiones
              </a>
              <a
                href="#equipo"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
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
