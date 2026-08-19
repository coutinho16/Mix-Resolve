"use client";

import { useState } from "react";
import type { Assinante } from "@/types/domain";

const nomes: Record<Assinante, string> = {
  gabriel: "Gabriel Coutinho",
  higor: "Higor Amaral",
};

/**
 * Enquanto as assinaturas vetorizadas não forem anexadas em
 * public/assets/assinatura-{gabriel,higor}.svg, mostra um espaço reservado
 * em vez de inventar uma assinatura.
 */
export function AssinaturaPreview({ signatario }: { signatario: Assinante }) {
  const [falhou, setFalhou] = useState(false);
  const src = `/assets/assinatura-${signatario}.svg`;

  return (
    <div className="flex h-16 w-48 items-center justify-center rounded-lg border border-dashed border-neutro-2 bg-neutro-3">
      {falhou ? (
        <span className="px-2 text-center text-xs text-neutro-1">
          Assinatura de {nomes[signatario]} (pendente de anexo)
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Assinatura de ${nomes[signatario]}`}
          className="max-h-14 max-w-full object-contain"
          onError={() => setFalhou(true)}
        />
      )}
    </div>
  );
}
