import { useState, useEffect } from "react";
import Reel from "./Reel";
import { evaluateResult } from "../utils/rules";
import { rng } from "../utils/rng";
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

  // Carrega preferências salvas
  useEffect(() => {
    const savedEffects = localStorage.getItem("effectsEnabled");
    const savedSound = localStorage.getItem("soundEnabled");
    if (savedEffects !== null) setEffectsEnabled(savedEffects === "true");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
  }, []);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setMessage("Deployando em prod...");
    setCurrentCombo(null);
    setTotalSpins((prev) => prev + 1);

    // Gera os novos símbolos IMEDIATAMENTE (antes da animação)
    const newReels: SlotSymbol[][] = [];
    for (let i = 0; i < 5; i++) {
      const reel = rng.getSymbols(3);
      newReels.push(reel);
    }

    // Atualiza os reels ANTES da animação começar
    // Isso permite que o Reel component saiba qual será o resultado final
    setReels(newReels);

    // Processa o resultado após o tempo da animação
    setTimeout(() => {
      // Avalia o resultado
      const result = evaluateResult(newReels);
      setCurrentCombo(result);
      setMessage(result.message);

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

  const applyEffect = (effect: string) => {
    const root = document.getElementById("root");
    if (!root) return;

    // Remove classes antigas
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
      case "yellow_banner":
        // Handled by message display
        break;
    }
  };

  const toggleEffects = () => {
    const newValue = !effectsEnabled;
    setEffectsEnabled(newValue);
    localStorage.setItem("effectsEnabled", String(newValue));
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", String(newValue));
  };

  // Easter eggs baseados no número de giros
  useEffect(() => {
    if (totalSpins === 100) {
      setMessage("Parabéns, você é oficialmente viciado!");
    }
  }, [totalSpins]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
      {/* Stats Bar */}
      <div className="flex items-center justify-between w-full mb-4 px-8">
        <div className="flex items-center gap-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Créditos: </span>
            <span className="text-green-400 font-bold">{balance}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Giros: </span>
            <span className="text-blue-400 font-bold">{totalSpins}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleEffects}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              effectsEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {effectsEnabled ? "✨ Efeitos ON" : "✨ Efeitos OFF"}
          </button>
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              soundEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {soundEnabled ? "🔊 Som ON" : "🔇 Som OFF"}
          </button>
        </div>
      </div>

      {/* Slot Machine */}
      <div
        className="bg-gradient-to-b from-black/80 to-purple-900/80 rounded-3xl p-6 shadow-2xl border-4 border-yellow-600 backdrop-blur-md"
        style={{
          boxShadow:
            "0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)",
        }}
      >
        <div className="bg-gradient-to-b from-black/70 to-purple-900/70 rounded-2xl p-4 shadow-inner border-2 border-yellow-600/40">
          <div className="flex justify-center gap-3 bg-gradient-to-b from-black/80 to-purple-900/80 rounded-xl p-4 border border-yellow-600/30">
            {reels.map((reel, index) => (
              <Reel
                key={index}
                symbols={reel}
                isSpinning={isSpinning}
                delay={index * 300}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Message Display */}
      <div
        className={`w-full mt-6 px-8 ${
          currentCombo?.effect === "yellow_banner" ? "animate-pulse" : ""
        }`}
      >
        <div
          className={`rounded-xl p-4 text-center font-bold text-lg transition-all ${
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
          <p className="text-xl">{message}</p>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mt-6">
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`
            ${
              isSpinning
                ? "bg-gradient-to-b from-gray-600 to-gray-700 cursor-not-allowed"
                : "bg-gradient-to-b from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transform hover:scale-105"
            }
            text-white text-3xl font-black py-6 px-20 rounded-2xl transition-all duration-200 shadow-2xl border-4 border-yellow-600
          `}
        >
          {isSpinning ? "DEPLOYANDO..." : "RODAR"}
        </button>
      </div>

      {/* Info Panel */}
      <div className="mt-8 text-center text-gray-400 text-sm max-w-2xl">
        <p className="mb-2 font-bold text-gray-300">Combinações especiais:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>🔥🔥🔥 = Servidor caiu (GG)</div>
          <div>🐞🐞🔧 = Deploy sexta (perdeu tudo)</div>
          <div>💾💾💾 = Kernel Panic</div>
          <div>🔧🔧🔧 = Deploy mágico! (+500)</div>
          <div>☕☕☕ = Overdose cafeína (+100)</div>
          <div>💀💀💀 = Blue Screen Total (RIP)</div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
