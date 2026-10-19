// Secteur de Flèches Harpons et Câble Piégé de Couloir (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le City Hunter tendant des câbles de monofilament ultra-résistants entre deux parois via ses dards de speargun pneumatiques.

import { audioSynth } from '../AudioSynthesizer.js';

export const TRIPWIRE_CONSTANTS = {
  MAX_SPAN_DISTANCE: 14.0,           // Distance maximale entre les deux parois ancrées (mètres)
  WIRE_HEIGHT_METERS: 0.45,          // Hauteur du fil tendu par rapport au sol (hauteur tibia)
  LACERATION_DAMAGE: 55.0,           // Dégâts tranchants de coupure ligamentaire
  KNOCKDOWN_DURATION_SEC: 2.2,       // Durée de renversement au sol de la cible
};

export function createTripwireSectorState() {
  return {
    activeTripwires: [], // Array of { id, anchorA: {x, y, z}, anchorB: {x, y, z}, isTriggered: false }
  };
}

export function anchorTripwireSpears(state, anchorA, anchorB, audio = audioSynth) {
  if (!state || !anchorA || !anchorB) return null;

  const dx = anchorB.x - anchorA.x;
  const dz = anchorB.z - anchorA.z;
  const span = Math.hypot(dx, dz);

  if (span > TRIPWIRE_CONSTANTS.MAX_SPAN_DISTANCE) {
    return { success: false, reason: 'SPAN_TOO_WIDE' };
  }

  if (audio && typeof audio.playSpearPneumaticThwip === 'function') {
    audio.playSpearPneumaticThwip();
  }

  const wireId = `tripwire_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const tripwire = {
    id: wireId,
    anchorA: { ...anchorA, y: anchorA.y || TRIPWIRE_CONSTANTS.WIRE_HEIGHT_METERS },
    anchorB: { ...anchorB, y: anchorB.y || TRIPWIRE_CONSTANTS.WIRE_HEIGHT_METERS },
    spanDistance: span,
    isTriggered: false,
  };

  state.activeTripwires.push(tripwire);

  return {
    success: true,
    tripwire,
  };
}

export function evaluateTripwireCrossing(state, entity, audio = audioSynth) {
  if (!state || !entity) return { tripped: false };

  const posX = entity.x ?? 0;
  const posZ = entity.z ?? 0;
  const posY = entity.y ?? 0;

  for (const wire of state.activeTripwires) {
    if (wire.isTriggered) continue;

    // Vérifier si l'entité est au niveau de hauteur du câble (sol à genoux)
    if (Math.abs(posY - TRIPWIRE_CONSTANTS.WIRE_HEIGHT_METERS) > 0.8) continue;

    // Distance point - segment dans le plan XZ
    const ax = wire.anchorA.x;
    const az = wire.anchorA.z;
    const bx = wire.anchorB.x;
    const bz = wire.anchorB.z;

    const abx = bx - ax;
    const abz = bz - az;
    const apx = posX - ax;
    const apz = posZ - az;

    const abLenSq = abx * abx + abz * abz;
    if (abLenSq === 0) continue;

    const t = Math.max(0, Math.min(1, (apx * abx + apz * abz) / abLenSq));
    const projX = ax + t * abx;
    const projZ = az + t * abz;

    const distToWire = Math.hypot(posX - projX, posZ - projZ);

    if (distToWire <= 0.65) {
      // Impact avec le fil tendu
      wire.isTriggered = true;

      if (audio && typeof audio.playTripwireSnapWhistle === 'function') {
        audio.playTripwireSnapWhistle();
      }

      const damage = TRIPWIRE_CONSTANTS.LACERATION_DAMAGE;
      if (typeof entity.takeDamage === 'function') {
        entity.takeDamage(damage);
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - damage);
      }

      entity.isKnockedDown = true;
      entity.knockdownTimer = TRIPWIRE_CONSTANTS.KNOCKDOWN_DURATION_SEC;

      return {
        tripped: true,
        wireId: wire.id,
        victimId: entity.id || 'target_runner',
        damageDealt: damage,
      };
    }
  }

  return { tripped: false };
}

export function updateTripwireSector(state, delta = 0.1, entities = []) {
  if (!state) return;

  for (const entity of entities) {
    if (entity && entity.isKnockedDown && entity.knockdownTimer > 0) {
      entity.knockdownTimer = Math.max(0, entity.knockdownTimer - delta);
      if (entity.knockdownTimer === 0) {
        entity.isKnockedDown = false;
      }
    }
  }
}
