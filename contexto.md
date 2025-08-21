# Slot dos Bugs - Documento de Contexto

## 1. Visão Geral

**Nome do jogo:** Slot dos Bugs

**Pitch:** Uma slot machine de zoeira para devs, com símbolos de bugs e caos de produção, pensada para lives com hype.

**Público-alvo:** Profissionais da área de tecnologia (desenvolvedores, DevOps, QA, produto).

**Plataforma:** Navegador web (desktop e mobile).

**Metas principais:**
- Diversão em lives de tecnologia
- Alta reatividade e engajamento
- Fácil de entender e jogar em segundos
- Gerar momentos memoráveis de "caos controlado"

## 2. Símbolos do Slot

| Nome | Emoji | Peso Padrão | Descrição |
|------|-------|-------------|-----------|
| Bug | 🐞 | 0.50 | O clássico bug em produção |
| Servidor Caindo | 🔥 | 0.20 | Quando tudo pega fogo |
| Falta de Memória | 💾 | 0.20 | OutOfMemoryException |
| Deploy | 🔧 | 0.10 | Deploy salvando ou destruindo tudo |

**Nota sobre RNG:** O gerador de números aleatórios é intencionalmente enviesado para aumentar a zoeira, favorecendo bugs e situações caóticas. Isso é uma feature, não um bug!

## 3. Combos & Regras de Resultado

Tabela de regras ordenada por prioridade de avaliação (do mais específico para o genérico):

| Prioridade | Combinação | Mensagem | Efeito | Raridade |
|------------|------------|----------|--------|----------|
| 1 | 🔥 + 🔥 + 🔥 | "🔥 Servidor fora do ar, GG." | Derrota forte; toca alarme; overlay vermelho | Rara |
| 2 | 🐞 + 🐞 + 🔧 (ordem exata) | "🚨 Deploy em sexta-feira: você perdeu tudo!" | Perde tudo; overlay amarelo; som de sirene | Muito rara |
| 3 | 💾 + 💾 + 💾 | "💾 Kernel Panic: reinicie e tente de novo." | Reset visual do slot; tela azul temporária | Rara |
| 4 | 🔧 + 🔧 + 🔧 | "🔧 Deploy mágico: funcionou (milagre)!" | Vitória rara; confetes; fanfarra | Extremamente rara |
| 5 | 🐞 + 🔥 + 🔧 (qualquer ordem) | "Promoção relâmpago: você virou estagiário responsável pelo sistema inteiro." | Mensagem cômica; sem payout | Comum |
| 6 | Qualquer outra | "Tudo parece normal… até o próximo bug." | Resultado neutro | Mais comum |

**Observações importantes:**
- Regra 2 exige ordem **exata** (Bug, Bug, Deploy nos rolos 1-2-3) para manter a piada da "sexta-feira"
- Regra 5 aceita qualquer permutação dos três símbolos, exceto a combinação da regra 2 que tem prioridade maior
- A avaliação sempre segue a ordem de prioridade da tabela

## 4. Estados & Fluxos

```
[Idle] 
   ↓ (click "Rodar")
[Spinning] → animação por rolo (~0.9-1.2s com easing)
   ↓
[Resolving] → aplicação das regras de combo
   ↓
[Result] → renderização UI/sons/efeitos
   ↓
[Idle]
```

**Regras de estado:**
- Cancelamento de spin não é permitido após início
- Durante `Spinning`, interface fica bloqueada exceto botão de emergência "Reduzir efeitos"
- Se multiplayer ativo, `Spinning` pode ter lock global por sala

## 5. UI/UX (Single Player)

### Layout Principal
- **Área central:** 3 rolos de símbolos
- **Botão principal:** "RODAR" (grande, destaque visual)
- **Painel de mensagens:** Exibe resultado e piadas
- **Área de efeitos:** Overlay para confetes/alarmes
- **Contadores:** Giros totais, sequência atual
- **Moedas fictícias:** Sistema de pontos opcional

### Feedbacks Visuais e Sonoros

| Evento | Visual | Sonoro |
|--------|--------|--------|
| Vitória rara | Confetes dourados | Fanfarra curta |
| Derrota forte (🔥🔥🔥) | Screen shake + overlay vermelho | Sirene de alarme |
| Kernel Panic | Tela azul temporária | Som de crash |
| Deploy mágico | Partículas verdes | Fanfarra épica |
| Mensagem cômica | Banner amarelo pulsante | Beep cômico |

### Acessibilidade
- **Botão "Reduzir efeitos":** Desliga animações intensas e sons altos
- **Labels ARIA:** Em todos os controles e resultados
- **Contraste:** Mínimo AA (4.5:1) nas cores de alertas
- **Modo daltonismo:** Símbolos com formas distintivas além das cores

## 6. Configuração & Balanceamento

### Parâmetros em `config.json`

```json
{
  "symbols": {
    "weights": {
      "bug": 0.50,
      "fire": 0.20,
      "memory": 0.20,
      "deploy": 0.10
    }
  },
  "animations": {
    "spinDuration": 1000,
    "reelDelay": 200,
    "resultDisplayTime": 3000
  },
  "audio": {
    "masterVolume": 0.7,
    "sfxEnabled": true
  },
  "debug": {
    "seed": null,
    "logRNG": false
  }
}
```

### Políticas
- **Fairness:** Não é jogo de aposta real - sem dinheiro envolvido, foco em humor
- **Modo "Live Show":** Aumenta chance de eventos visuais em 2x sem alterar payouts reais
- **Modo Debug:** Seeds fixas para testes e demonstrações

## 7. Telemetria (Opcional)

### Eventos Mínimos
| Evento | Dados | Propósito |
|--------|-------|-----------|
| `spin_started` | timestamp, userId | Rastrear engajamento |
| `spin_ended` | result, combo_type | Análise de distribuição |
| `combo_triggered` | combo_id, message | Popularidade de combos |
| `rng_seed_used` | seed (se debug) | Reprodutibilidade |

### Métricas Principais
- Taxa de ocorrência de cada combo
- Tempo médio entre rounds
- % de uso do botão "Reduzir efeitos"
- Pico de jogadores simultâneos (multiplayer)

## 8. Multiplayer (Opcional - Para Hype em Live)

### Abordagem Padrão: Feed Assíncrono Leve

**Conceito:** Cada jogador gira localmente, mas resultados são compartilhados em feed comum.

### Eventos de Rede

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `room_join` | {userId, roomId} | Entrada na sala |
| `spin_request` | {userId, timestamp} | Solicitação de giro |
| `spin_result` | {userId, symbols, combo, message} | Resultado do giro |
| `room_message` | {userId, text, type} | Mensagem no chat |
| `leaderboard_update` | {rankings} | Atualização do ranking |

### Anti-Cheat Básico
- Spins validados no servidor
- Servidor sorteia, cliente apenas renderiza
- Rate limiting: máximo 1 spin a cada 2 segundos

### MVP Multiplayer
- Feed compartilhado de resultados
- Contador de "catástrofes causadas" por jogador
- Chat simples com emotes predefinidos

## 9. Áudio & Efeitos

### Biblioteca de Sons

| Som | Evento | Duração | Fonte Sugerida |
|-----|--------|---------|----------------|
| spin.mp3 | Início do giro | 0.5s | Freesound CC0 |
| stop.mp3 | Parada de rolo | 0.2s | Zapsplat |
| alarm.mp3 | Servidor caindo | 2s | OpenGameArt |
| fanfare.mp3 | Deploy mágico | 3s | Freesound CC0 |
| crash.mp3 | Kernel panic | 1s | Própria |
| beep.mp3 | Mensagem cômica | 0.3s | Própria |

**Configurações:**
- Opção "mute" persistente em localStorage
- Volume ajustável de 0-100%
- Preload de sons críticos no início

## 10. Assets

### Estratégia de Assets

1. **Fallback primário:** Emojis nativos (lançamento rápido garantido)
2. **Upgrade opcional:** Pacote Kenney Game Icons (licença CC0)
3. **Custom futuro:** Arte própria para eventos especiais

### Licenças
- Todos os assets devem ser CC0, MIT ou criação própria
- Evitar marcas registradas
- Documentar origem de cada asset em `assets/LICENSE.md`

## 11. Arquitetura & Tech Stack

### Frontend
- **Principal:** React 18+ com TypeScript
- **Estado:** Zustand para gerenciamento simples
- **Styling:** Tailwind CSS + Framer Motion para animações
- **Build:** Vite

### Backend (se multiplayer)
- **Servidor:** Node.js + Socket.IO
- **Database:** Supabase (realtime + persistência)
- **Cache:** Redis para leaderboards

### Infraestrutura
- **Frontend:** Vercel ou Netlify
- **Backend:** Render.com ou Fly.io
- **CDN:** Cloudflare para assets

### RNG
```typescript
// Prioridade de implementação
1. crypto.getRandomValues() // Mais seguro
2. Math.random() // Fallback com aviso
```

## 12. Estrutura de Pastas

```
/
├── docs/
│   └── contexto.md
├── src/
│   ├── config/
│   │   └── config.json
│   ├── core/
│   │   ├── rng.ts
│   │   ├── rules.ts
│   │   └── symbols.ts
│   ├── ui/
│   │   ├── components/
│   │   │   ├── SlotReel.tsx
│   │   │   ├── SpinButton.tsx
│   │   │   └── ResultBanner.tsx
│   │   └── pages/
│   │       └── Game.tsx
│   └── multiplayer/ (opcional)
│       ├── client.ts
│       └── events.ts
├── public/
│   └── sfx/
│       └── [sons CC0]
└── tests/
    ├── unit/
    └── e2e/
```

## 13. Algoritmo de Regras

### Pseudocódigo

```
function avaliarResultado(simbolos: Array[3]):
    // 1. Sortear 3 símbolos com base nos pesos
    
    // 2. Verificar combos na ordem de prioridade
    if (simbolos == [🔥, 🔥, 🔥]):
        return {type: "servidor_caindo", ...}
    
    if (simbolos == [🐞, 🐞, 🔧] && ordem_exata):
        return {type: "deploy_sexta", ...}
    
    if (simbolos == [💾, 💾, 💾]):
        return {type: "kernel_panic", ...}
    
    if (simbolos == [🔧, 🔧, 🔧]):
        return {type: "deploy_magico", ...}
    
    if (tem_permutacao(simbolos, [🐞, 🔥, 🔧])):
        return {type: "promocao_estagiario", ...}
    
    return {type: "neutro", ...}
```

### Tabela de Prioridade de Match

| Ordem | Tipo de Match | Complexidade |
|-------|---------------|--------------|
| 1 | Exato (3 iguais) | O(1) |
| 2 | Sequência específica | O(1) |
| 3 | Permutação | O(n!) |
| 4 | Default | O(1) |

## 14. Testes & Cenários

### Testes Unitários
- Validação de todas as regras de combo
- Distribuição estatística do RNG (1000+ iterações)
- Ordem de prioridade das regras
- Serialização/deserialização de config

### Testes de UI
- Renderização correta pós-resultado
- Animações em diferentes frame rates
- Responsividade mobile
- Acessibilidade (screen readers)

### Cenários Edge

| Cenário | Teste | Comportamento Esperado |
|---------|-------|------------------------|
| RNG extremo | Mesmo símbolo 1000x | Distribuição deve convergir para pesos |
| Latência multiplayer | Delay 1s+ | Graceful degradation, feedback local |
| Mobile low-end | <30 FPS | Auto-desliga partículas |
| Spam de cliques | 10 cliques/s | Apenas primeiro é processado |
| localStorage cheio | Sem espaço | Funciona sem persistência |

## 15. Critérios de Aceite (MVP)

### Funcionalidades Core
- [x] Botão "RODAR" ativa animação e bloqueia múltiplos cliques
- [x] Regras de combo aplicadas corretamente (incluindo ordem Bug,Bug,Deploy)
- [x] Mensagens cômicas exibidas por combo
- [x] Toggle "Reduzir efeitos" funcional e persistente
- [x] Toggle "Mute" funcional e persistente
- [x] Pesos de símbolos lidos de config.json

### Funcionalidades Opcionais
- [ ] Feed de resultados em sala multiplayer
- [ ] Mínimo 2 jogadores conectados simultaneamente
- [ ] Leaderboard básico de "catástrofes"

### Performance
- Tempo de carregamento inicial < 3s
- Animação de spin fluida (60 FPS em desktop)
- Resposta ao clique < 100ms

## 16. Roteiros de Mensagens (UX Writing)

### Mensagens por Estado

| Estado | Mensagem |
|--------|----------|
| Carregando | "Compilando bugs..." |
| Idle | "Pronto para o caos?" |
| Girando | "Deployando em prod..." |
| Processando | "Calculando danos..." |
| Erro de rede | "A internet caiu (como sempre)" |

### Mensagens de Combo
*(Já detalhadas na seção 3)*

### Easter Eggs
- 100º giro: "Parabéns, você é oficialmente viciado!"
- 3 crashes seguidos: "Talvez seja hora de um café?"
- Meia-noite: "Deploy de madrugada detectado!"

## 17. Roadmap de Evolução

### V1.0 - MVP (2 semanas)
- [x] Single player funcional
- [x] UI responsiva
- [x] Todas as regras implementadas
- [x] Efeitos visuais e sonoros
- [x] Configuração via JSON

### V1.1 - Polish (1 semana)
- [ ] Modo Live Show (efeitos 2x)
- [ ] Feed local de histórico
- [ ] Melhorias de performance
- [ ] PWA para mobile

### V2.0 - Multiplayer (1 mês)
- [ ] Salas síncronas
- [ ] Ranking por sessão
- [ ] Chat com emotes
- [ ] Modo torneio

### V2.1 - Personalização (2 semanas)
- [ ] Tema Dark Ops
- [ ] Tema Terminal Green
- [ ] Tema Vaporwave
- [ ] Sons customizáveis

### V3.0 - Eventos Sazonais (ongoing)
- [ ] Sexta-feira 13 (2x bugs)
- [ ] Dia do Programador (apenas deploys mágicos)
- [ ] Black Friday (servidor sempre cai)
- [ ] Ano novo (reset de stats)

---

**Última atualização:** 2025-01-21  
**Versão do documento:** 1.0.0  
**Responsável:** Time de Produto - Slot dos Bugs