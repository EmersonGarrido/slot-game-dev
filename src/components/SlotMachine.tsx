import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reel from "./Reel";
import SettingsModal from "./SettingsModal";
import Confetti from "./Confetti";
import WinExplosion from "./WinExplosion";
import ElephantSpeechBubble from "./ElephantSpeechBubble";
import SecretTerminal from "./SecretTerminal";
import TerminalMode from "./TerminalMode";
import AgiotaModal from "./AgiotaModal";
import { evaluateResult, calculatePayout } from "../utils/rules";
import { rng } from "../utils/rng";
import { useSound } from "../hooks/useSound";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import type { SlotSymbol, ComboResult } from "../types/slot";

const frasesDesmotivacionais = [
  "💀 Nem o console.log te salva mais.",
  "💀 Bugou? Bem-vindo ao normal.",
  "💀 Deploy na sexta, azar garantido.",
  "💀 O Jenkins já desistiu de você.",
  "💀 Se rodar na sua máquina, não significa nada.",
  "💀 A task fácil virou um épico.",
  "💀 Prod caiu, mas o cliente não.",
  "💀 O rollback também falhou.",
  "💀 O bug te escolheu.",
  "💀 Essa exception é sua nova feature.",
  "💀 O prazo era ontem.",
  "💀 Nem o Stack Overflow tem resposta.",
  "💀 O Wi-Fi caiu, mas o prazo continua.",
  "💀 Você corrigiu o bug errado.",
  "💀 Esse commit vai te assombrar.",
  "💀 O merge conflict venceu você.",
  "💀 O estagiário já sabia disso.",
  "💀 Não tem log.",
  "💀 O backup nunca existiu.",
  "💀 Esse erro é intermitente.",
  "💀 O cliente descobriu antes do QA.",
  "💀 O bug só acontece em produção.",
  "💀 Tudo funciona… menos quando importa.",
  "💀 Hoje é feriado no servidor.",
  "💀 Você esqueceu o ;",
  "💀 O cron job não rodou.",
  "💀 Esse 'fix' vai quebrar mais coisas.",
  "💀 O front e o back não se falam.",
  "💀 Essa lib não tem manutenção desde 2015.",
  "💀 Você empurrou na branch errada.",
  "💀 Mais uma daily inútil amanhã.",
  "💀 O PO adicionou 'só um detalhezinho'.",
  "💀 O bug voltou das férias.",
  "💀 Kernel Panic te abraçou.",
  "💀 A call poderia ser um e-mail.",
  "💀 O Jira caiu.",
  "💀 O cache nunca expira.",
  "💀 Essa query vai derrubar o banco.",
  "💀 O cliente pediu IE11.",
  "💀 A API de terceiros mudou sem avisar.",
  "💀 Seu teste unitário é inútil.",
  "💀 Esse código vai pro Hall da Vergonha.",
  "💀 O deploy automático não é tão automático.",
  "💀 O pagamento não vai cair hoje.",
  "💀 A sprint já está perdida.",
  "💀 Esse hotfix vai virar feature.",
  "💀 O bug é eterno.",
  "💀 Você vai sonhar com esse erro.",
  "💀 Tudo parece normal… até o próximo bug.",
  "💀 Respira: segunda tem mais.",
  "💀 Mesmo se eu tentasse eu ainda seria melhor que você."
];

const SlotMachine = () => {
  const [reels, setReels] = useState<SlotSymbol[][]>([
    ["🐞", "🐞", "🐞"],
    ["🔥", "🔥", "🔥"],
    ["💾", "💾", "💾"],
    ["🔧", "🔧", "🔧"],
    ["🐞", "🐞", "🐞"],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [totalSpins, setTotalSpins] = useState(0);
  const [message, setMessage] = useState("Pronto para o caos?");
  const [currentCombo, setCurrentCombo] = useState<ComboResult | null>(null);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  const [backgroundVolume, setBackgroundVolume] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);
  const [showWinExplosion, setShowWinExplosion] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  const [terminalMode, setTerminalMode] = useState(false);
  const [showAgiotaModal, setShowAgiotaModal] = useState(false);
  const [secretCommandCount, setSecretCommandCount] = useState(0);
  const [loanDebt, setLoanDebt] = useState(0);
  const [hackerWinChance, setHackerWinChance] = useState<number | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(false);

  const { createProceduralSound } = useSound(soundEnabled, effectsVolume);
  const { setMusicVolume } = useBackgroundMusic(soundEnabled, backgroundVolume);

  // Carrega preferências salvas
  useEffect(() => {
    const savedEffects = localStorage.getItem("effectsEnabled");
    const savedSound = localStorage.getItem("soundEnabled");
    const savedEffectsVolume = localStorage.getItem("effectsVolume");
    const savedBackgroundVolume = localStorage.getItem("backgroundVolume");
    const savedSecretCount = localStorage.getItem("secretCommandCount");
    const savedLoanDebt = localStorage.getItem("loanDebt");

    if (savedEffects !== null) setEffectsEnabled(savedEffects === "true");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedEffectsVolume !== null)
      setEffectsVolume(Number(savedEffectsVolume));
    if (savedBackgroundVolume !== null)
      setBackgroundVolume(Number(savedBackgroundVolume));
    if (savedSecretCount !== null)
      setSecretCommandCount(Number(savedSecretCount));
    if (savedLoanDebt !== null)
      setLoanDebt(Number(savedLoanDebt));
  }, []);

  const handleVolumeChange = (
    type: "effects" | "background",
    value: number
  ) => {
    if (type === "effects") {
      setEffectsVolume(value);
      localStorage.setItem("effectsVolume", String(value));
    } else {
      setBackgroundVolume(value);
      localStorage.setItem("backgroundVolume", String(value));
      setMusicVolume(value);
    }
  };

  const handleTerminalSpin = () => {
    // Gera os novos símbolos
    const newReels: SlotSymbol[][] = [];
    for (let i = 0; i < 5; i++) {
      const reel = rng.getSymbols(3);
      newReels.push(reel);
    }
    
    const result = evaluateResult(newReels);
    const payout = calculatePayout(result, 10); // Aposta padrão de 10 no terminal
    
    return {
      symbols: newReels[0], // Retorna apenas a primeira linha para simplificar
      won: result.severity === "win" || result.severity === "epic_win",
      winAmount: payout
    };
  };

  const spin = () => {
    if (isSpinning) return;
    
    // Verifica se tem saldo suficiente
    if (balance < bet) {
      setShowAgiotaModal(true);
      return;
    }

    // Som de click do botão
    createProceduralSound("click");

    setIsSpinning(true);
    setMessage("Deployando em prod...");
    setCurrentCombo(null);
    setTotalSpins((prev) => prev + 1);
    setBalance((prev) => prev - bet);
    setLastWin(0);

    // Som de spin iniciando
    createProceduralSound("spin");

    // Gera os novos símbolos IMEDIATAMENTE (antes da animação)
    let newReels: SlotSymbol[][] = [];
    
    // Se modo hacker está ativo, manipula o resultado
    if (hackerWinChance !== null) {
      const shouldWin = Math.random() * 100 < hackerWinChance;
      
      if (hackerWinChance === 100) {
        // 100% = sempre vitória épica
        const epicSymbol = '💀' as SlotSymbol;
        newReels = Array(5).fill([epicSymbol, epicSymbol, epicSymbol]);
      } else if (shouldWin && hackerWinChance > 80) {
        // Alta chance = vitória épica
        const epicSymbol = ['🔧', '💀'][Math.floor(Math.random() * 2)] as SlotSymbol;
        newReels = Array(5).fill([epicSymbol, epicSymbol, epicSymbol]);
      } else if (shouldWin && hackerWinChance > 0) {
        // Vitória normal
        const winSymbol = ['🔥', '💾', '☕'][Math.floor(Math.random() * 3)] as SlotSymbol;
        for (let i = 0; i < 5; i++) {
          if (i < 3) {
            newReels.push([winSymbol, winSymbol, winSymbol]);
          } else {
            newReels.push(rng.getSymbols(3));
          }
        }
      } else {
        // Força perda garantida - padrão específico que nunca ganha
        // Usa um padrão alternado que garante que nunca há 3 símbolos iguais em linha
        const pattern1: SlotSymbol[] = ['🐞', '🔥', '💾'];
        const pattern2: SlotSymbol[] = ['🔧', '☕', '💀'];
        
        for (let i = 0; i < 5; i++) {
          const reel: SlotSymbol[] = [];
          // Alterna padrões para garantir que nunca há combinação
          if (i % 2 === 0) {
            reel.push(pattern1[0]);
            reel.push(pattern2[1]);
            reel.push(pattern1[2]);
          } else {
            reel.push(pattern2[0]);
            reel.push(pattern1[1]);
            reel.push(pattern2[2]);
          }
          // Rotaciona os padrões para mais variedade
          pattern1.push(pattern1.shift()!);
          pattern2.push(pattern2.shift()!);
          
          newReels.push(reel);
        }
      }
    } else {
      // Modo normal
      for (let i = 0; i < 5; i++) {
        const reel = rng.getSymbols(3);
        newReels.push(reel);
      }
    }

    // Atualiza os reels ANTES da animação começar
    setReels(newReels);

    // Processa o resultado após o tempo da animação
    setTimeout(() => {
      const result = evaluateResult(newReels);
      setCurrentCombo(result);
      setMessage(result.message);

      // Toca som baseado no resultado
      playComboSound(result);

      // Aplica efeitos baseado no resultado
      if (effectsEnabled && result.effect) {
        applyEffect(result.effect);
      }

      // Mostra explosão e confete para vitórias
      if (result.severity === "win" || result.severity === "epic_win") {
        setShowWinExplosion(true);
        setConfettiTrigger((prev) => prev + 1);
        // Fecha automaticamente após 6 segundos (5s de animação + 1s)
        setTimeout(() => setShowWinExplosion(false), 6000);
      }

      // Calcula o ganho/perda usando a nova função
      const payout = calculatePayout(result, bet);

      if (payout > 0) {
        // Ganhou!
        setLastWin(payout);
        setBalance((prev) => prev + payout);

        // Se for mega vitória, mostra animação especial
        if (result.severity === "epic_win") {
          setTimeout(() => {
            setMessage(result.message + ` 💰 +R$ ${payout}!`);
          }, 500);
        }
      } else if (result.severity === "lose" || result.severity === "epic_lose") {
        // Escolhe uma frase desmotivacional aleatória
        const fraseDesmotivacional = frasesDesmotivacionais[Math.floor(Math.random() * frasesDesmotivacionais.length)];
        setMessage(fraseDesmotivacional);
        setLastWin(0);
        
        if (result.severity === "epic_lose") {
          // Perda épica (perde mais que a aposta)
          const loss = Math.abs(payout);
          setBalance((prev) => Math.max(0, prev - loss));
          if (balance <= loss) {
            setBalance(0);
            // Mostra o modal do agiota após um pequeno delay
            setTimeout(() => {
              setShowAgiotaModal(true);
            }, 1000);
          }
        }
      } else if (result.severity === "neutral") {
        // Neutro - devolve metade
        const refund = bet * 0.5;
        setBalance((prev) => prev + refund);
        setLastWin(refund);
      }

      setIsSpinning(false);
    }, 3500);
  };

  const playComboSound = (result: ComboResult) => {
    if (result.severity === "epic_win") {
      // Som épico de vitória com moedas
      createProceduralSound("win");
      setTimeout(() => createProceduralSound("win"), 100);
      
      // Sons de moeda durante a contagem (5 segundos)
      for (let i = 0; i < 20; i++) {
        setTimeout(() => createProceduralSound("click"), 200 + (i * 250));
      }
    } else if (result.severity === "win") {
      // Som normal de vitória com algumas moedas
      createProceduralSound("win");
      
      // Sons de moeda durante a contagem
      for (let i = 0; i < 10; i++) {
        setTimeout(() => createProceduralSound("click"), 200 + (i * 500));
      }
    } else if (result.severity === "epic_lose") {
      // Som de derrota épica
      createProceduralSound("lose");
      setTimeout(() => createProceduralSound("lose"), 300);
      setTimeout(() => createProceduralSound("lose"), 600);
    } else if (result.severity === "lose") {
      // Som de derrota normal
      createProceduralSound("lose");
    } else {
      // Som neutro
      createProceduralSound("click");
    }
  };

  const applyEffect = (effect: string) => {
    const root = document.getElementById("root");
    if (!root) return;

    root.className = "";

    switch (effect) {
      case "alarm":
        root.classList.add("alarm-effect");
        setTimeout(() => root.classList.remove("alarm-effect"), 3000);
        break;
      case "confetti":
        root.classList.add("confetti-effect");
        setTimeout(() => root.classList.remove("confetti-effect"), 3000);
        break;
      case "blue_screen":
        root.classList.add("blue-screen-effect");
        setTimeout(() => root.classList.remove("blue-screen-effect"), 2000);
        break;
      case "screen_shake":
        root.classList.add("shake-effect");
        setTimeout(() => root.classList.remove("shake-effect"), 1000);
        break;
    }
  };

  const toggleEffects = () => {
    const newValue = !effectsEnabled;
    setEffectsEnabled(newValue);
    localStorage.setItem("effectsEnabled", String(newValue));
  };

  // Easter eggs
  useEffect(() => {
    if (totalSpins === 100) {
      setMessage("Parabéns, você é oficialmente viciado!");
    }
  }, [totalSpins]);

  const adjustBet = (direction: "up" | "down") => {
    if (direction === "up" && bet < balance) {
      setBet((prev) => Math.min(prev + 10, 1000, balance));
    } else if (direction === "down" && bet > 10) {
      setBet((prev) => Math.max(prev - 10, 10));
    }
  };

  const handleAgiotaLoan = (amount: number, interest: number) => {
    const totalDebt = amount + (amount * interest) / 100;
    setBalance(prev => prev + amount);
    setLoanDebt(prev => prev + totalDebt);
    localStorage.setItem("loanDebt", String(loanDebt + totalDebt));
    setShowAgiotaModal(false);
    setMessage(`Empréstimo de R$ ${amount} aprovado! Dívida total: R$ ${totalDebt}`);
    createProceduralSound("win");
  };

  const handleSecretCommand = (command: string) => {
    if (command.toLowerCase() === "faz o l") {
      if (secretCommandCount >= 13) {
        setMessage("🚫 Não pode mais! Quando tivemos a chance de estocar vento, nós não fizemos isso!");
        return { 
          success: false, 
          message: "Limite de 13 usos atingido! Deveria ter estocado vento quando teve a chance!" 
        };
      }

      setBalance(prev => prev + 1000);
      setSecretCommandCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem("secretCommandCount", String(newCount));
        return newCount;
      });
      
      createProceduralSound("win");
      setMessage(`💰 +R$ 1000! (${13 - secretCommandCount - 1} usos restantes)`);
      
      return { 
        success: true, 
        message: `+R$ 1000 adicionado! Restam ${12 - secretCommandCount} usos do comando secreto.` 
      };
    }
    
    return null;
  };

  if (terminalMode) {
    return (
      <TerminalMode
        balance={balance}
        onSpin={handleTerminalSpin}
        onUpdateBalance={(amount) => setBalance(prev => Math.max(0, prev + amount))}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden ${physicsEnabled ? 'physics-mode' : ''}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/background.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-4 sm:p-6">
          {/* Balance Display */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 rounded-2xl p-4 backdrop-blur-sm border border-yellow-500/30 shadow-2xl"
          >
            <div className="text-gray-400 text-sm font-semibold mb-1">
              SALDO
            </div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              R$ {balance.toLocaleString('pt-BR')}
            </div>
            {lastWin > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-yellow-400 text-sm mt-1"
              >
                +R$ {lastWin.toLocaleString('pt-BR')} 🎉
              </motion.div>
            )}
          </motion.div>

          {/* Settings Button */}
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowSettings(true)}
            className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700/90 p-3 rounded-xl transition-all border border-gray-600/30"
          >
            <span className="text-2xl">⚙️</span>
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-4"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-2"
            style={{
              background:
                "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF6B00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 60px rgba(255, 215, 0, 0.5)",
              letterSpacing: "2px",
            }}
          >
            SLOT DOS BUGS
          </h1>
          <p className="text-cyan-300 text-lg font-semibold">
            🎰 Um jogo de zoeira para devs 🎰
          </p>
        </motion.div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="relative">
            {/* Slot Machine Frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative"
            >
              {/* Elephant Mascot behind and to the right */}
              <motion.div
                className="absolute -right-20 sm:-right-28 md:-right-36 top-[150px] -translate-y-[75%] w-[26rem] sm:w-[30rem] md:w-[34rem] z-0"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <motion.img
                  src="/elefante-php.webp"
                  alt="ElePHPant"
                  className="w-full h-auto"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />

                {/* Speech Bubble */}
                <ElephantSpeechBubble />
              </motion.div>
              {/* Golden Frame */}
              <div
                className="bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-600 p-1 rounded-3xl shadow-2xl relative z-10"
                style={{
                  boxShadow:
                    "0 0 60px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Inner Machine */}
                <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 sm:p-8">
                  {/* Reels Container */}
                  <div className="bg-black/50 rounded-xl p-4 backdrop-blur-sm border-2 border-purple-500/30">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {reels.map((reel, index) => (
                        <motion.div
                          key={index}
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <Reel
                            symbols={reel}
                            isSpinning={isSpinning}
                            delay={index * 300}
                            soundEnabled={soundEnabled}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Message Display */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <div
                      className={`
                      rounded-xl p-4 text-center font-bold text-lg
                      ${
                        currentCombo?.severity === "epic_win"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                          : currentCombo?.severity === "win"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          : currentCombo?.severity === "epic_lose"
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                          : currentCombo?.severity === "lose"
                          ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white"
                          : "bg-slate-800/80 text-gray-300"
                      }
                    `}
                    >
                      {message}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Game Controls - Directly below slot machine */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-6"
              >
                {/* Bet Controls */}
                <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-2 border border-purple-500/30">
                  <button
                    onClick={() => adjustBet("down")}
                    disabled={bet <= 10}
                    className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 flex items-center justify-center text-white text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-600"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    -
                  </button>
                  
                  <div className="text-center px-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Aposta</div>
                    <div className="text-2xl font-black text-white">R$ {bet}</div>
                  </div>
                  
                  <button
                    onClick={() => adjustBet("up")}
                    disabled={bet >= balance || bet >= 100}
                    className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 flex items-center justify-center text-white text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-600"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Spin Button */}
                <motion.button
                  onClick={spin}
                  disabled={isSpinning || balance < bet}
                  whileHover={!isSpinning && balance >= bet ? { scale: 1.05 } : {}}
                  whileTap={!isSpinning && balance >= bet ? { scale: 0.95 } : {}}
                  className={`
                    relative overflow-hidden px-16 py-5 rounded-2xl font-black text-3xl
                    transition-all duration-300 transform
                    ${isSpinning || balance < bet
                      ? "bg-gradient-to-b from-gray-600 to-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-b from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white"
                    }
                    border-4 ${isSpinning || balance < bet ? 'border-gray-500' : 'border-yellow-500/50'}
                  `}
                  style={{
                    boxShadow: isSpinning || balance < bet 
                      ? '0 10px 30px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3)'
                      : '0 10px 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,100,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Animated shine effect */}
                  {!isSpinning && balance >= bet && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-300, 300] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSpinning ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⚙️
                        </motion.span>
                        RODANDO...
                      </>
                    ) : balance < bet ? (
                      "SEM SALDO"
                    ) : (
                      <>
                        🎰 RODAR 🎰
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={soundEnabled}
        setSoundEnabled={(value) => {
          setSoundEnabled(value);
          localStorage.setItem("soundEnabled", String(value));
        }}
        effectsEnabled={effectsEnabled}
        setEffectsEnabled={toggleEffects}
        onVolumeChange={handleVolumeChange}
        effectsVolume={effectsVolume}
        backgroundVolume={backgroundVolume}
      />

      {/* Confetti Effect */}
      <Confetti
        trigger={confettiTrigger > 0}
        type={currentCombo?.severity as "win" | "epic_win"}
      />

      {/* Win Explosion */}
      <WinExplosion
        show={showWinExplosion}
        message={currentCombo?.message || ""}
        severity={currentCombo?.severity}
        amount={lastWin}
        onComplete={() => setShowWinExplosion(false)}
      />
      
      {/* Agiota Modal */}
      <AgiotaModal
        isOpen={showAgiotaModal}
        onClose={() => setShowAgiotaModal(false)}
        onAccept={handleAgiotaLoan}
      />
      
      {/* Secret Terminal */}
      <SecretTerminal 
        onActivateTerminalMode={() => setTerminalMode(true)}
        onSecretCommand={handleSecretCommand}
        onHackerMode={(chance) => {
          setHackerWinChance(chance);
          setMessage(`🔓 Modo Hacker: ${chance}% de vitória!`);
        }}
        onPhysicsMode={() => {
          setPhysicsEnabled(true);
          setTimeout(() => setPhysicsEnabled(false), 10000); // Desativa após 10 segundos
        }}
      />
    </div>
  );
};

export default SlotMachine;
