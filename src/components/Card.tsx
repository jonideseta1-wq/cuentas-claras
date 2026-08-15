import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-grafito-suave/70 bg-hueso shadow-[0_1px_0_rgba(20,43,61,0.04),0_8px_20px_-12px_rgba(20,43,61,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}
