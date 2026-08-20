import { useState } from "react";
import type { FormEvent } from "react";
import { IconX } from "./icons";
import type { IndiceAjuste, Propiedad } from "../types";

function fechaHoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function fechaEnUnAnioISO(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export type DatosPropiedadForm = Omit<Propiedad, "id" | "pin" | "servicios">;

export function ModalPropiedad({
  propiedad,
  onGuardar,
  onCerrar,
}: {
  propiedad: Propiedad | null;
  onGuardar: (datos: DatosPropiedadForm) => void;
  onCerrar: () => void;
}) {
  const esNueva = propiedad === null;

  const [direccion, setDireccion] = useState(propiedad?.direccion ?? "");
  const [unidad, setUnidad] = useState(propiedad?.unidad ?? "");
  const [inquilino, setInquilino] = useState(propiedad?.inquilino ?? "");
  const [alquilerMensual, setAlquilerMensual] = useState(
    propiedad ? String(propiedad.alquilerMensual) : ""
  );
  const [diaVencimiento, setDiaVencimiento] = useState(
    propiedad ? String(propiedad.diaVencimiento) : "10"
  );
  const [contratoInicio, setContratoInicio] = useState(
    propiedad?.contratoInicio ?? fechaHoyISO()
  );
  const [contratoFin, setContratoFin] = useState(propiedad?.contratoFin ?? fechaEnUnAnioISO());
  const [indice, setIndice] = useState<IndiceAjuste>(propiedad?.indice ?? "ICL");

  const valido = direccion.trim() !== "" && inquilino.trim() !== "" && Number(alquilerMensual) > 0;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!valido) return;
    onGuardar({
      direccion: direccion.trim(),
      unidad: unidad.trim(),
      inquilino: inquilino.trim(),
      alquilerMensual: Number(alquilerMensual),
      diaVencimiento: Math.min(31, Math.max(1, Number(diaVencimiento) || 1)),
      contratoInicio,
      contratoFin,
      indice,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/40 p-4">
      <div className="absolute inset-0" onClick={onCerrar} />
      <form
        onSubmit={enviar}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-hueso p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-tinta">
            {esNueva ? "Nueva propiedad" : "Editar propiedad"}
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-1.5 text-tinta/40 transition hover:bg-papel hover:text-tinta"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Dirección</span>
            <input
              type="text"
              placeholder="Ej. Av. Rivadavia 4521"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Unidad</span>
            <input
              type="text"
              placeholder="Ej. 3B"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Inquilino</span>
            <input
              type="text"
              placeholder="Nombre y apellido"
              value={inquilino}
              onChange={(e) => setInquilino(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Alquiler mensual</span>
            <input
              type="number"
              min={0}
              placeholder="185000"
              value={alquilerMensual}
              onChange={(e) => setAlquilerMensual(e.target.value)}
              className="tabular rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-mono text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Día de vencimiento</span>
            <input
              type="number"
              min={1}
              max={31}
              value={diaVencimiento}
              onChange={(e) => setDiaVencimiento(e.target.value)}
              className="tabular rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-mono text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Contrato desde</span>
            <input
              type="date"
              value={contratoInicio}
              onChange={(e) => setContratoInicio(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-mono text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Contrato hasta</span>
            <input
              type="date"
              value={contratoFin}
              onChange={(e) => setContratoFin(e.target.value)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-mono text-xs text-tinta outline-none focus:border-tinta/40"
            />
          </label>
          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-sans text-[11px] text-tinta/50">Índice de ajuste</span>
            <select
              value={indice}
              onChange={(e) => setIndice(e.target.value as IndiceAjuste)}
              className="rounded-md border border-grafito-suave bg-papel px-2.5 py-2 font-sans text-xs text-tinta outline-none focus:border-tinta/40"
            >
              <option value="ICL">ICL</option>
              <option value="IPC">IPC</option>
            </select>
          </label>
        </div>

        {esNueva && (
          <p className="mt-3 font-sans text-[11px] text-tinta/40">
            Se le va a asignar un PIN de acceso y servicios de ejemplo, editables después desde la
            tarjeta de la propiedad.
          </p>
        )}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="submit"
            disabled={!valido}
            className="rounded-full bg-mostaza px-4 py-2 font-sans text-xs font-semibold text-tinta transition hover:bg-mostaza/85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {esNueva ? "Crear propiedad" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full border border-grafito-suave px-4 py-2 font-sans text-xs font-medium text-tinta/60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
