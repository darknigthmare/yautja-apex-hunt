// Web Audio API Sound Engine for Yautja: Apex Hunt (Ultimate Lore Edition)

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.muted = false;

    // Adaptive Music Nodes
    this.bgmOsc = null;
    this.bgmGain = null;
    this.currentBgmState = 'stealth';
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.initialized = true;
      if (this.muted) this.ctx.suspend();
      this.startAmbientJungle();
      this.startAdaptiveBGM();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (!this.ctx) return;
    if (this.muted) this.ctx.suspend();
    else this.ctx.resume();
  }

  // Yautja Victory Roar [R] (Chest Thumping Power Roar)
  playVictoryRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(60, now + 2.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.2);

    // Sub-bass thud for chest thumping
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.8);
  }

  // Mimicry Lure Sounds [F]
  playMimicryLure(lureType) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (lureType === 'over_here') {
      // Creepy distorted human whisper "Over here..."
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.6);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (lureType === 'radio') {
      // Military radio static chatter
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } else if (lureType === 'turn_around') {
      // Eerie distorted whisper "Turn around... turn around..."
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.linearRampToValueAtTime(185, now + 0.65);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } else {
      this.playYautjaClick();
    }
  }

  // Dynamic Adaptive BGM
  startAdaptiveBGM() {
    if (!this.ctx) return;
    this.bgmOsc = this.ctx.createOscillator();
    this.bgmGain = this.ctx.createGain();

    this.bgmOsc.type = 'triangle';
    this.bgmOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
    this.bgmGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    this.bgmOsc.connect(this.bgmGain);
    this.bgmGain.connect(this.ctx.destination);
    this.bgmOsc.start();
  }

  updateAdaptiveBGM(state) {
    if (!this.ctx || !this.bgmOsc || this.currentBgmState === state) return;
    this.currentBgmState = state;
    const now = this.ctx.currentTime;

    if (state === 'stealth') {
      this.bgmOsc.frequency.linearRampToValueAtTime(65, now + 1.0);
      this.bgmGain.gain.linearRampToValueAtTime(0.06, now + 1.0);
    } else if (state === 'combat') {
      this.bgmOsc.frequency.linearRampToValueAtTime(110, now + 0.5);
      this.bgmGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
    } else if (state === 'boss_enraged') {
      this.bgmOsc.frequency.linearRampToValueAtTime(160, now + 0.3);
      this.bgmGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    }
  }

  // Yautja Signature Clicking / Vocal Purr
  playYautjaClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now + i * 0.05);
      osc.frequency.exponentialRampToValueAtTime(150, now + i * 0.05 + 0.03);
      gain.gain.setValueAtTime(0.15, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.04);
    }
  }

  // Vision Mode Switch Tone
  playThermalSwitch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Shoulder Plasmacaster Firing Blast
  playPlasmacasterBlast() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.4);
  }

  playWristbladeSlash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playWhipSlash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.18);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playMineExplosion() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(220, now);
    subOsc.frequency.exponentialRampToValueAtTime(20, now + 0.8);
    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.8);
  }

  playAcidSizzle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playXenomorphHiss() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical H.R. Giger / Alien biomechanical predatory hiss:
    // Harsh high-frequency resonant airflow with predatory serpentine rasp
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.7);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.65);
    filter.Q.setValueAtTime(3.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.42, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.68);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playInnerJawSnap() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Pharyngeal inner jaw pneumatic extension and lethal snap:
    // High-pressure piston burst followed by sharp chitinous clamp
    const pistonOsc = this.ctx.createOscillator();
    const pistonGain = this.ctx.createGain();
    pistonOsc.type = 'sawtooth';
    pistonOsc.frequency.setValueAtTime(450, now);
    pistonOsc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
    pistonGain.gain.setValueAtTime(0.4, now);
    pistonGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    pistonOsc.connect(pistonGain);
    pistonGain.connect(this.ctx.destination);
    pistonOsc.start(now);
    pistonOsc.stop(now + 0.095);

    const snapBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.12), this.ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapData.length; i++) snapData[i] = (Math.random() * 2 - 1) * 0.5;
    const snapNoise = this.ctx.createBufferSource();
    snapNoise.buffer = snapBuffer;
    const snapFilter = this.ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(2400, now + 0.03);
    const snapGain = this.ctx.createGain();
    snapGain.gain.setValueAtTime(0.5, now + 0.03);
    snapGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
    snapNoise.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapNoise.start(now + 0.03);
  }

  playCanopyLeap() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSpearThrow() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playNetgunLaunch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Predator 2 (1990) Netgun pneumatic launch & tightening cable whir:
    // Pneumatic pop followed by high-tension wire stretch chirp
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(320, now);
    popOsc.frequency.exponentialRampToValueAtTime(65, now + 0.12);
    popGain.gain.setValueAtTime(0.45, now);
    popGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.13);

    const wireOsc = this.ctx.createOscillator();
    const wireGain = this.ctx.createGain();
    wireOsc.type = 'triangle';
    wireOsc.frequency.setValueAtTime(1100, now + 0.04);
    wireOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.22);
    wireGain.gain.setValueAtTime(0.01, now + 0.04);
    wireGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    wireGain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
    wireOsc.connect(wireGain);
    wireGain.connect(this.ctx.destination);
    wireOsc.start(now + 0.04);
    wireOsc.stop(now + 0.23);
  }

  playSmartDiscWhir() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Predator 2 Smart Disc gyroscopic spin and metallic razor sweep
    const discOsc = this.ctx.createOscillator();
    const discGain = this.ctx.createGain();
    discOsc.type = 'sawtooth';
    discOsc.frequency.setValueAtTime(1800, now);
    discOsc.frequency.linearRampToValueAtTime(950, now + 0.18);
    discGain.gain.setValueAtTime(0.35, now);
    discGain.gain.exponentialRampToValueAtTime(0.005, now + 0.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(4.0, now);

    discOsc.connect(filter);
    filter.connect(discGain);
    discGain.connect(this.ctx.destination);
    discOsc.start(now);
    discOsc.stop(now + 0.21);
  }

  playMedicompHeal() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(280, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(90, now + 1.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playMonsterFootstep() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playMonsterRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.6);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
  }

  playJungleHunterRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Predator (1987) Jungle Hunter iconic roar (Kevin Peter Hall / Peter Cullen):
    // Dual throat roar with rich mid-range vocal flutter and deep chest cavity resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.linearRampToValueAtTime(265, now + 0.45);
    osc.frequency.exponentialRampToValueAtTime(52, now + 1.75);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.58, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 1.75);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, now);
    filter.Q.setValueAtTime(2.2, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.78);

    // Deep sub-bass guttural vibration
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.25);
    subGain.gain.setValueAtTime(0.55, now);
    subGain.gain.exponentialRampToValueAtTime(0.005, now + 1.25);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.28);
  }

  playBerserkerRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Predators (2010) Mr. Black / Berserker guttural bellow:
    // Heavy dual-oscillator throat roar with subterranean sub-bass rumble
    const throatOsc = this.ctx.createOscillator();
    const throatGain = this.ctx.createGain();
    throatOsc.type = 'sawtooth';
    throatOsc.frequency.setValueAtTime(85, now);
    throatOsc.frequency.linearRampToValueAtTime(210, now + 0.4);
    throatOsc.frequency.exponentialRampToValueAtTime(45, now + 1.8);
    throatGain.gain.setValueAtTime(0.01, now);
    throatGain.gain.linearRampToValueAtTime(0.55, now + 0.35);
    throatGain.gain.exponentialRampToValueAtTime(0.005, now + 1.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + 1.8);

    throatOsc.connect(filter);
    filter.connect(throatGain);
    throatGain.connect(this.ctx.destination);
    throatOsc.start(now);
    throatOsc.stop(now + 1.82);

    // Deep sub-bass chest rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);
    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.005, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.22);
  }

  // Predator 2 (1990) — Rebreather multispectral du City Hunter :
  // cycle d'aspiration pneumatique et décompression de valve thoracique.
  playCityHunterBreather() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Aspiration filtrée
    const breathOsc = this.ctx.createOscillator();
    const breathGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    breathOsc.type = 'sawtooth';
    breathOsc.frequency.setValueAtTime(160, now);
    breathOsc.frequency.linearRampToValueAtTime(260, now + 0.18);
    breathOsc.frequency.exponentialRampToValueAtTime(80, now + 0.55);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.linearRampToValueAtTime(1150, now + 0.18);
    filter.frequency.exponentialRampToValueAtTime(420, now + 0.55);
    filter.Q.setValueAtTime(4.2, now);

    breathGain.gain.setValueAtTime(0.01, now);
    breathGain.gain.linearRampToValueAtTime(0.28, now + 0.16);
    breathGain.gain.exponentialRampToValueAtTime(0.002, now + 0.55);

    breathOsc.connect(filter);
    filter.connect(breathGain);
    breathGain.connect(this.ctx.destination);
    breathOsc.start(now);
    breathOsc.stop(now + 0.56);

    // Clic de décompression de valve
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1850, now + 0.18);
    clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.26);
    clickGain.gain.setValueAtTime(0.01, now + 0.18);
    clickGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now + 0.18);
    clickOsc.stop(now + 0.28);
  }

  // Predators (2010) — Salve Gatling rotative du plasmacaster de Mr. Black (Berserker) :
  // rotation moteur accélérée puis trois décharges de plasma lourd cadencées.
  playBerserkerGatlingBurst() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Vrombissement de rotation mécanique du barillet
    const motorOsc = this.ctx.createOscillator();
    const motorGain = this.ctx.createGain();
    motorOsc.type = 'triangle';
    motorOsc.frequency.setValueAtTime(180, now);
    motorOsc.frequency.linearRampToValueAtTime(460, now + 0.12);
    motorOsc.frequency.exponentialRampToValueAtTime(90, now + 0.42);
    motorGain.gain.setValueAtTime(0.01, now);
    motorGain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    motorOsc.connect(motorGain);
    motorGain.connect(this.ctx.destination);
    motorOsc.start(now);
    motorOsc.stop(now + 0.45);

    // Salve de 3 impulsions lourdes en rafale rapide
    for (let index = 0; index < 3; index += 1) {
      const shotTime = now + 0.06 + (index * 0.075);
      const shotOsc = this.ctx.createOscillator();
      const shotGain = this.ctx.createGain();
      const shotFilter = this.ctx.createBiquadFilter();

      shotOsc.type = 'sawtooth';
      shotOsc.frequency.setValueAtTime(540 - (index * 40), shotTime);
      shotOsc.frequency.exponentialRampToValueAtTime(65, shotTime + 0.12);

      shotFilter.type = 'lowpass';
      shotFilter.frequency.setValueAtTime(2200, shotTime);
      shotFilter.frequency.exponentialRampToValueAtTime(280, shotTime + 0.12);

      shotGain.gain.setValueAtTime(0.01, shotTime);
      shotGain.gain.linearRampToValueAtTime(0.35, shotTime + 0.02);
      shotGain.gain.exponentialRampToValueAtTime(0.002, shotTime + 0.14);

      shotOsc.connect(shotFilter);
      shotFilter.connect(shotGain);
      shotGain.connect(this.ctx.destination);
      shotOsc.start(shotTime);
      shotOsc.stop(shotTime + 0.15);
    }
  }

  // Predators (2010) — Sifflet ultrasonique de rappel du Tracker Predator :
  // commande stridente à modulation sinusoïdale guidant la meute de Hell-Hounds.
  playTrackerWhistle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2100, now);
    osc.frequency.linearRampToValueAtTime(3200, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(1650, now + 0.42);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(19, now);
    lfoGain.gain.setValueAtTime(95, now);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.45);
    osc.stop(now + 0.45);
  }

  // Alien vs. Predator (2004) — Shuriken rétractable cérémoniel à 6 lames :
  // déploiement centrifuge métallique rapide suivi d'une rotation gyroscopique tranchante.
  playShurikenThrow() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Clic mécanique sec d'extension centrifuge des 6 lames
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(1750, now);
    snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
    snapGain.gain.setValueAtTime(0.01, now);
    snapGain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.065);

    // Vrombissement gyroscopique tranchant modulé par la vitesse de rotation
    const spinOsc = this.ctx.createOscillator();
    const spinGain = this.ctx.createGain();
    const spinFilter = this.ctx.createBiquadFilter();
    const spinLfo = this.ctx.createOscillator();
    const spinLfoGain = this.ctx.createGain();

    spinOsc.type = 'sawtooth';
    spinOsc.frequency.setValueAtTime(340, now);
    spinOsc.frequency.linearRampToValueAtTime(780, now + 0.14);
    spinOsc.frequency.exponentialRampToValueAtTime(220, now + 0.48);

    spinFilter.type = 'bandpass';
    spinFilter.frequency.setValueAtTime(950, now);
    spinFilter.frequency.linearRampToValueAtTime(1600, now + 0.16);
    spinFilter.frequency.exponentialRampToValueAtTime(450, now + 0.48);
    spinFilter.Q.setValueAtTime(5.5, now);

    spinLfo.type = 'sine';
    spinLfo.frequency.setValueAtTime(28, now); // 28 tours / seconde
    spinLfoGain.gain.setValueAtTime(80, now);
    spinLfo.connect(spinOsc.frequency);

    spinGain.gain.setValueAtTime(0.01, now);
    spinGain.gain.linearRampToValueAtTime(0.3, now + 0.04);
    spinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    spinOsc.connect(spinFilter);
    spinFilter.connect(spinGain);
    spinGain.connect(this.ctx.destination);

    spinLfo.start(now);
    spinOsc.start(now);
    spinLfo.stop(now + 0.49);
    spinOsc.stop(now + 0.49);
  }

  // Aliens vs. Predator: Requiem (2007) — Fluide dissolvant moléculaire de Wolf :
  // ébullition chimique corrosive immédiate et effervescence de vaporisation des tissus.
  playCleanerDissolve() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Grésillement chimique acide haute fréquence
    const hissOsc = this.ctx.createOscillator();
    const hissGain = this.ctx.createGain();
    const hissFilter = this.ctx.createBiquadFilter();
    hissOsc.type = 'sawtooth';
    hissOsc.frequency.setValueAtTime(1200, now);
    hissOsc.frequency.exponentialRampToValueAtTime(2600, now + 0.25);
    hissOsc.frequency.exponentialRampToValueAtTime(400, now + 0.65);

    hissFilter.type = 'bandpass';
    hissFilter.frequency.setValueAtTime(2200, now);
    hissFilter.Q.setValueAtTime(6.0, now);

    hissGain.gain.setValueAtTime(0.01, now);
    hissGain.gain.linearRampToValueAtTime(0.32, now + 0.05);
    hissGain.gain.exponentialRampToValueAtTime(0.002, now + 0.65);

    hissOsc.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(this.ctx.destination);
    hissOsc.start(now);
    hissOsc.stop(now + 0.66);

    // Ébullition / bulles acides à basse fréquence
    const boilOsc = this.ctx.createOscillator();
    const boilGain = this.ctx.createGain();
    boilOsc.type = 'triangle';
    boilOsc.frequency.setValueAtTime(210, now);
    boilOsc.frequency.exponentialRampToValueAtTime(95, now + 0.4);
    boilGain.gain.setValueAtTime(0.01, now);
    boilGain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    boilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    boilOsc.connect(boilGain);
    boilGain.connect(this.ctx.destination);
    boilOsc.start(now);
    boilOsc.stop(now + 0.46);
  }

  // Aliens vs. Predator: Requiem (2007) — Déploiement et bourdonnement des mines laser de Wolf :
  // tonalité aiguë d'armement capacitor suivie d'une pulsation électromagnétique continue.
  playLaserGridHum() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sifflement d'armement capacitif montant
    const armOsc = this.ctx.createOscillator();
    const armGain = this.ctx.createGain();
    armOsc.type = 'sine';
    armOsc.frequency.setValueAtTime(900, now);
    armOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.12);
    armGain.gain.setValueAtTime(0.01, now);
    armGain.gain.linearRampToValueAtTime(0.22, now + 0.06);
    armGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    armOsc.connect(armGain);
    armGain.connect(this.ctx.destination);
    armOsc.start(now);
    armOsc.stop(now + 0.15);

    // Bourdonnement laser électromagnétique rasoir
    const humOsc = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    const humFilter = this.ctx.createBiquadFilter();
    humOsc.type = 'sawtooth';
    humOsc.frequency.setValueAtTime(145, now + 0.08);

    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(750, now + 0.08);

    humGain.gain.setValueAtTime(0.001, now);
    humGain.gain.setValueAtTime(0.01, now + 0.08);
    humGain.gain.linearRampToValueAtTime(0.18, now + 0.14);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(this.ctx.destination);
    humOsc.start(now + 0.08);
    humOsc.stop(now + 0.53);
  }

  // Lore Yautja (1987, 1990) — Ouverture du kit médical / Baie Medbay :
  // déverrouillage mécanique étagé et dépressurisation pneumatique stérile.
  playMedicompOpen() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Double clic mécanique métallique
    for (let i = 0; i < 2; i += 1) {
      const clickTime = now + i * 0.07;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(2400 - i * 400, clickTime);
      clickOsc.frequency.exponentialRampToValueAtTime(450, clickTime + 0.04);
      clickGain.gain.setValueAtTime(0.01, clickTime);
      clickGain.gain.linearRampToValueAtTime(0.25, clickTime + 0.01);
      clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.045);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(clickTime);
      clickOsc.stop(clickTime + 0.05);
    }

    // Souffle pneumatique de dépressurisation des compartiments stériles
    const hissOsc = this.ctx.createOscillator();
    const hissGain = this.ctx.createGain();
    const hissFilter = this.ctx.createBiquadFilter();
    hissOsc.type = 'sawtooth';
    hissOsc.frequency.setValueAtTime(800, now + 0.12);
    hissOsc.frequency.exponentialRampToValueAtTime(180, now + 0.45);
    hissFilter.type = 'bandpass';
    hissFilter.frequency.setValueAtTime(1400, now + 0.12);
    hissFilter.Q.setValueAtTime(3.2, now + 0.12);
    hissGain.gain.setValueAtTime(0.01, now + 0.12);
    hissGain.gain.linearRampToValueAtTime(0.2, now + 0.18);
    hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    hissOsc.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(this.ctx.destination);
    hissOsc.start(now + 0.12);
    hissOsc.stop(now + 0.46);
  }

  // Predator 2 (1990) — Brûleur thermique de cautérisation au plasma :
  // sifflement de torche plasma à haute intensité et grésillement de chair cautérisée.
  playCauterizerSizzle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const torchOsc = this.ctx.createOscillator();
    const torchGain = this.ctx.createGain();
    const torchFilter = this.ctx.createBiquadFilter();
    torchOsc.type = 'sawtooth';
    torchOsc.frequency.setValueAtTime(620, now);
    torchOsc.frequency.linearRampToValueAtTime(1800, now + 0.15);
    torchOsc.frequency.exponentialRampToValueAtTime(380, now + 0.65);

    torchFilter.type = 'bandpass';
    torchFilter.frequency.setValueAtTime(2600, now);
    torchFilter.Q.setValueAtTime(4.8, now);

    torchGain.gain.setValueAtTime(0.01, now);
    torchGain.gain.linearRampToValueAtTime(0.38, now + 0.08);
    torchGain.gain.exponentialRampToValueAtTime(0.002, now + 0.65);

    torchOsc.connect(torchFilter);
    torchFilter.connect(torchGain);
    torchGain.connect(this.ctx.destination);
    torchOsc.start(now);
    torchOsc.stop(now + 0.66);
  }

  // Predator 1987 / Predator 2 — Agrafeuse dermique et pinces chirurgicales :
  // claquement sec métallique d'agrafage refermant les tissus.
  playStaplerSnap() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(3200, now);
    snapOsc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    snapGain.gain.setValueAtTime(0.01, now);
    snapGain.gain.linearRampToValueAtTime(0.35, now + 0.008);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.075);
  }

  // Lore Yautja — Injecteur pneumatique d'adrénaline et neuro-stimulants :
  // propulsion sous pression avec clic d'armement et jet sous-cutané.
  playStimInjectorHiss() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(2100, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    const jetOsc = this.ctx.createOscillator();
    const jetGain = this.ctx.createGain();
    const jetFilter = this.ctx.createBiquadFilter();
    jetOsc.type = 'sawtooth';
    jetOsc.frequency.setValueAtTime(1200, now + 0.03);
    jetOsc.frequency.exponentialRampToValueAtTime(250, now + 0.28);
    jetFilter.type = 'lowpass';
    jetFilter.frequency.setValueAtTime(1900, now + 0.03);
    jetGain.gain.setValueAtTime(0.01, now + 0.03);
    jetGain.gain.linearRampToValueAtTime(0.25, now + 0.06);
    jetGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    jetOsc.connect(jetFilter);
    jetFilter.connect(jetGain);
    jetGain.connect(this.ctx.destination);
    jetOsc.start(now + 0.03);
    jetOsc.stop(now + 0.29);
  }

  playFeralRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Prey (2022) Feral Predator primal beast roar:
    // Raw savage guttural rasp with high-resonance nasal formant screech
    const raspOsc = this.ctx.createOscillator();
    const raspGain = this.ctx.createGain();
    raspOsc.type = 'sawtooth';
    raspOsc.frequency.setValueAtTime(140, now);
    raspOsc.frequency.linearRampToValueAtTime(290, now + 0.35);
    raspOsc.frequency.exponentialRampToValueAtTime(65, now + 1.5);
    raspGain.gain.setValueAtTime(0.01, now);
    raspGain.gain.linearRampToValueAtTime(0.48, now + 0.25);
    raspGain.gain.exponentialRampToValueAtTime(0.005, now + 1.5);

    const raspFilter = this.ctx.createBiquadFilter();
    raspFilter.type = 'bandpass';
    raspFilter.frequency.setValueAtTime(850, now);
    raspFilter.Q.setValueAtTime(2.2, now);

    raspOsc.connect(raspFilter);
    raspFilter.connect(raspGain);
    raspGain.connect(this.ctx.destination);
    raspOsc.start(now);
    raspOsc.stop(now + 1.52);

    // Primal bone-shield impact reverberation
    const boneOsc = this.ctx.createOscillator();
    const boneGain = this.ctx.createGain();
    boneOsc.type = 'triangle';
    boneOsc.frequency.setValueAtTime(210, now);
    boneOsc.frequency.exponentialRampToValueAtTime(50, now + 0.9);
    boneGain.gain.setValueAtTime(0.35, now);
    boneGain.gain.exponentialRampToValueAtTime(0.005, now + 0.9);
    boneOsc.connect(boneGain);
    boneGain.connect(this.ctx.destination);
    boneOsc.start(now);
    boneOsc.stop(now + 0.92);
  }

  playUpgradeAssassinRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical The Predator (2018) 11-foot genetically hybridized Assassin Predator roar:
    // Massive guttural roar with extreme sub-bass rumble and distorted vocal resonance
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roarOsc.type = 'sawtooth';
    roarOsc.frequency.setValueAtTime(65, now);
    roarOsc.frequency.linearRampToValueAtTime(175, now + 0.45);
    roarOsc.frequency.exponentialRampToValueAtTime(32, now + 2.1);
    roarGain.gain.setValueAtTime(0.01, now);
    roarGain.gain.linearRampToValueAtTime(0.62, now + 0.35);
    roarGain.gain.exponentialRampToValueAtTime(0.005, now + 2.1);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(220, now + 2.1);

    roarOsc.connect(filter);
    filter.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roarOsc.start(now);
    roarOsc.stop(now + 2.12);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(24, now + 1.6);
    subGain.gain.setValueAtTime(0.65, now);
    subGain.gain.exponentialRampToValueAtTime(0.005, now + 1.6);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.62);
  }

  playCityHunterRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Canonical Predator 2 (1990) City Hunter aggressive urban roar:
    // Kevin Peter Hall / Steve Wang raspy commanding war cry with high metallic resonance
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roarOsc.type = 'sawtooth';
    roarOsc.frequency.setValueAtTime(165, now);
    roarOsc.frequency.linearRampToValueAtTime(340, now + 0.32);
    roarOsc.frequency.exponentialRampToValueAtTime(75, now + 1.6);
    roarGain.gain.setValueAtTime(0.01, now);
    roarGain.gain.linearRampToValueAtTime(0.55, now + 0.28);
    roarGain.gain.exponentialRampToValueAtTime(0.005, now + 1.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1450, now);
    filter.Q.setValueAtTime(2.8, now);

    roarOsc.connect(filter);
    filter.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roarOsc.start(now);
    roarOsc.stop(now + 1.62);

    // Deep metallic undertone
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metalOsc.type = 'triangle';
    metalOsc.frequency.setValueAtTime(125, now);
    metalOsc.frequency.exponentialRampToValueAtTime(38, now + 1.1);
    metalGain.gain.setValueAtTime(0.4, now);
    metalGain.gain.exponentialRampToValueAtTime(0.005, now + 1.1);
    metalOsc.connect(metalGain);
    metalGain.connect(this.ctx.destination);
    metalOsc.start(now);
    metalOsc.stop(now + 1.12);
  }

  playCombistickThrust() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Heavy metallic telescoping whoosh and blade slice
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(350, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playLeapImpactShockwave() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Massive kinetic slam shockwave when 11-foot Assassin Predator lands from leap
    const impactOsc = this.ctx.createOscillator();
    const impactGain = this.ctx.createGain();
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(130, now);
    impactOsc.frequency.exponentialRampToValueAtTime(20, now + 0.7);
    impactGain.gain.setValueAtTime(0.8, now);
    impactGain.gain.exponentialRampToValueAtTime(0.005, now + 0.7);
    impactOsc.connect(impactGain);
    impactGain.connect(this.ctx.destination);
    impactOsc.start(now);
    impactOsc.stop(now + 0.72);

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.45;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }

  playTrophyHarvest() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Visceral bone-crunch and cervical vertebra snap (filtered noise burst)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // 2. Triumphal Yautja vocal bellow (ascending harmonic power roar)
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roarOsc.type = 'sawtooth';
    roarOsc.frequency.setValueAtTime(95, now + 0.22);
    roarOsc.frequency.linearRampToValueAtTime(260, now + 0.65);
    roarOsc.frequency.exponentialRampToValueAtTime(55, now + 1.8);
    roarGain.gain.setValueAtTime(0.01, now + 0.22);
    roarGain.gain.linearRampToValueAtTime(0.5, now + 0.65);
    roarGain.gain.exponentialRampToValueAtTime(0.005, now + 1.8);
    roarOsc.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roarOsc.start(now + 0.22);
    roarOsc.stop(now + 1.82);

    // 3. Sub-bass vibration resonance
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, now + 0.22);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.1);
    subGain.gain.setValueAtTime(0.6, now + 0.22);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now + 0.22);
    subOsc.stop(now + 1.12);
  }

  playBeep() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playExplosion() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.5));
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playBillyLaughMimic() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Stan Winston 1987 iconic manic playback mimicry: staggered resonant laughing bursts
    const laughPitches = [340, 290, 420, 360, 270, 310, 260];
    laughPitches.forEach((pitch, i) => {
      const startTime = now + (i * 0.22);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, startTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.72, startTime + 0.18);
      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.21);
    });
  }

  playTriLaserLock() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Distinct high-pitched tri-laser lock chirp
    for (let i = 0; i < 3; i++) {
      const t = now + (i * 0.07);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400 + (i * 280), t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.05);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  playBioMaskLock() {
    this.playTriLaserLock();
  }

  playPlasmacasterCharge() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Rising energy buildup sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(1950, now + 0.45);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.49);
  }

  playMedicompUse() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Cauterizing hiss with bandpass white noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.65);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.6);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playCloakDistortion() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Electromagnetic warble and glitch sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(620, now + 0.12);
    osc.frequency.linearRampToValueAtTime(95, now + 0.28);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  playBadBloodRage() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Psychotic, unhinged Bad Blood Yautja screech with harsh distorted formant modulation
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.55);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.55);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3.5, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.56);
  }

  // Prey (2022) — déploiement du bouclier segmenté du Feral :
  // série de claquements mécaniques rapides (plaques qui s'emboîtent).
  playFeralShieldDeploy() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i += 1) {
      const t = now + i * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800 - i * 180, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.03);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    }
  }

  // Prey (2022) — impact absorbé par le bouclier : choc sourd osseux
  // suivi d'un tintement métallique résonant (alliage yautja).
  playFeralShieldDeflect() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(180, now);
    thud.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    thudGain.gain.setValueAtTime(0.42, now);
    thudGain.gain.exponentialRampToValueAtTime(0.002, now + 0.2);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(now);
    thud.stop(now + 0.21);

    const ring = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    const ringFilter = this.ctx.createBiquadFilter();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(2350, now);
    ring.frequency.linearRampToValueAtTime(2210, now + 0.6);
    ringFilter.type = 'bandpass';
    ringFilter.frequency.setValueAtTime(2300, now);
    ringFilter.Q.setValueAtTime(12, now);
    ringGain.gain.setValueAtTime(0.16, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    ring.connect(ringFilter);
    ringFilter.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ring.start(now);
    ring.stop(now + 0.66);
  }

  // Prey (2022) — salve du lanceur de traits : trois départs secs et sifflants.
  playFeralCrossboltVolley() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i += 1) {
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    }
  }

  // Predator (1987) — Rire spectral et dérangeant de Billy mimé par le Jungle Hunter
  playMimicryBillyLaugh() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i += 1) {
      const t = now + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420 - i * 15, t);
      osc.frequency.exponentialRampToValueAtTime(260 - i * 10, t + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, t);
      filter.Q.setValueAtTime(4.2, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    }
  }

  // Predator 2 (1990) — "Want some candy?" distordu par le haut-parleur du biomasque
  playMimicryWantSomeCandy() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const syllables = [380, 460, 310, 240];
    syllables.forEach((freq, index) => {
      const t = now + index * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 0.88, t + 0.11);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(3.0, t);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  // Predator (1987) — Murmure d'outre-tombe "Anytime..."
  playMimicryAnytime() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.7);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, now);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.72);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  // Biomasque — Bip digital d'acquisition / enregistrement vocal
  playMimicryRecordBeep() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i += 1) {
      const t = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1650 + i * 320, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.055);
    }
  }

  // Viseur tri-laser — Tonalité de verrouillage balistique convergé (3 points unis)
  playTriLaserConvergedTone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.16);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Gantelet Yautja — Déclic d'ouverture du capot d'autodestruction
  playSelfDestructCoverOpen() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);
  }

  // Gantelet Yautja — Sifflement électronique ascendant des glyphes qui défilent
  playSelfDestructAscendingHum(remainingRatio = 1.0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const factor = Math.max(0.1, Math.min(1.0, remainingRatio));
    const baseFreq = 300 + (1.0 - factor) * 900;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq + 120, now + 0.15);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Gantelet Yautja — Détonation thermonucléaire tactique de micro-fusion
  playSelfDestructDetonation() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Onde de choc sub-bass
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(18, now + 1.8);
    subGain.gain.setValueAtTime(0.85, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.85);

    // Décharge de plasma
    const bufferSize = Math.floor(this.ctx.sampleRate * 1.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * 0.9;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 1.4);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Rituel de taxidermie Yautja — Gravure au plasma du glyphe de clan sur le crâne
  playBoneCarvingEtch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i += 1) {
      const t = now + i * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2600 + (i % 2) * 450, t);
      osc.frequency.linearRampToValueAtTime(1900, t + 0.04);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.048);
    }
  }

  // Rituel de taxidermie — Bouillonnement dissolvant du bain de solvant Cleaner
  playSolventBoil() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i += 1) {
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + i * 110, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  // Smart Disc (1990) — Bourdonnement gyroscopique de la lame en vol
  playSmartDiscFlightHum() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.linearRampToValueAtTime(860, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Smart Disc — Tranchage net à haute vélocité
  playSmartDiscSlice() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.13);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Smart Disc — Rétraction et réception magnétique dans le gantelet
  playSmartDiscCatch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Camouflage — Court-circuit électrique sous l'eau / pluie battante
  playCloakShortCircuit() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i += 1) {
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200 + (Math.random() * 600 - 300), t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.002, t + 0.055);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  startAmbientJungle() {
    if (!this.ctx) return;
    const windOsc = this.ctx.createOscillator();
    const windGain = this.ctx.createGain();
    windOsc.type = 'sine';
    windOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
    windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    windOsc.connect(windGain);
    windGain.connect(this.ctx.destination);
    windOsc.start();
  }
}

export const audioSynth = new AudioSynthesizer();
