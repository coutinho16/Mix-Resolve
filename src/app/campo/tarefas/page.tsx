import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { getUsuarioAtual } from "@/lib/auth/session";

export default async function MinhasTarefasPage() {
  const usuario = await getUsuarioAtual();
  const supabase = await createClient();

  const { data: escalas } = await supabase
    .from("evento_equipe")
    .select("*, eventos(*)")
    .eq("usuario_id", usuario!.id);

  const eventoIds = (escalas ?? [])
    .map((e) => (e as unknown as { eventos: { id: string } | null }).eventos?.id)
    .filter((id): id is string => Boolean(id));

  const { data: checklists } =
    eventoIds.length > 0
      ? await supabase.from("checklists").select("*").in("evento_id", eventoIds)
      : { data: [] };

  type EscalaComEvento = {
    id: string;
    etapa: "montagem" | "operacao" | "desmontagem";
    eventos: {
      id: string;
      nome: string;
      local: string | null;
      data_inicio: string;
      data_montagem: string | null;
      hora_montagem: string | null;
      status: string;
    } | null;
  };

  const escalasTipadas = (escalas ?? []) as unknown as EscalaComEvento[];
  const ativas = escalasTipadas.filter(
    (e) => e.eventos && e.eventos.status !== "cancelado"
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-titulo text-xl font-semibold text-preto">
        Minhas tarefas
      </h1>

      {ativas.length === 0 && (
        <p className="text-sm text-neutro-1">
          Nenhum evento escalado para você no momento.
        </p>
      )}

      {ativas.map((escala) => {
        const evento = escala.eventos!;
        const checklistMontagem = (checklists ?? []).find(
          (c) => c.evento_id === evento.id && c.tipo === "montagem"
        );
        const checklistDevolucao = (checklists ?? []).find(
          (c) => c.evento_id === evento.id && c.tipo === "devolucao"
        );

        return (
          <Card key={escala.id} className="flex flex-col gap-3">
            <div>
              <p className="font-titulo text-base font-semibold text-preto">
                {evento.nome}
              </p>
              <div className="mt-1 flex flex-col gap-1 text-sm text-neutro-1">
                {evento.local && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {evento.local}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {format(new Date(`${evento.data_inicio}T00:00:00`), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                  {evento.hora_montagem && ` · montagem ${evento.hora_montagem}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {escala.etapa === "montagem" && (
                <BotaoChecklist
                  href={`/campo/checklist/montagem/${evento.id}`}
                  titulo="Checklist de montagem"
                  status={checklistMontagem?.status}
                />
              )}
              {escala.etapa === "desmontagem" && (
                <BotaoChecklist
                  href={`/campo/checklist/devolucao/${evento.id}`}
                  titulo="Checklist de devolução"
                  status={checklistDevolucao?.status}
                />
              )}
              {escala.etapa === "operacao" && (
                <p className="text-xs text-neutro-1">
                  Você está escalado para operação neste evento.
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BotaoChecklist({
  href,
  titulo,
  status,
}: {
  href: string;
  titulo: string;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-neutro-2 px-3 py-2.5 text-sm hover:bg-neutro-3"
    >
      <span className="font-medium text-preto">{titulo}</span>
      <span className="flex items-center gap-1 text-neutro-1">
        {status === "concluido" ? "Concluído" : status === "em_andamento" ? "Em andamento" : "Pendente"}
        <ChevronRight size={16} />
      </span>
    </Link>
  );
}
