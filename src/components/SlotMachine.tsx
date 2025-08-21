import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reel from "./Reel";
import SettingsModal from "./SettingsModal";
import Confetti from "./Confetti";
import WinExplosion from "./WinExplosion";
import ElephantSpeechBubble from "./ElephantSpeechBubble";
import { evaluateResult, calculatePayout } from "../utils/rules";
import { rng } from "../utils/rng";
import { useSound } from "../hooks/useSound";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import type { SlotSymbol, ComboResult } from "../types/slot";

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
  
  const { createProceduralSound } = useSound(soundEnabled, effectsVolume);
  const { setMusicVolume } = useBackgroundMusic(soundEnabled, backgroundVolume);

  // Carrega preferências salvas
  useEffect(() => {
    const savedEffects = localStorage.getItem("effectsEnabled");
    const savedSound = localStorage.getItem("soundEnabled");
    const savedEffectsVolume = localStorage.getItem("effectsVolume");
    const savedBackgroundVolume = localStorage.getItem("backgroundVolume");
    
    if (savedEffects !== null) setEffectsEnabled(savedEffects === "true");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedEffectsVolume !== null) setEffectsVolume(Number(savedEffectsVolume));
    if (savedBackgroundVolume !== null) setBackgroundVolume(Number(savedBackgroundVolume));
  }, []);

  const handleVolumeChange = (type: 'effects' | 'background', value: number) => {
    if (type === 'effects') {
      setEffectsVolume(value);
      localStorage.setItem('effectsVolume', String(value));
    } else {
      setBackgroundVolume(value);
      localStorage.setItem('backgroundVolume', String(value));
      setMusicVolume(value);
    }
  };

  const spin = () => {
    if (isSpinning || balance < bet) return;

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
    const newReels: SlotSymbol[][] = [];
    for (let i = 0; i < 5; i++) {
      const reel = rng.getSymbols(3);
      newReels.push(reel);
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
        setConfettiTrigger(prev => prev + 1);
        setTimeout(() => setShowWinExplosion(false), 3000);
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
            setMessage(result.message + ` 💰 +$${payout}!`);
          }, 500);
        }
      } else if (payout < 0) {
        // Perda épica (perde mais que a aposta)
        const loss = Math.abs(payout);
        setBalance((prev) => Math.max(0, prev - loss));
        if (balance <= loss) {
          setMessage(result.message + " 💀 GAME OVER!");
          setBalance(0);
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
      // Som épico de vitória
      createProceduralSound("win");
      setTimeout(() => createProceduralSound("win"), 100);
      setTimeout(() => createProceduralSound("win"), 200);
      setTimeout(() => createProceduralSound("win"), 350);
      setTimeout(() => createProceduralSound("win"), 500);
    } else if (result.severity === "win") {
      // Som normal de vitória
      createProceduralSound("win");
      setTimeout(() => createProceduralSound("win"), 200);
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

  const adjustBet = (direction: 'up' | 'down') => {
    if (direction === 'up' && bet < balance) {
      setBet(prev => Math.min(prev + 10, 1000, balance));
    } else if (direction === 'down' && bet > 10) {
      setBet(prev => Math.max(prev - 10, 10));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
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
            <div className="text-gray-400 text-sm font-semibold mb-1">SALDO</div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              ${balance.toLocaleString()}
            </div>
            {lastWin > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-yellow-400 text-sm mt-1"
              >
                +${lastWin} 🎉
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-2" 
            style={{
              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF6B00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(255, 215, 0, 0.5)',
              letterSpacing: '2px'
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
                className="absolute -right-20 sm:-right-28 md:-right-36 top-1/2 -translate-y-[75%] w-[26rem] sm:w-[30rem] md:w-[34rem] z-0"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <motion.img
                  src="/elefante-php.webp"
                  alt="ElePHPant"
                  className="w-full h-auto"
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                
                {/* Speech Bubble */}
                <ElephantSpeechBubble />
              </motion.div>
              {/* Golden Frame */}
              <div className="bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-600 p-1 rounded-3xl shadow-2xl relative z-10"
                style={{
                  boxShadow: '0 0 60px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)'
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
                    <div className={`
                      rounded-xl p-4 text-center font-bold text-lg
                      ${currentCombo?.severity === "epic_win"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                        : currentCombo?.severity === "win"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : currentCombo?.severity === "epic_lose"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                        : currentCombo?.severity === "lose"
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white"
                        : "bg-slate-800/80 text-gray-300"
                      }
                    `}>
                      {message}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Bet Controls */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2"
              >
                <button
                  onClick={() => adjustBet('down')}
                  disabled={bet <= 10}
                  className="text-2xl p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  ➖
                </button>
                <div className="text-center px-3">
                  <div className="text-xs text-gray-400">APOSTA</div>
                  <div className="text-xl font-bold text-white">${bet}</div>
                </div>
                <button
                  onClick={() => adjustBet('up')}
                  disabled={bet >= balance}
                  className="text-2xl p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  ➕
                </button>
              </motion.div>

              {/* Spin Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                onClick={spin}
                disabled={isSpinning || balance < bet}
                whileHover={!isSpinning && balance >= bet ? { scale: 1.05 } : {}}
                whileTap={!isSpinning && balance >= bet ? { scale: 0.95 } : {}}
                className={`
                  relative overflow-hidden px-12 py-5 rounded-2xl font-black text-2xl
                  transition-all duration-300 transform
                  ${isSpinning || balance < bet
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
                  }
                `}
                style={{
                  boxShadow: isSpinning || balance < bet
                    ? '0 10px 30px rgba(0,0,0,0.5)'
                    : '0 10px 40px rgba(255,0,0,0.6), 0 0 60px rgba(255,100,0,0.4)',
                }}
              >
                {/* Animated shine effect */}
                {!isSpinning && balance >= bet && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-2">
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

              {/* Auto Play (disabled) */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-3"
              >
                <button className="text-gray-500 p-2" disabled>
                  <div className="text-2xl">🔄</div>
                  <div className="text-xs">AUTO</div>
                </button>
              </motion.div>
            </div>

            {/* Combos Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-center"
            >
              <div className="text-xs text-gray-400 mb-2">Combinações especiais:</div>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-300">
                <span>🔥🔥🔥 = Servidor caiu</span>
                <span>🐞🐞🔧 = Deploy sexta</span>
                <span>💾💾💾 = Kernel Panic</span>
                <span>🔧🔧🔧 = Deploy mágico!</span>
                <span>☕☕☕ = Overdose cafeína</span>
                <span>💀💀💀 = Blue Screen</span>
              </div>
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
      <Confetti trigger={confettiTrigger > 0} type={currentCombo?.severity as 'win' | 'epic_win'} />
      
      {/* Win Explosion */}
      <WinExplosion 
        show={showWinExplosion} 
        message={currentCombo?.message || ""} 
        severity={currentCombo?.severity}
      />
    </div>
  );
};

export default SlotMachine;