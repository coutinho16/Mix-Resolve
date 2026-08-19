"use client";

import { useRef, useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { resolverSetorDosItens, agruparPorSetor } from "@/lib/pdf/agrupamento";
import type {
  CategoriaEquipamento,
  Equipamento,
  PropostaItem,
  PropostaSetorValor,
  SubmodoPrecificacao,
  TipoValorItem,
} from "@/types/domain";
import {
  adicionarItemProposta,
  removerItemProposta,
  salvarValorSetorProposta,
} from "@/app/gestao/propostas/actions";

interface PropostaItensEditorProps {
  propostaId: string;
  equipamentos: Equipamento[];
  categorias: CategoriaEquipamento[];
  itens: PropostaItem[];
  submodo: SubmodoPrecificacao;
  setoresValor: PropostaSetorValor[];
  setoresComItens: string[];
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PropostaItensEditor({
  propostaId,
  equipamentos,
  categorias,
  itens,
  submodo,
  setoresValor,
  setoresComItens,
}: PropostaItensEditorProps) {
  const [origem, setOrigem] = useState<"catalogo" | "manual">("catalogo");
  const [tipoValor, setTipoValor] = useState<TipoValorItem>("fechado");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await adicionarItemProposta(propostaId, formData);
      formRef.current?.reset();
    });
  }

  const grupos = agruparPorSetor(resolverSetorDosItens(itens, equipamentos, categorias));
  const mostraPrecoPorItem = submodo === "item";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-titulo text-base font-semibold text-preto">
          Equipamentos e serviços
        </h2>
        <p className="text-xs text-neutro-1">
          Adicione itens do catálogo ou personalizados. Eles serão agrupados por
          setor na proposta final.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-neutro-2 bg-neutro-3/60 p-4">
        <div className="mb-3 flex gap-4 text-sm">
          <label className="flex items-center gap-1.5 text-preto">
            <input
              type="radio"
              checked={origem === "catalogo"}
              onChange={() => setOrigem("catalogo")}
              className="accent-laranja"
            />
            Do catálogo
          </label>
          <label className="flex items-center gap-1.5 text-preto">
            <input
              type="radio"
              checked={origem === "manual"}
              onChange={() => setOrigem("manual")}
              className="accent-laranja"
            />
            Item manual
          </label>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-wrap items-end gap-3"
        >
          {origem === "catalogo" ? (
            <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
                Equipamento
              </label>
              <select
                name="equipamento_id"
                onChange={(e) => {
                  const eq = equipamentos.find((x) => x.id === e.target.value);
                  const form = e.target.form!;
                  (form.elements.namedItem("descricao") as HTMLInputElement).value =
                    eq?.nome ?? "";
                  (form.elements.namedItem("valor_unitario") as HTMLInputElement).value =
                    eq?.preco_referencia != null ? String(eq.preco_referencia) : "";
                }}
                className="rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
              >
                <option value="">Selecione...</option>
                {equipamentos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <input type="hidden" name="descricao" defaultValue="" />

          {origem === "manual" && (
            <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
                Descrição
              </label>
              <input
                name="descricao_manual"
                onChange={(e) => {
                  const form = e.target.form!;
                  (form.elements.namedItem("descricao") as HTMLInputElement).value =
                    e.target.value;
                }}
                className="rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
              Qtd.
            </label>
            <input
              name="quantidade"
              type="number"
              min={1}
              defaultValue={1}
              required
              className="w-20 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>

          {mostraPrecoPorItem && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
                  Cobrança
                </label>
                <select
                  name="tipo_valor"
                  value={tipoValor}
                  onChange={(e) => setTipoValor(e.target.value as TipoValorItem)}
                  className="rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
                >
                  <option value="fechado">Valor fechado</option>
                  <option value="diaria">Por diária</option>
                </select>
              </div>

              {tipoValor === "diaria" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
                    Diárias
                  </label>
                  <input
                    name="diarias"
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-20 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
                  Valor unitário
                </label>
                <input
                  name="valor_unitario"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={0}
                  className="w-32 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
                />
              </div>
            </>
          )}

          {!mostraPrecoPorItem && (
            <>
              <input type="hidden" name="tipo_valor" value="fechado" />
              <input type="hidden" name="valor_unitario" value="0" />
            </>
          )}

          <Button type="submit" disabled={pending}>
            <Plus size={16} />
            Adicionar
          </Button>
        </form>
      </div>

      {submodo === "setor" && setoresComItens.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutro-2 p-4">
          <span className="text-xs font-bold uppercase tracking-wide text-neutro-1">
            Valor por setor
          </span>
          {setoresComItens.map((setor) => {
            const qtdItens = grupos.find(([s]) => s === setor)?.[1].length ?? 0;
            const valorAtual = setoresValor.find((s) => s.setor === setor)?.valor ?? 0;
            return (
              <form
                key={setor}
                action={(fd) => salvarValorSetorProposta(propostaId, fd)}
                className="flex flex-wrap items-end justify-between gap-3"
              >
                <input type="hidden" name="setor" value={setor} />
                <span className="text-sm text-preto">
                  {setor} <span className="text-neutro-1">({qtdItens} itens)</span>
                </span>
                <div className="flex items-end gap-2">
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    min={0}
                    defaultValue={valorAtual}
                    className="w-32 rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm outline-none focus:border-laranja"
                  />
                  <Button type="submit" variant="secondary">
                    Salvar
                  </Button>
                </div>
              </form>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {grupos.map(([setor, itensDoSetor]) => {
          const subtotal = itensDoSetor.reduce((acc, i) => acc + i.valor_total, 0);
          return (
            <div key={setor} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-laranja">
                  <span className="h-1.5 w-1.5 rounded-full bg-laranja" />
                  {setor}
                </span>
                {mostraPrecoPorItem && (
                  <span className="text-xs font-semibold text-neutro-1">{fmt(subtotal)}</span>
                )}
              </div>
              <ul className="flex flex-col gap-1.5">
                {itensDoSetor.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-neutro-2 bg-branco-puro px-3 py-2 text-sm"
                  >
                    <span className="text-preto">
                      {item.descricao}{" "}
                      <span className="text-neutro-1">
                        x{item.quantidade}
                        {mostraPrecoPorItem &&
                          (item.tipo_valor === "diaria"
                            ? ` · ${item.diarias ?? 1} diária(s) · ${fmt(item.valor_unitario)} = ${fmt(item.valor_total)}`
                            : ` · ${fmt(item.valor_unitario)} = ${fmt(item.valor_total)}`)}
                      </span>
                    </span>
                    <button
                      onClick={() => removerItemProposta(propostaId, item.id)}
                      aria-label="Remover"
                      className="rounded p-1 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {itens.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
            Nenhum item adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
