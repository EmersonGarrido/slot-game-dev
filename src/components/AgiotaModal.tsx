import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AgiotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (amount: number, interest: number) => void;
}

const loanOptions = [
  { amount: 100, interest: 50, description: "Empréstimo camarada" },
  { amount: 500, interest: 100, description: "Empréstimo amigão" },
  { amount: 1000, interest: 150, description: "Empréstimo VIP" },
  { amount: 5000, interest: 200, description: "Empréstimo EXTREMO" },
];

const AgiotaModal = ({ isOpen, onClose, onAccept }: AgiotaModalProps) => {
  const [selectedLoan, setSelectedLoan] = useState<typeof loanOptions[0] | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleAccept = () => {
    if (selectedLoan) {
      if (!showWarning) {
        setShowWarning(true);
        return;
      }
      onAccept(selectedLoan.amount, selectedLoan.interest);
      setShowWarning(false);
      setSelectedLoan(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-gradient-to-br from-red-900 via-gray-900 to-black p-8 rounded-3xl shadow-2xl max-w-lg w-full border-4 border-red-600/50">
              {/* Header com emoji do agiota */}
              <div className="text-center mb-6">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  🦈
                </motion.div>
                <h2 className="text-4xl font-black text-red-500 mb-2">
                  EMPRÉSTIMO DO TUBARÃO
                </h2>
                <p className="text-gray-300 text-lg">
                  "Ei, amigão! Vi que você tá sem grana... 😈"
                </p>
              </div>

              {/* Opções de empréstimo */}
              <div className="space-y-3 mb-6">
                {loanOptions.map((option) => (
                  <motion.button
                    key={option.amount}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedLoan?.amount === option.amount
                        ? "bg-red-600/30 border-red-400 shadow-lg shadow-red-500/50"
                        : "bg-gray-800/50 border-gray-600 hover:border-red-500"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLoan(option)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-white font-bold text-xl">
                          R$ {option.amount}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {option.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-black text-2xl">
                          +{option.interest}%
                        </p>
                        <p className="text-gray-500 text-xs">
                          Devolve R$ {option.amount + (option.amount * option.interest) / 100}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Aviso de zoeira */}
              {showWarning && selectedLoan && (
                <motion.div
                  className="mb-4 p-4 bg-yellow-900/50 border-2 border-yellow-600 rounded-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-yellow-300 text-center font-bold">
                    ⚠️ AVISO IMPORTANTE ⚠️
                  </p>
                  <p className="text-yellow-200 text-sm text-center mt-2">
                    Você vai pagar R$ {selectedLoan.amount + (selectedLoan.amount * selectedLoan.interest) / 100} por R$ {selectedLoan.amount}!
                  </p>
                  <p className="text-yellow-100 text-xs text-center mt-1">
                    Taxa de juros: Apenas {selectedLoan.interest}% 😅
                  </p>
                  <p className="text-red-300 text-xs text-center mt-2 font-bold">
                    "Relaxa, é só um investimento no seu entretenimento!"
                  </p>
                </motion.div>
              )}

              {/* Botões de ação */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Melhor não... 😰
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!selectedLoan}
                  className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all ${
                    selectedLoan
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/50"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {showWarning ? "CONFIRMAR MESMO! 🤝" : "Fechou! 🤝"}
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-gray-500 text-xs text-center mt-4">
                * Juros cobrados por segundo. Não aceitamos calote. 
                <br />
                Seu ElePHPant pode ser confiscado como garantia.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgiotaModal;