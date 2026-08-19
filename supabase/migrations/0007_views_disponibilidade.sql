create view v_reservas_diarias as
select ee.equipamento_id, gs.dia::date as data, ev.id as evento_id, ev.nome as evento_nome,
       ee.quantidade_reservada
from evento_equipamentos ee
join eventos ev on ev.id = ee.evento_id
cross join lateral generate_series(coalesce(ev.data_montagem, ev.data_inicio), ev.data_fim, interval '1 day') as gs(dia)
where ev.status <> 'cancelado';

create or replace function fn_disponibilidade(p_equipamento_id uuid, p_data date) returns int
  language sql stable as $$
  select e.quantidade_total - e.quantidade_manutencao - coalesce((
    select sum(r.quantidade_reservada) from v_reservas_diarias r
    where r.equipamento_id = p_equipamento_id and r.data = p_data
  ), 0)
  from equipamentos e where e.id = p_equipamento_id;
$$;

create view v_conflitos_agenda as
select r.equipamento_id, r.data, sum(r.quantidade_reservada) as total_reservado,
       e.quantidade_total - e.quantidade_manutencao as capacidade
from v_reservas_diarias r
join equipamentos e on e.id = r.equipamento_id
group by r.equipamento_id, r.data, e.quantidade_total, e.quantidade_manutencao
having sum(r.quantidade_reservada) > (e.quantidade_total - e.quantidade_manutencao);
