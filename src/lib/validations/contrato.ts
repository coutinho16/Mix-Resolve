import { z } from "zod";

export const contratoSchema = z.object({
  cliente_id: z.string().uuid().optional().or(z.literal("")),
  evento_id: z.string().uuid().optional().or(z.literal("")),
  proposta_id: z.string().uuid().optional().or(z.literal("")),
  contratante_nome: z.string().min(1, "Informe o nome ou razão social."),
  contratante_documento: z.string().optional(),
  contratante_endereco: z.string().optional(),
  objeto_montagem: z.string().optional().or(z.literal("")),
  objeto_data_evento: z.string().optional().or(z.literal("")),
  objeto_local: z.string().optional(),
  objeto_desmontagem: z.string().optional(),
  submodo_valor: z.enum(["item", "setor", "unico"]),
  valor_manual: z.coerce.number().min(0).optional(),
  tipo_contratacao: z.enum(["pagamento", "permuta"]),
  parcelas: z
    .array(z.object({ valor: z.coerce.number().min(0), vencimento: z.string() }))
    .optional(),
  banco_nome: z.string().optional(),
  banco_agencia: z.string().optional(),
  banco_conta: z.string().optional(),
  banco_chave_pix: z.string().optional(),
  banco_favorecido: z.string().optional(),
  permuta_descricao: z.string().optional(),
  permuta_valor: z.coerce.number().min(0).optional(),
  data_contrato: z.string().optional().or(z.literal("")),
  signatario: z.enum(["gabriel", "higor"]),
  clausula2_texto: z.string().optional(),
  clausula3_texto: z.string().optional(),
  clausula5_texto: z.string().optional(),
  clausula6_texto: z.string().optional(),
  clausula7_texto: z.string().optional(),
  clausula8_texto: z.string().optional(),
});

export const itemContratoSchema = z.object({
  equipamento_id: z.string().uuid().optional(),
  descricao: z.string().min(1, "Informe a descrição do item."),
  quantidade: z.coerce.number().int().min(1, "Quantidade inválida."),
  tipo_valor: z.enum(["diaria", "fechado"]),
  diarias: z.coerce.number().int().min(1).optional(),
  valor_unitario: z.coerce.number().min(0, "Valor inválido."),
  origem: z.enum(["catalogo", "manual"]),
});
