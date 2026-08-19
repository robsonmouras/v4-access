import { useEffect, useRef, useState } from 'react'
import { Download, ChevronDown, FileSpreadsheet, FileJson } from 'lucide-react'

// Remove acentos e caracteres especiais para uso em nome de arquivo
const slugify = (text) =>
  (text || 'empresa')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()

const getTipoNome = (credential) => credential.tipos_credencial?.nome || 'Sem tipo'

const buildRows = (credentials, companyName) =>
  credentials.map((c) => ({
    empresa: companyName || '',
    tipo: getTipoNome(c),
    nome: c.name || '',
    login: c.login || '',
    senha: c.password || '',
    link: c.link || '',
  }))

const csvEscape = (value) => {
  const str = String(value ?? '')
  if (/[";\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const downloadBlob = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportCSV = (credentials, companyName) => {
  const rows = buildRows(credentials, companyName)
  const headers = ['Empresa', 'Tipo', 'Nome', 'Login', 'Senha', 'Link']
  const lines = [
    headers.join(';'),
    ...rows.map((r) => Object.values(r).map(csvEscape).join(';')),
  ]
  // BOM para o Excel reconhecer acentuação em UTF-8
  const content = '﻿' + lines.join('\r\n')
  downloadBlob(content, `credenciais_${slugify(companyName)}_${Date.now()}.csv`, 'text/csv;charset=utf-8;')
}

const exportJSON = (credentials, companyName) => {
  const rows = buildRows(credentials, companyName)
  const content = JSON.stringify(rows, null, 2)
  downloadBlob(content, `credenciais_${slugify(companyName)}_${Date.now()}.json`, 'application/json;charset=utf-8;')
}

const ExportCredentialsButton = ({ credentials, companyName, disabled }) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = (type) => {
    setOpen(false)
    if (!credentials || credentials.length === 0) return
    if (type === 'csv') exportCSV(credentials, companyName)
    if (type === 'json') exportJSON(credentials, companyName)
  }

  const isDisabled = disabled || !credentials || credentials.length === 0

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={isDisabled}
        className="flex items-center gap-2 bg-white text-ea-primary font-semibold px-4 py-2 rounded-lg border border-ea-primary/40 hover:bg-ea-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        <Download className="w-5 h-5" />
        Exportar
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Exportar como CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileJson className="w-4 h-4 text-amber-600" />
            Exportar como JSON
          </button>
        </div>
      )}
    </div>
  )
}

export default ExportCredentialsButton
