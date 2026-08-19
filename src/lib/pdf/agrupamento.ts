import type { CategoriaEquipamento, Equipamento } from "@/types/domain";

/** Ordem preferida de exibição dos setores nos PDFs (igual ao gerador de referência). */
const ORDEM_SETORES = [
  "Painel de LED / Audiovisual",
  "Sonorização",
  "Iluminação",
  "Estrutura",
  "Serviços",
];

export const SETOR_PADRAO = "Serviços";

/** Formato mínimo compartilhado por proposta_itens e contrato_itens. */
export interface ItemAgrupavel {
  id: string;
  equipamento_id: string | null;
  descricao: string;
  quantidade: number;
  tipo_valor: "diaria" | "fechado";
  diarias: number | null;
  valor_unitario: number;
  valor_total: number;
}

export type ItemComSetor<T extends ItemAgrupavel = ItemAgrupavel> = T & { setor: string };

/**
 * Resolve o setor (categoria) de cada item a partir do equipamento vinculado. Itens
 * manuais (sem equipamento_id) caem no setor padrão "Serviços".
 */
export function resolverSetorDosItens<T extends ItemAgrupavel>(
  itens: T[],
  equipamentos: Equipamento[],
  categorias: CategoriaEquipamento[]
): ItemComSetor<T>[] {
  const categoriaPorId = new Map(categorias.map((c) => [c.id, c.nome]));
  const setorPorEquipamentoId = new Map(
    equipamentos.map((e) => [e.id, categoriaPorId.get(e.categoria_id) ?? SETOR_PADRAO])
  );

  return itens.map((item) => ({
    ...item,
    setor:
      (item.equipamento_id && setorPorEquipamentoId.get(item.equipamento_id)) || SETOR_PADRAO,
  }));
}

/** Agrupa itens já resolvidos (com `setor`) respeitando a ordem preferida de setores. */
export function agruparPorSetor<T extends ItemAgrupavel>(
  itens: ItemComSetor<T>[]
): Array<[string, ItemComSetor<T>[]]> {
  const mapa = new Map<string, ItemComSetor<T>[]>();
  for (const item of itens) {
    const lista = mapa.get(item.setor) ?? [];
    lista.push(item);
    mapa.set(item.setor, lista);
  }

  const ordenados: Array<[string, ItemComSetor<T>[]]> = [];
  for (const setor of ORDEM_SETORES) {
    const lista = mapa.get(setor);
    if (lista) ordenados.push([setor, lista]);
  }
  for (const [setor, lista] of mapa) {
    if (!ORDEM_SETORES.includes(setor)) ordenados.push([setor, lista]);
  }
  return ordenados;
}
