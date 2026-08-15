import type { EstadoPago, Pago, Propiedad } from "../types";

export function formatoMoneda(monto: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatoFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
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

export function diasHastaVencimientoContrato(contratoFin: string): number {
  const [y, m, d] = contratoFin.split("-").map(Number);
  const fin = new Date(y, m - 1, d);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((fin.getTime() - hoy.getTime()) / msPorDia);
}

export const ETIQUETA_ESTADO: Record<EstadoPago, string> = {
  "al-dia": "Al día",
  pendiente: "Pendiente",
  mora: "Mora",
};
