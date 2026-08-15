import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Card } from "../components/Card";
import { StampBadge } from "../components/StampBadge";
import { useDatos } from "../state/DataContext";
import {
  diasHastaVencimientoContrato,
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
  mesActual,
} from "../lib/utils";

export function Admin() {
  const { datos, registrarPago, reiniciarDemo } = useDatos();
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const mes = mesActual();

  const filas = useMemo(
    () =>
      datos.propiedades
        .map((prop) => ({
          prop,
          estado: estadoPropiedad(prop, datos.pagos),
          ultimoPago: [...datos.pagos]
            .filter((p) => p.propiedadId === prop.id)
            .sort((a, b) => b.fecha.localeCompare(a.fecha))[0],
          diasContrato: diasHastaVencimientoContrato(prop.contratoFin),
        }))
        .sort((a, b) => {
          const orden = { mora: 0, pendiente: 1, "al-dia": 2 };
          return orden[a.estado] - orden[b.estado];
        }),
    [datos.propiedades, datos.pagos]
  );

  const cobradoEsteMes = datos.pagos
    .filter((p) => p.mes === mes)
    .reduce((acc, p) => acc + p.monto, 0);

  const pendienteDeCobro = filas
    .filter((f) => f.estado !== "al-dia")
    .reduce((acc, f) => acc + f.prop.alquilerMensual, 0);

  const enMora = filas.filter((f) => f.estado === "mora");
  const contratosPorVencer = filas
    .filter((f) => f.diasContrato <= 60)
    .sort((a, b) => a.diasContrato - b.diasContrato);

  return (
    <div className="min-h-svh pb-20">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-7 sm:px-10">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-tinta/45">
            {formatoMes(mes)}
          </span>
          {confirmandoReinicio ? (
            <div className="flex items-center gap-2 font-sans text-xs">
              <span className="text-tinta/60">¿Reiniciar datos de demo?</span>
              <button
                onClick={() => {
                  reiniciarDemo();
                  setConfirmandoReinicio(false);
                }}
                className="rounded-full bg-sello px-3 py-1.5 font-semibold text-hueso"
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setConfirmandoReinicio(false)}
                className="rounded-full border border-tinta/20 px-3 py-1.5 text-tinta/70"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoReinicio(true)}
              className="rounded-full border border-tinta/15 px-4 py-2 font-sans text-xs font-medium text-tinta/60 transition hover:border-tinta/30 hover:text-tinta"
            >
              Reiniciar datos de demo
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        <h1 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
          Panel administrador
        </h1>
        <p className="mt-2 font-sans text-tinta/60">
          Vistazo del mes, un clic para registrar cada pago.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Cobrado este mes
            </p>
            <p className="mt-2 tabular font-display text-3xl font-semibold text-verde-recibo">
              {formatoMoneda(cobradoEsteMes)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Falta cobrar este mes
            </p>
            <p className="mt-2 tabular font-display text-3xl font-semibold text-sello">
              {formatoMoneda(pendienteDeCobro)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Propiedades
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-tinta">
              {filas.length}
              <span className="ml-2 font-sans text-sm font-normal text-tinta/50">
                ({filas.filter((f) => f.estado === "al-dia").length} al día)
              </span>
            </p>
          </Card>
        </section>

        {(enMora.length > 0 || contratosPorVencer.length > 0) && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Avisos
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {enMora.map(({ prop }) => (
                <div
                  key={prop.id}
                  className="flex items-start gap-3 rounded-xl border border-sello/30 bg-sello-suave/15 px-4 py-3"
                >
                  <StampBadge estado="mora" />
                  <p className="font-sans text-sm text-tinta/80">
                    <strong className="font-semibold">{prop.inquilino}</strong>{" "}
                    no pagó el alquiler de {prop.direccion} este mes.
                  </p>
                </div>
              ))}
              {contratosPorVencer.map(({ prop, diasContrato }) => (
                <div
                  key={prop.id}
                  className="flex items-start gap-3 rounded-xl border border-ambar/30 bg-ambar-suave/25 px-4 py-3"
                >
                  <span className="mt-0.5 inline-flex shrink-0 rounded-full border-2 border-dashed border-ambar px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ambar">
                    Contrato
                  </span>
                  <p className="font-sans text-sm text-tinta/80">
                    El contrato de <strong className="font-semibold">{prop.inquilino}</strong> en{" "}
                    {prop.direccion} vence en{" "}
                    <strong className="font-semibold">
                      {diasContrato <= 0 ? "0" : diasContrato} días
                    </strong>{" "}
                    ({formatoFecha(prop.contratoFin)}).
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-tinta">
            Propiedades
          </h2>
          <Card className="mt-4 divide-y divide-dashed divide-grafito-suave overflow-hidden">
            {filas.map(({ prop, estado, ultimoPago }) => (
              <div
                key={prop.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <StampBadge estado={estado} />
                  <div>
                    <p className="font-display text-base font-semibold text-tinta">
                      {prop.direccion}
                      <span className="ml-1.5 font-sans text-sm font-normal text-tinta/50">
                        {prop.unidad}
                      </span>
                    </p>
                    <p className="font-sans text-sm text-tinta/60">
                      {prop.inquilino}
                      {ultimoPago && (
                        <span className="text-tinta/40">
                          {" "}
                          · último pago {formatoFecha(ultimoPago.fecha)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 sm:gap-8">
                  <span className="tabular font-mono text-base font-semibold text-tinta">
                    {formatoMoneda(prop.alquilerMensual)}
                  </span>
                  {estado === "al-dia" ? (
                    <span className="whitespace-nowrap rounded-full bg-verde-recibo-suave px-4 py-2 font-sans text-xs font-semibold text-verde-recibo">
                      Pagado este mes
                    </span>
                  ) : (
                    <button
                      onClick={() => registrarPago(prop.id, prop.alquilerMensual)}
                      className="whitespace-nowrap rounded-full bg-tinta px-4 py-2 font-sans text-xs font-semibold text-hueso transition hover:bg-tinta-suave"
                    >
                      Registrar pago
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </section>
      </main>
    </div>
  );
}
