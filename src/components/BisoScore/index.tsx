import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { Landing } from './Landing'
import { Quiz } from './Quiz'
import { LoadingGate } from './LoadingGate'
import { LeadForm } from './LeadForm'
import type { LeadData } from './LeadForm'
import { Result } from './Result'
import { calculateScore } from '../../lib/scoring'
import type { QuizAnswers, ScoreResult } from '../../lib/scoring'

type Screen = 'landing' | 'quiz' | 'loading' | 'gate' | 'result'

const STORAGE_KEY = 'biso_score_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(data: object) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function BisoScore() {
  const saved = loadState()

  const [screen, setScreen] = useState<Screen>(saved?.screen ?? 'landing')
  const [storeUrl, setStoreUrl] = useState<string>(saved?.storeUrl ?? '')
  const [answers, setAnswers] = useState<QuizAnswers | null>(saved?.answers ?? null)
  const [result, setResult] = useState<ScoreResult | null>(saved?.result ?? null)
  const [leadName, setLeadName] = useState<string>(saved?.leadName ?? '')

  function goToQuiz(url: string) {
    setStoreUrl(url)
    saveState({ screen: 'quiz', storeUrl: url })
    setScreen('quiz')
  }

  function goToLoading(a: QuizAnswers) {
    setAnswers(a)
    saveState({ screen: 'loading', storeUrl, answers: a })
    setScreen('loading')
  }

  const goToGate = useCallback(() => {
    saveState({ screen: 'gate', storeUrl, answers })
    setScreen('gate')
  }, [storeUrl, answers])

  function goToResult(lead: LeadData) {
    const computed = calculateScore(answers!)
    setResult(computed)
    setLeadName(lead.nome)
    saveState({ screen: 'result', storeUrl, answers, result: computed, leadName: lead.nome })
    setScreen('result')
  }

  function restart() {
    clearState()
    setScreen('landing')
    setStoreUrl('')
    setAnswers(null)
    setResult(null)
    setLeadName('')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F8F8F8', fontFamily: 'Montserrat, sans-serif' }}
    >
      <Header />

      <main className="flex flex-col flex-1 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <Landing key="landing" onStart={goToQuiz} initialUrl={storeUrl} />
          )}
          {screen === 'quiz' && (
            <Quiz
              key="quiz"
              onComplete={goToLoading}
              initialAnswers={answers ?? {}}
            />
          )}
          {screen === 'loading' && (
            <LoadingGate key="loading" onComplete={goToGate} />
          )}
          {screen === 'gate' && answers && (
            <LeadForm
              key="gate"
              storeUrl={storeUrl}
              answers={answers}
              scoreTotal={calculateScore(answers).total}
              nivel={calculateScore(answers).level}
              onSubmit={goToResult}
            />
          )}
          {screen === 'result' && result && (
            <Result
              key="result"
              result={result}
              leadName={leadName}
              onRestart={restart}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
