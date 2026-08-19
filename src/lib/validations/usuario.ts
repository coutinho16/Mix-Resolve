import { z } from "zod";

export const criarUsuarioCampoSchema = z.object({
  nome: z.string().min(2, "Informe o nome completo."),
  usuario_login: z
    .string()
    .min(3, "Mínimo de 3 caracteres.")
    .regex(/^[a-z0-9._-]+$/, "Use apenas letras minúsculas, números, ponto, hífen ou underline."),
  pin: z.string().min(4, "O PIN precisa de pelo menos 4 dígitos."),
  cargo: z.string().optional(),
});

export const criarUsuarioGestaoSchema = z.object({
  nome: z.string().min(2, "Informe o nome completo."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha precisa de pelo menos 6 caracteres."),
  papel_gestao: z.enum(["admin", "operacional"]),
  cargo: z.string().optional(),
});

export const DOMINIO_EMAIL_SINTETICO_CAMPO = "campo.mixresolve.internal";
