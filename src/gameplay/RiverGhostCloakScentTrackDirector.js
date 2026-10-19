// Directeur de Traque du Fantôme de la Rivière & Dissimulation Olfactive (Predators — Lore 1:1)
// Référence canonique : Predators (2010) — La créature alien "River Ghost" traquée dans la réserve de chasse, dont la sécrétion de musc déroute les molosses

import { audioSynth } from '../AudioSynthesizer.js';

export const RIVER_GHOST_CONSTANTS = {
  MAX_HEALTH: 110.0,
  SPRINT_SPEED: 8.5,                   // Vélocité lors de la fuite désordonnée (m/s)
  FLEE_TRIGGER_DISTANCE: 15.0,         // Rayon de détection déclenchant la fuite
  CLOAK_OPACITY: 0.22,                 // 22% d'opacité (camouflé à 78%)
  MUSK_CONCEAL_DURATION: 30.0,         // Durée d'immunité olfactive contre les Molosses (s)
  DIRECTION_CHANGE_INTERVAL: 1.1,      // Intervalle entre les sauts erratiques de direction (s)
};

export function createRiverGhostState(origin = { x: 0, y: 0, z: -20 }) {
  return {
    ghost: {
      id: 'river_ghost_specimen',
      x: origin.x || 0,
      y: origin.y || 0,
      z: origin.z || -20,
      health: RIVER_GHOST_CONSTANTS.MAX_HEALTH,
      isCloaked: true,
      cloakFlickerTimer: 0,
      isDead: false,
      muskHarvested: false,
      vx: 0,
      vz: 0,
      changeDirTimer: 0,
    },
    scentMask: {
      isActive: false,
      remainingTimer: 0,
    },
  };
}

export function damageRiverGhost(state, damageAmount, audio = audioSynth) {
  if (!state || !state.ghost || state.ghost.isDead) return { isDead: false, health: 0 };
  const g = state.ghost;

  g.health = Math.max(0, g.health - damageAmount);
  // Le choc déstabilise le camouflage optique
  g.isCloaked = false;
  g.cloakFlickerTimer = 2.0;

  if (g.health <= 0) {
    g.isDead = true;
    g.vx = 0;
    g.vz = 0;
  }

  return { isDead: g.isDead, health: g.health };
}

export function harvestMuskGland(state, audio = audioSynth) {
  if (!state || !state.ghost || !state.ghost.isDead || state.ghost.muskHarvested) {
    return { success: false };
  }

  state.ghost.muskHarvested = true;
  state.scentMask.isActive = true;
  state.scentMask.remainingTimer = RIVER_GHOST_CONSTANTS.MUSK_CONCEAL_DURATION;

  if (audio && typeof audio.playRiverGhostMuskHiss === 'function') {
    audio.playRiverGhostMuskHiss();
  }

  return {
    success: true,
    duration: RIVER_GHOST_CONSTANTS.MUSK_CONCEAL_DURATION,
  };
}

export function updateRiverGhostDirector(state, delta, pursuers = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Mise à jour du masque olfactif
  if (state.scentMask.isActive) {
    state.scentMask.remainingTimer -= dt;
    if (state.scentMask.remainingTimer <= 0) {
      state.scentMask.isActive = false;
      state.scentMask.remainingTimer = 0;
    }
  }

  // Application de la perte de piste olfactive aux molosses
  for (const pursuer of pursuers) {
    if (!pursuer || pursuer.isDead) continue;
    if (pursuer.species === 'hell_hound' || pursuer.role === 'tracker_hound') {
      pursuer.scentLost = state.scentMask.isActive;
    }
  }

  const g = state.ghost;
  if (!g || g.isDead) return;

  // Rétablissement du camouflage optique après vacillement
  if (g.cloakFlickerTimer > 0) {
    g.cloakFlickerTimer -= dt;
    if (g.cloakFlickerTimer <= 0) {
      g.isCloaked = true;
    }
  }

  // Comportement de fuite erratique si des poursuivants sont proches
  let closestDist = Infinity;
  let fleeDirX = 0;
  let fleeDirZ = 0;

  for (const p of pursuers) {
    if (!p || p.isDead) continue;
    const px = p.x ?? (p.position ? p.position.x : 0);
    const pz = p.z ?? (p.position ? p.position.z : 0);
    const dx = g.x - px;
    const dz = g.z - pz;
    const d = Math.sqrt(dx * dx + dz * dz);

    if (d < closestDist) {
      closestDist = d;
      fleeDirX = dx;
      fleeDirZ = dz;
    }
  }

  if (closestDist <= RIVER_GHOST_CONSTANTS.FLEE_TRIGGER_DISTANCE) {
    g.changeDirTimer -= dt;
    if (g.changeDirTimer <= 0) {
      g.changeDirTimer = RIVER_GHOST_CONSTANTS.DIRECTION_CHANGE_INTERVAL;
      // Ajout d'une composante aléatoire erratique à la direction de fuite
      const jitterAngle = (Math.random() - 0.5) * 1.4;
      const baseAngle = Math.atan2(fleeDirZ, fleeDirX) + jitterAngle;

      g.vx = Math.cos(baseAngle) * RIVER_GHOST_CONSTANTS.SPRINT_SPEED;
      g.vz = Math.sin(baseAngle) * RIVER_GHOST_CONSTANTS.SPRINT_SPEED;
    }

    g.x += g.vx * dt;
    g.z += g.vz * dt;
  } else {
    // Ralentissement hors alerte
    g.vx *= Math.pow(0.5, dt * 10);
    g.vz *= Math.pow(0.5, dt * 10);
  }
}
