// Directeur de calcul balistique prédictif du Biomasque Yautja (Lore 1:1)
// Référence canonique : Predator (1987) & AVP (2004) - Réticule d'anticipation de trajectoire et ciblage cinématique

import { audioSynth } from '../AudioSynthesizer.js';

export function computePredictiveLeadPosition(shooterPos, targetPos, targetVelocity, projectileSpeed, audio = audioSynth) {
  if (!shooterPos || !targetPos) return null;

  const vx = targetVelocity ? Number(targetVelocity.x) || 0 : 0;
  const vy = targetVelocity ? Number(targetVelocity.y) || 0 : 0;
  const vz = targetVelocity ? Number(targetVelocity.z) || 0 : 0;
  const vSpeed = Math.sqrt(vx * vx + vy * vy + vz * vz);

  const dx = targetPos.x - shooterPos.x;
  const dy = (targetPos.y || 1.5) - (shooterPos.y || 1.5);
  const dz = targetPos.z - shooterPos.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const speed = Math.max(10.0, Number(projectileSpeed) || 35.0);
  const timeToImpact = distance / speed;

  // Calcul du point prédictif futur
  const predictedPoint = {
    x: targetPos.x + vx * timeToImpact,
    y: (targetPos.y || 1.5) + vy * timeToImpact,
    z: targetPos.z + vz * timeToImpact,
    timeToImpact,
    isTargetMoving: vSpeed > 0.5,
  };

  if (predictedPoint.isTargetMoving && audio && typeof audio.playPredictionLockChirp === 'function') {
    audio.playPredictionLockChirp();
  }

  return predictedPoint;
}
