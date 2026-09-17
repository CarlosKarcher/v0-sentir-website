"use client"

export function AlianzaSentir() {
  return (
    <section className="py-5 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
          Alianza Institucional
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-1">
          SENTIR + ACEPTAR ES CRECER
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium mb-4">
          Dos comunidades, un mismo propósito
        </p>

        <div className="flex flex-row items-center justify-center gap-6 sm:gap-14 mb-4">
          {/* Logo Sentir */}
          <div className="flex flex-col items-center gap-1">
            <img
              src="/Fuego de Sentir.png"
              alt="Sentir - Fuego"
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-md"
            />
            <span className="text-blue-900 font-bold text-sm tracking-wide">SENTIR</span>
          </div>

          {/* Separador */}
          <div className="text-3xl font-black text-slate-300 select-none">+</div>

          {/* Logo Aceptar es Crecer */}
          <div className="flex flex-col items-center gap-1">
            <img
              src="/images/logo-aceptar-es-crecer.jpeg"
              alt="Aceptar es Crecer"
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain rounded-xl drop-shadow-md"
            />
            <span className="text-yellow-600 font-bold text-sm tracking-wide">ACEPTAR ES CRECER</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-2">
          La Comunidad SENTIR trabaja junto a Aceptar es Crecer en Río Gallegos,
          uniendo fuerzas para acompañar procesos de transformación personal y liderazgo.
        </p>

        <p className="text-xs font-semibold text-slate-400 italic">
          Cuando somos auténticos, nos transformamos.
        </p>
      </div>
    </section>
  )
}
