import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(2, "Informe o nome."),
  empresa: z.string().optional(),
  documento: z.string().optional(),
  contato_nome: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  endereco: z.string().optional(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;
