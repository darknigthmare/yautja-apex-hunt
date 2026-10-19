// Système de Tir de Répression & Défoliation "Old Painless" M134 (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le minigun M134 portatif de Blain Cooper / Mac fauchant la canopée de Val Verde à 3000 coups/min

import { audioSynth } from '../AudioSynthesizer.js';

export const MINIGUN_CONSTANTS = {
  ROUNDS_PER_MINUTE: 3000,
  ROUNDS_PER_SECOND: 50,
  BULLET_DAMAGE: 16.0,
  CONE_ANGLE_RADIANS: 0.38,            // Cône de dispersion de saturation (~22 degrés)
  MAX_RANGE: 45.0,                     // Portée maximale efficace (m)
  SPINUP_DURATION: 0.60,               // Temps de rotation des canons avant le premier tir (s)
  SUPPRESSION_SLOW: 0.55,              // -55% de vitesse sous le déluge de plomb
  CLOAK_DISRUPT_CHANCE: 0.95,          // 95% de chance de court-circuiter le camouflage optique
};

export function createBlainMinigunState(initialAmmo = 500) {
  return {
    ammo: Number(initialAmmo) || 500,
    maxAmmo: 500,
    spinLevel: 0.0,                    // 0.0 (à l'arrêt) à 1.0 (pleine cadence)
    isSpinning: false,
    isFiring: false,
    roundsFired: 0,
    defoliatedCoverCount: 0,
  };
}

export function spinUpMinigun(state, audio = audioSynth) {
  if (!state || state.ammo <= 0) return false;
  state.isSpinning = true;

  if (audio && typeof audio.playOldPainlessSpinUp === 'function') {
    audio.playOldPainlessSpinUp();
  }
  return true;
}

export function stopMinigun(state) {
  if (!state) return;
  state.isSpinning = false;
  state.isFiring = false;
}

export function fireMinigunBarrage(state, shooterPos, firingAngle = 0, delta = 0.1, targets = [], foliageCovers = [], audio = audioSynth) {
  if (!state || state.ammo <= 0) {
    stopMinigun(state);
    return { roundsFiredThisFrame: 0, targetsHit: 0 };
  }

  // Si les canons ne tournent pas encore à plein régime, pas de tir effectif
  if (state.spinLevel < 0.9) {
    return { roundsFiredThisFrame: 0, targetsHit: 0 };
  }

  state.isFiring = true;
  const dt = Math.max(0, Number(delta) || 0);
  const roundsToFire = Math.min(state.ammo, Math.max(1, Math.floor(MINIGUN_CONSTANTS.ROUNDS_PER_SECOND * dt)));
  state.ammo -= roundsToFire;
  state.roundsFired += roundsToFire;

  if (audio && typeof audio.playDefoliationBarrage === 'function') {
    audio.playDefoliationBarrage();
  }

  let targetsHit = 0;
  const sx = shooterPos?.x || 0;
  const sz = shooterPos?.z || 0;

  // Traitement des cibles dans le cône de saturation
  for (const target of targets) {
    if (!target || target.isDead) continue;
    const tx = target.x ?? (target.position ? target.position.x : 0);
    const tz = target.z ?? (target.position ? target.position.z : 0);

    const dx = tx - sx;
    const dz = tz - sz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= MINIGUN_CONSTANTS.MAX_RANGE) {
      const angleToTarget = Math.atan2(dz, dx);
      let angleDiff = Math.abs(firingAngle - angleToTarget);
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

      if (angleDiff <= (MINIGUN_CONSTANTS.CONE_ANGLE_RADIANS / 2)) {
        targetsHit++;
        // Proportion de balles touchant la cible en fonction de la distance
        const hitRatio = Math.max(0.15, 1.0 - (dist / MINIGUN_CONSTANTS.MAX_RANGE));
        const hits = Math.max(1, Math.floor(roundsToFire * hitRatio * 0.25));
        const totalDamage = hits * MINIGUN_CONSTANTS.BULLET_DAMAGE;

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(totalDamage, 'm134_minigun');
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - totalDamage);
        }

        // Effet de suppression (plaquage au sol / ralentissement drastique)
        target.isSuppressed = true;
        target.suppressionTimer = 1.8;
        target.speedMultiplier = 1.0 - MINIGUN_CONSTANTS.SUPPRESSION_SLOW;

        // Si le Predator est camouflé dans le cône, rupture optique et effusion de sang luminescent
        if (target.isCloaked) {
          target.isCloaked = false;
          target.cloakDisabledTimer = 4.0;
          target.isLuminescentBleeding = true;
        }
      }
    }
  }

  // Défoliation : destruction des buissons et couverts végétaux dans le cône
  for (const fol of foliageCovers) {
    if (!fol || fol.isDestroyed) continue;
    const fx = fol.x || 0;
    const fz = fol.z || 0;
    const dx = fx - sx;
    const dz = fz - sz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= MINIGUN_CONSTANTS.MAX_RANGE) {
      const angleToFol = Math.atan2(dz, dx);
      let angleDiff = Math.abs(firingAngle - angleToFol);
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

      if (angleDiff <= (MINIGUN_CONSTANTS.CONE_ANGLE_RADIANS / 2)) {
        fol.durability = (fol.durability !== undefined ? fol.durability : 100) - (roundsToFire * 6.0);
        if (fol.durability <= 0) {
          fol.durability = 0;
          fol.isDestroyed = true;
          state.defoliatedCoverCount++;
        }
      }
    }
  }

  return { roundsFiredThisFrame: roundsToFire, targetsHit };
}

export function updateBlainMinigunState(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.isSpinning) {
    state.spinLevel = Math.min(1.0, state.spinLevel + (dt / MINIGUN_CONSTANTS.SPINUP_DURATION));
  } else {
    state.spinLevel = Math.max(0.0, state.spinLevel - (dt / MINIGUN_CONSTANTS.SPINUP_DURATION));
  }
}
