"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/auth/session";
import { eventoSchema } from "@/lib/validations/evento";

export interface EventoActionState {
  erro?: string;
}

function extrair(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    cliente_id: String(formData.get("cliente_id") ?? "") || undefined,
    data_inicio: String(formData.get("data_inicio") ?? ""),
    data_fim: String(formData.get("data_fim") ?? ""),
    data_montagem: String(formData.get("data_montagem") ?? "") || undefined,
    hora_montagem: String(formData.get("hora_montagem") ?? "") || undefined,
    local: String(formData.get("local") ?? "") || undefined,
    observacoes: String(formData.get("observacoes") ?? "") || undefined,
  };
}

export async function criarEvento(
  _prev: EventoActionState,
  formData: FormData
): Promise<EventoActionState> {
  const parsed = eventoSchema.safeParse(extrair(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const usuario = await getUsuarioAtual();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eventos")
    .insert({ ...parsed.data, created_by: usuario?.id ?? null })
    .select("id")
    .single();

  if (error || !data) return { erro: "Não foi possível criar o evento." };

  redirect(`/gestao/eventos/${data.id}`);
}

export async function atualizarEvento(
  id: string,
  _prev: EventoActionState,
  formData: FormData
): Promise<EventoActionState> {
  const parsed = eventoSchema.safeParse(extrair(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("eventos")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { erro: "Não foi possível atualizar o evento." };

  revalidatePath(`/gestao/eventos/${id}`);
  return {};
}

export async function confirmarEvento(id: string) {
  const supabase = await createClient();
  await supabase.from("eventos").update({ status: "confirmado" }).eq("id", id);
  await supabase.rpc("fn_gerar_checklists", { p_evento_id: id });
  revalidatePath(`/gestao/eventos/${id}`);
}

export async function cancelarEvento(id: string) {
  const supabase = await createClient();
  await supabase.from("eventos").update({ status: "cancelado" }).eq("id", id);
  revalidatePath(`/gestao/eventos/${id}`);
}

export async function adicionarEquipamentoEvento(
  eventoId: string,
  equipamentoId: string,
  quantidade: number
) {
  const supabase = await createClient();
  await supabase.from("evento_equipamentos").upsert(
    {
      evento_id: eventoId,
      equipamento_id: equipamentoId,
      quantidade_reservada: quantidade,
    },
    { onConflict: "evento_id,equipamento_id" }
  );
  revalidatePath(`/gestao/eventos/${eventoId}`);
}

export async function removerEquipamentoEvento(eventoId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("evento_equipamentos").delete().eq("id", itemId);
  revalidatePath(`/gestao/eventos/${eventoId}`);
}

export async function adicionarMembroEquipe(
  eventoId: string,
  usuarioId: string,
  etapa: "montagem" | "operacao" | "desmontagem",
  funcao?: string
) {
  const supabase = await createClient();
  await supabase.from("evento_equipe").insert({
    evento_id: eventoId,
    usuario_id: usuarioId,
    etapa,
    funcao: funcao || null,
  });
  revalidatePath(`/gestao/eventos/${eventoId}`);
}

export async function removerMembroEquipe(eventoId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("evento_equipe").delete().eq("id", itemId);
  revalidatePath(`/gestao/eventos/${eventoId}`);
}
