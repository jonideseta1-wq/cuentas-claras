import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Card } from "../components/Card";
import { StampBadge } from "../components/StampBadge";
import { ReceiptRow } from "../components/ReceiptRow";
import { useDatos } from "../state/DataContext";
import {
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
} from "../lib/utils";

function PinInput({
  valor,
  onCambio,
  onCompleto,
}: {
  valor: string;
  onCambio: (v: string) => void;
  onCompleto: (v: string) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digitos = valor.padEnd(4, " ").split("").slice(0, 4);

  function actualizar(i: number, char: string) {
    const limpio = char.replace(/[^0-9]/g, "");
    const arr = valor.split("");
    arr[i] = limpio;
    const nuevo = arr.join("").slice(0, 4);
    onCambio(nuevo);
    if (limpio && i < 3) refs.current[i + 1]?.focus();
    if (nuevo.length === 4 && !nuevo.includes(" ")) onCompleto(nuevo);
  }

  function tecla(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !digitos[i].trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-3">
      {digitos.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d.trim()}
          onChange={(e) => actualizar(i, e.target.value)}
          onKeyDown={(e) => tecla(e, i)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Dígito ${i + 1} del PIN`}
          className="h-16 w-14 rounded-xl border-2 border-tinta/15 bg-hueso text-center font-mono text-2xl font-semibold text-tinta shadow-inner outline-none focus:border-sello"
        />
      ))}
    </div>
  );
}

export function Portal() {
  const { datos } = useDatos();
  const [pin, setPin] = useState("");
  const [propiedadId, setPropiedadId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  function intentarIngresar(codigo: string) {
    const encontrada = datos.propiedades.find((p) => p.pin === codigo);
    if (encontrada) {
      setPropiedadId(encontrada.id);
      setError(false);
    } else {
      setError(true);
    }
  }

  const propiedad = datos.propiedades.find((p) => p.id === propiedadId) ?? null;

  const pagos = useMemo(
    () =>
      propiedad
        ? [...datos.pagos]
            .filter((p) => p.propiedadId === propiedad.id)
            .sort((a, b) => b.mes.localeCompare(a.mes))
        : [],
    [datos.pagos, propiedad]
  );

  const cargos = useMemo(
    () =>
      propiedad
        ? datos.cargos
            .filter((c) => c.propiedadId === propiedad.id)
            .sort((a, b) => Number(a.pagado) - Number(b.pagado))
        : [],
    [datos.cargos, propiedad]
  );

  if (!propiedad) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-6">
        <Link to="/" className="mb-10">
          <Logo />
        </Link>
        <Card className="w-full max-w-sm p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
            Portal del inquilino
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-tinta">
            Ingresá tu PIN
          </h1>
          <p className="mt-2 font-sans text-sm text-tinta/60">
            Los 4 dígitos que te dio tu administrador.
          </p>
          <div className="mt-6">
            <PinInput valor={pin} onCambio={setPin} onCompleto={intentarIngresar} />
          </div>
          {error && (
            <p className="mt-4 font-sans text-sm font-medium text-sello">
              Ese PIN no corresponde a ninguna propiedad. Probá de nuevo.
            </p>
          )}
        </Card>
        <details className="mt-8 max-w-sm font-sans text-xs text-tinta/45">
          <summary className="cursor-pointer select-none text-center">
            ¿Estás evaluando la demo? Ver PINs de prueba
          </summary>
          <ul className="mt-3 space-y-1 rounded-lg border border-grafito-suave/70 bg-hueso p-3 tabular font-mono">
            {datos.propiedades.map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span className="text-tinta/70">{p.inquilino}</span>
                <span className="font-semibold text-tinta">{p.pin}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    );
  }

  const estado = estadoPropiedad(propiedad, datos.pagos);
  const cargosPendientes = cargos.filter((c) => !c.pagado);

  return (
    <div className="min-h-svh pb-20">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-7 sm:px-10">
        <Link to="/">
          <Logo />
        </Link>
        <button
          onClick={() => {
            setPropiedadId(null);
            setPin("");
          }}
          className="rounded-full border border-tinta/15 px-4 py-2 font-sans text-xs font-medium text-tinta/60 transition hover:border-tinta/30 hover:text-tinta"
        >
          Salir
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-6 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Hola, {propiedad.inquilino.split(" ")[0]}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-tinta sm:text-4xl">
              {propiedad.direccion}{" "}
              <span className="text-tinta/40">{propiedad.unidad}</span>
            </h1>
          </div>
          <StampBadge estado={estado} className="mt-1" />
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Alquiler mensual
            </p>
            <p className="mt-2 tabular font-display text-3xl font-semibold text-tinta">
              {formatoMoneda(propiedad.alquilerMensual)}
            </p>
            <p className="mt-1 font-sans text-sm text-tinta/50">
              Vence el día {propiedad.diaVencimiento} de cada mes
            </p>
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafito">
              Contrato
            </p>
            <p className="mt-2 font-sans text-sm text-tinta/80">
              {formatoFecha(propiedad.contratoInicio)} —{" "}
              {formatoFecha(propiedad.contratoFin)}
            </p>
          </Card>
        </section>

        {cargosPendientes.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-tinta">
              Cargos especiales pendientes
            </h2>
            <Card className="mt-4 divide-y divide-dashed divide-grafito-suave">
              {cargosPendientes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-sans text-sm font-medium text-tinta">
                      {c.descripcion}
                    </p>
                    <p className="font-sans text-xs text-tinta/50">
                      {formatoFecha(c.fecha)}
                    </p>
                  </div>
                  <span className="tabular font-mono text-base font-semibold text-ambar">
                    {formatoMoneda(c.monto)}
                  </span>
                </div>
              ))}
            </Card>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-tinta">
            Historial de pagos
          </h2>
          <Card className="mt-4 p-5 sm:p-6">
            {pagos.length === 0 ? (
              <p className="py-4 text-center font-sans text-sm text-tinta/50">
                Todavía no hay pagos registrados.
              </p>
            ) : (
              pagos.map((p, i) => (
                <ReceiptRow key={p.id} ultimo={i === pagos.length - 1}>
                  <span className="font-sans text-sm text-tinta/80">
                    {formatoMes(p.mes)}
                  </span>
                  <span className="font-sans text-xs text-tinta/45">
                    {formatoFecha(p.fecha)}
                  </span>
                  <span className="tabular font-mono text-sm font-semibold text-verde-recibo">
                    {formatoMoneda(p.monto)}
                  </span>
                </ReceiptRow>
              ))
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}
