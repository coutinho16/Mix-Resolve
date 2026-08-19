"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  erro?: string;
}

export async function loginGestao(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { erro: "E-mail ou senha inválidos." };
  }

  redirect("/gestao/dashboard");
}

export async function loginCampo(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const usuarioLogin = String(formData.get("usuario_login") ?? "").trim();
  const pin = String(formData.get("pin") ?? "");

  if (!usuarioLogin || !pin) {
    return { erro: "Preencha usuário e PIN." };
  }

  const supabase = await createClient();

  const { data: email, error: erroResolucao } = await supabase.rpc(
    "fn_resolver_email_login",
    { p_usuario_login: usuarioLogin }
  );

  if (erroResolucao || !email) {
    return { erro: "Usuário ou PIN inválidos." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pin,
  });

  if (error) {
    return { erro: "Usuário ou PIN inválidos." };
  }

  redirect("/campo/tarefas");
}
