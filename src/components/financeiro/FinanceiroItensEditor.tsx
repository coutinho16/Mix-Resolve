"use client";

import { useRef, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adicionarItemFinanceiro, removerItemFinanceiro } from "@/app/gestao/financeiro/actions";
import type { FinanceiroItem } from "@/types/domain";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface FinanceiroItensEditorProps {
  financeiroId: string;
  itens: FinanceiroItem[];
}

export function FinanceiroItensEditor({ financeiroId, itens }: FinanceiroItensEditorProps) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await adicionarItemFinanceiro(financeiroId, formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-neutro-2 pt-4">
      <h2 className="font-titulo text-base font-semibold text-preto">Itens</h2>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-neutro-2 bg-neutro-3/60 p-4"
      >
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Descrição
          </label>
          <input
            name="descricao"
            className="rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Qtd.
          </label>
          <input
            name="quantidade"
            type="number"
            min={1}
            defaultValue={1}
            className="w-20 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Valor unitário
          </label>
          <input
            name="valor_unitario"
            type="number"
            step="0.01"
            min={0}
            defaultValue={0}
            className="w-32 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <Button type="submit" disabled={pending}>
          <Plus size={16} />
          Adicionar
        </Button>
      </form>

      <ul className="flex flex-col gap-1.5">
        {itens.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm"
          >
            <span className="text-preto">
              {item.descricao || "(sem descrição)"}{" "}
              <span className="text-neutro-1">
                x{item.quantidade} · {fmt(item.valor_unitario)} = {fmt(item.valor_total)}
              </span>
            </span>
            <button
              onClick={() => removerItemFinanceiro(financeiroId, item.id)}
              aria-label="Remover"
              className="rounded p-1 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {itens.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
            Nenhum item adicionado ainda.
          </p>
        )}
      </ul>
    </div>
  );
}
