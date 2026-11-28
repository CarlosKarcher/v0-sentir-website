import { supabase } from "@/lib/supabase-client";

// Contador de Nuestra Esencia (tabla esencia_eventos en la base de Sentir).
// ingreso: un miembro entra al juego · mesa: un guía abre una mesa · juego: el guía empieza el juego (hora de inicio)
// fin: el juego termina (hora de fin; lo anota el guía)
export type EventoEsencia = "ingreso" | "mesa" | "juego" | "fin";

/** Anota un evento. Nunca frena el juego: si falla, se ignora. */
export function registrarEsencia(tipo: EventoEsencia, email?: string | null) {
  supabase
    .rpc("esencia_registrar", { p_tipo: tipo, p_email: email ?? null })
    .then(({ error }) => { if (error) console.warn("contador de Esencia:", error.message); });
}

export interface ContadoresEsencia { ingresos: number; mesas: number; juegos: number }

/** Totales; la base solo los devuelve si el email es de un administrador de Sentir. */
export async function leerContadores(email: string): Promise<ContadoresEsencia | null> {
  const { data, error } = await supabase.rpc("esencia_contadores", { p_email: email });
  if (error || !data) return null;
  return data as ContadoresEsencia;
}
