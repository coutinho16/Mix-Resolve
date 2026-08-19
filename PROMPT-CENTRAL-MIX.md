# Central Mix — Sistema de Gestão Mix Resolve

## Contexto
Sistema operacional interno para a Mix Resolve, locadora de equipamentos para eventos (som, luz, LED, estruturas) em Natal/RN. Dois perfis de uso bem distintos: **Gestão** (diretoria/gerência, uso em desktop) e **Campo** (equipe de montagem/desmontagem, uso no celular).

## Identidade visual (regra fixa)
- Cores: laranja `#FE5C1E` (primária/destaque), preto `#1A1A1A`, branco `#FAFAF9`/`#FFFFFF`. Neutros de apoio: `#8A8680`, `#E5E3E0`, `#F2F1EE`.
- Tipografia: **Poppins** (títulos, weights 500/600/700) e **Inter** (texto, weights 400–700).
- Logo: "mix." em laranja minúsculo, "RESOLVE" em preto abaixo, letter-spacing.
- Estética limpa, funcional, sem gradientes ou elementos decorativos — ferramenta de trabalho operacional.
- Cores de estado: verde `#2E9E5B` (disponível/ok), laranja (em uso/alerta), cinza `#8A8680` (manutenção/neutro), vermelho `#D64545` (conflito/avaria).

## Telas mapeadas (mockups de alta fidelidade prontos)
Cada tela de Gestão tem toggle Desktop/Mobile no canto superior direito para conferência responsiva.

1. **Login.dc.html** — seleção de perfil (Gestão / Campo), logo centralizada.
2. **DashboardGestor.dc.html** — home do gestor: próximos eventos da semana, alertas de estoque baixo/conflito de agenda, atalhos rápidos.
3. **Calendario.dc.html** — grade mensal, chip laranja sólido = realização, chip cinza tracejado = montagem, navegação de mês, painel de detalhes do evento ao lado.
4. **CadastroEvento.dc.html** — formulário: nome, datas (com toggle multi-dia), montagem, local, checklist de equipe escalada, lista de equipamentos com stepper de quantidade.
5. **Estoque.dc.html** — catálogo por categoria (LED, praticáveis, som, iluminação cênica, moving beam, haze, atômicas RGB, totens) com total/disponível/em uso/manutenção.
6. **Disponibilidade.dc.html** — grade equipamento × data, destacando reservas e conflitos.
7. **MinhasTarefas.dc.html** (mobile) — home do Campo: evento do dia, local, horário, CTA para o checklist da etapa.
8. **ChecklistMontagem.dc.html** (mobile) — lista de equipamentos com checkbox grande, progresso, confirmação de carregamento completo.
9. **ChecklistDevolucao.dc.html** (mobile) — conferência de devolução, marcação "avariado" com campo de descrição do problema.

## O que falta construir (funcional)
- **Autenticação real** e persistência de sessão/perfil.
- **Dados dinâmicos**: eventos, estoque, equipe e disponibilidade hoje são mockados/estáticos — precisam vir de banco de dados real.
- **CRUD completo**: criar/editar/excluir eventos, itens de estoque, membros de equipe.
- **Cálculo automático de disponibilidade** e detecção de conflitos de reserva cruzando equipamento × data × evento.
- **Baixa/retorno de estoque** automática ao confirmar checklist de montagem/devolução (mudar status disponível → em uso → manutenção).
- **Notificações/alertas** reais de estoque baixo e conflito de agenda (hoje são estáticos no dashboard).
- **Histórico de avarias** por item, vinculado ao checklist de devolução.
- **Permissões por perfil** (Gestão vs Campo) e por usuário dentro da gestão.
- Navegação atual é só por links `<a>` entre arquivos HTML — precisa de roteamento de app real.

## Arquivos do protótipo
Todos em `.dc.html`, inline-styled, sem dependências externas além de Google Fonts (Poppins/Inter) e do frame `ios-frame.jsx` para as visualizações mobile.
