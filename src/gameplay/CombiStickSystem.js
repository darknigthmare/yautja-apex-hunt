// Système de combat avancé du Combi-stick Yautja (Lore 1:1)
// Références canoniques : Predator 2 (1990) (lance télescopique double pointe) et AVP (2004)

import { audioSynth } from '../AudioSynthesizer.js';

export function createCombiStickState() {
  return {
    isExtended: true,
    lengthMeters: 2.4,
    spinParryTimer: 0,
    spinParryDuration: 1.8,
    spinParryEnergyCost: 15,
    lastThrustCooldown: 0,
    pinnedTargets: [],
  };
}

export function toggleCombiStickExtension(state, audio = audioSynth) {
  if (!state) return false;
  state.isExtended = !state.isExtended;
  state.lengthMeters = state.isExtended ? 2.4 : 0.42;

  if (audio && typeof audio.playCombiStickExtend === 'function') {
    audio.playCombiStickExtend();
  }
  return state.isExtended;
}

export function activateSpinParry(state, playerEnergy = 100, audio = audioSynth) {
  if (!state) return { success: false, reason: 'no_state' };
  if (playerEnergy < state.spinParryEnergyCost) {
    return { success: false, reason: 'insufficient_energy' };
  }
  if (!state.isExtended) {
    toggleCombiStickExtension(state, audio);
  }

  state.spinParryTimer = state.spinParryDuration;
  if (audio && typeof audio.playCombiStickSpinParry === 'function') {
    audio.playCombiStickSpinParry();
  }

  return {
    success: true,
    duration: state.spinParryDuration,
    energyCost: state.spinParryEnergyCost,
  };
}

export function updateCombiStickState(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);
  if (state.spinParryTimer > 0) {
    state.spinParryTimer = Math.max(0, state.spinParryTimer - dt);
  }
  if (state.lastThrustCooldown > 0) {
    state.lastThrustCooldown = Math.max(0, state.lastThrustCooldown - dt);
  }
}

export function checkProjectileDeflection(state, incomingProjectile) {
  if (!state || state.spinParryTimer <= 0) {
    return { deflected: false };
  }

  // Pendant le moulinet, les balles et projectiles balistiques sont repoussés
  const canDeflect = incomingProjectile?.type !== 'heavy_mortar';
  return {
    deflected: canDeflect,
    remainingParryTime: state.spinParryTimer,
  };
}

export function calculateCombiStickMeleeThrust(state, distance, target) {
  if (!state || !state.isExtended) {
    return { hit: false, reason: 'collapsed_state', damage: 0 };
  }

  const maxReach = 9.8; // Portée étendue de la hampe de 2.4m
  if (distance > maxReach) {
    return { hit: false, reason: 'out_of_reach', damage: 0 };
  }

  const baseDamage = 78;
  const armorPiercingMultiplier = 1.35; // Transperce le blindage corporel
  const isArmored = Boolean(target?.isArmored || target?.armor > 0);
  const finalDamage = Math.round(baseDamage * (isArmored ? armorPiercingMultiplier : 1.0));

  return {
    hit: true,
    damage: finalDamage,
    armorPiercing: true,
    impalementPotential: distance <= 4.0,
  };
}

export function resolveThrownImpalement(spearPos, spearDir, target, audio = audioSynth) {
  if (!target) return { hit: false };
  const targetPos = target.position ?? target.mesh?.position;
  if (!targetPos) return { hit: false };

  const dx = spearPos.x - targetPos.x;
  const dz = spearPos.z - targetPos.z;
  const dist = Math.hypot(dx, dz);

  if (dist <= 1.8) {
    const damage = 135;
    if (typeof target.takeDamage === 'function') {
      target.takeDamage(damage);
    } else if (typeof target.health === 'number') {
      target.health = Math.max(0, target.health - damage);
      if (target.health <= 0) target.isDead = true;
    }

    if (audio && typeof audio.playCombiStickImpactThud === 'function') {
      audio.playCombiStickImpactThud();
    }

    return {
      hit: true,
      pinned: true,
      damage,
      pinLocation: { ...targetPos },
    };
  }

  return { hit: false };
}
