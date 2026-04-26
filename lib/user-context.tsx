"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

export type EstadoUsuario = "cargando" | "no_logueado" | "sin_registro" | "registrado"

interface UserContextType {
  estado: EstadoUsuario
  nombre: string | null
  nroMiembro: number | null
  esAdmin: boolean
  adminCelular: { caracteristica: string; numero: string }
  email: string | null
  loginWithEmail: (email: string) => Promise<{ encontrado: boolean }>
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  estado: "cargando",
  nombre: null,
  nroMiembro: null,
  esAdmin: false,
  adminCelular: { caracteristica: "", numero: "" },
  email: null,
  loginWithEmail: async () => ({ encontrado: false }),
  logout: () => {},
})

const COOKIE_NAME = "sentir_email"
const COOKIE_DAYS = 365

function getCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

function saveCookie(email: string) {
  const maxAge = COOKIE_DAYS * 24 * 60 * 60
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(email)};max-age=${maxAge};path=/;SameSite=Lax`
}

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=;max-age=0;path=/`
}

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
      // Email en cookie pero no está en la BD (fue eliminado o es inválido)
      clearCookie()
      setEstado("no_logueado")
    }
  }

  useEffect(() => {
    const saved = getCookie()
    if (saved) {
      cargarUsuario(saved)
    } else {
      setEstado("no_logueado")
    }
  }, [])

  const loginWithEmail = async (emailUser: string): Promise<{ encontrado: boolean }> => {
    const { data } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    if (data?.encontrado) {
      saveCookie(emailUser.toLowerCase())
      setNombre(data.nombre_gafete || data.nombre_apellido?.split(" ")[0] || null)
      setNroMiembro(data.numero ?? null)
      setEsAdmin(data.es_admin ?? false)
      setAdminCelular({
        caracteristica: data.celular_caracteristica || "",
        numero: data.celular_numero || "",
      })
      setEmail(emailUser.toLowerCase())
      setEstado("registrado")
      return { encontrado: true }
    } else {
      return { encontrado: false }
    }
  }

  const logout = () => {
    clearCookie()
    setEstado("no_logueado")
    setNombre(null)
    setNroMiembro(null)
    setEsAdmin(false)
    setAdminCelular({ caracteristica: "", numero: "" })
    setEmail(null)
  }

  return (
    <UserContext.Provider value={{ estado, nombre, nroMiembro, esAdmin, adminCelular, email, loginWithEmail, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
