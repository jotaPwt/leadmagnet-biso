import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import type { QuizAnswers } from '../../lib/scoring'

type Question = {
  id: keyof QuizAnswers
  pilar: string     // Nome do pilar Biso
  subtitle: string  // Descrição técnica
  question: string
  options: { label: string; points: number }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    pilar: 'Conecte',
    subtitle: 'Integração de dados',
    question: 'Seus dados de vendas online e offline estão centralizados em uma única ferramenta?',
    options: [
      { label: 'Sim, totalmente', points: 4 },
      { label: 'Parcialmente', points: 2 },
      { label: 'Não, estão espalhados', points: 0 },
    ],
  },
  {
    id: 'q2',
    pilar: 'Visualize',
    subtitle: 'Monitoramento em tempo real',
    question: 'Com que frequência você monitora os KPIs da sua operação?',
    options: [
      { label: 'Diariamente com dashboards automáticos', points: 4 },
      { label: 'Semanalmente em reuniões', points: 2 },
      { label: 'Quando tem algum problema', points: 0 },
    ],
  },
  {
    id: 'q5',
    pilar: 'Analise',
    subtitle: 'Capacidade analítica',
    question: 'Quando você precisa de um dado específico da operação, como obtém?',
    options: [
      { label: 'Peço aos dados em linguagem natural / BI próprio', points: 4 },
      { label: 'Exporto planilhas e analiso manualmente', points: 2 },
      { label: 'Espero o relatório mensal do time', points: 0 },
    ],
  },
  {
    id: 'q4',
    pilar: 'Crie',
    subtitle: 'Inteligência de CRM',
    question: 'Como você usa os dados de clientes para personalizar comunicação e aumentar recorrência?',
    options: [
      { label: 'Segmentação avançada com dados comportamentais', points: 4 },
      { label: 'Segmentações básicas por RFM', points: 2 },
      { label: 'Envio os mesmos emails para toda a base', points: 0 },
    ],
  },
  {
    id: 'q3',
    pilar: 'Execute',
    subtitle: 'Alertas e automações',
    question: 'Você recebe avisos automáticos quando algo está fora do padrão (queda de conversão, anomalia de receita)?',
    options: [
      { label: 'Sim, alertas configurados e funcionando', points: 4 },
      { label: 'Tenho alguns alertas básicos', points: 2 },
      { label: 'Não tenho alertas automáticos', points: 0 },
    ],
  },
]

type QuizProps = {
  onComplete: (answers: QuizAnswers) => void
  initialAnswers: Partial<QuizAnswers>
}

export function Quiz({ onComplete, initialAnswers }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(initialAnswers)
  const [direction, setDirection] = useState(1)

  const question = QUESTIONS[currentIndex]
  const selectedPoints = answers[question.id]
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100
  const isLast = currentIndex === QUESTIONS.length - 1

  function selectOption(points: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: points }))
  }

  function goNext() {
    if (selectedPoints === undefined) return
    if (isLast) {
      onComplete(answers as QuizAnswers)
    } else {
      setDirection(1)
      setCurrentIndex((i) => i + 1)
    }
  }

  // Cores dos pilares Biso
  const pilarColors: Record<string, string> = {
    Conecte: '#FF0068',
    Visualize: '#FF0068',
    Analise: '#FF0068',
    Crie: '#FF0068',
    Execute: '#FF0068',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center flex-1 px-4 py-8 w-full"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      {/* Progress bar */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-xs font-medium mb-2" style={{ color: '#888' }}>
          <span>Pilar {currentIndex + 1} de {QUESTIONS.length}</span>
          <span style={{ color: '#FF0068' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar-track">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: `${((currentIndex) / QUESTIONS.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Pilares indicator */}
        <div className="flex justify-between mt-3">
          {QUESTIONS.map((q, i) => (
            <div key={q.pilar} className="flex flex-col items-center gap-1">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: i < currentIndex ? '#FF0068' : i === currentIndex ? '#FFF0F5' : '#F2F2F2',
                  border: i === currentIndex ? '2px solid #FF0068' : i < currentIndex ? 'none' : '1.5px solid #e5e7eb',
                  transition: 'all 0.3s',
                  fontSize: 11,
                }}
              >
                {i < currentIndex ? (
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 10 }}>✓</span>
                ) : (
                  <span style={{ color: i === currentIndex ? '#FF0068' : '#bbb', fontWeight: 700, fontSize: 9 }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 9,
                  fontWeight: i === currentIndex ? 700 : 500,
                  color: i === currentIndex ? '#FF0068' : i < currentIndex ? '#888' : '#ccc',
                  whiteSpace: 'nowrap',
                }}
              >
                {q.pilar}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          {/* Pilar pill */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className="pill text-xs"
              style={{
                border: `1px solid ${pilarColors[question.pilar]}`,
                color: pilarColors[question.pilar],
              }}
            >
              {question.pilar}
            </span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#aaa', fontWeight: 500 }}>
              {question.subtitle}
            </span>
          </div>

          <h2
            className="mb-6"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(17px, 3vw, 21px)',
              color: '#222',
              lineHeight: 1.45,
            }}
          >
            {question.question}
          </h2>

          <div className="flex flex-col gap-3 mb-8">
            {question.options.map((opt) => {
              const isSelected = selectedPoints === opt.points
              return (
                <button
                  key={opt.label}
                  onClick={() => selectOption(opt.points)}
                  className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3"
                  style={{
                    border: isSelected ? '2px solid #FF0068' : '1.5px solid #e5e7eb',
                    background: isSelected ? '#FFF0F5' : '#fff',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: 15,
                    color: isSelected ? '#FF0068' : '#333',
                    boxShadow: isSelected ? '0 2px 12px rgba(255,0,104,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#FF006860'
                      e.currentTarget.style.background = '#fff8fa'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.background = '#fff'
                    }
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: 24, height: 24, background: '#FF0068' }}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {selectedPoints !== undefined && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={goNext}
            className="btn-primary w-full sm:w-auto text-base"
            style={{ minWidth: 220, height: 50 }}
          >
            {isLast ? 'Ver meu Score →' : 'Próximo pilar →'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
