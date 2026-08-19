import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da categoria."),
});

export const equipamentoSchema = z.object({
  categoria_id: z.string().uuid("Selecione uma categoria."),
  nome: z.string().min(2, "Informe o nome do equipamento."),
  quantidade_total: z.coerce.number().int().min(0, "Quantidade inválida."),
  preco_referencia: z.coerce.number().min(0).optional(),
  estoque_minimo: z.coerce.number().int().min(0).optional(),
});
