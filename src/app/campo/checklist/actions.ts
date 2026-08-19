"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/auth/session";

async function atualizarProgressoChecklist(checklistId: string) {
  const supabase = await createClient();
  const { data: itens } = await supabase
    .from("checklist_itens")
    .select("status")
    .eq("checklist_id", checklistId);

  if (!itens || itens.length === 0) return;

  const todosDefinidos = itens.every((i) => i.status !== "pendente");
  const algumDefinido = itens.some((i) => i.status !== "pendente");

  await supabase
    .from("checklists")
    .update({
      status: todosDefinidos ? "concluido" : algumDefinido ? "em_andamento" : "pendente",
      iniciado_em: algumDefinido ? new Date().toISOString() : null,
      concluido_em: todosDefinidos ? new Date().toISOString() : null,
    })
    .eq("id", checklistId);
}

export async function confirmarItemChecklist(
  itemId: string,
  checklistId: string,
  eventoId: string
) {
  const usuario = await getUsuarioAtual();
  const supabase = await createClient();

  await supabase
    .from("checklist_itens")
    .update({
      status: "confirmado",
      confirmado_por: usuario?.id ?? null,
      confirmado_em: new Date().toISOString(),
    })
    .eq("id", itemId);

  await atualizarProgressoChecklist(checklistId);
  revalidatePath(`/campo/checklist/montagem/${eventoId}`);
  revalidatePath(`/campo/checklist/devolucao/${eventoId}`);
}

export async function marcarItemAvariado(
  itemId: string,
  checklistId: string,
  eventoId: string,
  quantidadeAvariada: number,
  descricao: string
) {
  const usuario = await getUsuarioAtual();
  const supabase = await createClient();

  await supabase
    .from("checklist_itens")
    .update({
      status: "avariado",
      quantidade_avariada: quantidadeAvariada,
      descricao_avaria: descricao,
      confirmado_por: usuario?.id ?? null,
      confirmado_em: new Date().toISOString(),
    })
    .eq("id", itemId);

  await atualizarProgressoChecklist(checklistId);
  revalidatePath(`/campo/checklist/devolucao/${eventoId}`);
}
