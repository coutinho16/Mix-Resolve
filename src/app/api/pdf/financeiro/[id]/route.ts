import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { FinanceiroDocument } from "@/lib/pdf/FinanceiroDocument";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: financeiro } = await supabase.from("financeiro").select("*").eq("id", id).single();

  if (!financeiro) {
    return new Response("Registro financeiro não encontrado.", { status: 404 });
  }

  const [{ data: itens }, { data: cliente }, { data: proposta }] = await Promise.all([
    supabase.from("financeiro_itens").select("*").eq("financeiro_id", id).order("ordem"),
    financeiro.cliente_id
      ? supabase.from("clientes").select("numero").eq("id", financeiro.cliente_id).maybeSingle()
      : Promise.resolve({ data: null }),
    financeiro.proposta_id
      ? supabase.from("propostas").select("numero_cliente").eq("id", financeiro.proposta_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const buffer = await renderToBuffer(
    FinanceiroDocument({
      financeiro,
      itens: itens ?? [],
      clienteNumero: cliente?.numero ?? null,
      propostaNumeroCliente: proposta?.numero_cliente ?? null,
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${financeiro.tipo}-${id}.pdf"`,
    },
  });
}
