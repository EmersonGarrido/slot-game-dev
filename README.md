# 🎰 Slot Machine Game - Cassino Virtual

Um jogo de caça-níqueis moderno e interativo desenvolvido em React com TypeScript, oferecendo múltiplos modos de jogo e uma experiência imersiva de cassino virtual.

## 🎮 Características Principais

### 🎰 Slot Machine Clássica
- **Interface visual atraente** com animações suaves e efeitos sonoros
- **Sistema de apostas flexível** com valores de R$ 1 a R$ 100
- **Multiplicadores especiais** para combinações vencedoras
- **Efeitos visuais** incluindo confetes para grandes vitórias
- **Sistema de créditos** com saldo inicial de R$ 100

### 💻 Modos Especiais de Jogo

#### 1. 🖥️ Modo Terminal
Experimente o cassino através de uma interface de linha de comando nostálgica:
- **Comandos disponíveis:**
  - `bet <valor>` - Fazer uma aposta
  - `spin` - Girar os rolos
  - `balance` - Verificar saldo atual
  - `help` - Listar comandos disponíveis
  - `clear` - Limpar terminal
  - `exit` - Sair do modo terminal
- **Interface ASCII art** com representação visual dos rolos
- **Histórico de comandos** navegável com setas ↑↓
- **Feedback instantâneo** de vitórias e perdas

#### 2. 🔐 Modo Hacker
Entre no submundo digital com uma interface cyberpunk:
- **Terminal estilo Matrix** com efeito de chuva de caracteres
- **Comandos hackear:**
  - `hack.init` - Inicializar sistema
  - `crack.slot <valor>` - Hackear o caça-níqueis
  - `sys.balance` - Verificar créditos no sistema
  - `exploit.run` - Executar exploit
- **Efeitos visuais glitch** e animações de terminal
- **Tema verde fosforescente** característico

#### 3. 🦖 Modo Chrome (Dinossauro)
Inspirado no jogo offline do Chrome:
- **Mini-game do dinossauro** integrado ao cassino
- **Sistema de pontuação** que converte em créditos
- **Controles simples:** Espaço ou Click para pular
- **Obstáculos variados** com dificuldade progressiva
- **Conversão de pontos:** 10 pontos = R$ 1 crédito

#### 4. 🎯 Modo Flecha (Archery Challenge)
Teste sua precisão neste mini-game de tiro ao alvo:
- **Alvo móvel** com diferentes zonas de pontuação
- **Sistema de mira** controlado pelo mouse
- **Zonas de pontuação:**
  - Centro (Bullseye): 50 pontos
  - Anel interno: 25 pontos
  - Anel médio: 10 pontos
  - Anel externo: 5 pontos
- **5 flechas por rodada**
- **Conversão automática** de pontos em créditos

### 💰 Sistema de Créditos e Apostas

- **Saldo inicial:** R$ 100
- **Apostas mínimas:** R$ 1
- **Apostas máximas:** R$ 100
- **Sistema de empréstimo** através do Agiota (quando saldo < R$ 10)
- **Multiplicadores de vitória:**
  - 3 símbolos iguais: 5x a aposta
  - Combinações especiais: até 10x a aposta
  - Jackpot: 50x a aposta

### 🦈 Sistema do Agiota

Quando seus créditos acabam, você pode recorrer ao agiota:
- **Empréstimos disponíveis:** R$ 50, R$ 100, R$ 200
- **Juros compostos:** 50% de juros
- **Sistema de cobrança** com notificações periódicas
- **Consequências** por não pagar a dívida
- **Interface intimidadora** com animações especiais

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização e design responsivo
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos
- **Canvas API** - Renderização dos mini-games
- **Web Audio API** - Sistema de som

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/slot-game.git

# Entre no diretório
cd slot-game

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Compila para produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa linter
```

## 📁 Estrutura do Projeto

```
slot-game/
├── src/
│   ├── components/
│   │   ├── SlotMachine.tsx      # Componente principal do caça-níqueis
│   │   ├── TerminalMode.tsx     # Modo terminal
│   │   ├── HackerMode.tsx       # Modo hacker
│   │   ├── ChromeDino.tsx       # Mini-game do dinossauro
│   │   ├── ArcheryGame.tsx      # Mini-game de flecha
│   │   ├── SecretTerminal.tsx   # Terminal secreto (modo avançado)
│   │   └── AgiotaModal.tsx      # Sistema de empréstimo
│   ├── hooks/
│   │   └── useSound.ts          # Hook para gerenciar sons
│   ├── styles/
│   │   └── terminal.css         # Estilos específicos do terminal
│   └── App.tsx                  # Componente raiz
├── public/
│   └── sounds/                  # Efeitos sonoros
└── package.json
```

## 🎮 Como Jogar

### Slot Machine Principal
1. Defina o valor da aposta usando os botões ou digite um valor
2. Clique em "GIRAR" para rodar os rolos
3. Aguarde o resultado e veja seus ganhos
4. Gerencie seu saldo com sabedoria

### Acessando Modos Especiais
- **Terminal:** Clique no ícone do terminal na interface principal
- **Hacker:** Ative através do menu de modos especiais
- **Chrome Dino:** Disponível no menu de mini-games
- **Flecha:** Acessível pelo menu de desafios

## 🏆 Tabela de Pagamentos

| Combinação | Multiplicador |
|------------|---------------|
| 🍒 🍒 🍒 | 5x |
| 🍋 🍋 🍋 | 8x |
| 🍊 🍊 🍊 | 10x |
| 🍇 🍇 🍇 | 12x |
| 🍉 🍉 🍉 | 15x |
| ⭐ ⭐ ⭐ | 20x |
| 💎 💎 💎 | 50x (Jackpot) |

## 🔊 Sistema de Som

O jogo inclui efeitos sonoros imersivos:
- Som de giro dos rolos
- Fanfarra de vitória
- Efeitos de moedas
- Sons ambiente de cassino
- Efeitos especiais para cada modo

## 🎨 Temas e Personalização

- **Tema Clássico:** Visual tradicional de cassino
- **Tema Neon:** Estilo cyberpunk com cores vibrantes
- **Tema Retro:** Nostalgia dos cassinos antigos
- **Tema Matrix:** Exclusivo do modo hacker

## 📱 Responsividade

O jogo é totalmente responsivo e funciona em:
- Desktop (otimizado)
- Tablets
- Smartphones (interface adaptada)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎰 Aviso Legal

Este é um jogo de entretenimento apenas. Não envolve apostas com dinheiro real. Jogue com responsabilidade e divirta-se!

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Emerson Garrido]

---

**Divirta-se jogando! 🎰✨**