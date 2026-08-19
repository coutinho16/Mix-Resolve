"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { criarCategoria, type EstoqueActionState } from "@/app/gestao/estoque/actions";

const estadoInicial: EstoqueActionState = {};

export function CategoriaForm({ onSucesso }: { onSucesso: () => void }) {
  const [state, formAction, pending] = useActionState(
    criarCategoria,
    estadoInicial
  );

  useEffect(() => {
    if (state.sucesso) onSucesso();
  }, [state.sucesso, onSucesso]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto">
          Nome da categoria
        </label>
        <input
          id="nome"
          name="nome"
          required
          placeholder="Ex: Painéis de LED"
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>
      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
