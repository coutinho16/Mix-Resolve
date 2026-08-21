"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import type { Cliente } from "@/types/domain";
import type { FinanceiroActionState } from "@/app/gestao/financeiro/actions";

interface ItemPuxado {
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

interface DadosPuxados {
  tipo: "fatura" | "recibo";
  cliente_id: string;
  cliente_nome: string;
  cliente_documento: string;
  proposta_id: string;
  contrato_id: string;
  descricao: string;
  valor_total: number;
}

interface FinanceiroFormProps {
  clientes: Cliente[];
  dadosPuxados: DadosPuxados | null;
  itensPuxados: ItemPuxado[];
  action: (prev: FinanceiroActionState, formData: FormData) => Promise<FinanceiroActionState>;
}

const estadoInicial: FinanceiroActionState = {};

export function FinanceiroForm({
  clientes: clientesIniciais,
  dadosPuxados,
  itensPuxados,
  action,
}: FinanceiroFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);
  const [tipo, setTipo] = useState<"fatura" | "recibo">(dadosPuxados?.tipo ?? "fatura");
  const [clientes, setClientes] = useState(clientesIniciais);
  const [clienteId, setClienteId] = useState(dadosPuxados?.cliente_id ?? "");
  const [clienteNome, setClienteNome] = useState(dadosPuxados?.cliente_nome ?? "");
  const [clienteDocumento, setClienteDocumento] = useState(dadosPuxados?.cliente_documento ?? "");
  const [clienteEndereco, setClienteEndereco] = useState("");
  const ehFatura = tipo === "fatura";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {dadosPuxados?.proposta_id && (
        <input type="hidden" name="proposta_id" value={dadosPuxados.proposta_id} />
      )}
      {dadosPuxados?.contrato_id && (
        <input type="hidden" name="contrato_id" value={dadosPuxados.contrato_id} />
      )}
      {ehFatura && itensPuxados.length > 0 && (
        <input type="hidden" name="itens_puxados" value={JSON.stringify(itensPuxados)} />
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-preto">Tipo de documento</label>
        <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
          <button
            type="button"
            onClick={() => setTipo("fatura")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              tipo === "fatura" ? "bg-laranja text-branco-puro" : "text-neutro-1 hover:text-preto"
            }`}
          >
            Fatura
          </button>
          <button
            type="button"
            onClick={() => setTipo("recibo")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              tipo === "recibo" ? "bg-laranja text-branco-puro" : "text-neutro-1 hover:text-preto"
            }`}
          >
            Recibo
          </button>
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </div>

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
              setClienteNome(cliente.empresa || cliente.nome);
              setClienteDocumento(cliente.documento ?? "");
              setClienteEndereco(cliente.endereco ?? "");
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_nome" className="text-sm font-medium text-preto">
            Nome / Razão social
          </label>
          <input
            id="cliente_nome"
            name="cliente_nome"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_documento" className="text-sm font-medium text-preto">
            CPF/CNPJ
          </label>
          <input
            id="cliente_documento"
            name="cliente_documento"
            value={clienteDocumento}
            onChange={(e) => setClienteDocumento(e.target.value)}
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cliente_endereco" className="text-sm font-medium text-preto">
          Endereço completo do tomador
        </label>
        <input
          id="cliente_endereco"
          name="cliente_endereco"
          value={clienteEndereco}
          onChange={(e) => setClienteEndereco(e.target.value)}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_telefone" className="text-sm font-medium text-preto">
            Telefone do tomador
          </label>
          <input
            id="cliente_telefone"
            name="cliente_telefone"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_email" className="text-sm font-medium text-preto">
            E-mail do tomador
          </label>
          <input
            id="cliente_email"
            name="cliente_email"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      {ehFatura ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cliente_inscricao_municipal" className="text-sm font-medium text-preto">
            Inscrição municipal do tomador (opcional)
          </label>
          <input
            id="cliente_inscricao_municipal"
            name="cliente_inscricao_municipal"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cliente_inscricao_estadual" className="text-sm font-medium text-preto">
              Inscrição estadual (opcional)
            </label>
            <input
              id="cliente_inscricao_estadual"
              name="cliente_inscricao_estadual"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cliente_responsavel" className="text-sm font-medium text-preto">
              Responsável (opcional)
            </label>
            <input
              id="cliente_responsavel"
              name="cliente_responsavel"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="numero" className="text-sm font-medium text-preto">
            Número (opcional)
          </label>
          <input
            id="numero"
            name="numero"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="data_emissao" className="text-sm font-medium text-preto">
            Data de emissão
          </label>
          <input
            id="data_emissao"
            name="data_emissao"
            type="date"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      {ehFatura && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="numero_substituicao" className="text-sm font-medium text-preto">
              Número da substituição (opcional)
            </label>
            <input
              id="numero_substituicao"
              name="numero_substituicao"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="data_entrega" className="text-sm font-medium text-preto">
              Data da entrega
            </label>
            <input
              id="data_entrega"
              name="data_entrega"
              placeholder="ex.: 06 a 09/08/2026"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
        </div>
      )}

      {!ehFatura && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="valor_total" className="text-sm font-medium text-preto">
              Valor (R$)
            </label>
            <input
              id="valor_total"
              name="valor_total"
              type="number"
              step="0.01"
              min={0}
              defaultValue={dadosPuxados?.valor_total ?? 0}
              className="w-40 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="descricao" className="text-sm font-medium text-preto">
              Descrição · referente a
            </label>
            <input
              id="descricao"
              name="descricao"
              defaultValue={dadosPuxados?.descricao ?? ""}
              placeholder="ex.: prestação de serviços de locação de estruturas para o evento X"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="forma_pagamento" className="text-sm font-medium text-preto">
            Forma de pagamento
          </label>
          <input
            id="forma_pagamento"
            name="forma_pagamento"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vencimento" className="text-sm font-medium text-preto">
            Vencimento
          </label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signatario" className="text-sm font-medium text-preto">
          Signatário (opcional)
        </label>
        <select
          id="signatario"
          name="signatario"
          defaultValue=""
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        >
          <option value="">Nenhum</option>
          <option value="gabriel">Gabriel</option>
          <option value="higor">Higor</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="observacoes" className="text-sm font-medium text-preto">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      {ehFatura && dadosPuxados && dadosPuxados.valor_total > 0 && (
        <input type="hidden" name="valor_total" value={dadosPuxados.valor_total} />
      )}

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Criando..." : "Criar registro e continuar"}
      </Button>
    </form>
  );
}
