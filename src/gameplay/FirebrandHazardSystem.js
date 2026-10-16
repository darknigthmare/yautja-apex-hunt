// Système de tisons ardents, torches et barrières thermiques de feu (Lore 1:1)
// Références canoniques : Predator (1987) - Feux de camp de Dutch ; Prey (2022) - Torches et forêts en flammes

import { audioSynth } from '../AudioSynthesizer.js';

export const FIRE_CONSTANTS = {
  TORCH_DAMAGE: 45.0,
  IGNITE_DPS: 18.0,
  IGNITE_DURATION: 4.0,
  THERMAL_BARRIER_TEMP: 620.0,
};

export function createFirebrandState() {
  return {
    torches: [],
  };
}

export function igniteTorch(state, position, options = {}, audio = audioSynth) {
  if (!state || !position) return null;
  const torch = {
    id: `torch_${state.torches.length + 1}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 1.0,
    z: Number(position.z) || 0,
    remainingLifetime: Number(options.lifetime) || 35.0,
    temperatureCelsius: FIRE_CONSTANTS.THERMAL_BARRIER_TEMP,
    radius: 3.5,
  };
  state.torches.push(torch);

  if (audio && typeof audio.playFirebrandIgnite === 'function') {
    audio.playFirebrandIgnite();
  }
  return torch;
}

export function strikeWithFirebrand(torch, targetEntity, audio = audioSynth) {
  if (!torch || !targetEntity) return false;

  if (typeof targetEntity.applyDamage === 'function') {
    targetEntity.applyDamage(FIRE_CONSTANTS.TORCH_DAMAGE, 'firebrand_strike');
  } else if (typeof targetEntity.health === 'number') {
    targetEntity.health = Math.max(0, targetEntity.health - FIRE_CONSTANTS.TORCH_DAMAGE);
  }

  targetEntity.isOnFire = true;
  targetEntity.burnTimer = FIRE_CONSTANTS.IGNITE_DURATION;

  if (audio && typeof audio.playEmberWhoosh === 'function') {
    audio.playEmberWhoosh();
  }
  return true;
}

export function updateFirebrandHazards(state, delta, entities = []) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.torches = state.torches.filter(torch => {
    torch.remainingLifetime -= dt;
    return torch.remainingLifetime > 0;
  });

  // Gestion des brûlures en cours sur les entités
  for (const entity of entities) {
    if (entity.isOnFire && entity.burnTimer > 0) {
      const burnDmg = FIRE_CONSTANTS.IGNITE_DPS * dt;
      if (typeof entity.applyDamage === 'function') {
        entity.applyDamage(burnDmg, 'burn_dot');
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - burnDmg);
      }
      entity.burnTimer -= dt;
      if (entity.burnTimer <= 0) {
        entity.isOnFire = false;
      }
    }
  }
}
