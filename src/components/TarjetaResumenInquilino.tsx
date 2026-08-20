import { useState } from "react";
import { InicialesAvatar } from "./InicialesAvatar";
import { ORDEN_SERVICIOS, SERVICIO_INFO } from "../lib/servicioInfo";
import { formatoMes, formatoMoneda, mesActual } from "../lib/utils";
import type { CargoEspecial, Pago, Propiedad } from "../types";

export function TarjetaResumenInquilino({
  prop,
  pagoDelMes,
  cargosPendientes,
  onRegistrarPago,
}: {
  prop: Propiedad;
  pagoDelMes?: Pago;
  cargosPendientes: CargoEspecial[];
  onRegistrarPago: () => void;
}) {
  const [liquidacionEnviada, setLiquidacionEnviada] = useState(false);

  const subtotalServicios = prop.servicios.reduce((acc, s) => acc + s.monto, 0);
  const subtotalCargos = cargosPendientes.reduce((acc, c) => acc + c.monto, 0);
  const totalAAbonar = prop.alquilerMensual + subtotalServicios + subtotalCargos;
  const abonado = pagoDelMes ? pagoDelMes.monto : 0;
  const saldoPendiente = Math.max(0, totalAAbonar - abonado);

  return (
    <div className="rounded-2xl border border-grafito-suave bg-hueso p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <InicialesAvatar nombre={prop.inquilino} className="h-11 w-11 text-sm" />
        <div>
          <p className="font-display text-base font-semibold leading-tight text-tinta">
            {prop.direccion} <span className="font-sans text-sm text-tinta/45">{prop.unidad}</span>
          </p>
          <p className="font-sans text-sm text-tinta/55">{prop.inquilino}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-dashed divide-grafito-suave rounded-xl border border-grafito-suave bg-papel/60">
        <div className="px-3.5 py-2.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta/40">
            Impuestos y servicios
          </p>
          <div className="mt-1.5 space-y-1">
            {ORDEN_SERVICIOS.map((tipo) => {
              const s = prop.servicios.find((x) => x.tipo === tipo);
              if (!s) return null;
              const { etiqueta } = SERVICIO_INFO[tipo];
              return (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="font-sans text-xs text-tinta/60">{etiqueta}</span>
                  <span className="tabular font-mono text-xs text-tinta/70">
                    {formatoMoneda(s.monto)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between border-t border-dashed border-grafito-suave pt-1.5">
            <span className="font-sans text-xs font-semibold text-tinta/60">
              Subtotal impuestos
            </span>
            <span className="tabular font-mono text-xs font-semibold text-tinta">
              {formatoMoneda(subtotalServicios)}
            </span>
          </div>
        </div>

        {cargosPendientes.length > 0 && (
          <div className="px-3.5 py-2.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-ambar">
                Cargos especiales pendientes
              </span>
              <span className="tabular font-mono text-xs font-semibold text-ambar">
                {formatoMoneda(subtotalCargos)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-3.5 py-2.5">
          <span className="font-sans text-xs text-tinta/60">Alquiler</span>
          <span className="tabular font-mono text-xs text-tinta/70">
            {formatoMoneda(prop.alquilerMensual)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-tinta/[0.04] px-3.5 py-3">
          <span className="font-sans text-sm font-semibold text-tinta">Total a abonar</span>
          <span className="tabular font-mono text-base font-semibold text-tinta">
            {formatoMoneda(totalAAbonar)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-sans text-xs text-tinta/50">
          Abonado este mes: {formatoMoneda(abonado)}
        </span>
        {saldoPendiente === 0 ? (
          <span className="rounded-full bg-verde-recibo-suave px-3 py-1 font-sans text-xs font-semibold text-verde-recibo">
            Saldo $0
          </span>
        ) : (
          <span className="rounded-full bg-mora-suave px-3 py-1 font-sans text-xs font-semibold text-mora">
            Saldo {formatoMoneda(saldoPendiente)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setLiquidacionEnviada(true)}
          className="rounded-full border border-grafito-suave px-3.5 py-2 font-sans text-xs font-semibold text-tinta/70 transition hover:border-tinta/25 hover:text-tinta"
        >
          Enviar liquidación
        </button>
        {!pagoDelMes && (
          <button
            onClick={onRegistrarPago}
            className="rounded-full bg-mostaza px-3.5 py-2 font-sans text-xs font-semibold text-tinta transition hover:bg-mostaza/85"
          >
            Registrar pago
          </button>
        )}
      </div>
      {liquidacionEnviada && (
        <p className="mt-2.5 font-sans text-xs font-medium text-verde-recibo">
          Liquidación de {formatoMes(mesActual())} enviada a {prop.inquilino.split(" ")[0]}.
        </p>
      )}
    </div>
  );
}
