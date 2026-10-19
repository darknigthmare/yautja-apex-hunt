// Sérum Régénérateur de Cristaux Médicaux & Suture au Laser (Predators 2010 / Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) & Predators (2010) — La trousse chirurgicale Yautja combinant cristaux régénérateurs et cautérisation laser de gantelet pour suturer instantanément les hémorragies graves.

import { audioSynth } from '../AudioSynthesizer.js';

export const LASER_SUTURE_CONSTANTS = {
  HEALTH_RESTORED: 85,               // Points de vie restaurés par suture et cristaux
  CRYSTAL_SHARDS_MAX: 2,             // Nombre d'interventions chirurgicales par chasse
};

export function createLaserSutureMedkitState() {
  return {
    crystalShardsRemaining: LASER_SUTURE_CONSTANTS.CRYSTAL_SHARDS_MAX,
    suturesPerformed: 0,
  };
}

export function performGauntletLaserSuture(state, hunter, audio = audioSynth) {
  if (!state || !hunter || state.crystalShardsRemaining <= 0) {
    return { sutured: false, healthRestored: 0 };
  }

  state.crystalShardsRemaining--;
  state.suturesPerformed++;

  if (audio) {
    if (typeof audio.playGauntletLaserCauterizerBeam === 'function') {
      audio.playGauntletLaserCauterizerBeam();
    }
    if (typeof audio.playMedicalCrystalShardInjectChime === 'function') {
      audio.playMedicalCrystalShardInjectChime();
    }
  }

  hunter.isBleeding = false;
  hunter.isLacerated = false;

  const maxHealth = hunter.maxHealth || 200;
  const before = hunter.health || 50;
  hunter.health = Math.min(maxHealth, before + LASER_SUTURE_CONSTANTS.HEALTH_RESTORED);

  return {
    sutured: true,
    healthRestored: hunter.health - before,
    shardsLeft: state.crystalShardsRemaining,
  };
}
