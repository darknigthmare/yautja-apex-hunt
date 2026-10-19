// Directeur Cinétique & Ricochets du Disque Intelligent Smart Disc (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Disque de lancer circulaire gyroscopique tranchant de multiples cibles avant retour au gantelet

import { audioSynth } from '../AudioSynthesizer.js';

export const SMART_DISC_CONSTANTS = {
  SPEED: 26.0,                         // Vélocité de vol balistique (m/s)
  DAMAGE: 115.0,                       // Dégâts tranchants par passage
  MAX_RICOCHETS: 3,                    // Nombre maximal de ricochets assistés
  RETURN_SNAP_DISTANCE: 1.5,           // Distance de rattrapage automatique au gantelet (m)
  SUBSTEP_SLICE: 0.45,                 // Pas de découpage anti-tunneling (m)
};

export function createSmartDiscState() {
  return {
    isAirborne: false,
    x: 0,
    y: 1.2,
    z: 0,
    vx: 0,
    vz: 0,
    remainingRicochets: SMART_DISC_CONSTANTS.MAX_RICOCHETS,
    hitTargetIds: [],
    isReturning: false,
    throwerPos: { x: 0, z: 0 },
    totalHits: 0,
  };
}

export function throwSmartDisc(state, throwerPos, initialTargetPos, audio = audioSynth) {
  if (!state || state.isAirborne) return false;

  const sx = throwerPos?.x || 0;
  const sz = throwerPos?.z || 0;
  const tx = initialTargetPos?.x || 0;
  const tz = initialTargetPos?.z || 0;

  const dx = tx - sx;
  const dz = tz - sz;
  const dist = Math.sqrt(dx * dx + dz * dz) || 1.0;

  state.isAirborne = true;
  state.isReturning = false;
  state.x = sx;
  state.z = sz;
  state.throwerPos = { x: sx, z: sz };
  state.vx = (dx / dist) * SMART_DISC_CONSTANTS.SPEED;
  state.vz = (dz / dist) * SMART_DISC_CONSTANTS.SPEED;
  state.remainingRicochets = SMART_DISC_CONSTANTS.MAX_RICOCHETS;
  state.hitTargetIds = [];

  if (audio && typeof audio.playSmartDiscFlightWhir === 'function') {
    audio.playSmartDiscFlightWhir();
  }
  return true;
}

export function updateSmartDisc(state, delta, targets = [], audio = audioSynth) {
  if (!state || !state.isAirborne) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Distance totale parcourue durant ce tick
  const moveDist = SMART_DISC_CONSTANTS.SPEED * dt;
  const steps = Math.max(1, Math.ceil(moveDist / SMART_DISC_CONSTANTS.SUBSTEP_SLICE));
  const subDt = dt / steps;

  for (let s = 0; s < steps; s++) {
    if (!state.isAirborne) break;

    // Déplacement pas-à-pas (anti-tunneling)
    state.x += state.vx * subDt;
    state.z += state.vz * subDt;

    // En phase de retour, vérification de la capture au gantelet
    if (state.isReturning) {
      const dxToOwner = state.throwerPos.x - state.x;
      const dzToOwner = state.throwerPos.z - state.z;
      const distToOwner = Math.sqrt(dxToOwner * dxToOwner + dzToOwner * dzToOwner);

      if (distToOwner <= SMART_DISC_CONSTANTS.RETURN_SNAP_DISTANCE) {
        state.isAirborne = false;
        state.isReturning = false;
        if (audio && typeof audio.playSmartDiscCatchClack === 'function') {
          audio.playSmartDiscCatchClack();
        }
        break;
      }

      // Réajustement du vecteur retour
      if (distToOwner > 0.01) {
        state.vx = (dxToOwner / distToOwner) * SMART_DISC_CONSTANTS.SPEED;
        state.vz = (dzToOwner / distToOwner) * SMART_DISC_CONSTANTS.SPEED;
      }
      continue;
    }

    // Détection de collision tranchante avec les cibles
    for (const target of targets) {
      if (!target || target.isDead || state.hitTargetIds.includes(target.id)) continue;
      const tx = target.x ?? (target.position ? target.position.x : 0);
      const tz = target.z ?? (target.position ? target.position.z : 0);
      const dx = tx - state.x;
      const dz = tz - state.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= 1.2) {
        // Impact et lacération
        state.hitTargetIds.push(target.id);
        state.totalHits++;

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(SMART_DISC_CONSTANTS.DAMAGE, 'smart_disc');
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - SMART_DISC_CONSTANTS.DAMAGE);
        }
        target.isSevered = true;

        if (audio && typeof audio.playSmartDiscRicochetSlice === 'function') {
          audio.playSmartDiscRicochetSlice();
        }

        // Recherche de la prochaine cible pour ricochet
        state.remainingRicochets--;
        let nextTarget = null;
        let bestDist = Infinity;

        for (const candidate of targets) {
          if (!candidate || candidate.isDead || state.hitTargetIds.includes(candidate.id)) continue;
          const cx = candidate.x ?? (candidate.position ? candidate.position.x : 0);
          const cz = candidate.z ?? (candidate.position ? candidate.position.z : 0);
          const cdist = Math.sqrt((cx - state.x) ** 2 + (cz - state.z) ** 2);
          if (cdist < bestDist && cdist <= 18.0) {
            bestDist = cdist;
            nextTarget = candidate;
          }
        }

        if (nextTarget && state.remainingRicochets > 0) {
          const ntx = nextTarget.x ?? (nextTarget.position ? nextTarget.position.x : 0);
          const ntz = nextTarget.z ?? (nextTarget.position ? nextTarget.position.z : 0);
          const ndx = ntx - state.x;
          const ndz = ntz - state.z;
          const ndist = Math.sqrt(ndx * ndx + ndz * ndz) || 1.0;
          state.vx = (ndx / ndist) * SMART_DISC_CONSTANTS.SPEED;
          state.vz = (ndz / ndist) * SMART_DISC_CONSTANTS.SPEED;
        } else {
          // Début de la phase de retour gyroscopique
          state.isReturning = true;
          const rdx = state.throwerPos.x - state.x;
          const rdz = state.throwerPos.z - state.z;
          const rdist = Math.sqrt(rdx * rdx + rdz * rdz) || 1.0;
          state.vx = (rdx / rdist) * SMART_DISC_CONSTANTS.SPEED;
          state.vz = (rdz / rdist) * SMART_DISC_CONSTANTS.SPEED;
        }
        break;
      }
    }
  }
}
