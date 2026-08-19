import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropostaWorkspace } from "@/components/propostas/PropostaWorkspace";

export default async function PropostaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: proposta },
    { data: clientes },
    { data: eventos },
    { data: equipamentos },
    { data: categorias },
    { data: itens },
    { data: setoresValor },
    { data: contrato },
  ] = await Promise.all([
    supabase.from("propostas").select("*").eq("id", id).single(),
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("eventos").select("*").order("data_inicio", { ascending: false }),
    supabase.from("equipamentos").select("*").eq("ativo", true).order("nome"),
    supabase.from("categorias_equipamento").select("*"),
    supabase.from("proposta_itens").select("*").eq("proposta_id", id).order("ordem"),
    supabase.from("proposta_setores_valor").select("*").eq("proposta_id", id),
    supabase.from("contratos").select("*").eq("proposta_id", id).maybeSingle(),
  ]);

  if (!proposta) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <PropostaWorkspace
        proposta={proposta}
        clientes={clientes ?? []}
        eventos={eventos ?? []}
        equipamentos={equipamentos ?? []}
        categorias={categorias ?? []}
        itens={itens ?? []}
        setoresValor={setoresValor ?? []}
        contrato={contrato ?? null}
      />
    </div>
  );
}
