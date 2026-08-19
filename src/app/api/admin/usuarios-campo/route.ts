import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuarioAtual, isAdminGestao } from "@/lib/auth/session";
import {
  criarUsuarioCampoSchema,
  DOMINIO_EMAIL_SINTETICO_CAMPO,
} from "@/lib/validations/usuario";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const usuarioAtual = await getUsuarioAtual();
  if (!isAdminGestao(usuarioAtual)) {
    return NextResponse.json({ erro: "Acesso negado." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = criarUsuarioCampoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { nome, usuario_login, pin, cargo } = parsed.data;
  const email = `${usuario_login}@${DOMINIO_EMAIL_SINTETICO_CAMPO}`;

  const admin = createAdminClient();

  const { data: criado, error: erroCriacao } = await admin.auth.admin.createUser({
    email,
    password: pin,
    email_confirm: true,
    user_metadata: {
      nome,
      usuario_login,
      perfil: "campo",
      cargo: cargo ?? null,
    },
  });

  if (erroCriacao || !criado?.user) {
    const mensagem = erroCriacao?.message.includes("already been registered")
      ? "Esse usuário já existe."
      : "Não foi possível criar o usuário.";
    return NextResponse.json({ erro: mensagem }, { status: 400 });
  }

  // confirma que o trigger populou a tabela usuarios; se algo falhou, desfaz a criação
  const supabase = await createClient();
  const { data: linhaUsuario } = await supabase
    .from("usuarios")
    .select("id")
    .eq("id", criado.user.id)
    .maybeSingle();

  if (!linhaUsuario) {
    await admin.auth.admin.deleteUser(criado.user.id);
    return NextResponse.json(
      { erro: "Falha ao concluir o cadastro. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: criado.user.id }, { status: 201 });
}
