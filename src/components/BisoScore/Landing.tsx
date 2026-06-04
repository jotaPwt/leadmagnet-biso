import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Store } from 'lucide-react'

type LandingProps = {
  onStart: (url: string) => void
  initialUrl: string
}

export function Landing({ onStart, initialUrl }: LandingProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = (inputRef.current?.value ?? '').trim()
    if (!trimmed) {
      setError('Por favor, insira a URL da sua loja.')
      return
    }
    setError('')
    onStart(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
  }

  const brands = ['Toy Mania', 'Scavone', 'Crocs', 'Intelbras', 'Weleda']

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-12"
    >
      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="pill mb-6 inline-flex">
          ✦ Diagnóstico gratuito · 2 minutos
        </span>
      </motion.div>

      {/* H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-4 leading-tight"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(32px, 6vw, 52px)',
          color: '#FF0068',
          maxWidth: 680,
        }}
      >
        Descubra o Biso Score da sua loja
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 400,
          fontSize: 18,
          color: '#333',
          maxWidth: 520,
          lineHeight: 1.6,
        }}
      >
        Avalie a maturidade em dados do seu e-commerce em 5 dimensões e descubra quanto você está deixando de faturar.
      </motion.p>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full flex flex-col sm:flex-row gap-3 mb-4"
        style={{ maxWidth: 520 }}
      >
        <div className="relative flex-1">
          <Store
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#aaa' }}
          />
          <input
            ref={inputRef}
            type="text"
            defaultValue={initialUrl}
            placeholder="https://minhaloja.com.br"
            className="input-field pl-10"
            style={{ height: 50 }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary whitespace-nowrap text-sm sm:text-base"
          style={{ height: 50, minWidth: 220 }}
        >
          Calcular meu Biso Score →
        </button>
      </motion.form>

      {error && (
        <p className="text-sm mb-3" style={{ color: '#FF4444', fontWeight: 500 }}>
          {error}
        </p>
      )}

      {/* Trust signals */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm mb-12"
        style={{ color: '#888', fontWeight: 500 }}
      >
        ✓ Gratuito&nbsp;&nbsp;·&nbsp;&nbsp;✓ Sem cadastro inicial&nbsp;&nbsp;·&nbsp;&nbsp;✓ Resultado em 2 minutos
      </motion.p>

      {/* Social proof brands */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-xs uppercase tracking-widest" style={{ color: '#bbb', fontWeight: 600 }}>
          Confiado por marcas como
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {brands.map((b, i) => (
            <span key={b} className="flex items-center gap-3">
              <span style={{ color: '#ccc', fontWeight: 500, fontSize: 13 }}>{b}</span>
              {i < brands.length - 1 && (
                <span style={{ color: '#ddd', fontSize: 13 }}>·</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
