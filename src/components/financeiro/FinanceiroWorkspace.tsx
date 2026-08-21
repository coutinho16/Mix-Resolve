"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FinanceiroItensEditor } from "@/components/financeiro/FinanceiroItensEditor";
import { FinanceiroResumo } from "@/components/financeiro/FinanceiroResumo";
import { atualizarFinanceiro } from "@/app/gestao/financeiro/actions";
import type {
  Assinante,
  Cliente,
  Financeiro,
  FinanceiroItem,
  TipoFinanceiro,
} from "@/types/domain";
import type { FinanceiroActionState } from "@/app/gestao/financeiro/actions";

const estadoInicial: FinanceiroActionState = {};

interface FinanceiroWorkspaceProps {
  financeiro: Financeiro;
  clientes: Cliente[];
  itens: FinanceiroItem[];
}

export function FinanceiroWorkspace({ financeiro, clientes, itens }: FinanceiroWorkspaceProps) {
  const [state, formAction, pending] = useActionState(
    atualizarFinanceiro.bind(null, financeiro.id),
    estadoInicial
  );
  const [tipo, setTipo] = useState<TipoFinanceiro>(financeiro.tipo);
  const [signatario, setSignatario] = useState<Assinante | "">(financeiro.signatario ?? "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">
            {tipo === "fatura" ? "Fatura" : "Recibo"}
            {financeiro.numero ? ` nº ${financeiro.numero}` : ""}
          </h1>
          <p className="text-sm text-neutro-1">
            {financeiro.cliente_nome || "Sem cliente definido"}
            <span className="text-neutro-1/70"> · controle #{financeiro.numero_controle}</span>
          </p>
        </div>
        <Link href="/gestao/clientes">
          <Button type="button" variant="secondary">
            <Users size={16} />
            Clientes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <Card className="flex flex-col gap-5 p-5">
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-preto">Tipo de documento</label>
              <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
                {(["fatura", "recibo"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                      tipo === t ? "bg-laranja text-branco-puro" : "text-neutro-1 hover:text-preto"
                    }`}
                  >
                    {t === "fatura" ? "Fatura" : "Recibo"}
                  </button>
                ))}
              </div>
              <input type="hidden" name="tipo" value={tipo} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
                Cliente salvo (opcional)
              </label>
              <select
                id="cliente_id"
                name="cliente_id"
                defaultValue={financeiro.cliente_id ?? ""}
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              >
                <option value="">Nenhum</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cliente_nome" className="text-sm font-medium text-preto">
                  Nome / Razão social
                </label>
                <input
                  id="cliente_nome"
                  name="cliente_nome"
                  defaultValue={financeiro.cliente_nome ?? ""}
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
                  defaultValue={financeiro.cliente_documento ?? ""}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="numero" className="text-sm font-medium text-preto">
                  Número (opcional)
                </label>
                <input
                  id="numero"
                  name="numero"
                  defaultValue={financeiro.numero ?? ""}
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
                  defaultValue={financeiro.data_emissao ?? ""}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="descricao" className="text-sm font-medium text-preto">
                Descrição
              </label>
              <input
                id="descricao"
                name="descricao"
                defaultValue={financeiro.descricao ?? ""}
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forma_pagamento" className="text-sm font-medium text-preto">
                  Forma de pagamento
                </label>
                <input
                  id="forma_pagamento"
                  name="forma_pagamento"
                  defaultValue={financeiro.forma_pagamento ?? ""}
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
                  defaultValue={financeiro.vencimento ?? ""}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-preto">Responsável pela Mix (opcional)</span>
              <div className="flex gap-4 pt-2">
                {(["gabriel", "higor"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-preto">
                    <input
                      type="radio"
                      name="signatario"
                      value={s}
                      checked={signatario === s}
                      onChange={() => setSignatario(s)}
                      className="h-4 w-4 accent-laranja"
                    />
                    {s === "gabriel" ? "Gabriel Coutinho" : "Higor Amaral"}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-preto">
                  <input
                    type="radio"
                    name="signatario"
                    value=""
                    checked={signatario === ""}
                    onChange={() => setSignatario("")}
                    className="h-4 w-4 accent-laranja"
                  />
                  Nenhum
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="observacoes" className="text-sm font-medium text-preto">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                defaultValue={financeiro.observacoes ?? ""}
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>

            {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>

          <FinanceiroItensEditor financeiroId={financeiro.id} itens={itens} />
        </Card>

        <FinanceiroResumo
          financeiroId={financeiro.id}
          status={financeiro.status}
          itens={itens}
          valorTotal={financeiro.valor_total}
        />
      </div>
    </div>
  );
}
