import { useMemo, useState } from "react";
import { Logo } from "../components/Logo";
import { BackLink } from "../components/BackLink";
import { Card } from "../components/Card";
import { StatusPill } from "../components/StatusPill";
import { StatTile } from "../components/StatTile";
import { useDatos } from "../state/DataContext";
import {
  diasHastaVencimientoContrato,
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
  mesActual,
} from "../lib/utils";
import { IconAlertaCirculo, IconCalendario, IconCasa, IconRecibo } from "../components/icons";

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

  const alDia = filas.filter((f) => f.estado === "al-dia").length;
  const enMora = filas.filter((f) => f.estado === "mora");
  const contratosPorVencer = filas
    .filter((f) => f.diasContrato <= 60)
    .sort((a, b) => a.diasContrato - b.diasContrato);

  return (
    <div className="min-h-svh pb-16">
      <div className="bg-sello-oscuro px-6 pb-24 pt-7 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <BackLink tono="oscuro" />
          {confirmandoReinicio ? (
            <div className="flex items-center gap-2 font-sans text-xs">
              <span className="text-hueso/70">¿Reiniciar datos de demo?</span>
              <button
                onClick={() => {
                  reiniciarDemo();
                  setConfirmandoReinicio(false);
                }}
                className="rounded-full bg-hueso px-3 py-1.5 font-semibold text-sello-oscuro"
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setConfirmandoReinicio(false)}
                className="rounded-full border border-hueso/30 px-3 py-1.5 text-hueso/80"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoReinicio(true)}
              className="rounded-full border border-hueso/25 px-4 py-2 font-sans text-xs font-medium text-hueso/90 transition hover:bg-hueso/10"
            >
              Reiniciar datos de demo
            </button>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-6xl">
          <Logo tono="oscuro" />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-hueso sm:text-4xl">
                Panel administrador
              </h1>
              <p className="mt-1.5 font-sans text-sm text-hueso/60">
                Vistazo del mes, un clic para registrar cada pago.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-hueso/50">
              {formatoMes(mes)}
            </span>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto -mt-16 max-w-6xl px-6 sm:px-10">
        <div className="rounded-3xl border border-grafito-suave/60 bg-hueso p-4 shadow-[0_20px_40px_-24px_rgba(20,43,61,0.35)] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile
              Icono={IconRecibo}
              tono="verde"
              etiqueta="Cobrado este mes"
              valor={formatoMoneda(cobradoEsteMes)}
            />
            <StatTile
              Icono={IconAlertaCirculo}
              tono="sello"
              etiqueta="Falta cobrar este mes"
              valor={formatoMoneda(pendienteDeCobro)}
            />
            <StatTile
              Icono={IconCasa}
              tono="tinta"
              etiqueta="Propiedades"
              valor={String(filas.length)}
              nota={`${alDia} al día`}
            />
          </div>
        </div>

        {(enMora.length > 0 || contratosPorVencer.length > 0) && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Avisos
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {enMora.map(({ prop }) => (
                <div
                  key={prop.id}
                  className="flex items-start gap-3 rounded-xl border border-sello/25 bg-sello-suave/15 px-4 py-3.5"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sello-suave/30">
                    <IconAlertaCirculo className="h-[18px] w-[18px] text-sello" />
                  </span>
                  <p className="font-sans text-sm text-tinta/80">
                    <strong className="font-semibold">{prop.inquilino}</strong>{" "}
                    no pagó el alquiler de {prop.direccion} este mes.
                  </p>
                </div>
              ))}
              {contratosPorVencer.map(({ prop, diasContrato }) => (
                <div
                  key={prop.id}
                  className="flex items-start gap-3 rounded-xl border border-ambar/25 bg-ambar-suave/25 px-4 py-3.5"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ambar-suave">
                    <IconCalendario className="h-[18px] w-[18px] text-ambar" />
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
                  <StatusPill estado={estado} />
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
                      className="whitespace-nowrap rounded-full bg-sello-oscuro px-4 py-2 font-sans text-xs font-semibold text-hueso transition hover:bg-sello"
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
