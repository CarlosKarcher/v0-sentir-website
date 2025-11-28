import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const inspirations = [
  {
    text: "La verdadera transformación comienza cuando te atreves a mirarte al espejo del alma.",
    type: "Frase",
  },
  {
    text: "Había una vez un águila que creció entre pollos y creía que era uno de ellos, hasta que un día miró al cielo y recordó quién era realmente.",
    type: "Relato",
  },
  {
    text: "El liderazgo no es un cargo, es una actitud de servicio y autenticidad.",
    type: "Frase",
  },
  {
    text: "Un sabio maestro le dijo a su discípulo: 'No busques la luz fuera de ti, tú mismo eres la lámpara que ilumina el camino.'",
    type: "Cuento",
  },
]

export function Inspiration() {
  return (
    <section id="inspiracion" className="py-12 sm:py-16 md:py-20 w-full flex justify-center">
      <div className="container px-4 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Inspiración y Reflexión</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Relatos, cuentos y frases que elevan el espíritu y nutren el alma
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {inspirations.map((item, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-base md:text-lg mb-4 text-pretty leading-relaxed italic">{item.text}</p>
                    <span className="text-sm text-muted-foreground font-medium">{item.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
