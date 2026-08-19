# Configuração do projeto Central Mix

Passo a passo para colocar o projeto para rodar do zero.

## 1. Instalar dependências

```
npm install
```

## 2. Criar o projeto no Supabase

1. Acesse https://supabase.com, crie uma conta (se ainda não tiver) e clique em "New project".
2. Escolha um nome (ex: `central-mix`), uma senha de banco forte e a região mais próxima (ex: South America / São Paulo, se disponível; senão, a mais próxima).
3. Aguarde o projeto ser provisionado (leva alguns minutos).

## 3. Rodar as migrations

No painel do projeto, abra **SQL Editor**. Cole e execute, **em ordem**, o conteúdo de cada arquivo de `supabase/migrations/`:

1. `0001_extensions_enums.sql`
2. `0002_usuarios.sql`
3. `0003_clientes_categorias_equipamentos.sql`
4. `0004_eventos_equipe.sql`
5. `0005_checklists_avarias.sql`
6. `0006_propostas_contratos.sql`
7. `0007_views_disponibilidade.sql`

Se preferir usar a Supabase CLI localmente: `supabase link` e depois `supabase db push` também funciona, desde que os arquivos estejam nesta mesma pasta/ordem.

## 4. Configurar autenticação

No painel: **Authentication > Providers > Email**.

- **Confirm email**: pode deixar desativado, já que todos os usuários (Gestão e Campo) são criados pela própria aplicação com `email_confirm: true`, sem fluxo de confirmação por e-mail real.
- **Minimum password length**: reduza para o menor valor permitido (normalmente 6) se quiser que os PINs da equipe de Campo sejam curtos. Sem essa mudança, o Supabase exige senhas mais longas mesmo para os PINs.

## 5. Copiar as chaves para o projeto

Em **Project Settings > API**, copie:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ nunca commitar ou expor esta chave no navegador)

Copie `.env.example` para `.env.local` e preencha os três valores.

## 6. Criar os primeiros usuários

Com o projeto rodando (`npm run dev`), a própria aplicação permite criar os usuários de Gestão e de Campo pelas rotas administrativas (sem precisar mexer no Supabase diretamente). Na primeira execução, sem nenhum usuário Gestão ainda cadastrado, será necessário criar o primeiro admin manualmente uma única vez:

1. No painel Supabase, vá em **Authentication > Users > Add user**, crie um usuário com e-mail real (ex: o e-mail do Gabriel ou do Higor) e uma senha.
2. No **SQL Editor**, rode (substituindo o UUID pelo `id` do usuário criado, visível na lista de Users):

```sql
insert into usuarios (id, nome, perfil, papel_gestao, cargo)
values ('COLE-O-UUID-AQUI', 'Nome da pessoa', 'gestao', 'admin', 'Diretor');
```

A partir daí, esse usuário consegue logar em `/login/gestao` e usar a tela **Equipe** para cadastrar todos os demais (Gestão e Campo) pelo próprio sistema.

## 7. Rodar o projeto

```
npm run dev
```

Acesse http://localhost:3000.

## 8. Ativos visuais pendentes

Os arquivos a seguir ainda precisam ser anexados em `public/assets/` (logo e assinaturas vetorizadas fornecidas pela Mix Resolve):

- `logo.svg` e `logo.png` (usado na UI e nos PDFs, respectivamente — `@react-pdf/renderer` não lê SVG)
- `assinatura-gabriel.svg` e `assinatura-gabriel.png`
- `assinatura-higor.svg` e `assinatura-higor.png`

Até lá, os componentes que os referenciam (`components/shared/Logo.tsx`, telas de Propostas/PDF) vão exibir um espaço reservado até os arquivos existirem no caminho esperado.
