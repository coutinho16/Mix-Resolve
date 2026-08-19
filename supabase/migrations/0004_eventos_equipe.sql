create table eventos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cliente_id uuid references clientes(id),
  data_inicio date not null,
  data_fim date not null,
  data_montagem date,
  hora_montagem time,
  local text,
  status status_evento not null default 'orcamento',
  observacoes text,
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_datas check (data_fim >= data_inicio)
);
alter table eventos enable row level security;
create policy eventos_select_gestao on eventos for select using (is_gestao());
create policy eventos_select_campo on eventos for select using (
  is_campo() and exists (select 1 from evento_equipe ee where ee.evento_id = eventos.id and ee.usuario_id = auth.uid())
);
create policy eventos_write_gestao on eventos for all using (is_gestao()) with check (is_gestao());

create table evento_equipamentos (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  equipamento_id uuid not null references equipamentos(id),
  quantidade_reservada int not null check (quantidade_reservada > 0),
  unique (evento_id, equipamento_id)
);
alter table evento_equipamentos enable row level security;
create policy evento_equip_select_gestao on evento_equipamentos for select using (is_gestao());
create policy evento_equip_select_campo on evento_equipamentos for select using (
  is_campo() and exists (select 1 from evento_equipe ee where ee.evento_id = evento_equipamentos.evento_id and ee.usuario_id = auth.uid())
);
create policy evento_equip_write_gestao on evento_equipamentos for all using (is_gestao()) with check (is_gestao());

create table evento_equipe (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  usuario_id uuid not null references usuarios(id),
  etapa etapa_equipe not null,
  funcao text,
  unique (evento_id, usuario_id, etapa)
);
alter table evento_equipe enable row level security;
create policy evento_equipe_select_gestao on evento_equipe for select using (is_gestao());
create policy evento_equipe_select_self on evento_equipe for select using (usuario_id = auth.uid());
create policy evento_equipe_write_gestao on evento_equipe for all using (is_gestao()) with check (is_gestao());
