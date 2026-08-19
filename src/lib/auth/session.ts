import { createClient } from "@/lib/supabase/server";
import type { Usuario } from "@/types/domain";

/** Retorna o usuário logado (linha de `usuarios`) ou null se não houver sessão. */
export async function getUsuarioAtual(): Promise<Usuario | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export function isAdminGestao(usuario: Usuario | null): boolean {
  return usuario?.perfil === "gestao" && usuario?.papel_gestao === "admin";
}

export function isGestao(usuario: Usuario | null): boolean {
  return usuario?.perfil === "gestao";
}

export function isCampo(usuario: Usuario | null): boolean {
  return usuario?.perfil === "campo";
}
