import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CargoEspecial, DatosApp, Pago, Propiedad, Servicio } from "../types";
import { DATOS_INICIALES } from "../data/mockData";
import { mesActual } from "../lib/utils";

// v2: agrega "servicios" a Propiedad — versionado para no romper sesiones
// que ya tenían datos guardados con el esquema anterior.
const CLAVE_STORAGE = "cuentas-claras:datos:v2";

function cargarDatos(): DatosApp {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) return JSON.parse(guardado) as DatosApp;
  } catch {
    // si el storage está corrupto, seguimos con los datos iniciales
  }
  return structuredClone(DATOS_INICIALES);
}

function guardarDatos(datos: DatosApp) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
}

interface DataContextValue {
  datos: DatosApp;
  registrarPago: (propiedadId: string, monto: number, mes?: string) => void;
  marcarCargoPagado: (cargoId: string) => void;
  agregarCargo: (propiedadId: string, descripcion: string, monto: number) => void;
  actualizarServicios: (propiedadId: string, servicios: Servicio[]) => void;
  actualizarPropiedad: (
    propiedadId: string,
    cambios: Partial<
      Pick<Propiedad, "alquilerMensual" | "diaVencimiento" | "contratoInicio" | "contratoFin">
    >
  ) => void;
  reiniciarDemo: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<DatosApp>(cargarDatos);

  const registrarPago = useCallback(
    (propiedadId: string, monto: number, mes: string = mesActual()) => {
      setDatos((prev) => {
        const yaExiste = prev.pagos.some(
          (p) => p.propiedadId === propiedadId && p.mes === mes
        );
        if (yaExiste) return prev;

        const nuevoPago: Pago = {
          id: `pg-${Date.now()}`,
          propiedadId,
          mes,
          monto,
          fecha: new Date().toISOString().slice(0, 10),
        };
        const actualizado = { ...prev, pagos: [...prev.pagos, nuevoPago] };
        guardarDatos(actualizado);
        return actualizado;
      });
    },
    []
  );

  const marcarCargoPagado = useCallback((cargoId: string) => {
    setDatos((prev) => {
      const cargos: CargoEspecial[] = prev.cargos.map((c) =>
        c.id === cargoId ? { ...c, pagado: true } : c
      );
      const actualizado = { ...prev, cargos };
      guardarDatos(actualizado);
      return actualizado;
    });
  }, []);

  const agregarCargo = useCallback(
    (propiedadId: string, descripcion: string, monto: number) => {
      setDatos((prev) => {
        const nuevoCargo: CargoEspecial = {
          id: `cg-${Date.now()}`,
          propiedadId,
          descripcion,
          monto,
          pagado: false,
          fecha: new Date().toISOString().slice(0, 10),
        };
        const actualizado = { ...prev, cargos: [...prev.cargos, nuevoCargo] };
        guardarDatos(actualizado);
        return actualizado;
      });
    },
    []
  );

  const actualizarServicios = useCallback((propiedadId: string, servicios: Servicio[]) => {
    setDatos((prev) => {
      const propiedades = prev.propiedades.map((p) =>
        p.id === propiedadId ? { ...p, servicios } : p
      );
      const actualizado = { ...prev, propiedades };
      guardarDatos(actualizado);
      return actualizado;
    });
  }, []);

  const actualizarPropiedad = useCallback(
    (
      propiedadId: string,
      cambios: Partial<
        Pick<Propiedad, "alquilerMensual" | "diaVencimiento" | "contratoInicio" | "contratoFin">
      >
    ) => {
      setDatos((prev) => {
        const propiedades = prev.propiedades.map((p) =>
          p.id === propiedadId ? { ...p, ...cambios } : p
        );
        const actualizado = { ...prev, propiedades };
        guardarDatos(actualizado);
        return actualizado;
      });
    },
    []
  );

  const reiniciarDemo = useCallback(() => {
    const frescos = structuredClone(DATOS_INICIALES);
    guardarDatos(frescos);
    setDatos(frescos);
  }, []);

  const value = useMemo(
    () => ({
      datos,
      registrarPago,
      marcarCargoPagado,
      agregarCargo,
      actualizarServicios,
      actualizarPropiedad,
      reiniciarDemo,
    }),
    [
      datos,
      registrarPago,
      marcarCargoPagado,
      agregarCargo,
      actualizarServicios,
      actualizarPropiedad,
      reiniciarDemo,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDatos(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDatos debe usarse dentro de DataProvider");
  return ctx;
}
