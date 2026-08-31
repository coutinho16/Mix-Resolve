import type {
  Avaria,
  Checklist,
  ChecklistItem,
  CategoriaEquipamento,
  Cliente,
  Contrato,
  ContratoItem,
  ContratoSetorValor,
  Equipamento,
  Evento,
  EventoEquipamento,
  EventoEquipe,
  Financeiro,
  FinanceiroItem,
  Proposta,
  PropostaItem,
  PropostaSetorValor,
  Usuario,
} from "@/types/domain";

function id() {
  return crypto.randomUUID();
}

function dataOffset(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

// ---- usuários (equipe real da Mix Resolve, para o demo de login) ----
export const USR_HIGOR = id();
export const USR_GABRIEL = id();
export const USR_FLAVIO = id();
export const USR_DIEGO_HUGO = id();
export const USR_JOAO = id();
export const USR_DIEGO_MACEDO = id();
export const USR_CARLOS = id();
export const USR_JACKSON = id();
export const USR_NIELSON = id();

export const AUTH_DEMO_SENHA = "demo"; // qualquer valor funciona no modo demonstração

interface AuthUsuarioDemo {
  id: string;
  email: string;
}

export const authUsuarios: AuthUsuarioDemo[] = [
  { id: USR_HIGOR, email: "higor@mixresolve.com.br" },
  { id: USR_GABRIEL, email: "gabriel@mixresolve.com.br" },
  { id: USR_FLAVIO, email: "flavio@mixresolve.com.br" },
  { id: USR_DIEGO_HUGO, email: "diego.hugo@campo.mixresolve.internal" },
  { id: USR_JOAO, email: "joao@campo.mixresolve.internal" },
  { id: USR_DIEGO_MACEDO, email: "diego.macedo@campo.mixresolve.internal" },
  { id: USR_CARLOS, email: "carlos@campo.mixresolve.internal" },
  { id: USR_JACKSON, email: "jackson@campo.mixresolve.internal" },
  { id: USR_NIELSON, email: "nielson@campo.mixresolve.internal" },
];

export const usuarios: Usuario[] = [
  { id: USR_HIGOR, nome: "Higor Amaral", usuario_login: null, perfil: "gestao", papel_gestao: "admin", cargo: "Diretor Presidente e de Operações", ativo: true, created_at: new Date().toISOString() },
  { id: USR_GABRIEL, nome: "Gabriel Coutinho", usuario_login: null, perfil: "gestao", papel_gestao: "admin", cargo: "Diretor Administrativo", ativo: true, created_at: new Date().toISOString() },
  { id: USR_FLAVIO, nome: "Flávio", usuario_login: null, perfil: "gestao", papel_gestao: "operacional", cargo: "Gerente Geral de Operações", ativo: true, created_at: new Date().toISOString() },
  { id: USR_DIEGO_HUGO, nome: "Diego Hugo", usuario_login: "diego.hugo", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
  { id: USR_JOAO, nome: "João", usuario_login: "joao", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
  { id: USR_DIEGO_MACEDO, nome: "Diego Macedo", usuario_login: "diego.macedo", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
  { id: USR_CARLOS, nome: "Carlos", usuario_login: "carlos", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
  { id: USR_JACKSON, nome: "Jackson", usuario_login: "jackson", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
  { id: USR_NIELSON, nome: "Nielson", usuario_login: "nielson", perfil: "campo", papel_gestao: null, cargo: "Montagem e desmontagem", ativo: true, created_at: new Date().toISOString() },
];

// ---- clientes ----
const CLI_1 = id();
const CLI_2 = id();
const CLI_3 = id();

export const clientes: Cliente[] = [
  {
    id: CLI_1,
    numero: 1,
    nome: "Camila Rocha",
    empresa: "Camila Rocha Eventos",
    documento: "12.345.678/0001-90",
    contato_nome: "Camila Rocha",
    telefone: "(84) 99123-4567",
    email: "camila@rochaeventos.com.br",
    endereco: "Natal/RN",
    created_by: USR_GABRIEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: CLI_2,
    numero: 2,
    nome: "Marcos Diniz",
    empresa: "Grupo Diniz Corporativo",
    documento: "98.765.432/0001-10",
    contato_nome: "Marcos Diniz",
    telefone: "(84) 99876-5432",
    email: "marcos@grupodiniz.com.br",
    endereco: "Natal/RN",
    created_by: USR_GABRIEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: CLI_3,
    numero: 3,
    nome: "Fernanda Lima",
    empresa: null,
    documento: "123.456.789-00",
    contato_nome: "Fernanda Lima",
    telefone: "(84) 99555-1212",
    email: "fernanda.lima@gmail.com",
    endereco: "Mossoró/RN",
    created_by: USR_HIGOR,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ---- categorias e equipamentos ----
const CAT_LED = id();
const CAT_SOM = id();
const CAT_LUZ = id();
const CAT_ESTRUTURA = id();

export const categoriasEquipamento: CategoriaEquipamento[] = [
  { id: CAT_LED, nome: "Painéis de LED", ordem: 1 },
  { id: CAT_SOM, nome: "Sistema de Som", ordem: 2 },
  { id: CAT_LUZ, nome: "Iluminação Cênica", ordem: 3 },
  { id: CAT_ESTRUTURA, nome: "Praticáveis e Estruturas", ordem: 4 },
];

export const EQ_PAINEL_LED = id();
export const EQ_TOTEM = id();
export const EQ_CAIXA_LINE_ARRAY = id();
export const EQ_MESA_SOM = id();
export const EQ_MOVING_BEAM = id();
export const EQ_ATOMICA_RGB = id();
export const EQ_HAZE = id();
export const EQ_PRATICAVEL = id();

export const equipamentos: Equipamento[] = [
  { id: EQ_PAINEL_LED, categoria_id: CAT_LED, nome: "Painel de LED P3 (500x500mm)", quantidade_total: 96, quantidade_em_uso: 32, quantidade_manutencao: 4, preco_referencia: 85, estoque_minimo: 20, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_TOTEM, categoria_id: CAT_LED, nome: "Totem interativo de LED", quantidade_total: 4, quantidade_em_uso: 1, quantidade_manutencao: 0, preco_referencia: 650, estoque_minimo: 1, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_CAIXA_LINE_ARRAY, categoria_id: CAT_SOM, nome: "Caixa line array ativa", quantidade_total: 12, quantidade_em_uso: 4, quantidade_manutencao: 0, preco_referencia: 320, estoque_minimo: 4, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_MESA_SOM, categoria_id: CAT_SOM, nome: "Mesa de som digital 32 canais", quantidade_total: 3, quantidade_em_uso: 1, quantidade_manutencao: 0, preco_referencia: 450, estoque_minimo: 1, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_MOVING_BEAM, categoria_id: CAT_LUZ, nome: "Moving beam 230W", quantidade_total: 20, quantidade_em_uso: 8, quantidade_manutencao: 2, preco_referencia: 95, estoque_minimo: 6, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_ATOMICA_RGB, categoria_id: CAT_LUZ, nome: "Atômica RGB", quantidade_total: 16, quantidade_em_uso: 0, quantidade_manutencao: 0, preco_referencia: 40, estoque_minimo: 4, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_HAZE, categoria_id: CAT_LUZ, nome: "Máquina de haze", quantidade_total: 4, quantidade_em_uso: 1, quantidade_manutencao: 0, preco_referencia: 180, estoque_minimo: 1, ativo: true, created_at: new Date().toISOString() },
  { id: EQ_PRATICAVEL, categoria_id: CAT_ESTRUTURA, nome: "Praticável 2x1m (0,4m altura)", quantidade_total: 40, quantidade_em_uso: 12, quantidade_manutencao: 0, preco_referencia: 55, estoque_minimo: 10, ativo: true, created_at: new Date().toISOString() },
];

// ---- eventos ----
export const EVT_CORPORATIVO = id(); // evento confirmado, próximos dias, com equipe e checklists
export const EVT_FESTA = id(); // orçamento, sem checklist ainda
export const EVT_CONCLUIDO = id(); // concluído, com avaria já registrada

export const eventos: Evento[] = [
  {
    id: EVT_CORPORATIVO,
    nome: "Convenção Grupo Diniz 2026",
    cliente_id: CLI_2,
    data_inicio: dataOffset(3),
    data_fim: dataOffset(3),
    data_montagem: dataOffset(2),
    hora_montagem: "08:00",
    local: "Centro de Convenções de Natal",
    status: "confirmado",
    observacoes: "Evento corporativo de grande porte.",
    created_by: USR_GABRIEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: EVT_FESTA,
    nome: "Aniversário Fernanda Lima",
    cliente_id: CLI_3,
    data_inicio: dataOffset(10),
    data_fim: dataOffset(10),
    data_montagem: dataOffset(10),
    hora_montagem: "14:00",
    local: "Mossoró/RN",
    status: "orcamento",
    observacoes: null,
    created_by: USR_HIGOR,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: EVT_CONCLUIDO,
    nome: "Casamento Camila & Roberto",
    cliente_id: CLI_1,
    data_inicio: dataOffset(-15),
    data_fim: dataOffset(-15),
    data_montagem: dataOffset(-16),
    hora_montagem: "09:00",
    local: "Buffet Vila Bela, Natal/RN",
    status: "concluido",
    observacoes: null,
    created_by: USR_GABRIEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const eventoEquipamentos: EventoEquipamento[] = [
  { id: id(), evento_id: EVT_CORPORATIVO, equipamento_id: EQ_PAINEL_LED, quantidade_reservada: 24 },
  { id: id(), evento_id: EVT_CORPORATIVO, equipamento_id: EQ_CAIXA_LINE_ARRAY, quantidade_reservada: 4 },
  { id: id(), evento_id: EVT_CORPORATIVO, equipamento_id: EQ_MOVING_BEAM, quantidade_reservada: 8 },
  { id: id(), evento_id: EVT_CORPORATIVO, equipamento_id: EQ_MESA_SOM, quantidade_reservada: 1 },
  { id: id(), evento_id: EVT_FESTA, equipamento_id: EQ_ATOMICA_RGB, quantidade_reservada: 6 },
  { id: id(), evento_id: EVT_FESTA, equipamento_id: EQ_PRATICAVEL, quantidade_reservada: 8 },
  { id: id(), evento_id: EVT_CONCLUIDO, equipamento_id: EQ_HAZE, quantidade_reservada: 1 },
];

export const eventoEquipe: EventoEquipe[] = [
  { id: id(), evento_id: EVT_CORPORATIVO, usuario_id: USR_DIEGO_HUGO, etapa: "montagem", funcao: "Líder de montagem" },
  { id: id(), evento_id: EVT_CORPORATIVO, usuario_id: USR_JOAO, etapa: "montagem", funcao: null },
  { id: id(), evento_id: EVT_CORPORATIVO, usuario_id: USR_CARLOS, etapa: "operacao", funcao: "Operador de som" },
  { id: id(), evento_id: EVT_CORPORATIVO, usuario_id: USR_DIEGO_HUGO, etapa: "desmontagem", funcao: null },
  { id: id(), evento_id: EVT_CORPORATIVO, usuario_id: USR_JACKSON, etapa: "desmontagem", funcao: null },
  { id: id(), evento_id: EVT_FESTA, usuario_id: USR_NIELSON, etapa: "montagem", funcao: null },
  { id: id(), evento_id: EVT_CONCLUIDO, usuario_id: USR_DIEGO_MACEDO, etapa: "desmontagem", funcao: null },
];

// ---- checklists (evento confirmado já tem checklists gerados) ----
export const CHK_MONTAGEM_CORP = id();
export const CHK_DEVOLUCAO_CORP = id();
const CHK_DEVOLUCAO_CONCLUIDO = id();

export const checklists: Checklist[] = [
  { id: CHK_MONTAGEM_CORP, evento_id: EVT_CORPORATIVO, tipo: "montagem", status: "em_andamento", usuario_responsavel_id: USR_DIEGO_HUGO, iniciado_em: new Date().toISOString(), concluido_em: null },
  { id: CHK_DEVOLUCAO_CORP, evento_id: EVT_CORPORATIVO, tipo: "devolucao", status: "pendente", usuario_responsavel_id: null, iniciado_em: null, concluido_em: null },
  { id: CHK_DEVOLUCAO_CONCLUIDO, evento_id: EVT_CONCLUIDO, tipo: "devolucao", status: "concluido", usuario_responsavel_id: USR_DIEGO_MACEDO, iniciado_em: new Date().toISOString(), concluido_em: new Date().toISOString() },
];

const CI_1 = id();
const CI_5 = id();

export const checklistItens: ChecklistItem[] = [
  { id: CI_1, checklist_id: CHK_MONTAGEM_CORP, equipamento_id: EQ_PAINEL_LED, quantidade_esperada: 24, quantidade_avariada: 0, status: "confirmado", descricao_avaria: null, confirmado_por: USR_DIEGO_HUGO, confirmado_em: new Date().toISOString() },
  { id: id(), checklist_id: CHK_MONTAGEM_CORP, equipamento_id: EQ_CAIXA_LINE_ARRAY, quantidade_esperada: 4, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_MONTAGEM_CORP, equipamento_id: EQ_MOVING_BEAM, quantidade_esperada: 8, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_MONTAGEM_CORP, equipamento_id: EQ_MESA_SOM, quantidade_esperada: 1, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_DEVOLUCAO_CORP, equipamento_id: EQ_PAINEL_LED, quantidade_esperada: 24, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_DEVOLUCAO_CORP, equipamento_id: EQ_CAIXA_LINE_ARRAY, quantidade_esperada: 4, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_DEVOLUCAO_CORP, equipamento_id: EQ_MOVING_BEAM, quantidade_esperada: 8, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: id(), checklist_id: CHK_DEVOLUCAO_CORP, equipamento_id: EQ_MESA_SOM, quantidade_esperada: 1, quantidade_avariada: 0, status: "pendente", descricao_avaria: null, confirmado_por: null, confirmado_em: null },
  { id: CI_5, checklist_id: CHK_DEVOLUCAO_CONCLUIDO, equipamento_id: EQ_HAZE, quantidade_esperada: 1, quantidade_avariada: 1, status: "avariado", descricao_avaria: "Resistência de aquecimento queimada, precisa de reparo.", confirmado_por: USR_DIEGO_MACEDO, confirmado_em: new Date().toISOString() },
];

export const avarias: Avaria[] = [
  { id: id(), checklist_item_id: CI_5, equipamento_id: EQ_HAZE, evento_id: EVT_CONCLUIDO, quantidade: 1, descricao: "Resistência de aquecimento queimada, precisa de reparo.", registrado_por: USR_DIEGO_MACEDO, registrado_em: new Date().toISOString() },
];

// ---- propostas e contratos ----
const PROP_1 = id();
const PROP_2 = id();
const CONTRATO_1 = id();

export const propostas: Proposta[] = [
  {
    id: PROP_1,
    cliente_id: CLI_2,
    evento_id: EVT_CORPORATIVO,
    numero_cliente: 1,
    numero_controle: 1,
    submodo_precificacao: "item",
    config_precificacao: {},
    desconto_tipo: "nenhum",
    desconto_valor: 0,
    valor_manual: null,
    tem_permuta: false,
    condicoes_permuta: null,
    signatario: "gabriel",
    status: "aceita",
    validade: dataOffset(20),
    valor_total: 24 * 85 + 4 * 320 + 8 * 95 + 450,
    observacoes: "Inclui montagem e desmontagem.",
    local: null,
    data_evento_texto: null,
    montagem_texto: null,
    forma_pagamento: null,
    pix_beneficiario: null,
    pix_chave: null,
    cargo_signatario: null,
    texto_abertura: null,
    diferenciais: [],
    created_by: USR_GABRIEL,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: PROP_2,
    cliente_id: CLI_3,
    evento_id: EVT_FESTA,
    numero_cliente: 1,
    numero_controle: 2,
    submodo_precificacao: "item",
    config_precificacao: {},
    desconto_tipo: "nenhum",
    desconto_valor: 0,
    valor_manual: null,
    tem_permuta: true,
    condicoes_permuta: "Permuta parcial mediante divulgação da marca nas redes sociais do evento.",
    signatario: "higor",
    status: "enviada",
    validade: dataOffset(15),
    valor_total: 6 * 40 + 8 * 55,
    observacoes: null,
    local: null,
    data_evento_texto: null,
    montagem_texto: null,
    forma_pagamento: null,
    pix_beneficiario: null,
    pix_chave: null,
    cargo_signatario: null,
    texto_abertura: null,
    diferenciais: [],
    created_by: USR_HIGOR,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const propostaItens: PropostaItem[] = [
  { id: id(), proposta_id: PROP_1, equipamento_id: EQ_PAINEL_LED, descricao: "Painel de LED P3 (500x500mm)", quantidade: 24, tipo_valor: "fechado", diarias: null, valor_unitario: 85, valor_total: 24 * 85, origem: "catalogo", ordem: 1 },
  { id: id(), proposta_id: PROP_1, equipamento_id: EQ_CAIXA_LINE_ARRAY, descricao: "Caixa line array ativa", quantidade: 4, tipo_valor: "fechado", diarias: null, valor_unitario: 320, valor_total: 4 * 320, origem: "catalogo", ordem: 2 },
  { id: id(), proposta_id: PROP_1, equipamento_id: EQ_MOVING_BEAM, descricao: "Moving beam 230W", quantidade: 8, tipo_valor: "fechado", diarias: null, valor_unitario: 95, valor_total: 8 * 95, origem: "catalogo", ordem: 3 },
  { id: id(), proposta_id: PROP_1, equipamento_id: EQ_MESA_SOM, descricao: "Mesa de som digital 32 canais", quantidade: 1, tipo_valor: "fechado", diarias: null, valor_unitario: 450, valor_total: 450, origem: "catalogo", ordem: 4 },
  { id: id(), proposta_id: PROP_2, equipamento_id: EQ_ATOMICA_RGB, descricao: "Atômica RGB", quantidade: 6, tipo_valor: "fechado", diarias: null, valor_unitario: 40, valor_total: 6 * 40, origem: "catalogo", ordem: 1 },
  { id: id(), proposta_id: PROP_2, equipamento_id: EQ_PRATICAVEL, descricao: "Praticável 2x1m (0,4m altura)", quantidade: 8, tipo_valor: "fechado", diarias: null, valor_unitario: 55, valor_total: 8 * 55, origem: "catalogo", ordem: 2 },
];

export const propostaSetoresValor: PropostaSetorValor[] = [];

export const contratos: Contrato[] = [
  {
    id: CONTRATO_1,
    proposta_id: PROP_1,
    numero_contrato: `CT-${new Date().getFullYear()}-${PROP_1.slice(0, 8).toUpperCase()}`,
    cliente_id: CLI_2,
    evento_id: EVT_CORPORATIVO,
    contratante_nome: "Construtora Horizonte Ltda",
    contratante_documento: "12.345.678/0001-90",
    contratante_endereco: null,
    numero_cliente: 1,
    numero_controle: 1,
    objeto_montagem: null,
    objeto_data_evento: null,
    objeto_local: null,
    objeto_desmontagem: "No termino do evento",
    submodo_valor: "item",
    valor_manual: null,
    valor_total: 24 * 85 + 4 * 320 + 8 * 95 + 450,
    tipo_contratacao: "pagamento",
    parcelas: [],
    banco_nome: "Sicoob",
    banco_agencia: null,
    banco_conta: null,
    banco_chave_pix: null,
    banco_favorecido: "Mix Tenda e Iluminacao Ltda",
    permuta_descricao: null,
    permuta_valor: null,
    data_contrato: new Date().toISOString().slice(0, 10),
    clausula2_texto: null,
    clausula3_texto: null,
    clausula5_texto: null,
    clausula6_texto: null,
    clausula7_texto: null,
    clausula8_texto: null,
    signatario: "gabriel",
    status: "gerado",
    gerado_em: new Date().toISOString(),
    assinado_em: null,
  },
];

export const contratoItens: ContratoItem[] = [
  { id: id(), contrato_id: CONTRATO_1, equipamento_id: EQ_PAINEL_LED, descricao: "Painel de LED P3 (500x500mm)", quantidade: 24, tipo_valor: "fechado", diarias: null, valor_unitario: 85, valor_total: 24 * 85, origem: "catalogo", ordem: 1 },
  { id: id(), contrato_id: CONTRATO_1, equipamento_id: EQ_CAIXA_LINE_ARRAY, descricao: "Caixa line array ativa", quantidade: 4, tipo_valor: "fechado", diarias: null, valor_unitario: 320, valor_total: 4 * 320, origem: "catalogo", ordem: 2 },
  { id: id(), contrato_id: CONTRATO_1, equipamento_id: EQ_MOVING_BEAM, descricao: "Moving beam 230W", quantidade: 8, tipo_valor: "fechado", diarias: null, valor_unitario: 95, valor_total: 8 * 95, origem: "catalogo", ordem: 3 },
  { id: id(), contrato_id: CONTRATO_1, equipamento_id: EQ_MESA_SOM, descricao: "Mesa de som digital 32 canais", quantidade: 1, tipo_valor: "fechado", diarias: null, valor_unitario: 450, valor_total: 450, origem: "catalogo", ordem: 4 },
];

export const contratoSetoresValor: ContratoSetorValor[] = [];

// ---- financeiro (faturas e recibos, vazio por padrão no demo) ----
export const financeiro: Financeiro[] = [];
export const financeiroItens: FinanceiroItem[] = [];
