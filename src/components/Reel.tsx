import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SlotSymbol } from "../types/slot";
import { useSound } from "../hooks/useSound";

interface ReelProps {
  symbols: SlotSymbol[];
  isSpinning: boolean;
  delay: number;
  soundEnabled?: boolean;
}

const Reel = ({ symbols, isSpinning, delay, soundEnabled = true }: ReelProps) => {
  const { createProceduralSound } = useSound(soundEnabled);
  const [displaySymbols, setDisplaySymbols] = useState<SlotSymbol[]>(symbols);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      // Gera símbolos aleatórios para a animação
      const allSymbols: SlotSymbol[] = ["🐞", "🔥", "💾", "🔧", "☕", "💀"];
      const spinSymbols: SlotSymbol[] = [];

      // Adiciona 15 símbolos aleatórios para a animação
      for (let i = 0; i < 15; i++) {
        spinSymbols.push(
          allSymbols[Math.floor(Math.random() * allSymbols.length)]
        );
      }

      // Adiciona os símbolos finais no fim
      const finalSymbols = [...spinSymbols, ...symbols];
      setDisplaySymbols(finalSymbols);

      // Inicia a animação após o delay
      setTimeout(() => {
        setIsAnimating(true);
        setOffset(-100 * 15); // Ajustado para o novo tamanho
      }, delay);
      
      // Som quando o rolo para
      setTimeout(() => {
        createProceduralSound('click');
      }, 3000 + delay);
    } else {
      // Quando para de girar, mantém os símbolos finais
      setIsAnimating(false);
      setOffset(0);
      setDisplaySymbols(symbols);
    }
  }, [isSpinning, symbols, delay]);

  return (
    <div
      className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-inner border-2 border-purple-500/30 
                 w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px]"
      style={{
        boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5), inset 0 -4px 20px rgba(0,0,0,0.5)'
      }}
    >
      <div className="overflow-hidden h-[270px] sm:h-[300px] relative">
        <div
          className="flex flex-col"
          style={{
            transform: `translateY(${offset}px)`,
            transitionProperty: isAnimating ? "transform" : "none",
            transitionDuration: isAnimating ? `${3000 - delay}ms` : "0ms",
            transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
            transitionDelay: "0ms",
          }}
        >
          {displaySymbols.map((symbol, index) => (
            <motion.div
              key={`${index}-${symbol}-${isSpinning}`}
              className="h-[90px] sm:h-[100px] flex items-center justify-center text-6xl sm:text-7xl"
              style={{
                filter:
                  isAnimating && index < displaySymbols.length - 3
                    ? "blur(2px)"
                    : "none",
              }}
            >
              {/* Symbol with idle animation when not spinning */}
              <motion.span
                animate={
                  !isSpinning && index >= displaySymbols.length - 3
                    ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 2 + index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
                className="drop-shadow-lg"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  filter: !isSpinning && index >= displaySymbols.length - 3
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                    : 'none'
                }}
              >
                {symbol}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Gradientes para efeito de profundidade */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>
        
        {/* Highlight lines */}
        <div className="absolute inset-x-0 top-[90px] h-[90px] sm:top-[100px] sm:h-[100px] border-t-2 border-b-2 border-yellow-500/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Reel;