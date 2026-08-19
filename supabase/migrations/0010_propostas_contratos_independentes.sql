-- Torna contratos independentes de propostas, adiciona submodos de precificacao
-- (item / setor / unico), desconto, parcelas, dados bancarios, clausulas editaveis
-- e numeracao dupla (por cliente + controle interno global) para propostas e contratos.

create type tipo_valor_item as enum ('diaria', 'fechado');
create type submodo_precificacao as enum ('item', 'setor', 'unico');
create type desconto_tipo as enum ('nenhum', 'percentual', 'valor');
create type tipo_contratacao as enum ('pagamento', 'permuta');

create sequence propostas_numero_controle_seq;
create sequence contratos_numero_controle_seq;

-- ===================== propostas =====================

alter table propostas drop column modo_precificacao;
drop type modo_precificacao;

alter table propostas
  add column numero_cliente int,
  add column numero_controle int not null default nextval('propostas_numero_controle_seq'),
  add column submodo_precificacao submodo_precificacao not null default 'item',
  add column desconto_tipo desconto_tipo not null default 'nenhum',
  add column desconto_valor numeric(12,2) not null default 0,
  add column valor_manual numeric(12,2),
  add column local text,
  add column data_evento_texto text,
  add column montagem_texto text,
  add column forma_pagamento text,
  add column pix_beneficiario text,
  add column pix_chave text,
  add column cargo_signatario text,
  add column texto_abertura text,
  add column diferenciais jsonb not null default '[]'::jsonb;

alter table propostas add constraint propostas_numero_controle_unique unique (numero_controle);

alter table proposta_itens
  add column tipo_valor tipo_valor_item not null default 'fechado',
  add column diarias int;

create table proposta_setores_valor (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  setor text not null,
  valor numeric(12,2) not null default 0,
  unique (proposta_id, setor)
);
alter table proposta_setores_valor enable row level security;
create policy proposta_setores_valor_admin_only on proposta_setores_valor for all using (is_admin_gestao()) with check (is_admin_gestao());

-- ===================== contratos =====================

alter table contratos drop constraint contratos_proposta_id_key;
alter table contratos alter column proposta_id drop not null;
alter table contratos alter column cliente_id drop not null;
alter table contratos drop column conteudo;

alter table contratos
  add column contratante_nome text not null default '',
  add column contratante_documento text,
  add column contratante_endereco text,
  add column numero_cliente int,
  add column numero_controle int not null default nextval('contratos_numero_controle_seq'),
  add column objeto_montagem date,
  add column objeto_data_evento date,
  add column objeto_local text,
  add column objeto_desmontagem text not null default 'No termino do evento',
  add column submodo_valor submodo_precificacao not null default 'item',
  add column valor_manual numeric(12,2),
  add column valor_total numeric(12,2) not null default 0,
  add column tipo_contratacao tipo_contratacao not null default 'pagamento',
  add column parcelas jsonb not null default '[]'::jsonb,
  add column banco_nome text default 'Sicoob',
  add column banco_agencia text,
  add column banco_conta text,
  add column banco_chave_pix text,
  add column banco_favorecido text default 'Mix Tenda e Iluminacao Ltda',
  add column permuta_descricao text,
  add column permuta_valor numeric(12,2),
  add column data_contrato date not null default current_date,
  add column clausula2_texto text,
  add column clausula3_texto text,
  add column clausula5_texto text,
  add column clausula6_texto text,
  add column clausula7_texto text,
  add column clausula8_texto text;

alter table contratos add constraint contratos_numero_controle_unique unique (numero_controle);
alter table contratos add constraint contratos_proposta_id_unique unique (proposta_id);

create table contrato_itens (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references contratos(id) on delete cascade,
  equipamento_id uuid references equipamentos(id),
  descricao text not null,
  quantidade int not null check (quantidade > 0),
  tipo_valor tipo_valor_item not null default 'fechado',
  diarias int,
  valor_unitario numeric(10,2) not null default 0,
  valor_total numeric(10,2) not null default 0,
  origem text not null check (origem in ('catalogo','manual')),
  ordem int not null default 0
);
alter table contrato_itens enable row level security;
create policy contrato_itens_admin_only on contrato_itens for all using (is_admin_gestao()) with check (is_admin_gestao());

create table contrato_setores_valor (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references contratos(id) on delete cascade,
  setor text not null,
  valor numeric(12,2) not null default 0,
  unique (contrato_id, setor)
);
alter table contrato_setores_valor enable row level security;
create policy contrato_setores_valor_admin_only on contrato_setores_valor for all using (is_admin_gestao()) with check (is_admin_gestao());
