/**
 * AURA: Clash of Superpowers
 * RPG Game Core Logic
 */

// ============================================================================
// 1. DATA DEFINITIONS (Heroes, Skills, Stages, Status Effects)
// ============================================================================

const HERO_TEMPLATES = {
  ignis: {
    name: 'Ignis',
    title: 'The Solar Flame',
    subclass: 'PYROMANCER',
    themeColor: 'var(--neon-orange)',
    themeRgb: '255, 87, 34',
    avatar: 'assets/ignis.jpg',
    baseStats: { power: 14, agility: 9, resilience: 7, focus: 8 },
    skills: [
      { name: 'Energy Strike', type: 'basic', cost: -15, desc: 'Strike with flame fists. Generates 15 Energy.' },
      { name: 'Fireball', type: 'attack', cost: 20, cooldown: 2, desc: 'Launches a fireball dealing 1.8x ATK and inflicts BURN (10% HP/turn, 3 turns).' },
      { name: 'Heat Shield', type: 'buff', cost: 25, cooldown: 3, desc: 'Cloaks in plasma. Gains SHIELD (absorbs 30% of incoming damage, lasts 3 turns).' },
      { name: 'Supernova', type: 'ult', cost: 0, desc: 'Unleashes stellar collapse. Deals 3.5x ATK and inflicts intensive BURN (5 turns).' }
    ]
  },
  tesla: {
    name: 'Tesla',
    title: 'The Storm Weaver',
    subclass: 'ELECTRO-LORD',
    themeColor: 'var(--neon-cyan)',
    themeRgb: '0, 229, 255',
    avatar: 'assets/tesla.jpg',
    baseStats: { power: 10, agility: 14, resilience: 8, focus: 8 },
    skills: [
      { name: 'Volt Strike', type: 'basic', cost: -15, desc: 'Shock target. Generates 15 Energy.' },
      { name: 'Chain Lightning', type: 'attack', cost: 25, cooldown: 2, desc: 'Deals 1.4x ATK with 40% chance to STUN the enemy for 1 turn.' },
      { name: 'Overcharge', type: 'buff', cost: 20, cooldown: 3, desc: 'Speeds up synapses. Increases speed by 50% and heals 20% max HP.' },
      { name: 'Mjolnir\'s Storm', type: 'ult', cost: 0, desc: 'Deals 3x ATK electric blast and guarantees 1 turn STUN.' }
    ]
  },
  vortex: {
    name: 'Vortex',
    title: 'The Void Stalker',
    subclass: 'VOID STALKER',
    themeColor: 'var(--neon-purple)',
    themeRgb: '189, 0, 255',
    avatar: 'assets/vortex.jpg',
    baseStats: { power: 12, agility: 11, resilience: 6, focus: 11 },
    skills: [
      { name: 'Void Strike', type: 'basic', cost: -15, desc: 'Siphon energy. Generates 15 Energy.' },
      { name: 'Shadow Strike', type: 'attack', cost: 30, cooldown: 2, desc: 'Strike from shadow. Deals 2.2x ATK with a high critical rate.' },
      { name: 'Phase Shift', type: 'buff', cost: 20, cooldown: 4, desc: 'Vanish into the void. Gains INVISIBLE (evades all attacks) for 1 turn.' },
      { name: 'Event Horizon', type: 'ult', cost: 0, desc: 'Siphons life. Deals 2.5x ATK damage and restores 50% of damage dealt as HP.' }
    ]
  },
  gaea: {
    name: 'Gaea',
    title: 'The Bio-Sentinel',
    subclass: 'BIO-SENTINEL',
    themeColor: 'var(--neon-green)',
    themeRgb: '57, 255, 20',
    avatar: 'assets/gaea.jpg',
    baseStats: { power: 8, agility: 6, resilience: 14, focus: 12 },
    skills: [
      { name: 'Flora Whip', type: 'basic', cost: -15, desc: 'Slash with energy vines. Generates 15 Energy.' },
      { name: 'Bio-Toxin', type: 'attack', cost: 15, cooldown: 2, desc: 'Injects poison. Deals 1.0x ATK damage and inflicts POISON (deals damage that doubles each turn).' },
      { name: 'Photosynthesis', type: 'buff', cost: 25, cooldown: 3, desc: 'Regenerates cells. Restores 35% of max HP and cleanses debuffs.' },
      { name: 'Wrath of Nature', type: 'ult', cost: 0, desc: 'Deals 2.8x ATK and gains a heavy SHIELD (50% block) for 3 turns.' }
    ]
  }
};

const STAGES = [
  {
    stage: 1,
    name: 'Plasma Drone MK-I',
    desc: 'An automated security unit hovering with plasma stabilizers. Vulnerable but fast.',
    avatar: 'assets/enemy.jpg', // Uses the same enemy template
    stats: { hp: 70, power: 8, agility: 8, energy: 100, subclass: 'ROBOTIC' },
    skills: [
      { name: 'Laser Charge', type: 'basic', cost: -15 },
      { name: 'Plasma Blast', type: 'attack', cost: 20, desc: 'Deals 1.4x ATK plasma bolt.' }
    ]
  },
  {
    stage: 2,
    name: 'Bio-Slime Spitter',
    desc: 'An irradiated acidic blob escaped from corporate laboratories. Spits toxic waste.',
    avatar: 'assets/gaea.jpg',
    stats: { hp: 100, power: 11, agility: 9, energy: 100, subclass: 'MUTANT' },
    skills: [
      { name: 'Acid Strike', type: 'basic', cost: -15 },
      { name: 'Caustic Acid', type: 'attack', cost: 25, desc: 'Spits acid, dealing 1.2x ATK and poisoning the hero.' }
    ]
  },
  {
    stage: 3,
    name: 'Specter Cyber-Hunter',
    desc: 'A rogue mercenary utilizing cloaking grids and high-caliber cybernetic firearms.',
    avatar: 'assets/vortex.jpg',
    stats: { hp: 135, power: 15, agility: 13, energy: 100, subclass: 'CYBORG' },
    skills: [
      { name: 'Taser Burst', type: 'basic', cost: -15 },
      { name: 'Lock-On Shot', type: 'attack', cost: 30, desc: 'Deals 1.8x ATK critical sniper burst.' },
      { name: 'Stealth Shield', type: 'buff', cost: 20, desc: 'Activates holographic barrier (reduces dmg).' }
    ]
  },
  {
    stage: 4,
    name: 'Chronos Sentinel',
    desc: 'An ancient guardian warping time currents. Can decelerate opponents and bypass dimensions.',
    avatar: 'assets/tesla.jpg',
    stats: { hp: 180, power: 18, agility: 15, energy: 100, subclass: 'TEMPORAL' },
    skills: [
      { name: 'Time Strike', type: 'basic', cost: -15 },
      { name: 'Temporal Siphon', type: 'attack', cost: 25, desc: 'Stops time briefly, dealing 1.5x ATK and stealing 30 energy.' },
      { name: 'Tachyon Shield', type: 'buff', cost: 30, desc: 'Rewinds cellular decay, restoring 40 HP.' }
    ]
  },
  {
    stage: 5,
    name: 'MALAKOR, THE SHADOW WARLORD',
    desc: 'The architect of the Nexus collapse. Wields raw event-horizon void energy and commands gravity.',
    avatar: 'assets/enemy.jpg',
    stats: { hp: 280, power: 25, agility: 18, energy: 100, subclass: 'BOSS' },
    skills: [
      { name: 'Shadow Strike', type: 'basic', cost: -15 },
      { name: 'Void Nova', type: 'attack', cost: 30, desc: 'A blast of pure dark antimatter dealing 2.0x ATK.' },
      { name: 'Event Horizon', type: 'ult', cost: 40, desc: 'Siphons hero vital force. Deals 1.5x ATK, burns, and heals Malakor.' }
    ]
  }
];

// ============================================================================
// 2. AUDIO SYNTHESIZER (WEB AUDIO API)
// ============================================================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSelect() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(660, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playHit() {
    if (this.muted) return;
    this.init();
    
    // Create white noise buffer
    let bufferSize = this.ctx.sampleRate * 0.1; // 0.1s duration
    let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    let data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    let noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Low pass filter
    let filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    let gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
    noise.stop(this.ctx.currentTime + 0.1);

    // Add a quick sub bump
    let sub = this.ctx.createOscillator();
    let subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(100, this.ctx.currentTime);
    sub.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.1);
    subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start();
    sub.stop(this.ctx.currentTime + 0.1);
  }

  playFire() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let bandpass = this.ctx.createBiquadFilter();
    let gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(380, this.ctx.currentTime + 0.4);
    
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(600, this.ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    
    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playElectric() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let oscMod = this.ctx.createOscillator();
    let modGain = this.ctx.createGain();
    let gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    
    oscMod.type = 'sawtooth';
    oscMod.frequency.setValueAtTime(120, this.ctx.currentTime);
    
    modGain.gain.setValueAtTime(500, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.35);
    
    oscMod.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    oscMod.start();
    osc.stop(this.ctx.currentTime + 0.35);
    oscMod.stop(this.ctx.currentTime + 0.35);
  }

  playVoid() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let filter = this.ctx.createBiquadFilter();
    let gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.5);
    
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(10, this.ctx.currentTime);
    filter.frequency.setValueAtTime(120, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playHeal() {
    if (this.muted) return;
    this.init();
    
    let now = this.ctx.currentTime;
    let freqs = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
    
    freqs.forEach((freq, index) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0.1, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0, now + index * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  }

  playUlt() {
    if (this.muted) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let sub = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    let subGain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2000, this.ctx.currentTime + 1.2);
    
    sub.type = 'sine';
    sub.frequency.setValueAtTime(60, this.ctx.currentTime);
    sub.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 1.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);
    
    subGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
    
    osc.connect(gain);
    sub.connect(subGain);
    gain.connect(this.ctx.destination);
    subGain.connect(this.ctx.destination);
    
    osc.start();
    sub.start();
    osc.stop(this.ctx.currentTime + 1.2);
    sub.stop(this.ctx.currentTime + 1.2);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    
    let now = this.ctx.currentTime;
    let melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    melody.forEach((freq, index) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      
      gain.gain.setValueAtTime(0.1, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0, now + index * 0.12 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.4);
    });
  }

  playDefeat() {
    if (this.muted) return;
    this.init();
    
    let now = this.ctx.currentTime;
    let melody = [440.00, 415.30, 392.00, 349.23, 293.66, 220.00];
    
    melody.forEach((freq, index) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + index * 0.18);
      
      gain.gain.setValueAtTime(0.12, now + index * 0.18);
      gain.gain.linearRampToValueAtTime(0, now + index * 0.18 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.18);
      osc.stop(now + index * 0.18 + 0.5);
    });
  }
}

const AudioSynth = new SoundManager();

// ============================================================================
// 3. BACKGROUND PARTICLE CANVAS SYSTEM
// ============================================================================

class StarfieldBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.maxStars = 60;
    this.animationFrameId = null;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.stars = [];
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.3,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = [
      'rgba(0, 229, 255, 0.4)', // cyan
      'rgba(189, 0, 255, 0.4)', // purple
      'rgba(255, 87, 34, 0.4)',  // orange
      'rgba(57, 255, 20, 0.4)',  // green
      'rgba(255, 255, 255, 0.3)' // white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  start() {
    this.init();
    const tick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.stars.forEach(star => {
        // Move
        star.x += star.speedX;
        star.y += star.speedY;
        
        // Wrap around bounds
        if (star.x < 0) star.x = this.canvas.width;
        if (star.x > this.canvas.width) star.x = 0;
        if (star.y < 0) star.y = this.canvas.height;
        if (star.y > this.canvas.height) star.y = 0;
        
        // Draw
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = star.opacity;
        this.ctx.shadowBlur = star.size * 3;
        this.ctx.shadowColor = star.color;
        this.ctx.fill();
      });
      
      this.ctx.globalAlpha = 1.0;
      this.ctx.shadowBlur = 0;
      this.animationFrameId = requestAnimationFrame(tick);
    };
    tick();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// ============================================================================
// 4. COMBAT EFFECTS ENGINE (PARTICLES & ANIME STRIKES)
// ============================================================================

class BattleEffectsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.beams = [];
    this.animationId = null;
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  spawnParticles(x, y, color, count = 25) {
    this.resize();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03
      });
    }
    this.startAnimation();
  }

  spawnBeam(fromX, fromY, toX, toY, color) {
    this.resize();
    this.beams.push({
      fromX: fromX,
      fromY: fromY,
      toX: toX,
      toY: toY,
      color: color,
      width: 8,
      life: 1.0,
      decay: 0.1
    });
    this.startAnimation();
  }

  startAnimation() {
    if (this.animationId) return;
    
    const loop = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update/Draw Beams
      this.beams = this.beams.filter(beam => {
        this.ctx.beginPath();
        this.ctx.moveTo(beam.fromX, beam.fromY);
        this.ctx.lineTo(beam.toX, beam.toY);
        this.ctx.strokeStyle = beam.color;
        this.ctx.lineWidth = beam.width * beam.life;
        this.ctx.globalAlpha = beam.life;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = beam.color;
        this.ctx.stroke();
        
        beam.life -= beam.decay;
        return beam.life > 0;
      });

      // Update/Draw Particles
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.life;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        
        return p.life > 0;
      });

      this.ctx.globalAlpha = 1.0;
      this.ctx.shadowBlur = 0;

      if (this.particles.length > 0 || this.beams.length > 0) {
        this.animationId = requestAnimationFrame(loop);
      } else {
        this.animationId = null;
      }
    };
    loop();
  }
}

// ============================================================================
// 5. GAME STATE & STATS MANAGEMENT
// ============================================================================

class GameState {
  constructor() {
    this.heroType = null; // ignis, tesla, vortex, gaea
    this.currentStage = 1;
    this.level = 1;
    this.xp = 0;
    this.maxXp = 100;
    this.statPoints = 0;
    this.potions = 2;
    
    this.attributes = {
      power: 10,
      agility: 10,
      resilience: 10,
      focus: 10
    };
    
    this.currentHp = 100;
    this.unlockedStage = 1;
  }

  initFromTemplate(type) {
    const t = HERO_TEMPLATES[type];
    if (!t) return;
    
    this.heroType = type;
    this.currentStage = 1;
    this.level = 1;
    this.xp = 0;
    this.maxXp = 100;
    this.statPoints = 0;
    this.potions = 2;
    this.unlockedStage = 1;
    
    this.attributes = { ...t.baseStats };
    this.currentHp = this.getMaxHp();
  }

  getMaxHp() {
    // Resilience points contribute to HP. Base HP is 70 + (Resilience * 6)
    return 70 + (this.attributes.resilience * 6);
  }

  getSpeed() {
    // Agility point contributes to Speed
    return 10 + this.attributes.agility * 2;
  }

  getCritRate() {
    // Agility point contributes to Crit rate
    return 0.05 + (this.attributes.agility * 0.015);
  }

  getEnergyRegen() {
    // Focus point contributes to energy regen per turn
    return 12 + Math.floor(this.attributes.focus * 0.6);
  }

  getAttackPower() {
    // Power point contributes to raw base damage
    return 10 + (this.attributes.power * 2);
  }

  healPercent(percent) {
    const amt = Math.floor(this.getMaxHp() * percent);
    this.currentHp = Math.min(this.getMaxHp(), this.currentHp + amt);
  }

  gainXp(amount) {
    this.xp += amount;
    let levelGained = false;
    while (this.xp >= this.maxXp) {
      this.xp -= this.maxXp;
      this.level++;
      this.statPoints += 2;
      this.maxXp = Math.floor(this.maxXp * 1.3);
      levelGained = true;
    }
    if (levelGained) {
      // Heal fully on level up
      this.currentHp = this.getMaxHp();
    }
    return levelGained;
  }

  load() {
    try {
      const data = localStorage.getItem('aura_rpg_save');
      if (!data) return false;
      
      const parsed = JSON.parse(data);
      this.heroType = parsed.heroType;
      this.currentStage = parsed.currentStage || 1;
      this.level = parsed.level || 1;
      this.xp = parsed.xp || 0;
      this.maxXp = parsed.maxXp || 100;
      this.statPoints = parsed.statPoints || 0;
      this.potions = parsed.potions || 0;
      this.attributes = parsed.attributes || { power: 10, agility: 10, resilience: 10, focus: 10 };
      this.currentHp = parsed.currentHp !== undefined ? parsed.currentHp : this.getMaxHp();
      this.unlockedStage = parsed.unlockedStage || 1;
      
      return true;
    } catch (e) {
      console.error('Failed to load save state', e);
      return false;
    }
  }

  save() {
    try {
      const payload = {
        heroType: this.heroType,
        currentStage: this.currentStage,
        level: this.level,
        xp: this.xp,
        maxXp: this.maxXp,
        statPoints: this.statPoints,
        potions: this.potions,
        attributes: this.attributes,
        currentHp: this.currentHp,
        unlockedStage: this.unlockedStage
      };
      localStorage.setItem('aura_rpg_save', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  reset() {
    localStorage.removeItem('aura_rpg_save');
  }
}

const PlayerState = new GameState();

// ============================================================================
// 6. TURN-BASED COMBAT ENGINE
// ============================================================================

class CombatEngine {
  constructor(effectsEngine) {
    this.effects = effectsEngine;
    this.active = false;
    this.stageData = null;
    
    // Combatants state
    this.hero = null;
    this.enemy = null;
    this.turn = 'hero'; // 'hero' or 'enemy'
    this.turnCount = 1;
  }

  start(stageNum) {
    this.active = true;
    this.stageData = STAGES.find(s => s.stage === stageNum);
    this.turnCount = 1;
    
    // Copy hero statistics
    this.hero = {
      name: PlayerState.heroType.toUpperCase(),
      avatar: HERO_TEMPLATES[PlayerState.heroType].avatar,
      subclass: HERO_TEMPLATES[PlayerState.heroType].subclass,
      hp: PlayerState.currentHp,
      maxHp: PlayerState.getMaxHp(),
      energy: 100,
      maxEnergy: 120,
      ult: 0,
      // Attributes for calculations
      power: PlayerState.attributes.power,
      agility: PlayerState.attributes.agility,
      resilience: PlayerState.attributes.resilience,
      focus: PlayerState.attributes.focus,
      // Active states
      cooldowns: [0, 0, 0, 0], // maps to actions 0, 1, 2, 3
      statuses: [] // objects like { name: 'burn', val: 10, duration: 3 }
    };

    // Construct Enemy state
    const eStats = this.stageData.stats;
    this.enemy = {
      name: this.stageData.name.toUpperCase(),
      avatar: this.stageData.avatar,
      subclass: eStats.subclass,
      hp: eStats.hp,
      maxHp: eStats.hp,
      energy: eStats.energy,
      maxEnergy: 100,
      power: eStats.power,
      agility: eStats.agility,
      cooldowns: [0, 0, 0],
      statuses: []
    };

    // Speed comparison to determine who starts
    const heroSpeed = PlayerState.getSpeed();
    const enemySpeed = 10 + this.enemy.agility * 2;
    this.turn = (heroSpeed >= enemySpeed) ? 'hero' : 'enemy';
    
    this.logConsole(`System`, `Combat initialized. Stage ${stageNum}: ${this.enemy.name} detected.`, 'system');
    this.logConsole(`System`, `${this.turn === 'hero' ? this.hero.name : this.enemy.name} takes initiative due to agility speed.`, 'system');
    
    this.startTurn();
  }

  logConsole(sender, msg, type = 'system') {
    const consoleBody = document.getElementById('combat-log-console');
    if (!consoleBody) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.innerHTML = `<span style="color:#666">[${time}]</span> <strong>${sender}:</strong> ${msg}`;
    
    consoleBody.appendChild(entry);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  startTurn() {
    if (!this.active) return;
    
    // Status tick
    const activeUnit = (this.turn === 'hero') ? this.hero : this.enemy;
    const passiveUnit = (this.turn === 'hero') ? this.enemy : this.hero;
    
    this.updateHUD();
    
    // Tick active unit status effects
    this.tickStatusEffects(activeUnit);
    
    // Check if dead from statuses
    if (this.checkDeaths()) return;
    
    // Cooldown ticks
    activeUnit.cooldowns = activeUnit.cooldowns.map(c => Math.max(0, c - 1));
    
    // Energy Regen
    let regenAmount = 0;
    if (this.turn === 'hero') {
      regenAmount = PlayerState.getEnergyRegen();
      activeUnit.energy = Math.min(activeUnit.maxEnergy, activeUnit.energy + regenAmount);
      // Regen Ult by 15% each turn start
      activeUnit.ult = Math.min(100, activeUnit.ult + 15);
    } else {
      regenAmount = 15;
      activeUnit.energy = Math.min(activeUnit.maxEnergy, activeUnit.energy + regenAmount);
    }
    
    this.updateHUD();
    
    // Stun check
    const isStunned = activeUnit.statuses.some(s => s.name === 'stun');
    if (isStunned) {
      this.logConsole(activeUnit.name, `Stunned! Turn is skipped.`, 'status');
      // Decrement stun duration
      activeUnit.statuses = activeUnit.statuses.map(s => {
        if (s.name === 'stun') s.duration--;
        return s;
      }).filter(s => s.duration > 0);
      
      this.endTurn();
      return;
    }

    if (this.turn === 'hero') {
      // Enable actions for player
      this.setSkillButtonsState(true);
      this.logConsole('Nexus', `Select your power move.`, 'system');
    } else {
      // Let AI perform turn
      this.setSkillButtonsState(false);
      setTimeout(() => this.executeEnemyAI(), 1200);
    }
  }

  tickStatusEffects(unit) {
    let list = [];
    unit.statuses.forEach(s => {
      if (s.name === 'burn') {
        const burnDamage = Math.max(3, Math.floor(unit.maxHp * 0.08));
        unit.hp = Math.max(0, unit.hp - burnDamage);
        this.logConsole(unit.name, `takes <span class="log-damage">${burnDamage} burn damage</span>.`, 'status');
        this.triggerImpactVisual(unit === this.hero ? 'hero' : 'enemy', 'var(--neon-orange)', burnDamage);
        
        s.duration--;
        if (s.duration > 0) list.push(s);
      } 
      else if (s.name === 'poison') {
        // Poison doubles in intensity every tick
        const poisonDamage = s.val;
        unit.hp = Math.max(0, unit.hp - poisonDamage);
        this.logConsole(unit.name, `takes <span class="log-damage">${poisonDamage} poison corrosion damage</span>.`, 'status');
        this.triggerImpactVisual(unit === this.hero ? 'hero' : 'enemy', 'var(--neon-green)', poisonDamage);
        
        s.val = s.val * 2; // double intensity
        s.duration--;
        if (s.duration > 0) list.push(s);
      } 
      else if (s.name === 'invisible') {
        s.duration--;
        if (s.duration > 0) {
          list.push(s);
        } else {
          this.logConsole(unit.name, `re-emerges from the void grid.`, 'status');
        }
      }
      else if (s.name === 'shield') {
        s.duration--;
        if (s.duration > 0) {
          list.push(s);
        } else {
          this.logConsole(unit.name, `barrier grid depletes.`, 'status');
        }
      }
      else {
        // other generic
        s.duration--;
        if (s.duration > 0) list.push(s);
      }
    });
    unit.statuses = list;
  }

  endTurn() {
    if (this.checkDeaths()) return;
    
    // Switch turns
    this.turn = (this.turn === 'hero') ? 'enemy' : 'hero';
    this.turnCount++;
    this.startTurn();
  }

  checkDeaths() {
    if (this.hero.hp <= 0) {
      this.active = false;
      this.handleCombatOutcome(false);
      return true;
    }
    if (this.enemy.hp <= 0) {
      this.active = false;
      this.handleCombatOutcome(true);
      return true;
    }
    return false;
  }

  // ============================================================================
  // SKILL DEPLOYMENT (PLAYER / HERO ACTIONS)
  // ============================================================================

  useSkill(index) {
    if (this.turn !== 'hero' || !this.active) return;
    
    const hTemplate = HERO_TEMPLATES[PlayerState.heroType];
    const skill = hTemplate.skills[index];
    
    // Cooldown check
    if (this.hero.cooldowns[index] > 0) return;
    
    // Energy check
    if (skill.cost > 0 && this.hero.energy < skill.cost) {
      this.logConsole(this.hero.name, `insufficient energy cells!`, 'system');
      return;
    }

    // Spend energy
    if (skill.cost > 0) {
      this.hero.energy -= skill.cost;
    } else {
      // basic generates energy (cost is negative)
      this.hero.energy = Math.min(this.hero.maxEnergy, this.hero.energy + Math.abs(skill.cost));
    }

    // Set cooldown
    if (skill.cooldown) {
      this.hero.cooldowns[index] = skill.cooldown;
    }

    this.setSkillButtonsState(false);
    
    // Compute stats
    const powerMult = 1 + (this.hero.power * 0.03); // +3% damage per point of power
    let isCrit = Math.random() < PlayerState.getCritRate();
    let dmgMultiplier = isCrit ? 1.6 : 1.0;
    
    // Execute Action Type
    if (index === 0) {
      // ---------------- ENERGY STRIKE ----------------
      AudioSynth.playHit();
      let damage = Math.floor(PlayerState.getAttackPower() * dmgMultiplier);
      
      // Calculate shield reduction
      if (this.enemy.statuses.some(s => s.name === 'shield')) {
        damage = Math.floor(damage * 0.5);
      }

      this.enemy.hp = Math.max(0, this.enemy.hp - damage);
      
      this.logConsole(this.hero.name, `casts ENERGY STRIKE dealing ${isCrit ? '<span class="log-ult">CRITICAL</span> ' : ''}<span class="log-damage">${damage} damage</span>.`, 'hero');
      this.triggerImpactVisual('enemy', HERO_TEMPLATES[PlayerState.heroType].themeColor, damage);
      
      // Charge Ult
      this.hero.ult = Math.min(100, this.hero.ult + 20);
      
      this.endActionDelay();
    } 
    else if (index === 1) {
      // ---------------- SKILL 1: ATTACK SPELL ----------------
      if (PlayerState.heroType === 'ignis') {
        // Fireball
        AudioSynth.playFire();
        let damage = Math.floor(PlayerState.getAttackPower() * 1.8 * powerMult * dmgMultiplier);
        if (this.enemy.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.5);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        
        // Apply Burn
        this.applyStatus(this.enemy, 'burn', 10, 3);
        
        this.logConsole(this.hero.name, `deploys FIREBALL, burning target and dealing <span class="log-damage">${damage} solar fire damage</span>.`, 'hero');
        this.triggerImpactVisual('enemy', 'var(--neon-orange)', damage);
      } 
      else if (PlayerState.heroType === 'tesla') {
        // Chain Lightning
        AudioSynth.playElectric();
        let damage = Math.floor(PlayerState.getAttackPower() * 1.4 * powerMult * dmgMultiplier);
        if (this.enemy.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.5);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        
        // Stun chance
        if (Math.random() < 0.45) {
          this.applyStatus(this.enemy, 'stun', 0, 1);
          this.logConsole(this.hero.name, `casts CHAIN LIGHTNING dealing <span class="log-damage">${damage} volt damage</span>, <span class="log-status">PARALYZING</span> target!`, 'hero');
        } else {
          this.logConsole(this.hero.name, `casts CHAIN LIGHTNING dealing <span class="log-damage">${damage} volt damage</span>.`, 'hero');
        }
        this.triggerImpactVisual('enemy', 'var(--neon-cyan)', damage);
      } 
      else if (PlayerState.heroType === 'vortex') {
        // Shadow Strike
        AudioSynth.playVoid();
        // vortex has double crit chance
        isCrit = Math.random() < (PlayerState.getCritRate() * 1.8);
        dmgMultiplier = isCrit ? 1.8 : 1.0;
        
        let damage = Math.floor(PlayerState.getAttackPower() * 2.1 * powerMult * dmgMultiplier);
        if (this.enemy.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.5);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        
        this.logConsole(this.hero.name, `slices from dark matrix with SHADOW STRIKE, dealing ${isCrit ? '<span class="log-ult">CRITICAL</span> ' : ''}<span class="log-damage">${damage} void damage</span>.`, 'hero');
        this.triggerImpactVisual('enemy', 'var(--neon-purple)', damage);
      } 
      else if (PlayerState.heroType === 'gaea') {
        // Bio-Toxin
        AudioSynth.playHeal(); // poison audio uses organic sweep
        let damage = Math.floor(PlayerState.getAttackPower() * 1.0 * powerMult * dmgMultiplier);
        if (this.enemy.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.5);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        
        // Apply Poison: Base damage is 6, doubles every turn
        this.applyStatus(this.enemy, 'poison', 6, 3);
        
        this.logConsole(this.hero.name, `fires plant thorns with BIO-TOXIN dealing <span class="log-damage">${damage} toxic damage</span> and infecting target with <span class="log-status">CORROSION POISON</span>.`, 'hero');
        this.triggerImpactVisual('enemy', 'var(--neon-green)', damage);
      }
      
      this.hero.ult = Math.min(100, this.hero.ult + 25);
      this.endActionDelay();
    } 
    else if (index === 2) {
      // ---------------- SKILL 2: DEFENSIVE/UTILITY SPELL ----------------
      AudioSynth.playHeal();
      
      if (PlayerState.heroType === 'ignis') {
        // Heat Shield
        this.applyStatus(this.hero, 'shield', 30, 3);
        this.logConsole(this.hero.name, `configures thermal plasma field. Gains <span class="log-status">SHIELD (30% incoming reduction)</span>.`, 'hero');
        this.triggerBuffVisual('hero', 'var(--neon-orange)');
      } 
      else if (PlayerState.heroType === 'tesla') {
        // Overcharge
        const speedBuff = Math.floor(this.hero.agility * 0.5);
        this.hero.agility += speedBuff;
        // heal 20% max HP
        const healAmt = Math.floor(this.hero.maxHp * 0.2);
        this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + healAmt);
        
        this.logConsole(this.hero.name, `overclocks internal capacitors. Speed increases and <span class="log-heal">heals ${healAmt} HP</span>.`, 'hero');
        this.triggerBuffVisual('hero', 'var(--neon-cyan)');
        
        // Restore stats after combat ends
      } 
      else if (PlayerState.heroType === 'vortex') {
        // Phase Shift
        this.applyStatus(this.hero, 'invisible', 0, 1);
        this.logConsole(this.hero.name, `shifts into digital stealth matrix. Gains <span class="log-status">INVISIBILITY (All enemy hits fail)</span>.`, 'hero');
        this.triggerBuffVisual('hero', 'var(--neon-purple)');
      } 
      else if (PlayerState.heroType === 'gaea') {
        // Photosynthesis
        const healAmt = Math.floor(this.hero.maxHp * 0.35);
        this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + healAmt);
        
        // Cleanse negative status effects
        this.hero.statuses = this.hero.statuses.filter(s => s.name === 'shield' || s.name === 'invisible');
        
        this.logConsole(this.hero.name, `performs cell division with PHOTOSYNTHESIS, <span class="log-heal">cleansing debuffs and healing ${healAmt} HP</span>.`, 'hero');
        this.triggerBuffVisual('hero', 'var(--neon-green)');
      }
      
      this.hero.ult = Math.min(100, this.hero.ult + 20);
      this.endActionDelay();
    } 
    else if (index === 3) {
      // ---------------- ULTIMATE MOVE ----------------
      if (this.hero.ult < 100) return;
      
      this.hero.ult = 0; // reset
      
      // Trigger Cutscene
      const cutscene = document.getElementById('ultimate-cutscene');
      const ultName = document.getElementById('ult-announcement-name');
      const ultHero = document.getElementById('ult-announcement-hero');
      
      ultName.innerText = skill.name;
      ultHero.innerText = `${this.hero.name} deploys Ultimate`;
      cutscene.style.setProperty('--ult-color', hTemplate.themeColor);
      cutscene.classList.remove('hidden');
      
      AudioSynth.playUlt();
      
      setTimeout(() => {
        cutscene.classList.add('hidden');
        
        // Apply damage after cutscene
        let damage = Math.floor(PlayerState.getAttackPower() * 3.5 * powerMult * dmgMultiplier);
        if (this.enemy.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.5);
        
        if (PlayerState.heroType === 'ignis') {
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.applyStatus(this.enemy, 'burn', 15, 5);
          this.logConsole(this.hero.name, `deploys ULTIMATE SUPERNOVA, triggering nuclear collapse for <span class="log-ult">${damage} FIRE damage</span> and melting armor (BURN 5 turns).`, 'hero');
          this.triggerImpactVisual('enemy', 'var(--neon-orange)', damage, 35);
        } 
        else if (PlayerState.heroType === 'tesla') {
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.applyStatus(this.enemy, 'stun', 0, 1);
          this.logConsole(this.hero.name, `deploys ULTIMATE MJOLNIR'S WRATH, releasing lightning columns for <span class="log-ult">${damage} STORM damage</span> and PARALYZING enemy.`, 'hero');
          this.triggerImpactVisual('enemy', 'var(--neon-cyan)', damage, 35);
        } 
        else if (PlayerState.heroType === 'vortex') {
          // Event Horizon siphons life
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          const healVal = Math.floor(damage * 0.5);
          this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + healVal);
          
          this.logConsole(this.hero.name, `deploys ULTIMATE EVENT HORIZON, compressing gravity core for <span class="log-ult">${damage} VOID damage</span> and <span class="log-heal">draining ${healVal} HP</span>.`, 'hero');
          this.triggerImpactVisual('enemy', 'var(--neon-purple)', damage, 35);
          this.triggerBuffVisual('hero', 'var(--neon-purple)');
        } 
        else if (PlayerState.heroType === 'gaea') {
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.applyStatus(this.hero, 'shield', 50, 3);
          this.logConsole(this.hero.name, `deploys ULTIMATE WRATH OF NATURE, erupting cyber roots for <span class="log-ult">${damage} VINE damage</span> and configuring organic shield matrix.`, 'hero');
          this.triggerImpactVisual('enemy', 'var(--neon-green)', damage, 35);
          this.triggerBuffVisual('hero', 'var(--neon-green)');
        }
        
        this.endActionDelay();
      }, 2000);
    }
  }

  applyStatus(unit, name, val, duration) {
    // Check if status already exists
    const idx = unit.statuses.findIndex(s => s.name === name);
    if (idx !== -1) {
      // renew duration and value
      unit.statuses[idx].duration = duration;
      unit.statuses[idx].val = val;
    } else {
      unit.statuses.push({ name, val, duration });
    }
  }

  endActionDelay() {
    this.updateHUD();
    if (this.checkDeaths()) return;
    
    setTimeout(() => {
      this.endTurn();
    }, 800);
  }

  // ============================================================================
  // ENEMY COMMAND AI LOGIC
  // ============================================================================

  executeEnemyAI() {
    if (!this.active) return;
    
    // Check invisibility on Hero - if invisible, some basic attacks skip damage or do zero damage
    const heroInvisible = this.hero.statuses.some(s => s.name === 'invisible');
    
    // Choose skill or basic strike
    let damageDone = 0;
    
    // Malakor Warlord AI
    if (this.stageData.stage === 5) {
      if (this.enemy.energy >= 40 && Math.random() < 0.6 && this.enemy.cooldowns[2] === 0) {
        // Event Horizon
        AudioSynth.playUlt();
        this.enemy.energy -= 40;
        this.enemy.cooldowns[2] = 3;
        
        if (heroInvisible) {
          this.logConsole(this.enemy.name, `deploys EVENT HORIZON but Hero is hidden in the void. NO DAMAGE.`, 'enemy');
        } else {
          let damage = Math.floor(this.enemy.power * 2.2);
          if (this.hero.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.7);
          this.hero.hp = Math.max(0, this.hero.hp - damage);
          
          this.applyStatus(this.hero, 'burn', 10, 2); // shadow burning
          const siphon = Math.floor(damage * 0.4);
          this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + siphon);
          
          this.logConsole(this.enemy.name, `casts EVENT HORIZON, ripping matter for <span class="log-damage">${damage} void damage</span> and <span class="log-heal">siphoning ${siphon} HP</span>.`, 'enemy');
          this.triggerImpactVisual('hero', 'var(--neon-purple)', damage);
          this.triggerBuffVisual('enemy', 'var(--neon-purple)');
        }
      } 
      else if (this.enemy.energy >= 30 && Math.random() < 0.5 && this.enemy.cooldowns[1] === 0) {
        // Void Nova
        AudioSynth.playVoid();
        this.enemy.energy -= 30;
        this.enemy.cooldowns[1] = 2;
        
        if (heroInvisible) {
          this.logConsole(this.enemy.name, `releases VOID NOVA, but the shockwaves miss the phased Hero.`, 'enemy');
        } else {
          let damage = Math.floor(this.enemy.power * 1.8);
          if (this.hero.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.7);
          this.hero.hp = Math.max(0, this.hero.hp - damage);
          this.logConsole(this.enemy.name, `releases VOID NOVA, shockwave dealing <span class="log-damage">${damage} kinetic gravity damage</span>.`, 'enemy');
          this.triggerImpactVisual('hero', 'var(--neon-red)', damage);
        }
      } 
      else {
        // Basic Shadow Strike
        AudioSynth.playHit();
        this.enemy.energy = Math.min(this.enemy.maxEnergy, this.enemy.energy + 15);
        
        if (heroInvisible) {
          this.logConsole(this.enemy.name, `lunges with shadow blade, but strikes thin air.`, 'enemy');
        } else {
          let damage = Math.floor(this.enemy.power * 1.0);
          if (this.hero.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.7);
          this.hero.hp = Math.max(0, this.hero.hp - damage);
          this.logConsole(this.enemy.name, `strikes with shadow blade for <span class="log-damage">${damage} damage</span>.`, 'enemy');
          this.triggerImpactVisual('hero', 'var(--neon-purple)', damage);
        }
      }
    } 
    // Generic Enemy AI
    else {
      const activeAttackSkill = this.stageData.skills.find(s => s.type === 'attack');
      const activeBuffSkill = this.stageData.skills.find(s => s.type === 'buff');
      
      if (activeAttackSkill && this.enemy.energy >= activeAttackSkill.cost && Math.random() < 0.55 && this.enemy.cooldowns[1] === 0) {
        // Cast Attack Skill
        if (this.stageData.stage === 1) AudioSynth.playFire();
        else if (this.stageData.stage === 2) AudioSynth.playHeal();
        else AudioSynth.playVoid();
        
        this.enemy.energy -= activeAttackSkill.cost;
        this.enemy.cooldowns[1] = 3;
        
        if (heroInvisible) {
          this.logConsole(this.enemy.name, `launches ${activeAttackSkill.name}, but Hero evades fully.`, 'enemy');
        } else {
          let damage = Math.floor(this.enemy.power * 1.5);
          if (this.hero.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.7);
          this.hero.hp = Math.max(0, this.hero.hp - damage);
          
          if (this.stageData.stage === 2) {
            this.applyStatus(this.hero, 'poison', 4, 3); // bio toxic spit
            this.logConsole(this.enemy.name, `deploys CAUSTIC SPIT, inflicting <span class="log-damage">${damage} acid damage</span> and <span class="log-status">POISON CORROSION</span>.`, 'enemy');
            this.triggerImpactVisual('hero', 'var(--neon-green)', damage);
          } else {
            this.logConsole(this.enemy.name, `deploys ${activeAttackSkill.name} for <span class="log-damage">${damage} damage</span>.`, 'enemy');
            this.triggerImpactVisual('hero', 'var(--neon-orange)', damage);
          }
        }
      } 
      else if (activeBuffSkill && this.enemy.energy >= activeBuffSkill.cost && Math.random() < 0.35 && this.enemy.cooldowns[2] === 0) {
        // Buff
        AudioSynth.playHeal();
        this.enemy.energy -= activeBuffSkill.cost;
        this.enemy.cooldowns[2] = 4;
        
        if (this.stageData.stage === 4) {
          // Tachyon Shield heals
          this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + 40);
          this.logConsole(this.enemy.name, `deploys TACHYON SHIELD, warping cell time to <span class="log-heal">heal 40 HP</span>.`, 'enemy');
          this.triggerBuffVisual('enemy', 'var(--neon-cyan)');
        } else {
          this.applyStatus(this.enemy, 'shield', 30, 2);
          this.logConsole(this.enemy.name, `initializes energy deflection grids. Gains SHIELD (30% reduction).`, 'enemy');
          this.triggerBuffVisual('enemy', 'rgba(255,255,255,0.4)');
        }
      } 
      else {
        // Strike
        AudioSynth.playHit();
        this.enemy.energy = Math.min(this.enemy.maxEnergy, this.enemy.energy + 15);
        
        if (heroInvisible) {
          this.logConsole(this.enemy.name, `executes standard swipe, missing the phased Hero.`, 'enemy');
        } else {
          let damage = Math.floor(this.enemy.power * 0.95);
          if (this.hero.statuses.some(s => s.name === 'shield')) damage = Math.floor(damage * 0.7);
          this.hero.hp = Math.max(0, this.hero.hp - damage);
          this.logConsole(this.enemy.name, `fires charge cells dealing <span class="log-damage">${damage} damage</span>.`, 'enemy');
          this.triggerImpactVisual('hero', 'var(--text-secondary)', damage);
        }
      }
    }

    this.updateHUD();
    
    // Add a delay before switching back to Hero
    setTimeout(() => {
      this.endTurn();
    }, 1000);
  }

  // ============================================================================
  // COMBAT VISUAL FEEDBACK (DAMAGE POPUPS & SHAKES)
  // ============================================================================

  triggerImpactVisual(side, color, damageText, flashIntensity = 15) {
    // Screen Shake
    const container = document.getElementById('battle-arena-view');
    container.classList.remove('arena-shake');
    void container.offsetWidth; // trigger reflow
    container.classList.add('arena-shake');

    // Visual Flash overlay
    const flash = document.getElementById('combat-flash');
    flash.style.display = 'block';
    flash.style.setProperty('--flash-color', color);
    flash.classList.remove('flash-effect');
    void flash.offsetWidth;
    flash.classList.add('flash-effect');
    setTimeout(() => { flash.style.display = 'none'; }, 500);

    // Canvas particle spray
    const rect = container.getBoundingClientRect();
    const panel = document.getElementById(side === 'hero' ? 'combat-hero-panel' : 'combat-enemy-panel');
    const pRect = panel.getBoundingClientRect();
    
    const targetX = pRect.left - rect.left + (pRect.width / 2);
    const targetY = pRect.top - rect.top + (pRect.height / 2);
    
    this.effects.spawnParticles(targetX, targetY, color, flashIntensity);

    // Dynamic Floating Damage Text
    const popup = document.createElement('div');
    popup.className = 'floating-damage';
    popup.style.color = color;
    popup.innerText = `-${damageText}`;
    
    // Position slightly offset from panel center
    popup.style.left = `${pRect.left + (pRect.width / 2) + (Math.random() * 40 - 20) - 20}px`;
    popup.style.top = `${pRect.top + (pRect.height / 3) + (Math.random() * 40 - 20)}px`;
    
    document.body.appendChild(popup);
    setTimeout(() => { popup.remove(); }, 1200);
  }

  triggerBuffVisual(side, color) {
    const container = document.getElementById('battle-arena-view');
    const rect = container.getBoundingClientRect();
    const panel = document.getElementById(side === 'hero' ? 'combat-hero-panel' : 'combat-enemy-panel');
    const pRect = panel.getBoundingClientRect();
    
    const targetX = pRect.left - rect.left + (pRect.width / 2);
    const targetY = pRect.top - rect.top + (pRect.height / 2);
    
    // Beam visual floating upward
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const offset = Math.random() * 60 - 30;
        this.effects.spawnBeam(
          targetX + offset, 
          targetY + 40, 
          targetX + offset, 
          targetY - 50, 
          color
        );
      }, i * 80);
    }
  }

  // ============================================================================
  // COMBAT LOBBY STATE UPDATES
  // ============================================================================

  setSkillButtonsState(active) {
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`btn-skill-${i}`);
      if (!btn) continue;
      
      // Cooldown overlay check
      const overlay = btn.querySelector('.skill-cooldown-overlay');
      if (overlay) overlay.remove();

      if (!active) {
        btn.disabled = true;
      } else {
        // If skill has active cooldown
        if (this.hero.cooldowns[i] > 0) {
          btn.disabled = true;
          
          // Inject cooldown text overlay
          const coolOverlay = document.createElement('div');
          coolOverlay.className = 'skill-cooldown-overlay';
          coolOverlay.innerText = this.hero.cooldowns[i];
          btn.appendChild(coolOverlay);
        } else {
          // Check energy cost
          const cost = HERO_TEMPLATES[PlayerState.heroType].skills[i].cost;
          if (i === 3) {
            // Ult check
            btn.disabled = (this.hero.ult < 100);
          } else {
            btn.disabled = (cost > 0 && this.hero.energy < cost);
          }
        }
      }
    }
  }

  updateHUD() {
    // 1. Update Hero HUD
    document.getElementById('battle-hero-hp-text').innerText = `${this.hero.hp} / ${this.hero.maxHp}`;
    document.getElementById('battle-hero-hp-bar').style.width = `${(this.hero.hp / this.hero.maxHp) * 100}%`;
    
    document.getElementById('battle-hero-energy-text').innerText = `${this.hero.energy} / ${this.hero.maxEnergy}`;
    document.getElementById('battle-hero-energy-bar').style.width = `${(this.hero.energy / this.hero.maxEnergy) * 100}%`;
    
    document.getElementById('battle-hero-ult-text').innerText = `${this.hero.ult}%`;
    document.getElementById('battle-hero-ult-bar').style.width = `${this.hero.ult}%`;

    // 2. Update Enemy HUD
    document.getElementById('battle-enemy-hp-text').innerText = `${this.enemy.hp} / ${this.enemy.maxHp}`;
    document.getElementById('battle-enemy-hp-bar').style.width = `${(this.enemy.hp / this.enemy.maxHp) * 100}%`;
    
    document.getElementById('battle-enemy-energy-text').innerText = `${this.enemy.energy} / ${this.enemy.maxEnergy}`;
    document.getElementById('battle-enemy-energy-bar').style.width = `${(this.enemy.energy / this.enemy.maxEnergy) * 100}%`;

    // Turn marker
    const turnIndicator = document.getElementById('battle-turn-indicator');
    if (this.turn === 'hero') {
      turnIndicator.innerText = "Hero's Turn";
      turnIndicator.classList.remove('enemy-turn');
    } else {
      turnIndicator.innerText = "Enemy's Turn";
      turnIndicator.classList.add('enemy-turn');
    }

    // Status overlays
    this.renderStatusesHUD('battle-hero-statuses', this.hero.statuses);
    this.renderStatusesHUD('battle-enemy-statuses', this.enemy.statuses);
  }

  renderStatusesHUD(containerId, statuses) {
    const list = document.getElementById(containerId);
    list.innerHTML = '';
    statuses.forEach(s => {
      const badge = document.createElement('span');
      badge.className = `status-badge ${s.name}`;
      badge.innerText = `${s.name} (${s.duration})`;
      list.appendChild(badge);
    });
  }

  handleCombatOutcome(isVictory) {
    this.setSkillButtonsState(false);
    
    setTimeout(() => {
      // Hide combat view, trigger outcome view
      switchScreen('screen-outcome');
      
      const title = document.getElementById('outcome-title-text');
      const actionBtn = document.getElementById('btn-outcome-action');
      
      const xpRewardField = document.getElementById('outcome-reward-xp');
      const pointsRewardField = document.getElementById('outcome-reward-points');
      const potionsRewardField = document.getElementById('outcome-reward-potions');
      
      const pointsRow = document.getElementById('outcome-reward-points-row');
      const bossRow = document.getElementById('outcome-boss-clear-row');
      
      bossRow.style.display = 'none';

      // Restore baseline stats (e.g. speed buff reset)
      PlayerState.currentHp = Math.max(0, this.hero.hp);

      if (isVictory) {
        AudioSynth.playVictory();
        title.innerText = 'Clash Victory';
        title.className = 'outcome-title victory';
        actionBtn.innerText = 'Proceed to Hub';
        
        // Calculate XP Rewards based on Stage
        const xpGained = this.stageData.stage * 35 + 20;
        const levelUp = PlayerState.gainXp(xpGained);
        
        xpRewardField.innerText = `+${xpGained} XP ${levelUp ? '(LEVEL UP!)' : ''}`;
        
        // Save potion loot chance (50% chance to loot 1 potion)
        let potionGained = Math.random() < 0.5 ? 1 : 0;
        // Boss gives guaranteed potions
        if (this.stageData.stage === 5) potionGained = 2;
        
        PlayerState.potions += potionGained;
        potionsRewardField.innerText = potionGained > 0 ? `🧪 +${potionGained} Potion` : 'None found';
        
        // Progress stage unlocks
        if (this.stageData.stage === PlayerState.unlockedStage) {
          PlayerState.unlockedStage = Math.min(5, PlayerState.unlockedStage + 1);
        }
        
        if (this.stageData.stage === 5) {
          bossRow.style.display = 'flex';
          this.logConsole('SYSTEM', `CONGRATULATIONS! You have purged Malakor and saved the Nexus!`, 'ult');
        }

        // Render point loot info
        if (levelUp) {
          pointsRow.style.display = 'flex';
          pointsRewardField.innerText = `+2 Attributes`;
        } else {
          pointsRow.style.display = 'none';
        }

        PlayerState.save();
        
      } else {
        AudioSynth.playDefeat();
        title.innerText = 'Defeated';
        title.className = 'outcome-title defeat';
        actionBtn.innerText = 'Reconstruct Hero';
        
        xpRewardField.innerText = '0 XP';
        potionsRewardField.innerText = 'None';
        pointsRow.style.display = 'none';
        
        // Hero HP is set back to 40% as a fail recovery
        PlayerState.currentHp = Math.floor(PlayerState.getMaxHp() * 0.4);
        PlayerState.save();
      }
    }, 1200);
  }
}

// ============================================================================
// 7. USER INTERFACE CONTROLLER (ROUTING, LOBBY & MAP EVENTS)
// ============================================================================

// Globals
let activeScreenId = 'screen-menu';
let combatObj = null;

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
  // 1. Background particles
  const starfield = new StarfieldBackground('bg-canvas');
  starfield.start();

  // 2. Battle effects overlay
  const battleEffects = new BattleEffectsEngine('effects-canvas');
  combatObj = new CombatEngine(battleEffects);

  // 3. Check save state
  if (PlayerState.load()) {
    document.getElementById('btn-continue').disabled = false;
  }

  // 4. Attach Navigation/Menu listeners
  document.getElementById('btn-new-game').addEventListener('click', () => {
    AudioSynth.playClick();
    
    // Clear save
    PlayerState.reset();
    
    // Open selection screen
    switchScreen('screen-select');
  });

  document.getElementById('btn-continue').addEventListener('click', () => {
    AudioSynth.playClick();
    
    // Update Lobby and route
    updateLobbyUI();
    switchScreen('screen-lobby');
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    AudioSynth.playClick();
    if (confirm("Reset Nexus history and start over? All levels and stages will be wiped.")) {
      PlayerState.reset();
      location.reload();
    }
  });

  // Sound toggle
  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    const muted = AudioSynth.toggleMute();
    soundBtn.innerText = muted ? '🔇' : '🔊';
  });

  // 5. Hero Character Selection Cards
  const cards = document.querySelectorAll('#char-selection-grid .character-card');
  let selectedHeroType = null;
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      AudioSynth.playSelect();
      
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      selectedHeroType = card.dataset.heroType;
      document.getElementById('btn-select-confirm').disabled = false;
    });
  });

  // Confirm Character Selection
  document.getElementById('btn-select-confirm').addEventListener('click', () => {
    if (!selectedHeroType) return;
    AudioSynth.playClick();
    
    PlayerState.initFromTemplate(selectedHeroType);
    PlayerState.save();
    
    // Enable continue
    document.getElementById('btn-continue').disabled = false;
    
    // Route to Lobby
    updateLobbyUI();
    switchScreen('screen-lobby');
  });

  // 6. Campaign Map Node Selection
  const nodes = document.querySelectorAll('.stage-nodes-container .stage-node');
  let selectedStage = 1;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      if (node.classList.contains('locked')) {
        return;
      }
      AudioSynth.playClick();
      
      // Update nodes highlights
      nodes.forEach(n => {
        if (!n.classList.contains('locked') && !n.classList.contains('completed')) {
          n.className = 'stage-node';
        }
      });
      
      if (node.dataset.stage == 5) {
        node.className = 'stage-node boss-node current';
      } else {
        node.className = 'stage-node current';
      }

      selectedStage = parseInt(node.dataset.stage);
      updateMissionBriefPanel(selectedStage);
    });
  });

  // Launch Combat Button
  document.getElementById('btn-launch-combat').addEventListener('click', () => {
    AudioSynth.playClick();
    
    // Setup Battle Arena HUD UI elements
    setupBattleArenaUI();
    
    // Switch Screen
    switchScreen('screen-battle');
    
    // Initiate Battle engine
    combatObj.start(selectedStage);
  });

  // Spend Stat/Attribute points
  const statPlusBtns = document.querySelectorAll('.lobby-stats-list .btn-stat-plus');
  statPlusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (PlayerState.statPoints <= 0) return;
      
      const statName = btn.dataset.stat;
      PlayerState.attributes[statName]++;
      PlayerState.statPoints--;
      
      // If resilience increased, recalculate HP max
      if (statName === 'resilience') {
        PlayerState.currentHp += 6; // heal slightly by the amount max hp increased
      }
      
      AudioSynth.playSelect();
      PlayerState.save();
      updateLobbyUI();
    });
  });

  // Potion healing in lobby
  document.getElementById('btn-lobby-heal').addEventListener('click', () => {
    if (PlayerState.potions <= 0) return;
    if (PlayerState.currentHp >= PlayerState.getMaxHp()) {
      alert("Champion is already at maximum health!");
      return;
    }
    
    AudioSynth.playHeal();
    PlayerState.potions--;
    PlayerState.healPercent(0.5);
    PlayerState.save();
    updateLobbyUI();
  });

  // Battle Skills grid event delegates
  document.getElementById('btn-skill-0').addEventListener('click', () => combatObj.useSkill(0));
  document.getElementById('btn-skill-1').addEventListener('click', () => combatObj.useSkill(1));
  document.getElementById('btn-skill-2').addEventListener('click', () => combatObj.useSkill(2));
  document.getElementById('btn-skill-3').addEventListener('click', () => combatObj.useSkill(3));

  // Outcome screen return proceed button
  document.getElementById('btn-outcome-action').addEventListener('click', () => {
    AudioSynth.playClick();
    updateLobbyUI();
    switchScreen('screen-lobby');
  });

});

// Screen switcher
function switchScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    s.classList.add('hidden');
  });
  
  const target = document.getElementById(screenId);
  target.classList.remove('hidden');
  
  activeScreenId = screenId;
}

// Update Lobby attributes, levels, maps
function updateLobbyUI() {
  const hTemplate = HERO_TEMPLATES[PlayerState.heroType];
  
  // Left Hero card
  document.getElementById('lobby-hero-name').innerText = PlayerState.heroType.toUpperCase();
  document.getElementById('lobby-hero-subclass').innerText = hTemplate.subclass;
  document.getElementById('lobby-hero-level').innerText = `Lvl ${PlayerState.level}`;
  
  // Set avatar image
  document.querySelector('#lobby-hero-avatar-frame img').src = hTemplate.avatar;
  
  // Set theme color variables
  document.getElementById('lobby-hero-panel').style.setProperty('--hero-theme-color', hTemplate.themeColor);

  // XP bar
  const xpPct = (PlayerState.xp / PlayerState.maxXp) * 100;
  document.getElementById('lobby-hero-xp-bar').style.width = `${xpPct}%`;
  document.getElementById('lobby-hero-xp-text').innerText = `${PlayerState.xp} / ${PlayerState.maxXp} XP`;

  // Stat point badges
  const pointsBadge = document.getElementById('lobby-stat-points');
  if (PlayerState.statPoints > 0) {
    pointsBadge.style.display = 'block';
    pointsBadge.innerText = `${PlayerState.statPoints} Points`;
  } else {
    pointsBadge.style.display = 'none';
  }

  // Stat values and plus buttons
  document.getElementById('lobby-val-power').innerText = PlayerState.attributes.power;
  document.getElementById('lobby-val-agility').innerText = PlayerState.attributes.agility;
  document.getElementById('lobby-val-resilience').innerText = PlayerState.attributes.resilience;
  document.getElementById('lobby-val-focus').innerText = PlayerState.attributes.focus;

  const plusBtns = document.querySelectorAll('.lobby-stats-list .btn-stat-plus');
  plusBtns.forEach(btn => {
    btn.disabled = (PlayerState.statPoints <= 0);
  });

  // Potions count
  document.getElementById('lobby-potions-count').innerText = PlayerState.potions;
  document.getElementById('btn-lobby-heal').disabled = (PlayerState.potions <= 0);

  // Campaign stage nodes
  const nodes = document.querySelectorAll('.stage-nodes-container .stage-node');
  const pathLine = document.getElementById('nodes-progress-line');
  
  // Calculate path progress percentage:
  // Node counts: Stage 1 = 0%, Stage 5 = 100%
  // Formula: (unlockedStage - 1) / 4 * 100
  const progressPct = ((PlayerState.unlockedStage - 1) / 4) * 100;
  pathLine.style.width = `${progressPct}%`;

  nodes.forEach(node => {
    const stageNum = parseInt(node.dataset.stage);
    
    // Clear classes
    node.className = 'stage-node';
    if (stageNum === 5) node.classList.add('boss-node');

    if (stageNum < PlayerState.unlockedStage) {
      node.classList.add('completed');
    } else if (stageNum === PlayerState.unlockedStage) {
      node.classList.add('current');
    } else {
      node.classList.add('locked');
    }
  });

  // Default select the unlocked stage
  document.getElementById('lobby-stage-indicator').innerText = `Stage ${PlayerState.unlockedStage} / 5`;
  updateMissionBriefPanel(PlayerState.unlockedStage);
}

function updateMissionBriefPanel(stageNum) {
  const stage = STAGES.find(s => s.stage === stageNum);
  if (!stage) return;
  
  document.getElementById('lobby-enemy-name').innerText = stage.name;
  document.getElementById('lobby-enemy-desc').innerText = stage.desc;
  
  // Update campaign indicators
  document.getElementById('lobby-stage-indicator').innerText = `Stage ${stageNum} / 5`;
  
  // Update launch enemy preview
  document.querySelector('#lobby-enemy-avatar-frame img').src = stage.avatar;
}

// Configures skills text, costs, and combat assets before loading
function setupBattleArenaUI() {
  const type = PlayerState.heroType;
  const t = HERO_TEMPLATES[type];
  
  // Set profile labels
  document.getElementById('battle-hero-name').innerText = t.name.toUpperCase();
  document.getElementById('battle-hero-class').innerText = `LEVEL ${PlayerState.level} ${t.subclass}`;
  document.querySelector('#battle-hero-avatar-frame img').src = t.avatar;
  
  // Set theme colors variables
  const heroPanel = document.getElementById('combat-hero-panel');
  heroPanel.style.setProperty('--hero-theme-color', t.themeColor);

  // Setup Skills Action buttons
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btn-skill-${i}`);
    if (!btn) continue;
    
    const skill = t.skills[i];
    btn.querySelector('.skill-name').innerText = skill.name;
    
    // Set cost labeling
    const costText = btn.querySelector('.skill-cost');
    if (skill.cost < 0) {
      costText.innerText = `+${Math.abs(skill.cost)} ENG`;
      costText.className = 'skill-cost text-cyan';
    } else if (i === 3) {
      costText.innerText = `ULTIMATE`;
      costText.className = 'skill-cost text-purple';
    } else {
      costText.innerText = `${skill.cost} ENG`;
      costText.className = 'skill-cost text-cyan';
    }

    btn.querySelector('.skill-desc').innerText = skill.desc;
    
    // Theme color variables on buttons
    btn.style.setProperty('--skill-theme-color', t.themeColor);
    btn.style.setProperty('--skill-theme-rgb', t.themeRgb);
  }

  // Clear combat log console
  const consoleBody = document.getElementById('combat-log-console');
  consoleBody.innerHTML = '<div class="log-entry log-system">> Battle initialization complete. Select action.</div>';
}
