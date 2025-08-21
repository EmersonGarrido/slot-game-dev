import type { SlotSymbol, ComboResult } from '../types/slot'

/**
 * Avalia o resultado dos rolos e retorna o combo correspondente
 * Sistema de combos mais justo com mais vitórias
 */
export function evaluateResult(reels: SlotSymbol[][]): ComboResult {
  // Pega apenas a linha do meio (índice 1) de cada rolo
  const middleRow = reels.map(reel => reel[1])
  
  // MEGA VITÓRIAS (Epic Win)
  
  // 🔧🔧🔧 - Deploy mágico
  if (middleRow.filter(s => s === '🔧').length >= 3) {
    return {
      type: 'deploy_magico',
      message: '🔧🎉 DEPLOY MÁGICO! Funcionou de primeira!',
      effect: 'confetti',
      severity: 'epic_win'
    }
  }
  
  // ☕☕☕☕☕ - Overdose de café TOTAL
  if (middleRow.every(s => s === '☕')) {
    return {
      type: 'overdose_cafe_total',
      message: '☕⚡ OVERDOSE MÁXIMA! Você está no modo DEUS!',
      effect: 'screen_shake',
      severity: 'epic_win'
    }
  }

  // VITÓRIAS GRANDES (Win)
  
  // ☕☕☕ - Overdose de café
  if (middleRow.filter(s => s === '☕').length >= 3) {
    return {
      type: 'overdose_cafe',
      message: '☕ Overdose de cafeína: +100 produtividade!',
      effect: 'screen_shake',
      severity: 'win'
    }
  }

  // 🐞🐞🐞 - Bugs se resolveram sozinhos!
  if (middleRow.filter(s => s === '🐞').length >= 3) {
    return {
      type: 'bugs_resolvidos',
      message: '🐞✨ Os bugs se resolveram sozinhos! Milagre!',
      effect: 'confetti',
      severity: 'win'
    }
  }

  // 💾💾 + 🔧 - Backup funcionou!
  if (middleRow.filter(s => s === '💾').length >= 2 && middleRow.includes('🔧')) {
    return {
      type: 'backup_funcionou',
      message: '💾 Backup salvou o dia! Ufa!',
      effect: 'confetti',
      severity: 'win'
    }
  }

  // PEQUENAS VITÓRIAS (Small Win)
  
  // Dois símbolos iguais
  const symbolCounts: Record<string, number> = {}
  middleRow.forEach(s => {
    symbolCounts[s] = (symbolCounts[s] || 0) + 1
  })
  
  const maxCount = Math.max(...Object.values(symbolCounts))
  const dominantSymbol = Object.keys(symbolCounts).find(k => symbolCounts[k] === maxCount)
  
  if (maxCount === 2) {
    switch(dominantSymbol) {
      case '☕':
        return {
          type: 'pequeno_cafe',
          message: '☕ Cafézinho básico, melhor que nada!',
          severity: 'win'
        }
      case '🔧':
        return {
          type: 'pequeno_deploy',
          message: '🔧 Deploy parcial, quase lá!',
          severity: 'win'
        }
      case '💾':
        return {
          type: 'pequeno_backup',
          message: '💾 Backup parcial, ainda vale!',
          severity: 'win'
        }
    }
  }

  // GRANDES DERROTAS (Epic Lose)
  
  // 💀💀💀 - Blue Screen Total
  if (middleRow.filter(s => s === '💀').length >= 3) {
    return {
      type: 'blue_screen_total',
      message: '💀 BLUE SCREEN OF DEATH!',
      effect: 'blue_screen',
      severity: 'epic_lose'
    }
  }
  
  // 🔥🔥🔥 - Servidor caindo
  if (middleRow.filter(s => s === '🔥').length >= 3) {
    return {
      type: 'servidor_caindo',
      message: '🔥 Servidor pegando fogo! ALERTA!',
      effect: 'alarm',
      severity: 'epic_lose'
    }
  }

  // DERROTAS NORMAIS (Lose)
  
  // 🐞🐞🔧 (ordem exata) - Deploy em sexta
  if (middleRow[0] === '🐞' && middleRow[1] === '🐞' && middleRow[2] === '🔧') {
    return {
      type: 'deploy_sexta',
      message: '🚨 Deploy em sexta-feira deu ruim!',
      effect: 'yellow_banner',
      severity: 'lose'
    }
  }
  
  // 💀💀 - Quase blue screen
  if (middleRow.filter(s => s === '💀').length === 2) {
    return {
      type: 'quase_blue_screen',
      message: '💀 Quase um blue screen... cuidado!',
      severity: 'lose'
    }
  }

  // 🔥🔥 - Servidor esquentando
  if (middleRow.filter(s => s === '🔥').length === 2) {
    return {
      type: 'servidor_esquentando',
      message: '🔥 Servidor esquentando... vai dar ruim!',
      severity: 'lose'
    }
  }
  
  // PERDEU - Sem combinações
  return {
    type: 'sem_combinacao',
    message: 'Nenhuma combinação... perdeu!',
    severity: 'lose'
  }
}

/**
 * Calcula o payout baseado no resultado
 */
export function calculatePayout(result: ComboResult, bet: number): number {
  switch (result.severity) {
    case 'epic_win':
      return bet * 50 // 50x a aposta!
    case 'win':
      // Vitórias menores baseadas no tipo
      if (result.type === 'overdose_cafe' || result.type === 'bugs_resolvidos') {
        return bet * 10 // 10x a aposta
      } else if (result.type === 'backup_funcionou') {
        return bet * 7 // 7x a aposta
      } else {
        return bet * 3 // 3x para vitórias pequenas
      }
    case 'epic_lose':
      return 0 // Perde a aposta (removido o dobro, muito punitivo)
    case 'lose':
      return 0 // Perde a aposta
    case 'neutral':
    default:
      return 0 // Perde a aposta (não devolve mais metade)
  }
}

/**
 * Verifica se há alguma vitória (para compatibilidade com código existente)
 */
export function checkWin(symbols: SlotSymbol[]): boolean {
  const result = evaluateResult([symbols, symbols, symbols, symbols, symbols])
  return result.severity === 'win' || result.severity === 'epic_win'
}