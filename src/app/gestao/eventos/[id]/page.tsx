import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventoForm } from "@/components/gestao/EventoForm";
import { EventoEquipamentosSection } from "@/components/gestao/EventoEquipamentosSection";
import { EventoEquipeSection } from "@/components/gestao/EventoEquipeSection";
import { EventoAcoesStatus } from "@/components/gestao/EventoAcoesStatus";
import { atualizarEvento } from "@/app/gestao/eventos/actions";

export default async function EventoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: evento },
    { data: clientes },
    { data: equipamentos },
    { data: equipeCampo },
    { data: itensReservados },
    { data: membrosEscalados },
  ] = await Promise.all([
    supabase.from("eventos").select("*").eq("id", id).single(),
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("equipamentos").select("*").eq("ativo", true).order("nome"),
    supabase.from("usuarios").select("*").eq("perfil", "campo").eq("ativo", true).order("nome"),
    supabase.from("evento_equipamentos").select("*").eq("evento_id", id),
    supabase.from("evento_equipe").select("*").eq("evento_id", id),
  ]);

  if (!evento) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          {evento.nome}
        </h1>
        <EventoAcoesStatus eventoId={evento.id} status={evento.status} />
      </div>

      <div className="rounded-xl border border-neutro-2 bg-branco-puro p-6">
        <EventoForm
          clientes={clientes ?? []}
          evento={evento}
          action={atualizarEvento.bind(null, evento.id)}
        />
      </div>

      <div className="rounded-xl border border-neutro-2 bg-branco-puro p-6">
        <EventoEquipeSection
          eventoId={evento.id}
          equipeCampo={equipeCampo ?? []}
          membros={membrosEscalados ?? []}
        />
      </div>

      <div className="rounded-xl border border-neutro-2 bg-branco-puro p-6">
        <EventoEquipamentosSection
          eventoId={evento.id}
          equipamentos={equipamentos ?? []}
          itens={itensReservados ?? []}
        />
      </div>
    </div>
  );
}
