import type { DescontoTipo, SubmodoPrecificacao, TipoValorItem } from "@/types/domain";

export interface ItemPrecificavel {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  tipoValor: TipoValorItem;
  diarias?: number | null;
}

export interface ItemCalculado extends ItemPrecificavel {
  valorTotal: number;
}

/** Valor do item = quantidade x valor unitário, multiplicado pelas diárias quando o item for "por diária". */
export function calcularItens(itens: ItemPrecificavel[]): ItemCalculado[] {
  return itens.map((item) => ({
    ...item,
    valorTotal:
      item.tipoValor === "diaria"
        ? item.quantidade * Math.max(1, item.diarias ?? 1) * item.valorUnitario
        : item.quantidade * item.valorUnitario,
  }));
}

export interface ConfigTotal {
  submodo: SubmodoPrecificacao;
  itensCalculados: ItemCalculado[];
  valoresPorSetor?: Record<string, number>;
  valorManual?: number | null;
  descontoTipo?: DescontoTipo;
  descontoValor?: number;
}

export interface TotalCalculado {
  subtotal: number;
  desconto: number;
  total: number;
}

/**
 * Calcula o subtotal conforme o submodo (por item, por setor ou valor único),
 * depois aplica o desconto (percentual ou valor fixo) sobre esse subtotal, nunca
 * sobre outra base.
 */
export function calcularTotal(config: ConfigTotal): TotalCalculado {
  let subtotal: number;
  if (config.submodo === "item") {
    subtotal = config.itensCalculados.reduce((soma, i) => soma + i.valorTotal, 0);
  } else if (config.submodo === "setor") {
    subtotal = Object.values(config.valoresPorSetor ?? {}).reduce((soma, v) => soma + v, 0);
  } else {
    subtotal = config.valorManual ?? 0;
  }

  const descontoTipo = config.descontoTipo ?? "nenhum";
  const descontoValor = config.descontoValor ?? 0;
  const desconto =
    descontoTipo === "percentual"
      ? subtotal * (descontoValor / 100)
      : descontoTipo === "valor"
        ? descontoValor
        : 0;

  return { subtotal, desconto, total: Math.max(0, subtotal - desconto) };
}
