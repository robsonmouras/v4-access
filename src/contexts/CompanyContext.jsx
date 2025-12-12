import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CompanyContext = createContext({})

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany deve ser usado dentro de CompanyProvider')
  }
  return context
}

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCompanies()
    }
  }, [user])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCompanies(data || [])

      // Se não houver empresa selecionada e houver empresas, selecionar a primeira
      if (!selectedCompany && data && data.length > 0) {
        setSelectedCompany(data[0])
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single()

    if (error) throw error
    await fetchCompanies()
    return data
  }

  const updateCompany = async (id, companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    await fetchCompanies()
    return data
  }

  const deleteCompany = async (id) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchCompanies()
  }

  const value = {
    companies,
    selectedCompany,
    setSelectedCompany,
    loading,
    createCompany,
    updateCompany,
    deleteCompany,
    fetchCompanies,
  }

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

