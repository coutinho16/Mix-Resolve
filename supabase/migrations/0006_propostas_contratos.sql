create table propostas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id),
  evento_id uuid references eventos(id),
  modo_precificacao modo_precificacao not null default 'catalogo',
  config_precificacao jsonb not null default '{}'::jsonb,
  tem_permuta boolean not null default false,
  condicoes_permuta text,
  signatario assinante not null,
  status status_proposta not null default 'rascunho',
  validade date,
  valor_total numeric(12,2) not null default 0,
  observacoes text,
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table propostas enable row level security;
create policy propostas_admin_only on propostas for all using (is_admin_gestao()) with check (is_admin_gestao());

create table proposta_itens (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  equipamento_id uuid references equipamentos(id),
  descricao text not null,
  quantidade int not null check (quantidade > 0),
  valor_unitario numeric(10,2) not null,
  valor_total numeric(10,2) not null,
  origem text not null check (origem in ('catalogo','manual')),
  ordem int not null default 0
);
alter table proposta_itens enable row level security;
create policy proposta_itens_admin_only on proposta_itens for all using (is_admin_gestao()) with check (is_admin_gestao());

create table contratos (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null unique references propostas(id),
  numero_contrato text unique,
  cliente_id uuid not null references clientes(id),
  evento_id uuid references eventos(id),
  conteudo jsonb not null,
  signatario assinante not null,
  status status_contrato not null default 'gerado',
  gerado_em timestamptz not null default now(),
  assinado_em timestamptz
);
alter table contratos enable row level security;
create policy contratos_admin_only on contratos for all using (is_admin_gestao()) with check (is_admin_gestao());
