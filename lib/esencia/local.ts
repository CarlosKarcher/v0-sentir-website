// Pequeñas memorias del navegador (siempre con try/catch: pueden no estar disponibles).

import type { Modo } from "./juego";

const NOMBRE = "esencia_nombre";
const anfKey = (c: string) => `esencia_anfitrion_${c}`;

export function leerNombre(): string {
  try {
    return localStorage.getItem(NOMBRE) ?? "";
  } catch {
    return "";
  }
}

export function guardarNombre(n: string) {
  try {
    localStorage.setItem(NOMBRE, n);
  } catch {}
}

/** La mesa se marca como propia en esta pestaña: así el anfitrión no depende de la URL. */
export function guardarAnfitrion(codigo: string, datos: { nombre: string; modo: Modo }) {
  try {
    sessionStorage.setItem(anfKey(codigo), JSON.stringify(datos));
  } catch {}
}

export function leerAnfitrion(codigo: string): { nombre: string; modo: Modo } | null {
  try {
    const raw = sessionStorage.getItem(anfKey(codigo));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function nuevoCodigo(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O ni 1/I
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => letras[b % letras.length]).join("");
}
