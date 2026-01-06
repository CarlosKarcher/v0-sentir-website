"use client"

import { useState } from "react"
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">SENTIR</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Nosotros</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#que-hacemos"
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
                          href="#nuestra-mision"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Nuestra Misión</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Nuestra visión y propósito
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#que-ofrecemos"
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
                          href="#a-quien-va-dirigido"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">A Quién Va Dirigido</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Para quiénes son nuestros talleres
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
                <NavigationMenuTrigger>Talleres y Sesiones</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4">
                    <li className="row-span-3">
                      <div className="mb-2 text-sm font-medium text-primary">Talleres de Liderazgo</div>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="#liderazgo"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            1. Autoconocimiento
                          </a>
                        </li>
                        <li>
                          <a
                            href="#liderazgo"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            2. Transformación
                          </a>
                        </li>
                        <li>
                          <a
                            href="#liderazgo"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            3. MyL de Metas y Logros
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="row-span-3">
                      <div className="mb-2 text-sm font-medium text-primary">Otros Talleres</div>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="#otros-talleres"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            1. Camino del Guerrero
                          </a>
                        </li>
                        <li>
                          <a
                            href="#otros-talleres"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            2. Sanando Niño Interior
                          </a>
                        </li>
                        <li>
                          <a
                            href="#otros-talleres"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            3. Biodecodificación
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="row-span-2">
                      <div className="mb-2 text-sm font-medium text-primary">Sesiones</div>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="#sesiones"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Constelaciones Familiares
                          </a>
                        </li>
                        <li>
                          <a
                            href="#sesiones"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Sesiones de Coaching
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Testimonios</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#testimonios-escritos"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Testimonios Escritos</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#testimonios-video"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Testimonios en Video</div>
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
                href="#nuestra-mision"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Nuestra Misión
              </a>
              <a
                href="#que-ofrecemos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Qué Ofrecemos
              </a>
              <a
                href="#a-quien-va-dirigido"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                A Quién Va Dirigido
              </a>
              <a
                href="#proximos-eventos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Próximos Eventos
              </a>
              <a
                href="#talleres"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Talleres y Sesiones
              </a>
              <a
                href="#testimonios"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Testimonios
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
