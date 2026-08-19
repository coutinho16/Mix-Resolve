import { createClient } from "@/lib/supabase/server";
import { EventoForm } from "@/components/gestao/EventoForm";
import { criarEvento } from "@/app/gestao/eventos/actions";

export default async function NovoEventoPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase.from("clientes").select("*").order("nome");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-titulo text-2xl font-semibold text-preto">
        Novo evento
      </h1>
      <div className="rounded-xl border border-neutro-2 bg-branco-puro p-6">
        <EventoForm clientes={clientes ?? []} action={criarEvento} />
      </div>
    </div>
  );
}
