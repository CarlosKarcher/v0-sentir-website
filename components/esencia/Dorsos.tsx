"use client";

// Los 5 dorsos de carta. Se cambia de modelo tocando el dorso.

import { ETAPAS } from "@/lib/esencia/cartas";

/** Dorso de baraja: marco doble, esquinas ornamentadas y una flor de 5 pétalos (una por etapa)
 *  rodeada por 30 puntos (las 30 cartas). */
function Mandala() {
  const cx = 150;
  const cy = 172;
  const esquinas: [number, number, number][] = [
    [34, 34, 0],
    [266, 34, 90],
    [266, 326, 180],
    [34, 326, 270],
  ];
  return (
    <svg className="dorso-svg" viewBox="0 0 300 360" aria-hidden>
      <defs>
        <pattern id="trama" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 7h14M7 0v14" className="d-trama" />
        </pattern>
        <radialGradient id="halo">
          <stop offset="0" className="d-halo-in" />
          <stop offset="1" className="d-halo-out" />
        </radialGradient>
      </defs>

      {/* fondo y marcos */}
      <rect x="22" y="22" width="256" height="316" rx="10" fill="url(#trama)" />
      <rect x="12" y="12" width="276" height="336" rx="16" className="d-linea" />
      <rect x="22" y="22" width="256" height="316" rx="10" className="d-linea fina" />
      <circle cx={cx} cy={cy} r="120" fill="url(#halo)" />

      {/* esquinas */}
      {esquinas.map(([x, y, r]) => (
        <g key={r} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 22 Q0 0 22 0" className="d-linea" />
          <path d="M6 30 Q6 6 30 6" className="d-linea fina" />
          <path d="M0 -5 L5 0 L0 5 L-5 0Z" className="d-relleno" />
        </g>
      ))}

      {/* rayos */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i * Math.PI * 2) / 20;
        const r1 = 64;
        const r2 = i % 2 ? 84 : 100;
        return <line key={i} x1={cx + r1 * Math.sin(a)} y1={cy - r1 * Math.cos(a)} x2={cx + r2 * Math.sin(a)} y2={cy - r2 * Math.cos(a)} className="d-linea fina" />;
      })}

      {/* 30 puntos: las 30 cartas */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = (i * Math.PI * 2) / 30;
        return <circle key={i} cx={cx + 108 * Math.sin(a)} cy={cy - 108 * Math.cos(a)} r={i % 6 === 0 ? 2.6 : 1.4} className="d-relleno" />;
      })}

      <circle cx={cx} cy={cy} r="62" className="d-linea" />
      <circle cx={cx} cy={cy} r="57" className="d-linea fina" />

      {/* flor de 5 pétalos, uno por etapa */}
      {ETAPAS.map((e, i) => (
        <g key={e.nombre} transform={`rotate(${i * 72} ${cx} ${cy})`}>
          <path
            d={`M${cx} ${cy - 6} C ${cx + 22} ${cy - 22}, ${cx + 16} ${cy - 46}, ${cx} ${cy - 52} C ${cx - 16} ${cy - 46}, ${cx - 22} ${cy - 22}, ${cx} ${cy - 6}Z`}
            fill={e.color}
            fillOpacity="0.28"
            stroke={e.color}
            strokeWidth="1.2"
          />
          <circle cx={cx} cy={cy - 40} r="2.2" fill={e.color} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r="11" className="d-sol" />
      <circle cx={cx} cy={cy} r="16" className="d-linea fina" />

      {/* adornos y nombre */}
      <path d={`M${cx} 44 l5 8 -5 8 -5 -8Z`} className="d-relleno" />
      <line x1="96" y1="52" x2="136" y2="52" className="d-linea fina" />
      <line x1="164" y1="52" x2="204" y2="52" className="d-linea fina" />
      <text x={cx} y="300" textAnchor="middle" className="d-nombre">Nuestra Esencia</text>
      <line x1="110" y1="314" x2="190" y2="314" className="d-linea fina" />
    </svg>
  );
}

const FONDO = (color: string) => <rect x="0" y="0" width="300" height="360" fill={color} />;
const NOMBRE = (y: number, size = 19) => (
  <text x="150" y={y} textAnchor="middle" fill="#f3e9dc" style={{ fontFamily: "var(--f-serif), Georgia, serif", fontSize: size }}>
    Nuestra Esencia
  </text>
);

function SolLuna() {
  const rayos = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI * 2) / 16;
    const r2 = i % 2 ? 50 : 56;
    return <line key={i} x1={150 + 36 * Math.sin(a)} y1={150 - 36 * Math.cos(a)} x2={150 + r2 * Math.sin(a)} y2={150 - r2 * Math.cos(a)} />;
  });
  return (
    <svg className="dorso-svg" viewBox="0 0 300 360" aria-hidden>
      {FONDO("#1b1520")}
      <g fill="none" stroke="#e8b86a" strokeOpacity=".7" strokeWidth="1.4">
        <rect x="12" y="12" width="276" height="336" rx="16" />
        <path d="M40 320V150A110 110 0 0 1 260 150V320Z" />
        <path d="M52 320V152A98 98 0 0 1 248 152V320" strokeOpacity=".35" strokeWidth=".8" />
      </g>
      <circle cx="150" cy="150" r="26" fill="#e8b86a" />
      <g stroke="#e8b86a" strokeWidth="1.2" strokeOpacity=".8">{rayos}</g>
      <path d="M150 236A26 26 0 0 0 150 288A34 34 0 0 1 150 236Z" fill="#cfc3ea" fillOpacity=".9" />
      <g fill="#f3e9dc" fillOpacity=".8">
        <circle cx="78" cy="196" r="1.6" /><circle cx="222" cy="206" r="1.6" /><circle cx="92" cy="262" r="1.2" />
        <circle cx="210" cy="270" r="1.2" /><circle cx="70" cy="300" r="1.2" /><circle cx="232" cy="298" r="1.6" />
        <path d="M200 238l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><path d="M98 226l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </g>
      {NOMBRE(44, 17)}
      <path d="M150 56l4 4-4 4-4-4z" fill="#e8b86a" />
    </svg>
  );
}

function FlorDeLaVida() {
  const c = 150, y = 172, r = 30;
  const centros: [number, number][] = [[0, 0], [0, -30], [0, 30], [26, -15], [-26, -15], [26, 15], [-26, 15]];
  const anillo: [number, number][] = [[0, -60], [0, 60], [52, -30], [-52, -30], [52, 30], [-52, 30]];
  return (
    <svg className="dorso-svg" viewBox="0 0 300 360" aria-hidden>
      {FONDO("#14191a")}
      <g fill="none" stroke="#7fb7a4">
        <rect x="12" y="12" width="276" height="336" rx="16" strokeOpacity=".7" strokeWidth="1.4" />
        <rect x="22" y="22" width="256" height="316" rx="10" strokeOpacity=".35" strokeWidth=".8" />
        <circle cx={c} cy={y} r="94" strokeOpacity=".7" strokeWidth="1.4" />
        <circle cx={c} cy={y} r="100" strokeOpacity=".35" />
        <g strokeOpacity=".75">{centros.map(([dx, dy], i) => <circle key={i} cx={c + dx} cy={y + dy} r={r} />)}</g>
        <g strokeOpacity=".4">{anillo.map(([dx, dy], i) => <circle key={i} cx={c + dx} cy={y + dy} r={r} />)}</g>
        <path d="M150 40L172 52 150 64 128 52Z" strokeOpacity=".7" />
      </g>
      <circle cx={c} cy={y} r="7" fill="#e8b86a" />
      <g fill="#7fb7a4"><circle cx="40" cy="40" r="3" /><circle cx="260" cy="40" r="3" /><circle cx="40" cy="320" r="3" /><circle cx="260" cy="320" r="3" /></g>
      {NOMBRE(314, 17)}
    </svg>
  );
}

function BarajaClasica() {
  return (
    <svg className="dorso-svg" viewBox="0 0 300 360" aria-hidden>
      <defs>
        <pattern id="d-rombo" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0L20 10 10 20 0 10Z" fill="none" stroke="#e8b86a" strokeOpacity=".25" strokeWidth=".8" />
          <circle cx="10" cy="10" r="1.2" fill="#e8b86a" fillOpacity=".4" />
        </pattern>
      </defs>
      {FONDO("#2a1414")}
      <rect x="22" y="22" width="256" height="316" rx="8" fill="url(#d-rombo)" />
      <g fill="none" stroke="#e8b86a" strokeOpacity=".8">
        <rect x="12" y="12" width="276" height="336" rx="16" strokeWidth="1.4" />
        <rect x="22" y="22" width="256" height="316" rx="8" strokeWidth="2" />
      </g>
      <ellipse cx="150" cy="180" rx="74" ry="96" fill="#2a1414" stroke="#e8b86a" strokeWidth="2" />
      <ellipse cx="150" cy="180" rx="66" ry="88" fill="none" stroke="#e8b86a" strokeOpacity=".5" />
      <text x="150" y="200" textAnchor="middle" fill="#e8b86a" style={{ fontFamily: "var(--f-serif), Georgia, serif", fontSize: 56, fontStyle: "italic" }}>NE</text>
      <path d="M150 104l6 8-6 8-6-8z M150 240l6 8-6 8-6-8z" fill="#e8b86a" />
      {NOMBRE(232, 13)}
      {/* firma del autor del juego (Carlos Karcher), abajo a la derecha */}
      <rect x="222" y="310" width="50" height="22" rx="4" fill="#2a1414" />
      <text x="266" y="327" textAnchor="end" fill="#f0c97e" style={{ fontFamily: "var(--f-firma), 'Brush Script MT', cursive", fontSize: 21 }}>
        C.K.
      </text>
    </svg>
  );
}

function Constelacion() {
  const puntos: [number, number][] = [[150, 90], [206, 132], [186, 208], [114, 208], [94, 132]];
  const estrellas: [number, number, number][] = [[50, 60, 1.2], [240, 70, 1.6], [64, 250, 1.4], [248, 240, 1.2], [90, 40, 1], [220, 300, 1.2], [40, 190, 1], [262, 180, 1.4], [120, 290, 1]];
  return (
    <svg className="dorso-svg" viewBox="0 0 300 360" aria-hidden>
      {FONDO("#111627")}
      <g fill="none" stroke="#e8b86a">
        <rect x="12" y="12" width="276" height="336" rx="16" strokeOpacity=".7" strokeWidth="1.4" />
        <circle cx="150" cy="170" r="100" strokeOpacity=".3" />
        <circle cx="150" cy="170" r="70" strokeOpacity=".2" strokeDasharray="2 5" />
        <path d="M150 90L206 132 186 208 114 208 94 132Z" strokeOpacity=".65" />
        <path d="M150 90L186 208M206 132L114 208M186 208L94 132M114 208L150 90M94 132L206 132" strokeOpacity=".25" />
      </g>
      {puntos.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={ETAPAS[i].color} />)}
      <circle cx="150" cy="160" r="9" fill="#f3e9dc" />
      <g fill="#f3e9dc" fillOpacity=".7">{estrellas.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
      {NOMBRE(314)}
    </svg>
  );
}

export const DORSOS = [
  { nombre: "Mandala", Dibujo: Mandala },
  { nombre: "Sol y luna", Dibujo: SolLuna },
  { nombre: "Flor de la vida", Dibujo: FlorDeLaVida },
  { nombre: "Baraja clásica", Dibujo: BarajaClasica },
  { nombre: "Constelación", Dibujo: Constelacion },
];
