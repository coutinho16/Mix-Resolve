"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/auth/session";
import { financeiroSchema, itemFinanceiroSchema } from "@/lib/validations/financeiro";

export interface FinanceiroActionState {
  erro?: string;
}

interface ItemPuxado {
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

function extrairFinanceiro(formData: FormData) {
  return {
    tipo: String(formData.get("tipo") ?? "fatura"),
    numero: String(formData.get("numero") ?? "") || undefined,
    data_emissao: String(formData.get("data_emissao") ?? "") || undefined,
    cliente_id: String(formData.get("cliente_id") ?? "") || undefined,
    cliente_nome: String(formData.get("cliente_nome") ?? "") || undefined,
    cliente_documento: String(formData.get("cliente_documento") ?? "") || undefined,
    cliente_endereco: String(formData.get("cliente_endereco") ?? "") || undefined,
    cliente_telefone: String(formData.get("cliente_telefone") ?? "") || undefined,
    cliente_email: String(formData.get("cliente_email") ?? "") || undefined,
    cliente_inscricao_municipal: String(formData.get("cliente_inscricao_municipal") ?? "") || undefined,
    cliente_inscricao_estadual: String(formData.get("cliente_inscricao_estadual") ?? "") || undefined,
    cliente_responsavel: String(formData.get("cliente_responsavel") ?? "") || undefined,
    proposta_id: String(formData.get("proposta_id") ?? "") || undefined,
    contrato_id: String(formData.get("contrato_id") ?? "") || undefined,
    descricao: String(formData.get("descricao") ?? "") || undefined,
    data_entrega: String(formData.get("data_entrega") ?? "") || undefined,
    numero_substituicao: String(formData.get("numero_substituicao") ?? "") || undefined,
    valor_total: formData.get("valor_total") || undefined,
    forma_pagamento: String(formData.get("forma_pagamento") ?? "") || undefined,
    vencimento: String(formData.get("vencimento") ?? "") || undefined,
    observacoes: String(formData.get("observacoes") ?? "") || undefined,
    signatario: String(formData.get("signatario") ?? "") || undefined,
  };
}

function extrairItensPuxados(formData: FormData): ItemPuxado[] {
  const bruto = String(formData.get("itens_puxados") ?? "");
  if (!bruto) return [];
  try {
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    return lista
      .map((i) => ({
        descricao: String(i.descricao ?? ""),
        quantidade: Number(i.quantidade) || 1,
        valor_unitario: Number(i.valor_unitario) || 0,
        valor_total: Number(i.valor_total) || 0,
      }))
      .filter((i) => i.descricao);
  } catch {
    return [];
  }
}

export async function criarFinanceiro(
  _prev: FinanceiroActionState,
  formData: FormData
): Promise<FinanceiroActionState> {
  const parsed = financeiroSchema.safeParse(extrairFinanceiro(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const usuario = await getUsuarioAtual();
  const supabase = await createClient();

  const dados = { ...parsed.data } as Record<string, unknown>;
  if (!dados.cliente_id) delete dados.cliente_id;
  if (!dados.proposta_id) delete dados.proposta_id;
  if (!dados.contrato_id) delete dados.contrato_id;
  if (!dados.signatario) delete dados.signatario;

  const { data, error } = await supabase
    .from("financeiro")
    .insert({ ...dados, created_by: usuario?.id ?? null } as never)
    .select("id")
    .single();

  if (error || !data) return { erro: "Não foi possível criar o registro financeiro." };

  const itensPuxados = extrairItensPuxados(formData);
  if (itensPuxados.length > 0) {
    await supabase.from("financeiro_itens").insert(
      itensPuxados.map((item, ordem) => ({ financeiro_id: data.id, ordem, ...item }))
    );
    await recalcularValorTotal(data.id);
  }

  redirect(`/gestao/financeiro/${data.id}`);
}

export async function atualizarFinanceiro(
  id: string,
  _prev: FinanceiroActionState,
  formData: FormData
): Promise<FinanceiroActionState> {
  const parsed = financeiroSchema.safeParse(extrairFinanceiro(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const dados = { ...parsed.data } as Record<string, unknown>;
  if (!dados.cliente_id) dados.cliente_id = null;
  if (!dados.proposta_id) dados.proposta_id = null;
  if (!dados.contrato_id) dados.contrato_id = null;
  if (!dados.signatario) dados.signatario = null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("financeiro")
    .update({ ...dados, updated_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) return { erro: "Não foi possível atualizar o registro financeiro." };

  revalidatePath(`/gestao/financeiro/${id}`);
  return {};
}

async function recalcularValorTotal(financeiroId: string) {
  const supabase = await createClient();
  const { data: itens } = await supabase
    .from("financeiro_itens")
    .select("valor_total")
    .eq("financeiro_id", financeiroId);

  const total = (itens ?? []).reduce((acc, i) => acc + Number(i.valor_total ?? 0), 0);
  await supabase.from("financeiro").update({ valor_total: total }).eq("id", financeiroId);
}

export async function adicionarItemFinanceiro(financeiroId: string, formData: FormData) {
  const parsed = itemFinanceiroSchema.safeParse({
    descricao: String(formData.get("descricao") ?? "") || undefined,
    quantidade: formData.get("quantidade") || undefined,
    valor_unitario: formData.get("valor_unitario") || undefined,
  });
  if (!parsed.success) return;

  const quantidade = parsed.data.quantidade ?? 1;
  const valorUnitario = parsed.data.valor_unitario ?? 0;
  const valorTotal = quantidade * valorUnitario;

  const supabase = await createClient();
  await supabase.from("financeiro_itens").insert({
    financeiro_id: financeiroId,
    descricao: parsed.data.descricao ?? "",
    quantidade,
    valor_unitario: valorUnitario,
    valor_total: valorTotal,
  });

  await recalcularValorTotal(financeiroId);
  revalidatePath(`/gestao/financeiro/${financeiroId}`);
}

export async function removerItemFinanceiro(financeiroId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("financeiro_itens").delete().eq("id", itemId);
  await recalcularValorTotal(financeiroId);
  revalidatePath(`/gestao/financeiro/${financeiroId}`);
}

export async function atualizarStatusFinanceiro(
  financeiroId: string,
  status: "rascunho" | "emitido" | "pago" | "cancelado"
) {
  const supabase = await createClient();
  await supabase.from("financeiro").update({ status }).eq("id", financeiroId);
  revalidatePath(`/gestao/financeiro/${financeiroId}`);
}
