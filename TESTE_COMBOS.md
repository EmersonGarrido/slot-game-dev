# Guia de Teste - Slot dos Bugs

## Como Testar os Combos

O jogo usa RNG com pesos, então alguns combos são mais raros. Para testar específicamente:

### Combos para Testar (ordem de prioridade):

1. **🔥🔥🔥 - Servidor Caindo**
   - Mensagem: "🔥 Servidor fora do ar, GG."
   - Efeito: Alarme vermelho piscando
   - Resultado: Perde tudo (balance = 0)

2. **🐞🐞🔧 - Deploy em Sexta (ORDEM EXATA nos 3 primeiros rolos)**
   - Mensagem: "🚨 Deploy em sexta-feira: você perdeu tudo!"
   - Efeito: Banner amarelo pulsante
   - Resultado: Perde tudo (balance = 0)

3. **💾💾💾 - Kernel Panic**
   - Mensagem: "💾 Kernel Panic: reinicie e tente de novo."
   - Efeito: Tela azul temporária
   - Resultado: Perde tudo (balance = 0)

4. **🔧🔧🔧 - Deploy Mágico (MAIS RARO!)**
   - Mensagem: "🔧 Deploy mágico: funcionou (milagre)!"
   - Efeito: Confetes caindo
   - Resultado: Ganha 500 créditos!

5. **🐞+🔥+🔧 - Promoção Estagiário (qualquer ordem, exceto 🐞🐞🔧)**
   - Mensagem: "Promoção relâmpago: você virou estagiário responsável pelo sistema inteiro."
   - Efeito: Banner amarelo
   - Resultado: Neutro (sem ganho/perda)

6. **Qualquer outra combinação**
   - Mensagem: "Tudo parece normal… até o próximo bug."
   - Resultado: Neutro

## Probabilidades

Com os pesos atuais:
- 🐞 Bug: 50% de chance
- 🔥 Servidor: 20% de chance  
- 💾 Memória: 20% de chance
- 🔧 Deploy: 10% de chance (mais raro!)

## Easter Eggs

- **100º giro:** Mensagem especial "Parabéns, você é oficialmente viciado!"

## Botões de Controle

- **✨ Efeitos ON/OFF**: Desliga animações intensas
- **🔊 Som ON/OFF**: Muta o jogo (preparado para sons futuros)

Ambos salvam a preferência no localStorage!

## Dica de Teste

O combo mais difícil de conseguir é o **🔧🔧🔧** (Deploy Mágico) devido ao peso de apenas 10% para o símbolo 🔧. Continue girando para vê-lo!