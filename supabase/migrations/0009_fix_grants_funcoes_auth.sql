-- is_gestao/is_campo/is_admin_gestao são chamadas dentro das próprias RLS policies:
-- revogar EXECUTE de authenticated (feito na 0008) quebra toda consulta às tabelas que as usam.
-- restaura para authenticated, mantendo o bloqueio apenas para anon.
grant execute on function is_gestao() to authenticated;
grant execute on function is_admin_gestao() to authenticated;
grant execute on function is_campo() to authenticated;
