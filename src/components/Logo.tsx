export function Logo({ tono = "claro" }: { tono?: "claro" | "oscuro" }) {
  const colorTexto = tono === "claro" ? "text-tinta" : "text-hueso";
  const colorMarca = tono === "claro" ? "border-sello text-sello" : "border-hueso text-hueso";

  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className={`relative flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-full border-2 border-dashed ${colorMarca}`}
        aria-hidden="true"
      >
        <span className="font-display text-[13px] font-semibold leading-none">CC</span>
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${colorTexto}`}>
        Cuentas Claras
      </span>
    </div>
  );
}
