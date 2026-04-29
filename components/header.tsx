"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { LoginModal } from "@/components/login-modal"
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
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { estado, nombre, nroMiembro, esAdmin, adminCelular, email, logout } = useUser()

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
          {/* Desktop: botón Ingresar / Salir */}
          {estado !== "cargando" && (
            !logueado ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Ingresar
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
                      onClick={() => { setIsOpen(false); setLoginOpen(true) }}
                      className="mt-2 w-full flex items-center justify-center gap-2 text-base font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors shadow-sm"
                    >
                      Ingresar con mi email
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

      {/* Barra WhatsApp Consultas */}
      <div className="w-full border-t border-border/30 bg-background/95">
        <div className="flex justify-end pr-3 py-1">
          <a
            href="https://wa.me/542966211547"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
          >
            <div className="flex flex-col items-end leading-tight">
              <span className="text-sm font-bold">Consultas</span>
              <span className="text-xs font-semibold">Administrador</span>
            </div>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-green-500 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
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

    <LoginModal
      isOpen={loginOpen}
      onClose={() => setLoginOpen(false)}
      onLoginSuccess={() => setLoginOpen(false)}
    />
  </>
  )
}
