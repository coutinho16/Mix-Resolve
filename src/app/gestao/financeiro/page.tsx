import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { StatusFinanceiro, TipoFinanceiro } from "@/types/domain";

const rotuloStatus: Record<StatusFinanceiro, string> = {
  rascunho: "Rascunho",
  emitido: "Emitido",
  pago: "Pago",
  cancelado: "Cancelado",
};

const rotuloTipo: Record<TipoFinanceiro, string> = {
  fatura: "Fatura",
  recibo: "Recibo",
};

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: registros } = await supabase
    .from("financeiro")
    .select("*, clientes(numero)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">Financeiro</h1>
        <Link href="/gestao/financeiro/novo">
          <Button>
            <Plus size={16} />
            Nova fatura ou recibo
          </Button>
        </Link>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(registros ?? []).map((r) => {
              const cliente = (r as unknown as { clientes?: { numero: number } }).clientes;
              return (
                <tr key={r.id} className="border-b border-neutro-2 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/gestao/financeiro/${r.id}`}
                      className="font-medium text-preto hover:text-laranja"
                    >
                      {formatarNumeroDocumento(cliente?.numero, r.tipo === "fatura" ? "N" : "R", r.numero_cliente)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutro-1">{rotuloTipo[r.tipo]}</td>
                  <td className="px-4 py-3 text-neutro-1">{r.cliente_nome || "-"}</td>
                  <td className="px-4 py-3 text-neutro-1">R$ {r.valor_total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Chip estado={r.status === "pago" ? "disponivel" : "em-uso"} texto={rotuloStatus[r.status]} />
                  </td>
                </tr>
              );
            })}
            {(!registros || registros.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutro-1">
                  Nenhuma fatura ou recibo cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
