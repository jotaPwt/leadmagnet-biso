import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'
import type { ScoreResult } from '../../lib/scoring'
import { ScoreMeter } from './ScoreMeter'
import { DimensionCard } from './DimensionCard'

type ResultProps = {
  result: ScoreResult
  leadName: string
  onRestart: () => void
}

export function Result({ result, leadName, onRestart }: ResultProps) {
  const firstName = leadName.split(' ')[0]

  function shareOnLinkedIn() {
    const text = encodeURIComponent(
      `Fiz o diagnóstico de maturidade em dados da minha operação de e-commerce e tirei ${result.total}/100 no #BisoScore. Você sabe qual é o score da sua loja? 👉 https://biso.digital`
    )
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://biso.digital')}&summary=${text}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 py-8 flex flex-col items-center gap-8"
      style={{ maxWidth: 860, margin: '0 auto' }}
    >
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full p-8 flex flex-col items-center gap-4 text-center"
      >
        {/* Level badge */}
        <span
          className="pill"
          style={{
            border: `1px solid ${result.levelColor}`,
            color: result.levelColor,
          }}
        >
          {result.levelEmoji} {result.level} em Dados
        </span>

        {/* Greeting */}
        {firstName && (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: 15, color: '#888' }}>
            Olá, {firstName}! Aqui está o diagnóstico da sua operação.
          </p>
        )}

        {/* Score meter */}
        <ScoreMeter score={result.total} levelColor={result.levelColor} />

        {/* Diagnosis */}
        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#444',
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          {result.diagnosis}
        </p>
      </motion.div>

      {/* Dimensions grid */}
      <div className="w-full">
        <h3
          className="mb-4"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: '#222',
          }}
        >
          Diagnóstico por dimensão
        </h3>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          {result.dimensions.map((dim, i) => (
            <DimensionCard key={dim.key} dimension={dim} index={i} />
          ))}
        </div>
      </div>

      {/* Revenue estimate card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="w-full rounded-2xl p-6"
        style={{
          border: '2px solid #FF0068',
          background: '#FFF5F8',
          boxShadow: '0 4px 24px rgba(255,0,104,0.08)',
        }}
      >
        <div className="flex items-start gap-4">
          <span style={{ fontSize: 36 }}>💰</span>
          <div className="flex-1">
            <h3
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: '#222',
                marginBottom: 6,
              }}
            >
              Estimativa de receita mensal não capturada
            </h3>
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 5vw, 40px)',
                color: '#FF0068',
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {result.revenueEstimate}
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: 13, color: '#666', marginBottom: 10 }}>
              Baseado em resultados médios de clientes Biso com perfil similar ao seu.
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 12, color: '#FF8C00' }}>
              Toy Mania: +38% em vendas&nbsp;&nbsp;|&nbsp;&nbsp;Scavone: +248% de receita anual
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="w-full rounded-2xl p-8 text-center"
        style={{ background: '#FF0068' }}
      >
        <h3
          className="mb-2"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(20px, 3vw, 26px)',
            color: '#fff',
          }}
        >
          Quer transformar esse diagnóstico em resultado real?
        </h3>
        <p
          className="mb-6"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: 15,
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          Nossos especialistas analisam seu score e mostram exatamente o que fazer.
        </p>
        <a
          href="https://www.biso.digital/#agende"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-2xl px-8 py-3.5 font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: '#fff',
            color: '#FF0068',
            fontFamily: 'Montserrat, sans-serif',
            textDecoration: 'none',
          }}
        >
          Agendar diagnóstico gratuito com especialista →
        </a>
        <p
          className="mt-4 text-sm"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
        >
          Sem compromisso · Dura 30 minutos · Feito por especialistas em varejo
        </p>
      </motion.div>

      {/* Share + Restart */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          onClick={shareOnLinkedIn}
          className="btn-outline flex items-center justify-center gap-2"
        >
          <Linkedin size={18} />
          Compartilhar meu score no LinkedIn
        </button>
        <button
          onClick={onRestart}
          className="text-sm font-medium transition-colors"
          style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
        >
          Refazer o diagnóstico
        </button>
      </div>
    </motion.div>
  )
}
