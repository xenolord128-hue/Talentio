// High-Fidelity Web Audio Synthesizer and Voice Audio Engine (No external asset dependency)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeVoiceOscillators: any[] = [];
  private voiceStopTimeout: any = null;

  public getContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Play a gentle message send pop
  playMessageSent() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio not permitted or unsupported
    }
  }

  // Play a soft message received alert
  playMessageReceived() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(880.00, now + 0.08); // A5

      osc2.frequency.setValueAtTime(329.63, now);
      osc2.frequency.setValueAtTime(440.00, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {
      // Audio not permitted
    }
  }

  // Voice synthesis is replaced by clean native audio playback in VoiceNotePlayer
  playVoiceSynthesis(
    _waveform: number[], 
    _durationSeconds: number, 
    _startFraction: number = 0,
    _onProgress?: (progressFraction: number, currentTimeSec: number) => void,
    onEnd?: () => void
  ) {
    this.stopVoiceSynthesis();
    if (onEnd) onEnd();
    return () => {};
  }

  // Stop any active synthesized voice note
  stopVoiceSynthesis() {
    if (this.voiceStopTimeout) {
      clearTimeout(this.voiceStopTimeout);
      this.voiceStopTimeout = null;
    }
    if (this.activeVoiceOscillators && this.activeVoiceOscillators.length > 0) {
      this.activeVoiceOscillators.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // Ignored
        }
      });
      this.activeVoiceOscillators = [];
    }
  }

  // Dictation listening started chime (gentle rising double-pip)
  playDictationStart() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio not permitted
    }
  }

  // Dictation listening stopped chime (gentle falling soft tone)
  playDictationStop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio not permitted
    }
  }
}

export const soundEffects = new SoundEngine();
