// Símbolos do Slot dos Bugs
export type SlotSymbol = '🐞' | '🔥' | '💾' | '🔧' | '☕' | '💀'

export interface SymbolWeight {
  symbol: SlotSymbol
  weight: number
}

// Pesos padrão dos símbolos (soma deve ser 1.0)
export const defaultWeights: SymbolWeight[] = [
  { symbol: '🐞', weight: 0.35 }, // Bug - mais comum
  { symbol: '☕', weight: 0.20 }, // Café - combustível do dev
  { symbol: '🔥', weight: 0.15 }, // Servidor Caindo
  { symbol: '💾', weight: 0.15 }, // Falta de Memória
  { symbol: '🔧', weight: 0.10 }, // Deploy - raro
  { symbol: '💀', weight: 0.05 }, // Morte/Critical - mais raro
]

// Tipos de combos possíveis
export type ComboType = 
  | 'servidor_caindo'      // 🔥🔥🔥
  | 'deploy_sexta'         // 🐞🐞🔧 (ordem exata)
  | 'kernel_panic'         // 💾💾💾
  | 'deploy_magico'        // 🔧🔧🔧
  | 'overdose_cafe'        // ☕☕☕
  | 'overdose_cafe_total'  // ☕☕☕☕☕
  | 'blue_screen_total'    // 💀💀💀
  | 'promocao_estagiario'  // 🐞+🔥+🔧 (qualquer ordem)
  | 'bugs_resolvidos'      // 🐞🐞🐞
  | 'backup_funcionou'     // 💾💾 + 🔧
  | 'pequeno_cafe'         // ☕☕
  | 'pequeno_deploy'       // 🔧🔧
  | 'pequeno_backup'       // 💾💾
  | 'quase_blue_screen'    // 💀💀
  | 'servidor_esquentando' // 🔥🔥
  | 'sem_combinacao'       // Sem combinações
  | 'neutro'               // Qualquer outra combinação

export interface ComboResult {
  type: ComboType
  message: string
  effect?: 'confetti' | 'alarm' | 'screen_shake' | 'blue_screen' | 'yellow_banner'
  severity?: 'win' | 'lose' | 'neutral' | 'epic_win' | 'epic_lose'
}

export interface GameState {
  reels: SlotSymbol[][]
  isSpinning: boolean
  balance: number
  totalSpins: number
  message: string
  lastCombo?: ComboResult
}