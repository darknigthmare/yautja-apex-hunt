// Directeur de Cri Synaptique Télépathique de l'Alpha (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2021) — Cri bio-résonant de l'Alpha surchargeant les viseurs technologiques et stimulant l'essaim

import { audioSynth } from '../AudioSynthesizer.js';

export const SYNAPTIC_SHRIEK_CONSTANTS = {
  SHRIEK_RADIUS: 35.0,             // Rayon d'impact de l'onde bio-télépathique (m)
  HUD_SCRAMBLE_DURATION: 4.2,      // Durée de panne des télémètres et réticules du biomasque (s)
  SWARM_FRENZY_SPEED_BUFF: 1.40,   // +40% de vélocité pour les swarmlets stimulés
  COOLDOWN_TIME: 18.0,             // Récupération entre deux cris synaptiques
};

export function createSynapticShriekState() {
  return {
    cooldownTimer: 0,
    timesShrieked: 0,
    isHudScrambled: false,
    hudScrambleTimer: 0,
    frenziedSwarmCount: 0,
  };
}

export function executeAlphaSynapticShriek(state, alphaPos, hunterEntity, swarmEntities = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return false;

  state.cooldownTimer = SYNAPTIC_SHRIEK_CONSTANTS.COOLDOWN_TIME;
  state.timesShrieked += 1;

  if (audio && typeof audio.playAlphaSynapticEMP === 'function') {
    audio.playAlphaSynapticEMP();
  }

  // Perturbation du biomasque et de l'électronique du chasseur
  if (hunterEntity && !hunterEntity.isDead) {
    const hx = hunterEntity.x ?? (hunterEntity.position ? hunterEntity.position.x : 0);
    const hz = hunterEntity.z ?? (hunterEntity.position ? hunterEntity.position.z : 0);
    const dist = Math.sqrt((hx - alphaPos.x) ** 2 + (hz - alphaPos.z) ** 2);

    if (dist <= SYNAPTIC_SHRIEK_CONSTANTS.SHRIEK_RADIUS) {
      state.isHudScrambled = true;
      state.hudScrambleTimer = SYNAPTIC_SHRIEK_CONSTANTS.HUD_SCRAMBLE_DURATION;
      hunterEntity.isHudDisabled = true;
      hunterEntity.aimSwayPenalty = 0.5;
    }
  }

  // Frénésie de la nuée de Xénomorphes et Swarmlets
  let frenziedCount = 0;
  for (const s of swarmEntities) {
    if (!s || s.isDead) continue;
    const sx = s.x ?? (s.position ? s.position.x : 0);
    const sz = s.z ?? (s.position ? s.position.z : 0);
    const dist = Math.sqrt((sx - alphaPos.x) ** 2 + (sz - alphaPos.z) ** 2);

    if (dist <= SYNAPTIC_SHRIEK_CONSTANTS.SHRIEK_RADIUS) {
      s.inFrenzy = true;
      s.speedMultiplier = SYNAPTIC_SHRIEK_CONSTANTS.SWARM_FRENZY_SPEED_BUFF;
      frenziedCount += 1;
    }
  }

  state.frenziedSwarmCount = frenziedCount;
  return true;
}

export function updateSynapticShriekDirector(state, delta, hunterEntity) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  if (state.isHudScrambled) {
    state.hudScrambleTimer -= dt;
    if (state.hudScrambleTimer <= 0) {
      state.isHudScrambled = false;
      if (hunterEntity) {
        hunterEntity.isHudDisabled = false;
        hunterEntity.aimSwayPenalty = 0;
      }
    }
  }
}
