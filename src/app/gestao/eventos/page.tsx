import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";

const rotuloStatus: Record<string, string> = {
  orcamento: "Orçamento",
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select("*, clientes(nome)")
    .order("data_inicio", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">Eventos</h1>
        <Link href="/gestao/eventos/novo">
          <Button>
            <Plus size={16} />
            Novo evento
          </Button>
        </Link>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Evento</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Local</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(eventos ?? []).map((e) => (
              <tr key={e.id} className="border-b border-neutro-2 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/gestao/eventos/${e.id}`}
                    className="font-medium text-preto hover:text-laranja"
                  >
                    {e.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutro-1">
                  {(e as unknown as { clientes?: { nome: string } }).clientes?.nome ?? "-"}
                </td>
                <td className="px-4 py-3 text-neutro-1">
                  {format(new Date(e.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                  {e.data_fim !== e.data_inicio &&
                    ` a ${format(new Date(e.data_fim), "dd/MM/yyyy", { locale: ptBR })}`}
                </td>
                <td className="px-4 py-3 text-neutro-1">{e.local ?? "-"}</td>
                <td className="px-4 py-3 text-neutro-1">
                  {rotuloStatus[e.status]}
                </td>
              </tr>
            ))}
            {(!eventos || eventos.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutro-1">
                  Nenhum evento cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
