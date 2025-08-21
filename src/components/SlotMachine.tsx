import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reel from "./Reel";
import SettingsModal from "./SettingsModal";
import ElephantMascot from "./ElephantMascot";
import { evaluateResult } from "../utils/rules";
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
  const [balance, setBalance] = useState(100);
  const [totalSpins, setTotalSpins] = useState(0);
  const [message, setMessage] = useState("Pronto para o caos?");
  const [currentCombo, setCurrentCombo] = useState<ComboResult | null>(null);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  const [backgroundVolume, setBackgroundVolume] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);
  
  const { stopAllSounds, createProceduralSound } = useSound(soundEnabled, effectsVolume);
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
    if (isSpinning) return;

    // Som de click do botão
    createProceduralSound("click");

    setIsSpinning(true);
    setMessage("Deployando em prod...");
    setCurrentCombo(null);
    setTotalSpins((prev) => prev + 1);

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

      // Atualiza balance baseado na severidade
      if (result.severity === "epic_win") {
        setBalance((prev) => prev + 500);
      } else if (result.severity === "win") {
        setBalance((prev) => prev + 100);
      } else if (result.severity === "epic_lose") {
        setBalance(0);
        setMessage(result.message + " 💀 GAME OVER!");
      } else if (result.severity === "lose") {
        setBalance(0);
      }

      setIsSpinning(false);
    }, 3500);
  };

  const playComboSound = (result: ComboResult) => {
    switch (result.type) {
      case "deploy_magico":
        createProceduralSound("win");
        setTimeout(() => createProceduralSound("win"), 200);
        setTimeout(() => createProceduralSound("win"), 400);
        break;
      case "overdose_cafe":
        createProceduralSound("win");
        break;
      case "servidor_caindo":
      case "blue_screen_total":
        createProceduralSound("lose");
        setTimeout(() => createProceduralSound("lose"), 300);
        break;
      case "deploy_sexta":
      case "kernel_panic":
        createProceduralSound("lose");
        break;
      case "promocao_estagiario":
        createProceduralSound("click");
        setTimeout(() => createProceduralSound("click"), 100);
        break;
      default:
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

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", String(newValue));

    if (newValue) {
      createProceduralSound("click");
    } else {
      stopAllSounds();
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

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full px-2 sm:px-4"
      >
        {/* Header - Mobile Optimized */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-2 sm:mb-4"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 sm:mb-2" 
            style={{
              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF6B00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            }}
          >
            SLOT DOS BUGS
          </h1>
          <p className="text-cyan-300 text-xs sm:text-sm font-semibold animate-pulse">
            🎰 Um jogo de zoeira para devs 🎰
          </p>
        </motion.div>

        {/* Stats Bar - Mobile Optimized */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between w-full mb-2 sm:mb-4 gap-2"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <div className="bg-gray-800 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
              <span className="text-gray-400 text-xs sm:text-sm">Créditos: </span>
              <span className="text-green-400 font-bold text-sm sm:text-base">{balance}</span>
            </div>
            <div className="bg-gray-800 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
              <span className="text-gray-400 text-xs sm:text-sm">Giros: </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">{totalSpins}</span>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-700 hover:bg-gray-600 p-2 sm:p-3 rounded-lg transition-all"
          >
            <span className="text-xl sm:text-2xl">⚙️</span>
          </button>
        </motion.div>

        {/* Slot Machine - Mobile Optimized */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-gradient-to-b from-black/80 to-purple-900/80 rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-4 md:p-6 shadow-2xl border-2 sm:border-3 md:border-4 border-yellow-600 backdrop-blur-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
          style={{
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.2)",
          }}
        >
          <div className="bg-gradient-to-b from-black/70 to-purple-900/70 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-4 shadow-inner border border-yellow-600/40">
            <div className="flex justify-center gap-[2px] sm:gap-1 md:gap-2 lg:gap-3 bg-gradient-to-b from-black/80 to-purple-900/80 rounded-md sm:rounded-lg md:rounded-xl p-1 sm:p-2 md:p-3 lg:p-4 border border-yellow-600/30">
              {reels.map((reel, index) => (
                <motion.div
                  key={index}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
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
        </motion.div>

        {/* Message Display - Mobile Optimized */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`w-full mt-3 sm:mt-6 px-2 sm:px-8 ${
            currentCombo?.effect === "yellow_banner" ? "animate-pulse" : ""
          }`}
        >
          <div
            className={`rounded-lg sm:rounded-xl p-2 sm:p-4 text-center font-bold text-sm sm:text-lg transition-all ${
              currentCombo?.severity === "epic_lose"
                ? "bg-red-900 text-red-100"
                : currentCombo?.severity === "lose"
                ? "bg-orange-900 text-orange-100"
                : currentCombo?.severity === "epic_win"
                ? "bg-green-900 text-green-100"
                : currentCombo?.severity === "win"
                ? "bg-blue-900 text-blue-100"
                : "bg-gray-800 text-gray-100"
            }`}
          >
            <p className="text-sm sm:text-xl">{message}</p>
          </div>
        </motion.div>

        {/* Spin Button - Mobile Optimized */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="mt-3 sm:mt-6 w-full flex justify-center"
        >
          <button
            onClick={spin}
            disabled={isSpinning}
            className={`
              ${isSpinning
                ? "bg-gradient-to-b from-gray-600 to-gray-700 cursor-not-allowed"
                : "bg-gradient-to-b from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transform hover:scale-105"
              }
              text-white text-lg sm:text-2xl md:text-3xl font-black py-2 sm:py-4 md:py-6 px-8 sm:px-12 md:px-20 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-200 shadow-2xl border-2 sm:border-3 md:border-4 border-yellow-600 w-full sm:w-auto max-w-[200px] sm:max-w-xs
            `}
          >
            {isSpinning ? "DEPLOYANDO..." : "RODAR"}
          </button>
        </motion.div>

        {/* Info Panel - Mobile Hidden on Small Screens */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hidden sm:block mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm max-w-2xl"
        >
          <p className="mb-2 font-bold text-gray-300">Combinações especiais:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 text-xs">
            <div>🔥🔥🔥 = Servidor caiu</div>
            <div>🐞🐞🔧 = Deploy sexta</div>
            <div>💾💾💾 = Kernel Panic</div>
            <div>🔧🔧🔧 = Deploy mágico!</div>
            <div>☕☕☕ = Overdose cafeína</div>
            <div>💀💀💀 = Blue Screen</div>
          </div>
        </motion.div>
      </motion.div>

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
      
      {/* Elephant Mascot */}
      <ElephantMascot />
    </>
  );
};

export default SlotMachine;