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

function getSaved(): string | null {
  if (typeof window === "undefined") return null
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function saveSaved(email: string) {
  try { localStorage.setItem(STORAGE_KEY, email) } catch {}
}

function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoUsuario>("cargando")
  const [nombre, setNombre] = useState<string | null>(null)
  const [nroMiembro, setNroMiembro] = useState<number | null>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [adminCelular, setAdminCelular] = useState({ caracteristica: "", numero: "" })
  const [email, setEmail] = useState<string | null>(null)

  const cargarUsuario = async (emailUser: string) => {
    const { data, error } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    if (error || !data) {
      // Error de red o Supabase — NO borrar sesión, volver a pedir email
      setEstado("no_logueado")
      return
    }
    if (data.encontrado) {
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
      // El email no existe en la BD — sí borrar sesión
      clearSaved()
      setEstado("no_logueado")
    }
  }

  useEffect(() => {
    const saved = getSaved()
    if (saved) {
      cargarUsuario(saved)
    } else {
      setEstado("no_logueado")
    }
  }, [])

  const loginWithEmail = async (emailUser: string): Promise<{ encontrado: boolean }> => {
    const { data } = await supabase.rpc("buscar_email_registrado", { p_email: emailUser.toLowerCase() })
    if (data?.encontrado) {
      saveSaved(emailUser.toLowerCase())
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
