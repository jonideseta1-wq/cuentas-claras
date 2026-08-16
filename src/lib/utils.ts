import type { EstadoPago, Pago, Propiedad } from "../types";

function parseFechaISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatoMoneda(monto: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatoFecha(iso: string): string {
  return parseFechaISO(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatoMes(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  const nombre = new Date(y, m - 1, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

export function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

export function estadoPropiedad(propiedad: Propiedad, pagos: Pago[]): EstadoPago {
  const mes = mesActual();
  const pagoEsteMes = pagos.some(
    (p) => p.propiedadId === propiedad.id && p.mes === mes
  );
  if (pagoEsteMes) return "al-dia";

  const hoy = new Date();
  if (hoy.getDate() > propiedad.diaVencimiento) return "mora";
  return "pendiente";
}

export function diasHasta(fechaISO: string): number {
  const objetivo = parseFechaISO(fechaISO);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((objetivo.getTime() - hoy.getTime()) / msPorDia);
}

export function diasHastaVencimientoContrato(contratoFin: string): number {
  return diasHasta(contratoFin);
}

// Próxima fecha de vencimiento mensual del alquiler a partir de hoy (para el
// estado "al día", cuando ya no queda nada pendiente este mes).
export function proximoVencimientoMensual(diaVencimiento: number): string {
  const hoy = new Date();
  let anio = hoy.getFullYear();
  let mes = hoy.getMonth();
  if (hoy.getDate() > diaVencimiento) {
    mes += 1;
    if (mes > 11) {
      mes = 0;
      anio += 1;
    }
  }
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const dia = Math.min(diaVencimiento, diasEnMes);
  return `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function descargarTexto(nombreArchivo: string, contenido: string): void {
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

export function mesesRestantesContrato(contratoFin: string): number {
  return Math.max(0, Math.round(diasHastaVencimientoContrato(contratoFin) / 30));
}

export function porcentajeContratoCompletado(
  contratoInicio: string,
  contratoFin: string
): number {
  const inicio = parseFechaISO(contratoInicio).getTime();
  const fin = parseFechaISO(contratoFin).getTime();
  const hoy = Date.now();
  const pct = ((hoy - inicio) / (fin - inicio)) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

// Cadencia de ajuste asumida a fines de la demo: trimestral desde el inicio del contrato.
export const FRECUENCIA_AJUSTE = "Trimestral";

export function proximoAjusteAlquiler(contratoInicio: string): string {
  let fecha = parseFechaISO(contratoInicio);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  while (fecha <= hoy) {
    fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 3, fecha.getDate());
  }
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const ETIQUETA_ESTADO: Record<EstadoPago, string> = {
  "al-dia": "Al día",
  pendiente: "Pendiente",
  mora: "Mora",
};
