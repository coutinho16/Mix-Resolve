import Link from "next/link";
import { addDays, eachDayOfInterval, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

const DIAS_JANELA = 14;

export default async function DisponibilidadePage({
  searchParams,
}: {
  searchParams: Promise<{ inicio?: string }>;
}) {
  const { inicio: inicioParam } = await searchParams;
  const inicio = inicioParam ? new Date(`${inicioParam}T00:00:00`) : new Date(new Date().setHours(0, 0, 0, 0));
  const fim = addDays(inicio, DIAS_JANELA - 1);
  const dias = eachDayOfInterval({ start: inicio, end: fim });

  const supabase = await createClient();
  const [{ data: equipamentos }, { data: reservas }] = await Promise.all([
    supabase.from("equipamentos").select("*").eq("ativo", true).order("nome"),
    supabase
      .from("v_reservas_diarias")
      .select("*")
      .gte("data", format(inicio, "yyyy-MM-dd"))
      .lte("data", format(fim, "yyyy-MM-dd")),
  ]);

  function reservadoEm(equipamentoId: string, dia: Date) {
    const chave = format(dia, "yyyy-MM-dd");
    return (reservas ?? [])
      .filter((r) => r.equipamento_id === equipamentoId && r.data === chave)
      .reduce((soma, r) => soma + r.quantidade_reservada, 0);
  }

  const anteriorHref = `/gestao/disponibilidade?inicio=${format(addDays(inicio, -DIAS_JANELA), "yyyy-MM-dd")}`;
  const proximoHref = `/gestao/disponibilidade?inicio=${format(addDays(inicio, DIAS_JANELA), "yyyy-MM-dd")}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Disponibilidade
        </h1>
        <div className="flex gap-1">
          <Link
            href={anteriorHref}
            className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
            aria-label="Período anterior"
          >
            <ChevronLeft size={16} />
          </Link>
          <Link
            href={proximoHref}
            className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
            aria-label="Próximo período"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="sticky left-0 z-10 bg-branco-puro px-4 py-3 font-medium">
                Equipamento
              </th>
              {dias.map((d) => (
                <th key={d.toISOString()} className="px-2 py-3 text-center font-medium">
                  {format(d, "dd/MM", { locale: ptBR })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(equipamentos ?? []).map((eq) => {
              const capacidade = eq.quantidade_total - eq.quantidade_manutencao;
              return (
                <tr key={eq.id} className="border-b border-neutro-2 last:border-0">
                  <td className="sticky left-0 z-10 bg-branco-puro px-4 py-2 font-medium text-preto">
                    {eq.nome}
                  </td>
                  {dias.map((d) => {
                    const reservado = reservadoEm(eq.id, d);
                    const disponivel = capacidade - reservado;
                    const conflito = disponivel < 0;
                    return (
                      <td key={d.toISOString()} className="px-2 py-2 text-center">
                        {reservado === 0 ? (
                          <span className="text-neutro-1">{capacidade}</span>
                        ) : (
                          <Chip
                            estado={conflito ? "conflito" : "em-uso"}
                            texto={String(disponivel)}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {(!equipamentos || equipamentos.length === 0) && (
              <tr>
                <td colSpan={dias.length + 1} className="px-4 py-8 text-center text-neutro-1">
                  Nenhum equipamento cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <p className="text-xs text-neutro-1">
        Números em laranja indicam a quantidade ainda disponível no dia; em
        vermelho, quantidade reservada acima da capacidade (conflito).
      </p>
    </div>
  );
}
