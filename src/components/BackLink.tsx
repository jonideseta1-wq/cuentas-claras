import { Link } from "react-router-dom";

export function BackLink({ to = "/", texto = "Inicio" }: { to?: string; texto?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-tinta/55 transition hover:text-sello"
    >
      <span aria-hidden="true">&larr;</span>
      {texto}
    </Link>
  );
}
