import type { DatosApp } from "../types";

// Todos los nombres, direcciones y montos son ficticios — solo para la demo.
export const PROPIETARIO = "Julián Ferreyra";

export const DATOS_INICIALES: DatosApp = {
  propiedades: [
    {
      id: "p1",
      direccion: "Av. Rivadavia 4521",
      unidad: "3B",
      inquilino: "Marina Sosa",
      pin: "4521",
      alquilerMensual: 185000,
      diaVencimiento: 10,
      contratoInicio: "2025-04-01",
      contratoFin: "2027-03-31",
      servicios: [
        { tipo: "agua", monto: 9000 },
        { tipo: "luz", monto: 15000 },
        { tipo: "gas", monto: 7000 },
        { tipo: "internet", monto: 12000 },
      ],
    },
    {
      id: "p2",
      direccion: "Calle Mitre 812",
      unidad: "PB",
      inquilino: "Gonzalo Peralta",
      pin: "0812",
      alquilerMensual: 210000,
      diaVencimiento: 5,
      contratoInicio: "2024-10-01",
      contratoFin: "2026-09-30",
      servicios: [
        { tipo: "agua", monto: 8500 },
        { tipo: "luz", monto: 18000 },
        { tipo: "gas", monto: 9000 },
        { tipo: "internet", monto: 11000 },
      ],
    },
    {
      id: "p3",
      direccion: "Bv. Oroño 1450",
      unidad: "1A",
      inquilino: "Julieta Fernández",
      pin: "1450",
      alquilerMensual: 165000,
      diaVencimiento: 27,
      contratoInicio: "2025-02-01",
      contratoFin: "2027-01-31",
      servicios: [
        { tipo: "agua", monto: 9500 },
        { tipo: "luz", monto: 16000 },
        { tipo: "gas", monto: 8000 },
        { tipo: "internet", monto: 12000 },
      ],
    },
    {
      id: "p4",
      direccion: "Pasaje San Lorenzo 233",
      unidad: "2",
      inquilino: "Ezequiel Duarte",
      pin: "0233",
      alquilerMensual: 150000,
      diaVencimiento: 10,
      contratoInicio: "2024-11-01",
      contratoFin: "2026-10-05",
      servicios: [
        { tipo: "agua", monto: 7000 },
        { tipo: "luz", monto: 13000 },
        { tipo: "gas", monto: 6500 },
        { tipo: "internet", monto: 10000 },
      ],
    },
    {
      id: "p5",
      direccion: "Av. Pellegrini 2290",
      unidad: "5C",
      inquilino: "Camila Ríos",
      pin: "2290",
      alquilerMensual: 195000,
      diaVencimiento: 1,
      contratoInicio: "2025-09-01",
      contratoFin: "2026-08-31",
      servicios: [
        { tipo: "agua", monto: 10000 },
        { tipo: "luz", monto: 19000 },
        { tipo: "gas", monto: 8500 },
        { tipo: "internet", monto: 13000 },
      ],
    },
    {
      id: "p6",
      direccion: "Calle Corrientes 1789",
      unidad: "4D",
      inquilino: "Nicolás Franco",
      pin: "1789",
      alquilerMensual: 175000,
      diaVencimiento: 29,
      contratoInicio: "2025-06-01",
      contratoFin: "2027-05-31",
      servicios: [
        { tipo: "agua", monto: 8000 },
        { tipo: "luz", monto: 14000 },
        { tipo: "gas", monto: 7500 },
        { tipo: "internet", monto: 11000 },
      ],
    },
  ],
  pagos: [
    // Marina Sosa — al día, paga puntual
    { id: "pg1", propiedadId: "p1", mes: "2026-06", monto: 185000, fecha: "2026-06-09" },
    { id: "pg2", propiedadId: "p1", mes: "2026-07", monto: 185000, fecha: "2026-07-10" },
    { id: "pg3", propiedadId: "p1", mes: "2026-08", monto: 185000, fecha: "2026-08-08" },

    // Gonzalo Peralta — en mora este mes
    { id: "pg4", propiedadId: "p2", mes: "2026-06", monto: 210000, fecha: "2026-06-06" },
    { id: "pg5", propiedadId: "p2", mes: "2026-07", monto: 210000, fecha: "2026-07-07" },

    // Julieta Fernández — pendiente, todavía no vence
    { id: "pg6", propiedadId: "p3", mes: "2026-06", monto: 165000, fecha: "2026-06-26" },
    { id: "pg7", propiedadId: "p3", mes: "2026-07", monto: 165000, fecha: "2026-07-27" },

    // Ezequiel Duarte — al día
    { id: "pg8", propiedadId: "p4", mes: "2026-06", monto: 150000, fecha: "2026-06-10" },
    { id: "pg9", propiedadId: "p4", mes: "2026-07", monto: 150000, fecha: "2026-07-09" },
    { id: "pg10", propiedadId: "p4", mes: "2026-08", monto: 150000, fecha: "2026-08-09" },

    // Camila Ríos — al día, contrato por vencer
    { id: "pg11", propiedadId: "p5", mes: "2026-06", monto: 195000, fecha: "2026-06-01" },
    { id: "pg12", propiedadId: "p5", mes: "2026-07", monto: 195000, fecha: "2026-07-01" },
    { id: "pg13", propiedadId: "p5", mes: "2026-08", monto: 195000, fecha: "2026-08-01" },

    // Nicolás Franco — pendiente, todavía no vence
    { id: "pg14", propiedadId: "p6", mes: "2026-06", monto: 175000, fecha: "2026-06-28" },
    { id: "pg15", propiedadId: "p6", mes: "2026-07", monto: 175000, fecha: "2026-07-29" },
  ],
  cargos: [
    {
      id: "c1",
      propiedadId: "p2",
      descripcion: "Reparación de termotanque",
      monto: 45000,
      pagado: false,
      fecha: "2026-08-03",
    },
    {
      id: "c2",
      propiedadId: "p3",
      descripcion: "Expensas extraordinarias — pintura de fachada",
      monto: 18000,
      pagado: false,
      fecha: "2026-08-05",
    },
  ],
};
