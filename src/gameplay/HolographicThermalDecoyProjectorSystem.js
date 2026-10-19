// Brouilleur Holographique de Camouflage & Décoy Thermique (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Projection d'un leurre spectral et thermique détournant la visée des snipers (Isabelle) et révélant la position du tireur embusqué.

import { audioSynth } from '../AudioSynthesizer.js';

export const THERMAL_DECOY_CONSTANTS = {
  DECOY_DURATION_SEC: 8.0,           // Durée de maintien du fantôme holographique thermique
  AGGRO_ATTRACT_RADIUS_M: 30.0,      // Rayon d'attraction des tirs ennemis et tourelles
  ENERGY_COST: 20,                   // Coût énergétique de projection
};

export function createThermalDecoyState() {
  return {
    isActive: false,
    decoyPosition: null,
    remainingSec: 0,
    interceptedShotsCount: 0,
  };
}

export function projectHolographicThermalDecoy(state, position = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state) return false;

  state.isActive = true;
  state.decoyPosition = { x: position.x || 0, z: position.z || 0 };
  state.remainingSec = THERMAL_DECOY_CONSTANTS.DECOY_DURATION_SEC;

  if (audio && typeof audio.playHolographicThermalDecoyPulse === 'function') {
    audio.playHolographicThermalDecoyPulse();
  }

  return true;
}

export function interceptHostileSniperFire(state, shooter, audio = audioSynth) {
  if (!state || !state.isActive || !shooter) {
    return { intercepted: false };
  }

  state.interceptedShotsCount++;
  state.isActive = false;
  shooter.isPositionRevealedByMuzzleFlash = true;

  if (audio && typeof audio.playDecoySniperInterceptShatter === 'function') {
    audio.playDecoySniperInterceptShatter();
  }

  return {
    intercepted: true,
    hunterDamageTaken: 0,
    shooterRevealed: true,
  };
}
