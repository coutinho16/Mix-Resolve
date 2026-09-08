"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { criarEvento, type EventoActionState } from "@/app/gestao/eventos/actions";

const estadoInicial: EventoActionState = {};

export function NovoEventoRapidoForm({ data }: { data: string }) {
  const [state, formAction, pending] = useActionState(criarEvento, estadoInicial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto">
          Nome do evento
        </label>
        <input
          id="nome"
          name="nome"
          required
          autoFocus
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="data_inicio" className="text-sm font-medium text-preto">
            Início
          </label>
          <input
            id="data_inicio"
            name="data_inicio"
            type="date"
            defaultValue={data}
            required
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="data_fim" className="text-sm font-medium text-preto">
            Término
          </label>
          <input
            id="data_fim"
            name="data_fim"
            type="date"
            defaultValue={data}
            required
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="data_montagem" className="text-sm font-medium text-preto">
          Data de montagem <span className="font-normal text-neutro-1">(opcional)</span>
        </label>
        <input
          id="data_montagem"
          name="data_montagem"
          type="date"
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
        <p className="text-xs text-neutro-1">
          Enquanto não for definida, o evento aparece com um aviso no calendário.
        </p>
      </div>

      <p className="text-xs text-neutro-1">
        Só o nome e a data são obrigatórios. Cliente, local e o resto dos detalhes podem
        ser preenchidos depois, na página do evento.
      </p>

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Criando..." : "Criar evento"}
      </Button>
    </form>
  );
}
