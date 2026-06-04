import type { QuizAnswers } from './scoring'

export function generateResultHash(answers: QuizAnswers, storeUrl: string): string {
  const raw = `${answers.q1}${answers.q2}${answers.q3}${answers.q4}${answers.q5}|${storeUrl}`
  return btoa(raw).replace(/[^a-zA-Z0-9]/g, '').slice(0, 14)
}

export type PersistedResult = {
  hash: string
  score: number
  nivel: string
  respostas: QuizAnswers
  urlLoja: string
  nome: string
  faturamento: number | null
  timestamp: string
}

export function saveResult(data: PersistedResult) {
  try {
    localStorage.setItem(`biso_result_${data.hash}`, JSON.stringify(data))
  } catch {}
}

export function loadResult(hash: string): PersistedResult | null {
  try {
    const raw = localStorage.getItem(`biso_result_${hash}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function getHashFromPath(): string | null {
  const m = window.location.pathname.match(/^\/resultado\/([a-zA-Z0-9]+)$/)
  return m ? m[1] : null
}

export function pushResultUrl(hash: string) {
  window.history.pushState(null, '', `/resultado/${hash}`)
}

export function buildShareUrl(hash: string): string {
  const base = `${window.location.protocol}//${window.location.host}`
  return `${base}/resultado/${hash}`
}
