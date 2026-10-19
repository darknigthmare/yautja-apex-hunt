// Nid de Reine Xénomorphe & Sécrétion de Résine Immobilisante (AVP 2004 / Aliens — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) & Aliens (1986) — Les parois de résine biomécanique noire sécrétées au cœur de la ruche qui engluent et cocufient les intrus s'ils ne tranchent pas les filaments aux lames de poignet.

import { audioSynth } from '../AudioSynthesizer.js';

export const HIVE_RESIN_CONSTANTS = {
  ENTRAPMENT_THRESHOLD_SEC: 2.5,     // Temps passé dans la résine avant immobilisation complète
  MOVEMENT_SLOW_FACTOR: 0.35,        // Vitesse réduite à 35% dans la résine fraîche
  WRISTBLADE_SEVER_DAMAGE_REQ: 50,   // Puissance de coupe requise pour trancher le cocon
};

export function createQueenHiveResinSectorState() {
  return {
    resinZones: [],
    cocoonedActorsCount: 0,
  };
}

export function registerHiveResinZone(state, position = { x: 0, z: 0 }, radius = 4.0) {
  if (!state) return false;
  state.resinZones.push({
    x: position.x || 0,
    z: position.z || 0,
    radius,
  });
  return true;
}

export function evaluateHiveResinEntrapment(state, actor, exposureTimeSec = 3.0, audio = audioSynth) {
  if (!state || !actor || !Array.isArray(state.resinZones)) {
    return { entrapped: false };
  }

  for (const zone of state.resinZones) {
    const dist = Math.hypot((actor.x || 0) - zone.x, (actor.z || 0) - zone.z);
    if (dist <= zone.radius) {
      actor.speedMultiplier = HIVE_RESIN_CONSTANTS.MOVEMENT_SLOW_FACTOR;

      if (exposureTimeSec >= HIVE_RESIN_CONSTANTS.ENTRAPMENT_THRESHOLD_SEC) {
        actor.isCocoonedInResin = true;
        actor.canMove = false;
        state.cocoonedActorsCount++;

        if (audio && typeof audio.playQueenHiveResinCocoonStretch === 'function') {
          audio.playQueenHiveResinCocoonStretch();
        }

        return {
          entrapped: true,
          cocooned: true,
        };
      }

      return {
        entrapped: true,
        cocooned: false,
      };
    }
  }

  return { entrapped: false };
}

export function severResinCocoonWithBlades(actor, bladeSlashDamage = 100) {
  if (!actor || !actor.isCocoonedInResin) return false;
  if (bladeSlashDamage >= HIVE_RESIN_CONSTANTS.WRISTBLADE_SEVER_DAMAGE_REQ) {
    actor.isCocoonedInResin = false;
    actor.canMove = true;
    actor.speedMultiplier = 1.0;
    return true;
  }
  return false;
}
