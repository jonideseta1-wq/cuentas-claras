import type { ComponentType, SVGProps } from "react";

const TONOS = {
  sello: { fondo: "bg-sello-suave/25", texto: "text-sello" },
  tinta: { fondo: "bg-tinta/[0.08]", texto: "text-tinta" },
  verde: { fondo: "bg-verde-recibo-suave", texto: "text-verde-recibo" },
  ambar: { fondo: "bg-ambar-suave", texto: "text-ambar" },
} as const;

export function StatTile({
  Icono,
  tono,
  etiqueta,
  valor,
  nota,
}: {
  Icono: ComponentType<SVGProps<SVGSVGElement>>;
  tono: keyof typeof TONOS;
  etiqueta: string;
  valor: string;
  nota?: string;
}) {
  const t = TONOS[tono];
  return (
    <div className="rounded-2xl border border-grafito-suave/60 bg-hueso p-4 sm:p-5">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${t.fondo}`}>
        <Icono className={`h-[18px] w-[18px] ${t.texto}`} />
      </span>
      <p className="mt-3 font-sans text-xs text-tinta/50">{etiqueta}</p>
      <p className="mt-0.5 font-display text-xl font-semibold leading-tight text-tinta">
        {valor}
      </p>
      {nota && <p className="mt-0.5 font-sans text-[11px] text-tinta/40">{nota}</p>}
    </div>
  );
}
