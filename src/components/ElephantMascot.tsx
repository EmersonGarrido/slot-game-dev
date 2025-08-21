import { motion } from 'framer-motion';

const ElephantMascot = () => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-20 pointer-events-none
                 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] 
                 md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px]"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -20, 0]
      }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1, type: "spring" },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <motion.img
        src="/elefante-php.webp"
        alt="ElePHPant - Mascote do Jogo"
        className="w-full h-full object-contain drop-shadow-2xl"
        animate={{
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Sparkles around the elephant */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <span className="absolute -top-2 left-1/2 text-yellow-400 text-xl">✨</span>
        <span className="absolute -bottom-2 left-1/2 text-yellow-400 text-xl">✨</span>
        <span className="absolute top-1/2 -left-2 text-yellow-400 text-xl">✨</span>
        <span className="absolute top-1/2 -right-2 text-yellow-400 text-xl">✨</span>
      </motion.div>
      
      {/* Speech bubble that appears occasionally */}
      <motion.div
        className="absolute -top-10 -left-16 bg-white rounded-lg px-2 py-1 shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 10
        }}
      >
        <p className="text-xs font-bold text-purple-600">PHP wins! 🎰</p>
        <div className="absolute bottom-0 right-4 w-0 h-0 
                        border-l-[8px] border-l-transparent
                        border-t-[8px] border-t-white
                        border-r-[8px] border-r-transparent
                        translate-y-full"></div>
      </motion.div>
    </motion.div>
  );
};

export default ElephantMascot;