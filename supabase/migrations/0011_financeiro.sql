-- Aba Financeiro: faturas e recibos internos (documento em PDF, sem integracao
-- com nota fiscal eletronica). Mesmo registro para os dois tipos, com campo
-- "tipo". Todos os campos de dados sao opcionais: nenhum bloqueia a criacao,
-- exceto o tipo do documento (fatura ou recibo), que define o layout do PDF.
-- Acesso restrito ao mesmo grupo de propostas/contratos (is_admin_gestao).

create type tipo_financeiro as enum ('fatura', 'recibo');
create type status_financeiro as enum ('rascunho', 'emitido', 'pago', 'cancelado');

create sequence financeiro_numero_controle_seq;

create table financeiro (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_financeiro not null,
  numero text,
  numero_controle int not null default nextval('financeiro_numero_controle_seq'),
  data_emissao date not null default current_date,
  cliente_id uuid references clientes(id),
  cliente_nome text,
  cliente_documento text,
  proposta_id uuid references propostas(id),
  contrato_id uuid references contratos(id),
  descricao text,
  valor_total numeric(12,2) not null default 0,
  forma_pagamento text,
  vencimento date,
  observacoes text,
  signatario assinante,
  status status_financeiro not null default 'rascunho',
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table financeiro add constraint financeiro_numero_controle_unique unique (numero_controle);
alter table financeiro enable row level security;
create policy financeiro_admin_only on financeiro for all using (is_admin_gestao()) with check (is_admin_gestao());

create table financeiro_itens (
  id uuid primary key default gen_random_uuid(),
  financeiro_id uuid not null references financeiro(id) on delete cascade,
  descricao text not null default '',
  quantidade int not null default 1,
  valor_unitario numeric(10,2) not null default 0,
  valor_total numeric(10,2) not null default 0,
  ordem int not null default 0
);
alter table financeiro_itens enable row level security;
create policy financeiro_itens_admin_only on financeiro_itens for all using (is_admin_gestao()) with check (is_admin_gestao());
