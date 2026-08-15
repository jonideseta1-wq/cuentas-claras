const VARIANTES = [
  { suave: "fill-tinta/10", fuerte: "fill-tinta" },
  { suave: "fill-lila/15", fuerte: "fill-lila" },
  { suave: "fill-mostaza/15", fuerte: "fill-mostaza" },
  { suave: "fill-verde-recibo/12", fuerte: "fill-verde-recibo" },
] as const;

function indiceDesde(semilla: string): number {
  let acumulado = 0;
  for (let i = 0; i < semilla.length; i++) acumulado += semilla.charCodeAt(i);
  return acumulado % VARIANTES.length;
}

// Ilustración abstracta y geométrica — deliberadamente no figurativa, para que
// nunca se confunda con la foto real de una propiedad (los datos son ficticios).
export function IlustracionPropiedad({
  seed,
  className = "",
}: {
  seed: string;
  className?: string;
}) {
  const v = VARIANTES[indiceDesde(seed)];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" className={v.suave} />
      <circle cx="45" cy="18" r="6" className="fill-hueso" opacity={0.8} />
      <rect x="13" y="25" width="35" height="27" rx="7" className={v.fuerte} />
      <rect x="21" y="33" width="6" height="6" rx="1.5" className="fill-hueso" opacity={0.85} />
      <rect x="32" y="33" width="6" height="6" rx="1.5" className="fill-hueso" opacity={0.85} />
      <rect x="26" y="43" width="9" height="9" rx="2" className="fill-hueso" opacity={0.6} />
    </svg>
  );
}
