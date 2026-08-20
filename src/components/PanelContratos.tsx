import { useState } from "react";
import { InicialesAvatar } from "./InicialesAvatar";
import { Logo } from "./Logo";
import {
  diasHastaVencimientoContrato,
  formatoFecha,
  formatoMoneda,
} from "../lib/utils";
import type { Propiedad } from "../types";

function estiloDias(dias: number): { texto: string; fondo: string; color: string } {
  if (dias <= 15) return { texto: "text-mora", fondo: "bg-mora-suave", color: "text-mora" };
  if (dias <= 60) return { texto: "text-ambar", fondo: "bg-ambar-suave", color: "text-ambar" };
  return {
    texto: "text-verde-recibo",
    fondo: "bg-verde-recibo-suave",
    color: "text-verde-recibo",
  };
}

function ModalContrato({ prop, onCerrar }: { prop: Propiedad; onCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/40 p-4 print:hidden">
      <div className="absolute inset-0" onClick={onCerrar} />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-hueso shadow-xl">
        <div className="imprimible p-8">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-semibold text-tinta">
            Contrato de locación
          </h1>
          <p className="mt-1 font-sans text-xs text-tinta/45">
            Documento de demostración — sin validez legal.
          </p>

          <div className="mt-6 space-y-3 border-t border-dashed border-grafito-suave pt-4">
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Propiedad</span>
              <span className="font-sans text-sm font-semibold text-tinta">
                {prop.direccion} {prop.unidad}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Inquilino</span>
              <span className="font-sans text-sm font-semibold text-tinta">
                {prop.inquilino}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Vigencia</span>
              <span className="font-sans text-sm font-semibold text-tinta">
                {formatoFecha(prop.contratoInicio)} — {formatoFecha(prop.contratoFin)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Alquiler mensual</span>
              <span className="tabular font-mono text-sm font-semibold text-tinta">
                {formatoMoneda(prop.alquilerMensual)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Índice de ajuste</span>
              <span className="font-sans text-sm font-semibold text-tinta">
                {prop.indice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-tinta/55">Día de vencimiento</span>
              <span className="font-sans text-sm font-semibold text-tinta">
                Día {prop.diaVencimiento} de cada mes
              </span>
            </div>
          </div>

          <p className="mt-6 border-t border-dashed border-grafito-suave pt-4 font-sans text-xs leading-relaxed text-tinta/50">
            Las partes acuerdan la locación de la unidad indicada por el plazo y monto detallados,
            con ajustes periódicos según el índice consignado, en los términos de la Ley de
            Alquileres vigente. Documento generado automáticamente por Cuentas Claras a fines
            demostrativos.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-grafito-suave p-4 print:hidden">
          <button
            onClick={onCerrar}
            className="rounded-full border border-grafito-suave px-4 py-2 font-sans text-xs font-medium text-tinta/60"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-mostaza px-4 py-2 font-sans text-xs font-semibold text-tinta transition hover:bg-mostaza/85"
          >
            Imprimir / Ver PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export function PanelContratos({ propiedades }: { propiedades: Propiedad[] }) {
  const [contratoAbierto, setContratoAbierto] = useState<Propiedad | null>(null);

  const filas = propiedades
    .map((prop) => ({ prop, dias: diasHastaVencimientoContrato(prop.contratoFin) }))
    .sort((a, b) => a.dias - b.dias);

  const porVencer = filas.filter((f) => f.dias <= 90).slice(0, 3);

  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold text-tinta">Contratos</h2>

      <div className="mt-5 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-6">
        <div className="overflow-x-auto rounded-2xl border border-grafito-suave bg-hueso">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-grafito-suave bg-papel/60">
                {["Propiedad", "Inquilino", "Vigencia", "Alquiler", "Índice", "Vence en", ""].map(
                  (col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta/45"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-grafito-suave/70">
              {filas.map(({ prop, dias }) => {
                const e = estiloDias(dias);
                return (
                  <tr key={prop.id}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <InicialesAvatar nombre={prop.inquilino} className="h-8 w-8 text-[10px]" />
                        <span className="font-sans text-xs text-tinta/80">
                          {prop.direccion} {prop.unidad}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                      {prop.inquilino}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                      {formatoFecha(prop.contratoInicio)} — {formatoFecha(prop.contratoFin)}
                    </td>
                    <td className="tabular whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-tinta">
                      {formatoMoneda(prop.alquilerMensual)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                      {prop.indice}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${e.fondo} ${e.color}`}>
                        {dias <= 0 ? "Vencido" : `${dias} días`}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => setContratoAbierto(prop)}
                        className="font-sans text-[11px] font-medium text-tinta/50 underline decoration-dotted hover:text-tinta"
                      >
                        Ver PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-grafito-suave bg-hueso p-4 lg:mt-0">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-tinta/40">
            Valor de mercado
          </p>
          <p className="mt-1 font-sans text-[11px] text-tinta/45">
            Estimado de referencia para justificar el próximo ajuste — ejemplo, no es un dato de
            mercado real.
          </p>
          {porVencer.length === 0 ? (
            <p className="mt-3 font-sans text-xs text-tinta/45">
              Ningún contrato vence en los próximos 90 días.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {porVencer.map(({ prop, dias }) => {
                const min = Math.round((prop.alquilerMensual * 1.05) / 1000) * 1000;
                const max = Math.round((prop.alquilerMensual * 1.28) / 1000) * 1000;
                return (
                  <div key={prop.id} className="rounded-xl border border-grafito-suave bg-papel/60 p-3">
                    <p className="font-sans text-xs font-semibold text-tinta/75">
                      {prop.direccion} {prop.unidad}
                    </p>
                    <p className="font-sans text-[11px] text-tinta/45">
                      Vence en {dias <= 0 ? "0" : dias} días
                    </p>
                    <div className="mt-2 flex items-center justify-between font-mono text-xs">
                      <span className="tabular text-tinta/50">
                        Actual {formatoMoneda(prop.alquilerMensual)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono text-xs font-semibold text-mostaza">
                      <span className="tabular">
                        Rango est. {formatoMoneda(min)} – {formatoMoneda(max)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {contratoAbierto && (
        <ModalContrato prop={contratoAbierto} onCerrar={() => setContratoAbierto(null)} />
      )}
    </section>
  );
}
