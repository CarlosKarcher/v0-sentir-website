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

const STORAGE_KEY = "sentir_email"
const CACHE_KEY = "sentir_user_cache"
const COOKIE_NAME = "sentir_email"

function getSaved(): string | null {
  if (typeof window === "undefined") return null
  // Intentar localStorage primero
  try {
    const ls = localStorage.getItem(STORAGE_KEY)
    if (ls) return ls
  } catch {}
  // Fallback: leer de cookie
  try {
    const match = document.cookie.match(new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"))
    if (match) return decodeURIComponent(match[2])
  } catch {}
  return null
}

function saveSaved(email: string) {
  try { localStorage.setItem(STORAGE_KEY, email) } catch {}
  // También guardar en cookie como respaldo (365 días)
  try {
    const maxAge = 365 * 24 * 60 * 60
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(email)};max-age=${maxAge};path=/;SameSite=Lax`
  } catch {}
}

function clearSaved() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CACHE_KEY)
  } catch {}
  try {
    document.cookie = `${COOKIE_NAME}=;max-age=0;path=/`
  } catch {}
}

interface CachedUser {
  nombre: string | null
  nroMiembro: number | null
  esAdmin: boolean
  adminCelular: { caracteristica: string; numero: string }
}

function getCachedUser(): CachedUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveCachedUser(data: CachedUser) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoUsuario>("cargando")
  const [nombre, setNombre] = useState<string | null>(null)
  const [nroMiembro, setNroMiembro] = useState<number | null>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [adminCelular, setAdminCelular] = useState({ caracteristica: "", numero: "" })
  const [email, setEmail] = useState<string | null>(null)

  const cargarUsuario = async (emailUser: string) => {
    console.log("[Auth] cargarUsuario →", emailUser)
    const { data, error } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    console.log("[Auth] RPC result →", { data, error })
    if (data?.encontrado) {
      const userData: CachedUser = {
        nombre: data.nombre_gafete || data.nombre_apellido?.split(" ")[0] || null,
        nroMiembro: data.numero ?? null,
        esAdmin: data.es_admin ?? false,
        adminCelular: {
          caracteristica: data.celular_caracteristica || "",
          numero: data.celular_numero || "",
        },
      }
      saveCachedUser(userData)
      setNombre(userData.nombre)
      setNroMiembro(userData.nroMiembro)
      setEsAdmin(userData.esAdmin)
      setAdminCelular(userData.adminCelular)
      setEmail(emailUser)
      setEstado("registrado")
    } else if (error) {
      // Error de red — usar datos cacheados si existen para no perder la sesión
      const cached = getCachedUser()
      if (cached) {
        setNombre(cached.nombre)
        setNroMiembro(cached.nroMiembro)
        setEsAdmin(cached.esAdmin)
        setAdminCelular(cached.adminCelular)
        setEmail(emailUser)
        setEstado("registrado")
      } else {
        setEstado("no_logueado")
      }
    } else {
      // Email no está en la BD (fue eliminado o es inválido)
      clearSaved()
      setEstado("no_logueado")
    }
  }

  useEffect(() => {
    const saved = getSaved()
    console.log("[Auth] localStorage sentir_email →", saved)
    if (saved) {
      cargarUsuario(saved)
    } else {
      setEstado("no_logueado")
    }
  }, [])

  const loginWithEmail = async (emailUser: string): Promise<{ encontrado: boolean }> => {
    const { data } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    if (data?.encontrado) {
      const userData: CachedUser = {
        nombre: data.nombre_gafete || data.nombre_apellido?.split(" ")[0] || null,
        nroMiembro: data.numero ?? null,
        esAdmin: data.es_admin ?? false,
        adminCelular: {
          caracteristica: data.celular_caracteristica || "",
          numero: data.celular_numero || "",
        },
      }
      saveSaved(emailUser.toLowerCase())
      saveCachedUser(userData)
      setNombre(userData.nombre)
      setNroMiembro(userData.nroMiembro)
      setEsAdmin(userData.esAdmin)
      setAdminCelular(userData.adminCelular)
      setEmail(emailUser.toLowerCase())
      setEstado("registrado")
      return { encontrado: true }
    } else {
      return { encontrado: false }
    }
  }

  const logout = () => {
    clearSaved()
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
