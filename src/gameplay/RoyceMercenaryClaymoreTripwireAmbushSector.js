// Embuscade de Mines Claymore M18A1 à Fil-Piège de Royce (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — L'escouade de mercenaires dirigée par Royce piégeant le campement avec des mines directionnelles Claymore à billes d'acier et fils-pièges.

import { audioSynth } from '../AudioSynthesizer.js';

export const CLAYMORE_AMBUSH_CONSTANTS = {
  TRIGGER_CONE_RANGE_M: 4.0,          // Portée du fil-piège et cône directionnel
  BALL_BEARING_SHRAPNEL_DAMAGE: 140,  // Dégâts de la gerbe de 700 billes d'acier
  CLOAK_DISRUPTION_SEC: 5.0,          // Durée de court-circuit du camouflage optique
};

export function createClaymoreAmbushSectorState() {
  return {
    riggedClaymores: [],
    disarmedCount: 0,
  };
}

export function rigMercenaryClaymore(state, position = { x: 0, z: 0 }, facingAngle = 0) {
  if (!state) return false;
  state.riggedClaymores.push({
    x: position.x || 0,
    z: position.z || 0,
    facingAngle,
    armed: true,
  });
  return true;
}

export function evaluateClaymoreTripwire(state, hunterPos, hunter, isThermalOrEmVisionActive = false, audio = audioSynth) {
  if (!state || !hunterPos || !Array.isArray(state.riggedClaymores)) {
    return { triggered: false, disarmed: false };
  }

  for (const mine of state.riggedClaymores) {
    if (!mine.armed) continue;
    const dist = Math.hypot((hunterPos.x || 0) - mine.x, (hunterPos.z || 0) - mine.z);

    if (dist <= CLAYMORE_AMBUSH_CONSTANTS.TRIGGER_CONE_RANGE_M) {
      mine.armed = false;

      // Si le masque du chasseur est en mode détection thermique/EM, il repère le fil-piège et le neutralise
      if (isThermalOrEmVisionActive) {
        state.disarmedCount++;
        return {
          triggered: false,
          disarmed: true,
        };
      }

      if (audio && typeof audio.playClaymoreTripwireClickBlast === 'function') {
        audio.playClaymoreTripwireClickBlast();
      }

      if (hunter) {
        hunter.isCloaked = false;
        hunter.cloakDisruptedTimer = CLAYMORE_AMBUSH_CONSTANTS.CLOAK_DISRUPTION_SEC;
        if (typeof hunter.takeDamage === 'function') {
          hunter.takeDamage(CLAYMORE_AMBUSH_CONSTANTS.BALL_BEARING_SHRAPNEL_DAMAGE);
        } else if (typeof hunter.health === 'number') {
          hunter.health = Math.max(0, hunter.health - CLAYMORE_AMBUSH_CONSTANTS.BALL_BEARING_SHRAPNEL_DAMAGE);
        }
      }

      return {
        triggered: true,
        disarmed: false,
        damageDealt: CLAYMORE_AMBUSH_CONSTANTS.BALL_BEARING_SHRAPNEL_DAMAGE,
      };
    }
  }

  return { triggered: false, disarmed: false };
}
