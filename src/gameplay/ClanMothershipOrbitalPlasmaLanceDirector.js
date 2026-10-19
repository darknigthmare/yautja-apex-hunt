// Frappe de Lance Plasma Orbitale du Vaisseau-Mère (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Le faisceau thermique haute énergie tiré depuis l'orbite par le Vaisseau-Mère Yautja capable de percer des centaines de mètres de glace ou d'éradiquer une zone compromise.

import { audioSynth } from '../AudioSynthesizer.js';

export const ORBITAL_LANCE_CONSTANTS = {
  BEAM_RADIUS_M: 12.0,               // Rayon du pilier énergétique orbital
  ORBITAL_VAPORIZE_DAMAGE: 650,      // Dégâts thermiques d'éradication orbitale
};

export function createOrbitalLanceDirectorState() {
  return {
    isTargetLocked: false,
    targetCoordinates: null,
    strikesCalledCount: 0,
  };
}

export function lockOrbitalPlasmaBeacon(state, coords = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state) return false;
  state.isTargetLocked = true;
  state.targetCoordinates = { x: coords.x || 0, z: coords.z || 0 };

  if (audio && typeof audio.playOrbitalPlasmaLanceTargetLock === 'function') {
    audio.playOrbitalPlasmaLanceTargetLock();
  }

  return true;
}

export function executeMothershipOrbitalStrike(state, entitiesInZone = [], audio = audioSynth) {
  if (!state || !state.isTargetLocked || !state.targetCoordinates) {
    return { struck: false, hitCount: 0 };
  }

  state.isTargetLocked = false;
  state.strikesCalledCount++;

  if (audio && typeof audio.playMothershipOrbitalBeamStrikeRoar === 'function') {
    audio.playMothershipOrbitalBeamStrikeRoar();
  }

  const tx = state.targetCoordinates.x;
  const tz = state.targetCoordinates.z;
  let hitCount = 0;

  if (Array.isArray(entitiesInZone)) {
    for (const ent of entitiesInZone) {
      if (!ent) continue;
      const dist = Math.hypot((ent.x || 0) - tx, (ent.z || 0) - tz);
      if (dist <= ORBITAL_LANCE_CONSTANTS.BEAM_RADIUS_M) {
        ent.isHitByOrbitalLance = true;
        hitCount++;

        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(ORBITAL_LANCE_CONSTANTS.ORBITAL_VAPORIZE_DAMAGE);
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - ORBITAL_LANCE_CONSTANTS.ORBITAL_VAPORIZE_DAMAGE);
        }
      }
    }
  }

  return {
    struck: true,
    hitCount,
  };
}
