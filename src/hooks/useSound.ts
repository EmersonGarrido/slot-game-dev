/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useEffect } from 'react';

// URLs de sons gratuitos (vamos usar sons embutidos ou de CDN)
const SOUNDS = {
  spin: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE',
  stop: 'data:audio/wav;base64,UklGRkQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAFAACAAAAA//8AAP//AAD//wAAAAAAAAAA//8AAP//AAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAA',
  win: 'data:audio/wav;base64,UklGRvwGAABXQVZFZm10IBAAAAABAAEAiBUAABAXAAACABAAZGF0YdgGAACBgoOFhoeIiouNjY+QkpOUlZaYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq',
  lose: 'data:audio/wav;base64,UklGRrgGAABXQVZFZm10IBAAAAABAAEAiBUAABAXAAACABAAZGF0YZQGAADNzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs',
  epic: 'data:audio/wav;base64,UklGRjwHAABXQVZFZm10IBAAAAABAAEAiBUAABAXAAACABAAZGF0YRgHAAB/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/',
  alarm: 'data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAiBUAABAXAAACABAAZGF0YUAGAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA',
  click: 'data:audio/wav;base64,UklGRogCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWQCAAD//wAA//8AAP//AAAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA',
}

export const useSound = (enabled: boolean = true) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Cria o contexto de áudio
    if (typeof window !== 'undefined' && !audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Pré-carrega todos os sons
    Object.keys(SOUNDS).forEach(key => {
      const audio = new Audio(SOUNDS[key as keyof typeof SOUNDS]);
      audio.preload = 'auto';
      audio.volume = 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      // Limpa os áudios ao desmontar
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((soundName: keyof typeof SOUNDS, volume: number = 0.5) => {
    if (!enabled) return;

    try {
      // Resume o contexto se estiver suspenso
      if (audioContext.current?.state === 'suspended') {
        audioContext.current.resume();
      }

      const audio = audioRefs.current[soundName];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = Math.min(1, Math.max(0, volume));

        // Cria uma nova promessa para tocar o som
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Audio play failed:', error);
            // Tenta tocar novamente após interação do usuário
          });
        }
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }, [enabled]);

  const stopSound = useCallback((soundName: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  // Função para criar sons procedurais simples
  const createProceduralSound = useCallback((type: 'spin' | 'win' | 'lose' | 'click') => {
    if (!enabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'spin':
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'win':
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'lose':
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'click':
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
    }
  }, [enabled]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    createProceduralSound
  };
};