-- Otimizacao de RLS (apontada pelo advisor de performance do Supabase):
-- 1) auth.uid() usado direto numa policy e reavaliado linha a linha; trocar
--    por (select auth.uid()) faz o Postgres avaliar uma unica vez por consulta.
-- 2) Varias tabelas tinham uma policy ampla "for all" (is_gestao()) junto com
--    uma policy separada e mais especifica cobrindo a mesma acao (ex.: select
--    de campo, ou delete restrito a admin) — o Postgres precisa avaliar todas
--    as policies permissivas sobrepostas em toda consulta. Aqui elas sao
--    fundidas ou reescopadas para eliminar a sobreposicao, mantendo
--    exatamente as mesmas permissoes efetivas de antes.

-- ---------------------------- usuarios ----------------------------
drop policy usuarios_select_gestao on usuarios;
drop policy usuarios_select_self on usuarios;
create policy usuarios_select on usuarios for select
  using (is_gestao() or id = (select auth.uid()));

-- ---------------------------- clientes ----------------------------
drop policy clientes_rw_gestao on clientes;
create policy clientes_select_gestao on clientes for select using (is_gestao());
create policy clientes_insert_gestao on clientes for insert with check (is_gestao());
create policy clientes_update_gestao on clientes for update using (is_gestao()) with check (is_gestao());
-- clientes_delete_admin permanece como a unica autoridade de delete (admin)

-- ---------------------- categorias_equipamento ----------------------
drop policy categorias_write_gestao on categorias_equipamento;
create policy categorias_insert_gestao on categorias_equipamento for insert with check (is_gestao());
create policy categorias_update_gestao on categorias_equipamento for update using (is_gestao()) with check (is_gestao());
create policy categorias_delete_gestao on categorias_equipamento for delete using (is_gestao());
-- categorias_select permanece como a unica policy de select

-- ---------------------------- eventos ----------------------------
drop policy eventos_select_gestao on eventos;
drop policy eventos_select_campo on eventos;
drop policy eventos_write_gestao on eventos;
create policy eventos_select on eventos for select
  using (is_gestao() or (is_campo() and exists (
    select 1 from evento_equipe ee
    where ee.evento_id = eventos.id and ee.usuario_id = (select auth.uid())
  )));
create policy eventos_insert_gestao on eventos for insert with check (is_gestao());
create policy eventos_update_gestao on eventos for update using (is_gestao()) with check (is_gestao());
create policy eventos_delete_gestao on eventos for delete using (is_gestao());

-- ------------------------ evento_equipamentos ------------------------
drop policy evento_equip_select_gestao on evento_equipamentos;
drop policy evento_equip_select_campo on evento_equipamentos;
drop policy evento_equip_write_gestao on evento_equipamentos;
create policy evento_equip_select on evento_equipamentos for select
  using (is_gestao() or (is_campo() and exists (
    select 1 from evento_equipe ee
    where ee.evento_id = evento_equipamentos.evento_id and ee.usuario_id = (select auth.uid())
  )));
create policy evento_equip_insert_gestao on evento_equipamentos for insert with check (is_gestao());
create policy evento_equip_update_gestao on evento_equipamentos for update using (is_gestao()) with check (is_gestao());
create policy evento_equip_delete_gestao on evento_equipamentos for delete using (is_gestao());

-- --------------------------- evento_equipe ---------------------------
drop policy evento_equipe_select_gestao on evento_equipe;
drop policy evento_equipe_select_self on evento_equipe;
drop policy evento_equipe_write_gestao on evento_equipe;
create policy evento_equipe_select on evento_equipe for select
  using (is_gestao() or usuario_id = (select auth.uid()));
create policy evento_equipe_insert_gestao on evento_equipe for insert with check (is_gestao());
create policy evento_equipe_update_gestao on evento_equipe for update using (is_gestao()) with check (is_gestao());
create policy evento_equipe_delete_gestao on evento_equipe for delete using (is_gestao());

-- ---------------------------- checklists ----------------------------
drop policy checklists_select_gestao on checklists;
drop policy checklists_write_gestao on checklists;
drop policy checklists_rw_campo on checklists;
create policy checklists_rw on checklists for all
  using (is_gestao() or (is_campo() and exists (
    select 1 from evento_equipe ee
    where ee.evento_id = checklists.evento_id and ee.usuario_id = (select auth.uid())
  )))
  with check (is_gestao() or (is_campo() and exists (
    select 1 from evento_equipe ee
    where ee.evento_id = checklists.evento_id and ee.usuario_id = (select auth.uid())
  )));

-- -------------------------- checklist_itens --------------------------
drop policy checklist_itens_select_gestao on checklist_itens;
drop policy checklist_itens_write_gestao on checklist_itens;
drop policy checklist_itens_rw_campo on checklist_itens;
create policy checklist_itens_rw on checklist_itens for all
  using (is_gestao() or (is_campo() and exists (
    select 1 from checklists c
    join evento_equipe ee on ee.evento_id = c.evento_id
    where c.id = checklist_itens.checklist_id and ee.usuario_id = (select auth.uid())
  )))
  with check (is_gestao() or (is_campo() and exists (
    select 1 from checklists c
    join evento_equipe ee on ee.evento_id = c.evento_id
    where c.id = checklist_itens.checklist_id and ee.usuario_id = (select auth.uid())
  )));
