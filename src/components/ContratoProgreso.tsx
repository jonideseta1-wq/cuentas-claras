import { formatoFecha, mesesRestantesContrato, porcentajeContratoCompletado } from "../lib/utils";

export function ContratoProgreso({
  contratoInicio,
  contratoFin,
}: {
  contratoInicio: string;
  contratoFin: string;
}) {
  const pct = porcentajeContratoCompletado(contratoInicio, contratoFin);
  const meses = mesesRestantesContrato(contratoFin);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-sans text-sm font-medium text-tinta/70">
          Contrato en curso
        </p>
        <p className="font-mono text-sm font-semibold text-sello-oscuro">
          {pct}% completado
        </p>
      </div>
      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-grafito-suave/50">
        <div
          className="h-full rounded-full bg-sello-oscuro transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between font-sans text-xs text-tinta/50">
        <span>Inicio: {formatoFecha(contratoInicio)}</span>
        <span>{meses === 0 ? "Vence este mes" : `${meses} meses restantes`}</span>
        <span>Fin: {formatoFecha(contratoFin)}</span>
      </div>
    </div>
  );
}
