import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Logo } from "../components/Logo";
import { BackLink } from "../components/BackLink";
import { Card } from "../components/Card";
import { StatusPill } from "../components/StatusPill";
import { StatTile } from "../components/StatTile";
import { ContratoProgreso } from "../components/ContratoProgreso";
import { ReceiptRow } from "../components/ReceiptRow";
import { IlustracionPropiedad } from "../components/IlustracionPropiedad";
import { NavInferior } from "../components/NavInferior";
import type { VistaPortal } from "../components/NavInferior";
import { useDatos } from "../state/DataContext";
import {
  diasHastaVencimientoContrato,
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
  FRECUENCIA_AJUSTE,
  mesesRestantesContrato,
  proximoAjusteAlquiler,
} from "../lib/utils";
import {
  IconAlertaCirculo,
  IconCalendario,
  IconCasa,
  IconCheckCirculo,
  IconContrato,
  IconDocumento,
  IconLlave,
  IconRecibo,
  IconRelojCirculo,
  IconTendencia,
} from "../components/icons";

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
          className="h-16 w-14 rounded-xl border-2 border-tinta/15 bg-hueso text-center font-mono text-2xl font-semibold text-tinta shadow-inner outline-none focus:border-tinta"
        />
      ))}
    </div>
  );
}

function PiePagina() {
  return (
    <p className="mt-14 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-tinta/35">
      Powered by Cuentas Claras
    </p>
  );
}

function TarjetaFlotante({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-grafito-suave/60 bg-hueso p-5 shadow-[0_20px_40px_-24px_rgba(20,43,61,0.35)] sm:p-6">
      {children}
    </div>
  );
}

export function Portal() {
  const { datos } = useDatos();
  const [pin, setPin] = useState("");
  const [propiedadId, setPropiedadId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [vista, setVista] = useState<VistaPortal>("inicio");

  function intentarIngresar(codigo: string) {
    const encontrada = datos.propiedades.find((p) => p.pin === codigo);
    if (encontrada) {
      setPropiedadId(encontrada.id);
      setError(false);
    } else {
      setError(true);
    }
  }

  function salir() {
    setPropiedadId(null);
    setPin("");
    setVista("inicio");
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
        <div className="mb-10 flex flex-col items-center gap-2">
          <BackLink />
          <Logo />
        </div>
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
            <p className="mt-4 font-sans text-sm font-medium text-mora">
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
        <PiePagina />
      </div>
    );
  }

  const estado = estadoPropiedad(propiedad, datos.pagos);
  const cargosPendientes = cargos.filter((c) => !c.pagado);
  const subtotalPendiente = cargosPendientes.reduce((acc, c) => acc + c.monto, 0);
  const diasContrato = diasHastaVencimientoContrato(propiedad.contratoFin);

  const avisos: Array<{
    id: string;
    Icono: typeof IconAlertaCirculo;
    tono: "mora" | "ambar";
    texto: string;
  }> = [];
  if (estado === "mora") {
    avisos.push({
      id: "mora",
      Icono: IconAlertaCirculo,
      tono: "mora",
      texto: "Todavía no registramos el pago del alquiler de este mes.",
    });
  }
  cargosPendientes.forEach((c) => {
    avisos.push({
      id: c.id,
      Icono: IconRelojCirculo,
      tono: "ambar",
      texto: `Cargo pendiente: ${c.descripcion} — ${formatoMoneda(c.monto)}.`,
    });
  });
  if (diasContrato <= 60) {
    avisos.push({
      id: "contrato",
      Icono: IconCalendario,
      tono: "ambar",
      texto: `Tu contrato vence el ${formatoFecha(propiedad.contratoFin)}.`,
    });
  }
  const hayAvisos = avisos.length > 0;

  return (
    <div className="min-h-svh">
      <div className="bg-tinta px-6 pb-24 pt-7 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <BackLink tono="oscuro" />
          <button
            onClick={salir}
            className="rounded-full border border-hueso/25 px-4 py-2 font-sans text-xs font-medium text-hueso/90 transition hover:bg-hueso/10"
          >
            Salir
          </button>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <Logo tono="oscuro" />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <IlustracionPropiedad
                seed={propiedad.id}
                className="h-16 w-16 shrink-0 rounded-2xl"
              />
              <div>
                <h1 className="font-display text-3xl font-semibold text-hueso sm:text-4xl">
                  Hola, {propiedad.inquilino.split(" ")[0]}
                </h1>
                <p className="mt-1.5 font-sans text-sm text-hueso/60">
                  {propiedad.direccion} {propiedad.unidad}
                </p>
              </div>
            </div>
            <StatusPill estado={estado} />
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto -mt-16 max-w-3xl px-6 pb-28 sm:px-10">
        {vista === "inicio" && (
          <>
            <TarjetaFlotante>
              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  Icono={IconCalendario}
                  tono="mostaza"
                  etiqueta="Próximo ajuste"
                  valor={formatoFecha(proximoAjusteAlquiler(propiedad.contratoInicio))}
                />
                <StatTile
                  Icono={IconContrato}
                  tono="tinta"
                  etiqueta="Contrato"
                  valor={`${mesesRestantesContrato(propiedad.contratoFin)} meses`}
                  nota="restantes"
                />
                <StatTile
                  Icono={IconRecibo}
                  tono="verde"
                  etiqueta="Pagos registrados"
                  valor={String(pagos.length)}
                />
                <StatTile
                  Icono={IconTendencia}
                  tono="lila"
                  etiqueta="Frecuencia de ajuste"
                  valor={FRECUENCIA_AJUSTE}
                />
              </div>
            </TarjetaFlotante>

            <section className="mt-8">
              <Card className="p-6">
                <ContratoProgreso
                  contratoInicio={propiedad.contratoInicio}
                  contratoFin={propiedad.contratoFin}
                />
              </Card>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold text-tinta">
                Detalle de tu cuenta
              </h2>
              <Card className="mt-4 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-grafito-suave/70 bg-papel/60 px-5 py-2.5">
                  <IconCasa className="h-4 w-4 text-tinta/50" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-tinta/50">
                    Alquiler
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="font-sans text-sm text-tinta/80">
                    Alquiler mensual
                  </span>
                  <span className="tabular font-mono text-base font-semibold text-tinta">
                    {formatoMoneda(propiedad.alquilerMensual)}
                  </span>
                </div>

                {cargos.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 border-y border-grafito-suave/70 bg-papel/60 px-5 py-2.5">
                      <IconLlave className="h-4 w-4 text-tinta/50" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-tinta/50">
                        Cargos especiales
                      </span>
                    </div>
                    <div className="divide-y divide-dashed divide-grafito-suave">
                      {cargos.map((c) => (
                        <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
                          <div>
                            <p className="font-sans text-sm text-tinta/80">{c.descripcion}</p>
                            <p className="mt-0.5 font-sans text-xs text-tinta/45">
                              {formatoFecha(c.fecha)} ·{" "}
                              {c.pagado ? (
                                <span className="text-verde-recibo">Pagado</span>
                              ) : (
                                <span className="text-ambar">Pendiente</span>
                              )}
                            </p>
                          </div>
                          <span
                            className={`tabular font-mono text-sm font-semibold ${
                              c.pagado ? "text-tinta/40 line-through" : "text-ambar"
                            }`}
                          >
                            {formatoMoneda(c.monto)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {subtotalPendiente > 0 && (
                      <div className="flex items-center justify-between bg-ambar-suave/30 px-5 py-3">
                        <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ambar">
                          Subtotal pendiente
                        </span>
                        <span className="tabular font-mono text-sm font-semibold text-ambar">
                          {formatoMoneda(subtotalPendiente)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </section>

            <section className="mt-8">
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
          </>
        )}

        {vista === "avisos" && (
          <TarjetaFlotante>
            <h2 className="font-display text-xl font-semibold text-tinta">Avisos</h2>
            {hayAvisos ? (
              <div className="mt-4 space-y-3">
                {avisos.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${
                      a.tono === "mora"
                        ? "border-mora/25 bg-mora-suave/60"
                        : "border-ambar/25 bg-ambar-suave/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        a.tono === "mora" ? "bg-mora-suave" : "bg-ambar-suave"
                      }`}
                    >
                      <a.Icono
                        className={`h-[18px] w-[18px] ${
                          a.tono === "mora" ? "text-mora" : "text-ambar"
                        }`}
                      />
                    </span>
                    <p className="font-sans text-sm text-tinta/80">{a.texto}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
                <IconCheckCirculo className="h-8 w-8 text-verde-recibo" />
                <p className="font-sans text-sm text-tinta/60">
                  Estás al día. No tenés avisos pendientes.
                </p>
              </div>
            )}
          </TarjetaFlotante>
        )}

        {vista === "documentos" && (
          <TarjetaFlotante>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tinta/[0.08]">
                <IconDocumento className="h-6 w-6 text-tinta/60" />
              </span>
              <p className="font-sans text-sm font-medium text-tinta/70">
                Todavía no hay documentos cargados.
              </p>
              <p className="max-w-xs font-sans text-xs text-tinta/45">
                Próximamente vas a poder ver acá tu contrato firmado y los
                comprobantes de pago.
              </p>
            </div>
          </TarjetaFlotante>
        )}

        {vista === "perfil" && (
          <TarjetaFlotante>
            <h2 className="font-display text-xl font-semibold text-tinta">Tu perfil</h2>
            <div className="mt-5 divide-y divide-dashed divide-grafito-suave">
              <ReceiptRow>
                <span className="font-sans text-sm text-tinta/60">Inquilino</span>
                <span className="font-sans text-sm font-semibold text-tinta">
                  {propiedad.inquilino}
                </span>
              </ReceiptRow>
              <ReceiptRow>
                <span className="font-sans text-sm text-tinta/60">Propiedad</span>
                <span className="font-sans text-sm font-semibold text-tinta">
                  {propiedad.direccion} {propiedad.unidad}
                </span>
              </ReceiptRow>
              <ReceiptRow>
                <span className="font-sans text-sm text-tinta/60">Contrato</span>
                <span className="font-sans text-sm font-semibold text-tinta">
                  {formatoFecha(propiedad.contratoInicio)} — {formatoFecha(propiedad.contratoFin)}
                </span>
              </ReceiptRow>
              <ReceiptRow ultimo>
                <span className="font-sans text-sm text-tinta/60">PIN de acceso</span>
                <span className="tabular font-mono text-sm font-semibold text-tinta">
                  {propiedad.pin}
                </span>
              </ReceiptRow>
            </div>
            <button
              onClick={salir}
              className="mt-6 w-full rounded-full border border-tinta/20 py-2.5 font-sans text-sm font-semibold text-tinta transition hover:bg-tinta/[0.04]"
            >
              Salir
            </button>
          </TarjetaFlotante>
        )}

        <PiePagina />
      </main>

      <NavInferior vista={vista} onCambiar={setVista} hayAvisos={hayAvisos} />
    </div>
  );
}
