import { Link } from "react-router-dom";

export function BackLink({
  to = "/",
  texto = "Inicio",
  tono = "claro",
}: {
  to?: string;
  texto?: string;
  tono?: "claro" | "oscuro";
}) {
  const clases =
    tono === "oscuro"
      ? "text-hueso/75 hover:text-hueso"
      : "text-tinta/55 hover:text-lila";
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 font-sans text-sm font-medium transition ${clases}`}
    >
      <span aria-hidden="true">&larr;</span>
      {texto}
    </Link>
  );
}
