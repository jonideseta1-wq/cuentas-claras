import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCalendario(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="14" height="12.5" rx="2.2" />
      <path d="M3 8.3h14" />
      <path d="M6.5 3v3M13.5 3v3" />
      <path d="M6.7 11.3h1M9.5 11.3h1M12.3 11.3h1M6.7 13.9h1M9.5 13.9h1" />
    </svg>
  );
}

export function IconContrato(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2.8h6.2L16 6.6v10.6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
      <path d="M12.2 2.8v3.4a.6.6 0 0 0 .6.6H16" />
      <path d="M7.4 10.4h5.2M7.4 12.7h5.2M7.4 15h3.2" />
    </svg>
  );
}

export function IconRecibo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 3h10v14l-1.8-1.2L11.4 17l-1.8-1.2L7.8 17 6 15.8 5 17V3Z" />
      <path d="M7.5 7h5M7.5 9.6h5M7.5 12.2h3" />
    </svg>
  );
}

export function IconTendencia(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.2 13.8 8 9l3 3 5.8-6" />
      <path d="M13.2 6h3.6v3.6" />
    </svg>
  );
}

export function IconCasa(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.3 9.6 10 3.6l6.7 6" />
      <path d="M5.2 8.3v8.1h9.6V8.3" />
      <path d="M8.3 16.4v-4.6h3.4v4.6" />
    </svg>
  );
}

export function IconLlave(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="13" r="3.3" />
      <path d="M9.3 10.7 15.8 4.2M13.6 6.4l1.7 1.7M11.3 8.7 13 10.4" />
    </svg>
  );
}

export function IconCheckCirculo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M6.8 10.2 9 12.4l4.2-4.8" />
    </svg>
  );
}

export function IconRelojCirculo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6.2V10l2.8 1.8" />
    </svg>
  );
}

export function IconAlertaCirculo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6.6v4.2" />
      <circle cx="10" cy="13.4" r="0.15" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFlechaIzq(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.5 4.5 6 10l6.5 5.5" />
    </svg>
  );
}

export function IconCampana(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.3 13.6V9.2a4.7 4.7 0 0 1 9.4 0v4.4l1.3 1.9H4l1.3-1.9Z" />
      <path d="M8.5 17.2a1.6 1.6 0 0 0 3 0" />
    </svg>
  );
}

export function IconPerfil(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="6.9" r="3.1" />
      <path d="M4.2 16.8a5.8 5.8 0 0 1 11.6 0" />
    </svg>
  );
}

export function IconDocumento(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2.8h5.4L15 6.4v10.8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
      <path d="M11.2 2.8v3.2a.6.6 0 0 0 .6.6H15" />
      <path d="M7.3 10.6h5.4M7.3 13.2h5.4" />
    </svg>
  );
}

export function IconGota(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2.6c2.6 3.4 5 6.5 5 9.4a5 5 0 0 1-10 0c0-2.9 2.4-6 5-9.4Z" />
      <path d="M7.6 12.2a2.4 2.4 0 0 0 2.1 2.4" />
    </svg>
  );
}

export function IconRayo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11.1 2.6 5.4 11h3.8l-1.1 6.4L14 9h-3.8l0.9-6.4Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLlama(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2.8c.4 2.2 1.9 3.4 3 4.7a5.1 5.1 0 0 1 1.2 3.3 4.2 4.2 0 0 1-8.4 0c0-1 .3-1.7.9-2.5.2.9.8 1.5 1.5 1.5.9 0 1-1 .7-1.8-.5-1.4-.3-3.4.9-5.2Z" />
    </svg>
  );
}

export function IconLapiz(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.6 3.4a1.6 1.6 0 0 1 2.3 0l1.7 1.7a1.6 1.6 0 0 1 0 2.3L7.4 16.6l-4 .9.9-4Z" />
      <path d="M11.3 4.7 15.3 8.7" />
    </svg>
  );
}

export function IconMas(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" />
    </svg>
  );
}

export function IconWifi(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.2 8.2a9.6 9.6 0 0 1 13.6 0" />
      <path d="M5.9 11a5.9 5.9 0 0 1 8.2 0" />
      <path d="M8.6 13.7a2.2 2.2 0 0 1 2.8 0" />
      <circle cx="10" cy="16" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
