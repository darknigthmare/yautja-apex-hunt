// Secteur de Fil de Rasoir en Colimaçon et Sectionnement de Membres (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf tendant des bobines de fil diamanté en spirale dans les couloirs de l'hôpital de Gunnison pour découper les xénomorphes au passage.

import { audioSynth } from '../AudioSynthesizer.js';

export const RAZOR_SNARE_CONSTANTS = {
  SNARE_RADIUS_METERS: 2.8,           // Rayon de détente du fil en spirale
  DISMEMBER_DAMAGE: 160.0,            // Dégâts de cisaillement net
  BLEED_DURATION_SEC: 5.0,            // Saignement hémorragique consécutif à l'entaille
};

export function createRazorSnareSectorState() {
  return {
    snares: [], // Array of { id, x, z, isTripped }
    victimsDismemberedCount: 0,
  };
}

export function placeSpiralRazorCoil(state, pos = { x: 0, z: 0 }) {
  if (!state || !pos) return null;

  const snareId = `razor_coil_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const snare = {
    id: snareId,
    x: pos.x || 0,
    z: pos.z || 0,
    isTripped: false,
  };

  state.snares.push(snare);
  return snare;
}

export function evaluateRazorSnareTrip(state, entity, audio = audioSynth) {
  if (!state || !entity) return { tripped: false };

  const entX = entity.x || 0;
  const entZ = entity.z || 0;

  for (const snare of state.snares) {
    if (snare.isTripped) continue;

    const dx = snare.x - entX;
    const dz = snare.z - entZ;
    if (Math.hypot(dx, dz) <= RAZOR_SNARE_CONSTANTS.SNARE_RADIUS_METERS) {
      snare.isTripped = true;
      state.victimsDismemberedCount++;

      if (audio && typeof audio.playRazorWireCoilSpringTwang === 'function') {
        audio.playRazorWireCoilSpringTwang();
      }

      const damage = RAZOR_SNARE_CONSTANTS.DISMEMBER_DAMAGE;
      if (typeof entity.takeDamage === 'function') {
        entity.takeDamage(damage);
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - damage);
      }

      entity.isDismembered = true;

      return {
        tripped: true,
        snareId: snare.id,
        damageDealt: damage,
        dismembered: true,
      };
    }
  }

  return { tripped: false };
}
