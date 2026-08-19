"use client";

import { useState, useTransition } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { ProgressoChecklist } from "@/components/campo/ProgressoChecklist";
import { Button } from "@/components/ui/Button";
import {
  confirmarItemChecklist,
  marcarItemAvariado,
} from "@/app/campo/checklist/actions";
import type { ChecklistItem, Equipamento } from "@/types/domain";

interface ChecklistDevolucaoListaProps {
  checklistId: string;
  eventoId: string;
  itens: ChecklistItem[];
  equipamentos: Equipamento[];
}

export function ChecklistDevolucaoLista({
  checklistId,
  eventoId,
  itens,
  equipamentos,
}: ChecklistDevolucaoListaProps) {
  const confirmados = itens.filter((i) => i.status !== "pendente").length;

  function nomeEquipamento(id: string) {
    return equipamentos.find((e) => e.id === id)?.nome ?? "Equipamento";
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressoChecklist confirmados={confirmados} total={itens.length} />

      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <ItemDevolucao
            key={item.id}
            item={item}
            nome={nomeEquipamento(item.equipamento_id)}
            checklistId={checklistId}
            eventoId={eventoId}
          />
        ))}
      </ul>
    </div>
  );
}

function ItemDevolucao({
  item,
  nome,
  checklistId,
  eventoId,
}: {
  item: ChecklistItem;
  nome: string;
  checklistId: string;
  eventoId: string;
}) {
  const [expandido, setExpandido] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [pending, startTransition] = useTransition();

  const definido = item.status !== "pendente";

  return (
    <li
      className={`rounded-xl border px-4 py-4 ${
        item.status === "confirmado"
          ? "border-disponivel bg-disponivel/10"
          : item.status === "avariado"
            ? "border-conflito bg-conflito/10"
            : "border-neutro-2 bg-branco-puro"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>
          <span className="block font-medium text-preto">{nome}</span>
          <span className="text-sm text-neutro-1">
            Quantidade esperada: {item.quantidade_esperada}
          </span>
        </span>
        {item.status === "confirmado" && (
          <Check size={20} className="text-disponivel" />
        )}
        {item.status === "avariado" && (
          <TriangleAlert size={20} className="text-conflito" />
        )}
      </div>

      {!definido && !expandido && (
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(() =>
                confirmarItemChecklist(item.id, checklistId, eventoId)
              )
            }
            className="flex-1"
          >
            Confirmar OK
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => setExpandido(true)}
            className="flex-1"
          >
            Avariado
          </Button>
        </div>
      )}

      {!definido && expandido && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-preto">
              Quantidade avariada
            </label>
            <input
              type="number"
              min={1}
              max={item.quantidade_esperada}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-preto">
              Descrição do problema
            </label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={pending || !descricao}
              onClick={() =>
                startTransition(() =>
                  marcarItemAvariado(
                    item.id,
                    checklistId,
                    eventoId,
                    quantidade,
                    descricao
                  )
                )
              }
              className="flex-1"
            >
              Confirmar avaria
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setExpandido(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {item.status === "avariado" && item.descricao_avaria && (
        <p className="mt-2 text-sm text-conflito">
          {item.quantidade_avariada}x avariado: {item.descricao_avaria}
        </p>
      )}
    </li>
  );
}
