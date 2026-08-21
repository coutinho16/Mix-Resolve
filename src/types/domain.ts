import type { Database } from "@/lib/supabase/types";

export type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];
export type Cliente = Database["public"]["Tables"]["clientes"]["Row"];
export type CategoriaEquipamento =
  Database["public"]["Tables"]["categorias_equipamento"]["Row"];
export type Equipamento = Database["public"]["Tables"]["equipamentos"]["Row"];
export type Evento = Database["public"]["Tables"]["eventos"]["Row"];
export type EventoEquipamento =
  Database["public"]["Tables"]["evento_equipamentos"]["Row"];
export type EventoEquipe = Database["public"]["Tables"]["evento_equipe"]["Row"];
export type Checklist = Database["public"]["Tables"]["checklists"]["Row"];
export type ChecklistItem =
  Database["public"]["Tables"]["checklist_itens"]["Row"];
export type Avaria = Database["public"]["Tables"]["avarias"]["Row"];
export type Proposta = Database["public"]["Tables"]["propostas"]["Row"];
export type PropostaItem =
  Database["public"]["Tables"]["proposta_itens"]["Row"];
export type PropostaSetorValor =
  Database["public"]["Tables"]["proposta_setores_valor"]["Row"];
export type Contrato = Database["public"]["Tables"]["contratos"]["Row"];
export type ContratoItem =
  Database["public"]["Tables"]["contrato_itens"]["Row"];
export type ContratoSetorValor =
  Database["public"]["Tables"]["contrato_setores_valor"]["Row"];
export type Financeiro = Database["public"]["Tables"]["financeiro"]["Row"];
export type FinanceiroItem =
  Database["public"]["Tables"]["financeiro_itens"]["Row"];

export type {
  PerfilUsuario,
  PapelGestao,
  StatusEvento,
  EtapaEquipe,
  TipoChecklist,
  StatusChecklist,
  StatusItemChecklist,
  StatusProposta,
  Assinante,
  StatusContrato,
  TipoValorItem,
  SubmodoPrecificacao,
  DescontoTipo,
  TipoContratacao,
  Parcela,
  TipoFinanceiro,
  StatusFinanceiro,
} from "@/lib/supabase/types";
