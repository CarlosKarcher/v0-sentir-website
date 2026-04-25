export type TallerEstado = 'pendiente' | 'confirmado' | 'cancelado'

export interface Taller {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  descripcion_corta: string | null
  precio: number
  moneda: string
  duracion: string | null
  modalidad: string | null
  fecha_inicio: string | null
  cupo_maximo: number
  imagen_url: string | null
  activo: boolean
  orden: number
  creado_en: string
}

export interface Inscripcion {
  id: string
  taller_id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni: string | null
  ciudad: string | null
  comprobante_url: string | null
  metodo_pago: string
  estado: TallerEstado
  monto_pagado: number | null
  notas_admin: string | null
  mensaje_inscripto: string | null
  creado_en: string
  confirmado_en: string | null
}

// Inscripción enriquecida con datos del taller (devuelta por listar_inscripciones RPC)
export interface InscripcionConTaller extends Inscripcion {
  taller_nombre: string
  taller_slug: string
}
