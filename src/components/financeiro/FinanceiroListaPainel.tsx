"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

type FiltroStatus = "todos" | "pendente" | "pago";

const rotuloStatus: Record<StatusFinanceiro, string> = {
  rascunho: "Pendente",
  emitido: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
};

const filtros: { id: FiltroStatus; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendente", label: "Pendentes" },
  { id: "pago", label: "Pagos" },
];

function estadoChip(status: StatusFinanceiro) {
  if (status === "pago") return "disponivel" as const;
  if (status === "cancelado") return "conflito" as const;
  return "em-uso" as const;
}

function fmtData(iso: string | null) {
  if (!iso) return "-";
  return format(new Date(`${iso}T00:00:00`), "dd/MM/yyyy", { locale: ptBR });
}

function combinaFiltro(status: StatusFinanceiro, filtro: FiltroStatus) {
  if (filtro === "todos") return true;
  if (filtro === "pago") return status === "pago";
  return status === "rascunho" || status === "emitido";
}

export function FinanceiroListaPainel({ faturas, recibos }: FinanceiroListaPainelProps) {
  const [aba, setAba] = useState<"fatura" | "recibo">("fatura");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  const todosDaAba = aba === "fatura" ? faturas : recibos;
  const registros = useMemo(
    () => todosDaAba.filter((r) => combinaFiltro(r.status, filtroStatus)),
    [todosDaAba, filtroStatus]
  );
  const prefixo = aba === "fatura" ? "N" : "R";

  const hrefExportar = `/api/pdf/financeiro-lista?tipo=${aba}&status=${filtroStatus}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
          <button
            type="button"
            onClick={() => setAba("fatura")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              aba === "fatura" ? "bg-branco-puro text-preto shadow-sm" : "text-neutro-1 hover:text-preto"
            }`}
          >
            Nota de Fatura
          </button>
          <button
            type="button"
            onClick={() => setAba("recibo")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              aba === "recibo" ? "bg-branco-puro text-preto shadow-sm" : "text-neutro-1 hover:text-preto"
            }`}
          >
            Recibos
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltroStatus(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filtroStatus === f.id ? "bg-laranja text-branco-puro" : "text-neutro-1 hover:text-preto"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <a href={hrefExportar} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary">
              <Download size={16} />
              Exportar PDF
            </Button>
          </a>
        </div>
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
                    ? "Nenhuma nota de fatura encontrada para este filtro."
                    : "Nenhum recibo encontrado para este filtro."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
