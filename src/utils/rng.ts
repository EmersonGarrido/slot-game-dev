import type { SlotSymbol, SymbolWeight } from '../types/slot'
import { defaultWeights } from '../types/slot'

/**
 * Gerador de números aleatórios com pesos configuráveis
 * Usa crypto.getRandomValues quando disponível para melhor aleatoriedade
 */
export class WeightedRNG {
  private weights: SymbolWeight[]
  
  constructor(weights: SymbolWeight[] = defaultWeights) {
    this.weights = weights
    this.validateWeights()
  }
  
  /**
   * Valida que a soma dos pesos é aproximadamente 1.0
   */
  private validateWeights(): void {
    const sum = this.weights.reduce((acc, w) => acc + w.weight, 0)
    if (Math.abs(sum - 1.0) > 0.01) {
      console.warn(`Soma dos pesos é ${sum}, deveria ser 1.0`)
    }
  }
  
  /**
   * Gera um número aleatório entre 0 e 1
   */
  private getRandom(): number {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1)
      crypto.getRandomValues(array)
      return array[0] / (0xffffffff + 1)
    }
    // Fallback para Math.random com aviso
    console.warn('Usando Math.random como fallback - menos seguro')
    return Math.random()
  }
  
  /**
   * Sorteia um símbolo baseado nos pesos configurados
   */
  public getSymbol(): SlotSymbol {
    const rand = this.getRandom()
    let cumulative = 0
    
    for (const { symbol, weight } of this.weights) {
      cumulative += weight
      if (rand < cumulative) {
        return symbol
      }
    }
    
    // Fallback caso haja erro de arredondamento
    return this.weights[this.weights.length - 1].symbol
  }
  
  /**
   * Gera múltiplos símbolos de uma vez
   */
  public getSymbols(count: number): SlotSymbol[] {
    return Array.from({ length: count }, () => this.getSymbol())
  }
  
  /**
   * Atualiza os pesos em runtime
   */
  public updateWeights(weights: SymbolWeight[]): void {
    this.weights = weights
    this.validateWeights()
  }
}

// Instância global do RNG
export const rng = new WeightedRNG()