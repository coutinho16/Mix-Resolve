create table checklists (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  tipo tipo_checklist not null,
  status status_checklist not null default 'pendente',
  usuario_responsavel_id uuid references usuarios(id),
  iniciado_em timestamptz,
  concluido_em timestamptz,
  unique (evento_id, tipo)
);
alter table checklists enable row level security;
create policy checklists_select_gestao on checklists for select using (is_gestao());
create policy checklists_rw_campo on checklists for all using (
  is_campo() and exists (select 1 from evento_equipe ee where ee.evento_id = checklists.evento_id and ee.usuario_id = auth.uid())
) with check (
  is_campo() and exists (select 1 from evento_equipe ee where ee.evento_id = checklists.evento_id and ee.usuario_id = auth.uid())
);
create policy checklists_write_gestao on checklists for all using (is_gestao()) with check (is_gestao());

create table checklist_itens (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  equipamento_id uuid not null references equipamentos(id),
  quantidade_esperada int not null,
  quantidade_avariada int not null default 0,
  status status_item_checklist not null default 'pendente',
  descricao_avaria text,
  confirmado_por uuid references usuarios(id),
  confirmado_em timestamptz
);
alter table checklist_itens enable row level security;
create policy checklist_itens_select_gestao on checklist_itens for select using (is_gestao());
create policy checklist_itens_rw_campo on checklist_itens for all using (
  is_campo() and exists (
    select 1 from checklists c join evento_equipe ee on ee.evento_id = c.evento_id
    where c.id = checklist_itens.checklist_id and ee.usuario_id = auth.uid()
  )
) with check (
  is_campo() and exists (
    select 1 from checklists c join evento_equipe ee on ee.evento_id = c.evento_id
    where c.id = checklist_itens.checklist_id and ee.usuario_id = auth.uid()
  )
);
create policy checklist_itens_write_gestao on checklist_itens for all using (is_gestao()) with check (is_gestao());

create table avarias (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id uuid not null references checklist_itens(id),
  equipamento_id uuid not null references equipamentos(id),
  evento_id uuid not null references eventos(id),
  quantidade int not null check (quantidade > 0),
  descricao text,
  registrado_por uuid references usuarios(id),
  registrado_em timestamptz not null default now()
);
alter table avarias enable row level security;
create policy avarias_select_gestao on avarias for select using (is_gestao());
-- sem policy de insert: só o trigger abaixo (security definer) grava aqui

-- gera checklists + snapshot de itens quando a Gestão confirma o evento
create or replace function fn_gerar_checklists(p_evento_id uuid) returns void
  language plpgsql security definer set search_path = public as $$
begin
  insert into checklists (evento_id, tipo) values (p_evento_id, 'montagem')
    on conflict (evento_id, tipo) do nothing;
  insert into checklists (evento_id, tipo) values (p_evento_id, 'devolucao')
    on conflict (evento_id, tipo) do nothing;

  insert into checklist_itens (checklist_id, equipamento_id, quantidade_esperada)
  select c.id, ee.equipamento_id, ee.quantidade_reservada
  from checklists c
  join evento_equipamentos ee on ee.evento_id = c.evento_id
  where c.evento_id = p_evento_id
    and not exists (
      select 1 from checklist_itens ci where ci.checklist_id = c.id and ci.equipamento_id = ee.equipamento_id
    );
end; $$;

-- muda o status do equipamento no momento em que o item do checklist é confirmado
create or replace function fn_atualizar_estoque_checklist() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  v_evento_id uuid;
  v_tipo tipo_checklist;
begin
  select c.evento_id, c.tipo into v_evento_id, v_tipo from checklists c where c.id = new.checklist_id;

  -- montagem confirmada: item sai do estoque disponível e entra em uso
  if v_tipo = 'montagem' and new.status = 'confirmado' and (old.status is distinct from 'confirmado') then
    update equipamentos set quantidade_em_uso = quantidade_em_uso + new.quantidade_esperada
      where id = new.equipamento_id;
  end if;

  -- devolução confirmada sem avaria: item sai de "em uso" e volta a disponível
  if v_tipo = 'devolucao' and new.status = 'confirmado' and (old.status is distinct from 'confirmado') then
    update equipamentos set quantidade_em_uso = greatest(quantidade_em_uso - new.quantidade_esperada, 0)
      where id = new.equipamento_id;
  end if;

  -- devolução com avaria: item sai de "em uso"; a parte avariada vai para manutenção, o restante volta a disponível
  if v_tipo = 'devolucao' and new.status = 'avariado' and (old.status is distinct from 'avariado') and new.quantidade_avariada > 0 then
    insert into avarias (checklist_item_id, equipamento_id, evento_id, quantidade, descricao, registrado_por)
    values (new.id, new.equipamento_id, v_evento_id, new.quantidade_avariada, new.descricao_avaria, new.confirmado_por);

    update equipamentos set
      quantidade_em_uso = greatest(quantidade_em_uso - new.quantidade_esperada, 0),
      quantidade_manutencao = quantidade_manutencao + new.quantidade_avariada
      where id = new.equipamento_id;
  end if;

  return new;
end; $$;

create trigger trg_checklist_item_estoque after update on checklist_itens
  for each row execute function fn_atualizar_estoque_checklist();
