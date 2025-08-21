import { useEffect, useState } from "react";
import type { SlotSymbol } from "../types/slot";

interface ReelProps {
  symbols: SlotSymbol[];
  isSpinning: boolean;
  delay: number;
}

const Reel = ({ symbols, isSpinning, delay }: ReelProps) => {
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
        setOffset(-60 * 15); // Move para mostrar os símbolos finais
      }, delay);
    } else {
      // Quando para de girar, mantém os símbolos finais
      setIsAnimating(false);
      setOffset(0);
      setDisplaySymbols(symbols);
    }
  }, [isSpinning, symbols, delay]);

  return (
    <div
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-inner border-2 border-gray-700"
      style={{ width: "90px" }}
    >
      <div className="overflow-hidden h-[180px] relative">
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
            <div
              key={`${index}-${symbol}-${isSpinning}`}
              className="h-[60px] flex items-center justify-center text-4xl"
              style={{
                filter:
                  isAnimating && index < displaySymbols.length - 3
                    ? "blur(1px)"
                    : "none",
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Gradientes para efeito de profundidade */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Reel;