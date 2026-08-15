import type { EstadoPago } from "../types";
import { IconAlertaCirculo, IconCheckCirculo, IconRelojCirculo } from "./icons";

const CONFIG: Record<
  EstadoPago,
  { etiqueta: string; texto: string; fondo: string; Icono: typeof IconCheckCirculo }
> = {
  "al-dia": {
    etiqueta: "Pagado",
    texto: "text-verde-recibo",
    fondo: "bg-verde-recibo-suave",
    Icono: IconCheckCirculo,
  },
  pendiente: {
    etiqueta: "Pendiente",
    texto: "text-ambar",
    fondo: "bg-ambar-suave",
    Icono: IconRelojCirculo,
  },
  mora: {
    etiqueta: "Mora",
    texto: "text-mora",
    fondo: "bg-mora-suave",
    Icono: IconAlertaCirculo,
  },
};

export function StatusPill({ estado, className = "" }: { estado: EstadoPago; className?: string }) {
  const c = CONFIG[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${c.fondo} py-1.5 pl-2 pr-3 ${className}`}
    >
      <c.Icono className={`h-4 w-4 shrink-0 ${c.texto}`} />
      <span className={`font-sans text-[13px] font-semibold ${c.texto}`}>{c.etiqueta}</span>
    </span>
  );
}
