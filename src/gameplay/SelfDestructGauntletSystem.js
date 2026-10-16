// Dispositif d'autodestruction du gantelet Yautja (Lore 1:1)
// Référence canonique : Predator (1987) (séquence de Dutch), AVP (2004) (bombe de Scar dans la pyramide)

import { audioSynth } from '../AudioSynthesizer.js';

export const SELF_DESTRUCT_STATES = Object.freeze({
  SAFE: 'safe',
  COUNTDOWN: 'countdown',
  POINT_OF_NO_RETURN: 'point_of_no_return',
  DETONATING: 'detonating',
  COMPLETED: 'completed',
  ABORTED: 'aborted',
});

// Glyphes digitaux Yautja pour l'affichage LED du gantelet
const YAUTJA_DIGITAL_RUNES = ['ᚦ', 'ᚱ', 'ᛋ', 'ᛉ', 'ᛚ', 'ᛗ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛝ'];

export function getYautjaGlyphString(remainingSeconds) {
  const sec = Math.max(0, Number(remainingSeconds) || 0);
  const tenth = Math.floor((sec % 1) * 10);
  const whole = Math.floor(sec);
  const r1 = YAUTJA_DIGITAL_RUNES[whole % YAUTJA_DIGITAL_RUNES.length];
  const r2 = YAUTJA_DIGITAL_RUNES[(whole * 3 + 1) % YAUTJA_DIGITAL_RUNES.length];
  const r3 = YAUTJA_DIGITAL_RUNES[tenth % YAUTJA_DIGITAL_RUNES.length];
  return `${r1} ${r2} : ${r3}`;
}

export function createSelfDestructState(options = {}) {
  const duration = Number(options.totalDuration) || 4.0;
  return {
    state: SELF_DESTRUCT_STATES.SAFE,
    totalDuration: duration,
    remainingTime: duration,
    pointOfNoReturn: Number(options.pointOfNoReturn) || 1.5,
    blastRadius: Number(options.blastRadius) || 48.0,
    maxDamage: Number(options.maxDamage) || 3000,
    coverOpen: false,
    humIntervalTimer: 0,
    detonationResult: null,
  };
}

export function armSelfDestruct(state, audio = audioSynth) {
  if (!state || state.state !== SELF_DESTRUCT_STATES.SAFE) return false;
  state.state = SELF_DESTRUCT_STATES.COUNTDOWN;
  state.coverOpen = true;
  state.remainingTime = state.totalDuration;
  state.humIntervalTimer = 0;

  if (audio && typeof audio.playSelfDestructCoverOpen === 'function') {
    audio.playSelfDestructCoverOpen();
  }
  return true;
}

export function abortSelfDestruct(state, audio = audioSynth) {
  if (!state || state.state !== SELF_DESTRUCT_STATES.COUNTDOWN) return false;
  // Impossible d'annuler une fois le point de non-retour franchi
  if (state.remainingTime <= state.pointOfNoReturn) return false;

  state.state = SELF_DESTRUCT_STATES.ABORTED;
  state.coverOpen = false;
  if (audio && typeof audio.playSelfDestructCoverOpen === 'function') {
    audio.playSelfDestructCoverOpen();
  }
  return true;
}

export function updateSelfDestruct(state, delta, epicentre, targets = [], audio = audioSynth) {
  if (!state || (state.state !== SELF_DESTRUCT_STATES.COUNTDOWN && state.state !== SELF_DESTRUCT_STATES.POINT_OF_NO_RETURN)) {
    return state?.state ?? SELF_DESTRUCT_STATES.SAFE;
  }

  const dt = Math.max(0, Number(delta) || 0);
  state.remainingTime = Math.max(0, state.remainingTime - dt);

  // Émission sonore des glyphes ascendants à cadence accélérée
  state.humIntervalTimer += dt;
  const pulseCadence = state.remainingTime < state.pointOfNoReturn ? 0.25 : 0.55;
  if (state.humIntervalTimer >= pulseCadence) {
    state.humIntervalTimer = 0;
    if (audio && typeof audio.playSelfDestructAscendingHum === 'function') {
      const ratio = state.remainingTime / state.totalDuration;
      audio.playSelfDestructAscendingHum(ratio);
    }
  }

  if (state.remainingTime <= state.pointOfNoReturn && state.state === SELF_DESTRUCT_STATES.COUNTDOWN) {
    state.state = SELF_DESTRUCT_STATES.POINT_OF_NO_RETURN;
  }

  if (state.remainingTime <= 0) {
    state.state = SELF_DESTRUCT_STATES.DETONATING;
    state.detonationResult = triggerDetonation(state, epicentre, targets, audio);
    state.state = SELF_DESTRUCT_STATES.COMPLETED;
  }

  return state.state;
}

export function triggerDetonation(state, epicentre, targets = [], audio = audioSynth) {
  if (audio && typeof audio.playSelfDestructDetonation === 'function') {
    audio.playSelfDestructDetonation();
  }

  const affectedTargets = [];
  const radius = state.blastRadius;
  const radiusSq = radius * radius;

  if (Array.isArray(targets)) {
    targets.forEach((target) => {
      if (!target) return;
      const tPos = target.position ?? target.mesh?.position;
      if (!tPos) return;

      const dx = tPos.x - (epicentre?.x ?? 0);
      const dy = (tPos.y ?? 0) - (epicentre?.y ?? 0);
      const dz = tPos.z - (epicentre?.z ?? 0);
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq <= radiusSq) {
        const dist = Math.sqrt(distSq);
        const falloff = 1.0 - (dist / radius);
        const damage = Math.round(state.maxDamage * Math.max(0.1, falloff));

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(damage);
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - damage);
          if (target.health <= 0) target.isDead = true;
        }

        affectedTargets.push({ target, distance: dist, damage });
      }
    });
  }

  return {
    detonated: true,
    radius,
    epicentre: { ...epicentre },
    affectedCount: affectedTargets.length,
    affectedTargets,
  };
}
