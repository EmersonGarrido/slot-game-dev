import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  type?: 'win' | 'epic_win';
}

const Confetti = ({ trigger, type = 'win' }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; emoji: string }>>([]);

  useEffect(() => {
    if (trigger) {
      const emojis = type === 'epic_win' 
        ? ['🎉', '🎊', '💰', '🏆', '⭐', '✨', '🎯', '🚀', '💎', '🔥']
        : ['🎉', '🎊', '⭐', '✨', '🎈'];
      
      const newParticles = Array.from({ length: type === 'epic_win' ? 50 : 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
      }, 3000);
    }
  }, [trigger, type]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none text-4xl z-50"
          initial={{ 
            x: particle.x, 
            y: window.innerHeight / 2 - 100,
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            y: window.innerHeight + 100,
            opacity: [1, 1, 0],
            scale: [0, 1.5, 1],
            x: particle.x + (Math.random() - 0.5) * 200,
            rotate: Math.random() * 720
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 3,
            ease: [0.45, 0.05, 0.55, 0.95]
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default Confetti;