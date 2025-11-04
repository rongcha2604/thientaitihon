import { useRef, useState, useEffect } from "react";

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

// Audio files structure - Tiếng người thật (MP3)
const AUDIO_FILES = {
  correct: Array.from({ length: 10 }, (_, i) => 
    `/sounds/correct/correct-${String(i + 1).padStart(2, '0')}.mp3`
  ),
  wrong: Array.from({ length: 10 }, (_, i) => 
    `/sounds/wrong/wrong-${String(i + 1).padStart(2, '0')}.mp3`
  ),
} as const;

// Web Audio API - Tạo sounds bằng code (không cần files)
function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

// Helper: Play tone với start time cụ thể (cho sequence)
function playToneWithStart(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  startTime: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume * 0.1, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine"
): void {
  playToneWithStart(ctx, frequency, duration, volume, type, ctx.currentTime);
}

function playChord(
  ctx: AudioContext,
  frequencies: number[],
  duration: number,
  volume: number
): void {
  frequencies.forEach((freq) => {
    playTone(ctx, freq, duration, volume, "sine");
  });
}

// Victory Fanfare - Chúc mừng vui nhộn (3 tones sequential)
function playVictoryFanfare(ctx: AudioContext, volume: number): void {
  const frequencies = [400, 600, 800];
  const toneDuration = 0.2;
  
  frequencies.forEach((freq, index) => {
    const startTime = ctx.currentTime + index * toneDuration;
    playToneWithStart(ctx, freq, toneDuration, volume, "sine", startTime);
  });
}

// Gentle Encouragement - Động viên tích cực (nhẹ nhàng, không buồn)
function playEncouragement(ctx: AudioContext, volume: number): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Gentle rise: 350Hz → 450Hz (tích cực, không buồn)
  oscillator.frequency.setValueAtTime(350, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.4);
  oscillator.type = "sine";

  // Soft volume, gentle attack
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.4);
}


export function useSound(config: SoundConfig = { enabled: true, volume: 0.3 }) {
  const [enabled, setEnabled] = useState(config.enabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Cache cho MP3 audio files
  const mp3CacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const availableMP3Ref = useRef<{ correct: string[]; wrong: string[] }>({
    correct: [],
    wrong: [],
  });

  // Preload và check MP3 files availability
  useEffect(() => {
    if (!enabled) return;

    const checkAndPreload = async (files: string[], type: 'correct' | 'wrong') => {
      const available: string[] = [];
      
      for (const path of files) {
        try {
          const audio = new Audio(path);
          audio.volume = config.volume;
          audio.preload = 'auto';
          
          // Check if file exists
          await new Promise<void>((resolve) => {
            audio.addEventListener('canplaythrough', () => {
              mp3CacheRef.current.set(path, audio);
              available.push(path);
              resolve();
            }, { once: true });
            
            audio.addEventListener('error', () => {
              // File không tồn tại, skip
              resolve();
            }, { once: true });
            
            // Trigger load
            audio.load();
          });
        } catch {
          // Skip nếu có lỗi
        }
      }
      
      availableMP3Ref.current[type] = available;
    };

    // Check và preload MP3 files
    checkAndPreload(AUDIO_FILES.correct, 'correct');
    checkAndPreload(AUDIO_FILES.wrong, 'wrong');
  }, [enabled, config.volume]);

  // Helper: Resume AudioContext nếu bị suspended (browser policy)
  const resumeAudioContext = async (ctx: AudioContext): Promise<void> => {
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (error) {
        // Ignore resume errors silently
      }
    }
  };

  // Play MP3 file (tiếng người thật) - Random selection
  const playRandomMP3 = (type: 'correct' | 'wrong') => {
    const available = availableMP3Ref.current[type];
    if (available.length === 0) return false; // Không có files

    // Random pick 1 file
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedPath = available[randomIndex];
    const audio = mp3CacheRef.current.get(selectedPath);

    if (audio) {
      audio.currentTime = 0;
      audio.volume = config.volume;
      audio.play().catch(() => {
        // Ignore play errors (autoplay policy, etc.)
      });
      return true; // Successfully played
    }

    return false; // Failed to play
  };

  const play = async (soundName: string) => {
    if (!enabled) return;
    
    try {
      // Helper: Get or create AudioContext and resume if needed
      const getAudioContext = async (): Promise<AudioContext | null> => {
        let ctx = audioContextRef.current;
        if (!ctx) {
          ctx = createAudioContext();
          if (!ctx) return null;
          audioContextRef.current = ctx;
        }
        // Resume context nếu bị suspended (user gesture required)
        await resumeAudioContext(ctx);
        return ctx;
      };

      switch (soundName) {
        case "click":
          // Short beep - Always use Web Audio
          const ctxClick = await getAudioContext();
          if (ctxClick) {
            playTone(ctxClick, 800, 0.15, config.volume, "sine");
          }
          break;

        case "correct":
          // Try MP3 first (tiếng người thật), fallback to Web Audio
          if (!playRandomMP3('correct')) {
            // Fallback: Victory Fanfare
            const ctxCorrect = await getAudioContext();
            if (ctxCorrect) {
              playVictoryFanfare(ctxCorrect, config.volume);
            }
          }
          break;

        case "wrong":
          // Try MP3 first (tiếng người thật), fallback to Web Audio
          if (!playRandomMP3('wrong')) {
            // Fallback: Gentle Encouragement
            const ctxWrong = await getAudioContext();
            if (ctxWrong) {
              playEncouragement(ctxWrong, config.volume);
            }
          }
          break;

        case "success":
          // Pleasant chord - Always use Web Audio
          const ctxSuccess = await getAudioContext();
          if (ctxSuccess) {
            playChord(ctxSuccess, [523.25, 659.25, 783.99], 0.8, config.volume); // C, E, G
          }
          break;

        default:
          break;
      }
    } catch (error) {
      // Ignore errors silently
    }
  };

  const toggle = () => setEnabled(!enabled);

  return { play, enabled, toggle };
}

