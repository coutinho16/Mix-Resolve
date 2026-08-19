import { createClient } from "@/lib/supabase/server";
import { EstoquePainel } from "@/components/gestao/EstoquePainel";

export default async function EstoquePage() {
  const supabase = await createClient();
  const [{ data: categorias }, { data: equipamentos }] = await Promise.all([
    supabase.from("categorias_equipamento").select("*").order("ordem"),
    supabase.from("equipamentos").select("*").order("nome"),
  ]);

  return (
    <EstoquePainel
      categorias={categorias ?? []}
      equipamentos={equipamentos ?? []}
    />
  );
}
