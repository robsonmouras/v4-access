-- Script para corrigir recursão infinita nas políticas RLS
-- Execute este script no SQL Editor do Supabase APÓS executar o supabase-schema.sql

-- 1. Remover políticas problemáticas
DROP POLICY IF EXISTS "Super admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can update roles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can create companies" ON companies;
DROP POLICY IF EXISTS "Admins can update companies" ON companies;
DROP POLICY IF EXISTS "Super admins can delete companies" ON companies;
DROP POLICY IF EXISTS "Admins can create credentials" ON credentials;
DROP POLICY IF EXISTS "Admins can update credentials" ON credentials;
DROP POLICY IF EXISTS "Super admins can delete credentials" ON credentials;

-- 2. Criar funções de segurança (bypassam RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'básico');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_super(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role(user_id);
  RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar políticas usando as funções
CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update roles" ON user_profiles
  FOR UPDATE USING (is_super_admin(auth.uid()));

CREATE POLICY "Admins can create companies" ON companies
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update companies" ON companies
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super admins can delete companies" ON companies
  FOR DELETE USING (is_super_admin(auth.uid()));

CREATE POLICY "Admins can create credentials" ON credentials
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update credentials" ON credentials
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super admins can delete credentials" ON credentials
  FOR DELETE USING (is_super_admin(auth.uid()));

