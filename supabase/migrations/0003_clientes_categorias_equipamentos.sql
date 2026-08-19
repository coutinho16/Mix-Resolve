create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text,
  documento text,
  contato_nome text,
  telefone text,
  email text,
  endereco text,
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table clientes enable row level security;
create policy clientes_rw_gestao on clientes for all using (is_gestao()) with check (is_gestao());
create policy clientes_delete_admin on clientes for delete using (is_admin_gestao());

create table categorias_equipamento (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ordem int not null default 0
);
alter table categorias_equipamento enable row level security;
create policy categorias_select on categorias_equipamento for select using (is_gestao() or is_campo());
create policy categorias_write_gestao on categorias_equipamento for all using (is_gestao()) with check (is_gestao());

create table equipamentos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias_equipamento(id),
  nome text not null,
  quantidade_total int not null check (quantidade_total >= 0),
  quantidade_em_uso int not null default 0 check (quantidade_em_uso >= 0),
  quantidade_manutencao int not null default 0 check (quantidade_manutencao >= 0),
  preco_referencia numeric(10,2),
  estoque_minimo int,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint chk_estoque_nao_excede check (quantidade_em_uso + quantidade_manutencao <= quantidade_total)
);
alter table equipamentos enable row level security;
create policy equipamentos_select on equipamentos for select using (is_gestao() or is_campo());
create policy equipamentos_write_gestao on equipamentos for insert with check (is_gestao());
create policy equipamentos_update_gestao on equipamentos for update using (is_gestao());
create policy equipamentos_delete_admin on equipamentos for delete using (is_admin_gestao());
