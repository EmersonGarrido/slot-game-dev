import { useEffect, useRef } from 'react';

export const useBackgroundMusic = (enabled: boolean, volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cria o elemento de áudio para música de fundo
    if (!audioRef.current) {
      audioRef.current = new Audio('/music-background.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    // Controla play/pause baseado em enabled
    if (enabled && audioRef.current.paused) {
      audioRef.current.play().catch(error => {
        console.log('Background music autoplay blocked:', error);
        // Tenta tocar após interação do usuário
        document.addEventListener('click', () => {
          if (audioRef.current && enabled) {
            audioRef.current.play();
          }
        }, { once: true });
      });
    } else if (!enabled && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [enabled]);

  // Atualiza volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, volume));
    }
  }, [volume]);

  const playMusic = () => {
    if (audioRef.current && enabled) {
      audioRef.current.play();
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const setMusicVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, newVolume));
    }
  };

  return {
    playMusic,
    pauseMusic,
    setMusicVolume
  };
};