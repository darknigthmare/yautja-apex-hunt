// Physique de vol gyroscopique et guidage du Disque Intelligent (Lore 1:1)
// Référence canonique : Predator 2 (1990) (scène de l'abattoir et combat final)

import { audioSynth } from '../AudioSynthesizer.js';

export const SMART_DISC_STATES = Object.freeze({
  STOWED: 'stowed',
  OUTBOUND: 'outbound',
  APEX_TURN: 'apex_turn',
  RETURNING: 'returning',
  CAUGHT: 'caught',
});

export function createSmartDiscFlight(origin, launchDirection, options = {}) {
  const dir = {
    x: launchDirection?.x ?? 0,
    y: launchDirection?.y ?? 0,
    z: launchDirection?.z ?? 1,
  };
  const length = Math.hypot(dir.x, dir.y, dir.z) || 1;
  const normDir = { x: dir.x / length, y: dir.y / length, z: dir.z / length };

  // Calcul du vecteur orthogonal pour la trajectoire en arc courbe
  const perpX = -normDir.z;
  const perpZ = normDir.x;

  return {
    state: SMART_DISC_STATES.OUTBOUND,
    position: { x: origin?.x ?? 0, y: (origin?.y ?? 1.5) + 0.2, z: origin?.z ?? 0 },
    origin: { x: origin?.x ?? 0, y: origin?.y ?? 1.5, z: origin?.z ?? 0 },
    direction: normDir,
    perpVector: { x: perpX, z: perpZ },
    speed: Number(options.speed) || 52.0,
    maxRange: Number(options.maxRange) || 38.0,
    distanceTraveled: 0,
    damage: Number(options.damage) || 85,
    spinAngle: 0,
    spinSpeed: 45.0, // radians/sec
    curveEccentricity: Number(options.curveEccentricity) || 0.32,
    slicedTargets: new Set(),
    isCaught: false,
  };
}

export function updateSmartDiscFlight(disc, delta, hunterPos, candidateTargets = [], audio = audioSynth) {
  if (!disc || disc.state === SMART_DISC_STATES.STOWED || disc.state === SMART_DISC_STATES.CAUGHT) {
    return disc?.state;
  }

  const dt = Math.max(0, Number(delta) || 0);
  disc.spinAngle += disc.spinSpeed * dt;

  const prevX = disc.position.x;
  const prevZ = disc.position.z;

  if (disc.state === SMART_DISC_STATES.OUTBOUND) {
    const step = disc.speed * dt;
    disc.distanceTraveled += step;

    // Déplacement avec courbure gyroscopique progressive
    const lateralShift = Math.sin((disc.distanceTraveled / disc.maxRange) * Math.PI) * disc.curveEccentricity * 8.0;
    disc.position.x += disc.direction.x * step + disc.perpVector.x * lateralShift * dt;
    disc.position.z += disc.direction.z * step + disc.perpVector.z * lateralShift * dt;

    if (disc.distanceTraveled >= disc.maxRange) {
      disc.state = SMART_DISC_STATES.APEX_TURN;
    }
  } else if (disc.state === SMART_DISC_STATES.APEX_TURN) {
    disc.state = SMART_DISC_STATES.RETURNING;
    if (audio && typeof audio.playSmartDiscFlightHum === 'function') {
      audio.playSmartDiscFlightHum();
    }
  } else if (disc.state === SMART_DISC_STATES.RETURNING) {
    // Guidage vers la position courante du chasseur
    const targetY = (hunterPos?.y ?? 1.5) + 0.2;
    const dx = (hunterPos?.x ?? disc.origin.x) - disc.position.x;
    const dy = targetY - disc.position.y;
    const dz = (hunterPos?.z ?? disc.origin.z) - disc.position.z;
    const distToHunter = Math.hypot(dx, dy, dz);

    if (distToHunter <= 1.8) {
      return catchSmartDisc(disc, hunterPos, audio);
    }

    const normX = dx / distToHunter;
    const normY = dy / distToHunter;
    const normZ = dz / distToHunter;

    const returnSpeed = disc.speed * 1.15;
    disc.position.x += normX * returnSpeed * dt;
    disc.position.y += normY * returnSpeed * dt;
    disc.position.z += normZ * returnSpeed * dt;
  }

  // Détection des impacts le long du segment balayé (Continuous Collision Detection)
  if (Array.isArray(candidateTargets)) {
    const hitRadiusSq = 2.4 * 2.4;
    const segDx = disc.position.x - prevX;
    const segDz = disc.position.z - prevZ;
    const segLenSq = segDx * segDx + segDz * segDz;

    candidateTargets.forEach((target) => {
      if (!target || target.isDead || disc.slicedTargets.has(target)) return;
      const tPos = target.position ?? target.mesh?.position;
      if (!tPos) return;

      let distSq;
      if (segLenSq === 0) {
        distSq = (tPos.x - prevX) ** 2 + (tPos.z - prevZ) ** 2;
      } else {
        let t = ((tPos.x - prevX) * segDx + (tPos.z - prevZ) * segDz) / segLenSq;
        t = Math.max(0, Math.min(1, t));
        const projX = prevX + t * segDx;
        const projZ = prevZ + t * segDz;
        distSq = (tPos.x - projX) ** 2 + (tPos.z - projZ) ** 2;
      }

      if (distSq <= hitRadiusSq) {
        disc.slicedTargets.add(target);
        if (typeof target.takeDamage === 'function') {
          target.takeDamage(disc.damage);
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - disc.damage);
          if (target.health <= 0) target.isDead = true;
        }

        if (audio && typeof audio.playSmartDiscSlice === 'function') {
          audio.playSmartDiscSlice();
        }
      }
    });
  }

  return disc.state;
}

export function catchSmartDisc(disc, hunterPos, audio = audioSynth) {
  if (!disc) return SMART_DISC_STATES.CAUGHT;
  disc.state = SMART_DISC_STATES.CAUGHT;
  disc.isCaught = true;
  if (hunterPos) {
    disc.position.x = hunterPos.x;
    disc.position.y = (hunterPos.y ?? 1.5) + 0.2;
    disc.position.z = hunterPos.z;
  }

  if (audio && typeof audio.playSmartDiscCatch === 'function') {
    audio.playSmartDiscCatch();
  }
  return SMART_DISC_STATES.CAUGHT;
}
