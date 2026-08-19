import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { agruparPorSetor, type ItemComSetor } from "@/lib/pdf/agrupamento";
import { PropostaAcoes } from "@/components/propostas/PropostaAcoes";
import type { StatusProposta } from "@/types/domain";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface PropostaResumoProps {
  propostaId: string;
  status: StatusProposta;
  contratoId: string | null;
  itens: ItemComSetor[];
  valorTotal: number;
}

export function PropostaResumo({
  propostaId,
  status,
  contratoId,
  itens,
  valorTotal,
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

      <div className="border-t border-neutro-2 pt-4">
        <PropostaAcoes propostaId={propostaId} status={status} contratoId={contratoId} />
      </div>
    </Card>
  );
}
