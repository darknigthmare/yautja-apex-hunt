// Secteur de Cages d'Ossements Suspendues et Alarme Sonore de Meute (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le campement du Berserker orné de cages suspendues de squelettes tintant au vent et alertant les Hell Hounds en patrouille.

import { audioSynth } from '../AudioSynthesizer.js';

export const BONE_CAGE_CONSTANTS = {
  DETECTION_COLLISION_RADIUS: 3.2,    // Rayon de contact physique avec les chaînes d'ossements
  PACK_ALERT_RADIUS_METERS: 25.0,     // Portée acoustique de l'alerte rameutant la meute
  HOUND_RALLY_SPEED_BOOST: 1.4,       // Accélération de la meute lancée à la poursuite (+40%)
};

export function createBoneCageSectorState() {
  return {
    cages: [
      { id: 'bone_cage_alpha', x: 0, z: -15.0, isRung: false },
      { id: 'bone_cage_bravo', x: 8.0, z: -10.0, isRung: false },
    ],
    alarmActive: false,
    alertedHoundsCount: 0,
  };
}

export function evaluateBoneCageCollision(state, entity, houndPack = [], audio = audioSynth) {
  if (!state || !entity) return { tripped: false };

  const entX = entity.x || 0;
  const entZ = entity.z || 0;

  for (const cage of state.cages) {
    const dx = cage.x - entX;
    const dz = cage.z - entZ;
    if (Math.hypot(dx, dz) <= BONE_CAGE_CONSTANTS.DETECTION_COLLISION_RADIUS) {
      cage.isRung = true;
      state.alarmActive = true;

      if (audio && typeof audio.playBoneCageWindChimeClatter === 'function') {
        audio.playBoneCageWindChimeClatter();
      }

      // Rameuter la meute de Hell Hounds
      let rallied = 0;
      for (const hound of houndPack) {
        if (!hound) continue;
        hound.currentTarget = entity.id || 'intruder';
        hound.speedMultiplier = BONE_CAGE_CONSTANTS.HOUND_RALLY_SPEED_BOOST;
        hound.isRalliedByAlarm = true;
        rallied++;
        state.alertedHoundsCount++;
      }

      return {
        tripped: true,
        cageId: cage.id,
        houndsAlerted: rallied,
      };
    }
  }

  return { tripped: false };
}
