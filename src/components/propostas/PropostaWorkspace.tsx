"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { AssinaturaPreview } from "@/components/propostas/AssinaturaPreview";
import { PropostaItensEditor } from "@/components/propostas/PropostaItensEditor";
import { PropostaResumo } from "@/components/propostas/PropostaResumo";
import { resolverSetorDosItens, agruparPorSetor } from "@/lib/pdf/agrupamento";
import { atualizarProposta } from "@/app/gestao/propostas/actions";
import type {
  Assinante,
  CategoriaEquipamento,
  Cliente,
  Contrato,
  DescontoTipo,
  Equipamento,
  Evento,
  Proposta,
  PropostaItem,
  PropostaSetorValor,
  SubmodoPrecificacao,
} from "@/types/domain";
import type { PropostaActionState } from "@/app/gestao/propostas/actions";

const estadoInicial: PropostaActionState = {};

type Aba = "dados" | "equipamentos" | "textos";

const abas: { id: Aba; numero: number; label: string }[] = [
  { id: "dados", numero: 1, label: "Dados" },
  { id: "equipamentos", numero: 2, label: "Equipamentos" },
  { id: "textos", numero: 3, label: "Textos & Pagamento" },
];

interface PropostaWorkspaceProps {
  proposta: Proposta;
  clientes: Cliente[];
  eventos: Evento[];
  equipamentos: Equipamento[];
  categorias: CategoriaEquipamento[];
  itens: PropostaItem[];
  setoresValor: PropostaSetorValor[];
  contrato: Contrato | null;
}

export function PropostaWorkspace({
  proposta,
  clientes,
  eventos,
  equipamentos,
  categorias,
  itens,
  setoresValor,
  contrato,
}: PropostaWorkspaceProps) {
  const [modo, setModo] = useState<"proposta" | "contrato">("proposta");
  const [aba, setAba] = useState<Aba>("dados");
  const [state, formAction, pending] = useActionState(
    atualizarProposta.bind(null, proposta.id),
    estadoInicial
  );
  const [temPermuta, setTemPermuta] = useState(proposta.tem_permuta);
  const [signatario, setSignatario] = useState<Assinante>(proposta.signatario);
  const [submodo, setSubmodo] = useState<SubmodoPrecificacao>(proposta.submodo_precificacao);
  const [descontoTipo, setDescontoTipo] = useState<DescontoTipo>(proposta.desconto_tipo);
  const [diferenciais, setDiferenciais] = useState<string[]>(
    proposta.diferenciais.length > 0 ? proposta.diferenciais : ["", "", "", ""]
  );

  const itensComSetor = resolverSetorDosItens(itens, equipamentos, categorias);
  const setoresComItens = agruparPorSetor(itensComSetor).map(([setor]) => setor);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">
            Proposta {proposta.numero_cliente ? `nº ${proposta.numero_cliente}` : ""}
          </h1>
          <p className="text-sm text-neutro-1">
            {clientes.find((c) => c.id === proposta.cliente_id)?.nome ?? "Sem cliente"}
            <span className="text-neutro-1/70"> · controle #{proposta.numero_controle}</span>
          </p>
        </div>
        <Link href="/gestao/clientes">
          <Button type="button" variant="secondary">
            <Users size={16} />
            Clientes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <Card className="flex flex-col gap-5 p-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutro-3 p-1">
            {(["proposta", "contrato"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModo(m)}
                className={`rounded-lg py-2 text-sm font-semibold font-titulo capitalize transition-colors ${
                  modo === m
                    ? "bg-branco-puro text-preto shadow-sm"
                    : "text-neutro-1 hover:text-preto"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {modo === "proposta" ? (
            <>
              <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
                {abas.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAba(a.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      aba === a.id
                        ? "bg-branco-puro text-preto shadow-sm"
                        : "text-neutro-1 hover:text-preto"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                        aba === a.id ? "bg-laranja text-branco-puro" : "bg-neutro-2 text-neutro-1"
                      }`}
                    >
                      {a.numero}
                    </span>
                    {a.label}
                  </button>
                ))}
              </div>

              <form action={formAction} className="flex flex-col gap-5">
                <div className={aba === "dados" ? "flex flex-col gap-4" : "hidden"}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
                        Cliente
                      </label>
                      <select
                        id="cliente_id"
                        name="cliente_id"
                        defaultValue={proposta.cliente_id}
                        required
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>
                        {clientes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="evento_id" className="text-sm font-medium text-preto">
                        Evento vinculado (opcional)
                      </label>
                      <select
                        id="evento_id"
                        name="evento_id"
                        defaultValue={proposta.evento_id ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      >
                        <option value="">Sem evento vinculado</option>
                        {eventos.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="local" className="text-sm font-medium text-preto">
                        Local do evento
                      </label>
                      <input
                        id="local"
                        name="local"
                        defaultValue={proposta.local ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="data_evento_texto" className="text-sm font-medium text-preto">
                        Data do evento
                      </label>
                      <input
                        id="data_evento_texto"
                        name="data_evento_texto"
                        placeholder="ex.: 11 a 17 de agosto de 2026"
                        defaultValue={proposta.data_evento_texto ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="montagem_texto" className="text-sm font-medium text-preto">
                      Montagem (opcional)
                    </label>
                    <input
                      id="montagem_texto"
                      name="montagem_texto"
                      defaultValue={proposta.montagem_texto ?? ""}
                      className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="validade" className="text-sm font-medium text-preto">
                      Válida até
                    </label>
                    <input
                      id="validade"
                      name="validade"
                      type="date"
                      defaultValue={proposta.validade ?? ""}
                      className="w-full max-w-[220px] rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>

                </div>

                <div className={aba === "equipamentos" ? "flex flex-col gap-3 rounded-xl border border-neutro-2 p-3" : "hidden"}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-preto">Tipo de proposta</span>
                    <div className="flex gap-2 rounded-xl border border-neutro-2 bg-branco-puro p-1">
                      {(
                        [
                          ["item", "Preço por item"],
                          ["setor", "Valor por setor"],
                          ["unico", "Valor total único"],
                        ] as const
                      ).map(([valor, rotulo]) => (
                        <button
                          key={valor}
                          type="button"
                          onClick={() => setSubmodo(valor)}
                          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors sm:text-sm ${
                            submodo === valor
                              ? "bg-laranja text-branco-puro"
                              : "text-neutro-1 hover:text-preto"
                          }`}
                        >
                          {rotulo}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="submodo_precificacao" value={submodo} />
                  </div>

                  {submodo === "unico" && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="valor_manual" className="text-sm font-medium text-preto">
                        Valor final da proposta (R$)
                      </label>
                      <input
                        id="valor_manual"
                        name="valor_manual"
                        type="number"
                        step="0.01"
                        min={0}
                        defaultValue={proposta.valor_manual ?? ""}
                        className="w-40 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-preto">
                      Desconto <span className="font-normal text-neutro-1">(aplicado sobre o valor total)</span>
                    </span>
                    <div className="flex gap-2 rounded-xl border border-neutro-2 bg-branco-puro p-1">
                      {(
                        [
                          ["nenhum", "Sem desconto"],
                          ["percentual", "Percentual (%)"],
                          ["valor", "Valor (R$)"],
                        ] as const
                      ).map(([valor, rotulo]) => (
                        <button
                          key={valor}
                          type="button"
                          onClick={() => setDescontoTipo(valor)}
                          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors sm:text-sm ${
                            descontoTipo === valor
                              ? "bg-laranja text-branco-puro"
                              : "text-neutro-1 hover:text-preto"
                          }`}
                        >
                          {rotulo}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="desconto_tipo" value={descontoTipo} />
                  </div>
                  {descontoTipo !== "nenhum" && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="desconto_valor" className="text-sm font-medium text-preto">
                        {descontoTipo === "percentual" ? "Percentual" : "Valor (R$)"}
                      </label>
                      <input
                        id="desconto_valor"
                        name="desconto_valor"
                        type="number"
                        step="0.01"
                        min={0}
                        defaultValue={proposta.desconto_valor}
                        className="w-40 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  )}
                  <p className="text-xs text-neutro-1">
                    Clique em Salvar para aplicar o tipo de proposta e o desconto escolhidos aqui.
                  </p>
                </div>

                <div className={aba === "textos" ? "flex flex-col gap-4" : "hidden"}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="texto_abertura" className="text-sm font-medium text-preto">
                      Por que escolher a Mix
                    </label>
                    <textarea
                      id="texto_abertura"
                      name="texto_abertura"
                      rows={3}
                      defaultValue={proposta.texto_abertura ?? ""}
                      placeholder="Texto de abertura da proposta"
                      className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-preto">Diferenciais (até 4)</span>
                    {diferenciais.map((d, idx) => (
                      <input
                        key={idx}
                        name="diferenciais"
                        value={d}
                        onChange={(e) => {
                          const novo = [...diferenciais];
                          novo[idx] = e.target.value;
                          setDiferenciais(novo);
                        }}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="forma_pagamento" className="text-sm font-medium text-preto">
                        Forma de pagamento
                      </label>
                      <input
                        id="forma_pagamento"
                        name="forma_pagamento"
                        placeholder="Pix ou transferência bancária"
                        defaultValue={proposta.forma_pagamento ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pix_beneficiario" className="text-sm font-medium text-preto">
                        Beneficiário do Pix
                      </label>
                      <input
                        id="pix_beneficiario"
                        name="pix_beneficiario"
                        defaultValue={proposta.pix_beneficiario ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pix_chave" className="text-sm font-medium text-preto">
                      Chave Pix
                    </label>
                    <input
                      id="pix_chave"
                      name="pix_chave"
                      defaultValue={proposta.pix_chave ?? ""}
                      className="w-full max-w-sm rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-preto">
                      <input
                        type="checkbox"
                        name="tem_permuta"
                        checked={temPermuta}
                        onChange={(e) => setTemPermuta(e.target.checked)}
                        className="h-4 w-4 accent-laranja"
                      />
                      Proposta com cláusula de permuta
                    </label>
                    {temPermuta && (
                      <textarea
                        name="condicoes_permuta"
                        rows={2}
                        placeholder="Condições da permuta"
                        defaultValue={proposta.condicoes_permuta ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-preto">Signatário</span>
                    <div className="flex gap-4">
                      {(["gabriel", "higor"] as const).map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm text-preto">
                          <input
                            type="radio"
                            name="signatario"
                            value={s}
                            checked={signatario === s}
                            onChange={() => setSignatario(s)}
                            className="h-4 w-4 accent-laranja"
                          />
                          {s === "gabriel" ? "Gabriel Coutinho" : "Higor Amaral"}
                        </label>
                      ))}
                    </div>
                    <input
                      name="cargo_signatario"
                      placeholder="Cargo (opcional)"
                      defaultValue={proposta.cargo_signatario ?? ""}
                      className="w-full max-w-xs rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                    <AssinaturaPreview signatario={signatario} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="observacoes" className="text-sm font-medium text-preto">
                      Observações
                    </label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      rows={3}
                      defaultValue={proposta.observacoes ?? ""}
                      className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>
                </div>

                {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

                <div className="flex justify-end">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>

              <div className={aba === "equipamentos" ? "block" : "hidden"}>
                <PropostaItensEditor
                  propostaId={proposta.id}
                  equipamentos={equipamentos}
                  categorias={categorias}
                  itens={itens}
                  submodo={submodo}
                  setoresValor={setoresValor}
                  setoresComItens={setoresComItens}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-titulo text-base font-semibold text-preto">
                  {contrato?.numero_contrato ?? "Contrato ainda não gerado"}
                </span>
                {contrato && <Chip estado="disponivel" texto={contrato.status} />}
              </div>
              <p className="text-sm text-neutro-1">
                {contrato
                  ? "Este contrato foi gerado a partir desta proposta. Abra o contrato para editar cláusulas, pagamento e itens de forma independente."
                  : "Marque a proposta como aceita para liberar a geração do contrato, disponível no painel de resumo ao lado."}
              </p>
              {contrato && (
                <Link href={`/gestao/contratos/${contrato.id}`}>
                  <Button type="button" variant="secondary" className="self-start">
                    Abrir contrato
                  </Button>
                </Link>
              )}
            </div>
          )}
        </Card>

        <PropostaResumo
          propostaId={proposta.id}
          status={proposta.status}
          contratoId={contrato?.id ?? null}
          itens={itensComSetor}
          valorTotal={proposta.valor_total}
        />
      </div>
    </div>
  );
}
