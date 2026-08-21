import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FinanceiroWorkspace } from "@/components/financeiro/FinanceiroWorkspace";

export default async function FinanceiroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: financeiro }, { data: clientes }, { data: itens }] = await Promise.all([
    supabase.from("financeiro").select("*").eq("id", id).single(),
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("financeiro_itens").select("*").eq("financeiro_id", id).order("ordem"),
  ]);

  if (!financeiro) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <FinanceiroWorkspace financeiro={financeiro} clientes={clientes ?? []} itens={itens ?? []} />
    </div>
  );
}
