import type { ReactNode } from "react";

export function ReceiptRow({
  children,
  ultimo = false,
}: {
  children: ReactNode;
  ultimo?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-3 ${
        ultimo ? "" : "border-b border-dashed border-grafito-suave"
      }`}
    >
      {children}
    </div>
  );
}
