"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export function Header({ onAnotate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const { estado, nombre, nroMiembro, esAdmin, adminCelular, email, login, logout } = useUser()

  const logueado = estado === "registrado" || estado === "sin_registro"

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
          {nombre && (
            <span className="md:hidden text-sm font-medium text-blue-900 dark:text-blue-300 ml-4">
              {nombre}{nroMiembro ? ` (${nroMiembro})` : ""}
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
                        <a href="#que-hacemos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Qué Hacemos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Nuestros programas y metodología</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#nuestra-mision" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nuestra Misión</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Nuestra visión y propósito</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#que-ofrecemos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Qué Ofrecemos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Nuestros servicios y talleres</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#a-quien-va-dirigido" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">A Quién Va Dirigido</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Para quiénes son nuestros talleres</p>
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
                  className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50")}
                >
                  Agenda de Turnos
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#proximos-eventos"
                  className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50")}
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
                        <a href="#testimonios-escritos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Testimonios Escritos</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#testimonios-video" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
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
                  <ul className="flex flex-col w-[220px] gap-2 p-3">
                    <li>
                      <a href="#talleres" className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        Talleres y Sesiones
                      </a>
                    </li>
                    <li>
                      <a href="#proximos-eventos" className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors">
                        Inscribir a talleres
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#equipo"
                  className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50")}
                >
                  Equipo
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#musica-sentir"
                  onClick={(e) => { e.preventDefault(); scrollToElement("musica-sentir", 80) }}
                  className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer")}
                >
                  Música de Sentir
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#merchandising"
                  onClick={(e) => { e.preventDefault(); scrollToElement("merchandising", 80) }}
                  className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer")}
                >
                  Tienda Sentir
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {/* Desktop: usuario logueado */}
          {nombre && (
            <span className="hidden md:inline text-sm font-medium text-blue-900 dark:text-blue-300 pr-1">
              {nombre}{nroMiembro ? ` (${nroMiembro})` : ""}
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
          {/* Desktop: botón Google / Salir */}
          {estado !== "cargando" && (
            !logueado ? (
              <button
                onClick={login}
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <GoogleIcon />
                Continuar con Google
              </button>
            ) : (
              <button
                onClick={logout}
                className="hidden md:inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Salir
              </button>
            )
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
                <a href="#que-hacemos" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Qué Hacemos</a>
                <a href="#nuestra-mision" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Nuestra Misión</a>
                <a href="#que-ofrecemos" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Qué Ofrecemos</a>
                <a href="#a-quien-va-dirigido" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>A Quién Va Dirigido</a>
                <a href="https://turnos-two-iota.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Agenda de Turnos</a>
                <a href="#proximos-eventos" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Próximos Eventos</a>
                <a href="#testimonios" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Testimonios</a>
                <a href="#talleres" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Talleres y Sesiones</a>
                <a href="#proximos-eventos" className="text-center text-lg font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>Inscribir a talleres</a>
                <a href="#equipo" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Equipo</a>
                <a href="#musica-sentir" className="text-lg font-medium hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setIsOpen(false); setTimeout(() => scrollToElement("musica-sentir", 80), 100) }}>Música de Sentir</a>
                <a href="#merchandising" className="text-lg font-medium hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setIsOpen(false); setTimeout(() => scrollToElement("merchandising", 80), 100) }}>Tienda Sentir</a>

                {esAdmin && (
                  <button onClick={() => { setIsOpen(false); setAdminPanelOpen(true) }} className="mt-2 w-full text-left text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors">
                    Admin
                  </button>
                )}

                {estado !== "cargando" && (
                  !logueado ? (
                    <button
                      onClick={() => { setIsOpen(false); login() }}
                      className="mt-2 w-full flex items-center justify-center gap-2 text-base font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors shadow-sm"
                    >
                      <GoogleIcon />
                      Continuar con Google
                    </button>
                  ) : (
                    <button onClick={() => { setIsOpen(false); logout() }} className="mt-2 w-full text-center text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Cerrar sesión
                    </button>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Banner para usuario logueado sin registro */}
      {estado === "sin_registro" && (
        <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
          Hola! Vemos que es tu primera vez.{" "}
          <a href="#inicio" className="font-semibold underline hover:no-underline">
            ¿Querés registrarte para poder inscribirte a nuestros talleres?
          </a>
        </div>
      )}
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
