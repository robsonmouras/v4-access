import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import { Mail, User, Shield, Send, AlertCircle, CheckCircle } from 'lucide-react'

const InviteUser = () => {
  const { userProfile } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'básico',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Apenas super_admin pode acessar
  if (userProfile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-v4-light">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Apenas Super Admins podem convidar novos usuários.</p>
          </div>
        </div>
      </div>
    )
  }

  const validateEmail = (email) => {
    return email.endsWith('@v4company.com')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validações
    if (!validateEmail(formData.email)) {
      setError('Apenas e-mails do domínio @v4company.com são permitidos')
      return
    }

    if (!formData.fullName.trim()) {
      setError('O nome completo é obrigatório')
      return
    }

    setLoading(true)

    try {
      // Verificar se o usuário já existe
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        setError('Este e-mail já está cadastrado no sistema')
        setLoading(false)
        return
      }

      // Criar usuário temporário com senha aleatória (será alterada pelo usuário)
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/set-password`,
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          setError('Este e-mail já está cadastrado no sistema')
          setLoading(false)
          return
        }
        throw authError
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: formData.role,
          },
        ])

      if (profileError) {
        throw profileError
      }

      // Enviar email de recuperação de senha (que servirá como convite)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/set-password`,
      })

      if (resetError) {
        console.error('Erro ao enviar email:', resetError)
        setSuccess(
          `Usuário criado com sucesso! Email: ${formData.email}. ` +
          `Nota: Houve um problema ao enviar o email de convite. ` +
          `Você pode reenviar o convite usando a opção "Esqueceu a senha" na tela de login.`
        )
      } else {
        setSuccess(
          `Convite enviado com sucesso para ${formData.email}! ` +
          `O usuário receberá um email com um link para definir sua senha.`
        )
      }

      // Limpar formulário
      setFormData({
        email: '',
        fullName: '',
        role: 'básico',
      })
    } catch (err) {
      console.error('Erro ao convidar usuário:', err)
      setError(err.message || 'Erro ao convidar usuário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-v4-light">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-v4-dark mb-2">Convidar Novo Usuário</h1>
              <p className="text-gray-600">
                Envie um convite para um novo usuário acessar o sistema
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Erro</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Sucesso!</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  E-mail *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-v4-primary focus:border-transparent"
                  placeholder="usuario@v4company.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Apenas e-mails do domínio @v4company.com são permitidos
                </p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nome Completo *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-v4-primary focus:border-transparent"
                  placeholder="Nome completo do usuário"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Perfil de Acesso *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-v4-primary focus:border-transparent"
                >
                  <option value="básico">Básico - Apenas visualização</option>
                  <option value="admin">Admin - Criar e editar credenciais</option>
                  <option value="super_admin">Super Admin - Acesso total</option>
                </select>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium mb-1">Permissões por perfil:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>
                      <strong>Básico:</strong> Visualizar credenciais
                    </li>
                    <li>
                      <strong>Admin:</strong> Criar e editar credenciais e empresas
                    </li>
                    <li>
                      <strong>Super Admin:</strong> Acesso total + gerenciar usuários
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ email: '', fullName: '', role: 'básico' })
                    setError('')
                    setSuccess('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-v4-primary text-white px-4 py-2 rounded-lg hover:bg-v4-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enviando convite...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Convite</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default InviteUser

