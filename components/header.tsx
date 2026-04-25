"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
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
import { scrollToElement } from "@/lib/scroll"
import { AdminPanel } from "@/components/admin-panel"

interface HeaderProps {
  onAnotate?: () => void
}

export function Header({ onAnotate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null)
  const [nroMiembro, setNroMiembro] = useState<number | null>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminCelular, setAdminCelular] = useState({ caracteristica: "", numero: "" })

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const guardado = localStorage.getItem("sentir_celular")
        if (!guardado) return
        const { caracteristica, numero } = JSON.parse(guardado)
        if (!caracteristica || !numero) return
        const { data } = await supabase.rpc("verificar_celular_registrado", {
          p_caracteristica: caracteristica,
          p_numero: numero,
        })
        if (data?.encontrado) {
          const n = data.nombre_gafete || data.nombre_apellido?.split(" ")[0] || ""
          const nro = data.numero ? Number(data.numero) : null
          if (n) {
            setNombreUsuario(n)
            setNroMiembro(nro)
            localStorage.setItem("sentir_celular", JSON.stringify({ caracteristica, numero, nombre: n, nroMiembro: nro }))
          }
          if (data.es_admin) {
            setEsAdmin(true)
            setAdminCelular({ caracteristica, numero })
          }
        } else {
          localStorage.removeItem("sentir_celular")
        }
      } catch {}
    }
    cargarNombre()

    const onUsuario = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.nombre) {
        setNombreUsuario(detail.nombre)
        setNroMiembro(detail.nroMiembro ?? null)
        try {
          const guardado = localStorage.getItem("sentir_celular")
          if (guardado) {
            const { caracteristica, numero } = JSON.parse(guardado)
            if (detail.esAdmin) {
              setEsAdmin(true)
              setAdminCelular({ caracteristica, numero })
            }
          }
        } catch {}
      }
    }
    window.addEventListener("sentir_usuario", onUsuario)
    return () => window.removeEventListener("sentir_usuario", onUsuario)
  }, [])

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {process.env.NEXT_PUBLIC_BUILD_TIME && (
        <span className="hidden sm:block absolute top-1 left-2 text-xs text-muted-foreground font-mono z-10">
          v{new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires"
          })}
        </span>
      )}
      <div className="w-full max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-bold text-blue-900">SENTIR</span>
          <img
            src="/fuego-de-sentir.png"
            alt="Fuego de Sentir"
            className="h-[2.4em] w-auto object-contain"
            style={{ height: '2.4em', width: 'auto' }}
          />
          <span className="text-lg sm:text-xl font-bold text-blue-900 flex items-center gap-1.5">
            <span className="ml-2">En</span>
            <img
              src="/banderas_2.png"
              alt=""
              className="h-[2em] w-auto object-contain"
              style={{ height: '2em', width: 'auto' }}
            />
          </span>
          {nombreUsuario && (
            <span className="md:hidden text-sm font-medium text-blue-900 dark:text-blue-300 ml-4">
              {nombreUsuario}{nroMiembro ? ` (${nroMiembro})` : ""}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-4 lg:gap-6">
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
                  href="https://turnos-two-iota.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  Agenda de Turnos
                </NavigationMenuLink>
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
                <NavigationMenuTrigger>Talleres y Sesiones</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4">
                    <li className="col-span-full flex gap-2 pb-2 border-b border-border">
                      <a
                        href="#talleres"
                        className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        Talleres y Sesiones
                      </a>
                      <button
                        onClick={() => onAnotate?.()}
                        className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                      >
                        Inscribir a talleres
                      </button>
                    </li>
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
                <NavigationMenuLink
                  href="#equipo"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  Equipo
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#musica-sentir"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement("musica-sentir", 80)
                  }}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Música de Sentir
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#merchandising"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement("merchandising", 80)
                  }}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                  )}
                >
                  Tienda Sentir
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {nombreUsuario && (
            <span className="hidden md:inline text-sm font-medium text-blue-900 dark:text-blue-300 pr-2">
              {nombreUsuario}{nroMiembro ? ` (${nroMiembro})` : ""}
            </span>
          )}
          {esAdmin && (
            <button
              onClick={() => setAdminPanelOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Admin
            </button>
          )}
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
                href="https://turnos-two-iota.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Agenda de Turnos
              </a>
              <a
                href="#proximos-eventos"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Próximos Eventos
              </a>
              <a
                href="#testimonios"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Testimonios
              </a>
              <a
                href="#talleres"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Talleres y Sesiones
              </a>
              <button
                onClick={() => { setIsOpen(false); onAnotate?.() }}
                className="text-left text-lg font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors"
              >
                Inscribir a talleres
              </button>
              <a
                href="#equipo"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Equipo
              </a>
              <a
                href="#musica-sentir"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setTimeout(() => {
                    scrollToElement("musica-sentir", 80)
                  }, 100)
                }}
              >
                Música de Sentir
              </a>
              <a
                href="#merchandising"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setTimeout(() => {
                    scrollToElement("merchandising", 80)
                  }, 100)
                }}
              >
                Tienda Sentir
              </a>
              {esAdmin && (
                <button
                  onClick={() => { setIsOpen(false); setAdminPanelOpen(true) }}
                  className="mt-4 w-full text-left text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors"
                >
                  Admin
                </button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
    {esAdmin && (
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        adminCaracteristica={adminCelular.caracteristica}
        adminNumero={adminCelular.numero}
      />
    )}
  </>
  )
}
