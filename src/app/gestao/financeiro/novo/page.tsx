import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FinanceiroForm } from "@/components/financeiro/FinanceiroForm";
import { criarFinanceiro } from "@/app/gestao/financeiro/actions";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { Cliente } from "@/types/domain";

export default async function NovoFinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ propostaId?: string; contratoId?: string }>;
}) {
  const { propostaId, contratoId } = await searchParams;
  const supabase = await createClient();

  const [{ data: clientes }, { data: propostas }, { data: contratos }] = await Promise.all([
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("propostas").select("*, clientes(*)").order("created_at", { ascending: false }),
    supabase.from("contratos").select("*, clientes(*)").order("gerado_em", { ascending: false }),
  ]);

  let dadosPuxados = null;
  let itensPuxados: { descricao: string; quantidade: number; valor_unitario: number; valor_total: number }[] = [];

  if (propostaId) {
    const proposta = (propostas ?? []).find((p) => p.id === propostaId);
    if (proposta) {
      const cliente = (proposta as unknown as { clientes: Cliente }).clientes;
      dadosPuxados = {
        tipo: "fatura" as const,
        cliente_id: proposta.cliente_id ?? "",
        cliente_nome: cliente?.empresa || cliente?.nome || "",
        cliente_documento: cliente?.documento ?? "",
        cliente_endereco: cliente?.endereco ?? "",
        cliente_telefone: cliente?.telefone ?? "",
        cliente_email: cliente?.email ?? "",
        proposta_id: proposta.id,
        contrato_id: "",
        descricao: `Referente à proposta ${formatarNumeroDocumento(cliente?.numero, "P", proposta.numero_cliente)}`,
        valor_total: proposta.valor_total,
      };
      const { data: itens } = await supabase
        .from("proposta_itens")
        .select("*")
        .eq("proposta_id", proposta.id)
        .order("ordem");
      itensPuxados = (itens ?? []).map((i) => ({
        descricao: i.descricao,
        quantidade: i.quantidade,
        valor_unitario: i.valor_unitario,
        valor_total: i.valor_total,
      }));
    }
  } else if (contratoId) {
    const contrato = (contratos ?? []).find((c) => c.id === contratoId);
    if (contrato) {
      const cliente = (contrato as unknown as { clientes: Cliente | null }).clientes;
      dadosPuxados = {
        tipo: "fatura" as const,
        cliente_id: contrato.cliente_id ?? "",
        cliente_nome: cliente?.empresa || cliente?.nome || contrato.contratante_nome || "",
        cliente_documento: cliente?.documento || contrato.contratante_documento || "",
        cliente_endereco: cliente?.endereco || contrato.contratante_endereco || "",
        cliente_telefone: cliente?.telefone ?? "",
        cliente_email: cliente?.email ?? "",
        proposta_id: "",
        contrato_id: contrato.id,
        descricao: `Referente ao contrato ${formatarNumeroDocumento(cliente?.numero, "C", contrato.numero_cliente)}`,
        valor_total: contrato.valor_total,
      };
      const { data: itens } = await supabase
        .from("contrato_itens")
        .select("*")
        .eq("contrato_id", contrato.id)
        .order("ordem");
      itensPuxados = (itens ?? []).map((i) => ({
        descricao: i.descricao,
        quantidade: i.quantidade,
        valor_unitario: i.valor_unitario,
        valor_total: i.valor_total,
      }));
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">
            Nova fatura ou recibo
          </h1>
          <p className="text-sm text-neutro-1">
            Preencha manualmente ou puxe os dados de uma proposta ou contrato existente.
            Nenhum campo é obrigatório, exceto o tipo do documento.
          </p>
        </div>
        <Link href="/gestao/clientes">
          <Button type="button" variant="secondary">
            <Users size={16} />
            Clientes
          </Button>
        </Link>
      </div>

      {((propostas?.length ?? 0) > 0 || (contratos?.length ?? 0) > 0) && (
        <Card className="flex flex-col gap-3 p-4">
          <span className="text-sm font-medium text-preto">Puxar dados existentes</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <form action="/gestao/financeiro/novo" className="flex flex-1 gap-2">
              <select
                name="propostaId"
                defaultValue={propostaId ?? ""}
                className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              >
                <option value="">Nenhuma proposta selecionada</option>
                {(propostas ?? []).map((p) => {
                  const cliente = (p as unknown as { clientes?: { nome: string; numero: number } }).clientes;
                  return (
                    <option key={p.id} value={p.id}>
                      {cliente?.nome ?? "Proposta"} · {formatarNumeroDocumento(cliente?.numero, "P", p.numero_cliente)}
                    </option>
                  );
                })}
              </select>
              <Button type="submit" variant="secondary">
                Puxar da proposta
              </Button>
            </form>
            <form action="/gestao/financeiro/novo" className="flex flex-1 gap-2">
              <select
                name="contratoId"
                defaultValue={contratoId ?? ""}
                className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              >
                <option value="">Nenhum contrato selecionado</option>
                {(contratos ?? []).map((c) => {
                  const cliente = (c as unknown as { clientes?: { numero: number } }).clientes;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.contratante_nome || "Contrato"} ·{" "}
                      {formatarNumeroDocumento(cliente?.numero, "C", c.numero_cliente)}
                    </option>
                  );
                })}
              </select>
              <Button type="submit" variant="secondary">
                Puxar do contrato
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <FinanceiroForm
          clientes={clientes ?? []}
          dadosPuxados={dadosPuxados}
          itensPuxados={itensPuxados}
          action={criarFinanceiro}
        />
      </Card>
    </div>
  );
}
