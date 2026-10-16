// Système de Balise de Brouillage Phéromonal de Gantelet (Lore 1:1)
// Référence canonique : Lore Yautja / Comics Marvel — Dispositif de synthèse phéromonale de Reine semant la panique fratricide dans les ruches

import { audioSynth } from '../AudioSynthesizer.js';

export const SCRAMBLER_CONSTANTS = {
  PULSE_RADIUS: 25.0,              // Rayon d'émission de l'aérosol phéromonal brouilleur (m)
  CONFUSION_DURATION: 6.5,         // Durée d'hystérie et d'affrontements fratricides (s)
  ENERGY_COST: 35.0,               // Coût en énergie du gantelet
};

export function createPheromonalScramblerState() {
  return {
    chargesRemaining: 3,
    isActive: false,
    activePulseTimer: 0,
    confusedXenosCount: 0,
  };
}

export function activatePheromonalScrambler(state, hunterPos, xenomorphEntities = [], audio = audioSynth) {
  if (!state || state.chargesRemaining <= 0 || state.isActive) return false;

  state.chargesRemaining -= 1;
  state.isActive = true;
  state.activePulseTimer = SCRAMBLER_CONSTANTS.CONFUSION_DURATION;

  if (audio && typeof audio.playScramblerBeaconPulse === 'function') {
    audio.playScramblerBeaconPulse();
  }

  let confusedCount = 0;

  for (const xeno of xenomorphEntities) {
    if (!xeno || xeno.isDead) continue;
    // Les boss Alpha ont une forte volonté mais voient leur contrôle télépathique rompu
    const xx = xeno.x ?? (xeno.position ? xeno.position.x : 0);
    const xz = xeno.z ?? (xeno.position ? xeno.position.z : 0);
    const dist = Math.sqrt((xx - hunterPos.x) ** 2 + (xz - hunterPos.z) ** 2);

    if (dist <= SCRAMBLER_CONSTANTS.PULSE_RADIUS) {
      if (xeno.species === 'xenomorph_alpha') {
        xeno.hiveControlSevered = true;
        xeno.severedTimer = SCRAMBLER_CONSTANTS.CONFUSION_DURATION;
      } else {
        xeno.isInfighting = true;
        xeno.infightingTimer = SCRAMBLER_CONSTANTS.CONFUSION_DURATION;
        confusedCount += 1;
      }
    }
  }

  state.confusedXenosCount = confusedCount;

  if (confusedCount > 0 && audio && typeof audio.playSwarmFrenzyHiss === 'function') {
    audio.playSwarmFrenzyHiss();
  }

  return true;
}

export function updatePheromonalScrambler(state, delta) {
  if (!state || !state.isActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.activePulseTimer -= dt;
  if (state.activePulseTimer <= 0) {
    state.isActive = false;
  }
}
