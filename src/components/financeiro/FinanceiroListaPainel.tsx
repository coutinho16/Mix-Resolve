"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { Financeiro, StatusFinanceiro } from "@/types/domain";

interface RegistroFinanceiro extends Financeiro {
  clientes: { numero: number } | null;
}

interface FinanceiroListaPainelProps {
  faturas: RegistroFinanceiro[];
  recibos: RegistroFinanceiro[];
}

const rotuloStatus: Record<StatusFinanceiro, string> = {
  rascunho: "Pendente",
  emitido: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
};

function estadoChip(status: StatusFinanceiro) {
  if (status === "pago") return "disponivel" as const;
  if (status === "cancelado") return "conflito" as const;
  return "em-uso" as const;
}

function fmtData(iso: string | null) {
  if (!iso) return "-";
  return format(new Date(`${iso}T00:00:00`), "dd/MM/yyyy", { locale: ptBR });
}

export function FinanceiroListaPainel({ faturas, recibos }: FinanceiroListaPainelProps) {
  const [aba, setAba] = useState<"fatura" | "recibo">("fatura");
  const registros = aba === "fatura" ? faturas : recibos;
  const prefixo = aba === "fatura" ? "N" : "R";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-xl bg-neutro-3 p-1 sm:w-fit">
        <button
          type="button"
          onClick={() => setAba("fatura")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
            aba === "fatura" ? "bg-branco-puro text-preto shadow-sm" : "text-neutro-1 hover:text-preto"
          }`}
        >
          Nota de Fatura
        </button>
        <button
          type="button"
          onClick={() => setAba("recibo")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
            aba === "recibo" ? "bg-branco-puro text-preto shadow-sm" : "text-neutro-1 hover:text-preto"
          }`}
        >
          Recibos
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Emissão</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id} className="border-b border-neutro-2 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/gestao/financeiro/${r.id}`}
                    className="font-medium text-preto hover:text-laranja"
                  >
                    {formatarNumeroDocumento(r.clientes?.numero, prefixo, r.numero_cliente)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutro-1">{r.cliente_nome || "-"}</td>
                <td className="px-4 py-3 text-neutro-1">R$ {r.valor_total.toFixed(2)}</td>
                <td className="px-4 py-3 text-neutro-1">{fmtData(r.data_emissao)}</td>
                <td className="px-4 py-3">
                  <Chip estado={estadoChip(r.status)} texto={rotuloStatus[r.status]} />
                </td>
              </tr>
            ))}
            {registros.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutro-1">
                  {aba === "fatura"
                    ? "Nenhuma nota de fatura cadastrada ainda."
                    : "Nenhum recibo cadastrado ainda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
