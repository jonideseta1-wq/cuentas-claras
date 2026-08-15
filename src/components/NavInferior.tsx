import type { ComponentType, SVGProps } from "react";
import { IconCampana, IconCasa, IconDocumento, IconPerfil } from "./icons";

export type VistaPortal = "inicio" | "documentos" | "avisos" | "perfil";

const ITEMS: Array<{ vista: VistaPortal; etiqueta: string; Icono: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { vista: "inicio", etiqueta: "Inicio", Icono: IconCasa },
  { vista: "documentos", etiqueta: "Documentos", Icono: IconDocumento },
  { vista: "avisos", etiqueta: "Avisos", Icono: IconCampana },
  { vista: "perfil", etiqueta: "Perfil", Icono: IconPerfil },
];

export function NavInferior({
  vista,
  onCambiar,
  hayAvisos,
}: {
  vista: VistaPortal;
  onCambiar: (v: VistaPortal) => void;
  hayAvisos: boolean;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-grafito-suave/70 bg-hueso/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {ITEMS.map(({ vista: v, etiqueta, Icono }) => {
          const activo = v === vista;
          return (
            <button
              key={v}
              onClick={() => onCambiar(v)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span className="relative">
                <Icono
                  className={`h-5 w-5 ${activo ? "text-tinta" : "text-grafito/70"}`}
                />
                {v === "avisos" && hayAvisos && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-mora" />
                )}
              </span>
              <span
                className={`font-sans text-[11px] ${
                  activo ? "font-semibold text-tinta" : "text-grafito/70"
                }`}
              >
                {etiqueta}
              </span>
              {activo && (
                <span className="absolute -top-px h-0.5 w-8 rounded-full bg-tinta" />
              )}
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
