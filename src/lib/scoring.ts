export type QuizAnswers = {
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
}

export type ScoreLevel = 'Iniciante' | 'Em Desenvolvimento' | 'Intermediário' | 'Avançado' | 'Elite'

export type ScoreResult = {
  total: number
  level: ScoreLevel
  levelColor: string
  levelEmoji: string
  diagnosis: string
  revenueEstimate: string
  revenuePercent: number
  dimensions: DimensionResult[]
}

export type DimensionResult = {
  key: string
  name: string
  icon: string
  score: number
  maxScore: number
  insight: string
  hasOpportunity: boolean
  actionPlan: string[]
}

export function calculateScore(answers: QuizAnswers): ScoreResult {
  const rawTotal = answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5
  const total = rawTotal * 5

  const level = getLevel(total)
  const { levelColor, levelEmoji, diagnosis } = getLevelMeta(level)
  const { revenueEstimate, revenuePercent } = getRevenueEstimate(total)

  const dimensions: DimensionResult[] = [
    {
      key: 'q1',
      name: 'Unificação de Dados',
      icon: '🗄️',
      score: answers.q1,
      maxScore: 4,
      insight: getDimensionInsight('q1', answers.q1),
      hasOpportunity: answers.q1 < 4,
      actionPlan: getActionPlan('q1', answers.q1),
    },
    {
      key: 'q2',
      name: 'Monitoramento em Tempo Real',
      icon: '📊',
      score: answers.q2,
      maxScore: 4,
      insight: getDimensionInsight('q2', answers.q2),
      hasOpportunity: answers.q2 < 4,
      actionPlan: getActionPlan('q2', answers.q2),
    },
    {
      key: 'q3',
      name: 'Alertas Automáticos',
      icon: '🔔',
      score: answers.q3,
      maxScore: 4,
      insight: getDimensionInsight('q3', answers.q3),
      hasOpportunity: answers.q3 < 4,
      actionPlan: getActionPlan('q3', answers.q3),
    },
    {
      key: 'q4',
      name: 'Inteligência de CRM',
      icon: '👥',
      score: answers.q4,
      maxScore: 4,
      insight: getDimensionInsight('q4', answers.q4),
      hasOpportunity: answers.q4 < 4,
      actionPlan: getActionPlan('q4', answers.q4),
    },
    {
      key: 'q5',
      name: 'Capacidade Analítica',
      icon: '🤖',
      score: answers.q5,
      maxScore: 4,
      insight: getDimensionInsight('q5', answers.q5),
      hasOpportunity: answers.q5 < 4,
      actionPlan: getActionPlan('q5', answers.q5),
    },
  ]

  return { total, level, levelColor, levelEmoji, diagnosis, revenueEstimate, revenuePercent, dimensions }
}

export function getRevenueAmount(score: number, faturamento: number): number {
  let pct: number
  if (score > 80) pct = 0.015
  else if (score > 65) pct = 0.04
  else if (score > 45) pct = 0.08
  else if (score > 25) pct = 0.12
  else pct = 0.15
  return Math.round(faturamento * pct)
}

function getLevel(total: number): ScoreLevel {
  if (total <= 25) return 'Iniciante'
  if (total <= 45) return 'Em Desenvolvimento'
  if (total <= 65) return 'Intermediário'
  if (total <= 80) return 'Avançado'
  return 'Elite'
}

function getLevelMeta(level: ScoreLevel) {
  const map: Record<ScoreLevel, { levelColor: string; levelEmoji: string; diagnosis: string }> = {
    Iniciante: {
      levelColor: '#FF4444',
      levelEmoji: '🔴',
      diagnosis: 'Sua operação ainda depende de intuição. Existe muito espaço para crescer com dados.',
    },
    'Em Desenvolvimento': {
      levelColor: '#FF8C00',
      levelEmoji: '🟠',
      diagnosis: 'Você já usa alguns dados, mas as decisões ainda são mais reativas do que estratégicas.',
    },
    Intermediário: {
      levelColor: '#F5A623',
      levelEmoji: '🟡',
      diagnosis: 'Boa base! Você monitora sua operação, mas ainda perde insights valiosos por falta de integração.',
    },
    Avançado: {
      levelColor: '#00B37E',
      levelEmoji: '🟢',
      diagnosis: 'Operação sólida em dados. Você toma decisões embasadas, mas pode escalar ainda mais com automação.',
    },
    Elite: {
      levelColor: '#FF0068',
      levelEmoji: '🌟',
      diagnosis: 'Parabéns! Você está entre os 5% mais maduros em dados no varejo digital brasileiro.',
    },
  }
  return map[level]
}

function getRevenueEstimate(total: number): { revenueEstimate: string; revenuePercent: number } {
  if (total < 40) return { revenueEstimate: '~15% do seu faturamento mensal', revenuePercent: 15 }
  if (total <= 65) return { revenueEstimate: '~8% do seu faturamento mensal', revenuePercent: 8 }
  if (total <= 80) return { revenueEstimate: '~4% do seu faturamento mensal', revenuePercent: 4 }
  return { revenueEstimate: '~1,5% do seu faturamento mensal', revenuePercent: 1.5 }
}

function getDimensionInsight(key: string, score: number): string {
  const insights: Record<string, Record<number, string>> = {
    q1: {
      0: 'Dados espalhados em múltiplas ferramentas geram pontos cegos e decisões lentas. Centralização é o primeiro passo.',
      2: 'Você tem alguma integração, mas silos de dados ainda custam tempo e precisão nas análises.',
      4: 'Excelente! Dados unificados permitem visão 360° da sua operação.',
    },
    q2: {
      0: 'Reagir a problemas quando surgem é caro. Monitoramento contínuo pode prevenir crises silenciosas.',
      2: 'Reuniões semanais podem ser tarde demais. Oportunidades e problemas acontecem em horas, não semanas.',
      4: 'Perfeito! Visibilidade diária com alertas é o padrão das operações de alta performance.',
    },
    q3: {
      0: 'Sem alertas automáticos, problemas como queda de conversão podem passar dias sem atenção.',
      2: 'Alguns alertas ajudam, mas uma cobertura completa protege toda a receita da operação.',
      4: 'Sua operação está protegida. Alertas inteligentes são o sistema imunológico do e-commerce.',
    },
    q4: {
      0: 'Enviar a mesma mensagem para toda a base é um dos maiores desperdícios de receita no varejo.',
      2: 'RFM é um bom começo, mas comportamento de navegação e compra permite segmentações muito mais rentáveis.',
      4: 'Segmentação avançada é um dos maiores diferenciais competitivos no varejo digital. Continue assim!',
    },
    q5: {
      0: 'Esperar relatórios mensais significa tomar decisões com dados velhos. Agilidade analítica é vantagem competitiva.',
      2: 'Planilhas manuais escalam mal e introduzem erros. Cada hora nisso é uma hora longe de estratégia.',
      4: 'Acesso instantâneo a dados em linguagem natural é o futuro — e você já está lá.',
    },
  }
  return insights[key][score] ?? insights[key][0]
}

function getActionPlan(key: string, score: number): string[] {
  const plans: Record<string, Record<number, string[]>> = {
    q1: {
      0: [
        'Mapeie todas as fontes de dados da sua operação (ERP, plataforma, ads, CRM)',
        'Escolha uma plataforma central para consolidar os dados — evite planilhas',
        'Comece pela integração entre sua loja online e os dados de mídia paga',
      ],
      2: [
        'Identifique quais fontes ainda estão desconectadas e qual impacto têm',
        'Priorize a integração dos canais que mais geram receita',
        'Defina um único "lugar da verdade" para métricas de negócio',
      ],
      4: [],
    },
    q2: {
      0: [
        'Defina os 5 KPIs mais críticos da sua operação para monitorar diariamente',
        'Configure um dashboard simples com atualização automática',
        'Estabeleça uma rotina diária de 10 min para revisão de métricas',
      ],
      2: [
        'Migre a revisão de métricas de semanal para diária — use alertas por email/WhatsApp',
        'Identifique quais anomalias poderiam ser detectadas antes das reuniões',
        'Automatize o envio do resumo diário de KPIs para o time',
      ],
      4: [],
    },
    q3: {
      0: [
        'Implemente alertas de queda de conversão (threshold: -20% vs. média da semana)',
        'Configure alerta de anomalia de receita para detectar problemas em tempo real',
        'Crie alertas de ruptura de estoque nos SKUs mais vendidos',
      ],
      2: [
        'Expanda os alertas para cobrir toda a jornada do cliente, não só vendas',
        'Adicione alertas de performance de mídia paga (ROAS abaixo do target)',
        'Configure alertas de comportamento anômalo de CRM (queda em recompra)',
      ],
      4: [],
    },
    q4: {
      0: [
        'Segmente sua base minimamente em 3 grupos: novos, ativos e inativos',
        'Crie uma régua básica de reativação para clientes sem compra há 90 dias',
        'Personalize pelo menos a linha de assunto com o nome do cliente',
      ],
      2: [
        'Avance para segmentação comportamental: o que cada segmento browseou mas não comprou',
        'Implemente triggers baseados em comportamento de navegação, não só em compras',
        'Crie audiências lookalike baseadas no seu top 10% de clientes por LTV',
      ],
      4: [],
    },
    q5: {
      0: [
        'Elimine a dependência de relatórios mensais — dados mensais são dados velhos',
        'Capacite seu time com acesso direto a dashboards operacionais',
        'Defina quais decisões precisam de dados e qual é a frequência necessária',
      ],
      2: [
        'Calcule quanto tempo seu time gasta por semana extraindo e formatando planilhas',
        'Automatize as extrações mais recorrentes para liberar tempo analítico',
        'Invista em ferramentas que permitam perguntar aos dados em linguagem natural',
      ],
      4: [],
    },
  }
  return plans[key]?.[score] ?? plans[key]?.[0] ?? []
}
