/**
 * Tipos TypeScript para la aplicación
 */

export interface Event {
  title: string
  subtitle?: string
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
}

export interface WrittenTestimonial {
  name: string
  image: string
}

export interface VideoTestimonial {
  name: string
  video: string
}

