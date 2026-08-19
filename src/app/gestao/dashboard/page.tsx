import Link from "next/link";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Calendar, PackageSearch, Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const hoje = format(new Date(), "yyyy-MM-dd");
  const em7dias = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const [
    { data: proximosEventos },
    { data: conflitos },
    { data: equipamentos },
  ] = await Promise.all([
    supabase
      .from("eventos")
      .select("*, clientes(nome)")
      .neq("status", "cancelado")
      .lte("data_inicio", em7dias)
      .gte("data_fim", hoje)
      .order("data_inicio"),
    supabase.from("v_conflitos_agenda").select("*").gte("data", hoje),
    supabase.from("equipamentos").select("*").eq("ativo", true),
  ]);

  const estoqueBaixo = (equipamentos ?? []).filter((e) => {
    if (e.estoque_minimo == null) return false;
    const disponivel = e.quantidade_total - e.quantidade_em_uso - e.quantidade_manutencao;
    return disponivel <= e.estoque_minimo;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <Link href="/gestao/eventos/novo">
            <Button>
              <Plus size={16} />
              Novo evento
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AtalhoRapido href="/gestao/estoque" icon={PackageSearch} label="Estoque" />
        <AtalhoRapido href="/gestao/equipe" icon={Users} label="Equipe" />
        <AtalhoRapido href="/gestao/calendario" icon={Calendar} label="Calendário" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-titulo text-sm font-semibold uppercase tracking-wide text-neutro-1">
            Próximos eventos (7 dias)
          </h2>
          <ul className="flex flex-col gap-2">
            {(proximosEventos ?? []).map((e) => (
              <li key={e.id}>
                <Link
                  href={`/gestao/eventos/${e.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-neutro-3"
                >
                  <span className="font-medium text-preto">{e.nome}</span>
                  <span className="text-neutro-1">
                    {format(new Date(`${e.data_inicio}T00:00:00`), "dd/MM", { locale: ptBR })}
                  </span>
                </Link>
              </li>
            ))}
            {(!proximosEventos || proximosEventos.length === 0) && (
              <p className="px-2 text-sm text-neutro-1">
                Nenhum evento nos próximos 7 dias.
              </p>
            )}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-titulo text-sm font-semibold uppercase tracking-wide text-conflito">
            <AlertTriangle size={16} />
            Conflitos de agenda
          </h2>
          <ul className="flex flex-col gap-2">
            {(conflitos ?? []).slice(0, 8).map((c, i) => (
              <li
                key={`${c.equipamento_id}-${c.data}-${i}`}
                className="rounded-lg bg-conflito/10 px-3 py-2 text-sm text-preto"
              >
                {format(new Date(`${c.data}T00:00:00`), "dd/MM", { locale: ptBR })}:{" "}
                {c.total_reservado} reservados de {c.capacidade} disponíveis
              </li>
            ))}
            {(!conflitos || conflitos.length === 0) && (
              <p className="px-2 text-sm text-neutro-1">Nenhum conflito de agenda.</p>
            )}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-titulo text-sm font-semibold uppercase tracking-wide text-em-uso">
            <AlertTriangle size={16} />
            Estoque baixo
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {estoqueBaixo.map((e) => {
              const disponivel = e.quantidade_total - e.quantidade_em_uso - e.quantidade_manutencao;
              return (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-lg bg-em-uso/10 px-3 py-2 text-sm text-preto"
                >
                  <span>{e.nome}</span>
                  <span className="font-medium">{disponivel} disponível(is)</span>
                </li>
              );
            })}
            {estoqueBaixo.length === 0 && (
              <p className="px-2 text-sm text-neutro-1">
                Nenhum equipamento abaixo do estoque mínimo.
              </p>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function AtalhoRapido({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof PackageSearch;
  label: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
        <div className="rounded-lg bg-laranja/10 p-2 text-laranja">
          <Icon size={20} />
        </div>
        <span className="font-medium text-preto">{label}</span>
      </Card>
    </Link>
  );
}
