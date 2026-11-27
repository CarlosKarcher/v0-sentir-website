"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Video tutorial de Nuestra Esencia (YouTube, «no listado», cuenta de Carlos). Opcional: solo se carga al tocar el botón.
const VIDEO_ID = "48Kzj7NSHBI";

export function BotonTutorial({ texto = "¿Primera vez? Mirá cómo se juega" }: { texto?: string }) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierto]);

  // el recuadro se dibuja dentro de .esencia para tomar los estilos del juego
  const raiz = typeof document !== "undefined" ? document.querySelector(".esencia") : null;
  const recuadro = abierto ? (
    <div className="confirmar-fondo" onClick={() => setAbierto(false)}>
      <div className="tutorial-video" role="dialog" aria-modal="true" aria-label="Cómo se juega" onClick={(e) => e.stopPropagation()}>
        <div className="tutorial-cabecera">
          <span className="marca"><span className="chispa" /> Cómo se juega</span>
          <button className="btn chico" onClick={() => setAbierto(false)}>Cerrar</button>
        </div>
        <div className="tutorial-marco">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&cc_lang_pref=es&hl=es`}
            title="Nuestra Esencia – Cómo se juega"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" className="btn chico tutorial-boton" onClick={() => setAbierto(true)}>
        ▶ {texto}
      </button>
      {recuadro && (raiz ? createPortal(recuadro, raiz) : recuadro)}
    </>
  );
}
