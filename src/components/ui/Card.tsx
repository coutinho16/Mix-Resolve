import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-neutro-2 bg-branco-puro p-6 ${className}`}
      {...props}
    />
  );
}
