// ============================================================
// ÁUDIO SINTETIZADO (Web Audio API, sem arquivos externos)
// ============================================================
HDP.Audio = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            this.ctx = new AC();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },

    toggleMute() { this.muted = !this.muted; return this.muted; },

    play(freq, dur, type = 'sine', vol = 0.3) {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + dur);
        } catch (e) { /* ignore */ }
    },

    jump() { this.play(400, 0.1, 'sine', 0.2); },
    collect() { this.play(600, 0.15, 'square', 0.25); setTimeout(() => this.play(800, 0.15, 'square', 0.2), 100); },
    coin() { this.play(880, 0.15, 'sine', 0.3); setTimeout(() => this.play(1100, 0.15, 'sine', 0.2), 150); },
    heart() { this.play(1200, 0.3, 'sine', 0.4); setTimeout(() => this.play(1500, 0.3, 'sine', 0.3), 200); },
    hit() { this.play(200, 0.2, 'sawtooth', 0.4); },
    thunder() { this.play(60, 0.6, 'sawtooth', 0.35); setTimeout(() => this.play(45, 0.8, 'triangle', 0.25), 90); },
    kill() { this.play(300, 0.2, 'sawtooth', 0.3); setTimeout(() => this.play(500, 0.2, 'sawtooth', 0.25), 150); },
    rescue() { [660, 880, 1100].forEach((f, i) => setTimeout(() => this.play(f, 0.25, 'sine', 0.3), i * 130)); },
    levelUp() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => this.play(f, 0.2, 'triangle', 0.25), i * 100)); },
    special() { this.play(200, 0.05, 'square', 0.3); this.play(600, 0.3, 'sine', 0.25); },
    victory() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.play(f, 0.3, 'sine', 0.25), i * 200)); },
    gameover() { [400, 350, 300, 250].forEach((f, i) => setTimeout(() => this.play(f, 0.3, 'sawtooth', 0.3), i * 200)); },
    click() { this.play(400, 0.08, 'sine', 0.15); }
};
