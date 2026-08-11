"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Facebook, Instagram } from "lucide-react"
import { ImagePopup } from "@/components/ui/image-popup"

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
    image: "/images/Vanesa Miranda.png",
    phone: "56961130835",
  },
  {
    name: "Maria Sol Diaz",
    role: "Prof. de Educación Física y Coach Ontológico",
    specialties: ["Entrenadora Personal", "Staff de Sentir"],
    image: "/images/Sol Diaz.jpg",
    phone: "5492966499363",
  },
  {
    name: "Zuni Wolert",
    role: "Coach Ontológico Profesional",
    specialties: ["Staff de Sentir"],
    image: "/Zuni Wolert.jpg",
    phone: "5492966675729",
  },
  {
    name: "Marcelo Dalla Longa",
    role: "Coach Transformacional",
    specialties: ["Abordajes Vibroacústicos", "Biodecodificación"],
    image: "/images/Marcelo Dalla Longa.jpg",
    phone: "5492975152081",
  },
  {
    name: "Mariela Devetac",
    role: "Instructora de Gimnasia Aeróbica y localizada",
    specialties: ["Staff de Sentir"],
    image: "/images/Mariela Devetac.jpg",
    phone: "5492966639509",
  },
  {
    name: "José Matulich",
    role: "Péndulo Hebreo y Reiki",
    specialties: ["Staff de Sentir"],
    image: "/Jose Matulich.jpg",
    phone: "5492966646975",
  },
  {
    name: "Angélica Caicheo",
    role: "Sesiones de Reiki y Acupuntura",
    specialties: ["Staff de Sentir"],
    image: "/images/Angelica Caicheo.jpg",
    phone: "5492966232480",
  },
  {
    name: "Carla Duarte",
    role: "Terapeuta Holística.",
    specialties: [
      "Coach Ontológico y Transformacional",
      "Master de Registros Akáshicos",
      "Entrenadora en Tarot terapéutico",
    ],
    image: "/Carla-Duarte.jpeg",
    phones: [{ name: "Carla", phone: "5491167066630" }],
    facebook: "https://www.facebook.com/carlaandrea.duarte.357/",
    instagram: "https://www.instagram.com/carladu_arte/",
  },
  {
    name: "Karen Romero",
    role: "Community Manager • Marketing Digital • Creación de Contenido Audiovisual • Filmación y Edición de Videos • Cosmetóloga y Maquilladora Profesional",
    specialties: [],
    image: "/Karen-Sentir.jpeg",
    phones: [{ name: "Karen", phone: "5492966565364" }],
    instagram: "https://www.instagram.com/kbeautyskinstudio/",
    imageFit: "contain",
  },
  {
    name: "Lucia \"Loly\" Tamiozzo",
    role: "Community Manager, Creadora de contenido, Marketing Digital y Ventas, Diseño Digital en Imágenes, Grabación y Edición de Videos, Asesorías en Redes Sociales y E-Commerce",
    specialties: [],
    image: "/Loly.jpeg",
    phones: [],
  },
]

export function Team() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

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
              <div 
                className="aspect-square overflow-hidden flex justify-center items-center bg-muted cursor-pointer"
                onClick={() => setSelectedImage({ src: member.image || "/placeholder.svg", alt: member.name })}
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className={`w-full h-full hover:scale-105 transition-transform mx-auto block ${(member as any).imageFit === "contain" ? "object-contain" : "object-cover object-center"}`}
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
                {member.phones ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      {member.phones.map((phoneItem, idx) => (
                        <a
                          key={idx}
                          href={`https://wa.me/${phoneItem.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          aria-label={`WhatsApp ${phoneItem.name}`}
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                      ))}
                      {member.facebook && (
                        <a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : member.phone ? (
                  <a
                    href={`https://wa.me/${member.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    Contacto
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}


        </div>
        
        {/* Pop-up de imagen */}
        {selectedImage && (
          <ImagePopup
            src={selectedImage.src}
            alt={selectedImage.alt}
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </section>
  )
}
