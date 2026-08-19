import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual, isAdminGestao } from "@/lib/auth/session";
import { EquipePainel } from "@/components/gestao/EquipePainel";

export default async function EquipePage() {
  const usuarioAtual = await getUsuarioAtual();
  const supabase = await createClient();
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*")
    .order("nome");

  return (
    <EquipePainel
      usuarios={usuarios ?? []}
      admin={isAdminGestao(usuarioAtual)}
    />
  );
}
