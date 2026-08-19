import { IconGota, IconLlama, IconRayo, IconWifi } from "../components/icons";
import type { TipoServicio } from "../types";

export const SERVICIO_INFO: Record<TipoServicio, { etiqueta: string; Icono: typeof IconGota }> = {
  agua: { etiqueta: "Agua", Icono: IconGota },
  luz: { etiqueta: "Luz", Icono: IconRayo },
  gas: { etiqueta: "Gas", Icono: IconLlama },
  internet: { etiqueta: "Internet", Icono: IconWifi },
};

export const ORDEN_SERVICIOS: TipoServicio[] = ["agua", "luz", "gas", "internet"];
