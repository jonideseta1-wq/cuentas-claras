import type { EstadoPago } from "../types";
import { ETIQUETA_ESTADO } from "../lib/utils";

const ESTILOS: Record<EstadoPago, { borde: string; texto: string; fondo: string; giro: string }> = {
  "al-dia": {
    borde: "border-verde-recibo",
    texto: "text-verde-recibo",
    fondo: "bg-verde-recibo-suave",
    giro: "-rotate-3",
  },
  pendiente: {
    borde: "border-ambar",
    texto: "text-ambar",
    fondo: "bg-ambar-suave",
    giro: "rotate-2",
  },
  mora: {
    borde: "border-mora",
    texto: "text-mora",
    fondo: "bg-mora-suave",
    giro: "-rotate-2",
  },
};

export function StampBadge({ estado, className = "" }: { estado: EstadoPago; className?: string }) {
  const s = ESTILOS[estado];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 border-dashed ${s.borde} ${s.fondo} ${s.giro} px-3 py-1 select-none ${className}`}
    >
      <span
        className={`font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${s.texto}`}
      >
        {ETIQUETA_ESTADO[estado]}
      </span>
    </span>
  );
}
