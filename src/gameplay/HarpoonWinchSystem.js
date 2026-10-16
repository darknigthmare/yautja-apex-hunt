// Système de harpon tracté avec treuil motorisé et suspension verticale (Lore 1:1)
// Référence canonique : Predator 2 (1990) & Prey (2022) - Harponnage, treuil de rappel et suspension de proie

import { audioSynth } from '../AudioSynthesizer.js';

export const HARPOON_WINCH_CONSTANTS = {
  MAX_CABLE_LENGTH: 35.0,        // Longueur maximale du câble tressé en alliage Yautja (m)
  PROJECTILE_SPEED: 55.0,        // Vélocité de propulsion initiale du harpon (m/s)
  HARPOON_DAMAGE: 58.0,          // Dégâts d'impact perforant
  WINCH_PULL_SPEED: 12.0,        // Vitesse d'enroulement motorisé du treuil (m/s)
  HOIST_VERTICAL_RATE: 4.5,      // Vitesse d'élévation verticale lors de la pendaison
  CABLE_TENSION_LIMIT: 2500.0,   // Tension de rupture du câble (Newtons)
  HOLD_TENSION_DRAIN: 15.0,      // Consommation d'énergie du treuil motorisé (pts/s)
};

export function createHarpoonWinchState() {
  return {
    isFired: false,
    isAttachedToTarget: false,
    isAnchoredToOverhead: false,
    cableLength: 0,
    currentTension: 0,
    winchEngaged: false,
    targetEntity: null,
    harpoonPosition: { x: 0, y: 0, z: 0 },
    harpoonVelocity: { x: 0, y: 0, z: 0 },
    anchorPoint: null, // Point d'ancrage en hauteur (branche, poutre, chevron)
    hoistedTargetId: null,
    hoistAltitude: 0,
    remainingHarpoons: 3,
    cooldownTimer: 0,
  };
}

export function fireTetheredHarpoon(state, origin, direction, audio = audioSynth) {
  if (!state || state.remainingHarpoons <= 0 || state.isFired || state.cooldownTimer > 0) {
    return false;
  }

  const len = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z) || 1;
  const dirX = direction.x / len;
  const dirY = direction.y / len;
  const dirZ = direction.z / len;

  state.isFired = true;
  state.isAttachedToTarget = false;
  state.isAnchoredToOverhead = false;
  state.remainingHarpoons -= 1;
  state.cooldownTimer = 1.2;
  state.cableLength = 0;
  state.currentTension = 150.0;
  state.targetEntity = null;
  state.harpoonPosition = { x: origin.x, y: origin.y, z: origin.z };
  state.harpoonVelocity = {
    x: dirX * HARPOON_WINCH_CONSTANTS.PROJECTILE_SPEED,
    y: dirY * HARPOON_WINCH_CONSTANTS.PROJECTILE_SPEED,
    z: dirZ * HARPOON_WINCH_CONSTANTS.PROJECTILE_SPEED,
  };

  if (audio && typeof audio.playHarpoonCableFire === 'function') {
    audio.playHarpoonCableFire();
  }
  return true;
}

export function engageWinchRetract(state, engage = true, audio = audioSynth) {
  if (!state) return;
  state.winchEngaged = Boolean(engage);
  if (state.winchEngaged && (state.isAttachedToTarget || state.isAnchoredToOverhead)) {
    if (audio && typeof audio.playWinchMotorWhine === 'function') {
      audio.playWinchMotorWhine();
    }
  }
}

export function anchorOverheadPoint(state, overheadPoint) {
  if (!state || !overheadPoint) return;
  state.anchorPoint = { x: overheadPoint.x, y: overheadPoint.y, z: overheadPoint.z };
  state.isAnchoredToOverhead = true;
}

export function updateHarpoonWinch(state, delta, hunterPos, entities = [], audio = audioSynth) {
  if (!state || !state.isFired) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  // Trajectoire en vol si pas encore accroché
  if (!state.isAttachedToTarget && !state.isAnchoredToOverhead) {
    state.harpoonPosition.x += state.harpoonVelocity.x * dt;
    state.harpoonPosition.y += state.harpoonVelocity.y * dt;
    state.harpoonPosition.z += state.harpoonVelocity.z * dt;

    const dx = state.harpoonPosition.x - hunterPos.x;
    const dy = state.harpoonPosition.y - hunterPos.y;
    const dz = state.harpoonPosition.z - hunterPos.z;
    state.cableLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (state.cableLength >= HARPOON_WINCH_CONSTANTS.MAX_CABLE_LENGTH) {
      // Fin de course de câble
      resetHarpoonState(state);
      return;
    }

    // Détection de collision avec les cibles
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const radius = ent.collisionRadius || 1.1;

      const cdx = state.harpoonPosition.x - ex;
      const cdy = state.harpoonPosition.y - ey;
      const cdz = state.harpoonPosition.z - ez;
      const dist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz);

      if (dist <= radius) {
        // Empalement réussi
        state.isAttachedToTarget = true;
        state.targetEntity = ent;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(HARPOON_WINCH_CONSTANTS.HARPOON_DAMAGE, 'harpoon_puncture');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - HARPOON_WINCH_CONSTANTS.HARPOON_DAMAGE);
        }
        ent.isHarpooned = true;
        break;
      }
    }
  }

  // Traction motorisée si treuil enclenché
  if (state.winchEngaged && state.isAttachedToTarget && state.targetEntity) {
    const ent = state.targetEntity;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const pullTarget = state.anchorPoint || hunterPos;
    const pdx = pullTarget.x - ex;
    const pdy = pullTarget.y - ey;
    const pdz = pullTarget.z - ez;
    const pullDist = Math.sqrt(pdx * pdx + pdy * pdy + pdz * pdz);

    if (pullDist > 1.2) {
      const step = Math.min(pullDist, HARPOON_WINCH_CONSTANTS.WINCH_PULL_SPEED * dt);
      const nx = ex + (pdx / pullDist) * step;
      const ny = ey + (pdy / pullDist) * step;
      const nz = ez + (pdz / pullDist) * step;

      if (ent.position) {
        ent.position.x = nx;
        ent.position.y = ny;
        ent.position.z = nz;
      }
      ent.x = nx;
      ent.y = ny;
      ent.z = nz;
      state.cableLength = pullDist - step;
      state.currentTension = 850.0;
    } else {
      // Arrivée au point d'ancrage / suspension
      if (state.anchorPoint && ey > 2.0 && !ent.isHoisted) {
        ent.isHoisted = true;
        state.hoistedTargetId = ent.id || 'target_suspended';
        state.hoistAltitude = ey;
        if (audio && typeof audio.playPreyHoistChoke === 'function') {
          audio.playPreyHoistChoke();
        }
      }
    }
  }
}

export function resetHarpoonState(state) {
  if (!state) return;
  state.isFired = false;
  state.isAttachedToTarget = false;
  state.isAnchoredToOverhead = false;
  state.winchEngaged = false;
  state.targetEntity = null;
  state.anchorPoint = null;
  state.cableLength = 0;
  state.currentTension = 0;
}
