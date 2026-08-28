"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { agruparPorSetor, type ItemComSetor } from "@/lib/pdf/agrupamento";
import { atualizarStatusContrato } from "@/app/gestao/contratos/actions";
import { GerarFinanceiroModal } from "@/components/financeiro/GerarFinanceiroModal";
import type { Cliente, Contrato, StatusContrato } from "@/types/domain";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const rotulo: Record<StatusContrato, string> = {
  gerado: "Gerado",
  assinado: "Assinado",
  cancelado: "Cancelado",
};

interface ContratoResumoProps {
  contrato: Contrato;
  clientes: Cliente[];
  itens: ItemComSetor[];
  valorTotal: number;
  ehPermuta: boolean;
}

export function ContratoResumo({ contrato, clientes, itens, valorTotal, ehPermuta }: ContratoResumoProps) {
  const contratoId = contrato.id;
  const status = contrato.status;
  const [pending, startTransition] = useTransition();
  const grupos = agruparPorSetor(itens);
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <Card className="sticky top-6 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-titulo text-base font-semibold text-preto">Resumo</h2>
        <span className="rounded-full bg-laranja/10 px-2.5 py-1 text-xs font-bold text-laranja">
          {totalItens} {totalItens === 1 ? "item" : "itens"}
        </span>
      </div>

      {grupos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
          Nenhum item adicionado ainda.
        </p>
      ) : (
        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
          {grupos.map(([setor, itensDoSetor]) => (
            <div key={setor} className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-neutro-1">{setor}</span>
              {itensDoSetor.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-dashed border-neutro-2 pb-1 text-xs last:border-0"
                >
                  <span className="text-preto">
                    {item.descricao} <span className="text-neutro-1">x{item.quantidade}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-preto px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-branco/70">
          {ehPermuta ? "Valor da permuta" : "Total"}
        </span>
        <span className="font-titulo text-xl font-bold text-branco-puro">{fmt(valorTotal)}</span>
      </div>

      <a href={`/api/pdf/contrato/${contratoId}`} target="_blank" rel="noreferrer">
        <Button type="button" className="w-full">
          <Download size={16} />
          Baixar contrato em PDF
        </Button>
      </a>

      <GerarFinanceiroModal
        clientes={clientes}
        dadosPuxados={{
          tipo: "fatura",
          cliente_id: contrato.cliente_id ?? "",
          cliente_nome: contrato.contratante_nome,
          cliente_documento: contrato.contratante_documento ?? "",
          cliente_endereco: contrato.contratante_endereco ?? "",
          proposta_id: "",
          contrato_id: contratoId,
          descricao: `Referente ao contrato${contrato.numero_cliente ? ` nº ${contrato.numero_cliente}` : ""}`,
          valor_total: ehPermuta ? contrato.permuta_valor ?? 0 : valorTotal,
        }}
        itensPuxados={itens.map((i) => ({
          descricao: i.descricao,
          quantidade: i.quantidade,
          valor_unitario: i.valor_unitario,
          valor_total: i.valor_total,
        }))}
      />

      <div className="flex flex-wrap items-center gap-2 border-t border-neutro-2 pt-4">
        <Chip estado={status === "assinado" ? "disponivel" : "em-uso"} texto={rotulo[status]} />
        {status === "gerado" && (
          <Button
            type="button"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusContrato(contratoId, "assinado"))}
          >
            Marcar como assinado
          </Button>
        )}
        {status === "assinado" && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusContrato(contratoId, "gerado"))}
          >
            Desfazer assinatura
          </Button>
        )}
        {status === "cancelado" && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusContrato(contratoId, "gerado"))}
          >
            Reativar contrato
          </Button>
        )}
        {status !== "cancelado" && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusContrato(contratoId, "cancelado"))}
          >
            Cancelar
          </Button>
        )}
      </div>
    </Card>
  );
}
