"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import type { Cliente, Evento } from "@/types/domain";
import type { ContratoActionState } from "@/app/gestao/contratos/actions";

interface DadosPuxados {
  contratante_nome: string;
  contratante_documento: string;
  contratante_endereco: string;
  objeto_local: string;
  objeto_data_evento: string;
  objeto_montagem: string;
  cliente_id: string;
  evento_id: string;
  valor_manual: number;
}

interface ContratoFormProps {
  clientes: Cliente[];
  eventos: Evento[];
  propostaId: string | null;
  dadosPuxados: DadosPuxados | null;
  action: (prev: ContratoActionState, formData: FormData) => Promise<ContratoActionState>;
}

const estadoInicial: ContratoActionState = {};

export function ContratoForm({ clientes: clientesIniciais, eventos, propostaId, dadosPuxados, action }: ContratoFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);
  const [clientes, setClientes] = useState(clientesIniciais);
  const [clienteId, setClienteId] = useState(dadosPuxados?.cliente_id ?? "");
  const [contratanteNome, setContratanteNome] = useState(dadosPuxados?.contratante_nome ?? "");
  const [contratanteDocumento, setContratanteDocumento] = useState(dadosPuxados?.contratante_documento ?? "");
  const [contratanteEndereco, setContratanteEndereco] = useState(dadosPuxados?.contratante_endereco ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {propostaId && <input type="hidden" name="proposta_id" value={propostaId} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
          Cliente salvo (opcional)
        </label>
        <div className="flex gap-2">
          <select
            id="cliente_id"
            name="cliente_id"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          >
            <option value="">Nenhum · preencher manualmente</option>
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
              setContratanteNome(cliente.empresa || cliente.nome);
              setContratanteDocumento(cliente.documento ?? "");
              setContratanteEndereco(cliente.endereco ?? "");
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contratante_nome" className="text-sm font-medium text-preto">
          Nome / Razão social do contratante
        </label>
        <input
          id="contratante_nome"
          name="contratante_nome"
          required
          value={contratanteNome}
          onChange={(e) => setContratanteNome(e.target.value)}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contratante_documento" className="text-sm font-medium text-preto">
            CPF/CNPJ
          </label>
          <input
            id="contratante_documento"
            name="contratante_documento"
            value={contratanteDocumento}
            onChange={(e) => setContratanteDocumento(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="evento_id" className="text-sm font-medium text-preto">
            Evento vinculado (opcional)
          </label>
          <select
            id="evento_id"
            name="evento_id"
            defaultValue={dadosPuxados?.evento_id ?? ""}
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contratante_endereco" className="text-sm font-medium text-preto">
          Endereço completo
        </label>
        <input
          id="contratante_endereco"
          name="contratante_endereco"
          value={contratanteEndereco}
          onChange={(e) => setContratanteEndereco(e.target.value)}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="objeto_local" className="text-sm font-medium text-preto">
            Local do evento
          </label>
          <input
            id="objeto_local"
            name="objeto_local"
            defaultValue={dadosPuxados?.objeto_local ?? ""}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="objeto_data_evento" className="text-sm font-medium text-preto">
            Data do evento
          </label>
          <input
            id="objeto_data_evento"
            name="objeto_data_evento"
            type="date"
            defaultValue={dadosPuxados?.objeto_data_evento ?? ""}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="objeto_montagem" className="text-sm font-medium text-preto">
          Montagem
        </label>
        <input
          id="objeto_montagem"
          name="objeto_montagem"
          type="date"
          defaultValue={dadosPuxados?.objeto_montagem ?? ""}
          className="w-full max-w-[220px] rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      {dadosPuxados && dadosPuxados.valor_manual > 0 && (
        <input type="hidden" name="valor_manual" value={dadosPuxados.valor_manual} />
      )}
      <input type="hidden" name="submodo_valor" value="item" />
      <input type="hidden" name="tipo_contratacao" value="pagamento" />
      <input type="hidden" name="signatario" value="gabriel" />

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Criando..." : "Criar contrato e continuar"}
      </Button>
    </form>
  );
}
