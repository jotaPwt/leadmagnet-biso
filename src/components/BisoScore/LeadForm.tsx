import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { QuizAnswers } from '../../lib/scoring'
import { sendToWebhook } from '../../lib/webhook'

type LeadFormProps = {
  storeUrl: string
  answers: QuizAnswers
  scoreTotal: number
  nivel: string
  onSubmit: (lead: LeadData) => void
}

export type LeadData = {
  nome: string
  email: string
  empresa: string
  telefone: string
  vertical: string
  plataforma: string
  faturamento: number | null
}

const VERTICALS = [
  'E-commerce B2C',
  'E-commerce B2B',
  'Omnichannel (online + físico)',
  'Marketplace',
  'App de varejo',
  'Loja física com e-commerce',
]

const PLATFORMS = ['Shopify', 'VTEX', 'Nuvemshop', 'WooCommerce', 'Tray', 'Outro']

const FATURAMENTO_OPTIONS = [
  { label: 'Até R$ 100 mil/mês', value: 100000 },
  { label: 'R$ 100k – R$ 500k/mês', value: 300000 },
  { label: 'R$ 500k – R$ 2 milhões/mês', value: 1000000 },
  { label: 'R$ 2M – R$ 10 milhões/mês', value: 5000000 },
  { label: 'Acima de R$ 10 milhões/mês', value: 10000000 },
]

export function LeadForm({ storeUrl, answers, scoreTotal, nivel, onSubmit }: LeadFormProps) {
  const [form, setForm] = useState<LeadData>({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    vertical: '',
    plataforma: '',
    faturamento: null,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({})
  const [loading, setLoading] = useState(false)

  function set<K extends keyof LeadData>(field: K, value: LeadData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof LeadData, string>> = {}
    if (!form.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!form.email.trim()) newErrors.email = 'E-mail obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'E-mail inválido'
    if (!form.empresa.trim()) newErrors.empresa = 'Empresa obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    await sendToWebhook({
      nome: form.nome,
      email: form.email,
      empresa: form.empresa,
      telefone: form.telefone,
      vertical: form.vertical || 'Não informado',
      plataforma: form.plataforma || 'Não informado',
      faturamento: form.faturamento,
      url_loja: storeUrl,
      score_total: scoreTotal,
      respostas: answers,
      nivel,
      timestamp: new Date().toISOString(),
    })

    // Melhoria 4: incrementar contador social
    try {
      const count = parseInt(localStorage.getItem('biso_diagnosticos_count') ?? '0', 10)
      localStorage.setItem('biso_diagnosticos_count', String(count + 1))
    } catch {}

    setLoading(false)
    onSubmit(form)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-8"
    >
      <div className="card p-8 w-full" style={{ maxWidth: 480 }}>
        {/* Score teaser */}
        <div className="text-center mb-6">
          <div
            className="text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: '#FF0068' }}
          >
            ✦ Score calculado!
          </div>
          <h2
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              fontSize: 26,
              color: '#222',
              lineHeight: 1.3,
            }}
          >
            Seu Biso Score está pronto!
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#666', fontWeight: 500 }}>
            Insira seus dados para liberar o diagnóstico completo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nome completo" error={errors.nome}>
            <input
              type="text"
              className="input-field"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
            />
          </Field>

          <Field label="E-mail corporativo" error={errors.email}>
            <input
              type="email"
              className="input-field"
              placeholder="voce@empresa.com.br"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>

          <Field label="Nome da empresa" error={errors.empresa}>
            <input
              type="text"
              className="input-field"
              placeholder="Nome da sua empresa"
              value={form.empresa}
              onChange={(e) => set('empresa', e.target.value)}
            />
          </Field>

          <Field label="Telefone / WhatsApp" hint="opcional">
            <input
              type="tel"
              className="input-field"
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={(e) => set('telefone', e.target.value)}
            />
          </Field>

          <Field label="Tipo de operação">
            <select
              className="input-field"
              value={form.vertical}
              onChange={(e) => set('vertical', e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Selecione seu modelo</option>
              {VERTICALS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Field>

          <Field label="Faturamento mensal aproximado" hint="opcional">
            <select
              className="input-field"
              value={form.faturamento ?? ''}
              onChange={(e) => set('faturamento', e.target.value ? Number(e.target.value) : null)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Selecione uma faixa</option>
              {FATURAMENTO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Plataforma de e-commerce" hint="opcional">
            <select
              className="input-field"
              value={form.plataforma}
              onChange={(e) => set('plataforma', e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Selecione sua plataforma</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base mt-2"
            style={{ height: 52, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Aguarde...' : 'Liberar meu diagnóstico →'}
          </button>

          <p
            className="text-center text-xs flex items-center justify-center gap-1.5"
            style={{ color: '#999', fontWeight: 500 }}
          >
            <Lock size={12} />
            Seus dados estão seguros. Não fazemos spam.
          </p>
        </form>
      </div>
    </motion.div>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold flex items-center gap-2"
        style={{ color: '#444', fontFamily: 'Montserrat, sans-serif' }}
      >
        {label}
        {hint && <span style={{ color: '#bbb', fontWeight: 400 }}>({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium" style={{ color: '#FF4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}
