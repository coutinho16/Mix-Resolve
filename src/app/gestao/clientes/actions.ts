"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/auth/session";
import { clienteSchema } from "@/lib/validations/cliente";
import type { Cliente } from "@/types/domain";

export interface ClienteActionState {
  erro?: string;
  sucesso?: boolean;
  cliente?: Cliente;
}

function extrairDados(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    empresa: String(formData.get("empresa") ?? "") || undefined,
    documento: String(formData.get("documento") ?? "") || undefined,
    contato_nome: String(formData.get("contato_nome") ?? "") || undefined,
    telefone: String(formData.get("telefone") ?? "") || undefined,
    email: String(formData.get("email") ?? ""),
    endereco: String(formData.get("endereco") ?? "") || undefined,
  };
}

export async function criarCliente(
  _prev: ClienteActionState,
  formData: FormData
): Promise<ClienteActionState> {
  const parsed = clienteSchema.safeParse(extrairDados(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const usuario = await getUsuarioAtual();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .insert({ ...parsed.data, created_by: usuario?.id ?? null })
    .select()
    .single();

  if (error) return { erro: "Não foi possível salvar o cliente." };

  revalidatePath("/gestao/clientes");
  return { sucesso: true, cliente: data };
}

export async function atualizarCliente(
  id: string,
  _prev: ClienteActionState,
  formData: FormData
): Promise<ClienteActionState> {
  const parsed = clienteSchema.safeParse(extrairDados(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { erro: "Não foi possível atualizar o cliente." };

  revalidatePath("/gestao/clientes");
  return { sucesso: true };
}

export async function excluirCliente(id: string) {
  const supabase = await createClient();
  await supabase.from("clientes").delete().eq("id", id);
  revalidatePath("/gestao/clientes");
}

export async function importarClientes(
  linhas: Array<Record<string, unknown>>
): Promise<{ importados: number; erro?: string }> {
  const usuario = await getUsuarioAtual();
  const supabase = await createClient();

  const registros = linhas
    .map((linha) =>
      clienteSchema.safeParse({
        nome: String(linha.nome ?? ""),
        empresa: linha.empresa ? String(linha.empresa) : undefined,
        documento: linha.documento ? String(linha.documento) : undefined,
        contato_nome: linha.contato_nome ? String(linha.contato_nome) : undefined,
        telefone: linha.telefone ? String(linha.telefone) : undefined,
        email: linha.email ? String(linha.email) : "",
        endereco: linha.endereco ? String(linha.endereco) : undefined,
      })
    )
    .filter((r) => r.success)
    .map((r) => ({ ...r.data, created_by: usuario?.id ?? null }));

  if (registros.length === 0) {
    return { importados: 0, erro: "Nenhum registro válido encontrado no arquivo." };
  }

  const { error } = await supabase.from("clientes").insert(registros);
  if (error) return { importados: 0, erro: "Falha ao importar clientes." };

  revalidatePath("/gestao/clientes");
  return { importados: registros.length };
}

const BUCKET_ANEXOS = "cliente-anexos";

export interface AnexoActionState {
  erro?: string;
}

export async function enviarAnexoCliente(
  clienteId: string,
  formData: FormData
): Promise<AnexoActionState> {
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Selecione um arquivo." };
  }

  const usuario = await getUsuarioAtual();
  const supabase = await createClient();
  const caminho = `${clienteId}/${crypto.randomUUID()}-${arquivo.name}`;

  const { error: erroUpload } = await supabase.storage
    .from(BUCKET_ANEXOS)
    .upload(caminho, arquivo, { contentType: arquivo.type || undefined });

  if (erroUpload) return { erro: "Não foi possível enviar o arquivo." };

  const { error: erroInsert } = await supabase.from("cliente_anexos").insert({
    cliente_id: clienteId,
    nome_arquivo: arquivo.name,
    caminho_storage: caminho,
    tipo_conteudo: arquivo.type || null,
    tamanho_bytes: arquivo.size,
    created_by: usuario?.id ?? null,
  });

  if (erroInsert) {
    await supabase.storage.from(BUCKET_ANEXOS).remove([caminho]);
    return { erro: "Não foi possível registrar o anexo." };
  }

  revalidatePath(`/gestao/clientes/${clienteId}`);
  return {};
}

export async function excluirAnexoCliente(
  clienteId: string,
  anexoId: string,
  caminhoStorage: string
) {
  const supabase = await createClient();
  await supabase.storage.from(BUCKET_ANEXOS).remove([caminhoStorage]);
  await supabase.from("cliente_anexos").delete().eq("id", anexoId);
  revalidatePath(`/gestao/clientes/${clienteId}`);
}
