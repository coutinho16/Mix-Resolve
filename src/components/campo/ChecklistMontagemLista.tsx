"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { ProgressoChecklist } from "@/components/campo/ProgressoChecklist";
import { confirmarItemChecklist } from "@/app/campo/checklist/actions";
import type { ChecklistItem, Equipamento } from "@/types/domain";

interface ChecklistMontagemListaProps {
  checklistId: string;
  eventoId: string;
  itens: ChecklistItem[];
  equipamentos: Equipamento[];
}

export function ChecklistMontagemLista({
  checklistId,
  eventoId,
  itens,
  equipamentos,
}: ChecklistMontagemListaProps) {
  const [pending, startTransition] = useTransition();

  function nomeEquipamento(id: string) {
    return equipamentos.find((e) => e.id === id)?.nome ?? "Equipamento";
  }

  const confirmados = itens.filter((i) => i.status === "confirmado").length;

  return (
    <div className="flex flex-col gap-4">
      <ProgressoChecklist confirmados={confirmados} total={itens.length} />

      <ul className="flex flex-col gap-2">
        {itens.map((item) => {
          const confirmado = item.status === "confirmado";
          return (
            <li key={item.id}>
              <button
                disabled={pending || confirmado}
                onClick={() =>
                  startTransition(() =>
                    confirmarItemChecklist(item.id, checklistId, eventoId)
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ${
                  confirmado
                    ? "border-disponivel bg-disponivel/10"
                    : "border-neutro-2 bg-branco-puro active:bg-neutro-3"
                }`}
              >
                <span>
                  <span className="block font-medium text-preto">
                    {nomeEquipamento(item.equipamento_id)}
                  </span>
                  <span className="text-sm text-neutro-1">
                    Quantidade: {item.quantidade_esperada}
                  </span>
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    confirmado
                      ? "border-disponivel bg-disponivel text-branco-puro"
                      : "border-neutro-2"
                  }`}
                >
                  {confirmado && <Check size={18} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
