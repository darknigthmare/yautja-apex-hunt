// Système de guidage laser dynamique et rappel du Disque Intelligent (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Le City Hunter maniant le Smart Disc

import { audioSynth } from '../AudioSynthesizer.js';

export const SMART_DISC_STATES = {
  HOLSTERED: 'HOLSTERED',
  FLIGHT: 'FLIGHT',
  RETURNING: 'RETURNING',
  CAUGHT: 'CAUGHT',
};

export const SMART_DISC_CONSTANTS = {
  CRUISE_SPEED: 32.0,       // Vitesse de vol gyroscopique (m/s)
  RETURN_SPEED: 38.0,       // Vitesse de rappel magnétique
  MAX_FLIGHT_TIME: 4.0,     // Durée de vol avant retour automatique obligatoire
  BASE_DAMAGE: 85.0,        // Dégâts de tranchant moléculaire
  CATCH_RADIUS: 1.5,        // Rayon de capture par le gantelet
};

export function createSmartDiscState() {
  return {
    state: SMART_DISC_STATES.HOLSTERED,
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    flightTimer: 0,
    targetQueue: [],
    currentTargetIndex: 0,
    ownerPosition: { x: 0, y: 0, z: 0 },
    hitEntities: new Set(),
  };
}

export function launchSmartDisc(discState, origin, targets = [], audio = audioSynth) {
  if (!discState || discState.state !== SMART_DISC_STATES.HOLSTERED) return false;

  discState.state = SMART_DISC_STATES.FLIGHT;
  discState.position = { x: origin.x, y: origin.y, z: origin.z };
  discState.ownerPosition = { x: origin.x, y: origin.y, z: origin.z };
  discState.flightTimer = 0;
  discState.targetQueue = Array.isArray(targets) ? [...targets] : [];
  discState.currentTargetIndex = 0;
  discState.hitEntities.clear();

  // Direction initiale
  if (discState.targetQueue.length > 0) {
    const firstTarget = discState.targetQueue[0];
    const dx = firstTarget.x - origin.x;
    const dy = (firstTarget.y || origin.y) - origin.y;
    const dz = firstTarget.z - origin.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    discState.velocity = {
      x: (dx / dist) * SMART_DISC_CONSTANTS.CRUISE_SPEED,
      y: (dy / dist) * SMART_DISC_CONSTANTS.CRUISE_SPEED,
      z: (dz / dist) * SMART_DISC_CONSTANTS.CRUISE_SPEED,
    };
  } else {
    discState.velocity = { x: 0, y: 0, z: -SMART_DISC_CONSTANTS.CRUISE_SPEED };
  }

  if (audio && typeof audio.playSmartDiscHum === 'function') {
    audio.playSmartDiscHum();
  }
  return true;
}

export function recallSmartDisc(discState) {
  if (!discState || discState.state === SMART_DISC_STATES.HOLSTERED) return false;
  discState.state = SMART_DISC_STATES.RETURNING;
  return true;
}

export function updateSmartDisc(discState, delta, ownerPos, targetEntities = [], audio = audioSynth) {
  if (!discState || discState.state === SMART_DISC_STATES.HOLSTERED) return discState?.state;
  const dt = Math.max(0, Number(delta) || 0);
  discState.flightTimer += dt;

  if (ownerPos) {
    discState.ownerPosition = { x: ownerPos.x, y: ownerPos.y, z: ownerPos.z };
  }

  // 1. Phase de vol offensif
  if (discState.state === SMART_DISC_STATES.FLIGHT) {
    // Si la cible actuelle existe, virage vers elle
    if (discState.currentTargetIndex < discState.targetQueue.length) {
      const target = discState.targetQueue[discState.currentTargetIndex];
      const dx = target.x - discState.position.x;
      const dy = (target.y || discState.position.y) - discState.position.y;
      const dz = target.z - discState.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 1.0) {
        // Cible atteinte, passage à la suivante
        discState.currentTargetIndex += 1;
      } else {
        const speed = SMART_DISC_CONSTANTS.CRUISE_SPEED;
        discState.velocity.x += ((dx / dist) * speed - discState.velocity.x) * 8.0 * dt;
        discState.velocity.y += ((dy / dist) * speed - discState.velocity.y) * 8.0 * dt;
        discState.velocity.z += ((dz / dist) * speed - discState.velocity.z) * 8.0 * dt;
      }
    } else {
      // Toutes les cibles franchies -> rappel automatique
      discState.state = SMART_DISC_STATES.RETURNING;
    }

    // Sécurité durée de vol
    if (discState.flightTimer >= SMART_DISC_CONSTANTS.MAX_FLIGHT_TIME) {
      discState.state = SMART_DISC_STATES.RETURNING;
    }
  }

  // 2. Phase de retour vers le gantelet Yautja
  if (discState.state === SMART_DISC_STATES.RETURNING) {
    const dx = discState.ownerPosition.x - discState.position.x;
    const dy = discState.ownerPosition.y - discState.position.y;
    const dz = discState.ownerPosition.z - discState.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= SMART_DISC_CONSTANTS.CATCH_RADIUS) {
      discState.state = SMART_DISC_STATES.HOLSTERED;
      discState.position = { ...discState.ownerPosition };
      discState.velocity = { x: 0, y: 0, z: 0 };

      if (audio && typeof audio.playSmartDiscCatch === 'function') {
        audio.playSmartDiscCatch();
      }
      return discState.state;
    }

    const speed = SMART_DISC_CONSTANTS.RETURN_SPEED;
    discState.velocity.x = (dx / dist) * speed;
    discState.velocity.y = (dy / dist) * speed;
    discState.velocity.z = (dz / dist) * speed;
  }

  // Déplacement
  discState.position.x += discState.velocity.x * dt;
  discState.position.y += discState.velocity.y * dt;
  discState.position.z += discState.velocity.z * dt;

  // Détection de collision et dégâts sur les entités
  for (const entity of targetEntities) {
    if (!discState.hitEntities.has(entity.id || entity)) {
      const edx = entity.x - discState.position.x;
      const edy = (entity.y || discState.position.y) - discState.position.y;
      const edz = entity.z - discState.position.z;
      const edist = Math.sqrt(edx * edx + edy * edy + edz * edz);
      if (edist <= 1.6) {
        discState.hitEntities.add(entity.id || entity);
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(SMART_DISC_CONSTANTS.BASE_DAMAGE, 'smart_disc_slice');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - SMART_DISC_CONSTANTS.BASE_DAMAGE);
        }
      }
    }
  }

  return discState.state;
}
