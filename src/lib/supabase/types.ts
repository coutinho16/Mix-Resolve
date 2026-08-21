// Tipos escritos à mão a partir das migrations em supabase/migrations/.
// Quando o projeto Supabase existir, prefira regenerar com:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
// (mantendo os nomes de tabela/coluna em sincronia com o schema real).

export type PerfilUsuario = "gestao" | "campo";
export type PapelGestao = "admin" | "operacional";
export type StatusEvento =
  | "orcamento"
  | "confirmado"
  | "em_andamento"
  | "concluido"
  | "cancelado";
export type EtapaEquipe = "montagem" | "operacao" | "desmontagem";
export type TipoChecklist = "montagem" | "devolucao";
export type StatusChecklist = "pendente" | "em_andamento" | "concluido";
export type StatusItemChecklist = "pendente" | "confirmado" | "avariado";
export type StatusProposta =
  | "rascunho"
  | "enviada"
  | "aceita"
  | "recusada"
  | "expirada";
export type Assinante = "gabriel" | "higor";
export type StatusContrato = "gerado" | "assinado" | "cancelado";
export type TipoValorItem = "diaria" | "fechado";
export type SubmodoPrecificacao = "item" | "setor" | "unico";
export type DescontoTipo = "nenhum" | "percentual" | "valor";
export type TipoContratacao = "pagamento" | "permuta";
export type TipoFinanceiro = "fatura" | "recibo";
export type StatusFinanceiro = "rascunho" | "emitido" | "pago" | "cancelado";
export interface Parcela {
  valor: number;
  vencimento: string;
}

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nome: string;
          usuario_login: string | null;
          perfil: PerfilUsuario;
          papel_gestao: PapelGestao | null;
          cargo: string | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["usuarios"]["Row"]> & {
          id: string;
          nome: string;
          perfil: PerfilUsuario;
        };
        Update: Partial<Database["public"]["Tables"]["usuarios"]["Row"]>;
        Relationships: [];
      };
      clientes: {
        Row: {
          id: string;
          nome: string;
          empresa: string | null;
          documento: string | null;
          contato_nome: string | null;
          telefone: string | null;
          email: string | null;
          endereco: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clientes"]["Row"]> & {
          nome: string;
        };
        Update: Partial<Database["public"]["Tables"]["clientes"]["Row"]>;
        Relationships: [];
      };
      categorias_equipamento: {
        Row: { id: string; nome: string; ordem: number };
        Insert: Partial<
          Database["public"]["Tables"]["categorias_equipamento"]["Row"]
        > & { nome: string };
        Update: Partial<
          Database["public"]["Tables"]["categorias_equipamento"]["Row"]
        >;
        Relationships: [];
      };
      equipamentos: {
        Row: {
          id: string;
          categoria_id: string;
          nome: string;
          quantidade_total: number;
          quantidade_em_uso: number;
          quantidade_manutencao: number;
          preco_referencia: number | null;
          estoque_minimo: number | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["equipamentos"]["Row"]> & {
          categoria_id: string;
          nome: string;
          quantidade_total: number;
        };
        Update: Partial<Database["public"]["Tables"]["equipamentos"]["Row"]>;
        Relationships: [];
      };
      eventos: {
        Row: {
          id: string;
          nome: string;
          cliente_id: string | null;
          data_inicio: string;
          data_fim: string;
          data_montagem: string | null;
          hora_montagem: string | null;
          local: string | null;
          status: StatusEvento;
          observacoes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["eventos"]["Row"]> & {
          nome: string;
          data_inicio: string;
          data_fim: string;
        };
        Update: Partial<Database["public"]["Tables"]["eventos"]["Row"]>;
        Relationships: [];
      };
      evento_equipamentos: {
        Row: {
          id: string;
          evento_id: string;
          equipamento_id: string;
          quantidade_reservada: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["evento_equipamentos"]["Row"]
        > & { evento_id: string; equipamento_id: string; quantidade_reservada: number };
        Update: Partial<
          Database["public"]["Tables"]["evento_equipamentos"]["Row"]
        >;
        Relationships: [];
      };
      evento_equipe: {
        Row: {
          id: string;
          evento_id: string;
          usuario_id: string;
          etapa: EtapaEquipe;
          funcao: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["evento_equipe"]["Row"]> & {
          evento_id: string;
          usuario_id: string;
          etapa: EtapaEquipe;
        };
        Update: Partial<Database["public"]["Tables"]["evento_equipe"]["Row"]>;
        Relationships: [];
      };
      checklists: {
        Row: {
          id: string;
          evento_id: string;
          tipo: TipoChecklist;
          status: StatusChecklist;
          usuario_responsavel_id: string | null;
          iniciado_em: string | null;
          concluido_em: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["checklists"]["Row"]> & {
          evento_id: string;
          tipo: TipoChecklist;
        };
        Update: Partial<Database["public"]["Tables"]["checklists"]["Row"]>;
        Relationships: [];
      };
      checklist_itens: {
        Row: {
          id: string;
          checklist_id: string;
          equipamento_id: string;
          quantidade_esperada: number;
          quantidade_avariada: number;
          status: StatusItemChecklist;
          descricao_avaria: string | null;
          confirmado_por: string | null;
          confirmado_em: string | null;
        };
        Insert: Partial<
          Database["public"]["Tables"]["checklist_itens"]["Row"]
        > & {
          checklist_id: string;
          equipamento_id: string;
          quantidade_esperada: number;
        };
        Update: Partial<Database["public"]["Tables"]["checklist_itens"]["Row"]>;
        Relationships: [];
      };
      avarias: {
        Row: {
          id: string;
          checklist_item_id: string;
          equipamento_id: string;
          evento_id: string;
          quantidade: number;
          descricao: string | null;
          registrado_por: string | null;
          registrado_em: string;
        };
        Insert: Partial<Database["public"]["Tables"]["avarias"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["avarias"]["Row"]>;
        Relationships: [];
      };
      propostas: {
        Row: {
          id: string;
          cliente_id: string;
          evento_id: string | null;
          numero_cliente: number | null;
          numero_controle: number;
          submodo_precificacao: SubmodoPrecificacao;
          config_precificacao: Record<string, unknown>;
          desconto_tipo: DescontoTipo;
          desconto_valor: number;
          valor_manual: number | null;
          tem_permuta: boolean;
          condicoes_permuta: string | null;
          signatario: Assinante;
          status: StatusProposta;
          validade: string | null;
          valor_total: number;
          observacoes: string | null;
          local: string | null;
          data_evento_texto: string | null;
          montagem_texto: string | null;
          forma_pagamento: string | null;
          pix_beneficiario: string | null;
          pix_chave: string | null;
          cargo_signatario: string | null;
          texto_abertura: string | null;
          diferenciais: string[];
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["propostas"]["Row"]> & {
          cliente_id: string;
          signatario: Assinante;
        };
        Update: Partial<Database["public"]["Tables"]["propostas"]["Row"]>;
        Relationships: [];
      };
      proposta_itens: {
        Row: {
          id: string;
          proposta_id: string;
          equipamento_id: string | null;
          descricao: string;
          quantidade: number;
          tipo_valor: TipoValorItem;
          diarias: number | null;
          valor_unitario: number;
          valor_total: number;
          origem: "catalogo" | "manual";
          ordem: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["proposta_itens"]["Row"]
        > & {
          proposta_id: string;
          descricao: string;
          quantidade: number;
          valor_unitario: number;
          valor_total: number;
          origem: "catalogo" | "manual";
        };
        Update: Partial<Database["public"]["Tables"]["proposta_itens"]["Row"]>;
        Relationships: [];
      };
      proposta_setores_valor: {
        Row: { id: string; proposta_id: string; setor: string; valor: number };
        Insert: Partial<
          Database["public"]["Tables"]["proposta_setores_valor"]["Row"]
        > & { proposta_id: string; setor: string };
        Update: Partial<
          Database["public"]["Tables"]["proposta_setores_valor"]["Row"]
        >;
        Relationships: [];
      };
      contratos: {
        Row: {
          id: string;
          proposta_id: string | null;
          numero_contrato: string | null;
          cliente_id: string | null;
          evento_id: string | null;
          contratante_nome: string;
          contratante_documento: string | null;
          contratante_endereco: string | null;
          numero_cliente: number | null;
          numero_controle: number;
          objeto_montagem: string | null;
          objeto_data_evento: string | null;
          objeto_local: string | null;
          objeto_desmontagem: string;
          submodo_valor: SubmodoPrecificacao;
          valor_manual: number | null;
          valor_total: number;
          tipo_contratacao: TipoContratacao;
          parcelas: Parcela[];
          banco_nome: string | null;
          banco_agencia: string | null;
          banco_conta: string | null;
          banco_chave_pix: string | null;
          banco_favorecido: string | null;
          permuta_descricao: string | null;
          permuta_valor: number | null;
          data_contrato: string;
          clausula2_texto: string | null;
          clausula3_texto: string | null;
          clausula5_texto: string | null;
          clausula6_texto: string | null;
          clausula7_texto: string | null;
          clausula8_texto: string | null;
          signatario: Assinante;
          status: StatusContrato;
          gerado_em: string;
          assinado_em: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["contratos"]["Row"]> & {
          contratante_nome: string;
          signatario: Assinante;
        };
        Update: Partial<Database["public"]["Tables"]["contratos"]["Row"]>;
        Relationships: [];
      };
      contrato_itens: {
        Row: {
          id: string;
          contrato_id: string;
          equipamento_id: string | null;
          descricao: string;
          quantidade: number;
          tipo_valor: TipoValorItem;
          diarias: number | null;
          valor_unitario: number;
          valor_total: number;
          origem: "catalogo" | "manual";
          ordem: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["contrato_itens"]["Row"]
        > & {
          contrato_id: string;
          descricao: string;
          quantidade: number;
          valor_unitario: number;
          valor_total: number;
          origem: "catalogo" | "manual";
        };
        Update: Partial<Database["public"]["Tables"]["contrato_itens"]["Row"]>;
        Relationships: [];
      };
      contrato_setores_valor: {
        Row: { id: string; contrato_id: string; setor: string; valor: number };
        Insert: Partial<
          Database["public"]["Tables"]["contrato_setores_valor"]["Row"]
        > & { contrato_id: string; setor: string };
        Update: Partial<
          Database["public"]["Tables"]["contrato_setores_valor"]["Row"]
        >;
        Relationships: [];
      };
      financeiro: {
        Row: {
          id: string;
          tipo: TipoFinanceiro;
          numero: string | null;
          numero_controle: number;
          data_emissao: string;
          cliente_id: string | null;
          cliente_nome: string | null;
          cliente_documento: string | null;
          proposta_id: string | null;
          contrato_id: string | null;
          descricao: string | null;
          valor_total: number;
          forma_pagamento: string | null;
          vencimento: string | null;
          observacoes: string | null;
          signatario: Assinante | null;
          status: StatusFinanceiro;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["financeiro"]["Row"]> & {
          tipo: TipoFinanceiro;
        };
        Update: Partial<Database["public"]["Tables"]["financeiro"]["Row"]>;
        Relationships: [];
      };
      financeiro_itens: {
        Row: {
          id: string;
          financeiro_id: string;
          descricao: string;
          quantidade: number;
          valor_unitario: number;
          valor_total: number;
          ordem: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["financeiro_itens"]["Row"]
        > & {
          financeiro_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["financeiro_itens"]["Row"]
        >;
        Relationships: [];
      };
    };
    Views: {
      v_reservas_diarias: {
        Row: {
          equipamento_id: string;
          data: string;
          evento_id: string;
          evento_nome: string;
          quantidade_reservada: number;
        };
        Relationships: [];
      };
      v_conflitos_agenda: {
        Row: {
          equipamento_id: string;
          data: string;
          total_reservado: number;
          capacidade: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      fn_disponibilidade: {
        Args: { p_equipamento_id: string; p_data: string };
        Returns: number;
      };
      fn_gerar_checklists: {
        Args: { p_evento_id: string };
        Returns: void;
      };
      fn_resolver_email_login: {
        Args: { p_usuario_login: string };
        Returns: string | null;
      };
    };
  };
}
