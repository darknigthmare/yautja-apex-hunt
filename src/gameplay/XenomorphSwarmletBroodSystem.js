// Système d'Essaim de Swarmlets Xénomorphes (Comics Marvel Alien — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2021-2023) — Les nuées de jeunes Xénomorphes véloces assaillant en meute de diversion

import { audioSynth } from '../AudioSynthesizer.js';

export const SWARMLET_CONSTANTS = {
  HEALTH: 24.0,                   // Faible santé individuelle mais surnombre
  RUN_SPEED: 9.2,                 // Vitesse de déplacement très élevée (m/s)
  LATCH_RANGE: 1.3,               // Distance de saut d'agrippement aux chevilles (m)
  BITE_DPS: 12.0,                 // Dégâts de morsure continue
  MAX_PACK_SIZE: 8,               // Nombre de swarmlets par vague d'éclosion
  MOVEMENT_PENALTY_PER_LATCH: 0.18, // -18% de vitesse de déplacement par swarmlet agrippé
};

export function createSwarmletBroodState() {
  return {
    swarmlets: [],
    totalSwarmletsSpawned: 0,
    totalLatchedCount: 0,
  };
}

export function spawnSwarmletPack(state, originPos, packSize = SWARMLET_CONSTANTS.MAX_PACK_SIZE, audio = audioSynth) {
  if (!state) return [];
  const spawned = [];

  for (let i = 0; i < packSize; i++) {
    const angle = (i / packSize) * Math.PI * 2;
    const offsetDist = 1.0 + Math.random() * 1.5;

    const swarmlet = {
      id: `swarmlet_${Date.now()}_${i}`,
      species: 'xenomorph_swarmlet',
      x: originPos.x + Math.cos(angle) * offsetDist,
      y: originPos.y || 0,
      z: originPos.z + Math.sin(angle) * offsetDist,
      health: SWARMLET_CONSTANTS.HEALTH,
      isLatched: false,
      targetEntity: null,
      isDead: false,
    };

    state.swarmlets.push(swarmlet);
    spawned.push(swarmlet);
  }

  state.totalSwarmletsSpawned += spawned.length;

  if (audio && typeof audio.playSwarmletScuttle === 'function') {
    audio.playSwarmletScuttle();
  }

  return spawned;
}

export function updateSwarmletBrood(state, delta, hunterTarget, audio = audioSynth) {
  if (!state || !hunterTarget || hunterTarget.isDead) return;
  const dt = Math.max(0, Number(delta) || 0);

  const hx = hunterTarget.x ?? (hunterTarget.position ? hunterTarget.position.x : 0);
  const hy = hunterTarget.y ?? (hunterTarget.position ? hunterTarget.position.y : 0);
  const hz = hunterTarget.z ?? (hunterTarget.position ? hunterTarget.position.z : 0);

  let currentlyLatched = 0;

  state.swarmlets = state.swarmlets.filter(s => {
    if (s.isDead || s.health <= 0) return false;

    if (s.isLatched) {
      currentlyLatched += 1;
      // Dégâts continus de morsure
      const biteDmg = SWARMLET_CONSTANTS.BITE_DPS * dt;
      if (typeof hunterTarget.takeDamage === 'function') {
        hunterTarget.takeDamage(biteDmg, 'swarmlet_bite');
      } else if (typeof hunterTarget.health === 'number') {
        hunterTarget.health = Math.max(0, hunterTarget.health - biteDmg);
      }
      return true;
    }

    // Déplacement vers le chasseur
    const dx = hx - s.x;
    const dz = hz - s.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= SWARMLET_CONSTANTS.LATCH_RANGE) {
      s.isLatched = true;
      s.targetEntity = hunterTarget;
      currentlyLatched += 1;

      if (audio && typeof audio.playSwarmletBiteChirp === 'function') {
        audio.playSwarmletBiteChirp();
      }
    } else {
      const step = Math.min(dist, SWARMLET_CONSTANTS.RUN_SPEED * dt);
      s.x += (dx / dist) * step;
      s.z += (dz / dist) * step;

      const newDx = hx - s.x;
      const newDz = hz - s.z;
      const newDist = Math.sqrt(newDx * newDx + newDz * newDz);
      if (newDist <= SWARMLET_CONSTANTS.LATCH_RANGE) {
        s.isLatched = true;
        s.targetEntity = hunterTarget;
        currentlyLatched += 1;

        if (audio && typeof audio.playSwarmletBiteChirp === 'function') {
          audio.playSwarmletBiteChirp();
        }
      }
    }

    return true;
  });

  state.totalLatchedCount = currentlyLatched;

  // Ralentissement cumulatif du joueur selon le nombre de petits agrippés
  if (currentlyLatched > 0) {
    const penalty = Math.min(0.7, currentlyLatched * SWARMLET_CONSTANTS.MOVEMENT_PENALTY_PER_LATCH);
    hunterTarget.moveSpeedModifier = Math.max(0.3, 1.0 - penalty);
  } else {
    hunterTarget.moveSpeedModifier = 1.0;
  }
}

export function shakeOffOrMeleeSwarmlets(state, damageAmount = 50.0) {
  if (!state) return 0;
  let killed = 0;

  for (const s of state.swarmlets) {
    if (s.isLatched) {
      s.health -= damageAmount;
      if (s.health <= 0) {
        s.isDead = true;
        s.isLatched = false;
        killed += 1;
      }
    }
  }

  return killed;
}
