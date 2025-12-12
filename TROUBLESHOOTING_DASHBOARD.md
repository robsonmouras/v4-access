# 🔧 Troubleshooting - Problemas ao Acessar Credenciais no Dashboard

## Problemas Comuns e Soluções

### 1. Credenciais não aparecem

#### Verificar no Console do Navegador:
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Procure por mensagens de erro
4. Verifique se aparece: "Buscando credenciais para empresa: [id]"

#### Possíveis Causas:

**A) Empresa não está selecionada**
- Verifique se há uma empresa selecionada na Sidebar
- A empresa selecionada deve aparecer destacada em vermelho
- Se não houver empresa selecionada, clique em uma na Sidebar

**B) Erro de permissão (RLS)**
- Verifique se as políticas RLS estão configuradas corretamente
- Execute o script `fix-rls-recursion.sql` no Supabase
- Verifique se você está autenticado

**C) Tabela de credenciais vazia**
- A empresa pode não ter credenciais cadastradas ainda
- Clique em "Nova Credencial" para criar uma

### 2. Erro: "Erro ao carregar credenciais"

#### Verificar:
1. **Políticas RLS no Supabase:**
   ```sql
   -- Verificar se a política existe
   SELECT * FROM pg_policies WHERE tablename = 'credentials';
   ```

2. **Executar script de correção:**
   - Execute `fix-rls-recursion.sql` no SQL Editor do Supabase

3. **Verificar autenticação:**
   - Faça logout e login novamente
   - Verifique se o token de autenticação está válido

### 3. Dashboard não carrega empresa

#### Solução:
1. Acesse a Home (`/`)
2. Clique em uma empresa
3. Isso deve redirecionar para `/dashboard?company=[id]`

### 4. Sidebar não funciona

#### Verificar:
1. No mobile, clique no menu (☰) no canto superior esquerdo
2. No desktop, a sidebar deve estar sempre visível
3. Verifique se há empresas cadastradas

### 5. Erro de CORS ou Network

#### Verificar:
1. Arquivo `.env` está configurado corretamente
2. Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas
3. Reinicie o servidor após alterar o `.env`

## Debug Passo a Passo

### 1. Verificar Console do Navegador
```javascript
// Deve aparecer no console:
"Buscando credenciais para empresa: [uuid] [nome]"
"Credenciais encontradas: [número]"
```

### 2. Verificar Network Tab
1. Abra DevTools > Network
2. Filtre por "credentials"
3. Verifique se a requisição foi feita
4. Veja o status da resposta (200 = OK, 401/403 = Permissão)

### 3. Verificar Supabase
1. Acesse o painel do Supabase
2. Vá em **Table Editor > credentials**
3. Verifique se há credenciais cadastradas
4. Verifique se o `company_id` corresponde à empresa selecionada

### 4. Testar Query Manualmente
No SQL Editor do Supabase, execute:
```sql
SELECT * FROM credentials 
WHERE company_id = 'id-da-empresa-aqui'
ORDER BY created_at DESC;
```

## Soluções Rápidas

### Recarregar a página
- Pressione `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)

### Limpar cache
- Limpe o cache do navegador
- Ou use modo anônimo/privado

### Verificar autenticação
- Faça logout e login novamente
- Verifique se o perfil do usuário está correto

### Verificar RLS
- Execute novamente o script `supabase-schema.sql`
- Ou execute `fix-rls-recursion.sql`

## Se Nada Funcionar

1. **Verifique os logs do Supabase:**
   - No painel do Supabase, vá em **Logs > Postgres Logs**
   - Procure por erros relacionados a `credentials`

2. **Verifique as políticas RLS:**
   ```sql
   -- Listar todas as políticas
   SELECT * FROM pg_policies WHERE tablename = 'credentials';
   
   -- Verificar se RLS está habilitado
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename = 'credentials';
   ```

3. **Teste com usuário diferente:**
   - Crie um novo usuário
   - Teste com diferentes roles (básico, admin, super_admin)

4. **Contate o suporte:**
   - Envie os logs do console
   - Envie os logs do Supabase
   - Descreva exatamente o que acontece

