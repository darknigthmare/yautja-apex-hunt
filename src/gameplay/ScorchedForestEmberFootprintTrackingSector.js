// Brouillard Cendré de Forêt Calcinée & Empreintes Thermiques de Braises (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Les sous-bois calcinés des Grandes Plaines où chaque pas sur le tapis de cendres ravive des braises incandescentes, révélant les traces de pas même à travers un camouflage ou l'hypothermie.

import { audioSynth } from '../AudioSynthesizer.js';

export const SCORCHED_FOREST_CONSTANTS = {
  EMBER_GLOW_DURATION_SEC: 6.0,      // Persistance thermique de l'empreinte de braise
  TRACKING_CRIT_BONUS_MULT: 1.35,    // +35% de bonus de précision/dégâts sur cible pistée aux braises
};

export function createScorchedForestSectorState() {
  return {
    emberFootprints: [],
    trackedTargetsCount: 0,
  };
}

export function evaluateScorchedAshFootsteps(state, movingEntity, audio = audioSynth) {
  if (!state || !movingEntity) {
    return { revealedByEmbers: false };
  }

  if (audio && typeof audio.playScorchedEmberFootstepCrack === 'function') {
    audio.playScorchedEmberFootstepCrack();
  }

  movingEntity.isRevealedByGlowingEmbers = true;
  movingEntity.isMudCamouflaged = false;
  movingEntity.trackingVulnerabilityMult = SCORCHED_FOREST_CONSTANTS.TRACKING_CRIT_BONUS_MULT;

  state.trackedTargetsCount++;
  state.emberFootprints.push({
    x: movingEntity.x || 0,
    z: movingEntity.z || 0,
    remainingGlowSec: SCORCHED_FOREST_CONSTANTS.EMBER_GLOW_DURATION_SEC,
  });

  return {
    revealedByEmbers: true,
    vulnerabilityMult: SCORCHED_FOREST_CONSTANTS.TRACKING_CRIT_BONUS_MULT,
  };
}
