"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import type { Cliente, Evento } from "@/types/domain";
import type { PropostaActionState } from "@/app/gestao/propostas/actions";

type AcaoProposta = (
  prev: PropostaActionState,
  formData: FormData
) => Promise<PropostaActionState>;

interface PropostaFormProps {
  clientes: Cliente[];
  eventos: Evento[];
  action: AcaoProposta;
}

const estadoInicial: PropostaActionState = {};

export function PropostaForm({ clientes: clientesIniciais, eventos, action }: PropostaFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);
  const [clientes, setClientes] = useState(clientesIniciais);
  const [clienteId, setClienteId] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
            Cliente
          </label>
          <div className="flex gap-2">
            <select
              id="cliente_id"
              name="cliente_id"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
              className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            >
              <option value="" disabled>
                Selecione...
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            <NovoClienteModal
              onCriado={(cliente) => {
                setClientes((prev) => [...prev, cliente].sort((a, b) => a.nome.localeCompare(b.nome)));
                setClienteId(cliente.id);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="evento_id" className="text-sm font-medium text-preto">
            Evento vinculado (opcional)
          </label>
          <select
            id="evento_id"
            name="evento_id"
            defaultValue=""
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          >
            <option value="">Sem evento vinculado</option>
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input type="hidden" name="submodo_precificacao" value="item" />
      <input type="hidden" name="desconto_tipo" value="nenhum" />
      <input type="hidden" name="signatario" value="gabriel" />

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Criando..." : "Criar proposta e continuar"}
      </Button>
    </form>
  );
}
