import { motion, AnimatePresence } from 'framer-motion';

interface WinExplosionProps {
  show: boolean;
  message: string;
  severity?: 'win' | 'epic_win' | 'lose' | 'epic_lose' | 'neutral' | null;
}

const WinExplosion = ({ show, message, severity }: WinExplosionProps) => {
  if (!severity || severity === 'lose' || severity === 'epic_lose' || severity === 'neutral') return null;

  const isEpic = severity === 'epic_win';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background flash */}
          <motion.div
            className={`absolute inset-0 ${isEpic ? 'bg-yellow-500' : 'bg-green-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.6 }}
          />

          {/* Main message */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1.2, 1.3],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              bounce: 0.5
            }}
          >
            <div className={`
              ${isEpic 
                ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white' 
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-white'
              }
              px-8 py-6 rounded-2xl shadow-2xl border-4 border-white
              text-center max-w-md mx-4
            `}
            style={{
              boxShadow: isEpic 
                ? '0 0 60px rgba(255, 215, 0, 0.8), 0 0 120px rgba(255, 215, 0, 0.4)'
                : '0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)'
            }}
            >
              <motion.h2 
                className="text-4xl sm:text-5xl font-black mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 10px rgba(255,255,255,0.8)',
                    '0 0 30px rgba(255,255,255,1)',
                    '0 0 10px rgba(255,255,255,0.8)'
                  ]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {isEpic ? '🏆 JACKPOT! 🏆' : '🎉 PARABÉNS! 🎉'}
              </motion.h2>
              <p className="text-xl sm:text-2xl font-bold">
                {message}
              </p>
              {isEpic && (
                <motion.p 
                  className="text-lg mt-2 font-semibold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  +500 CRÉDITOS!
                </motion.p>
              )}
            </div>

            {/* Radiating lines for epic wins */}
            {isEpic && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-yellow-400 to-transparent"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      transformOrigin: 'center bottom'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Side explosions */}
          <motion.div
            className="absolute top-1/2 left-1/4 text-6xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            💥
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-1/4 text-6xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              rotate: -360
            }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            💥
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinExplosion;