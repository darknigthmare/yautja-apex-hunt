// Système du fouet vertébral de Wolf et grappin d'ancrage (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Fouet en vertèbres caudales de Xénomorphe

import { audioSynth } from '../AudioSynthesizer.js';

export const WHIP_CONSTANTS = {
  SWEEP_RANGE: 5.2,          // Portée du balayage de fouet en mètres
  BASE_SLASH_DAMAGE: 95.0,   // Tranchant acéré des segments osseux
  GRAPPLE_MAX_RANGE: 16.0,   // Portée d'accrochage à un chevron ou une branche
  PULL_FORCE: 22.0,          // Force de traction cinétique
};

export function createWolfWhipState() {
  return {
    isGrappled: false,
    grappleAnchor: null,
    whipTension: 0,
    cooldownTimer: 0,
    totalSeveredEnemies: 0,
  };
}

export function performWhipSweep(state, origin, entities = [], audio = audioSynth) {
  if (!state || state.isGrappled) return [];
  const hitTargets = [];

  for (const entity of entities) {
    const dx = entity.x - origin.x;
    const dy = (entity.y || origin.y) - origin.y;
    const dz = entity.z - origin.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= WHIP_CONSTANTS.SWEEP_RANGE) {
      hitTargets.push(entity);
      if (typeof entity.applyDamage === 'function') {
        entity.applyDamage(WHIP_CONSTANTS.BASE_SLASH_DAMAGE, 'xenomorph_chitin_sever');
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - WHIP_CONSTANTS.BASE_SLASH_DAMAGE);
      }
      if (entity.health <= 0) {
        state.totalSeveredEnemies += 1;
      }
    }
  }

  if (audio && typeof audio.playWhipCrack === 'function') {
    audio.playWhipCrack();
  }
  return hitTargets;
}

export function attachWhipGrapple(state, anchorPoint, hunterPos, audio = audioSynth) {
  if (!state || !anchorPoint || !hunterPos) return false;

  const dx = anchorPoint.x - hunterPos.x;
  const dy = anchorPoint.y - hunterPos.y;
  const dz = anchorPoint.z - hunterPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist > WHIP_CONSTANTS.GRAPPLE_MAX_RANGE) return false;

  state.isGrappled = true;
  state.grappleAnchor = { x: anchorPoint.x, y: anchorPoint.y, z: anchorPoint.z };
  state.whipTension = 1.0;

  if (audio && typeof audio.playWhipLatch === 'function') {
    audio.playWhipLatch();
  }
  return true;
}

export function updateWhipGrapple(state, delta, hunterPos) {
  if (!state || !state.isGrappled || !state.grappleAnchor || !hunterPos) return false;
  const dt = Math.max(0, Number(delta) || 0);

  const dx = state.grappleAnchor.x - hunterPos.x;
  const dy = state.grappleAnchor.y - hunterPos.y;
  const dz = state.grappleAnchor.z - hunterPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist < 1.0) {
    releaseWhipGrapple(state);
    return true;
  }

  // Traction vers l'ancrage
  const pullSpeed = WHIP_CONSTANTS.PULL_FORCE;
  hunterPos.x += (dx / dist) * pullSpeed * dt;
  hunterPos.y += (dy / dist) * pullSpeed * dt;
  hunterPos.z += (dz / dist) * pullSpeed * dt;

  return true;
}

export function releaseWhipGrapple(state) {
  if (!state) return;
  state.isGrappled = false;
  state.grappleAnchor = null;
  state.whipTension = 0;
}
