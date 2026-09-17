"use client"

export function AlianzaSentir() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
          Alianza Institucional
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-2">
          SENTIR + ACEPTAR ES CRECER
        </h2>
        <p className="text-base sm:text-lg text-slate-500 font-medium mb-8">
          Dos comunidades, un mismo propósito
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-8">
          {/* Logo Sentir */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="/Fuego de Sentir.png"
              alt="Sentir - Fuego"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-md"
            />
            <span className="text-blue-900 font-bold text-lg tracking-wide">SENTIR</span>
          </div>

          {/* Separador */}
          <div className="text-4xl font-black text-slate-300 select-none">+</div>

          {/* Logo Aceptar es Crecer */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="/images/logo-aceptar-es-crecer.jpeg"
              alt="Aceptar es Crecer"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl drop-shadow-md"
            />
            <span className="text-yellow-600 font-bold text-lg tracking-wide">ACEPTAR ES CRECER</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
          La Comunidad SENTIR trabaja junto a Aceptar es Crecer en Río Gallegos,
          uniendo fuerzas para acompañar procesos de transformación personal y liderazgo.
          Cuando estás listo para crecer, somos el espacio que te espera.
        </p>

        <p className="text-sm font-semibold text-slate-500 italic">
          Cuando somos auténticos, nos transformamos.
        </p>
      </div>
    </section>
  )
}
