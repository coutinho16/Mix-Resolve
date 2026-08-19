"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Cliente, Evento } from "@/types/domain";
import type { EventoActionState } from "@/app/gestao/eventos/actions";

type AcaoEvento = (
  prev: EventoActionState,
  formData: FormData
) => Promise<EventoActionState>;

interface EventoFormProps {
  clientes: Cliente[];
  evento?: Evento;
  action: AcaoEvento;
}

const estadoInicial: EventoActionState = {};

export function EventoForm({ clientes, evento, action }: EventoFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);
  const [multiDia, setMultiDia] = useState(
    evento ? evento.data_inicio !== evento.data_fim : false
  );
  const [dataInicio, setDataInicio] = useState(evento?.data_inicio ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Campo label="Nome do evento" name="nome" defaultValue={evento?.nome} required />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
          Cliente
        </label>
        <select
          id="cliente_id"
          name="cliente_id"
          defaultValue={evento?.cliente_id ?? ""}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        >
          <option value="">Sem cliente vinculado</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-preto">
        <input
          type="checkbox"
          checked={multiDia}
          onChange={(e) => setMultiDia(e.target.checked)}
          className="h-4 w-4 accent-laranja"
        />
        Evento com múltiplos dias
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Campo
          label={multiDia ? "Data de início" : "Data do evento"}
          name="data_inicio"
          type="date"
          defaultValue={evento?.data_inicio}
          required
          onChange={(v) => setDataInicio(v)}
        />
        {multiDia ? (
          <Campo
            label="Data de término"
            name="data_fim"
            type="date"
            defaultValue={evento?.data_fim}
            required
          />
        ) : (
          <input type="hidden" name="data_fim" value={dataInicio} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Data de montagem"
          name="data_montagem"
          type="date"
          defaultValue={evento?.data_montagem ?? ""}
        />
        <Campo
          label="Hora de montagem"
          name="hora_montagem"
          type="time"
          defaultValue={evento?.hora_montagem ?? ""}
        />
      </div>

      <Campo label="Local" name="local" defaultValue={evento?.local ?? ""} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="observacoes" className="text-sm font-medium text-preto">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          defaultValue={evento?.observacoes ?? ""}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

function Campo({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-preto">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
      />
    </div>
  );
}
