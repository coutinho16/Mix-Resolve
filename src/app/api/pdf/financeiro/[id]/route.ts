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

  const { data: itens } = await supabase
    .from("financeiro_itens")
    .select("*")
    .eq("financeiro_id", id)
    .order("ordem");

  const buffer = await renderToBuffer(
    FinanceiroDocument({ financeiro, itens: itens ?? [] })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${financeiro.tipo}-${id}.pdf"`,
    },
  });
}
