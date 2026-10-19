// Directeur de Surcharge et Autodestruction de Vaisseau Scout Échoué (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — La capsule scout du Fugitive Predator écrasée dans la forêt ; armement d'une surcharge du réacteur quantique pour anéantir les preuves technologiques face à Stargazer.

import { audioSynth } from '../AudioSynthesizer.js';

export const SCOUT_OVERLOAD_CONSTANTS = {
  COUNTDOWN_DURATION_SEC: 10.0,       // Compte à rebours avant détonation du cœur quantique
  BLAST_RADIUS_METERS: 35.0,          // Rayon de la déflagration hémisphérique de plasma violet
  BLAST_DAMAGE: 500.0,                // Dégâts cataclysmiques anéantissant infanterie et véhicules
  EMP_DISRUPT_DURATION_SEC: 8.0,      // Onde EMP désactivant capteurs et communications
};

export function createCrashedScoutShipState(vesselPos = { x: 0, y: 0, z: 0 }) {
  return {
    position: { x: vesselPos.x || 0, y: vesselPos.y || 0, z: vesselPos.z || 0 },
    isOverloadArmed: false,
    countdownTimer: 0.0,
    isDetonated: false,
    blastRadius: SCOUT_OVERLOAD_CONSTANTS.BLAST_RADIUS_METERS,
    victimsObliteratedCount: 0,
  };
}

export function initiateScoutCoreOverload(state, audio = audioSynth) {
  if (!state || state.isDetonated || state.isOverloadArmed) return false;

  state.isOverloadArmed = true;
  state.countdownTimer = SCOUT_OVERLOAD_CONSTANTS.COUNTDOWN_DURATION_SEC;

  if (audio && typeof audio.playQuantumCoreOverloadHum === 'function') {
    audio.playQuantumCoreOverloadHum();
  }

  return true;
}

export function cancelCoreOverload(state) {
  if (!state || !state.isOverloadArmed || state.isDetonated) return false;

  state.isOverloadArmed = false;
  state.countdownTimer = 0.0;
  return true;
}

export function updateScoutCoreCountdown(state, delta = 0.1, entities = [], audio = audioSynth) {
  if (!state || !state.isOverloadArmed || state.isDetonated) return { detonated: false };

  state.countdownTimer = Math.max(0, state.countdownTimer - delta);

  if (state.countdownTimer === 0) {
    state.isDetonated = true;
    state.isOverloadArmed = false;

    if (audio && typeof audio.playVioletPlasmaShockwaveBoom === 'function') {
      audio.playVioletPlasmaShockwaveBoom();
    }
    if (audio && typeof audio.playVesselDebrisRainClatter === 'function') {
      audio.playVesselDebrisRainClatter();
    }

    const obliterated = [];
    const radius = SCOUT_OVERLOAD_CONSTANTS.BLAST_RADIUS_METERS;

    for (const entity of entities) {
      if (!entity) continue;
      const dx = (entity.x ?? 0) - state.position.x;
      const dz = (entity.z ?? 0) - state.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist <= radius) {
        const damage = SCOUT_OVERLOAD_CONSTANTS.BLAST_DAMAGE;
        if (typeof entity.takeDamage === 'function') {
          entity.takeDamage(damage);
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - damage);
        }
        entity.isObliterated = true;
        entity.isEmpDisrupted = true;
        entity.empTimer = SCOUT_OVERLOAD_CONSTANTS.EMP_DISRUPT_DURATION_SEC;
        state.victimsObliteratedCount++;
        obliterated.push({ id: entity.id || 'entity_blast', dist, damage });
      }
    }

    return {
      detonated: true,
      blastRadius: radius,
      victimsCount: state.victimsObliteratedCount,
      obliterated,
    };
  }

  return { detonated: false, remainingTime: state.countdownTimer };
}
