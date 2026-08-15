import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { StampBadge } from "../components/StampBadge";
import { Card } from "../components/Card";

const PASOS = [
  {
    numero: "01",
    titulo: "Cargás tus propiedades",
    texto: "Dirección, inquilino, alquiler y vencimiento. Una vez, y listo.",
  },
  {
    numero: "02",
    titulo: "Registrás cada pago",
    texto: "Un clic cuando entra la plata. Queda asentado con fecha y monto.",
  },
  {
    numero: "03",
    titulo: "El sistema avisa solo",
    texto: "Contratos por vencer y alquileres impagos, sin que los andes buscando.",
  },
];

export function Landing() {
  return (
    <div className="min-h-svh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <Logo />
        <nav className="flex items-center gap-2 font-sans text-sm">
          <Link
            to="/portal"
            className="rounded-full px-4 py-2 font-medium text-tinta/80 transition hover:text-tinta"
          >
            Portal del inquilino
          </Link>
          <Link
            to="/admin"
            className="rounded-full border border-tinta/15 bg-tinta px-4 py-2 font-medium text-hueso shadow-sm transition hover:bg-tinta-suave"
          >
            Panel administrador
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        <section className="grid items-center gap-14 py-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-mostaza/30 bg-mostaza-suave px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-mostaza">
              Gestión de alquileres, sin planillas sueltas
            </span>
            <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-tinta sm:text-6xl">
              Cuentas claras entre vos y cada inquilino.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-tinta/75">
              Un panel para vos: quién pagó, quién debe y qué contrato vence.
              Un portal para cada inquilino, con su PIN: su alquiler, su
              historial y nada que preguntar por WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/admin"
                className="rounded-full bg-mostaza px-6 py-3 font-sans text-sm font-semibold text-tinta shadow-[0_10px_24px_-10px_rgba(204,154,53,0.55)] transition hover:bg-mostaza/85"
              >
                Entrar al panel administrador
              </Link>
              <Link
                to="/portal"
                className="rounded-full border border-tinta/20 px-6 py-3 font-sans text-sm font-semibold text-tinta transition hover:border-tinta/40 hover:bg-tinta/[0.04]"
              >
                Ver portal del inquilino
              </Link>
            </div>
            <p className="mt-6 font-sans text-xs text-tinta/50">
              Proyecto de demostración — propiedades, inquilinos y montos son
              ficticios.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -right-4 -top-4 -rotate-2 rounded-full border-2 border-dashed border-mostaza/50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-mostaza sm:-right-8">
              Ficha modelo
            </div>
            <Card className="borde-perforado pb-6">
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
                    Propiedad
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-tinta">
                    Av. Rivadavia 4521, 3B
                  </p>
                  <p className="font-sans text-sm text-tinta/60">Marina Sosa</p>
                </div>
                <StampBadge estado="al-dia" />
              </div>
              <div className="mx-6 flex items-center justify-between border-t border-dashed border-grafito-suave pt-4">
                <span className="font-sans text-sm text-tinta/60">
                  Alquiler mensual
                </span>
                <span className="tabular font-mono text-base font-semibold text-tinta">
                  $185.000
                </span>
              </div>
              <div className="mx-6 mt-2 flex items-center justify-between">
                <span className="font-sans text-sm text-tinta/60">
                  Último pago
                </span>
                <span className="tabular font-mono text-sm text-tinta/80">
                  08 ago 2026
                </span>
              </div>
            </Card>
          </div>
        </section>

        <section className="border-t border-grafito-suave/70 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-tinta sm:text-3xl">
            Cómo funciona
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PASOS.map((paso) => (
              <div key={paso.numero}>
                <span className="font-mono text-sm font-semibold text-mostaza">
                  {paso.numero}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-tinta">
                  {paso.titulo}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-tinta/65">
                  {paso.texto}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-grafito-suave/70 pt-6 font-sans text-xs text-tinta/45 sm:flex-row sm:items-center">
          <span>Cuentas Claras — hecho con IA para el CoderCup de Coderhouse.</span>
          <span>Datos de ejemplo, sin personas ni propiedades reales.</span>
        </div>
      </footer>
    </div>
  );
}
