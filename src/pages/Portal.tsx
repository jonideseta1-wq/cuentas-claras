import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { Logo } from "../components/Logo";
import { BackLink } from "../components/BackLink";
import { Card } from "../components/Card";
import { StatusPill } from "../components/StatusPill";
import { StatTile } from "../components/StatTile";
import { ContratoProgreso } from "../components/ContratoProgreso";
import { ReceiptRow } from "../components/ReceiptRow";
import { InicialesAvatar } from "../components/InicialesAvatar";
import { NavInferior } from "../components/NavInferior";
import type { VistaPortal } from "../components/NavInferior";
import { useDatos } from "../state/DataContext";
import {
  descargarTexto,
  diasHasta,
  estadoPropiedad,
  formatoFecha,
  formatoMes,
  formatoMoneda,
  FRECUENCIA_AJUSTE,
  proximoAjusteAlquiler,
  proximoVencimientoMensual,
} from "../lib/utils";
import {
  IconAlertaCirculo,
  IconCalendario,
  IconCasa,
  IconCheckCirculo,
  IconDocumento,
  IconLlave,
  IconPerfil,
  IconRayo,
  IconRecibo,
  IconRelojCirculo,
  IconTendencia,
} from "../components/icons";
import { SERVICIO_INFO } from "../lib/servicioInfo";
import type { Pago, Propiedad } from "../types";

function generarRecibo(propiedad: Propiedad, pago: Pago): string {
  return [
    "CUENTAS CLARAS — Recibo de pago",
    "================================",
    `Inquilino: ${propiedad.inquilino}`,
    `Propiedad: ${propiedad.direccion} ${propiedad.unidad}`,
    `Período: ${formatoMes(pago.mes)}`,
    `Fecha de pago: ${formatoFecha(pago.fecha)}`,
    `Monto: ${formatoMoneda(pago.monto)}`,
    "",
    "Comprobante generado automáticamente por Cuentas Claras (demo).",
  ].join("\n");
}

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
  const { datos, registrarPago, marcarCargoPagado } = useDatos();
  const [pin, setPin] = useState("");
  const [propiedadId, setPropiedadId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [vista, setVista] = useState<VistaPortal>("inicio");
  const [comprobante, setComprobante] = useState<string | null>(null);
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);

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
    setComprobante(null);
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
  const subtotalServicios = propiedad.servicios.reduce((acc, s) => acc + s.monto, 0);
  const montoAlquilerPendiente = estado === "al-dia" ? 0 : propiedad.alquilerMensual;
  const montoPendiente = montoAlquilerPendiente + subtotalPendiente;
  const alDiaCompleto = montoPendiente === 0;
  const proximaFechaAjuste = proximoAjusteAlquiler(propiedad.contratoInicio);
  const diasContrato = diasHasta(propiedad.contratoFin);

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
  const diasAjuste = diasHasta(proximaFechaAjuste);
  if (diasAjuste <= 15) {
    avisos.push({
      id: "ajuste",
      Icono: IconTendencia,
      tono: "ambar",
      texto: `Tu alquiler se ajusta el ${formatoFecha(proximaFechaAjuste)} (frecuencia ${FRECUENCIA_AJUSTE.toLowerCase()}).`,
    });
  }
  const hayAvisos = avisos.length > 0;

  function pagarAhora() {
    if (montoAlquilerPendiente > 0) {
      registrarPago(propiedad!.id, propiedad!.alquilerMensual);
    }
    cargosPendientes.forEach((c) => marcarCargoPagado(c.id));
  }

  function subirComprobante(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setComprobante(archivo.name);
    pagarAhora();
    e.target.value = "";
  }

  function descargarReciboOficial() {
    const ultimoPago = pagos[0];
    if (!ultimoPago) return;
    descargarTexto(`recibo-${ultimoPago.mes}.txt`, generarRecibo(propiedad!, ultimoPago));
  }

  return (
    <div className="min-h-svh bg-papel">
      <div className="border-b border-grafito-suave bg-hueso px-6 pt-7 sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <BackLink />
          <button
            onClick={salir}
            className="rounded-full border border-grafito-suave px-4 py-2 font-sans text-xs font-medium text-tinta/65 transition hover:border-tinta/25 hover:text-tinta"
          >
            Salir
          </button>
        </div>

        <div className="mx-auto mt-8 max-w-5xl pb-7">
          <Logo />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <InicialesAvatar
                nombre={propiedad.inquilino}
                className="h-16 w-16 rounded-2xl text-lg"
              />
              <div>
                <h1 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
                  Hola, {propiedad.inquilino.split(" ")[0]}
                </h1>
                <p className="mt-1.5 font-sans text-sm text-tinta/55">
                  {propiedad.direccion} {propiedad.unidad}
                </p>
              </div>
            </div>
            <StatusPill estado={estado} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 pb-28 pt-8 sm:px-10">
        {vista === "inicio" && (
          <div className="lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-6">
            <div className="flex flex-col gap-6">
              {alDiaCompleto ? (
                <div className="rounded-2xl border border-verde-recibo/25 bg-verde-recibo-suave/60 p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-verde-recibo/80">
                    Estás al día
                  </p>
                  <p className="tabular mt-1 font-mono text-4xl font-semibold text-tinta">
                    $ 0 pendiente
                  </p>
                  <p className="mt-3 font-sans text-sm text-tinta/60">
                    Próximo vencimiento:{" "}
                    <span className="font-semibold text-tinta">
                      {formatoFecha(proximoVencimientoMensual(propiedad.diaVencimiento))}
                    </span>
                  </p>
                  <p className="mt-1 font-sans text-xs text-tinta/45">
                    Servicios de referencia este mes: {formatoMoneda(subtotalServicios)} (se
                    abonan por separado).
                  </p>
                  {pagos[0] && (
                    <button
                      onClick={descargarReciboOficial}
                      className="mt-5 rounded-full bg-verde-recibo px-5 py-2.5 font-sans text-sm font-semibold text-hueso transition hover:bg-verde-recibo/85"
                    >
                      Descargar recibo oficial
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className={`rounded-2xl border p-6 ${
                    estado === "mora"
                      ? "border-mora/25 bg-mora-suave/50"
                      : "border-ambar/25 bg-ambar-suave/40"
                  }`}
                >
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                      estado === "mora" ? "text-mora/80" : "text-ambar/80"
                    }`}
                  >
                    {estado === "mora" ? "Alquiler vencido" : "Pendiente de pago"}
                  </p>
                  <p className="tabular mt-1 font-mono text-4xl font-semibold text-tinta">
                    {formatoMoneda(montoPendiente)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-tinta/60">
                    {montoAlquilerPendiente > 0 && (
                      <span>Alquiler {formatoMoneda(montoAlquilerPendiente)}</span>
                    )}
                    {subtotalPendiente > 0 && (
                      <>
                        {montoAlquilerPendiente > 0 && <span className="text-tinta/30">+</span>}
                        <span>Cargos pendientes {formatoMoneda(subtotalPendiente)}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 font-sans text-xs text-tinta/45">
                    Servicios de referencia este mes: {formatoMoneda(subtotalServicios)} (se
                    abonan por separado).
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={pagarAhora}
                      className="rounded-full bg-mostaza px-5 py-2.5 font-sans text-sm font-semibold text-tinta transition hover:bg-mostaza/85"
                    >
                      Pagar ahora
                    </button>
                    <button
                      onClick={() => inputArchivoRef.current?.click()}
                      className="rounded-full border border-tinta/20 px-5 py-2.5 font-sans text-sm font-semibold text-tinta transition hover:bg-tinta/[0.04]"
                    >
                      Subir comprobante
                    </button>
                    <input
                      ref={inputArchivoRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={subirComprobante}
                    />
                  </div>
                  {comprobante && (
                    <p className="mt-3 font-sans text-xs font-medium text-verde-recibo">
                      Comprobante recibido: {comprobante} — tu pago quedó registrado.
                    </p>
                  )}
                </div>
              )}

              <TarjetaFlotante>
                <div className="grid grid-cols-2 gap-3">
                  <StatTile
                    Icono={IconCalendario}
                    tono="mostaza"
                    etiqueta="Próximo ajuste"
                    valor={formatoFecha(proximaFechaAjuste)}
                  />
                  <StatTile
                    Icono={IconRayo}
                    tono="neutro"
                    etiqueta="Servicios este mes"
                    valor={formatoMoneda(subtotalServicios)}
                  />
                  <StatTile
                    Icono={IconRecibo}
                    tono="verde"
                    etiqueta="Pagos registrados"
                    valor={String(pagos.length)}
                  />
                  <StatTile
                    Icono={IconTendencia}
                    tono="neutro"
                    etiqueta="Frecuencia de ajuste"
                    valor={FRECUENCIA_AJUSTE}
                  />
                </div>
              </TarjetaFlotante>

              <Card className="p-6">
                <ContratoProgreso
                  contratoInicio={propiedad.contratoInicio}
                  contratoFin={propiedad.contratoFin}
                />
              </Card>
            </div>

            <div className="mt-8 flex flex-col gap-6 lg:mt-0">
              <section>
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
                    <span className="font-sans text-sm text-tinta/80">Alquiler mensual</span>
                    <span className="tabular font-mono text-base font-semibold text-tinta">
                      {formatoMoneda(propiedad.alquilerMensual)}
                    </span>
                  </div>

                  {propiedad.servicios.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 border-y border-grafito-suave/70 bg-papel/60 px-5 py-2.5">
                        <IconRayo className="h-4 w-4 text-tinta/50" />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-tinta/50">
                          Servicios
                        </span>
                      </div>
                      <div className="divide-y divide-dashed divide-grafito-suave">
                        {propiedad.servicios.map((s) => {
                          const { etiqueta, Icono } = SERVICIO_INFO[s.tipo];
                          return (
                            <div
                              key={s.tipo}
                              className="flex items-center justify-between gap-4 px-5 py-3.5"
                            >
                              <span className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-papel">
                                  <Icono className="h-4 w-4 text-tinta/60" />
                                </span>
                                <span className="font-sans text-sm text-tinta/80">
                                  {etiqueta}
                                </span>
                              </span>
                              <span className="tabular font-mono text-sm font-semibold text-tinta">
                                {formatoMoneda(s.monto)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between bg-papel/60 px-5 py-3">
                        <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-tinta/45">
                          Subtotal servicios
                        </span>
                        <span className="tabular font-mono text-sm font-semibold text-tinta/70">
                          {formatoMoneda(subtotalServicios)}
                        </span>
                      </div>
                    </>
                  )}

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

              <section>
                <h2 className="font-display text-xl font-semibold text-tinta">
                  Historial de pagos
                </h2>
                <p className="mt-1 font-sans text-xs text-tinta/45">
                  Estos montos corresponden solo al alquiler — los servicios se abonan por
                  separado.
                </p>
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
                        <button
                          onClick={() => descargarTexto(`recibo-${p.mes}.txt`, generarRecibo(propiedad, p))}
                          title="Descargar recibo de este mes"
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-tinta/35 transition hover:bg-papel hover:text-tinta"
                        >
                          <IconDocumento className="h-3.5 w-3.5" />
                        </button>
                      </ReceiptRow>
                    ))
                  )}
                </Card>
              </section>
            </div>
          </div>
        )}

        {vista === "avisos" && (
          <div className="mx-auto max-w-xl">
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
          </div>
        )}

        {vista === "documentos" && (
          <div className="mx-auto max-w-xl">
            <TarjetaFlotante>
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tinta/[0.08]">
                  <IconDocumento className="h-6 w-6 text-tinta/60" />
                </span>
                <p className="font-sans text-sm font-medium text-tinta/70">
                  Todavía no hay documentos cargados.
                </p>
                <p className="max-w-xs font-sans text-xs text-tinta/45">
                  Próximamente vas a poder ver acá tu contrato firmado y los comprobantes de
                  pago.
                </p>
              </div>
            </TarjetaFlotante>
          </div>
        )}

        {vista === "perfil" && (
          <div className="mx-auto max-w-xl">
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

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-grafito-suave bg-papel/60 px-4 py-3.5">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tinta/[0.08]">
                  <IconPerfil className="h-4 w-4 text-tinta/60" />
                </span>
                <p className="font-sans text-xs text-tinta/60">
                  <span className="font-medium text-tinta/80">¿Dudas con tu cuenta?</span>
                  <br />
                  Muy pronto vas a poder escribirle directo a tu administrador desde acá.
                </p>
              </div>

              <button
                onClick={salir}
                className="mt-6 w-full rounded-full border border-tinta/20 py-2.5 font-sans text-sm font-semibold text-tinta transition hover:bg-tinta/[0.04]"
              >
                Salir
              </button>
            </TarjetaFlotante>
          </div>
        )}

        <PiePagina />
      </main>

      <NavInferior vista={vista} onCambiar={setVista} hayAvisos={hayAvisos} />
    </div>
  );
}
