import { z } from "zod";

// Nenhum campo além do tipo bloqueia a criação: o financeiro pode ser salvo
// mesmo com dados incompletos, conforme pedido pelo usuário.
export const financeiroSchema = z.object({
  tipo: z.enum(["fatura", "recibo"]),
  numero: z.string().optional(),
  data_emissao: z.string().optional().or(z.literal("")),
  cliente_id: z.string().uuid().optional().or(z.literal("")),
  cliente_nome: z.string().optional(),
  cliente_documento: z.string().optional(),
  cliente_endereco: z.string().optional(),
  cliente_telefone: z.string().optional(),
  cliente_email: z.string().optional(),
  cliente_inscricao_municipal: z.string().optional(),
  cliente_inscricao_estadual: z.string().optional(),
  cliente_responsavel: z.string().optional(),
  proposta_id: z.string().uuid().optional().or(z.literal("")),
  contrato_id: z.string().uuid().optional().or(z.literal("")),
  descricao: z.string().optional(),
  data_entrega: z.string().optional(),
  numero_substituicao: z.string().optional(),
  valor_total: z.coerce.number().min(0).optional(),
  forma_pagamento: z.string().optional(),
  vencimento: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional(),
  signatario: z.enum(["gabriel", "higor"]).optional().or(z.literal("")),
  status: z.enum(["rascunho", "emitido", "pago", "cancelado"]).optional(),
});

export const itemFinanceiroSchema = z.object({
  descricao: z.string().optional(),
  quantidade: z.coerce.number().int().min(1).optional(),
  valor_unitario: z.coerce.number().min(0).optional(),
});
