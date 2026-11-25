import { ArrowRight } from "lucide-react"

const TIENDA_URL = "https://tinyurl.com/AlasdelSurPatagonia"

export function Merchandising() {
  return (
    <section id="merchandising" className="py-12 sm:py-16 md:py-20 bg-background w-full">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center" style={{ marginBottom: "1cm" }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">Merchandising</h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Descubre nuestros productos oficiales de Sentir
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <a
            href={TIENDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
            aria-label="Ir a la tienda de Sentir"
          >
            <img
              src="/logo-tienda-Sentir.jpeg"
              alt="Logo Tienda Sentir"
              className="object-contain"
              style={{ width: "8cm", height: "10cm" }}
            />
            <div className="absolute bottom-2 right-2 bg-blue-900 text-white rounded-full p-2 shadow-lg">
              <ArrowRight className="h-5 w-5" />
            </div>
          </a>
          <a
            href={TIENDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-900 hover:underline mt-2"
          >
            Ir a la tienda
          </a>
        </div>
      </div>
    </section>
  )
}
