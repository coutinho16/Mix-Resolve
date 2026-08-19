create table usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  usuario_login text unique,
  perfil perfil_usuario not null,
  papel_gestao papel_gestao,
  cargo text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint chk_papel_gestao check (
    (perfil = 'gestao' and papel_gestao is not null) or
    (perfil = 'campo' and papel_gestao is null)
  )
);

-- funções security definer: evitam recursão de RLS e centralizam a regra de autorização
create or replace function is_gestao() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from usuarios where id = auth.uid() and perfil = 'gestao' and ativo) $$;

create or replace function is_admin_gestao() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from usuarios where id = auth.uid() and perfil = 'gestao' and papel_gestao = 'admin' and ativo) $$;

create or replace function is_campo() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from usuarios where id = auth.uid() and perfil = 'campo' and ativo) $$;

alter table usuarios enable row level security;

create policy usuarios_select_gestao on usuarios for select using (is_gestao());
create policy usuarios_select_self   on usuarios for select using (id = auth.uid());
create policy usuarios_update_admin  on usuarios for update using (is_admin_gestao());
-- sem policy de insert/delete: só o service role (rota admin) cria/apaga usuários

-- popula usuarios a partir do user_metadata sempre que a rota admin cria um auth.users
create or replace function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into usuarios (id, nome, usuario_login, perfil, papel_gestao, cargo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    new.raw_user_meta_data->>'usuario_login',
    coalesce((new.raw_user_meta_data->>'perfil')::perfil_usuario, 'campo'),
    nullif(new.raw_user_meta_data->>'papel_gestao','')::papel_gestao,
    new.raw_user_meta_data->>'cargo'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- resolve usuario_login -> email sintético para o login de Campo, sem expor outros campos
create or replace function fn_resolver_email_login(p_usuario_login text) returns text
  language sql stable security definer set search_path = public as $$
  select email from auth.users u
  join usuarios us on us.id = u.id
  where us.usuario_login = p_usuario_login and us.ativo
  limit 1;
$$;

revoke all on function fn_resolver_email_login(text) from public;
grant execute on function fn_resolver_email_login(text) to anon, authenticated;
