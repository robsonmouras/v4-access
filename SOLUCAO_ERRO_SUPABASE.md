# 🔴 Solução: Erro "Variáveis de ambiente do Supabase não configuradas"

## ⚡ Solução Rápida

O erro ocorre porque o arquivo `.env` não está configurado ou está vazio. Siga estes passos:

### 1️⃣ Abra o arquivo `.env`

Na raiz do projeto, abra o arquivo `.env` (se não existir, crie um novo).

### 2️⃣ Adicione suas credenciais do Supabase

O arquivo deve conter exatamente estas duas linhas (substitua pelos seus valores reais):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3️⃣ Onde encontrar essas credenciais?

#### Opção A: Se você já tem um projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **Settings** (⚙️)
4. Clique em **API**
5. Você verá:
   - **Project URL** → Use para `VITE_SUPABASE_URL`
   - **anon public** (chave) → Use para `VITE_SUPABASE_ANON_KEY`

#### Opção B: Se você precisa criar um projeto

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Preencha:
   - **Name**: V4 Access
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a mais próxima
4. Aguarde a criação (2-3 minutos)
5. Depois, siga a Opção A acima

### 4️⃣ Exemplo de arquivo .env configurado

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo
```

### 5️⃣ ⚠️ IMPORTANTE: Reinicie o servidor!

Após criar ou editar o arquivo `.env`, você DEVE reiniciar o servidor:

1. Pare o servidor (pressione `Ctrl+C` no terminal)
2. Inicie novamente:
   ```bash
   npm run dev
   ```

**O Vite só carrega variáveis de ambiente na inicialização!**

## ✅ Verificação

Se tudo estiver correto:
- ✅ O erro não aparecerá mais
- ✅ Você verá a tela de login
- ✅ Poderá criar uma conta

## 🆘 Ainda com problemas?

### Verifique:

1. ✅ O arquivo `.env` está na **raiz do projeto** (mesmo nível do `package.json`)
2. ✅ As variáveis começam com `VITE_` (obrigatório no Vite)
3. ✅ Não há espaços antes ou depois do `=`
4. ✅ Você **reiniciou o servidor** após criar/editar o `.env`
5. ✅ As credenciais estão corretas (copie exatamente do Supabase)

### Erro comum: "Cannot read properties of undefined"

Isso significa que as variáveis não foram carregadas. **Reinicie o servidor!**

## 📝 Próximos passos

Após configurar o `.env`:

1. Execute o script SQL (`supabase-schema.sql`) no Supabase
2. Configure as URLs de redirecionamento no Supabase
3. Crie sua primeira conta

Veja o arquivo `SETUP_SUPABASE.md` para instruções completas.

