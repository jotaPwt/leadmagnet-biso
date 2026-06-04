import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type LoadingGateProps = {
  onComplete: () => void
}

const MESSAGES = [
  'Analisando maturidade de dados...',
  'Calculando receita não capturada...',
  'Preparando seu diagnóstico...',
]

export function LoadingGate({ onComplete }: LoadingGateProps) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const duration = 2500
    const interval = 30
    const steps = duration / interval
    let step = 0

    const timer = setInterval(() => {
      step++
      const raw = step / steps
      setProgress(Math.min(raw * 100, 100))
      setMsgIndex(Math.min(Math.floor(raw * MESSAGES.length), MESSAGES.length - 1))

      if (step >= steps) {
        clearInterval(timer)
        setDone(true)
        setTimeout(() => onCompleteRef.current(), 300)
      }
    }, interval)

    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-16"
    >
      {/* Blurred score preview */}
      <div className="relative mb-10 select-none">
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(72px, 12vw, 120px)',
            color: '#FF0068',
            filter: done ? 'blur(0px)' : 'blur(18px)',
            transition: 'filter 0.6s ease',
            lineHeight: 1,
            opacity: 0.4,
          }}
        >
          ??
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: '#888',
          }}
        >
          calculando...
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full mb-4" style={{ maxWidth: 400 }}>
        <div className="progress-bar-track" style={{ height: 10, borderRadius: 999 }}>
          <motion.div
            className="progress-bar-fill"
            style={{ width: `${progress}%`, borderRadius: 999, height: '100%' }}
          />
        </div>
      </div>

      {/* Animated message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: 15,
            color: '#888',
          }}
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
