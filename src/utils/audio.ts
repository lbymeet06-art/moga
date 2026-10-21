// Nostalgic 2000s Cyworld Minihompy Web Audio Melodies & Sound FX

class RetroSoundSystem {
  private ctx: AudioContext | null = null;
  private isPlayingBgm: boolean = false;
  private bgmTimeoutId: any = null;
  private noteIndex: number = 0;
  private masterGain: GainNode | null = null;
  private volume: number = 0.2;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pleasant retro button click
  public playClick() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore audio failure
    }
  }

  // Play lovely heart like chime
  public playHeartSound() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch {
      // Ignore
    }
  }

  // Play Cyworld nostalgic 2000s Lo-Fi acoustic melody
  // Notes corresponding to a sweet nostalgic chord progression
  private melodyNotes: { f: number; d: number }[] = [
    { f: 329.63, d: 400 }, // E4
    { f: 392.0, d: 400 }, // G4
    { f: 493.88, d: 600 }, // B4
    { f: 440.0, d: 400 }, // A4
    { f: 392.0, d: 400 }, // G4
    { f: 329.63, d: 800 }, // E4
    { f: 293.66, d: 400 }, // D4
    { f: 329.63, d: 400 }, // E4
    { f: 392.0, d: 600 }, // G4
    { f: 369.99, d: 400 }, // F#4
    { f: 293.66, d: 800 }, // D4
    { f: 261.63, d: 400 }, // C4
    { f: 329.63, d: 400 }, // E4
    { f: 392.0, d: 600 }, // G4
    { f: 440.0, d: 400 }, // A4
    { f: 493.88, d: 400 }, // B4
    { f: 523.25, d: 800 }, // C5
  ];

  public toggleBgm(onStateChange?: (playing: boolean) => void): boolean {
    this.initCtx();
    if (this.isPlayingBgm) {
      this.stopBgm();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.startBgm();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  private playNextNote() {
    if (!this.isPlayingBgm || !this.ctx || !this.masterGain) return;
    const note = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
    this.noteIndex++;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const duration = note.d / 1000;

    // Cozy electric piano / bell synth timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.f, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.95);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);

    this.bgmTimeoutId = setTimeout(() => {
      this.playNextNote();
    }, note.d);
  }

  public startBgm() {
    this.initCtx();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.noteIndex = 0;
    this.playNextNote();
  }

  public stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingBgm;
  }
}

export const retroSound = new RetroSoundSystem();
