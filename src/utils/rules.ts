import type { SlotSymbol, ComboResult } from '../types/slot'

/**
 * Avalia o resultado dos rolos e retorna o combo correspondente
 * Ordem de prioridade conforme contexto.md
 */
export function evaluateResult(reels: SlotSymbol[][]): ComboResult {
  // Pega apenas a linha do meio (índice 1) de cada rolo
  const middleRow = reels.map(reel => reel[1])
  
  // Prioridade 1: 🔥🔥🔥 - Servidor caindo
  if (middleRow.every(s => s === '🔥')) {
    return {
      type: 'servidor_caindo',
      message: '🔥 Servidor fora do ar, GG.',
      effect: 'alarm',
      severity: 'epic_lose'
    }
  }
  
  // Prioridade 2: 🐞🐞🔧 (ordem exata) - Deploy em sexta
  if (middleRow[0] === '🐞' && middleRow[1] === '🐞' && middleRow[2] === '🔧') {
    return {
      type: 'deploy_sexta',
      message: '🚨 Deploy em sexta-feira: você perdeu tudo!',
      effect: 'yellow_banner',
      severity: 'lose'
    }
  }
  
  // Prioridade 3: 💾💾💾 - Kernel Panic
  if (middleRow.every(s => s === '💾')) {
    return {
      type: 'kernel_panic',
      message: '💾 Kernel Panic: reinicie e tente de novo.',
      effect: 'blue_screen',
      severity: 'lose'
    }
  }
  
  // Prioridade 4: 🔧🔧🔧 - Deploy mágico
  if (middleRow.every(s => s === '🔧')) {
    return {
      type: 'deploy_magico',
      message: '🔧 Deploy mágico: funcionou (milagre)!',
      effect: 'confetti',
      severity: 'epic_win'
    }
  }
  
  // Prioridade 5: ☕☕☕ - Overdose de café
  if (middleRow.every(s => s === '☕')) {
    return {
      type: 'overdose_cafe',
      message: '☕ Overdose de cafeína: +100 produtividade (mas -100 saúde)!',
      effect: 'screen_shake',
      severity: 'win'
    }
  }
  
  // Prioridade 6: 💀💀💀 - Blue Screen Total
  if (middleRow.every(s => s === '💀')) {
    return {
      type: 'blue_screen_total',
      message: '💀 BLUE SCREEN OF DEATH: Formatar tudo e começar do zero!',
      effect: 'blue_screen',
      severity: 'epic_lose'
    }
  }
  
  // Prioridade 7: 🐞+🔥+🔧 (qualquer ordem, exceto a regra 2)
  const hasAllThree = 
    middleRow.slice(0, 3).includes('🐞') &&
    middleRow.slice(0, 3).includes('🔥') &&
    middleRow.slice(0, 3).includes('🔧')
  
  // Verifica se não é a ordem exata da regra 2
  const isNotDeploySexta = !(middleRow[0] === '🐞' && middleRow[1] === '🐞' && middleRow[2] === '🔧')
  
  if (hasAllThree && isNotDeploySexta) {
    return {
      type: 'promocao_estagiario',
      message: 'Promoção relâmpago: você virou estagiário responsável pelo sistema inteiro.',
      effect: 'yellow_banner',
      severity: 'neutral'
    }
  }
  
  // Prioridade 8: Resultado neutro
  return {
    type: 'neutro',
    message: 'Tudo parece normal… até o próximo bug.',
    severity: 'neutral'
  }
}

/**
 * Verifica se há alguma vitória (para compatibilidade com código existente)
 */
export function checkWin(symbols: SlotSymbol[]): boolean {
  const result = evaluateResult([symbols, symbols, symbols])
  return result.severity === 'win' || result.severity === 'epic_win'
}

/**
 * Calcula o payout baseado no resultado (para compatibilidade)
 */
export function calculatePayout(symbols: SlotSymbol[], bet: number): number {
  const result = evaluateResult([symbols, symbols, symbols])
  
  switch (result.type) {
    case 'deploy_magico':
      return bet * 50 // Mega prêmio!
    case 'servidor_caindo':
    case 'deploy_sexta':
    case 'kernel_panic':
      return 0 // Perdeu tudo
    default:
      return 0 // Neutro
  }
}