import { z } from "zod";

export const eventoSchema = z
  .object({
    nome: z.string().min(2, "Informe o nome do evento."),
    cliente_id: z.string().uuid().optional().or(z.literal("")),
    data_inicio: z.string().min(1, "Informe a data de início."),
    data_fim: z.string().min(1, "Informe a data de término."),
    data_montagem: z.string().optional().or(z.literal("")),
    hora_montagem: z.string().optional().or(z.literal("")),
    local: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine((v) => v.data_fim >= v.data_inicio, {
    message: "A data de término não pode ser antes da data de início.",
    path: ["data_fim"],
  });
