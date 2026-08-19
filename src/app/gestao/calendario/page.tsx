import { createClient } from "@/lib/supabase/server";
import { CalendarioPainel } from "@/components/gestao/CalendarioPainel";

export default async function CalendarioPage() {
  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .neq("status", "cancelado");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-titulo text-2xl font-semibold text-preto">
        Calendário
      </h1>
      <CalendarioPainel eventos={eventos ?? []} mesInicial={new Date()} />
    </div>
  );
}
