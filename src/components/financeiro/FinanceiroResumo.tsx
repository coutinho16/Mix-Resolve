"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { atualizarStatusFinanceiro } from "@/app/gestao/financeiro/actions";
import type { FinanceiroItem, StatusFinanceiro } from "@/types/domain";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const rotulo: Record<StatusFinanceiro, string> = {
  rascunho: "Rascunho",
  emitido: "Emitido",
  pago: "Pago",
  cancelado: "Cancelado",
};

interface FinanceiroResumoProps {
  financeiroId: string;
  status: StatusFinanceiro;
  itens: FinanceiroItem[];
  valorTotal: number;
  mostrarItens: boolean;
}

export function FinanceiroResumo({
  financeiroId,
  status,
  itens,
  valorTotal,
  mostrarItens,
}: FinanceiroResumoProps) {
  const [pending, startTransition] = useTransition();
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <Card className="sticky top-6 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-titulo text-base font-semibold text-preto">Resumo</h2>
        {mostrarItens && (
          <span className="rounded-full bg-laranja/10 px-2.5 py-1 text-xs font-bold text-laranja">
            {totalItens} {totalItens === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      {mostrarItens &&
        (itens.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
            Nenhum item adicionado ainda.
          </p>
        ) : (
          <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
            {itens.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-dashed border-neutro-2 pb-1 text-xs last:border-0"
              >
                <span className="text-preto">
                  {item.descricao || "(sem descrição)"} <span className="text-neutro-1">x{item.quantidade}</span>
                </span>
              </div>
            ))}
          </div>
        ))}

      <div className="flex items-center justify-between rounded-xl bg-preto px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-branco/70">Total</span>
        <span className="font-titulo text-xl font-bold text-branco-puro">{fmt(valorTotal)}</span>
      </div>

      <a href={`/api/pdf/financeiro/${financeiroId}`} target="_blank" rel="noreferrer">
        <Button type="button" className="w-full">
          <Download size={16} />
          Baixar PDF
        </Button>
      </a>

      <div className="flex flex-wrap items-center gap-2 border-t border-neutro-2 pt-4">
        <Chip estado={status === "pago" ? "disponivel" : "em-uso"} texto={rotulo[status]} />
        {status !== "pago" && status !== "cancelado" && (
          <Button
            type="button"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusFinanceiro(financeiroId, "pago"))}
          >
            Marcar como pago
          </Button>
        )}
        {status === "rascunho" && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusFinanceiro(financeiroId, "emitido"))}
          >
            Marcar como emitido
          </Button>
        )}
        {status !== "cancelado" && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusFinanceiro(financeiroId, "cancelado"))}
          >
            Cancelar
          </Button>
        )}
      </div>
    </Card>
  );
}
