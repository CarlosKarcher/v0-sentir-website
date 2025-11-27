/**
 * Utilidad para hacer scroll suave a un elemento de la página
 * @param elementId - ID del elemento al que hacer scroll
 * @param headerOffset - Offset del header sticky (por defecto 80px)
 */
export function scrollToElement(elementId: string, headerOffset: number = 80): void {
  const performScroll = (): boolean => {
    // Buscar el elemento de múltiples formas
    let element = document.getElementById(elementId)
    
    // Si no se encuentra, intentar buscar por selector
    if (!element) {
      element = document.querySelector(`[id="${elementId}"]`) as HTMLElement
    }
    
    // Si aún no se encuentra, buscar en todas las secciones y footers
    if (!element) {
      const sections = document.querySelectorAll('section[id], footer[id]')
      sections.forEach((section) => {
        if (section.id === elementId) {
          element = section as HTMLElement
        }
      })
    }
    
    // Si aún no se encuentra y es "contacto", buscar el footer
    if (!element && elementId === 'contacto') {
      element = document.querySelector('footer') as HTMLElement
    }
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const elementTop = rect.top + scrollTop
      const offsetPosition = elementTop - headerOffset
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      })
      return true
    }
    return false
  }
  
  // Esperar a que el DOM esté listo
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (!performScroll()) {
        // Reintentar después de más tiempo si no se encontró
        setTimeout(() => {
          performScroll()
        }, 200)
      }
    }, 150)
  })
}

/**
 * Handler para enlaces de navegación que previene el comportamiento por defecto
 * y hace scroll al elemento
 */
export function handleNavigationClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  elementId: string,
  onAfterScroll?: () => void
) {
  e.preventDefault()
  scrollToElement(elementId)
  if (onAfterScroll) {
    setTimeout(onAfterScroll, 300)
  }
}

