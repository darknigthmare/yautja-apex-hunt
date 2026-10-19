// Directeur de Sifflet de Rappel & Meute de Molosses du Tracker (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Tracker Super Predator commande sa meute de Molosses extraterrestres à l'aide d'un sifflet en os

import { audioSynth } from '../AudioSynthesizer.js';

export const TRACKER_WHISTLE_CONSTANTS = {
  CALL_RADIUS: 50.0,
  HOUND_CHARGE_SPEED: 10.2,            // Vélocité lors de la ruée coordonnée (m/s)
  FLANK_ANGLE: Math.PI / 4,            // Arc de contournement de 45 degrés
  WHISTLE_COOLDOWN: 7.5,               // Temps de recharge du sifflet (s)
  PACK_FRENZY_DAMAGE_BONUS: 0.35,      // +35% de férocité lors de l'assaut en meute
};

export function createTrackerWhistleState() {
  return {
    cooldownTimer: 0.0,
    isFlockConverging: false,
    flockTargetId: null,
    commandedHoundsCount: 0,
    callsExecuted: 0,
  };
}

export function soundTrackerWhistle(state, targetEntity, hounds = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0 || !targetEntity) {
    return { success: false, reason: 'En recharge ou cible invalide' };
  }

  state.cooldownTimer = TRACKER_WHISTLE_CONSTANTS.WHISTLE_COOLDOWN;
  state.isFlockConverging = true;
  state.flockTargetId = targetEntity.id || 'target';
  state.callsExecuted++;

  if (audio && typeof audio.playTrackerWhistleCall === 'function') {
    audio.playTrackerWhistleCall();
  }

  let commanded = 0;
  const tx = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const tz = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  // Affectation des angles d'encerclement pour chaque molosse
  for (let i = 0; i < hounds.length; i++) {
    const hound = hounds[i];
    if (!hound || hound.isDead) continue;

    hound.isEnragedByWhistle = true;
    hound.flankAngle = (i % 2 === 0 ? 1 : -1) * TRACKER_WHISTLE_CONSTANTS.FLANK_ANGLE * (1 + Math.floor(i / 2));
    hound.targetPosition = { x: tx, z: tz };
    hound.meleeDamageBuff = 1.0 + TRACKER_WHISTLE_CONSTANTS.PACK_FRENZY_DAMAGE_BONUS;
    commanded++;
  }

  state.commandedHoundsCount = commanded;

  if (commanded > 0 && audio && typeof audio.playHoundPackSnarl === 'function') {
    audio.playHoundPackSnarl();
  }

  return { success: true, houndsAlerted: commanded };
}

export function updateTrackerWhistleDirector(state, delta, hounds = [], targetEntity = null) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  if (!state.isFlockConverging || !targetEntity || targetEntity.isDead) {
    state.isFlockConverging = false;
    return;
  }

  const tx = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const tz = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  // Convergence continue des molosses vers la cible désignée
  for (const hound of hounds) {
    if (!hound || hound.isDead || !hound.isEnragedByWhistle) continue;
    const hx = hound.x ?? (hound.position ? hound.position.x : 0);
    const hz = hound.z ?? (hound.position ? hound.position.z : 0);

    const dx = tx - hx;
    const dz = tz - hz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 1.8) {
      const baseAngle = Math.atan2(dz, dx) + (hound.flankAngle || 0) * 0.3;
      hound.vx = Math.cos(baseAngle) * TRACKER_WHISTLE_CONSTANTS.HOUND_CHARGE_SPEED;
      hound.vz = Math.sin(baseAngle) * TRACKER_WHISTLE_CONSTANTS.HOUND_CHARGE_SPEED;

      hound.x = hx + hound.vx * dt;
      hound.z = hz + hound.vz * dt;
    }
  }
}
