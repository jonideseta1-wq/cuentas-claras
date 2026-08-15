const VARIANTES = [
  { fondo: "bg-tinta", texto: "text-hueso" },
  { fondo: "bg-mostaza", texto: "text-tinta" },
  { fondo: "bg-verde-recibo", texto: "text-hueso" },
  { fondo: "bg-grafito", texto: "text-hueso" },
] as const;

function indiceDesde(semilla: string): number {
  let acumulado = 0;
  for (let i = 0; i < semilla.length; i++) acumulado += semilla.charCodeAt(i);
  return acumulado % VARIANTES.length;
}

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primeras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return primeras.join("");
}

export function InicialesAvatar({
  nombre,
  className = "h-12 w-12 text-sm",
}: {
  nombre: string;
  className?: string;
}) {
  const v = VARIANTES[indiceDesde(nombre)];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-display font-semibold ${v.fondo} ${v.texto} ${className}`}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </span>
  );
}
