import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ExcluirDocumentoBotao } from "@/components/ui/ExcluirDocumentoBotao";
import { ClienteAnexos } from "@/components/gestao/ClienteAnexos";
import { excluirProposta } from "@/app/gestao/propostas/actions";
import { excluirContrato } from "@/app/gestao/contratos/actions";
import { excluirFinanceiro } from "@/app/gestao/financeiro/actions";
import type {
  StatusContrato,
  StatusFinanceiro,
  StatusProposta,
  TipoFinanceiro,
} from "@/types/domain";

const rotuloProposta: Record<StatusProposta, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aceita: "Aceita",
  recusada: "Recusada",
  expirada: "Expirada",
};

const rotuloContrato: Record<StatusContrato, string> = {
  gerado: "Gerado",
  assinado: "Assinado",
  cancelado: "Cancelado",
};

const rotuloFinanceiro: Record<StatusFinanceiro, string> = {
  rascunho: "Rascunho",
  emitido: "Emitido",
  pago: "Pago",
  cancelado: "Cancelado",
};

const rotuloTipoFinanceiro: Record<TipoFinanceiro, string> = {
  fatura: "Fatura",
  recibo: "Recibo",
};

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: cliente },
    { data: propostas },
    { data: contratos },
    { data: financeiro },
    { data: anexos },
  ] = await Promise.all([
    supabase.from("clientes").select("*").eq("id", id).single(),
    supabase.from("propostas").select("*").eq("cliente_id", id).order("created_at", { ascending: false }),
    supabase.from("contratos").select("*").eq("cliente_id", id).order("gerado_em", { ascending: false }),
    supabase.from("financeiro").select("*").eq("cliente_id", id).order("created_at", { ascending: false }),
    supabase.from("cliente_anexos").select("*").eq("cliente_id", id).order("created_at", { ascending: false }),
  ]);

  if (!cliente) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/gestao/clientes" className="text-sm text-neutro-1 hover:text-laranja">
          ← Clientes
        </Link>
        <h1 className="mt-1 font-titulo text-2xl font-semibold text-preto">{cliente.nome}</h1>
        <p className="text-sm text-neutro-1">
          {[cliente.empresa, cliente.documento].filter(Boolean).join(" · ") || "Sem dados adicionais"}
        </p>
      </div>

      <Card className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Contato
          </span>
          <p className="text-sm text-preto">{cliente.contato_nome ?? "-"}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Telefone
          </span>
          <p className="text-sm text-preto">{cliente.telefone ?? "-"}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            E-mail
          </span>
          <p className="text-sm text-preto">{cliente.email || "-"}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Endereço
          </span>
          <p className="text-sm text-preto">{cliente.endereco ?? "-"}</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="font-titulo text-lg font-semibold text-preto">Propostas</h2>
        <ul className="flex flex-col gap-2">
          {(propostas ?? []).map((p) => (
            <li key={p.id} className="flex items-center gap-1">
              <Link
                href={`/gestao/propostas/${p.id}`}
                className="flex flex-1 items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm hover:bg-neutro-3"
              >
                <span className="text-preto">
                  Proposta {p.numero_cliente ? `nº ${p.numero_cliente}` : ""}
                  <span className="ml-2 text-neutro-1">R$ {p.valor_total.toFixed(2)}</span>
                </span>
                <Chip estado={p.status === "aceita" ? "disponivel" : "em-uso"} texto={rotuloProposta[p.status]} />
              </Link>
              <ExcluirDocumentoBotao
                descricao="esta proposta"
                onConfirmar={excluirProposta.bind(null, p.id, id)}
              />
            </li>
          ))}
          {(!propostas || propostas.length === 0) && (
            <p className="text-sm text-neutro-1">Nenhuma proposta para este cliente.</p>
          )}
        </ul>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="font-titulo text-lg font-semibold text-preto">Contratos</h2>
        <ul className="flex flex-col gap-2">
          {(contratos ?? []).map((c) => (
            <li key={c.id} className="flex items-center gap-1">
              <Link
                href={`/gestao/contratos/${c.id}`}
                className="flex flex-1 items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm hover:bg-neutro-3"
              >
                <span className="text-preto">
                  Contrato {c.numero_cliente ? `nº ${c.numero_cliente}` : ""}
                  <span className="ml-2 text-neutro-1">R$ {c.valor_total.toFixed(2)}</span>
                </span>
                <Chip estado={c.status === "assinado" ? "disponivel" : "em-uso"} texto={rotuloContrato[c.status]} />
              </Link>
              <ExcluirDocumentoBotao
                descricao="este contrato"
                onConfirmar={excluirContrato.bind(null, c.id, id)}
              />
            </li>
          ))}
          {(!contratos || contratos.length === 0) && (
            <p className="text-sm text-neutro-1">Nenhum contrato para este cliente.</p>
          )}
        </ul>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="font-titulo text-lg font-semibold text-preto">Notas de fatura e recibos</h2>
        <ul className="flex flex-col gap-2">
          {(financeiro ?? []).map((f) => (
            <li key={f.id} className="flex items-center gap-1">
              <Link
                href={`/gestao/financeiro/${f.id}`}
                className="flex flex-1 items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm hover:bg-neutro-3"
              >
                <span className="text-preto">
                  {rotuloTipoFinanceiro[f.tipo]}
                  {f.numero ? ` nº ${f.numero}` : ""}
                  <span className="ml-2 text-neutro-1">R$ {f.valor_total.toFixed(2)}</span>
                </span>
                <Chip estado={f.status === "pago" ? "disponivel" : "em-uso"} texto={rotuloFinanceiro[f.status]} />
              </Link>
              <ExcluirDocumentoBotao
                descricao={f.tipo === "fatura" ? "esta fatura" : "este recibo"}
                onConfirmar={excluirFinanceiro.bind(null, f.id, id)}
              />
            </li>
          ))}
          {(!financeiro || financeiro.length === 0) && (
            <p className="text-sm text-neutro-1">Nenhuma fatura ou recibo para este cliente.</p>
          )}
        </ul>
      </Card>

      <Card>
        <ClienteAnexos clienteId={cliente.id} anexos={anexos ?? []} />
      </Card>
    </div>
  );
}
