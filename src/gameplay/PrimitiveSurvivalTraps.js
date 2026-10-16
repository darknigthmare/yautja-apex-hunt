// Pièges de survie primitifs de Dutch : Tronc contrepoids et fosse à pieux punji (Lore 1:1)
// Référence canonique : Predator (1987) - Pièges artisanaux de Dutch Schaefer dans la jungle

import { audioSynth } from '../AudioSynthesizer.js';

export const TRAP_CONSTANTS = {
  LOG_TRAP_DAMAGE: 220.0,       // Dégâts d'écrasement brut du tronc
  LOG_SWING_RADIUS: 3.5,
  PUNJI_PIT_DAMAGE: 65.0,       // Dégâts d'empalement des pieux
  PUNJI_SLOW_DURATION: 6.0,     // Durée du ralentissement consécutif
};

export function createSurvivalTrapState() {
  return {
    logTraps: [],
    punjiPits: [],
  };
}

export function armCounterweightLog(state, position, options = {}) {
  if (!state || !position) return null;
  const trap = {
    id: `log_trap_${state.logTraps.length + 1}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 6.0, // Suspendu à 6m
    z: Number(position.z) || 0,
    isTriggered: false,
    damage: Number(options.damage) || TRAP_CONSTANTS.LOG_TRAP_DAMAGE,
    swingRadius: Number(options.radius) || TRAP_CONSTANTS.LOG_SWING_RADIUS,
  };
  state.logTraps.push(trap);
  return trap;
}

export function triggerCounterweightLog(state, trapId, targetEntity, audio = audioSynth) {
  if (!state) return false;
  const trap = state.logTraps.find(t => t.id === trapId && !t.isTriggered);
  if (!trap) return false;

  trap.isTriggered = true;

  if (targetEntity) {
    if (typeof targetEntity.applyDamage === 'function') {
      targetEntity.applyDamage(trap.damage, 'crushing_log_swing');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - trap.damage);
    }
    targetEntity.isStaggered = true;
  }

  if (audio && typeof audio.playLogTrapSwing === 'function') {
    audio.playLogTrapSwing();
  }
  return true;
}

export function armPunjiPit(state, position, options = {}) {
  if (!state || !position) return null;
  const pit = {
    id: `punji_pit_${state.punjiPits.length + 1}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    radius: Number(options.radius) || 1.8,
    isTriggered: false,
    damage: Number(options.damage) || TRAP_CONSTANTS.PUNJI_PIT_DAMAGE,
  };
  state.punjiPits.push(pit);
  return pit;
}

export function checkPunjiTrigger(state, entity, audio = audioSynth) {
  if (!state || !entity) return false;
  for (const pit of state.punjiPits) {
    if (!pit.isTriggered) {
      const dx = entity.x - pit.x;
      const dz = entity.z - pit.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= pit.radius) {
        pit.isTriggered = true;
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(pit.damage, 'punji_spike_pierce');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - pit.damage);
        }
        entity.isCrippled = true;
        entity.crippleTimer = TRAP_CONSTANTS.PUNJI_SLOW_DURATION;

        if (audio && typeof audio.playPunjiImpale === 'function') {
          audio.playPunjiImpale();
        }
        return true;
      }
    }
  }
  return false;
}
