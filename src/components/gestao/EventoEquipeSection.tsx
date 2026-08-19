"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EtapaEquipe, Usuario } from "@/types/domain";
import {
  adicionarMembroEquipe,
  removerMembroEquipe,
} from "@/app/gestao/eventos/actions";

interface MembroEscalado {
  id: string;
  usuario_id: string;
  etapa: EtapaEquipe;
  funcao: string | null;
}

interface EventoEquipeSectionProps {
  eventoId: string;
  equipeCampo: Usuario[];
  membros: MembroEscalado[];
}

const rotuloEtapa: Record<EtapaEquipe, string> = {
  montagem: "Montagem",
  operacao: "Operação",
  desmontagem: "Desmontagem",
};

export function EventoEquipeSection({
  eventoId,
  equipeCampo,
  membros,
}: EventoEquipeSectionProps) {
  const [usuarioId, setUsuarioId] = useState("");
  const [etapa, setEtapa] = useState<EtapaEquipe>("montagem");
  const [funcao, setFuncao] = useState("");
  const [pending, startTransition] = useTransition();

  function adicionar() {
    if (!usuarioId) return;
    startTransition(async () => {
      await adicionarMembroEquipe(eventoId, usuarioId, etapa, funcao);
      setUsuarioId("");
      setFuncao("");
    });
  }

  function nomeUsuario(id: string) {
    return equipeCampo.find((u) => u.id === id)?.nome ?? "Usuário removido";
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-titulo text-lg font-semibold text-preto">
        Equipe escalada
      </h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-preto">Integrante</label>
          <select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          >
            <option value="">Selecione...</option>
            {equipeCampo.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-preto">Etapa</label>
          <select
            value={etapa}
            onChange={(e) => setEtapa(e.target.value as EtapaEquipe)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          >
            <option value="montagem">Montagem</option>
            <option value="operacao">Operação</option>
            <option value="desmontagem">Desmontagem</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-preto">Função (opcional)</label>
          <input
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>

        <Button type="button" onClick={adicionar} disabled={pending || !usuarioId}>
          Adicionar
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {membros.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm"
          >
            <span className="text-preto">
              {nomeUsuario(m.usuario_id)}{" "}
              <span className="text-neutro-1">
                · {rotuloEtapa[m.etapa]}
                {m.funcao ? ` · ${m.funcao}` : ""}
              </span>
            </span>
            <button
              onClick={() => removerMembroEquipe(eventoId, m.id)}
              aria-label="Remover"
              className="rounded p-1 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {membros.length === 0 && (
          <p className="text-sm text-neutro-1">Nenhum integrante escalado.</p>
        )}
      </ul>
    </div>
  );
}
