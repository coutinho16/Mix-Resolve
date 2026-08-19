create extension if not exists pgcrypto;

create type perfil_usuario as enum ('gestao','campo');
create type papel_gestao as enum ('admin','operacional');
create type status_evento as enum ('orcamento','confirmado','em_andamento','concluido','cancelado');
create type etapa_equipe as enum ('montagem','operacao','desmontagem');
create type tipo_checklist as enum ('montagem','devolucao');
create type status_checklist as enum ('pendente','em_andamento','concluido');
create type status_item_checklist as enum ('pendente','confirmado','avariado');
create type modo_precificacao as enum ('catalogo','manual','misto');
create type status_proposta as enum ('rascunho','enviada','aceita','recusada','expirada');
create type assinante as enum ('gabriel','higor');
create type status_contrato as enum ('gerado','assinado','cancelado');
