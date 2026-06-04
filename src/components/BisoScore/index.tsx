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
import {
  generateResultHash,
  saveResult,
  loadResult,
  getHashFromPath,
  pushResultUrl,
  type PersistedResult,
} from '../../lib/resultHash'

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

// On mount: check if URL is /resultado/{hash} → load directly
function tryLoadFromUrl(): { screen: Screen; result: ScoreResult; leadName: string; storeUrl: string; answers: QuizAnswers; resultHash: string; faturamento: number | null } | null {
  const hash = getHashFromPath()
  if (!hash) return null
  const persisted = loadResult(hash)
  if (!persisted) return null
  const result = calculateScore(persisted.respostas)
  return {
    screen: 'result',
    result,
    leadName: persisted.nome,
    storeUrl: persisted.urlLoja,
    answers: persisted.respostas,
    resultHash: persisted.hash,
    faturamento: persisted.faturamento,
  }
}

export function BisoScore() {
  const fromUrl = tryLoadFromUrl()
  const saved = fromUrl ?? loadState()

  const [screen, setScreen] = useState<Screen>(saved?.screen ?? 'landing')
  const [storeUrl, setStoreUrl] = useState<string>(saved?.storeUrl ?? '')
  const [answers, setAnswers] = useState<QuizAnswers | null>(saved?.answers ?? null)
  const [result, setResult] = useState<ScoreResult | null>(saved?.result ?? null)
  const [leadName, setLeadName] = useState<string>(saved?.leadName ?? '')
  const [resultHash, setResultHash] = useState<string>(saved?.resultHash ?? '')
  const [faturamento, setFaturamento] = useState<number | null>(saved?.faturamento ?? null)

  function goToQuiz(url: string) {
    setStoreUrl(url)
    saveState({ screen: 'quiz', storeUrl: url })
    setScreen('quiz')
    // Reset URL back to / when starting fresh
    window.history.replaceState(null, '', '/')
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
    const hash = generateResultHash(answers!, storeUrl)

    const persisted: PersistedResult = {
      hash,
      score: computed.total,
      nivel: computed.level,
      respostas: answers!,
      urlLoja: storeUrl,
      nome: lead.nome,
      faturamento: lead.faturamento,
      timestamp: new Date().toISOString(),
    }
    saveResult(persisted)
    pushResultUrl(hash)

    setResult(computed)
    setLeadName(lead.nome)
    setResultHash(hash)
    setFaturamento(lead.faturamento)
    saveState({
      screen: 'result',
      storeUrl,
      answers,
      result: computed,
      leadName: lead.nome,
      resultHash: hash,
      faturamento: lead.faturamento,
    })
    setScreen('result')
  }

  function restart() {
    clearState()
    window.history.replaceState(null, '', '/')
    setScreen('landing')
    setStoreUrl('')
    setAnswers(null)
    setResult(null)
    setLeadName('')
    setResultHash('')
    setFaturamento(null)
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
              resultHash={resultHash}
              faturamento={faturamento}
              onRestart={restart}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
