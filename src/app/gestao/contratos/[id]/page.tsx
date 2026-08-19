import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContratoWorkspace } from "@/components/contratos/ContratoWorkspace";

export default async function ContratoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: contrato },
    { data: clientes },
    { data: equipamentos },
    { data: categorias },
    { data: itens },
    { data: setoresValor },
  ] = await Promise.all([
    supabase.from("contratos").select("*").eq("id", id).single(),
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("equipamentos").select("*").eq("ativo", true).order("nome"),
    supabase.from("categorias_equipamento").select("*"),
    supabase.from("contrato_itens").select("*").eq("contrato_id", id).order("ordem"),
    supabase.from("contrato_setores_valor").select("*").eq("contrato_id", id),
  ]);

  if (!contrato) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <ContratoWorkspace
        contrato={contrato}
        clientes={clientes ?? []}
        equipamentos={equipamentos ?? []}
        categorias={categorias ?? []}
        itens={itens ?? []}
        setoresValor={setoresValor ?? []}
      />
    </div>
  );
}
