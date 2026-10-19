// Système de Fouet Segmenté en Queue de Xénomorphe de Wolf (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf confectionne un fouet d'estoc barbelé tranchant les Xénomorphes en deux

import { audioSynth } from '../AudioSynthesizer.js';

export const WHIP_CONSTANTS = {
  MAX_REACH: 8.5,                      // Portée de frappe du fouet barbelé (m)
  WHIP_DAMAGE: 125.0,                  // Dégâts tranchants de découpage transversal
  SWEEP_ARC_RADIANS: 1.4,              // Cône de balayage horizontal (~80 degrés)
  COOLDOWN_DURATION: 1.4,              // Délai entre deux claquements (s)
};

export function createWolfTailWhipState() {
  return {
    cooldownTimer: 0.0,
    isLashing: false,
    enemiesBisectedCount: 0,
    totalLashes: 0,
  };
}

export function lashTailWhip(state, wielderPos, aimAngle = 0, targets = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return { struck: false, reason: 'En recharge' };

  state.cooldownTimer = WHIP_CONSTANTS.COOLDOWN_DURATION;
  state.isLashing = true;
  state.totalLashes++;

  if (audio && typeof audio.playXenoTailWhipSnapCrack === 'function') {
    audio.playXenoTailWhipSnapCrack();
  }

  let hitCount = 0;
  const wx = wielderPos?.x || 0;
  const wz = wielderPos?.z || 0;

  for (const target of targets) {
    if (!target || target.isDead) continue;
    const tx = target.x ?? (target.position ? target.position.x : 0);
    const tz = target.z ?? (target.position ? target.position.z : 0);

    const dx = tx - wx;
    const dz = tz - wz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= WHIP_CONSTANTS.MAX_REACH) {
      const angleToTarget = Math.atan2(dz, dx);
      let angleDiff = Math.abs(aimAngle - angleToTarget);
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

      if (angleDiff <= (WHIP_CONSTANTS.SWEEP_ARC_RADIANS / 2)) {
        hitCount++;
        state.enemiesBisectedCount++;

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(WHIP_CONSTANTS.WHIP_DAMAGE, 'tail_whip_bisect');
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - WHIP_CONSTANTS.WHIP_DAMAGE);
        }

        target.isBisected = true;
        target.isSevered = true;

        if (audio && typeof audio.playWhipWrapConstrictHiss === 'function') {
          audio.playWhipWrapConstrictHiss();
        }
      }
    }
  }

  return { struck: true, hitCount };
}

export function updateWolfTailWhip(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
    if (state.cooldownTimer <= 0) {
      state.isLashing = false;
    }
  }
}
