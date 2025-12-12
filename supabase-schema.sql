-- Schema do banco de dados para V4 Access
-- Execute este script no SQL Editor do Supabase

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'básico' CHECK (role IN ('super_admin', 'admin', 'básico')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de credenciais
CREATE TABLE IF NOT EXISTS credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospedagem', 'servidor', 'registro.br')),
  link TEXT,
  login TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_credentials_company_id ON credentials(company_id);
CREATE INDEX IF NOT EXISTS idx_credentials_type ON credentials(type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Função de segurança para verificar role do usuário (bypassa RLS)
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

-- Função para verificar se usuário é super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é admin ou super admin
CREATE OR REPLACE FUNCTION is_admin_or_super(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role(user_id);
  RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS - Row Level Security)

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Super admins podem ver todos os perfis
CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_super_admin(auth.uid()));

-- Super admins podem atualizar roles
CREATE POLICY "Super admins can update roles" ON user_profiles
  FOR UPDATE USING (is_super_admin(auth.uid()));

-- Políticas para companies
-- Todos os usuários autenticados podem ver empresas
CREATE POLICY "Authenticated users can view companies" ON companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas admins e super admins podem criar empresas
CREATE POLICY "Admins can create companies" ON companies
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Apenas admins e super admins podem atualizar empresas
CREATE POLICY "Admins can update companies" ON companies
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

-- Apenas super admins podem deletar empresas
CREATE POLICY "Super admins can delete companies" ON companies
  FOR DELETE USING (is_super_admin(auth.uid()));

-- Políticas para credentials
-- Todos os usuários autenticados podem ver credenciais
CREATE POLICY "Authenticated users can view credentials" ON credentials
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas admins e super admins podem criar credenciais
CREATE POLICY "Admins can create credentials" ON credentials
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Apenas admins e super admins podem atualizar credenciais
CREATE POLICY "Admins can update credentials" ON credentials
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

-- Apenas super admins podem deletar credenciais
CREATE POLICY "Super admins can delete credentials" ON credentials
  FOR DELETE USING (is_super_admin(auth.uid()));

-- Comentários nas tabelas
COMMENT ON TABLE user_profiles IS 'Perfis de usuário com roles e informações pessoais';
COMMENT ON TABLE companies IS 'Empresas cadastradas no sistema';
COMMENT ON TABLE credentials IS 'Credenciais de acesso (hospedagem, servidor, registro.br)';

COMMENT ON COLUMN user_profiles.role IS 'Papel do usuário: super_admin, admin ou básico';
COMMENT ON COLUMN credentials.type IS 'Tipo de credencial: hospedagem, servidor ou registro.br';

