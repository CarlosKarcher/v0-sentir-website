import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/lib/user-context"
import { WelcomeModal } from "@/components/welcome-modal"
import { GoogleOneTap } from "@/components/google-one-tap"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SENTIR - Comunidad para el Liderazgo y Desarrollo Personal",
  description:
    "Comunidad dedicada al liderazgo, desarrollo personal y transformación. Talleres, coaching y constelaciones familiares.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/fuego-de-sentir.png",
        type: "image/png",
      },
      {
        url: "/fuego-de-sentir.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/fuego-de-sentir.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/Fuego de Sentir.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <UserProvider>
          {children}
          <WelcomeModal />
          <GoogleOneTap />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
