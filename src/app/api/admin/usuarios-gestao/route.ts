import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuarioAtual, isAdminGestao } from "@/lib/auth/session";
import { criarUsuarioGestaoSchema } from "@/lib/validations/usuario";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const usuarioAtual = await getUsuarioAtual();
  if (!isAdminGestao(usuarioAtual)) {
    return NextResponse.json({ erro: "Acesso negado." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = criarUsuarioGestaoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { nome, email, senha, papel_gestao, cargo } = parsed.data;

  const admin = createAdminClient();

  const { data: criado, error: erroCriacao } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: {
      nome,
      perfil: "gestao",
      papel_gestao,
      cargo: cargo ?? null,
    },
  });

  if (erroCriacao || !criado?.user) {
    const mensagem = erroCriacao?.message.includes("already been registered")
      ? "Esse e-mail já está cadastrado."
      : "Não foi possível criar o usuário.";
    return NextResponse.json({ erro: mensagem }, { status: 400 });
  }

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
