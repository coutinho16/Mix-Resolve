"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { CategoriaEquipamento, Equipamento } from "@/types/domain";
import type { EstoqueActionState } from "@/app/gestao/estoque/actions";

type AcaoEquipamento = (
  prev: EstoqueActionState,
  formData: FormData
) => Promise<EstoqueActionState>;

interface EquipamentoFormProps {
  categorias: CategoriaEquipamento[];
  equipamento?: Equipamento;
  action: AcaoEquipamento;
  onSucesso: () => void;
}

const estadoInicial: EstoqueActionState = {};

export function EquipamentoForm({
  categorias,
  equipamento,
  action,
  onSucesso,
}: EquipamentoFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);

  useEffect(() => {
    if (state.sucesso) onSucesso();
  }, [state.sucesso, onSucesso]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="categoria_id" className="text-sm font-medium text-preto">
          Categoria
        </label>
        <select
          id="categoria_id"
          name="categoria_id"
          defaultValue={equipamento?.categoria_id}
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto">
          Nome do equipamento
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={equipamento?.nome}
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="quantidade_total"
            className="text-sm font-medium text-preto"
          >
            Quantidade total
          </label>
          <input
            id="quantidade_total"
            name="quantidade_total"
            type="number"
            min={0}
            defaultValue={equipamento?.quantidade_total ?? 0}
            required
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="preco_referencia"
            className="text-sm font-medium text-preto"
          >
            Preço de referência
          </label>
          <input
            id="preco_referencia"
            name="preco_referencia"
            type="number"
            step="0.01"
            min={0}
            defaultValue={equipamento?.preco_referencia ?? ""}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="estoque_minimo" className="text-sm font-medium text-preto">
            Estoque mínimo
          </label>
          <input
            id="estoque_minimo"
            name="estoque_minimo"
            type="number"
            min={0}
            defaultValue={equipamento?.estoque_minimo ?? ""}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
