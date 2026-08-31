-- Otimizacao de desempenho: colunas de chave estrangeira nao ganham indice
-- automatico no Postgres (soh a chave primaria/unique ganha). Como praticamente
-- toda consulta do app filtra por essas colunas (.eq("cliente_id", ...),
-- .eq("proposta_id", ...), etc.), a falta de indice forcava varredura completa
-- da tabela a cada consulta. Cobre todas as FKs do schema.

create index if not exists idx_avarias_checklist_item_id on avarias (checklist_item_id);
create index if not exists idx_avarias_equipamento_id on avarias (equipamento_id);
create index if not exists idx_avarias_evento_id on avarias (evento_id);
create index if not exists idx_avarias_registrado_por on avarias (registrado_por);

create index if not exists idx_checklist_itens_checklist_id on checklist_itens (checklist_id);
create index if not exists idx_checklist_itens_confirmado_por on checklist_itens (confirmado_por);
create index if not exists idx_checklist_itens_equipamento_id on checklist_itens (equipamento_id);

create index if not exists idx_checklists_evento_id on checklists (evento_id);
create index if not exists idx_checklists_usuario_responsavel_id on checklists (usuario_responsavel_id);

create index if not exists idx_cliente_anexos_cliente_id on cliente_anexos (cliente_id);
create index if not exists idx_cliente_anexos_created_by on cliente_anexos (created_by);

create index if not exists idx_clientes_created_by on clientes (created_by);

create index if not exists idx_contrato_itens_contrato_id on contrato_itens (contrato_id);
create index if not exists idx_contrato_itens_equipamento_id on contrato_itens (equipamento_id);

create index if not exists idx_contrato_setores_valor_contrato_id on contrato_setores_valor (contrato_id);

create index if not exists idx_contratos_cliente_id on contratos (cliente_id);
create index if not exists idx_contratos_evento_id on contratos (evento_id);

create index if not exists idx_equipamentos_categoria_id on equipamentos (categoria_id);

create index if not exists idx_evento_equipamentos_equipamento_id on evento_equipamentos (equipamento_id);
create index if not exists idx_evento_equipamentos_evento_id on evento_equipamentos (evento_id);

create index if not exists idx_evento_equipe_evento_id on evento_equipe (evento_id);
create index if not exists idx_evento_equipe_usuario_id on evento_equipe (usuario_id);

create index if not exists idx_eventos_cliente_id on eventos (cliente_id);
create index if not exists idx_eventos_created_by on eventos (created_by);

create index if not exists idx_financeiro_cliente_id on financeiro (cliente_id);
create index if not exists idx_financeiro_contrato_id on financeiro (contrato_id);
create index if not exists idx_financeiro_created_by on financeiro (created_by);
create index if not exists idx_financeiro_proposta_id on financeiro (proposta_id);

create index if not exists idx_financeiro_itens_financeiro_id on financeiro_itens (financeiro_id);

create index if not exists idx_proposta_itens_equipamento_id on proposta_itens (equipamento_id);
create index if not exists idx_proposta_itens_proposta_id on proposta_itens (proposta_id);

create index if not exists idx_proposta_setores_valor_proposta_id on proposta_setores_valor (proposta_id);

create index if not exists idx_propostas_cliente_id on propostas (cliente_id);
create index if not exists idx_propostas_created_by on propostas (created_by);
create index if not exists idx_propostas_evento_id on propostas (evento_id);
