import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone } from "lucide-react"

const team = [
  {
    name: "Fernando Javier Cárcamo",
    role: "Líder de la Comunidad Sentir",
    specialties: ["Coach Ontológico", "Conferencista", "Facilitador en Constelaciones Familiares"],
    image: "/images/fernando-20carcamo.png",
    phone: "5492966595803",
  },
  {
    name: "Carlos Eduardo Karcher",
    role: "Coach en Biodecodificación",
    specialties: ["Staff de Sentir"],
    image: "/images/carlos-20karcher.jpg",
    phone: "5492966211547",
  },
  {
    name: "Vanesa Miranda",
    role: "Representante de Sentir Punta Arenas",
    specialties: ["Staff de Sentir"],
    image: "/images/vanesa-20miranda.png",
    phone: "56961130835",
  },
  {
    name: "Maria Sol Diaz",
    role: "Prof. de Educación Física y Coach Ontológico",
    specialties: ["Entrenadora Personal", "Staff de Sentir"],
    image: "/images/sol-20diaz.png",
    phone: "5492966499363",
  },
  {
    name: "Zuni Wolert",
    role: "Coach Ontológico Profesional",
    specialties: ["Staff de Sentir"],
    image: "/images/zuni-20wolert.png",
    phone: "5492966675729",
  },
  {
    name: "Marcelo Dalla Longa",
    role: "Coach Transformacional",
    specialties: ["Abordajes Vibroacústicos", "Biodecodificación"],
    image: "/images/marcelo-20dalla-20longa.png",
    phone: "5492975152081",
  },
  {
    name: "Mariela Devetac",
    role: "Instructora de Gimnasia Aeróbica y localizada",
    specialties: ["Staff de Sentir"],
    image: "/images/mariela-20devetac.png",
    phone: "5492966639509",
  },
  {
    name: "José Matulich",
    role: "Péndulo Hebreo y Reiki",
    specialties: ["Staff de Sentir"],
    image: "/images/jose-20matulich.png",
    phone: "5492966646975",
  },
  {
    name: "Angélica Caicheo",
    role: "Sesiones de Reiki y Acupuntura",
    specialties: ["Staff de Sentir"],
    image: "/images/angelica-20caicheo.png",
    phone: "5492966232480",
  },
  {
    name: "Natali Maresca",
    role: "Community Manager",
    specialties: ["Representante de Sentir en Tandil, Prov. de Buenos Aires", "Staff de Sentir"],
    image: "/natali Maresca.jpg",
    phone: "5492494622736",
  },
]

export function Team() {
  return (
    <section id="equipo" className="py-12 sm:py-16 md:py-20 bg-secondary/30 w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Nuestro Equipo</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Profesionales comprometidos con tu transformación y crecimiento personal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden flex justify-center items-center bg-muted">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform mx-auto block"
                />
              </div>
              <CardContent className="pt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{member.role}</p>
                {member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}
                {member.phone && (
                  <a
                    href={`https://wa.me/${member.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    Contacto
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
