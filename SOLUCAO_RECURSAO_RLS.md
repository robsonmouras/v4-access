# 🔴 Solução: Erro "Infinite recursion detected in policy"

## 🐛 Problema

O erro ocorre porque as políticas RLS (Row Level Security) da tabela `user_profiles` fazem queries na própria tabela, criando uma recursão infinita:

1. Política tenta verificar se usuário é super_admin
2. Para isso, precisa fazer SELECT na tabela `user_profiles`
3. Mas o SELECT precisa passar pela política RLS
4. Que tenta verificar novamente...
5. Loop infinito! 🔄

## ✅ Solução

Use funções de segurança (`SECURITY DEFINER`) que bypassam o RLS para verificar roles.

### Opção 1: Executar script de correção (Recomendado)

1. No Supabase, vá em **SQL Editor**
2. Abra o arquivo `fix-rls-recursion.sql`
3. Copie e execute todo o conteúdo
4. Pronto! O erro deve desaparecer

### Opção 2: Atualizar o schema completo

1. No Supabase, vá em **SQL Editor**
2. **Remova todas as políticas existentes** (ou execute o script de correção primeiro)
3. Execute o arquivo `supabase-schema.sql` atualizado
4. O schema agora usa funções de segurança que evitam recursão

## 🔍 O que foi alterado?

### Antes (causava recursão):
```sql
CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles  -- ❌ Query na própria tabela com RLS ativo
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
```

### Depois (sem recursão):
```sql
-- Função que bypassa RLS
CREATE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- ✅ Bypassa RLS

-- Política usando a função
CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_super_admin(auth.uid()));  -- ✅ Sem recursão
```

## 📝 Funções criadas

1. **`get_user_role(user_id UUID)`** - Retorna o role do usuário (bypassa RLS)
2. **`is_super_admin(user_id UUID)`** - Verifica se é super admin
3. **`is_admin_or_super(user_id UUID)`** - Verifica se é admin ou super admin

## ⚠️ Importante

- As funções usam `SECURITY DEFINER` que permite bypassar RLS
- Isso é seguro porque apenas verificam dados, não modificam
- As políticas agora são mais eficientes e não causam recursão

## ✅ Verificação

Após executar o script:
- ✅ O erro de recursão deve desaparecer
- ✅ Super admins podem ver todos os perfis
- ✅ Políticas funcionam corretamente
- ✅ Performance melhorada (menos queries)

## 🆘 Ainda com problemas?

Se o erro persistir:

1. Verifique se todas as políticas antigas foram removidas
2. Verifique se as funções foram criadas corretamente
3. Tente desabilitar temporariamente o RLS para testar:
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```
   (Depois reabilite e aplique as políticas corretas)

