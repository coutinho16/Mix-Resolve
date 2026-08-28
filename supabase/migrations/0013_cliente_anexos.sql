-- Pagina de detalhe do cliente: registro dos arquivos anexados (armazenados no
-- Supabase Storage, bucket privado "cliente-anexos") vinculados a cada cliente.
-- Propostas, contratos e financeiro ja referenciam clientes.id diretamente,
-- entao a listagem deles na pagina do cliente nao precisa de tabela nova.

create table cliente_anexos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome_arquivo text not null,
  caminho_storage text not null unique,
  tipo_conteudo text,
  tamanho_bytes bigint,
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now()
);
alter table cliente_anexos enable row level security;
create policy cliente_anexos_admin_only on cliente_anexos for all using (is_admin_gestao()) with check (is_admin_gestao());

insert into storage.buckets (id, name, public)
values ('cliente-anexos', 'cliente-anexos', false)
on conflict (id) do nothing;

create policy cliente_anexos_storage_rw on storage.objects for all
  using (bucket_id = 'cliente-anexos' and is_admin_gestao())
  with check (bucket_id = 'cliente-anexos' and is_admin_gestao());
