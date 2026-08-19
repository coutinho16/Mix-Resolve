import { createClient } from "@/lib/supabase/server";
import { ClientesPainel } from "@/components/gestao/ClientesPainel";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");

  return <ClientesPainel clientes={clientes ?? []} />;
}
