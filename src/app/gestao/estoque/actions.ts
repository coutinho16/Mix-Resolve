"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categoriaSchema, equipamentoSchema } from "@/lib/validations/equipamento";

export interface EstoqueActionState {
  erro?: string;
  sucesso?: boolean;
}

const estadoOk: EstoqueActionState = { sucesso: true };

export async function criarCategoria(
  _prev: EstoqueActionState,
  formData: FormData
): Promise<EstoqueActionState> {
  const parsed = categoriaSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("categorias_equipamento").insert(parsed.data);
  if (error) return { erro: "Não foi possível criar a categoria." };

  revalidatePath("/gestao/estoque");
  return estadoOk;
}

function extrairEquipamento(formData: FormData) {
  return {
    categoria_id: String(formData.get("categoria_id") ?? ""),
    nome: String(formData.get("nome") ?? ""),
    quantidade_total: formData.get("quantidade_total"),
    preco_referencia: formData.get("preco_referencia") || undefined,
    estoque_minimo: formData.get("estoque_minimo") || undefined,
  };
}

export async function criarEquipamento(
  _prev: EstoqueActionState,
  formData: FormData
): Promise<EstoqueActionState> {
  const parsed = equipamentoSchema.safeParse(extrairEquipamento(formData));
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("equipamentos").insert(parsed.data);
  if (error) return { erro: "Não foi possível salvar o equipamento." };

  revalidatePath("/gestao/estoque");
  return estadoOk;
}

export async function atualizarEquipamento(
  id: string,
  _prev: EstoqueActionState,
  formData: FormData
): Promise<EstoqueActionState> {
  const parsed = equipamentoSchema.safeParse(extrairEquipamento(formData));
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("equipamentos")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { erro: "Não foi possível atualizar o equipamento." };

  revalidatePath("/gestao/estoque");
  return estadoOk;
}

export async function excluirEquipamento(id: string) {
  const supabase = await createClient();
  await supabase.from("equipamentos").update({ ativo: false }).eq("id", id);
  revalidatePath("/gestao/estoque");
}
