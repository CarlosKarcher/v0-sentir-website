import { Card, CardContent } from "@/components/ui/card"
import { Heart, Target, Users, Sparkles } from "lucide-react"

export function About() {
  return (
    <section id="quienes-somos" className="py-12 sm:py-16 md:py-20 bg-secondary/30 w-full flex justify-center">
      <div className="container px-4 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Quiénes Somos</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            SENTIR es una comunidad dedicada al desarrollo personal y liderazgo transformacional. Creemos en el poder
            del autoconocimiento y la transformación consciente para vivir una vida plena y auténtica.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16 max-w-6xl mx-auto">
          {/* 1. Qué Hacemos */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 id="que-hacemos" className="text-lg sm:text-xl font-semibold mb-3 text-center">
                Qué Hacemos
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center text-pretty">
                Somos un equipo de profesionales apasionados por acompañar procesos de crecimiento real. Creamos
                espacios de aprendizaje, donde cada persona puede transformar su vida personal y profesional, logrando
                nuevos y mejores resultados y construyendo su propio bien–estar. Con más de 10 años de experiencia,
                llevamos nuestros programas a distintas ciudades de Argentina y Chile, guiando a miles de personas en su
                camino de liderazgo, conciencia y desarrollo emocional.
              </p>
            </CardContent>
          </Card>

          {/* 2. Qué Ofrecemos */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 id="ofrecemos" className="text-lg sm:text-xl font-semibold mb-3 text-center">
                Qué Ofrecemos
              </h3>
              <div className="text-muted-foreground text-xs sm:text-sm space-y-2 sm:space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Talleres Vivenciales de Liderazgo y Desarrollo Personal
                  </p>
                  <p className="text-xs">
                    Nivel 1: Autoconocimiento | Nivel 2: Transformación | Nivel 3: Metas y Logros (MyL)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sesiones de Coaching</p>
                  <p className="text-xs">
                    Individuales y grupales, enfocadas en el desarrollo de habilidades personales y profesionales.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Programas de Formación</p>
                  <p className="text-xs">
                    En liderazgo consciente, comunicación efectiva, gestión del cambio e inteligencia emocional.
                  </p>
                </div>
                <p className="font-semibold text-foreground">Curso de Oratoria y Comunicación Efectiva</p>
                <div>
                  <p className="font-semibold text-foreground">Constelaciones Familiares</p>
                  <p className="text-xs">
                    Individuales y grupales, para abordar dinámicas profundas del sistema familiar.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Talleres Vivenciales Especiales</p>
                  <p className="text-xs">• El Camino del Guerrero</p>
                  <p className="text-xs">
                    • Taller Vivencial de Biodescodificación "Tu síntoma tiene algo que contarte"
                  </p>
                  <p className="text-xs">• Sanando mi Niño Interior</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Capacitaciones para Empresas e Instituciones</p>
                  <p className="text-xs">
                    En trabajo en equipo, comunicación efectiva, resolución de conflictos y bienestar organizacional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Nuestra Misión va Dirigida - Combinado */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center">Nuestra Misión</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center text-pretty mb-4 sm:mb-6">
                Acompañar a las personas en su viaje de autoconocimiento y transformación, proporcionando herramientas
                efectivas para alcanzar sus metas y vivir en plenitud y autenticidad.
              </p>
              
              <div className="border-t pt-6 mt-6">
                <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 id="para-quien" className="text-lg sm:text-xl font-semibold mb-3 text-center">
                  A Quién Va Dirigido
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center text-pretty">
                  A todas las personas que buscan crecer, transformarse y desarrollar su liderazgo personal. No importa tu
                  edad o experiencia, aquí encontrarás un espacio seguro para tu desarrollo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
