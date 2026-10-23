// Original synthesized melodies and effects. No recordings or external assets.
export class RetroAudio {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.zone = "village";
    this.step = 0;
    this.next = 0;
  }
  async toggle() {
    if (this.enabled) {
      this.enabled = false;
      try {
        await this.context?.suspend();
      } catch {
        this.context = null;
      }
      return false;
    }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return false;
    let timeout;
    try {
      this.context ??= new Audio();
      // Missing audio devices or browser policy can leave resume pending forever.
      const resumed = await Promise.race([
        this.context.resume().then(() => true),
        new Promise((resolve) => {
          timeout = setTimeout(() => resolve(false), 2500);
        }),
      ]);
      if (!resumed || this.context.state !== "running") {
        void this.context.close().catch(() => {});
        this.context = null;
        return false;
      }
      this.enabled = true;
      this.next = 0;
      return true;
    } catch {
      this.enabled = false;
      if (this.context) void this.context.close().catch(() => {});
      this.context = null;
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }
  tone(freq, duration = 0.12, type = "square", volume = 0.025, at) {
    if (!this.enabled || !this.context || this.context.state !== "running")
      return;
    const now = at ?? this.context.currentTime,
      osc = this.context.createOscillator(),
      gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
  effect(name) {
    const notes = {
      attack: [220, 100],
      hurt: [130, 65],
      talk: [440, 550],
      buy: [523, 659, 784],
      heal: [392, 523, 659],
      pickup: [659, 880],
      secret: [262, 330, 392, 523],
      level: [392, 494, 587, 784],
    };
    (notes[name] || notes.talk).forEach((n, i) =>
      this.tone(
        n,
        0.12,
        "square",
        0.025,
        (this.context?.currentTime || 0) + i * 0.065,
      ),
    );
  }
  tick(zone, paused = false) {
    if (!this.enabled || !this.context) return;
    const track =
      zone === "Öreg erdő" || zone === "Rejtett pince" ? "forest" : "village";
    if (track !== this.zone) {
      this.zone = track;
      this.step = 0;
      this.next = 0;
    }
    const now = this.context.currentTime;
    if (paused) {
      this.next = now + 0.1;
      return;
    }
    if (now < this.next) return;
    const melody =
      track === "village"
        ? [
            392, 494, 587, 494, 440, 523, 659, 587, 494, 440, 392, 330, 349,
            392, 440, 294,
          ]
        : [
            220, 262, 330, 294, 220, 247, 294, 262, 196, 247, 294, 262, 220,
            196, 165, 196,
          ];
    this.tone(melody[this.step % 16], 0.28, "triangle", 0.045);
    if (this.step % 4 === 0)
      this.tone(track === "village" ? 130.81 : 110, 0.7, "triangle", 0.035);
    this.step++;
    this.next = now + (track === "village" ? 0.29 : 0.36);
  }
}
