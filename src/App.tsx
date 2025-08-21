import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotMachine from './components/SlotMachine';
import Background from './components/Background';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center p-2 sm:p-4"
          >
            <Background />
            <div className="relative z-10 w-full max-w-6xl">
              <SlotMachine />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;