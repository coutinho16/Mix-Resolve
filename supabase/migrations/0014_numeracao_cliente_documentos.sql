-- Numeracao permanente de cliente (001, 002...) que nunca e reaproveitada,
-- mesmo que o cliente seja excluido: usa uma sequence, nao contagem de linhas.
create sequence clientes_numero_seq;

alter table clientes add column numero int;

update clientes set numero = sub.rn
from (
  select id, row_number() over (order by created_at) as rn from clientes
) sub
where clientes.id = sub.id;

alter table clientes alter column numero set not null;
alter table clientes add constraint clientes_numero_unique unique (numero);

select setval('clientes_numero_seq', coalesce((select max(numero) from clientes), 0) + 1, false);
alter table clientes alter column numero set default nextval('clientes_numero_seq');

-- financeiro (fatura/recibo) precisa de um contador por cliente e por tipo,
-- igual ao numero_cliente que propostas/contratos ja tem.
alter table financeiro add column numero_cliente int;
