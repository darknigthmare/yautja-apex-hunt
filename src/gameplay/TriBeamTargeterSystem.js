// Système de visée tri-laser convergente et calcul balistique Yautja (Lore 1:1)
// Référence canonique : Predator (1987), Predator 2 (1990), AVP (2004)
// Trois points rouges en triangle équilatéral convergeant vers le centre de masse de la proie.

import { audioSynth } from '../AudioSynthesizer.js';

export const TRI_LASER_LOCK_STATES = Object.freeze({
  IDLE: 'idle',
  ACQUIRING: 'acquiring',
  CONVERGING: 'converging',
  LOCKED_CONVERGED: 'locked_converged',
  TARGET_LOST: 'target_lost',
});

export function createTriBeamTargeter(options = {}) {
  return {
    state: TRI_LASER_LOCK_STATES.IDLE,
    lockTimeRequired: Number(options.lockTimeRequired) || 0.65,
    currentLockTime: 0,
    convergenceRatio: 0, // 0 = écartement maximal (1.2m), 1 = convergence totale (0.05m)
    initialSpreadRadius: Number(options.initialSpreadRadius) || 1.25,
    convergedSpreadRadius: Number(options.convergedSpreadRadius) || 0.06,
    criticalDamageBonus: Number(options.criticalDamageBonus) || 1.5,
    trackedTarget: null,
    targetDistance: 0,
    isWeakpointLocked: false,
    soundTriggered: false,
  };
}

export function resetTriBeamLock(targeter) {
  if (!targeter) return;
  targeter.state = TRI_LASER_LOCK_STATES.IDLE;
  targeter.currentLockTime = 0;
  targeter.convergenceRatio = 0;
  targeter.trackedTarget = null;
  targeter.targetDistance = 0;
  targeter.isWeakpointLocked = false;
  targeter.soundTriggered = false;
}

export function updateTriBeamTargeter(targeter, delta, originPos, targetPos, hasLineOfSight = true, audio = audioSynth) {
  if (!targeter) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (!targetPos || !hasLineOfSight) {
    targeter.state = TRI_LASER_LOCK_STATES.TARGET_LOST;
    targeter.currentLockTime = Math.max(0, targeter.currentLockTime - dt * 2.0);
    targeter.convergenceRatio = targeter.currentLockTime / targeter.lockTimeRequired;
    targeter.soundTriggered = false;
    return;
  }

  // Calcul de la distance
  const dx = (targetPos.x ?? 0) - (originPos?.x ?? 0);
  const dy = (targetPos.y ?? 0) - (originPos?.y ?? 0);
  const dz = (targetPos.z ?? 0) - (originPos?.z ?? 0);
  targeter.targetDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  targeter.trackedTarget = targetPos;

  if (targeter.currentLockTime === 0 && targeter.state === TRI_LASER_LOCK_STATES.IDLE) {
    targeter.state = TRI_LASER_LOCK_STATES.ACQUIRING;
    if (audio && typeof audio.playTriLaserLock === 'function') {
      audio.playTriLaserLock();
    }
  }

  targeter.currentLockTime = Math.min(targeter.lockTimeRequired, targeter.currentLockTime + dt);
  targeter.convergenceRatio = Math.max(0, Math.min(1.0, targeter.currentLockTime / targeter.lockTimeRequired));

  if (targeter.convergenceRatio >= 1.0) {
    if (targeter.state !== TRI_LASER_LOCK_STATES.LOCKED_CONVERGED) {
      targeter.state = TRI_LASER_LOCK_STATES.LOCKED_CONVERGED;
      if (!targeter.soundTriggered && audio && typeof audio.playTriLaserConvergedTone === 'function') {
        audio.playTriLaserConvergedTone();
        targeter.soundTriggered = true;
      }
    }
  } else {
    targeter.state = TRI_LASER_LOCK_STATES.CONVERGING;
  }
}

export function getTriLaserDotOffsets(convergenceRatio, initialRadius = 1.25, convergedRadius = 0.06) {
  const t = Math.max(0, Math.min(1.0, Number(convergenceRatio) || 0));
  // Interpolation exponentielle pour simuler le snap rapide en fin de visée
  const currentRadius = initialRadius * (1 - t * t) + convergedRadius * (t * t);

  // 3 sommets d'un triangle équilatéral dans le plan perpendiculaire au faisceau
  const angles = [
    Math.PI / 2,                // Sommet supérieur
    Math.PI / 2 + (2 * Math.PI) / 3, // Sommet inférieur gauche
    Math.PI / 2 + (4 * Math.PI) / 3, // Sommet inférieur droit
  ];

  return angles.map((angle, index) => ({
    index,
    x: Math.cos(angle) * currentRadius,
    y: Math.sin(angle) * currentRadius,
    radius: currentRadius,
  }));
}

export function getBallisticHitResult(targeter, baseDamage = 45) {
  if (!targeter) return { hit: true, damage: baseDamage, isCritical: false, state: TRI_LASER_LOCK_STATES.IDLE };
  const isLocked = targeter.state === TRI_LASER_LOCK_STATES.LOCKED_CONVERGED;
  const isCritical = isLocked || targeter.convergenceRatio > 0.85;
  const multiplier = isCritical ? targeter.criticalDamageBonus : 1.0;

  return {
    hit: true,
    damage: Math.round(baseDamage * multiplier),
    isCritical,
    convergence: targeter.convergenceRatio,
    state: targeter.state,
  };
}
