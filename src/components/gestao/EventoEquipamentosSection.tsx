"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Equipamento } from "@/types/domain";
import {
  adicionarEquipamentoEvento,
  removerEquipamentoEvento,
} from "@/app/gestao/eventos/actions";

interface ItemReservado {
  id: string;
  equipamento_id: string;
  quantidade_reservada: number;
}

interface EventoEquipamentosSectionProps {
  eventoId: string;
  equipamentos: Equipamento[];
  itens: ItemReservado[];
}

export function EventoEquipamentosSection({
  eventoId,
  equipamentos,
  itens,
}: EventoEquipamentosSectionProps) {
  const [equipamentoId, setEquipamentoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [pending, startTransition] = useTransition();

  function adicionar() {
    if (!equipamentoId || quantidade < 1) return;
    startTransition(async () => {
      await adicionarEquipamentoEvento(eventoId, equipamentoId, quantidade);
      setEquipamentoId("");
      setQuantidade(1);
    });
  }

  function nomeEquipamento(id: string) {
    return equipamentos.find((e) => e.id === id)?.nome ?? "Equipamento removido";
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-titulo text-lg font-semibold text-preto">
        Equipamentos
      </h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-preto">Equipamento</label>
          <select
            value={equipamentoId}
            onChange={(e) => setEquipamentoId(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          >
            <option value="">Selecione...</option>
            {equipamentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-preto">Quantidade</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{quantidade}</span>
            <button
              type="button"
              onClick={() => setQuantidade((q) => q + 1)}
              className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <Button
          type="button"
          onClick={adicionar}
          disabled={pending || !equipamentoId}
        >
          Adicionar
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm"
          >
            <span className="text-preto">
              {nomeEquipamento(item.equipamento_id)}{" "}
              <span className="text-neutro-1">x{item.quantidade_reservada}</span>
            </span>
            <button
              onClick={() => removerEquipamentoEvento(eventoId, item.id)}
              aria-label="Remover"
              className="rounded p-1 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {itens.length === 0 && (
          <p className="text-sm text-neutro-1">Nenhum equipamento reservado.</p>
        )}
      </ul>
    </div>
  );
}
