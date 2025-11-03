import { useRef, useState, useEffect } from "react";

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

export function useSound(config: SoundConfig = { enabled: true, volume: 0.5 }) {
  const [enabled, setEnabled] = useState(config.enabled);
  const sounds = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    // Preload sounds (optional - có thể thêm sound files sau)
    const soundPaths: Record<string, string> = {
      click: "/sounds/click.mp3",
      correct: "/sounds/correct.mp3",
      wrong: "/sounds/wrong.mp3",
      success: "/sounds/success.mp3",
    };

    Object.entries(soundPaths).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = config.volume;
      audio.preload = "auto";
      sounds.current.set(key, audio);
    });
  }, [config.volume]);

  const play = (soundName: string) => {
    if (!enabled) return;
    
    const audio = sounds.current.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore errors if audio fails to play
      });
    }
  };

  const toggle = () => setEnabled(!enabled);

  return { play, enabled, toggle };
}

