import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContratoForm } from "@/components/contratos/ContratoForm";
import { criarContrato } from "@/app/gestao/contratos/actions";
import { primeiraDataDoTexto } from "@/lib/contratos/parseData";
import type { Cliente } from "@/types/domain";

export default async function NovoContratoPage({
  searchParams,
}: {
  searchParams: Promise<{ propostaId?: string }>;
}) {
  const { propostaId } = await searchParams;
  const supabase = await createClient();

  const [{ data: clientes }, { data: eventos }, { data: propostasAceitas }, { data: contratosExistentes }] =
    await Promise.all([
      supabase.from("clientes").select("*").order("nome"),
      supabase.from("eventos").select("*").order("data_inicio", { ascending: false }),
      supabase.from("propostas").select("*, clientes(*)").eq("status", "aceita"),
      supabase.from("contratos").select("proposta_id"),
    ]);

  const propostaIdsComContrato = new Set(
    (contratosExistentes ?? []).map((c) => c.proposta_id).filter(Boolean)
  );
  const propostasDisponiveis = (propostasAceitas ?? []).filter(
    (p) => !propostaIdsComContrato.has(p.id) || p.id === propostaId
  );

  let dadosPuxados = null;
  if (propostaId) {
    const proposta = propostasDisponiveis.find((p) => p.id === propostaId);
    if (proposta) {
      const cliente = (proposta as unknown as { clientes: Cliente }).clientes;
      dadosPuxados = {
        contratante_nome: cliente?.empresa || cliente?.nome || "",
        contratante_documento: cliente?.documento ?? "",
        contratante_endereco: cliente?.endereco ?? "",
        objeto_local: proposta.local ?? "",
        objeto_data_evento: primeiraDataDoTexto(proposta.data_evento_texto) ?? "",
        objeto_montagem: primeiraDataDoTexto(proposta.montagem_texto) ?? "",
        cliente_id: proposta.cliente_id,
        evento_id: proposta.evento_id ?? "",
        valor_manual: proposta.valor_total,
      };
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">Novo contrato</h1>
          <p className="text-sm text-neutro-1">
            Preencha o contratante, ou puxe os dados de uma proposta aceita abaixo.
          </p>
        </div>
        <Link href="/gestao/clientes">
          <Button type="button" variant="secondary">
            <Users size={16} />
            Clientes
          </Button>
        </Link>
      </div>

      {propostasDisponiveis.length > 0 && (
        <Card className="flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-medium text-preto">Puxar dados da proposta</span>
          <form action="/gestao/contratos/novo" className="flex flex-1 gap-2">
            <select
              name="propostaId"
              defaultValue={propostaId ?? ""}
              className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            >
              <option value="">Nenhuma proposta selecionada</option>
              {propostasDisponiveis.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p as unknown as { clientes?: { nome: string } }).clientes?.nome ?? "Proposta"}
                  {p.numero_cliente ? ` · nº ${p.numero_cliente}` : ""}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary">
              Puxar
            </Button>
          </form>
        </Card>
      )}

      <Card className="p-5">
        <ContratoForm
          clientes={clientes ?? []}
          eventos={eventos ?? []}
          propostaId={propostaId ?? null}
          dadosPuxados={dadosPuxados}
          action={criarContrato}
        />
      </Card>
    </div>
  );
}
