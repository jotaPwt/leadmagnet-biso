const WEBHOOK_URL = 'WEBHOOK_URL_PLACEHOLDER'

export type WebhookPayload = {
  nome: string
  email: string
  empresa: string
  telefone: string
  vertical: string
  plataforma: string
  faturamento: number | null
  url_loja: string
  score_total: number
  respostas: {
    q1: number
    q2: number
    q3: number
    q4: number
    q5: number
  }
  nivel: string
  timestamp: string
}

export async function sendToWebhook(payload: WebhookPayload): Promise<void> {
  if (WEBHOOK_URL === 'WEBHOOK_URL_PLACEHOLDER') return

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // silent fail — result still shown to user
  }
}
