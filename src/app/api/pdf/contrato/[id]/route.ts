import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { ContratoDocument } from "@/lib/pdf/ContratoDocument";
import { resolverSetorDosItens } from "@/lib/pdf/agrupamento";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contrato } = await supabase.from("contratos").select("*").eq("id", id).single();

  if (!contrato) {
    return new Response("Contrato não encontrado.", { status: 404 });
  }

  const [{ data: itens }, { data: equipamentos }, { data: categorias }, { data: proposta }, { data: cliente }] =
    await Promise.all([
      supabase.from("contrato_itens").select("*").eq("contrato_id", id).order("ordem"),
      supabase.from("equipamentos").select("*"),
      supabase.from("categorias_equipamento").select("*"),
      contrato.proposta_id
        ? supabase.from("propostas").select("numero_cliente").eq("id", contrato.proposta_id).maybeSingle()
        : Promise.resolve({ data: null }),
      contrato.cliente_id
        ? supabase.from("clientes").select("numero").eq("id", contrato.cliente_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const itensComSetor = resolverSetorDosItens(itens ?? [], equipamentos ?? [], categorias ?? []);

  const buffer = await renderToBuffer(
    ContratoDocument({
      contrato,
      itens: itensComSetor,
      propostaNumeroCliente: proposta?.numero_cliente ?? null,
      clienteNumero: cliente?.numero ?? null,
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrato-${id}.pdf"`,
    },
  });
}
