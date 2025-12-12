# 🔧 Configuração Rápida do Supabase

## Passo 1: Criar o arquivo .env

Na raiz do projeto, crie um arquivo chamado `.env` (sem extensão) com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## Passo 2: Obter as credenciais do Supabase

### Se você já tem um projeto no Supabase:

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Selecione seu projeto
3. Vá em **Settings** (Configurações) no menu lateral
4. Clique em **API**
5. Você verá:
   - **Project URL** → Copie para `VITE_SUPABASE_URL`
   - **anon public** key → Copie para `VITE_SUPABASE_ANON_KEY`

### Se você precisa criar um projeto:

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Preencha:
   - **Name**: V4 Access (ou outro nome)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
4. Aguarde a criação do projeto (pode levar alguns minutos)
5. Após a criação, siga os passos acima para obter as credenciais

## Passo 3: Configurar o banco de dados

1. No painel do Supabase, vá em **SQL Editor** (no menu lateral)
2. Clique em **New Query**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. Copie TODO o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)

Isso criará todas as tabelas e políticas de segurança necessárias.

## Passo 4: Configurar autenticação

1. No painel do Supabase, vá em **Authentication** > **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: Adicione `http://localhost:5173/**`

## Passo 5: Reiniciar o servidor

Após criar o arquivo `.env`, você DEVE reiniciar o servidor de desenvolvimento:

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

## ✅ Verificação

Se tudo estiver correto, você deve conseguir:
- Acessar a aplicação sem erros
- Ver a tela de login
- Criar uma conta (com e-mail @v4company.com)

## 🆘 Problemas Comuns

### Erro: "Variáveis de ambiente não configuradas"
- ✅ Verifique se o arquivo `.env` existe na raiz do projeto
- ✅ Verifique se as variáveis começam com `VITE_`
- ✅ Reinicie o servidor após criar/editar o `.env`

### Erro ao fazer login
- ✅ Verifique se executou o script SQL (`supabase-schema.sql`)
- ✅ Verifique se o e-mail é do domínio @v4company.com
- ✅ Verifique as configurações de URL no Supabase

### Erro ao criar credencial
- ✅ Verifique se uma empresa está selecionada
- ✅ Verifique se você tem permissão (Admin ou Super Admin)
- ✅ Verifique se executou o script SQL completo

## 📝 Exemplo de arquivo .env

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo
```

**⚠️ IMPORTANTE**: Nunca compartilhe seu arquivo `.env` ou faça commit dele no Git!

