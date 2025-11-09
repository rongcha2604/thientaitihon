// Sound Effects Manager
// Sử dụng Web Audio API để tạo synthetic sounds

class SoundManager {
  private enabled: boolean = true;
  private volume: number = 0.5;
  private audioContext: AudioContext | null = null;

  constructor() {
    // Load preference từ localStorage
    const savedEnabled = localStorage.getItem('soundEnabled');
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }
    
    const savedVolume = localStorage.getItem('soundVolume');
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.log('AudioContext not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Ignore errors (user might not have interacted with page yet)
      console.log('Sound play error:', e);
    }
  }

  private playMP3(filePath: string, fallback?: () => void) {
    if (!this.enabled) return;
    
    try {
      const audio = new Audio(filePath);
      audio.volume = this.volume;
      
      audio.onerror = () => {
        // Fallback to synthetic sound if mp3 fails to load
        console.warn(`Failed to load audio: ${filePath}`);
        if (fallback) {
          fallback();
        }
      };
      
      audio.play().catch((error) => {
        // Handle autoplay restrictions
        console.warn('Audio play failed:', error);
        if (fallback) {
          fallback();
        }
      });
    } catch (error) {
      console.error('Error playing MP3:', error);
      if (fallback) {
        fallback();
      }
    }
  }

  private getRandomCongratulation(): string {
    const randomNum = Math.floor(Math.random() * 10) + 1; // 1-10
    const paddedNum = String(randomNum).padStart(2, '0'); // 01-10
    return `/audio/correct-${paddedNum}.mp3`;
  }

  private getRandomEncouragement(): string {
    const randomNum = Math.floor(Math.random() * 10) + 1; // 1-10
    const paddedNum = String(randomNum).padStart(2, '0'); // 01-10
    return `/audio/wrong-${paddedNum}.mp3`;
  }

  public play(soundName: 'correct' | 'wrong' | 'success' | 'achievement' | 'levelUp' | 'tap') {
    if (!this.enabled) return;
    
    switch (soundName) {
      case 'correct':
        // Play random congratulation MP3, fallback to synthetic sound
        this.playMP3(
          this.getRandomCongratulation(),
          () => this.playTone(800, 0.1, 'sine')
        );
        break;
      case 'wrong':
        // Play random encouragement MP3, fallback to synthetic sound
        this.playMP3(
          this.getRandomEncouragement(),
          () => this.playTone(400, 0.15, 'sawtooth')
        );
        break;
      case 'success':
        this.playTone(600, 0.3, 'sine');
        break;
      case 'achievement':
        this.playTone(1000, 0.5, 'sine');
        break;
      case 'levelUp':
        this.playTone(1200, 0.4, 'sine');
        break;
      case 'tap':
        this.playTone(300, 0.05, 'square');
        break;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('soundEnabled', String(enabled));
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundVolume', String(this.volume));
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (soundName: 'correct' | 'wrong' | 'success' | 'achievement' | 'levelUp' | 'tap') => {
  soundManager.play(soundName);
};

export const setSoundEnabled = (enabled: boolean) => {
  soundManager.setEnabled(enabled);
};

export const setSoundVolume = (volume: number) => {
  soundManager.setVolume(volume);
};

