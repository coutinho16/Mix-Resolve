"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContratoItensEditor } from "@/components/contratos/ContratoItensEditor";
import { ContratoResumo } from "@/components/contratos/ContratoResumo";
import { resolverSetorDosItens, agruparPorSetor } from "@/lib/pdf/agrupamento";
import { atualizarContrato } from "@/app/gestao/contratos/actions";
import type {
  Assinante,
  CategoriaEquipamento,
  Cliente,
  Contrato,
  ContratoItem,
  ContratoSetorValor,
  Equipamento,
  SubmodoPrecificacao,
  TipoContratacao,
} from "@/types/domain";
import type { ContratoActionState } from "@/app/gestao/contratos/actions";

const estadoInicial: ContratoActionState = {};

type Aba = "contratante" | "objeto" | "equipamentos" | "pagamento" | "clausulas";

const abas: { id: Aba; numero: number; label: string }[] = [
  { id: "contratante", numero: 1, label: "Contratante" },
  { id: "objeto", numero: 2, label: "Objeto" },
  { id: "equipamentos", numero: 3, label: "Equipamentos" },
  { id: "pagamento", numero: 4, label: "Pagamento" },
  { id: "clausulas", numero: 5, label: "Cláusulas" },
];

interface ContratoWorkspaceProps {
  contrato: Contrato;
  clientes: Cliente[];
  equipamentos: Equipamento[];
  categorias: CategoriaEquipamento[];
  itens: ContratoItem[];
  setoresValor: ContratoSetorValor[];
}

export function ContratoWorkspace({
  contrato,
  clientes,
  equipamentos,
  categorias,
  itens,
  setoresValor,
}: ContratoWorkspaceProps) {
  const [aba, setAba] = useState<Aba>("contratante");
  const [state, formAction, pending] = useActionState(
    atualizarContrato.bind(null, contrato.id),
    estadoInicial
  );
  const [submodo, setSubmodo] = useState<SubmodoPrecificacao>(contrato.submodo_valor);
  const [tipoContratacao, setTipoContratacao] = useState<TipoContratacao>(contrato.tipo_contratacao);
  const [signatario, setSignatario] = useState<Assinante>(contrato.signatario);
  const [parcelas, setParcelas] = useState(
    contrato.parcelas.length > 0 ? contrato.parcelas : [{ valor: 0, vencimento: "" }]
  );

  const itensComSetor = resolverSetorDosItens(itens, equipamentos, categorias);
  const setoresComItens = agruparPorSetor(itensComSetor).map(([setor]) => setor);
  const ehPermuta = tipoContratacao === "permuta";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">
            Contrato {contrato.numero_cliente ? `nº ${contrato.numero_cliente}` : ""}
          </h1>
          <p className="text-sm text-neutro-1">
            {contrato.contratante_nome}
            <span className="text-neutro-1/70"> · controle #{contrato.numero_controle}</span>
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
          <div className="flex flex-wrap gap-1 rounded-xl bg-neutro-3 p-1">
            {abas.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAba(a.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors sm:text-xs ${
                  aba === a.id ? "bg-branco-puro text-preto shadow-sm" : "text-neutro-1 hover:text-preto"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
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
            <div className={aba === "contratante" ? "flex flex-col gap-4" : "hidden"}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cliente_id" className="text-sm font-medium text-preto">
                  Cliente salvo (opcional)
                </label>
                <select
                  id="cliente_id"
                  name="cliente_id"
                  defaultValue={contrato.cliente_id ?? ""}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                >
                  <option value="">Nenhum</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contratante_nome" className="text-sm font-medium text-preto">
                  Nome / Razão social
                </label>
                <input
                  id="contratante_nome"
                  name="contratante_nome"
                  required
                  defaultValue={contrato.contratante_nome}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contratante_documento" className="text-sm font-medium text-preto">
                    CPF/CNPJ
                  </label>
                  <input
                    id="contratante_documento"
                    name="contratante_documento"
                    defaultValue={contrato.contratante_documento ?? ""}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contratante_endereco" className="text-sm font-medium text-preto">
                    Endereço completo
                  </label>
                  <input
                    id="contratante_endereco"
                    name="contratante_endereco"
                    defaultValue={contrato.contratante_endereco ?? ""}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
              </div>
            </div>

            <div className={aba === "objeto" ? "flex flex-col gap-4" : "hidden"}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="objeto_montagem" className="text-sm font-medium text-preto">
                    Montagem
                  </label>
                  <input
                    id="objeto_montagem"
                    name="objeto_montagem"
                    type="date"
                    defaultValue={contrato.objeto_montagem ?? ""}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="objeto_data_evento" className="text-sm font-medium text-preto">
                    Data do evento
                  </label>
                  <input
                    id="objeto_data_evento"
                    name="objeto_data_evento"
                    type="date"
                    defaultValue={contrato.objeto_data_evento ?? ""}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="objeto_local" className="text-sm font-medium text-preto">
                  Local
                </label>
                <input
                  id="objeto_local"
                  name="objeto_local"
                  defaultValue={contrato.objeto_local ?? ""}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="objeto_desmontagem" className="text-sm font-medium text-preto">
                  Desmontagem
                </label>
                <input
                  id="objeto_desmontagem"
                  name="objeto_desmontagem"
                  defaultValue={contrato.objeto_desmontagem}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
            </div>

            <div className={aba === "equipamentos" ? "flex flex-col gap-3 rounded-xl border border-neutro-2 p-3" : "hidden"}>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-preto">Valores do contrato</span>
                <div className="flex gap-2 rounded-xl border border-neutro-2 bg-branco-puro p-1">
                  {(
                    [
                      ["unico", "Valor geral"],
                      ["setor", "Por setor"],
                      ["item", "Preço por item"],
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
                <input type="hidden" name="submodo_valor" value={submodo} />
                <p className="text-xs text-neutro-1">
                  Valor geral: total único definido na aba Pagamento. Por setor: um valor fechado
                  por setor. Preço por item: valor de cada equipamento. Nos dois últimos o total é
                  a soma. Clique em Salvar para aplicar.
                </p>
              </div>
            </div>

            <div className={aba === "pagamento" ? "flex flex-col gap-4" : "hidden"}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tipo_contratacao" className="text-sm font-medium text-preto">
                  Forma de contratação
                </label>
                <select
                  id="tipo_contratacao"
                  name="tipo_contratacao"
                  value={tipoContratacao}
                  onChange={(e) => setTipoContratacao(e.target.value as TipoContratacao)}
                  className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                >
                  <option value="pagamento">Pagamento</option>
                  <option value="permuta">Permuta</option>
                </select>
              </div>

              {ehPermuta ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="permuta_descricao" className="text-sm font-medium text-preto">
                      Descrição da permuta
                    </label>
                    <textarea
                      id="permuta_descricao"
                      name="permuta_descricao"
                      rows={3}
                      defaultValue={contrato.permuta_descricao ?? ""}
                      className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="permuta_valor" className="text-sm font-medium text-preto">
                      Valor equivalente da permuta (opcional)
                    </label>
                    <input
                      id="permuta_valor"
                      name="permuta_valor"
                      type="number"
                      step="0.01"
                      min={0}
                      defaultValue={contrato.permuta_valor ?? ""}
                      className="w-40 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>
                </>
              ) : (
                <>
                  {submodo === "unico" ? (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="valor_manual" className="text-sm font-medium text-preto">
                        Valor total do contrato (R$)
                      </label>
                      <input
                        id="valor_manual"
                        name="valor_manual"
                        type="number"
                        step="0.01"
                        min={0}
                        defaultValue={contrato.valor_manual ?? ""}
                        className="w-40 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-neutro-1">
                      Valor total (soma): R$ {contrato.valor_total.toFixed(2)}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-preto">Parcelas</span>
                    {parcelas.map((p, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          name="parcela_valor"
                          type="number"
                          step="0.01"
                          min={0}
                          defaultValue={p.valor}
                          placeholder="Valor"
                          className="w-32 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                        />
                        <input
                          name="parcela_vencimento"
                          defaultValue={p.vencimento}
                          placeholder="Vencimento (ex.: no ato da assinatura)"
                          className="flex-1 rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      className="self-start text-xs"
                      onClick={() => setParcelas([...parcelas, { valor: 0, vencimento: "" }])}
                    >
                      + Adicionar parcela
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banco_nome" className="text-sm font-medium text-preto">
                        Banco
                      </label>
                      <input
                        id="banco_nome"
                        name="banco_nome"
                        defaultValue={contrato.banco_nome ?? "Sicoob"}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banco_agencia" className="text-sm font-medium text-preto">
                        Agência
                      </label>
                      <input
                        id="banco_agencia"
                        name="banco_agencia"
                        defaultValue={contrato.banco_agencia ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banco_conta" className="text-sm font-medium text-preto">
                        Conta corrente
                      </label>
                      <input
                        id="banco_conta"
                        name="banco_conta"
                        defaultValue={contrato.banco_conta ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banco_chave_pix" className="text-sm font-medium text-preto">
                        Chave Pix
                      </label>
                      <input
                        id="banco_chave_pix"
                        name="banco_chave_pix"
                        defaultValue={contrato.banco_chave_pix ?? ""}
                        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="banco_favorecido" className="text-sm font-medium text-preto">
                      Favorecido
                    </label>
                    <input
                      id="banco_favorecido"
                      name="banco_favorecido"
                      defaultValue={contrato.banco_favorecido ?? "Mix Tenda e Iluminacao Ltda"}
                      className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                    />
                  </div>
                </>
              )}
            </div>

            <div className={aba === "clausulas" ? "flex flex-col gap-4" : "hidden"}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="data_contrato" className="text-sm font-medium text-preto">
                    Data do contrato
                  </label>
                  <input
                    id="data_contrato"
                    name="data_contrato"
                    type="date"
                    defaultValue={contrato.data_contrato}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-preto">Responsável pela Mix</span>
                  <div className="flex gap-4 pt-2">
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
                </div>
              </div>

              {(
                [
                  ["clausula2_texto", "Cláusula 2 · Obrigações da contratada", contrato.clausula2_texto],
                  ["clausula3_texto", "Cláusula 3 · Obrigações do contratante", contrato.clausula3_texto],
                  ["clausula5_texto", "Cláusula 5 · Cancelamento e multa", contrato.clausula5_texto],
                  ["clausula6_texto", "Cláusula 6 · Responsabilidades e garantias", contrato.clausula6_texto],
                  ["clausula7_texto", "Cláusula 7 · Disposições gerais", contrato.clausula7_texto],
                ] as const
              ).map(([name, label, valor]) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label htmlFor={name} className="text-sm font-medium text-preto">
                    {label}
                    <span className="ml-1 font-normal text-neutro-1">(uma frase por linha)</span>
                  </label>
                  <textarea
                    id={name}
                    name={name}
                    rows={4}
                    defaultValue={valor ?? ""}
                    className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="clausula8_texto" className="text-sm font-medium text-preto">
                  Cláusula 8 · Foro
                </label>
                <textarea
                  id="clausula8_texto"
                  name="clausula8_texto"
                  rows={2}
                  defaultValue={contrato.clausula8_texto ?? ""}
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
            <ContratoItensEditor
              contratoId={contrato.id}
              equipamentos={equipamentos}
              categorias={categorias}
              itens={itens}
              submodo={submodo}
              setoresValor={setoresValor}
              setoresComItens={setoresComItens}
            />
          </div>
        </Card>

        <ContratoResumo
          contratoId={contrato.id}
          status={contrato.status}
          itens={itensComSetor}
          valorTotal={ehPermuta ? contrato.permuta_valor ?? 0 : contrato.valor_total}
          ehPermuta={ehPermuta}
        />
      </div>
    </div>
  );
}
