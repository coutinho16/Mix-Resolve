"use client";

import { useState } from "react";
import { Plus, Pencil, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Chip } from "@/components/ui/Chip";
import { EquipamentoForm } from "@/components/gestao/EquipamentoForm";
import { CategoriaForm } from "@/components/gestao/CategoriaForm";
import type { CategoriaEquipamento, Equipamento } from "@/types/domain";
import {
  criarEquipamento,
  atualizarEquipamento,
  excluirEquipamento,
  reativarEquipamento,
} from "@/app/gestao/estoque/actions";

interface EstoquePainelProps {
  categorias: CategoriaEquipamento[];
  equipamentos: Equipamento[];
}

type ModalState =
  | { tipo: "nova-categoria" }
  | { tipo: "novo-equipamento" }
  | { tipo: "editar-equipamento"; equipamento: Equipamento }
  | null;

export function EstoquePainel({ categorias, equipamentos }: EstoquePainelProps) {
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Estoque
        </h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setModal({ tipo: "nova-categoria" })}
          >
            <Plus size={16} />
            Categoria
          </Button>
          <Button onClick={() => setModal({ tipo: "novo-equipamento" })}>
            <Plus size={16} />
            Equipamento
          </Button>
        </div>
      </div>

      {categorias.length === 0 && (
        <Card>
          <p className="text-sm text-neutro-1">
            Nenhuma categoria cadastrada ainda. Comece criando uma (ex: LED,
            Praticáveis, Som, Iluminação cênica).
          </p>
        </Card>
      )}

      {categorias.map((categoria) => {
        const itens = equipamentos.filter(
          (e) => e.categoria_id === categoria.id && e.ativo
        );
        if (itens.length === 0) return null;

        return (
          <div key={categoria.id} className="flex flex-col gap-3">
            <h2 className="font-titulo text-sm font-semibold uppercase tracking-wide text-neutro-1">
              {categoria.nome}
            </h2>
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-neutro-2 text-neutro-1">
                  <tr>
                    <th className="px-4 py-3 font-medium">Equipamento</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Disponível</th>
                    <th className="px-4 py-3 font-medium">Em uso</th>
                    <th className="px-4 py-3 font-medium">Manutenção</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((e) => {
                    const disponivel =
                      e.quantidade_total - e.quantidade_em_uso - e.quantidade_manutencao;
                    return (
                      <tr key={e.id} className="border-b border-neutro-2 last:border-0">
                        <td className="px-4 py-3 font-medium text-preto">
                          {e.nome}
                        </td>
                        <td className="px-4 py-3 text-neutro-1">
                          {e.quantidade_total}
                        </td>
                        <td className="px-4 py-3">
                          <Chip
                            estado="disponivel"
                            texto={String(disponivel)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          {e.quantidade_em_uso > 0 && (
                            <Chip estado="em-uso" texto={String(e.quantidade_em_uso)} />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {e.quantidade_manutencao > 0 && (
                            <Chip
                              estado="manutencao"
                              texto={String(e.quantidade_manutencao)}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setModal({ tipo: "editar-equipamento", equipamento: e })
                              }
                              aria-label="Editar"
                              className="rounded p-1.5 text-neutro-1 hover:bg-neutro-3 hover:text-preto"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => excluirEquipamento(e.id)}
                              aria-label="Desativar"
                              className="rounded p-1.5 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
                            >
                              <EyeOff size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })}

      {(() => {
        const ocultos = equipamentos.filter((e) => !e.ativo);
        if (ocultos.length === 0) return null;
        return (
          <div className="flex flex-col gap-3">
            <h2 className="font-titulo text-sm font-semibold uppercase tracking-wide text-neutro-1">
              Equipamentos ocultos
            </h2>
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-neutro-2 text-neutro-1">
                  <tr>
                    <th className="px-4 py-3 font-medium">Equipamento</th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {ocultos.map((e) => (
                    <tr key={e.id} className="border-b border-neutro-2 last:border-0">
                      <td className="px-4 py-3 font-medium text-neutro-1">{e.nome}</td>
                      <td className="px-4 py-3 text-neutro-1">
                        {categorias.find((c) => c.id === e.categoria_id)?.nome ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => reativarEquipamento(e.id)}
                            aria-label="Reativar"
                            className="flex items-center gap-1.5 rounded p-1.5 text-xs font-medium text-neutro-1 hover:bg-disponivel/10 hover:text-disponivel"
                          >
                            <Eye size={16} />
                            Reativar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })()}

      <Modal
        aberto={modal !== null}
        titulo={
          modal?.tipo === "nova-categoria"
            ? "Nova categoria"
            : modal?.tipo === "editar-equipamento"
              ? "Editar equipamento"
              : "Novo equipamento"
        }
        onFechar={() => setModal(null)}
      >
        {modal?.tipo === "nova-categoria" && (
          <CategoriaForm onSucesso={() => setModal(null)} />
        )}
        {modal?.tipo === "novo-equipamento" && (
          <EquipamentoForm
            categorias={categorias}
            action={criarEquipamento}
            onSucesso={() => setModal(null)}
          />
        )}
        {modal?.tipo === "editar-equipamento" && (
          <EquipamentoForm
            categorias={categorias}
            equipamento={modal.equipamento}
            action={atualizarEquipamento.bind(null, modal.equipamento.id)}
            onSucesso={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
