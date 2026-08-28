"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contratoSchema, itemContratoSchema } from "@/lib/validations/contrato";
import { calcularItens, calcularTotal } from "@/lib/propostas/pricing";
import {
  CLAUSULA2_PADRAO,
  CLAUSULA3_PADRAO,
  CLAUSULA5_PADRAO,
  CLAUSULA6_PADRAO,
  CLAUSULA7_PADRAO,
  CLAUSULA8_PADRAO,
} from "@/lib/contratos/textosPadrao";
import type { Parcela, SubmodoPrecificacao } from "@/types/domain";

export interface ContratoActionState {
  erro?: string;
}

function extrairParcelas(formData: FormData): Parcela[] {
  const valores = formData.getAll("parcela_valor");
  const vencimentos = formData.getAll("parcela_vencimento");
  const parcelas: Parcela[] = [];
  for (let i = 0; i < valores.length; i++) {
    const valor = Number(valores[i]);
    const vencimento = String(vencimentos[i] ?? "").trim();
    if (valor > 0 || vencimento) parcelas.push({ valor: valor || 0, vencimento });
  }
  return parcelas;
}

function extrairContrato(formData: FormData) {
  return {
    cliente_id: String(formData.get("cliente_id") ?? "") || undefined,
    evento_id: String(formData.get("evento_id") ?? "") || undefined,
    proposta_id: String(formData.get("proposta_id") ?? "") || undefined,
    contratante_nome: String(formData.get("contratante_nome") ?? ""),
    contratante_documento: String(formData.get("contratante_documento") ?? "") || undefined,
    contratante_endereco: String(formData.get("contratante_endereco") ?? "") || undefined,
    objeto_montagem: String(formData.get("objeto_montagem") ?? "") || undefined,
    objeto_data_evento: String(formData.get("objeto_data_evento") ?? "") || undefined,
    objeto_local: String(formData.get("objeto_local") ?? "") || undefined,
    objeto_desmontagem: String(formData.get("objeto_desmontagem") ?? "") || undefined,
    submodo_valor: String(formData.get("submodo_valor") ?? "item"),
    valor_manual: formData.get("valor_manual") || undefined,
    tipo_contratacao: String(formData.get("tipo_contratacao") ?? "pagamento"),
    parcelas: extrairParcelas(formData),
    banco_nome: String(formData.get("banco_nome") ?? "") || undefined,
    banco_agencia: String(formData.get("banco_agencia") ?? "") || undefined,
    banco_conta: String(formData.get("banco_conta") ?? "") || undefined,
    banco_chave_pix: String(formData.get("banco_chave_pix") ?? "") || undefined,
    banco_favorecido: String(formData.get("banco_favorecido") ?? "") || undefined,
    permuta_descricao: String(formData.get("permuta_descricao") ?? "") || undefined,
    permuta_valor: formData.get("permuta_valor") || undefined,
    data_contrato: String(formData.get("data_contrato") ?? "") || undefined,
    signatario: String(formData.get("signatario") ?? "gabriel"),
    clausula2_texto: String(formData.get("clausula2_texto") ?? "") || undefined,
    clausula3_texto: String(formData.get("clausula3_texto") ?? "") || undefined,
    clausula5_texto: String(formData.get("clausula5_texto") ?? "") || undefined,
    clausula6_texto: String(formData.get("clausula6_texto") ?? "") || undefined,
    clausula7_texto: String(formData.get("clausula7_texto") ?? "") || undefined,
    clausula8_texto: String(formData.get("clausula8_texto") ?? "") || undefined,
  };
}

async function proximoNumeroCliente(
  contratoIdExcluir: string | null,
  clienteId: string | undefined,
  documento: string | undefined
) {
  const supabase = await createClient();
  let query = supabase.from("contratos").select("id, numero_cliente");
  query = clienteId ? query.eq("cliente_id", clienteId) : query.eq("contratante_documento", documento ?? "");
  const { data } = await query;
  const existentes = (data ?? []).filter((c) => c.id !== contratoIdExcluir);
  const maior = existentes.reduce((max, c) => Math.max(max, c.numero_cliente ?? 0), 0);
  return maior + 1;
}

export async function criarContrato(
  _prev: ContratoActionState,
  formData: FormData
): Promise<ContratoActionState> {
  const dados = extrairContrato(formData);
  const parsed = contratoSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const numero_cliente = await proximoNumeroCliente(
    null,
    parsed.data.cliente_id,
    parsed.data.contratante_documento
  );

  const { data, error } = await supabase
    .from("contratos")
    .insert({
      ...parsed.data,
      numero_cliente,
      clausula2_texto: parsed.data.clausula2_texto || CLAUSULA2_PADRAO,
      clausula3_texto: parsed.data.clausula3_texto || CLAUSULA3_PADRAO,
      clausula5_texto: parsed.data.clausula5_texto || CLAUSULA5_PADRAO,
      clausula6_texto: parsed.data.clausula6_texto || CLAUSULA6_PADRAO,
      clausula7_texto: parsed.data.clausula7_texto || CLAUSULA7_PADRAO,
      clausula8_texto: parsed.data.clausula8_texto || CLAUSULA8_PADRAO,
    })
    .select("id")
    .single();

  if (error || !data) return { erro: "Não foi possível criar o contrato." };

  redirect(`/gestao/contratos/${data.id}`);
}

export async function atualizarContrato(
  id: string,
  _prev: ContratoActionState,
  formData: FormData
): Promise<ContratoActionState> {
  const parsed = contratoSchema.safeParse(extrairContrato(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contratos").update(parsed.data).eq("id", id);
  if (error) return { erro: "Não foi possível atualizar o contrato." };

  await recalcularValorTotal(id);
  revalidatePath(`/gestao/contratos/${id}`);
  return {};
}

async function recalcularValorTotal(contratoId: string) {
  const supabase = await createClient();
  const [{ data: contrato }, { data: itens }, { data: setores }] = await Promise.all([
    supabase.from("contratos").select("submodo_valor, valor_manual").eq("id", contratoId).single(),
    supabase.from("contrato_itens").select("*").eq("contrato_id", contratoId),
    supabase.from("contrato_setores_valor").select("*").eq("contrato_id", contratoId),
  ]);

  if (!contrato) return;

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
    submodo: contrato.submodo_valor as SubmodoPrecificacao,
    itensCalculados: calculados,
    valoresPorSetor,
    valorManual: contrato.valor_manual,
  });

  await supabase.from("contratos").update({ valor_total: total }).eq("id", contratoId);
}

export async function adicionarItemContrato(contratoId: string, formData: FormData) {
  const parsed = itemContratoSchema.safeParse({
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
  await supabase.from("contrato_itens").insert({
    contrato_id: contratoId,
    equipamento_id: parsed.data.equipamento_id ?? null,
    descricao: parsed.data.descricao,
    quantidade: parsed.data.quantidade,
    tipo_valor: parsed.data.tipo_valor,
    diarias: parsed.data.diarias ?? null,
    valor_unitario: parsed.data.valor_unitario,
    valor_total: valorTotal,
    origem: parsed.data.origem,
  });

  await recalcularValorTotal(contratoId);
  revalidatePath(`/gestao/contratos/${contratoId}`);
}

export async function removerItemContrato(contratoId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("contrato_itens").delete().eq("id", itemId);
  await recalcularValorTotal(contratoId);
  revalidatePath(`/gestao/contratos/${contratoId}`);
}

export async function salvarValorSetorContrato(contratoId: string, formData: FormData) {
  const setor = String(formData.get("setor") ?? "");
  const valor = Number(formData.get("valor") ?? 0);
  if (!setor) return;

  const supabase = await createClient();
  await supabase
    .from("contrato_setores_valor")
    .upsert({ contrato_id: contratoId, setor, valor }, { onConflict: "contrato_id,setor" });

  await recalcularValorTotal(contratoId);
  revalidatePath(`/gestao/contratos/${contratoId}`);
}

export async function atualizarStatusContrato(
  contratoId: string,
  status: "gerado" | "assinado" | "cancelado"
) {
  const supabase = await createClient();
  const patch: { status: typeof status; assinado_em: string | null } = {
    status,
    assinado_em: status === "assinado" ? new Date().toISOString() : null,
  };
  await supabase.from("contratos").update(patch).eq("id", contratoId);
  revalidatePath(`/gestao/contratos/${contratoId}`);
}
