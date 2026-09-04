import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { FinanceiroListaDocument, type ItemListaFinanceiro } from "@/lib/pdf/FinanceiroListaDocument";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { TipoFinanceiro } from "@/types/domain";

export const runtime = "nodejs";

const rotulosFiltro: Record<string, string> = {
  todos: "Todos os registros",
  pendente: "Somente pendentes",
  pago: "Somente pagos",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipoParam = searchParams.get("tipo");
  const statusParam = searchParams.get("status") ?? "todos";
  const tipo: TipoFinanceiro = tipoParam === "recibo" ? "recibo" : "fatura";

  const supabase = await createClient();
  let query = supabase
    .from("financeiro")
    .select("*, clientes(numero)")
    .eq("tipo", tipo)
    .order("data_emissao", { ascending: false });

  if (statusParam === "pago") {
    query = query.eq("status", "pago");
  } else if (statusParam === "pendente") {
    query = query.in("status", ["rascunho", "emitido"]);
  }

  const { data: registros } = await query;

  const itens: ItemListaFinanceiro[] = (registros ?? []).map((r) => {
    const cliente = (r as unknown as { clientes: { numero: number } | null }).clientes;
    return {
      id: r.id,
      numeroFormatado: formatarNumeroDocumento(cliente?.numero, tipo === "fatura" ? "N" : "R", r.numero_cliente),
      clienteNome: r.cliente_nome ?? "",
      valorTotal: r.valor_total,
      dataEmissao: r.data_emissao,
      status: r.status,
    };
  });

  const buffer = await renderToBuffer(
    FinanceiroListaDocument({
      tipo,
      filtroLabel: rotulosFiltro[statusParam] ?? rotulosFiltro.todos,
      itens,
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${tipo}s-${statusParam}.pdf"`,
    },
  });
}
