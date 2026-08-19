"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function alternarAtivoUsuario(id: string, ativo: boolean) {
  const supabase = await createClient();
  await supabase.from("usuarios").update({ ativo }).eq("id", id);
  revalidatePath("/gestao/equipe");
}
