import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { agruparPorSetor, type ItemComSetor } from "@/lib/pdf/agrupamento";
import { PropostaAcoes } from "@/components/propostas/PropostaAcoes";
import { GerarFinanceiroModal } from "@/components/financeiro/GerarFinanceiroModal";
import type { Cliente, StatusProposta } from "@/types/domain";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface PropostaResumoProps {
  propostaId: string;
  numeroCliente: number | null;
  status: StatusProposta;
  contratoId: string | null;
  itens: ItemComSetor[];
  valorTotal: number;
  clientes: Cliente[];
  cliente: Cliente | null;
}

export function PropostaResumo({
  propostaId,
  numeroCliente,
  status,
  contratoId,
  itens,
  valorTotal,
  clientes,
  cliente,
}: PropostaResumoProps) {
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
          Nenhum item adicionado ainda. Vá para a aba Equipamentos para começar.
        </p>
      ) : (
        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
          {grupos.map(([setor, itensDoSetor]) => (
            <div key={setor} className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-neutro-1">
                {setor}
              </span>
              {itensDoSetor.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-dashed border-neutro-2 pb-1 text-xs last:border-0"
                >
                  <span className="text-preto">
                    {item.descricao} <span className="text-neutro-1">x{item.quantidade}</span>
                  </span>
                  <span className="shrink-0 font-medium text-preto">
                    {fmt(item.valor_total)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-preto px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-branco/70">
          Total
        </span>
        <span className="font-titulo text-xl font-bold text-branco-puro">
          {fmt(valorTotal)}
        </span>
      </div>

      <a href={`/api/pdf/proposta/${propostaId}`} target="_blank" rel="noreferrer">
        <Button type="button" className="w-full">
          <Download size={16} />
          Baixar proposta em PDF
        </Button>
      </a>

      <GerarFinanceiroModal
        clientes={clientes}
        dadosPuxados={{
          tipo: "fatura",
          cliente_id: cliente?.id ?? "",
          cliente_nome: cliente ? cliente.empresa || cliente.nome : "",
          cliente_documento: cliente?.documento ?? "",
          cliente_endereco: cliente?.endereco ?? "",
          cliente_telefone: cliente?.telefone ?? "",
          cliente_email: cliente?.email ?? "",
          proposta_id: propostaId,
          contrato_id: "",
          descricao: `Referente à proposta${numeroCliente ? ` nº ${numeroCliente}` : ""}`,
          valor_total: valorTotal,
        }}
        itensPuxados={itens.map((i) => ({
          descricao: i.descricao,
          quantidade: i.quantidade,
          valor_unitario: i.valor_unitario,
          valor_total: i.valor_total,
        }))}
      />

      <div className="border-t border-neutro-2 pt-4">
        <PropostaAcoes propostaId={propostaId} status={status} contratoId={contratoId} />
      </div>
    </Card>
  );
}
