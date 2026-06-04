import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type ScoreMeterProps = {
  score: number
  levelColor: string
}

export function ScoreMeter({ score, levelColor }: ScoreMeterProps) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1500

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score number */}
      <div className="flex items-end gap-2">
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(72px, 12vw, 96px)',
            color: levelColor,
            lineHeight: 1,
          }}
        >
          {displayed}
        </span>
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(24px, 4vw, 32px)',
            color: '#ccc',
            marginBottom: 8,
          }}
        >
          /100
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track w-full" style={{ maxWidth: 360 }}>
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{ background: levelColor }}
        />
      </div>
    </div>
  )
}
