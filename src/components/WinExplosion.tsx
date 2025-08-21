import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WinExplosionProps {
  show: boolean;
  message: string;
  severity?: "win" | "epic_win" | "lose" | "epic_lose" | "neutral" | null;
  amount?: number;
  onComplete?: () => void;
}

const motivationalPhrases = [
  "🚀 Você é uma máquina de deploy!",
  "💪 PHP DOMINANDO O MUNDO!",
  "🎯 Acertou em cheio, dev!",
  "⚡ Velocidade de produção insana!",
  "🏆 Campeão dos deploys!",
  "🔥 Tá pegando fogo, bixo!",
  "💎 Código vale ouro!",
  "🌟 Estrela do desenvolvimento!",
  "🎪 Mestre do caos organizado!",
  "🦄 Unicórnio do código!",
  "🎨 Artista do backend!",
  "🧙‍♂️ Mago do PHP!",
  "🎸 Rockstar developer!",
  "🥷 Ninja do código!",
  "👑 Rei dos bugs resolvidos!",
];

const WinExplosion = ({
  show,
  message,
  severity,
  amount = 0,
  onComplete,
}: WinExplosionProps) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");

  useEffect(() => {
    if (show && (severity === "win" || severity === "epic_win") && amount > 0) {
      // Seleciona frase motivacional aleatória
      const phrase =
        motivationalPhrases[
          Math.floor(Math.random() * motivationalPhrases.length)
        ];
      setMotivationalPhrase(phrase);

      // Animação de contagem
      const duration = 5000; // 5 segundos
      const steps = 100;
      const increment = amount / steps;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const countInterval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayAmount(Math.round(increment * currentStep));
        } else {
          clearInterval(countInterval);
          setDisplayAmount(amount);

          // Callback quando completar
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1000);
        }
      }, stepDuration);

      return () => {
        clearInterval(countInterval);
      };
    } else {
      setDisplayAmount(0);
    }
  }, [show, severity, amount, onComplete]);

  if (
    !severity ||
    severity === "lose" ||
    severity === "epic_lose" ||
    severity === "neutral"
  )
    return null;
  if (!show) return null;

  const isEpic = severity === "epic_win";

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay escuro */}
          <motion.div
            className="fixed inset-0 bg-black/95 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Container principal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Container do elefante e valor */}
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0, y: 100 }}
              animate={{
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                damping: 15,
              }}
            >
              {/* Elefante gigante */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <img
                  src="/elefante-win.webp"
                  alt="ElePHPant Winner"
                  className={
                    isEpic ? "w-[900px] h-[900px]" : "w-[700px] h-[700px]"
                  }
                  style={{
                    filter: isEpic
                      ? "drop-shadow(0 0 120px rgba(255, 215, 0, 1)) drop-shadow(0 0 60px rgba(255, 100, 0, 0.8))"
                      : "drop-shadow(0 0 80px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 40px rgba(34, 197, 94, 0.5))",
                    objectFit: "contain",
                  }}
                />
              </motion.div>

              {/* Valor contador em branco grande */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className={`${
                    isEpic ? "text-9xl" : "text-8xl"
                  } font-black text-white`}
                  style={{
                    textShadow:
                      "0 0 60px rgba(255,255,255,0.8), 0 8px 16px rgba(0,0,0,0.8)",
                    letterSpacing: "2px",
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  R$ {displayAmount.toLocaleString("pt-BR")}
                </motion.div>
              </motion.div>

              {/* Frase motivacional abaixo */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div
                  className="text-3xl font-bold text-white px-12 py-6 bg-gradient-to-r from-purple-600/90 to-purple-800/90 rounded-3xl border-2 border-purple-400/50 backdrop-blur-sm"
                  style={{
                    boxShadow: "0 20px 60px rgba(147, 51, 234, 0.4)",
                  }}
                >
                  {motivationalPhrase}
                </div>
              </motion.div>

              {/* Mensagem do combo */}
              <motion.div
                className="text-2xl font-semibold text-yellow-300 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {message}
              </motion.div>
            </motion.div>

            {/* Moedas caindo ao fundo */}
            <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(isEpic ? 30 : 20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-5xl opacity-70"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-100px",
                  }}
                  animate={{
                    y: window.innerHeight + 200,
                    x: [
                      (Math.random() - 0.5) * 100,
                      (Math.random() - 0.5) * 200,
                    ],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    delay: Math.random() * 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {
                    ["💰", "💵", "💸", "🪙", "💎"][
                      Math.floor(Math.random() * 5)
                    ]
                  }
                </motion.div>
              ))}
            </motion.div>

            {/* Partículas de luz */}
            {isEpic && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: [
                        (Math.random() - 0.5) * 800,
                        (Math.random() - 0.5) * 1200,
                      ],
                      y: [
                        (Math.random() - 0.5) * 800,
                        (Math.random() - 0.5) * 1200,
                      ],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Fogos de artifício estáticos nos cantos */}
            {isEpic && (
              <>
                <motion.div
                  className="absolute top-20 left-20 text-7xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  🎆
                </motion.div>
                <motion.div
                  className="absolute top-20 right-20 text-7xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                  }}
                >
                  🎇
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-20 text-7xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute bottom-20 right-20 text-7xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.5,
                    repeat: Infinity,
                  }}
                >
                  🌟
                </motion.div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinExplosion;
