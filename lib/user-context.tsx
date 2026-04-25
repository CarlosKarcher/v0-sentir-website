"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabaseAuth } from "@/lib/supabase-auth-client"
import { supabase } from "@/lib/supabase-client"

export type EstadoUsuario = "cargando" | "no_logueado" | "sin_registro" | "registrado"

interface UserContextType {
  estado: EstadoUsuario
  nombre: string | null
  nroMiembro: number | null
  esAdmin: boolean
  adminCelular: { caracteristica: string; numero: string }
  email: string | null
  login: () => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  estado: "cargando",
  nombre: null,
  nroMiembro: null,
  esAdmin: false,
  adminCelular: { caracteristica: "", numero: "" },
  email: null,
  login: () => {},
  logout: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoUsuario>("cargando")
  const [nombre, setNombre] = useState<string | null>(null)
  const [nroMiembro, setNroMiembro] = useState<number | null>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [adminCelular, setAdminCelular] = useState({ caracteristica: "", numero: "" })
  const [email, setEmail] = useState<string | null>(null)

  const cargarUsuario = async (emailUser: string) => {
    const { data } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    if (data?.encontrado) {
      setNombre(data.nombre_gafete || data.nombre_apellido?.split(" ")[0] || null)
      setNroMiembro(data.numero ?? null)
      setEsAdmin(data.es_admin ?? false)
      setAdminCelular({
        caracteristica: data.celular_caracteristica || "",
        numero: data.celular_numero || "",
      })
      setEmail(emailUser)
      setEstado("registrado")
    } else {
      setNombre(null)
      setNroMiembro(null)
      setEsAdmin(false)
      setAdminCelular({ caracteristica: "", numero: "" })
      setEmail(emailUser)
      setEstado("sin_registro")
    }
  }

  const limpiar = () => {
    setEstado("no_logueado")
    setNombre(null)
    setNroMiembro(null)
    setEsAdmin(false)
    setAdminCelular({ caracteristica: "", numero: "" })
    setEmail(null)
  }

  useEffect(() => {
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        cargarUsuario(session.user.email)
      } else {
        setEstado("no_logueado")
      }
    })

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        cargarUsuario(session.user.email)
      } else {
        limpiar()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = () => {
    if (typeof window === "undefined") return
    supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const logout = () => supabaseAuth.auth.signOut()

  return (
    <UserContext.Provider value={{ estado, nombre, nroMiembro, esAdmin, adminCelular, email, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
