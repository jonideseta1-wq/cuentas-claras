import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { BackLink } from "../components/BackLink";
import { StatTile } from "../components/StatTile";
import { StatusPill } from "../components/StatusPill";
import { InicialesAvatar } from "../components/InicialesAvatar";
import { ReceiptRow } from "../components/ReceiptRow";
import { useDatos } from "../state/DataContext";
import type { CargoEspecial, EstadoPago, Pago, Propiedad, TipoServicio } from "../types";
import {
  diasHastaVencimientoContrato,
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
  mesActual,
  porcentajeContratoCompletado,
} from "../lib/utils";
import { ORDEN_SERVICIOS, SERVICIO_INFO } from "../lib/servicioInfo";
import {
  IconAlertaCirculo,
  IconCalendario,
  IconCasa,
  IconContrato,
  IconRayo,
  IconRecibo,
  IconRelojCirculo,
} from "../components/icons";

const BORDE_ESTADO: Record<EstadoPago, string> = {
  "al-dia": "border-l-verde-recibo",
  pendiente: "border-l-ambar",
  mora: "border-l-mora",
};

function TarjetaPropiedad({
  prop,
  estado,
  ultimoPago,
  pagos,
  cargosPendientes,
  expandido,
  onToggleExpandir,
  onRegistrarPago,
  onActualizarServicios,
}: {
  prop: Propiedad;
  estado: EstadoPago;
  ultimoPago?: Pago;
  pagos: Pago[];
  cargosPendientes: CargoEspecial[];
  expandido: boolean;
  onToggleExpandir: () => void;
  onRegistrarPago: () => void;
  onActualizarServicios: (tipo: TipoServicio, monto: number) => void;
}) {
  const pct = porcentajeContratoCompletado(prop.contratoInicio, prop.contratoFin);
  const subtotalCargos = cargosPendientes.reduce((acc, c) => acc + c.monto, 0);
  const subtotalServicios = prop.servicios.reduce((acc, s) => acc + s.monto, 0);

  return (
    <div
      className={`rounded-2xl border-y border-r border-l-4 border-y-grafito-suave border-r-grafito-suave bg-hueso p-5 shadow-sm transition hover:shadow-md ${BORDE_ESTADO[estado]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <InicialesAvatar nombre={prop.inquilino} className="h-12 w-12 text-sm" />
          <div>
            <p className="font-display text-base font-semibold leading-tight text-tinta">
              {prop.direccion}{" "}
              <span className="font-sans text-sm font-normal text-tinta/45">
                {prop.unidad}
              </span>
            </p>
            <p className="mt-0.5 font-sans text-sm text-tinta/55">{prop.inquilino}</p>
          </div>
        </div>
        <StatusPill estado={estado} />
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-xl bg-papel px-3.5 py-3">
        <IconRecibo className="h-4 w-4 shrink-0 text-tinta/35" />
        <div className="flex flex-1 items-center justify-between gap-2">
          <div>
            <p className="tabular font-mono text-lg font-semibold text-tinta">
              {formatoMoneda(prop.alquilerMensual)}
            </p>
            <p className="font-sans text-xs text-tinta/40">
              vence el día {prop.diaVencimiento} de cada mes
            </p>
          </div>
          {ultimoPago && (
            <p className="text-right font-sans text-xs text-tinta/40">
              último pago
              <br />
              {formatoFecha(ultimoPago.fecha)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between font-sans text-[11px] text-tinta/40">
          <span className="flex items-center gap-1.5">
            <IconContrato className="h-3.5 w-3.5" />
            Contrato transcurrido
          </span>
          <span className="font-mono">
            {pct}% · vence {formatoFecha(prop.contratoFin)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-grafito-suave">
          <div className="h-full rounded-full bg-tinta/60" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {cargosPendientes.length > 0 && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-ambar-suave/50 px-3.5 py-2.5">
          <IconRelojCirculo className="h-4 w-4 shrink-0 text-ambar" />
          <p className="font-sans text-xs font-medium text-ambar">
            {cargosPendientes.length === 1
              ? "1 cargo especial pendiente"
              : `${cargosPendientes.length} cargos especiales pendientes`}{" "}
            · {formatoMoneda(subtotalCargos)}
          </p>
        </div>
      )}

      <button
        onClick={onToggleExpandir}
        className="mt-3 flex w-full items-center justify-between rounded-xl bg-papel px-3.5 py-2.5 transition hover:bg-grafito-suave/40"
      >
        <span className="flex items-center gap-2 font-sans text-xs text-tinta/55">
          <IconRayo className="h-4 w-4 text-tinta/35" />
          Servicios: {formatoMoneda(subtotalServicios)}/mes
        </span>
        <span className="font-sans text-xs font-medium text-tinta/45">
          {expandido ? "Ocultar" : "Editar"}
        </span>
      </button>

      <div className="mt-4 flex items-center justify-between border-t border-grafito-suave pt-4">
        <button
          onClick={onToggleExpandir}
          className="rounded-full border border-grafito-suave px-3.5 py-2 font-sans text-xs font-semibold text-tinta/70 transition hover:border-tinta/25 hover:text-tinta"
        >
          {expandido ? "Ocultar historial" : "Ver historial"}
        </button>
        {estado === "al-dia" ? (
          <span className="whitespace-nowrap rounded-full bg-verde-recibo-suave px-3.5 py-2 font-sans text-xs font-semibold text-verde-recibo">
            Pagado este mes
          </span>
        ) : (
          <button
            onClick={onRegistrarPago}
            className="whitespace-nowrap rounded-full bg-mostaza px-3.5 py-2 font-sans text-xs font-semibold text-tinta transition hover:bg-mostaza/85"
          >
            Registrar pago
          </button>
        )}
      </div>

      {expandido && (
        <div className="mt-4 border-t border-dashed border-grafito-suave pt-3">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-tinta/40">
            Servicios (editable)
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {ORDEN_SERVICIOS.map((tipo) => {
              const servicio = prop.servicios.find((s) => s.tipo === tipo);
              const { etiqueta, Icono } = SERVICIO_INFO[tipo];
              return (
                <label
                  key={tipo}
                  className="flex items-center gap-2 rounded-lg border border-grafito-suave px-2.5 py-2"
                >
                  <Icono className="h-3.5 w-3.5 shrink-0 text-tinta/40" />
                  <span className="font-sans text-xs text-tinta/60">{etiqueta}</span>
                  <input
                    type="number"
                    min={0}
                    value={servicio?.monto ?? 0}
                    onChange={(e) => onActualizarServicios(tipo, Number(e.target.value) || 0)}
                    className="tabular ml-auto w-20 rounded-md border border-grafito-suave bg-papel px-1.5 py-1 text-right font-mono text-xs text-tinta outline-none focus:border-tinta/40"
                  />
                </label>
              );
            })}
          </div>

          <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-tinta/40">
            Historial de pagos
          </p>
          {pagos.length === 0 ? (
            <p className="py-2 font-sans text-xs text-tinta/45">
              Sin pagos registrados todavía.
            </p>
          ) : (
            <div className="mt-1">
              {pagos.map((p, i) => (
                <ReceiptRow key={p.id} ultimo={i === pagos.length - 1}>
                  <span className="font-sans text-xs text-tinta/65">{formatoMes(p.mes)}</span>
                  <span className="tabular font-mono text-xs font-semibold text-verde-recibo">
                    {formatoMoneda(p.monto)}
                  </span>
                </ReceiptRow>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Admin() {
  const { datos, registrarPago, actualizarServicios, reiniciarDemo } = useDatos();
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
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
          pagos: [...datos.pagos]
            .filter((p) => p.propiedadId === prop.id)
            .sort((a, b) => b.mes.localeCompare(a.mes)),
          cargosPendientes: datos.cargos.filter(
            (c) => c.propiedadId === prop.id && !c.pagado
          ),
          diasContrato: diasHastaVencimientoContrato(prop.contratoFin),
        }))
        .sort((a, b) => {
          const orden = { mora: 0, pendiente: 1, "al-dia": 2 };
          return orden[a.estado] - orden[b.estado];
        }),
    [datos.propiedades, datos.pagos, datos.cargos]
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
  const totalAvisos = enMora.length + contratosPorVencer.length;

  const botonReiniciar = confirmandoReinicio ? (
    <div className="flex items-center gap-2 font-sans text-xs">
      <span className="text-tinta/55">¿Confirmar?</span>
      <button
        onClick={() => {
          reiniciarDemo();
          setConfirmandoReinicio(false);
        }}
        className="rounded-full bg-tinta px-3 py-1.5 font-semibold text-hueso"
      >
        Sí, reiniciar
      </button>
      <button
        onClick={() => setConfirmandoReinicio(false)}
        className="rounded-full border border-grafito-suave px-3 py-1.5 text-tinta/60"
      >
        Cancelar
      </button>
    </div>
  ) : (
    <button
      onClick={() => setConfirmandoReinicio(true)}
      className="rounded-full border border-grafito-suave px-4 py-2 font-sans text-xs font-medium text-tinta/60 transition hover:border-tinta/25 hover:text-tinta"
    >
      Reiniciar datos de demo
    </button>
  );

  return (
    <div className="flex min-h-svh bg-papel">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-grafito-suave bg-hueso px-5 py-6 lg:flex">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="mt-10 flex flex-col gap-1">
          <a
            href="#propiedades"
            className="flex items-center gap-3 rounded-lg bg-mostaza-suave px-3 py-2.5 font-sans text-sm font-semibold text-tinta"
          >
            <IconCasa className="h-[18px] w-[18px] text-mostaza" />
            Propiedades
          </a>
          <a
            href="#avisos"
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-tinta/60 transition hover:bg-papel"
          >
            <span className="flex items-center gap-3">
              <IconAlertaCirculo className="h-[18px] w-[18px] text-tinta/35" />
              Avisos
            </span>
            {totalAvisos > 0 && (
              <span className="rounded-full bg-mora px-2 py-0.5 font-mono text-[10px] font-semibold text-hueso">
                {totalAvisos}
              </span>
            )}
          </a>
        </nav>
        <div className="mt-auto flex flex-col items-start gap-4 pt-8">
          <BackLink />
          {botonReiniciar}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-grafito-suave bg-hueso px-6 py-4 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
          {botonReiniciar}
        </div>

        <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-tinta">
                Panel administrador
              </h1>
              <p className="mt-1.5 font-sans text-sm text-tinta/55">
                Vistazo del mes, un clic para registrar cada pago.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-tinta/40">
              {formatoMes(mes)}
            </span>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatTile
              Icono={IconRecibo}
              tono="verde"
              etiqueta="Cobrado este mes"
              valor={formatoMoneda(cobradoEsteMes)}
            />
            <StatTile
              Icono={IconAlertaCirculo}
              tono="mostaza"
              etiqueta="Falta cobrar este mes"
              valor={formatoMoneda(pendienteDeCobro)}
            />
            <StatTile
              Icono={IconCasa}
              tono="neutro"
              etiqueta="Propiedades"
              valor={String(filas.length)}
              nota={`${alDia} al día`}
            />
          </section>

          {totalAvisos > 0 && (
            <section id="avisos" className="mt-10 scroll-mt-6">
              <h2 className="font-display text-xl font-semibold text-tinta">Avisos</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {enMora.map(({ prop }) => (
                  <div
                    key={prop.id}
                    className="flex items-start gap-3 rounded-xl border border-mora/25 bg-mora-suave/50 px-4 py-3.5"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mora-suave">
                      <IconAlertaCirculo className="h-[18px] w-[18px] text-mora" />
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
                    className="flex items-start gap-3 rounded-xl border border-ambar/25 bg-ambar-suave/40 px-4 py-3.5"
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

          <section id="propiedades" className="mt-10 scroll-mt-6">
            <h2 className="font-display text-xl font-semibold text-tinta">Propiedades</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {filas.map(({ prop, estado, ultimoPago, pagos, cargosPendientes }) => (
                <TarjetaPropiedad
                  key={prop.id}
                  prop={prop}
                  estado={estado}
                  ultimoPago={ultimoPago}
                  pagos={pagos}
                  cargosPendientes={cargosPendientes}
                  expandido={expandidoId === prop.id}
                  onToggleExpandir={() =>
                    setExpandidoId(expandidoId === prop.id ? null : prop.id)
                  }
                  onRegistrarPago={() => registrarPago(prop.id, prop.alquilerMensual)}
                  onActualizarServicios={(tipo, monto) => {
                    const nuevos = prop.servicios.map((s) =>
                      s.tipo === tipo ? { ...s, monto } : s
                    );
                    actualizarServicios(prop.id, nuevos);
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
