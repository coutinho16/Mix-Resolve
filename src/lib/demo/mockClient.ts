import { cookies } from "next/headers";
import * as store from "@/lib/demo/store";

const DEMO_COOKIE = "demo_usuario_id";

// ---------------------------------------------------------------------------
// Registro das tabelas "reais" (arrays mutáveis do store, para insert/update/delete)
// ---------------------------------------------------------------------------
const tables: Record<string, Record<string, unknown>[]> = {
  usuarios: store.usuarios as unknown as Record<string, unknown>[],
  clientes: store.clientes as unknown as Record<string, unknown>[],
  categorias_equipamento: store.categoriasEquipamento as unknown as Record<string, unknown>[],
  equipamentos: store.equipamentos as unknown as Record<string, unknown>[],
  eventos: store.eventos as unknown as Record<string, unknown>[],
  evento_equipamentos: store.eventoEquipamentos as unknown as Record<string, unknown>[],
  evento_equipe: store.eventoEquipe as unknown as Record<string, unknown>[],
  checklists: store.checklists as unknown as Record<string, unknown>[],
  checklist_itens: store.checklistItens as unknown as Record<string, unknown>[],
  avarias: store.avarias as unknown as Record<string, unknown>[],
  propostas: store.propostas as unknown as Record<string, unknown>[],
  proposta_itens: store.propostaItens as unknown as Record<string, unknown>[],
  proposta_setores_valor: store.propostaSetoresValor as unknown as Record<string, unknown>[],
  contratos: store.contratos as unknown as Record<string, unknown>[],
  contrato_itens: store.contratoItens as unknown as Record<string, unknown>[],
  contrato_setores_valor: store.contratoSetoresValor as unknown as Record<string, unknown>[],
};

const fkMap: Record<string, Record<string, { column: string; table: string }>> = {
  eventos: { clientes: { column: "cliente_id", table: "clientes" } },
  propostas: { clientes: { column: "cliente_id", table: "clientes" } },
  contratos: { clientes: { column: "cliente_id", table: "clientes" } },
  evento_equipe: { eventos: { column: "evento_id", table: "eventos" } },
};

function proximoNumeroControle(linhas: Record<string, unknown>[]): number {
  const maior = linhas.reduce((max, l) => Math.max(max, Number(l.numero_controle ?? 0)), 0);
  return maior + 1;
}

function defaultsFor(table: string): Record<string, unknown> {
  const agora = new Date().toISOString();
  switch (table) {
    case "clientes":
      return { created_at: agora, updated_at: agora };
    case "categorias_equipamento":
      return { ordem: 0 };
    case "equipamentos":
      return {
        quantidade_em_uso: 0,
        quantidade_manutencao: 0,
        ativo: true,
        created_at: agora,
      };
    case "eventos":
      return { status: "orcamento", created_at: agora, updated_at: agora };
    case "propostas":
      return {
        config_precificacao: {},
        submodo_precificacao: "item",
        desconto_tipo: "nenhum",
        desconto_valor: 0,
        diferenciais: [],
        tem_permuta: false,
        status: "rascunho",
        valor_total: 0,
        numero_controle: proximoNumeroControle(store.propostas as unknown as Record<string, unknown>[]),
        created_at: agora,
        updated_at: agora,
      };
    case "proposta_itens":
      return { ordem: 0, tipo_valor: "fechado", diarias: null };
    case "proposta_setores_valor":
      return { valor: 0 };
    case "contratos":
      return {
        contratante_nome: "",
        objeto_desmontagem: "No termino do evento",
        submodo_valor: "item",
        valor_total: 0,
        tipo_contratacao: "pagamento",
        parcelas: [],
        banco_nome: "Sicoob",
        banco_favorecido: "Mix Tenda e Iluminacao Ltda",
        data_contrato: agora.slice(0, 10),
        numero_controle: proximoNumeroControle(store.contratos as unknown as Record<string, unknown>[]),
        status: "gerado",
        gerado_em: agora,
      };
    case "contrato_itens":
      return { ordem: 0, tipo_valor: "fechado", diarias: null };
    case "contrato_setores_valor":
      return { valor: 0 };
    case "checklist_itens":
      return { quantidade_avariada: 0, status: "pendente" };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Views computadas (equivalentes às views SQL de 0007_views_disponibilidade.sql)
// ---------------------------------------------------------------------------
function computarReservasDiarias() {
  const linhas: Array<{
    equipamento_id: string;
    data: string;
    evento_id: string;
    evento_nome: string;
    quantidade_reservada: number;
  }> = [];

  for (const ee of store.eventoEquipamentos) {
    const evento = store.eventos.find((e) => e.id === ee.evento_id);
    if (!evento || evento.status === "cancelado") continue;

    const inicio = new Date(`${evento.data_montagem ?? evento.data_inicio}T00:00:00`);
    const fim = new Date(`${evento.data_fim}T00:00:00`);
    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      linhas.push({
        equipamento_id: ee.equipamento_id,
        data: d.toISOString().slice(0, 10),
        evento_id: evento.id,
        evento_nome: evento.nome,
        quantidade_reservada: ee.quantidade_reservada,
      });
    }
  }
  return linhas;
}

function computarConflitosAgenda() {
  const reservas = computarReservasDiarias();
  const grupos = new Map<string, { equipamento_id: string; data: string; total_reservado: number }>();

  for (const r of reservas) {
    const chave = `${r.equipamento_id}|${r.data}`;
    const atual = grupos.get(chave);
    if (atual) atual.total_reservado += r.quantidade_reservada;
    else grupos.set(chave, { equipamento_id: r.equipamento_id, data: r.data, total_reservado: r.quantidade_reservada });
  }

  const resultado: Array<{ equipamento_id: string; data: string; total_reservado: number; capacidade: number }> = [];
  for (const g of grupos.values()) {
    const equipamento = store.equipamentos.find((e) => e.id === g.equipamento_id);
    if (!equipamento) continue;
    const capacidade = equipamento.quantidade_total - equipamento.quantidade_manutencao;
    if (g.total_reservado > capacidade) {
      resultado.push({ ...g, capacidade });
    }
  }
  return resultado;
}

function getTableArray(table: string): Record<string, unknown>[] {
  if (table === "v_reservas_diarias") return computarReservasDiarias() as unknown as Record<string, unknown>[];
  if (table === "v_conflitos_agenda") return computarConflitosAgenda() as unknown as Record<string, unknown>[];
  return tables[table] ?? [];
}

// ---------------------------------------------------------------------------
// Query builder genérico (thenable, imita o subconjunto do postgrest-js usado no app)
// ---------------------------------------------------------------------------
type Filtro = { tipo: "eq" | "neq" | "gte" | "lte" | "in"; col: string; val: unknown };

class MockQueryBuilder {
  private modo: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private selectCols = "*";
  private filtros: Filtro[] = [];
  private orderCol?: string;
  private orderAsc = true;
  private singleModo: "single" | "maybeSingle" | null = null;
  private payload: unknown;
  private onConflictCols?: string[];

  constructor(private table: string) {}

  select(cols = "*") {
    this.selectCols = cols;
    return this;
  }
  eq(col: string, val: unknown) {
    this.filtros.push({ tipo: "eq", col, val });
    return this;
  }
  neq(col: string, val: unknown) {
    this.filtros.push({ tipo: "neq", col, val });
    return this;
  }
  gte(col: string, val: unknown) {
    this.filtros.push({ tipo: "gte", col, val });
    return this;
  }
  lte(col: string, val: unknown) {
    this.filtros.push({ tipo: "lte", col, val });
    return this;
  }
  in(col: string, vals: unknown[]) {
    this.filtros.push({ tipo: "in", col, val: vals });
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = opts?.ascending ?? true;
    return this;
  }
  single() {
    this.singleModo = "single";
    return this;
  }
  maybeSingle() {
    this.singleModo = "maybeSingle";
    return this;
  }
  insert(payload: unknown) {
    this.modo = "insert";
    this.payload = payload;
    return this;
  }
  update(payload: unknown) {
    this.modo = "update";
    this.payload = payload;
    return this;
  }
  delete() {
    this.modo = "delete";
    return this;
  }
  upsert(payload: unknown, opts?: { onConflict?: string }) {
    this.modo = "upsert";
    this.payload = payload;
    this.onConflictCols = opts?.onConflict?.split(",");
    return this;
  }

  // torna a instância "awaitable", como o builder real do supabase-js
  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.executar().then(onfulfilled, onrejected);
  }

  private aplicaFiltros(linhas: Record<string, unknown>[]) {
    return linhas.filter((linha) =>
      this.filtros.every((f) => {
        const valor = linha[f.col];
        switch (f.tipo) {
          case "eq":
            return valor === f.val;
          case "neq":
            return valor !== f.val;
          case "gte":
            return String(valor) >= String(f.val);
          case "lte":
            return String(valor) <= String(f.val);
          case "in":
            return Array.isArray(f.val) && f.val.includes(valor);
          default:
            return true;
        }
      })
    );
  }

  private aplicaEmbeds(linhas: Record<string, unknown>[]) {
    const embeds = fkMap[this.table];
    if (!embeds) return linhas;

    const nomesEmbed = Object.keys(embeds).filter((nome) => this.selectCols.includes(`${nome}(`));
    if (nomesEmbed.length === 0) return linhas;

    return linhas.map((linha) => {
      const nova = { ...linha };
      for (const nomeEmbed of nomesEmbed) {
        const rel = embeds[nomeEmbed];
        const relacionada = getTableArray(rel.table).find((r) => r.id === linha[rel.column]);
        nova[nomeEmbed] = relacionada ?? null;
      }
      return nova;
    });
  }

  private async executar(): Promise<{ data: unknown; error: { message: string } | null }> {
    if (this.modo === "insert") {
      const alvo = tables[this.table];
      if (!alvo) return { data: null, error: { message: `Tabela desconhecida: ${this.table}` } };

      const itens = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inseridos = itens.map((item) => {
        const semUndefined = Object.fromEntries(
          Object.entries(item as Record<string, unknown>).filter(([, v]) => v !== undefined)
        );
        const linha = {
          id: crypto.randomUUID(),
          ...defaultsFor(this.table),
          ...semUndefined,
        };
        alvo.push(linha);
        return linha;
      });

      return { data: Array.isArray(this.payload) ? inseridos : inseridos[0], error: null };
    }

    if (this.modo === "update") {
      const alvo = tables[this.table] ?? [];
      const encontrados = this.aplicaFiltros(alvo);
      const payload = this.payload as Record<string, unknown>;
      const semUndefined = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      );
      encontrados.forEach((linha) => Object.assign(linha, semUndefined));
      return { data: encontrados, error: null };
    }

    if (this.modo === "delete") {
      const alvo = tables[this.table];
      if (!alvo) return { data: null, error: null };
      const removidos = this.aplicaFiltros(alvo);
      for (const linha of removidos) {
        const idx = alvo.indexOf(linha);
        if (idx >= 0) alvo.splice(idx, 1);
      }
      return { data: removidos, error: null };
    }

    if (this.modo === "upsert") {
      const alvo = tables[this.table];
      if (!alvo) return { data: null, error: { message: `Tabela desconhecida: ${this.table}` } };
      const cols = this.onConflictCols ?? ["id"];
      const payloadObj = this.payload as Record<string, unknown>;
      const existente = alvo.find((linha) => cols.every((c) => linha[c] === payloadObj[c]));
      if (existente) {
        Object.assign(existente, payloadObj);
        return { data: existente, error: null };
      }
      const nova = { id: crypto.randomUUID(), ...defaultsFor(this.table), ...payloadObj };
      alvo.push(nova);
      return { data: nova, error: null };
    }

    // select
    let linhas = getTableArray(this.table);
    linhas = this.aplicaFiltros(linhas);
    linhas = this.aplicaEmbeds(linhas);

    if (this.orderCol) {
      const col = this.orderCol;
      linhas = [...linhas].sort((a, b) => {
        const av = String(a[col] ?? "");
        const bv = String(b[col] ?? "");
        return this.orderAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    if (this.singleModo === "single") {
      if (linhas.length === 0) return { data: null, error: { message: "Nenhum registro encontrado." } };
      return { data: linhas[0], error: null };
    }
    if (this.singleModo === "maybeSingle") {
      return { data: linhas[0] ?? null, error: null };
    }
    return { data: linhas, error: null };
  }
}

// ---------------------------------------------------------------------------
// RPCs (equivalentes às funções SQL usadas pelo app)
// ---------------------------------------------------------------------------
async function executarRpc(nome: string, args: Record<string, unknown> = {}) {
  if (nome === "fn_gerar_checklists") {
    const eventoId = args.p_evento_id as string;
    for (const tipo of ["montagem", "devolucao"] as const) {
      let checklist = store.checklists.find((c) => c.evento_id === eventoId && c.tipo === tipo);
      if (!checklist) {
        checklist = {
          id: crypto.randomUUID(),
          evento_id: eventoId,
          tipo,
          status: "pendente",
          usuario_responsavel_id: null,
          iniciado_em: null,
          concluido_em: null,
        };
        store.checklists.push(checklist);
      }
      const itensEvento = store.eventoEquipamentos.filter((ee) => ee.evento_id === eventoId);
      for (const item of itensEvento) {
        const jaExiste = store.checklistItens.some(
          (ci) => ci.checklist_id === checklist!.id && ci.equipamento_id === item.equipamento_id
        );
        if (!jaExiste) {
          store.checklistItens.push({
            id: crypto.randomUUID(),
            checklist_id: checklist.id,
            equipamento_id: item.equipamento_id,
            quantidade_esperada: item.quantidade_reservada,
            quantidade_avariada: 0,
            status: "pendente",
            descricao_avaria: null,
            confirmado_por: null,
            confirmado_em: null,
          });
        }
      }
    }
    return { data: null, error: null };
  }

  if (nome === "fn_resolver_email_login") {
    const login = args.p_usuario_login as string;
    const usuario = store.usuarios.find((u) => u.usuario_login === login && u.ativo);
    if (!usuario) return { data: null, error: null };
    const auth = store.authUsuarios.find((a) => a.id === usuario.id);
    return { data: auth?.email ?? null, error: null };
  }

  if (nome === "fn_disponibilidade") {
    const equipamentoId = args.p_equipamento_id as string;
    const data = args.p_data as string;
    const equipamento = store.equipamentos.find((e) => e.id === equipamentoId);
    if (!equipamento) return { data: 0, error: null };
    const reservado = computarReservasDiarias()
      .filter((r) => r.equipamento_id === equipamentoId && r.data === data)
      .reduce((soma, r) => soma + r.quantidade_reservada, 0);
    return {
      data: equipamento.quantidade_total - equipamento.quantidade_manutencao - reservado,
      error: null,
    };
  }

  return { data: null, error: { message: `RPC desconhecida: ${nome}` } };
}

// ---------------------------------------------------------------------------
// Cliente mock (server-side, com sessão via cookie)
// ---------------------------------------------------------------------------
export async function createMockServerClient() {
  const cookieStore = await cookies();
  const usuarioIdAtual = cookieStore.get(DEMO_COOKIE)?.value ?? null;

  return {
    from(table: string) {
      return new MockQueryBuilder(table);
    },
    rpc(nome: string, args?: Record<string, unknown>) {
      return executarRpc(nome, args);
    },
    auth: {
      async getUser() {
        if (!usuarioIdAtual) return { data: { user: null }, error: null };
        return { data: { user: { id: usuarioIdAtual } }, error: null };
      },
      async signInWithPassword({ email }: { email: string; password: string }) {
        const auth = store.authUsuarios.find(
          (a) => a.email.toLowerCase() === String(email).toLowerCase()
        );
        if (!auth) {
          return {
            data: { user: null, session: null },
            error: { message: "Credenciais inválidas." },
          };
        }
        cookieStore.set(DEMO_COOKIE, auth.id, { path: "/", httpOnly: true, sameSite: "lax" });
        return { data: { user: { id: auth.id }, session: {} }, error: null };
      },
      async signOut() {
        cookieStore.delete(DEMO_COOKIE);
        return { error: null };
      },
    },
  };
}

// ---------------------------------------------------------------------------
// "Admin" mock (equivalente ao supabase.auth.admin usado nas rotas /api/admin/*)
// ---------------------------------------------------------------------------
export function createMockAdminClient() {
  return {
    auth: {
      admin: {
        async createUser(opts: {
          email: string;
          password: string;
          email_confirm?: boolean;
          user_metadata: Record<string, unknown>;
        }) {
          if (store.authUsuarios.some((a) => a.email.toLowerCase() === opts.email.toLowerCase())) {
            return { data: { user: null }, error: { message: "already been registered" } };
          }
          const id = crypto.randomUUID();
          store.authUsuarios.push({ id, email: opts.email });
          store.usuarios.push({
            id,
            nome: String(opts.user_metadata.nome ?? opts.email),
            usuario_login: (opts.user_metadata.usuario_login as string) ?? null,
            perfil: (opts.user_metadata.perfil as "gestao" | "campo") ?? "campo",
            papel_gestao: (opts.user_metadata.papel_gestao as "admin" | "operacional" | null) ?? null,
            cargo: (opts.user_metadata.cargo as string) ?? null,
            ativo: true,
            created_at: new Date().toISOString(),
          });
          return { data: { user: { id } }, error: null };
        },
        async deleteUser(id: string) {
          const idxAuth = store.authUsuarios.findIndex((a) => a.id === id);
          if (idxAuth >= 0) store.authUsuarios.splice(idxAuth, 1);
          const idxUsuario = store.usuarios.findIndex((u) => u.id === id);
          if (idxUsuario >= 0) store.usuarios.splice(idxUsuario, 1);
          return { data: null, error: null };
        },
      },
    },
  };
}
