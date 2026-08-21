-- Campos adicionais para replicar fielmente os modelos reais de Nota de Fatura
-- de Locacao (NFL) e Recibo da Mix: dados do tomador (endereco, contato,
-- inscricoes) e campos especificos da fatura (numero de substituicao, data de
-- entrega). Nenhum e obrigatorio, seguindo o padrao ja usado no restante do
-- modulo financeiro (nada bloqueia a criacao do registro).

alter table financeiro
  add column cliente_endereco text,
  add column cliente_telefone text,
  add column cliente_email text,
  add column cliente_inscricao_municipal text,
  add column cliente_inscricao_estadual text,
  add column cliente_responsavel text,
  add column data_entrega text,
  add column numero_substituicao text;
