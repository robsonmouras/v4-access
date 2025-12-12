# V4 Access - Gerenciador de Credenciais

Sistema de gerenciamento de credenciais para a V4 Company, desenvolvido com React, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- ✅ Autenticação com validação de domínio @v4company.com
- ✅ Três níveis de acesso: Super Admin, Admin e Básico
- ✅ Gestão de empresas
- ✅ CRUD de credenciais (Hospedagem, Servidor, Registro.br)
- ✅ Busca e filtros
- ✅ Interface responsiva (desktop e mobile)
- ✅ Mostrar/ocultar senhas
- ✅ Copiar credenciais com um clique
- ✅ Gerenciamento de usuários (Super Admin)

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase
- E-mail do domínio @v4company.com para cadastro

## 🔧 Instalação

```bash
# Instalar dependências
npm install
```

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 2. Configurar Banco de Dados

1. Acesse o painel do Supabase
2. Vá em **SQL Editor**
3. Execute o script do arquivo `supabase-schema.sql`

### 3. Configurar Autenticação

No Supabase, configure:
- Site URL: `http://localhost:5173` (desenvolvimento)
- Redirect URLs: `http://localhost:5173/**`

📖 **Para instruções detalhadas, consulte o arquivo [CONFIGURACAO.md](./CONFIGURACAO.md)**

## 🏃 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 👥 Perfis de Usuário

### Super Admin
- Criar, editar e deletar credenciais
- Criar, editar e deletar empresas
- Gerenciar roles de usuários

### Admin
- Criar e editar credenciais
- Criar e editar empresas
- Não pode deletar

### Básico
- Visualizar credenciais
- Não pode criar, editar ou deletar

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (Auth + Database)
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis
├── contexts/        # Context API (Auth, Company)
├── lib/            # Configurações (Supabase)
├── pages/          # Páginas da aplicação
└── App.jsx         # Componente principal
```

## 🔒 Segurança

- Validação de domínio de e-mail no frontend
- Row Level Security (RLS) no Supabase
- Políticas de acesso baseadas em roles
- Senhas criptografadas no banco de dados

## 📝 Licença

Este projeto é propriedade da V4 Company.

