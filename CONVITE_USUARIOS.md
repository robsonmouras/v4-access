# 📧 Sistema de Convite de Usuários

## Funcionalidades Implementadas

### ✅ Tela de Convite (`/invite-user`)
- Acessível apenas para **Super Admin**
- Validação de domínio @v4company.com
- Seleção de perfil (Básico, Admin, Super Admin)
- Formulário com validações

### ✅ Envio de Email
- Email automático com link para definir senha
- Link redireciona para `/set-password`
- Usuário recebe instruções por email

### ✅ Página de Definição de Senha (`/set-password`)
- Validação de link/token
- Interface para criar senha
- Mostrar/ocultar senha
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha

## ⚠️ Importante: Configuração do Supabase

Para que o sistema de convites funcione completamente, você precisa configurar:

### 1. Email Templates no Supabase

1. Acesse o painel do Supabase
2. Vá em **Authentication > Email Templates**
3. Configure o template **"Reset Password"** (usado para convites)

### 2. Configurar SMTP (Opcional mas Recomendado)

Para emails mais confiáveis:

1. No Supabase, vá em **Settings > Auth**
2. Configure **SMTP Settings** com seu provedor de email
3. Ou use o serviço de email padrão do Supabase

### 3. URLs de Redirecionamento

1. No Supabase, vá em **Authentication > URL Configuration**
2. Adicione à lista de **Redirect URLs**:
   ```
   http://localhost:5173/set-password
   https://seu-dominio.com/set-password
   ```

## 🔧 Como Funciona

### Fluxo de Convite:

1. **Super Admin** acessa `/invite-user`
2. Preenche:
   - E-mail (@v4company.com)
   - Nome completo
   - Perfil (Básico/Admin/Super Admin)
3. Sistema:
   - Cria usuário no Supabase Auth
   - Cria perfil na tabela `user_profiles`
   - Envia email com link de recuperação de senha
4. **Usuário convidado**:
   - Recebe email
   - Clica no link
   - É redirecionado para `/set-password`
   - Define sua senha
   - Pode fazer login

## 🎯 Permissões

- **Apenas Super Admin** pode:
  - Acessar `/invite-user`
  - Ver botão "Convidar" no Header
  - Criar novos usuários

## 📝 Notas Técnicas

### Método Atual
O sistema usa `resetPasswordForEmail` para enviar o link, pois:
- Funciona com a chave anon (não precisa de service role)
- É a forma mais simples de implementar
- O usuário recebe um link válido para definir senha

### Alternativa (Requer Service Role)
Se você tiver acesso à **Service Role Key** do Supabase, pode usar:
- `supabase.auth.admin.createUser()` - Criar usuário sem senha
- `supabase.auth.admin.generateLink()` - Gerar link de convite específico

Isso requer criar uma função Edge Function ou usar a API diretamente com a service role key (nunca no frontend!).

## 🐛 Troubleshooting

### Email não está sendo enviado
- Verifique as configurações de SMTP no Supabase
- Verifique se o email não foi para spam
- Use a opção "Esqueceu a senha" na tela de login como alternativa

### Link expirado
- Links de recuperação expiram após 1 hora (padrão)
- Super Admin pode reenviar o convite

### Usuário já existe
- Sistema verifica se email já está cadastrado
- Mostra mensagem de erro clara

## ✅ Validações Implementadas

- ✅ Domínio @v4company.com obrigatório
- ✅ Nome completo obrigatório
- ✅ Verificação de email duplicado
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha
- ✅ Validação de link/token

