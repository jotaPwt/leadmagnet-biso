import { motion } from 'framer-motion'
import type { DimensionResult } from '../../lib/scoring'

type DimensionCardProps = {
  dimension: DimensionResult
  index: number
}

export function DimensionCard({ dimension, index }: DimensionCardProps) {
  const fillPercent = (dimension.score / dimension.maxScore) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.1, ease: 'easeOut' }}
      className="card p-5 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 22 }}>{dimension.icon}</span>
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: '#222',
            }}
          >
            {dimension.name}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            color: '#FF0068',
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
        />
      </div>

      {/* Insight */}
      <p
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 400,
          fontSize: 13,
          color: '#555',
          lineHeight: 1.55,
        }}
      >
        {dimension.insight}
      </p>

      {/* Opportunity badge */}
      {dimension.hasOpportunity && (
        <span
          className="self-start text-xs font-semibold px-3 py-1 rounded-full"
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
    </motion.div>
  )
}
