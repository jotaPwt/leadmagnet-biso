import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { DimensionResult } from '../../lib/scoring'

type DimensionCardProps = {
  dimension: DimensionResult
  index: number
  isOpen: boolean
  onToggle: (key: string) => void
}

export function DimensionCard({ dimension, index, isOpen, onToggle }: DimensionCardProps) {
  const fillPercent = (dimension.score / dimension.maxScore) * 100
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (isOpen) {
      el.style.maxHeight = el.scrollHeight + 'px'
      el.style.opacity = '1'
    } else {
      el.style.maxHeight = '0px'
      el.style.opacity = '0'
    }
  }, [isOpen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.1, ease: 'easeOut' }}
      className="card flex flex-col overflow-hidden"
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Header: pilar + score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 20 }}>{dimension.icon}</span>
            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#FF0068',
                  lineHeight: 1.2,
                }}
              >
                {dimension.name}
              </span>
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  fontSize: 11,
                  color: '#aaa',
                  letterSpacing: '0.01em',
                }}
              >
                {dimension.subtitle}
              </span>
            </div>
          </div>
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: dimension.score === dimension.maxScore ? '#00B37E' : '#FF0068',
              whiteSpace: 'nowrap',
            }}
          >
            {dimension.score}/{dimension.maxScore}
          </span>
        </div>

        {/* Progress */}
        <div className="progress-bar-track" style={{ height: 6 }}>
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
            style={{
              background: dimension.score === dimension.maxScore ? '#00B37E' : '#FF0068',
            }}
          />
        </div>

        {/* Insight */}
        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          {dimension.insight}
        </p>

        {/* Bottom: badge + toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {dimension.hasOpportunity && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(255, 140, 0, 0.1)',
                color: '#FF8C00',
                border: '1px solid rgba(255, 140, 0, 0.3)',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Oportunidade de melhoria
            </span>
          )}

          {dimension.hasOpportunity && dimension.actionPlan.length > 0 && (
            <button
              onClick={() => onToggle(dimension.key)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FF0068',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: 13,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {isOpen ? 'Fechar plano ↑' : 'Ver plano de ação →'}
            </button>
          )}
        </div>
      </div>

      {/* Expandable action plan */}
      {dimension.hasOpportunity && dimension.actionPlan.length > 0 && (
        <div
          ref={panelRef}
          style={{
            maxHeight: 0,
            opacity: 0,
            overflow: 'hidden',
            transition: 'max-height 300ms ease, opacity 250ms ease',
          }}
        >
          <div
            style={{
              background: '#FFF5F8',
              borderTop: '1px solid rgba(255,0,104,0.12)',
              padding: '12px 20px 16px',
            }}
          >
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                color: '#FF0068',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom: 10,
              }}
            >
              Próximos passos — {dimension.name}
            </p>
            <div className="flex flex-col gap-2.5">
              {dimension.actionPlan.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      color: '#FF0068',
                      minWidth: 18,
                      lineHeight: 1.6,
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 400,
                      fontSize: 13,
                      color: '#333',
                      lineHeight: 1.6,
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
