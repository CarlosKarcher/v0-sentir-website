"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Video tutorial de Nuestra Esencia (YouTube, «no listado», cuenta de Carlos). Opcional: solo se carga al tocar el botón.
const VIDEO_ID = "48Kzj7NSHBI";
const CIERRE_AL_TERMINAR_MS = 2500; // si nadie lo cierra, el recuadro se cierra solo un rato después de que termina el video

export function BotonTutorial({ texto = "¿Primera vez? Mirá cómo se juega" }: { texto?: string }) {
  const [abierto, setAbierto] = useState(false);
  const marco = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", tecla);

    // El reproductor de YouTube avisa por mensajes cuándo cambia de estado (0 = terminó).
    let cierre: ReturnType<typeof setTimeout> | undefined;
    const mensaje = (e: MessageEvent) => {
      if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
      let d: { event?: string; info?: unknown };
      try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch { return; }
      const estado = d.event === "onStateChange" ? d.info : d.event === "infoDelivery" ? (d.info as { playerState?: number })?.playerState : undefined;
      if (estado === 0 && !cierre) cierre = setTimeout(() => setAbierto(false), CIERRE_AL_TERMINAR_MS);
      if (estado === 1 && cierre) { clearTimeout(cierre); cierre = undefined; } // si lo vuelven a reproducir, no se cierra
    };
    window.addEventListener("message", mensaje);
    // pedirle al reproductor que nos avise (se repite un par de veces hasta que cargue)
    const suscribir = () => {
      const w = marco.current?.contentWindow;
      if (!w) return;
      w.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
      w.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"], id: 1, channel: "widget" }), "*");
    };
    const intentos = [500, 1500, 3000, 6000].map((ms) => setTimeout(suscribir, ms));

    return () => {
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("message", mensaje);
      intentos.forEach(clearTimeout);
      if (cierre) clearTimeout(cierre);
    };
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
            ref={marco}
            onLoad={() => setTimeout(() => marco.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*"), 300)}
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&cc_lang_pref=es&hl=es&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
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
      {/* el botón titila suave y una flechita lo señala, para invitar a ver el tutorial */}
      <span className="tutorial-llamada">
        <span className="tutorial-flecha" aria-hidden="true">➜</span>
        <button type="button" className="btn tutorial-boton" onClick={() => setAbierto(true)}>
          ▶ {texto}
        </button>
      </span>
      {recuadro && (raiz ? createPortal(recuadro, raiz) : recuadro)}
    </>
  );
}
