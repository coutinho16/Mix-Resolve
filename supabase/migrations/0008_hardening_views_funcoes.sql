-- views devem respeitar RLS de quem consulta, não do criador
alter view v_reservas_diarias set (security_invoker = on);
alter view v_conflitos_agenda set (security_invoker = on);

-- funções internas (triggers/gatilhos de sistema) não devem ser chamáveis via RPC público
revoke all on function handle_new_user() from public, anon, authenticated;
revoke all on function fn_atualizar_estoque_checklist() from public, anon, authenticated;
revoke all on function fn_gerar_checklists(uuid) from public, anon, authenticated;

-- funções auxiliares de autorização: uso interno das policies, não precisam ser chamadas por RPC
revoke all on function is_gestao() from public, anon, authenticated;
revoke all on function is_admin_gestao() from public, anon, authenticated;
revoke all on function is_campo() from public, anon, authenticated;

alter function fn_disponibilidade(uuid, date) set search_path = public;
