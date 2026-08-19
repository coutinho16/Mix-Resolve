import { z } from "zod";

export const propostaSchema = z.object({
  cliente_id: z.string().uuid("Selecione um cliente."),
  evento_id: z.string().uuid().optional().or(z.literal("")),
  submodo_precificacao: z.enum(["item", "setor", "unico"]),
  desconto_tipo: z.enum(["nenhum", "percentual", "valor"]),
  desconto_valor: z.coerce.number().min(0, "Valor de desconto inválido."),
  valor_manual: z.coerce.number().min(0).optional(),
  tem_permuta: z.boolean(),
  condicoes_permuta: z.string().optional(),
  signatario: z.enum(["gabriel", "higor"]),
  cargo_signatario: z.string().optional(),
  validade: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional(),
  local: z.string().optional(),
  data_evento_texto: z.string().optional(),
  montagem_texto: z.string().optional(),
  forma_pagamento: z.string().optional(),
  pix_beneficiario: z.string().optional(),
  pix_chave: z.string().optional(),
  texto_abertura: z.string().optional(),
  diferenciais: z.array(z.string()).max(4).optional(),
});

export const itemPropostaSchema = z.object({
  equipamento_id: z.string().uuid().optional(),
  descricao: z.string().min(1, "Informe a descrição do item."),
  quantidade: z.coerce.number().int().min(1, "Quantidade inválida."),
  tipo_valor: z.enum(["diaria", "fechado"]),
  diarias: z.coerce.number().int().min(1).optional(),
  valor_unitario: z.coerce.number().min(0, "Valor inválido."),
  origem: z.enum(["catalogo", "manual"]),
});

export const setorValorSchema = z.object({
  setor: z.string().min(1),
  valor: z.coerce.number().min(0, "Valor inválido."),
});
