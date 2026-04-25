import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"

// Almacenamiento dual: localStorage + cookie de respaldo (1 año)
// Si se borra el localStorage, la cookie restaura la sesión automáticamente
const dualStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      const val = localStorage.getItem(key)
      if (val) return val
    } catch {}
    try {
      const encoded = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const match = document.cookie.match(new RegExp("(^| )" + encoded + "=([^;]+)"))
      if (match) return decodeURIComponent(match[2])
    } catch {}
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try { localStorage.setItem(key, value) } catch {}
    try {
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
    } catch {}
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try { localStorage.removeItem(key) } catch {}
    try {
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    } catch {}
  },
}

export const supabaseAuth = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: dualStorage,
  },
})

// Cliente original sin auth (para RPCs anónimas que no requieren sesión)
export { supabase } from "@/lib/supabase-client"
