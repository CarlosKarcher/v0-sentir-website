"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Sala = dynamic(() => import("@/components/esencia/Sala"), {
  ssr: false,
  loading: () => (
    <div className="centro">
      <span className="marca">
        <span className="chispa" /> Nuestra Esencia
      </span>
    </div>
  ),
});

export default function SalaPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const c = decodeURIComponent(codigo ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return <Sala codigo={c} />;
}
