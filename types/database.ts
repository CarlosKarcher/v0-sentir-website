export type TallerEstado = 'pendiente' | 'confirmado' | 'cancelado'
export type DescuentoTipo = 'porcentaje' | 'monto_fijo' | null

export interface Taller {
  id: string
  slug: string
  nombre: string
  sede: string | null
  descripcion: string | null
  descripcion_corta: string | null
  precio: number
  moneda: string
  descuento_tipo: DescuentoTipo
  descuento_valor: number | null
  descuento_hasta: string | null
  duracion: string | null
  modalidad: string | null
  fecha_inicio: string | null
  cupo_maximo: number
  imagen_url: string | null
  activo: boolean
  orden: number
  creado_en: string
  acepta_transferencia: boolean
  acepta_tarjeta: boolean
  acepta_sena: boolean
}

export function calcularPrecioFinal(taller: Pick<Taller, 'precio' | 'descuento_tipo' | 'descuento_valor'>) {
  const precioReal = taller.precio
  let descuentoMonto = 0
  if (taller.descuento_tipo === 'porcentaje' && taller.descuento_valor) {
    descuentoMonto = Math.round(precioReal * taller.descuento_valor / 100)
  } else if (taller.descuento_tipo === 'monto_fijo' && taller.descuento_valor) {
    descuentoMonto = taller.descuento_valor
  }
  return {
    precioReal,
    descuentoMonto,
    precioFinal: Math.max(0, precioReal - descuentoMonto),
  }
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
  abandono: boolean
}

// Inscripción enriquecida con datos del taller (devuelta por listar_inscripciones RPC)
export interface InscripcionConTaller extends Inscripcion {
  taller_nombre: string
  taller_slug: string
  taller_precio: number
  taller_moneda: string
  taller_descuento_tipo: "porcentaje" | "monto_fijo" | null
  taller_descuento_valor: number | null
  evento_descripcion: string | null
  fecha_nacimiento: string | null
  localidad_taller: string | null
  nombre_miembro: string | null
  precio_inscripto: number | null
  enrolador_nombre: string | null
  enrolador_telefono: string | null
  taller_fecha_inicio: string | null
}
