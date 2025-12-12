import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
    ⚠️ Variáveis de ambiente do Supabase não configuradas!
    
    Por favor, siga estes passos:
    
    1. Crie um arquivo .env na raiz do projeto
    2. Adicione as seguintes variáveis:
    
       VITE_SUPABASE_URL=https://seu-projeto.supabase.co
       VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
    
    3. Para obter essas informações:
       - Acesse https://supabase.com
       - Vá em Settings > API
       - Copie a URL do projeto e a chave anon/public
    
    4. Reinicie o servidor de desenvolvimento (npm run dev)
    
    Veja o arquivo env.example para um exemplo.
  `
  console.error(errorMessage)
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o console para mais detalhes.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

