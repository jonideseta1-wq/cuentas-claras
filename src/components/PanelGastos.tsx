import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { formatoFecha, formatoMoneda } from "../lib/utils";
import {
  IconCasa,
  IconContrato,
  IconDocumento,
  IconGota,
  IconLlama,
  IconRayo,
  IconWifi,
} from "./icons";
import type { Propiedad } from "../types";

type Categoria = "luz" | "gas" | "agua" | "abl" | "expensas" | "internet" | "otro";
type Tipo = "por-propiedad" | "personal" | "compartido";
type FormaPago = "Transferencia" | "Efectivo" | "Débito automático";
type EstadoGasto = "Pagado" | "Pendiente";

interface Gasto {
  id: string;
  concepto: string;
  propiedadId: string | null;
  propiedadEtiqueta: string;
  categoria: Categoria;
  tipo: Tipo;
  monto: number;
  formaPago: FormaPago;
  estado: EstadoGasto;
  fecha: string;
}

const CATEGORIA_INFO: Record<Categoria, { etiqueta: string; Icono: ComponentType<SVGProps<SVGSVGElement>> }> = {
  luz: { etiqueta: "Luz", Icono: IconRayo },
  gas: { etiqueta: "Gas", Icono: IconLlama },
  agua: { etiqueta: "Agua", Icono: IconGota },
  internet: { etiqueta: "Internet", Icono: IconWifi },
  abl: { etiqueta: "ABL", Icono: IconContrato },
  expensas: { etiqueta: "Expensas", Icono: IconCasa },
  otro: { etiqueta: "Otro", Icono: IconDocumento },
};

const TIPO_ETIQUETA: Record<Tipo, string> = {
  "por-propiedad": "Por propiedad",
  personal: "Personal",
  compartido: "Compartido",
};

function gastosIniciales(propiedades: Propiedad[]): Gasto[] {
  const porDireccion = (i: number) =>
    propiedades[i] ? `${propiedades[i].direccion} ${propiedades[i].unidad}` : "—";
  const idDe = (i: number) => propiedades[i]?.id ?? null;

  return [
    {
      id: "g1",
      concepto: "Factura EDESUR agosto",
      propiedadId: idDe(0),
      propiedadEtiqueta: porDireccion(0),
      categoria: "luz",
      tipo: "por-propiedad",
      monto: 15000,
      formaPago: "Débito automático",
      estado: "Pagado",
      fecha: "2026-08-05",
    },
    {
      id: "g2",
      concepto: "Factura Metrogas agosto",
      propiedadId: idDe(1),
      propiedadEtiqueta: porDireccion(1),
      categoria: "gas",
      tipo: "por-propiedad",
      monto: 9000,
      formaPago: "Débito automático",
      estado: "Pendiente",
      fecha: "2026-08-10",
    },
    {
      id: "g3",
      concepto: "AYSA agosto",
      propiedadId: idDe(2),
      propiedadEtiqueta: porDireccion(2),
      categoria: "agua",
      tipo: "por-propiedad",
      monto: 9500,
      formaPago: "Transferencia",
      estado: "Pagado",
      fecha: "2026-08-03",
    },
    {
      id: "g4",
      concepto: "ABL 3er bimestre",
      propiedadId: idDe(3),
      propiedadEtiqueta: porDireccion(3),
      categoria: "abl",
      tipo: "por-propiedad",
      monto: 22000,
      formaPago: "Transferencia",
      estado: "Pendiente",
      fecha: "2026-08-12",
    },
    {
      id: "g5",
      concepto: "Expensas agosto",
      propiedadId: idDe(4),
      propiedadEtiqueta: porDireccion(4),
      categoria: "expensas",
      tipo: "por-propiedad",
      monto: 34000,
      formaPago: "Transferencia",
      estado: "Pagado",
      fecha: "2026-08-01",
    },
    {
      id: "g6",
      concepto: "Internet Fibertel",
      propiedadId: idDe(5),
      propiedadEtiqueta: porDireccion(5),
      categoria: "internet",
      tipo: "por-propiedad",
      monto: 11000,
      formaPago: "Débito automático",
      estado: "Pendiente",
      fecha: "2026-08-08",
    },
    {
      id: "g7",
      concepto: "Honorarios gestoría contable",
      propiedadId: null,
      propiedadEtiqueta: "Todas las propiedades",
      categoria: "otro",
      tipo: "personal",
      monto: 45000,
      formaPago: "Transferencia",
      estado: "Pagado",
      fecha: "2026-08-01",
    },
    {
      id: "g8",
      concepto: "Seguro de responsabilidad civil edificio",
      propiedadId: null,
      propiedadEtiqueta: "Todas las propiedades",
      categoria: "otro",
      tipo: "personal",
      monto: 18000,
      formaPago: "Débito automático",
      estado: "Pagado",
      fecha: "2026-08-01",
    },
    {
      id: "g9",
      concepto: "Reparación de portón eléctrico compartido",
      propiedadId: null,
      propiedadEtiqueta: `${porDireccion(1)} y ${porDireccion(3)}`,
      categoria: "otro",
      tipo: "compartido",
      monto: 26000,
      formaPago: "Efectivo",
      estado: "Pendiente",
      fecha: "2026-08-14",
    },
    {
      id: "g10",
      concepto: "Medidor de gas compartido",
      propiedadId: null,
      propiedadEtiqueta: `${porDireccion(0)} y ${porDireccion(2)}`,
      categoria: "gas",
      tipo: "compartido",
      monto: 13500,
      formaPago: "Transferencia",
      estado: "Pendiente",
      fecha: "2026-08-09",
    },
  ];
}

const FILTROS = ["Todos", "Por propiedad", "Personal", "Compartidos", "Pendientes"] as const;
type Filtro = (typeof FILTROS)[number];

function coincideFiltro(g: Gasto, filtro: Filtro): boolean {
  if (filtro === "Todos") return true;
  if (filtro === "Pendientes") return g.estado === "Pendiente";
  if (filtro === "Por propiedad") return g.tipo === "por-propiedad";
  if (filtro === "Personal") return g.tipo === "personal";
  if (filtro === "Compartidos") return g.tipo === "compartido";
  return true;
}

export function PanelGastos({ propiedades }: { propiedades: Propiedad[] }) {
  const [gastos, setGastos] = useState<Gasto[]>(() => gastosIniciales(propiedades));
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [concepto, setConcepto] = useState("");
  const [propiedadSel, setPropiedadSel] = useState<string>("personal");
  const [categoria, setCategoria] = useState<Categoria>("luz");
  const [monto, setMonto] = useState("");
  const [formaPago, setFormaPago] = useState<FormaPago>("Transferencia");
  const [estado, setEstado] = useState<EstadoGasto>("Pendiente");

  const totalMes = gastos.reduce((acc, g) => acc + g.monto, 0);
  const servicios = gastos
    .filter((g) => ["luz", "gas", "agua", "internet"].includes(g.categoria))
    .reduce((acc, g) => acc + g.monto, 0);
  const pagado = gastos.filter((g) => g.estado === "Pagado").reduce((acc, g) => acc + g.monto, 0);
  const pendiente = gastos
    .filter((g) => g.estado === "Pendiente")
    .reduce((acc, g) => acc + g.monto, 0);
  const itemsPendientes = gastos.filter((g) => g.estado === "Pendiente").length;

  const visibles = gastos.filter((g) => coincideFiltro(g, filtro));

  function limpiarForm() {
    setConcepto("");
    setPropiedadSel("personal");
    setCategoria("luz");
    setMonto("");
    setFormaPago("Transferencia");
    setEstado("Pendiente");
    setEditandoId(null);
    setMostrarForm(false);
  }

  function abrirEdicion(g: Gasto) {
    setConcepto(g.concepto);
    setPropiedadSel(g.propiedadId ?? (g.tipo === "compartido" ? "compartido" : "personal"));
    setCategoria(g.categoria);
    setMonto(String(g.monto));
    setFormaPago(g.formaPago);
    setEstado(g.estado);
    setEditandoId(g.id);
    setMostrarForm(true);
  }

  function guardar() {
    const montoNum = Number(monto);
    if (!concepto.trim() || !montoNum) return;

    const tipo: Tipo =
      propiedadSel === "personal"
        ? "personal"
        : propiedadSel === "compartido"
          ? "compartido"
          : "por-propiedad";
    const prop = propiedades.find((p) => p.id === propiedadSel);
    const propiedadEtiqueta =
      tipo === "personal" ? "Sin propiedad" : tipo === "compartido" ? "Varias propiedades" : `${prop?.direccion} ${prop?.unidad}`;

    if (editandoId) {
      setGastos((prev) =>
        prev.map((g) =>
          g.id === editandoId
            ? {
                ...g,
                concepto: concepto.trim(),
                propiedadId: tipo === "por-propiedad" ? propiedadSel : null,
                propiedadEtiqueta,
                categoria,
                tipo,
                monto: montoNum,
                formaPago,
                estado,
              }
            : g
        )
      );
    } else {
      const nuevo: Gasto = {
        id: `g-${Date.now()}`,
        concepto: concepto.trim(),
        propiedadId: tipo === "por-propiedad" ? propiedadSel : null,
        propiedadEtiqueta,
        categoria,
        tipo,
        monto: montoNum,
        formaPago,
        estado,
        fecha: new Date().toISOString().slice(0, 10),
      };
      setGastos((prev) => [nuevo, ...prev]);
    }
    limpiarForm();
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-tinta">Gastos e impuestos</h2>
        <button
          onClick={() => {
            limpiarForm();
            setMostrarForm(true);
          }}
          className="rounded-full bg-mostaza px-4 py-2 font-sans text-xs font-semibold text-tinta transition hover:bg-mostaza/85"
        >
          Nuevo gasto
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-grafito-suave bg-hueso p-3.5">
          <p className="font-sans text-[11px] text-tinta/45">Total del mes</p>
          <p className="tabular mt-0.5 font-mono text-base font-semibold text-tinta">
            {formatoMoneda(totalMes)}
          </p>
        </div>
        <div className="rounded-xl border border-grafito-suave bg-hueso p-3.5">
          <p className="font-sans text-[11px] text-tinta/45">Servicios</p>
          <p className="tabular mt-0.5 font-mono text-base font-semibold text-tinta">
            {formatoMoneda(servicios)}
          </p>
        </div>
        <div className="rounded-xl border border-grafito-suave bg-hueso p-3.5">
          <p className="font-sans text-[11px] text-tinta/45">Pagado</p>
          <p className="tabular mt-0.5 font-mono text-base font-semibold text-verde-recibo">
            {formatoMoneda(pagado)}
          </p>
        </div>
        <div className="rounded-xl border border-grafito-suave bg-hueso p-3.5">
          <p className="font-sans text-[11px] text-tinta/45">Pendiente</p>
          <p className="tabular mt-0.5 font-mono text-base font-semibold text-ambar">
            {formatoMoneda(pendiente)}
          </p>
        </div>
        <div className="rounded-xl border border-grafito-suave bg-hueso p-3.5">
          <p className="font-sans text-[11px] text-tinta/45">Items pendientes</p>
          <p className="tabular mt-0.5 font-mono text-base font-semibold text-tinta">
            {itemsPendientes}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold transition ${
              filtro === f
                ? "bg-tinta text-hueso"
                : "border border-grafito-suave text-tinta/60 hover:border-tinta/25"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {mostrarForm && (
        <div className="mt-4 rounded-2xl border border-grafito-suave bg-hueso p-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-tinta/40">
            {editandoId ? "Editar gasto" : "Nuevo gasto"}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Concepto (ej. Factura EDESUR)"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40 sm:col-span-2"
            />
            <input
              type="number"
              min={0}
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="tabular rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-mono text-xs text-tinta outline-none focus:border-tinta/40"
            />
            <select
              value={propiedadSel}
              onChange={(e) => setPropiedadSel(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            >
              <option value="personal">Personal (sin propiedad)</option>
              <option value="compartido">Compartido (varias propiedades)</option>
              {propiedades.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.direccion} {p.unidad}
                </option>
              ))}
            </select>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            >
              {Object.entries(CATEGORIA_INFO).map(([valor, info]) => (
                <option key={valor} value={valor}>
                  {info.etiqueta}
                </option>
              ))}
            </select>
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value as FormaPago)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            >
              <option>Transferencia</option>
              <option>Efectivo</option>
              <option>Débito automático</option>
            </select>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoGasto)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            >
              <option>Pendiente</option>
              <option>Pagado</option>
            </select>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={guardar}
              className="rounded-full bg-tinta px-4 py-2 font-sans text-xs font-semibold text-hueso transition hover:bg-tinta-suave"
            >
              {editandoId ? "Guardar cambios" : "Agregar gasto"}
            </button>
            <button
              onClick={limpiarForm}
              className="rounded-full border border-grafito-suave px-4 py-2 font-sans text-xs font-medium text-tinta/60"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-grafito-suave bg-hueso">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-grafito-suave bg-papel/60">
              {["Concepto", "Propiedad", "Categoría", "Tipo", "Monto", "Forma de pago", "Estado", "Acciones"].map(
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
            {visibles.map((g) => {
              const { etiqueta: catEtiqueta, Icono } = CATEGORIA_INFO[g.categoria];
              return (
                <tr key={g.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/80">
                    {g.concepto}
                    <p className="font-sans text-[10px] text-tinta/40">{formatoFecha(g.fecha)}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                    {g.propiedadEtiqueta}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-1.5 font-sans text-xs text-tinta/60">
                      <Icono className="h-3.5 w-3.5 text-tinta/40" />
                      {catEtiqueta}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                    {TIPO_ETIQUETA[g.tipo]}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-tinta">
                    {formatoMoneda(g.monto)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-sans text-xs text-tinta/60">
                    {g.formaPago}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold ${
                        g.estado === "Pagado"
                          ? "bg-verde-recibo-suave text-verde-recibo"
                          : "bg-ambar-suave text-ambar"
                      }`}
                    >
                      {g.estado}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirEdicion(g)}
                        className="font-sans text-[11px] font-medium text-tinta/50 underline decoration-dotted hover:text-tinta"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setGastos((prev) => prev.filter((x) => x.id !== g.id))}
                        className="font-sans text-[11px] font-medium text-mora/70 underline decoration-dotted hover:text-mora"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibles.length === 0 && (
          <p className="px-4 py-6 text-center font-sans text-xs text-tinta/45">
            No hay gastos para este filtro.
          </p>
        )}
      </div>
    </section>
  );
}
