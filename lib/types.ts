/**
 * Tipos TypeScript para la aplicación
 */

export interface Event {
  title: string
  subtitle?: string
  subtitleHighlight?: boolean
  date: string
  time: string
  location: string
  type: string
  available: boolean
  availabilityText: string
  hasFlyer?: boolean
  flyerImage?: string
  flyerImageAlt?: string
  level?: string
  contactPhone?: string
  contactWhatsappOnly?: boolean  // mostrar solo icono WhatsApp, sin texto ni número
  tallerSlug?: string  // slug del taller en DB para inscripción
  tallerId?: string    // UUID del registro exacto en tabla talleres
  sede?: string        // ciudad/sede del taller (de sedes_sentir)
}

export interface WrittenTestimonial {
  name: string
  image: string
}

export interface VideoTestimonial {
  name: string
  video: string
}

