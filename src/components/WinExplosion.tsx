import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WinExplosionProps {
  show: boolean;
  message: string;
  severity?: 'win' | 'epic_win' | 'lose' | 'epic_lose' | 'neutral' | null;
}

const WinExplosion = ({ show, message, severity }: WinExplosionProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  useEffect(() => {
    if (show && (severity === 'win' || severity === 'epic_win')) {
      // Cria partículas de explosão
      const newParticles = Array.from({ length: severity === 'epic_win' ? 30 : 15 }, (_, i) => ({
        id: Date.now() + i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 2000);
    }
  }, [show, severity]);
  
  if (!severity || severity === 'lose' || severity === 'epic_lose' || severity === 'neutral') return null;

  const isEpic = severity === 'epic_win';

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay escuro */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Container principal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background flash */}
            <motion.div
              className={`absolute inset-0 ${isEpic ? 'bg-gradient-radial from-yellow-500/50 via-orange-500/30 to-transparent' : 'bg-gradient-radial from-green-500/40 to-transparent'}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 0.5, 1, 0],
                scale: [0.5, 2, 1.5, 2, 3]
              }}
              transition={{ duration: 1.5 }}
            />

            {/* Partículas de explosão */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={`absolute w-4 h-4 ${isEpic ? 'bg-yellow-400' : 'bg-green-400'} rounded-full`}
                initial={{ 
                  x: 0, 
                  y: 0,
                  scale: 0
                }}
                animate={{ 
                  x: particle.x - window.innerWidth / 2,
                  y: particle.y - window.innerHeight / 2,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}

            {/* Mensagem principal */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1.6,
                rotate: 0
              }}
              transition={{ 
                duration: 1,
                type: "spring",
                damping: 10,
                stiffness: 100
              }}
            >
              <div className={`
                ${isEpic 
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' 
                  : 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
                }
                p-8 rounded-3xl shadow-2xl border-4 border-white/80
                text-center max-w-2xl mx-4
              `}
              style={{
                boxShadow: isEpic 
                  ? '0 0 100px rgba(255, 215, 0, 0.8), 0 0 200px rgba(255, 215, 0, 0.4), inset 0 0 50px rgba(255,255,255,0.5)'
                  : '0 0 60px rgba(34, 197, 94, 0.8), 0 0 120px rgba(34, 197, 94, 0.4), inset 0 0 30px rgba(255,255,255,0.3)'
              }}
              >
                {/* Container com pulse animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {/* Título animado */}
                  <h2 
                    className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 text-white"
                    style={{
                      textShadow: '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.5)'
                    }}
                  >
                    {isEpic ? '🎰 JACKPOT! 🎰' : '🎉 GANHOU! 🎉'}
                  </h2>
                  
                  {/* Mensagem */}
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                    {message}
                  </p>
                  
                  {/* Emojis girando */}
                  <motion.div
                    className="flex justify-center gap-4 text-5xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {isEpic ? (
                      <>💰 🏆 💎 🚀 ⭐</>
                    ) : (
                      <>🎊 ✨ 🎈 🌟 🎯</>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              {/* Raios de luz para mega vitórias */}
              {isEpic && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-48 bg-gradient-to-t from-transparent via-yellow-400/50 to-transparent"
                      style={{
                        transform: `rotate(${i * 30}deg)`,
                        transformOrigin: 'center bottom'
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Fogos de artifício laterais */}
            <motion.div
              className="absolute top-20 left-20 text-8xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5],
                opacity: [0, 1, 0],
                rotate: 720
              }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              🎆
            </motion.div>
            <motion.div
              className="absolute top-20 right-20 text-8xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5],
                opacity: [0, 1, 0],
                rotate: -720
              }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              🎇
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-20 text-8xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5],
                opacity: [0, 1, 0],
                rotate: 720
              }}
              transition={{ duration: 1.5, delay: 0.4 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute bottom-20 right-20 text-8xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 1.5],
                opacity: [0, 1, 0],
                rotate: -720
              }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              🌟
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinExplosion;