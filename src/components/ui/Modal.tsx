"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
}

export function Modal({ aberto, titulo, onFechar, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    if (aberto) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-preto/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        ref={ref}
        className="w-full max-w-lg rounded-xl bg-branco-puro p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-titulo text-lg font-semibold text-preto">
            {titulo}
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-full p-1 text-neutro-1 hover:bg-neutro-3"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
