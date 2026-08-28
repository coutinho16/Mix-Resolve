"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/auth/session";
import { propostaSchema, itemPropostaSchema, setorValorSchema } from "@/lib/validations/proposta";
import { calcularItens, calcularTotal } from "@/lib/propostas/pricing";
import { TEXTO_ABERTURA_PADRAO, DIFERENCIAIS_PADRAO } from "@/lib/contratos/textosPadrao";
import type { SubmodoPrecificacao } from "@/types/domain";

export interface PropostaActionState {
  erro?: string;
}

function extrairProposta(formData: FormData) {
  const diferenciais = formData
    .getAll("diferenciais")
    .map((v) => String(v).trim())
    .filter(Boolean);

  return {
    cliente_id: String(formData.get("cliente_id") ?? ""),
    evento_id: String(formData.get("evento_id") ?? "") || undefined,
    submodo_precificacao: String(formData.get("submodo_precificacao") ?? "item"),
    desconto_tipo: String(formData.get("desconto_tipo") ?? "nenhum"),
    desconto_valor: formData.get("desconto_valor") || 0,
    valor_manual: formData.get("valor_manual") || undefined,
    tem_permuta: formData.get("tem_permuta") === "on",
    condicoes_permuta: String(formData.get("condicoes_permuta") ?? "") || undefined,
    signatario: String(formData.get("signatario") ?? "gabriel"),
    cargo_signatario: String(formData.get("cargo_signatario") ?? "") || undefined,
    validade: String(formData.get("validade") ?? "") || undefined,
    observacoes: String(formData.get("observacoes") ?? "") || undefined,
    local: String(formData.get("local") ?? "") || undefined,
    data_evento_texto: String(formData.get("data_evento_texto") ?? "") || undefined,
    montagem_texto: String(formData.get("montagem_texto") ?? "") || undefined,
    forma_pagamento: String(formData.get("forma_pagamento") ?? "") || undefined,
    pix_beneficiario: String(formData.get("pix_beneficiario") ?? "") || undefined,
    pix_chave: String(formData.get("pix_chave") ?? "") || undefined,
    texto_abertura: String(formData.get("texto_abertura") ?? "") || undefined,
    diferenciais,
  };
}

async function proximoNumeroCliente(propostaIdExcluir: string | null, clienteId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("propostas")
    .select("id, numero_cliente")
    .eq("cliente_id", clienteId);
  const existentes = (data ?? []).filter((p) => p.id !== propostaIdExcluir);
  const maior = existentes.reduce((max, p) => Math.max(max, p.numero_cliente ?? 0), 0);
  return maior + 1;
}

export async function criarProposta(
  _prev: PropostaActionState,
  formData: FormData
): Promise<PropostaActionState> {
  const dados = extrairProposta(formData);
  const parsed = propostaSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const usuario = await getUsuarioAtual();
  const supabase = await createClient();
  const numero_cliente = await proximoNumeroCliente(null, parsed.data.cliente_id);

  const { data, error } = await supabase
    .from("propostas")
    .insert({
      ...parsed.data,
      numero_cliente,
      texto_abertura: parsed.data.texto_abertura || TEXTO_ABERTURA_PADRAO,
      diferenciais:
        parsed.data.diferenciais && parsed.data.diferenciais.length > 0
          ? parsed.data.diferenciais
          : DIFERENCIAIS_PADRAO,
      created_by: usuario?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !data) return { erro: "Não foi possível criar a proposta." };

  redirect(`/gestao/propostas/${data.id}`);
}

export async function atualizarProposta(
  id: string,
  _prev: PropostaActionState,
  formData: FormData
): Promise<PropostaActionState> {
  const parsed = propostaSchema.safeParse(extrairProposta(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("propostas")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { erro: "Não foi possível atualizar a proposta." };

  await recalcularValorTotal(id);
  revalidatePath(`/gestao/propostas/${id}`);
  return {};
}

async function recalcularValorTotal(propostaId: string) {
  const supabase = await createClient();
  const [{ data: proposta }, { data: itens }, { data: setores }] = await Promise.all([
    supabase
      .from("propostas")
      .select("submodo_precificacao, desconto_tipo, desconto_valor, valor_manual")
      .eq("id", propostaId)
      .single(),
    supabase.from("proposta_itens").select("*").eq("proposta_id", propostaId),
    supabase.from("proposta_setores_valor").select("*").eq("proposta_id", propostaId),
  ]);

  if (!proposta) return;

  const calculados = calcularItens(
    (itens ?? []).map((i) => ({
      descricao: i.descricao,
      quantidade: i.quantidade,
      valorUnitario: i.valor_unitario,
      tipoValor: i.tipo_valor,
      diarias: i.diarias,
    }))
  );

  const valoresPorSetor = Object.fromEntries((setores ?? []).map((s) => [s.setor, s.valor]));

  const { total } = calcularTotal({
    submodo: proposta.submodo_precificacao as SubmodoPrecificacao,
    itensCalculados: calculados,
    valoresPorSetor,
    valorManual: proposta.valor_manual,
    descontoTipo: proposta.desconto_tipo,
    descontoValor: proposta.desconto_valor,
  });

  await supabase.from("propostas").update({ valor_total: total }).eq("id", propostaId);
}

export async function adicionarItemProposta(propostaId: string, formData: FormData) {
  const parsed = itemPropostaSchema.safeParse({
    equipamento_id: String(formData.get("equipamento_id") ?? "") || undefined,
    descricao: String(formData.get("descricao") ?? ""),
    quantidade: formData.get("quantidade"),
    tipo_valor: String(formData.get("tipo_valor") ?? "fechado"),
    diarias: formData.get("diarias") || undefined,
    valor_unitario: formData.get("valor_unitario") || 0,
    origem: formData.get("equipamento_id") ? "catalogo" : "manual",
  });

  if (!parsed.success) return;

  const valorTotal =
    parsed.data.tipo_valor === "diaria"
      ? parsed.data.quantidade * Math.max(1, parsed.data.diarias ?? 1) * parsed.data.valor_unitario
      : parsed.data.quantidade * parsed.data.valor_unitario;

  const supabase = await createClient();
  await supabase.from("proposta_itens").insert({
    proposta_id: propostaId,
    equipamento_id: parsed.data.equipamento_id ?? null,
    descricao: parsed.data.descricao,
    quantidade: parsed.data.quantidade,
    tipo_valor: parsed.data.tipo_valor,
    diarias: parsed.data.diarias ?? null,
    valor_unitario: parsed.data.valor_unitario,
    valor_total: valorTotal,
    origem: parsed.data.origem,
  });

  await recalcularValorTotal(propostaId);
  revalidatePath(`/gestao/propostas/${propostaId}`);
}

export async function removerItemProposta(propostaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("proposta_itens").delete().eq("id", itemId);
  await recalcularValorTotal(propostaId);
  revalidatePath(`/gestao/propostas/${propostaId}`);
}

export async function salvarValorSetorProposta(propostaId: string, formData: FormData) {
  const parsed = setorValorSchema.safeParse({
    setor: String(formData.get("setor") ?? ""),
    valor: formData.get("valor") || 0,
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("proposta_setores_valor")
    .upsert({ proposta_id: propostaId, ...parsed.data }, { onConflict: "proposta_id,setor" });

  await recalcularValorTotal(propostaId);
  revalidatePath(`/gestao/propostas/${propostaId}`);
}

export async function atualizarStatusProposta(
  propostaId: string,
  status: "rascunho" | "enviada" | "aceita" | "recusada" | "expirada"
) {
  const supabase = await createClient();
  await supabase.from("propostas").update({ status }).eq("id", propostaId);
  revalidatePath(`/gestao/propostas/${propostaId}`);
}

export async function excluirProposta(
  propostaId: string,
  clienteId?: string
): Promise<{ erro?: string }> {
  const supabase = await createClient();

  const { data: contrato } = await supabase
    .from("contratos")
    .select("id")
    .eq("proposta_id", propostaId)
    .maybeSingle();
  if (contrato) {
    return { erro: "Não é possível excluir: existe um contrato vinculado a esta proposta." };
  }

  const { error } = await supabase.from("propostas").delete().eq("id", propostaId);
  if (error) return { erro: "Não foi possível excluir a proposta." };

  revalidatePath("/gestao/propostas");
  if (clienteId) revalidatePath(`/gestao/clientes/${clienteId}`);
  return {};
}
