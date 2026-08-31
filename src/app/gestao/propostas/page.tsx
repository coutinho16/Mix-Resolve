import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { StatusProposta } from "@/types/domain";

const rotulo: Record<StatusProposta, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aceita: "Aceita",
  recusada: "Recusada",
  expirada: "Expirada",
};

export default async function PropostasPage() {
  const supabase = await createClient();
  const { data: propostas } = await supabase
    .from("propostas")
    .select("*, clientes(nome, numero)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Propostas e Contratos
        </h1>
        <Link href="/gestao/propostas/novo">
          <Button>
            <Plus size={16} />
            Nova proposta
          </Button>
        </Link>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(propostas ?? []).map((p) => {
              const cliente = (p as unknown as { clientes?: { nome: string; numero: number } }).clientes;
              return (
                <tr key={p.id} className="border-b border-neutro-2 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/gestao/propostas/${p.id}`}
                      className="font-medium text-preto hover:text-laranja"
                    >
                      {formatarNumeroDocumento(cliente?.numero, "P", p.numero_cliente)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutro-1">{cliente?.nome ?? "-"}</td>
                  <td className="px-4 py-3 text-neutro-1">
                    R$ {p.valor_total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Chip
                      estado={p.status === "aceita" ? "disponivel" : "em-uso"}
                      texto={rotulo[p.status]}
                    />
                  </td>
                </tr>
              );
            })}
            {(!propostas || propostas.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutro-1">
                  Nenhuma proposta cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
