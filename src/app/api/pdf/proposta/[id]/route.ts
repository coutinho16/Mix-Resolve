import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { PropostaDocument } from "@/lib/pdf/PropostaDocument";
import { resolverSetorDosItens } from "@/lib/pdf/agrupamento";
import type { Cliente } from "@/types/domain";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposta } = await supabase
    .from("propostas")
    .select("*, clientes(*)")
    .eq("id", id)
    .single();

  if (!proposta) {
    return new Response("Proposta não encontrada.", { status: 404 });
  }

  const [{ data: itens }, { data: equipamentos }, { data: categorias }] = await Promise.all([
    supabase.from("proposta_itens").select("*").eq("proposta_id", id).order("ordem"),
    supabase.from("equipamentos").select("*"),
    supabase.from("categorias_equipamento").select("*"),
  ]);

  const cliente = (proposta as unknown as { clientes: Cliente }).clientes;
  const itensComSetor = resolverSetorDosItens(itens ?? [], equipamentos ?? [], categorias ?? []);

  const buffer = await renderToBuffer(
    PropostaDocument({ proposta, cliente, itens: itensComSetor })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="proposta-${id}.pdf"`,
    },
  });
}
