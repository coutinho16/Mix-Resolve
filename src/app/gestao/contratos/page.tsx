import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import type { StatusContrato } from "@/types/domain";

const rotulo: Record<StatusContrato, string> = {
  gerado: "Gerado",
  assinado: "Assinado",
  cancelado: "Cancelado",
};

export default async function ContratosPage() {
  const supabase = await createClient();
  const { data: contratos } = await supabase
    .from("contratos")
    .select("*")
    .order("gerado_em", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">Contratos</h1>
        <Link href="/gestao/contratos/novo">
          <Button>
            <Plus size={16} />
            Novo contrato
          </Button>
        </Link>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Contratante</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(contratos ?? []).map((c) => (
              <tr key={c.id} className="border-b border-neutro-2 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/gestao/contratos/${c.id}`}
                    className="font-medium text-preto hover:text-laranja"
                  >
                    {c.contratante_nome || "-"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutro-1">R$ {c.valor_total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Chip estado={c.status === "assinado" ? "disponivel" : "em-uso"} texto={rotulo[c.status]} />
                </td>
              </tr>
            ))}
            {(!contratos || contratos.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutro-1">
                  Nenhum contrato cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
