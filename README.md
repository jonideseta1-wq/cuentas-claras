# Cuentas Claras

Gestión simple de alquileres para quien administra unas pocas propiedades sin ser
una inmobiliaria: registro de pagos, avisos de vencimiento y mora, y un portal
para que cada inquilino consulte su cuenta sin preguntar por WhatsApp.

Proyecto construido para el desafío **CoderCup** de Coderhouse. Todos los datos
(propiedades, inquilinos, montos) son ficticios — es una demo.

## Qué hace

- **Panel administrador** (`/admin`): lista de propiedades con su inquilino y
  alquiler, registro de pagos en un clic, resumen de cuánto se cobró y cuánto
  falta cobrar este mes.
- **Portal del inquilino** (`/portal`): cada inquilino ingresa con un PIN de 4
  dígitos y ve su alquiler, su historial de pagos y sus cargos especiales
  pendientes.
- **Alertas automáticas**: contratos por vencer y alquileres impagos del mes,
  calculados en base a la fecha real.

## Stack

Vite + React + TypeScript + Tailwind CSS. Sin backend: los datos viven en el
navegador (`localStorage`), sembrados desde un set de datos ficticios. Hay un
botón de "reiniciar datos de demo" en el panel administrador para volver al
estado inicial en cualquier momento.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
