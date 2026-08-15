import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CargoEspecial, DatosApp, Pago } from "../types";
import { DATOS_INICIALES } from "../data/mockData";
import { mesActual } from "../lib/utils";

const CLAVE_STORAGE = "cuentas-claras:datos";

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

  const reiniciarDemo = useCallback(() => {
    const frescos = structuredClone(DATOS_INICIALES);
    guardarDatos(frescos);
    setDatos(frescos);
  }, []);

  const value = useMemo(
    () => ({ datos, registrarPago, marcarCargoPagado, reiniciarDemo }),
    [datos, registrarPago, marcarCargoPagado, reiniciarDemo]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDatos(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDatos debe usarse dentro de DataProvider");
  return ctx;
}
