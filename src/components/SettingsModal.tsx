import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  effectsEnabled: boolean;
  setEffectsEnabled: (value: boolean) => void;
  onVolumeChange: (type: 'effects' | 'background', value: number) => void;
  effectsVolume: number;
  backgroundVolume: number;
}

const SettingsModal = ({
  isOpen,
  onClose,
  soundEnabled,
  setSoundEnabled,
  effectsEnabled,
  setEffectsEnabled,
  onVolumeChange,
  effectsVolume,
  backgroundVolume
}: SettingsModalProps) => {
  const [localEffectsVolume, setLocalEffectsVolume] = useState(effectsVolume);
  const [localBackgroundVolume, setLocalBackgroundVolume] = useState(backgroundVolume);

  useEffect(() => {
    setLocalEffectsVolume(effectsVolume);
    setLocalBackgroundVolume(backgroundVolume);
  }, [effectsVolume, backgroundVolume]);

  const handleEffectsVolumeChange = (value: number) => {
    setLocalEffectsVolume(value);
    onVolumeChange('effects', value);
  };

  const handleBackgroundVolumeChange = (value: number) => {
    setLocalBackgroundVolume(value);
    onVolumeChange('background', value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 max-w-md w-full border-4 border-yellow-600 shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">⚙️ Configurações</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✖
                </button>
              </div>

              {/* Sound Settings */}
              <div className="space-y-6">
                {/* Master Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Som Master</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`
                      w-16 h-8 rounded-full transition-all duration-300 relative
                      ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'}
                    `}
                  >
                    <motion.div
                      animate={{ x: soundEnabled ? 32 : 0 }}
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                {/* Effects Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">🔊 Volume dos Efeitos</span>
                    <span className="text-yellow-400">{Math.round(localEffectsVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localEffectsVolume * 100}
                    onChange={(e) => handleEffectsVolumeChange(Number(e.target.value) / 100)}
                    disabled={!soundEnabled}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${localEffectsVolume * 100}%, #374151 ${localEffectsVolume * 100}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Background Music Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">🎵 Volume da Música</span>
                    <span className="text-yellow-400">{Math.round(localBackgroundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localBackgroundVolume * 100}
                    onChange={(e) => handleBackgroundVolumeChange(Number(e.target.value) / 100)}
                    disabled={!soundEnabled}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${localBackgroundVolume * 100}%, #374151 ${localBackgroundVolume * 100}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Visual Effects Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">✨ Efeitos Visuais</span>
                  <button
                    onClick={() => setEffectsEnabled(!effectsEnabled)}
                    className={`
                      w-16 h-8 rounded-full transition-all duration-300 relative
                      ${effectsEnabled ? 'bg-green-600' : 'bg-gray-600'}
                    `}
                  >
                    <motion.div
                      animate={{ x: effectsEnabled ? 32 : 0 }}
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                {/* Presets */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-3">Presets Rápidos</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSoundEnabled(false);
                        setEffectsEnabled(false);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                      🔇 Mudo
                    </button>
                    <button
                      onClick={() => {
                        setSoundEnabled(true);
                        handleEffectsVolumeChange(0.5);
                        handleBackgroundVolumeChange(0.3);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                      🔉 Baixo
                    </button>
                    <button
                      onClick={() => {
                        setSoundEnabled(true);
                        handleEffectsVolumeChange(1);
                        handleBackgroundVolumeChange(0.7);
                        setEffectsEnabled(true);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                      🔊 Alto
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={onClose}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Salvar e Fechar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;