import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChecklistMontagemLista } from "@/components/campo/ChecklistMontagemLista";

export default async function ChecklistMontagemPage({
  params,
}: {
  params: Promise<{ eventoId: string }>;
}) {
  const { eventoId } = await params;
  const supabase = await createClient();

  const [{ data: evento }, { data: checklist }] = await Promise.all([
    supabase.from("eventos").select("*").eq("id", eventoId).single(),
    supabase
      .from("checklists")
      .select("*")
      .eq("evento_id", eventoId)
      .eq("tipo", "montagem")
      .single(),
  ]);

  if (!evento || !checklist) notFound();

  const [{ data: itens }, { data: equipamentos }] = await Promise.all([
    supabase
      .from("checklist_itens")
      .select("*")
      .eq("checklist_id", checklist.id)
      .order("id"),
    supabase.from("equipamentos").select("*"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-titulo text-xl font-semibold text-preto">
          Checklist de montagem
        </h1>
        <p className="text-sm text-neutro-1">{evento.nome}</p>
      </div>

      <ChecklistMontagemLista
        checklistId={checklist.id}
        eventoId={eventoId}
        itens={itens ?? []}
        equipamentos={equipamentos ?? []}
      />
    </div>
  );
}
