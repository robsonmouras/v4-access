# Guia de Configuração - V4 Access

## 1. Instalação das Dependências

```bash
npm install
```

## 2. Configuração do Supabase

### 2.1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL do projeto e a chave anônima (anon key)

### 2.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 2.3. Executar Script SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Abra o arquivo `supabase-schema.sql` deste projeto
3. Copie todo o conteúdo e cole no SQL Editor
4. Execute o script (botão Run)

Este script criará:
- Tabelas: `user_profiles`, `companies`, `credentials`
- Políticas de segurança (RLS)
- Índices para performance
- Triggers para atualização automática de timestamps

### 2.4. Configurar Autenticação no Supabase

1. No painel do Supabase, vá em **Authentication > Settings**
2. Configure as URLs de redirecionamento:
   - Site URL: `http://localhost:5173` (desenvolvimento)
   - Redirect URLs: Adicione `http://localhost:5173/**`
3. Opcionalmente, configure o template de e-mail de confirmação

## 3. Criar Primeiro Usuário Super Admin

Após criar sua conta no sistema, você precisará atualizar manualmente o role no banco de dados:

1. No Supabase, vá em **Table Editor > user_profiles**
2. Encontre seu usuário
3. Altere o campo `role` para `super_admin`

Ou execute este SQL (substitua o e-mail):

```sql
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'seu-email@v4company.com';
```

## 4. Executar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 5. Estrutura do Banco de Dados

### Tabela: user_profiles
- `id` (UUID): Referência ao auth.users
- `email` (TEXT): E-mail do usuário
- `full_name` (TEXT): Nome completo
- `role` (TEXT): 'super_admin', 'admin' ou 'básico'
- `created_at`, `updated_at` (TIMESTAMP)

### Tabela: companies
- `id` (UUID): ID único
- `name` (TEXT): Nome da empresa
- `description` (TEXT): Descrição opcional
- `created_at`, `updated_at` (TIMESTAMP)

### Tabela: credentials
- `id` (UUID): ID único
- `company_id` (UUID): Referência à empresa
- `name` (TEXT): Nome da credencial
- `type` (TEXT): 'hospedagem', 'servidor' ou 'registro.br'
- `link` (TEXT): URL opcional
- `login` (TEXT): Login/usuário
- `password` (TEXT): Senha
- `created_at`, `updated_at` (TIMESTAMP)

## 6. Permissões por Role

### Super Admin
- ✅ Criar, editar e deletar credenciais
- ✅ Criar, editar e deletar empresas
- ✅ Gerenciar roles de usuários

### Admin
- ✅ Criar e editar credenciais
- ❌ Deletar credenciais
- ✅ Criar e editar empresas
- ❌ Deletar empresas

### Básico
- ✅ Visualizar credenciais
- ❌ Criar, editar ou deletar credenciais
- ❌ Gerenciar empresas

## 7. Validação de E-mail

O sistema valida que apenas e-mails do domínio `@v4company.com` podem se cadastrar. Esta validação é feita tanto no frontend quanto pode ser reforçada no backend do Supabase.

## 8. Build para Produção

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## 9. Troubleshooting

### Erro: "Variáveis de ambiente do Supabase não configuradas"
- Verifique se o arquivo `.env` existe e contém as variáveis corretas
- Reinicie o servidor de desenvolvimento após criar/editar o `.env`

### Erro ao fazer login
- Verifique se o e-mail foi confirmado no Supabase
- Verifique se o e-mail é do domínio @v4company.com
- Verifique as políticas RLS no Supabase

### Erro ao criar credencial
- Verifique se uma empresa está selecionada
- Verifique se o usuário tem permissão (Admin ou Super Admin)
- Verifique as políticas RLS no Supabase

