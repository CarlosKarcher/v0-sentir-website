"use client";

// Conexión entre navegadores (WebRTC vía PeerJS).
// - Juego: estrella. El anfitrión tiene el id "esencia-<código>", recibe acciones y reparte el estado.
// - Video: malla. Cada par de jugadores se llama una sola vez (llama el de id menor). Hasta 6 personas.

import type Peer from "peerjs";
import type { DataConnection, MediaConnection } from "peerjs";
import { create } from "zustand";
import { aplicar, estadoInicial, quitarJugador, sumarJugador, type Accion, type Estado, type Modo } from "./juego";

export type Conexion = "conectando" | "esperando-anfitrion" | "conectado" | "llena" | "sala-abierta" | "expulsado" | "cerrada" | "error";

interface Sala {
  miId: string | null;
  estado: Estado | null;
  conexion: Conexion;
  detalle?: string;
  local: MediaStream | null;
  remotos: Record<string, MediaStream>;
  enviar: (ac: Accion) => void;
  /** solo el anfitrión: cierra la sesión de un jugador (por ejemplo si quedó trabada) */
  expulsar: (id: string) => void;
}

export const useSala = create<Sala>(() => ({
  miId: null,
  estado: null,
  conexion: "conectando",
  local: null,
  remotos: {},
  enviar: () => {},
  expulsar: () => {},
}));

const TURN_USER = process.env.NEXT_PUBLIC_TURN_USER;
const TURN_PASS = process.env.NEXT_PUBLIC_TURN_PASS;
const ICE = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
    { urls: "stun:stun.relay.metered.ca:80" },
    ...(TURN_USER && TURN_PASS
      ? [
          "turn:global.relay.metered.ca:80",
          "turn:global.relay.metered.ca:80?transport=tcp",
          "turn:global.relay.metered.ca:443",
          "turns:global.relay.metered.ca:443?transport=tcp",
        ].map((urls) => ({ urls, username: TURN_USER, credential: TURN_PASS }))
      : []),
  ],
};

function streamVacio(): MediaStream {
  const canvas = Object.assign(document.createElement("canvas"), { width: 160, height: 120 });
  canvas.getContext("2d")?.fillRect(0, 0, 160, 120);
  return canvas.captureStream(1);
}

export const idAnfitrion =(codigo: string) => `esencia-${codigo.toLowerCase()}`;

type Mensaje = { t: "hola"; nombre: string } | { t: "estado"; e: Estado } | { t: "accion"; ac: Accion } | { t: "llena" } | { t: "fuera" } | { t: "cerrada" };

export async function conectar(opts: {
  codigo: string;
  nombre: string;
  anfitrion: boolean;
  modo: Modo;
  local: MediaStream | null;
}) {
  const { codigo, anfitrion, modo, local } = opts;
  // puede cambiar en la mesa (acción "nombre"); si el invitado se reconecta, vuelve con el nombre nuevo
  let nombre = opts.nombre;
  const { default: PeerCtor } = await import("peerjs");
  const set = useSala.setState;
  set({ local, remotos: {}, estado: null, conexion: "conectando", detalle: undefined });

  let cerrado = false;
  let reintento: ReturnType<typeof setTimeout> | null = null;
  const llamadas = new Map<string, MediaConnection>();
  const invitados = new Map<string, DataConnection>(); // solo anfitrión
  let alAnfitrion: DataConnection | null = null; // solo invitado

  const peer: Peer = anfitrion ? new PeerCtor(idAnfitrion(codigo), { config: ICE }) : new PeerCtor({ config: ICE });

  // ---------- video en malla ----------
  const atarLlamada = (m: MediaConnection) => {
    llamadas.get(m.peer)?.close();
    llamadas.set(m.peer, m);
    m.on("stream", (s) => set((st) => ({ remotos: { ...st.remotos, [m.peer]: s } })));
    m.on("close", () => {
      if (llamadas.get(m.peer) === m) {
        llamadas.delete(m.peer);
        set((st) => {
          const r = { ...st.remotos };
          delete r[m.peer];
          return { remotos: r };
        });
      }
    });
  };
  // sin cámara igual mandamos un video negro, así la llamada se arma y esa persona ve a las demás
  const salida = local ?? streamVacio();
  peer.on("call", (m) => {
    m.answer(salida);
    atarLlamada(m);
  });
  const sincronizarVideo = (e: Estado) => {
    const yo = peer.id;
    const ids = new Set(e.jugadores.map((j) => j.id));
    // cortar a los que se fueron
    for (const [id, m] of llamadas) if (!ids.has(id)) m.close();
    // llamar a los nuevos (de a pares, llama el id menor)
    for (const j of e.jugadores) {
      if (j.id === yo || llamadas.has(j.id) || !(yo < j.id)) continue;
      atarLlamada(peer.call(j.id, salida));
    }
  };

  // ---------- juego ----------
  const recibirEstado = (e: Estado) => {
    set({ estado: e, conexion: "conectado" });
    sincronizarVideo(e);
  };

  if (anfitrion) {
    let estado = estadoInicial(modo, { id: idAnfitrion(codigo), nombre, anfitrion: true });
    const repartir = () => {
      recibirEstado(estado);
      for (const c of invitados.values()) if (c.open) c.send({ t: "estado", e: estado } satisfies Mensaje);
    };
    const actuar = (quien: string, ac: Accion) => {
      const n = aplicar(estado, quien, ac);
      if (n !== estado) {
        estado = n;
        repartir();
      }
    };
    set({
      enviar: (ac) => actuar(peer.id, ac),
      expulsar: (id) => {
        const c = invitados.get(id);
        invitados.delete(id);
        if (c?.open) c.send({ t: "fuera" } satisfies Mensaje);
        setTimeout(() => c?.close(), 400);
        llamadas.get(id)?.close();
        estado = quitarJugador(estado, id);
        repartir();
      },
    });

    peer.on("open", () => {
      set({ miId: peer.id });
      repartir();
    });
    peer.on("connection", (c) => {
      c.on("data", (d) => {
        const msg = d as Mensaje;
        if (msg.t === "hola") {
          const n = sumarJugador(estado, { id: c.peer, nombre: String(msg.nombre || "Invitado").slice(0, 30), anfitrion: false });
          if (!n) {
            c.send({ t: "llena" } satisfies Mensaje);
            setTimeout(() => c.close(), 500);
            return;
          }
          invitados.set(c.peer, c);
          estado = n;
          repartir();
        } else if (msg.t === "accion" && invitados.get(c.peer) === c) {
          actuar(c.peer, msg.ac);
        }
      });
      c.on("close", () => {
        if (invitados.get(c.peer) !== c) return;
        invitados.delete(c.peer);
        estado = quitarJugador(estado, c.peer);
        repartir();
      });
    });
  } else {
    const llamarAnfitrion = () => {
      if (cerrado) return;
      const c = peer.connect(idAnfitrion(codigo), { reliable: true });
      alAnfitrion = c;
      c.on("open", () => c.send({ t: "hola", nombre } satisfies Mensaje));
      c.on("data", (d) => {
        const msg = d as Mensaje;
        if (msg.t === "estado") recibirEstado(msg.e);
        else if (msg.t === "llena") {
          cerrado = true;
          set({ conexion: "llena" });
        } else if (msg.t === "fuera" || msg.t === "cerrada") {
          // "fuera": el guía cerró mi sesión · "cerrada": el guía salió y terminó el encuentro
          cerrado = true;
          for (const m of llamadas.values()) m.close();
          set({ conexion: msg.t === "fuera" ? "expulsado" : "cerrada", estado: null });
        }
      });
      c.on("close", () => {
        if (alAnfitrion !== c || cerrado) return;
        set({ conexion: "esperando-anfitrion" });
        reintentar();
      });
    };
    const reintentar = () => {
      if (reintento) clearTimeout(reintento);
      reintento = setTimeout(llamarAnfitrion, 3000);
    };
    set({
      enviar: (ac) => {
        if (ac.a === "nombre" && ac.n.trim()) nombre = ac.n.trim();
        if (alAnfitrion?.open) alAnfitrion.send({ t: "accion", ac } satisfies Mensaje);
      },
    });
    peer.on("open", () => {
      set({ miId: peer.id });
      llamarAnfitrion();
    });
    peer.on("error", (err) => {
      if ((err as { type?: string }).type === "peer-unavailable" && !useSala.getState().estado) {
        set({ conexion: "esperando-anfitrion" });
        reintentar();
      }
    });
  }

  peer.on("error", (err) => {
    const type = (err as { type?: string }).type;
    if (type === "unavailable-id") set({ conexion: "sala-abierta" });
    else if (type === "network" || type === "server-error" || type === "socket-error") {
      set({ conexion: "error", detalle: "Sin conexión con el servidor de enlace. Reintentando…" });
      setTimeout(() => !cerrado && peer.disconnected && !peer.destroyed && peer.reconnect(), 4000);
    }
  });
  peer.on("disconnected", () => {
    if (!cerrado) setTimeout(() => !cerrado && peer.disconnected && !peer.destroyed && peer.reconnect(), 2000);
  });

  // si el guía cierra la pestaña o el navegador, avisar a los jugadores que terminó el encuentro
  const avisarCierre = () => {
    for (const c of invitados.values()) if (c.open) c.send({ t: "cerrada" } satisfies Mensaje);
  };
  if (anfitrion) window.addEventListener("pagehide", avisarCierre);

  return () => {
    cerrado = true;
    if (reintento) clearTimeout(reintento);
    if (anfitrion) {
      window.removeEventListener("pagehide", avisarCierre);
      avisarCierre(); // el guía tocó "Salir"
    }
    // pequeña espera para que el aviso llegue antes de cortar
    setTimeout(() => {
      for (const m of llamadas.values()) m.close();
      for (const c of invitados.values()) c.close();
      alAnfitrion?.close();
      peer.destroy();
    }, anfitrion ? 300 : 0);
    set({ estado: null, remotos: {}, enviar: () => {}, expulsar: () => {} });
  };
}
