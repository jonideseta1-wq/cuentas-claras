export type EstadoPago = "al-dia" | "pendiente" | "mora";

export interface Propiedad {
  id: string;
  direccion: string;
  unidad: string;
  inquilino: string;
  pin: string;
  alquilerMensual: number;
  diaVencimiento: number; // día del mes en que vence el pago
  contratoInicio: string; // ISO date
  contratoFin: string; // ISO date
}

export interface Pago {
  id: string;
  propiedadId: string;
  mes: string; // "2026-08"
  monto: number;
  fecha: string; // ISO date
}

export interface CargoEspecial {
  id: string;
  propiedadId: string;
  descripcion: string;
  monto: number;
  pagado: boolean;
  fecha: string; // ISO date
}

export interface DatosApp {
  propiedades: Propiedad[];
  pagos: Pago[];
  cargos: CargoEspecial[];
}
