import { motion } from 'framer-motion';

const ElephantMascot = () => {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none
                 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] 
                 md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]
                 mt-20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.3, 
        scale: 1,
        y: [0, -10, 0]
      }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1, type: "spring" },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <motion.img
        src="/elefante-php.webp"
        alt="ElePHPant - Mascote do Jogo"
        className="w-full h-full object-contain drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.5))'
        }}
        animate={{
          rotate: [-3, 3, -3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default ElephantMascot;