import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 20;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center z-50"
    >
      {/* Server Animation */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-8"
      >
        <div className="relative">
          {/* Server Body */}
          <div className="w-32 h-40 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-2xl">
            {/* Server Slots */}
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-sm"
                />
              ))}
            </div>
            {/* Server Lights */}
            <div className="flex justify-center gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    backgroundColor: ['#ef4444', '#10b981', '#ef4444']
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
          </div>
          
          {/* Fire/Smoke Effect */}
          {progress > 60 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            >
              <span className="text-4xl">🔥</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-6xl font-black text-yellow-400 mb-8"
        style={{
          textShadow: '3px 3px 0px #ff6b00, 6px 6px 0px rgba(0,0,0,0.2)'
        }}
      >
        SLOT DOS BUGS
      </motion.h1>

      {/* Loading Messages */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mb-8 text-center"
      >
        <p className="text-white text-lg mb-2">
          {progress < 20 && "Inicializando servidor..."}
          {progress >= 20 && progress < 40 && "Carregando bugs em produção..."}
          {progress >= 40 && progress < 60 && "Deployando sem testes..."}
          {progress >= 60 && progress < 80 && "🔥 Servidor pegando fogo..."}
          {progress >= 80 && progress < 100 && "Ignorando erros críticos..."}
          {progress === 100 && "Pronto para o caos!"}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden mb-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Play Button */}
      {isReady && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold text-2xl py-4 px-12 rounded-xl shadow-2xl border-4 border-green-400"
        >
          🎮 JOGAR
        </motion.button>
      )}

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 text-gray-500 text-sm"
      >
        ⚠️ Aviso: Nenhum servidor foi ferido durante o desenvolvimento
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;