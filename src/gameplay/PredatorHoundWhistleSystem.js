// Système de Sifflet Ultrasonique de Commandement de Meute (Lore 1:1)
// Référence canonique : The Predator (2018) & Predators (2010) - Ordres tactiques émis aux molosses Yautja

import { audioSynth } from '../AudioSynthesizer.js';

export const HOUND_COMMANDS = {
  RALLY: 'RALLY',   // Retour en sprint aux côtés du maître, garde rapprochée
  FLANK: 'FLANK',   // Séparation de la meute en pince latérale pour encercler la cible
  FLUSH: 'FLUSH',   // Charge brutale dans les fourrés pour débusquer les proies embusquées
};

export const WHISTLE_CONSTANTS = {
  MAX_COMMAND_RANGE: 50.0,
  COMMAND_COOLDOWN: 2.0,
  FLANK_SPREAD_ANGLE: 0.95, // ~55 degrés de part et d'autre
};

export function createHoundWhistleState() {
  return {
    currentOrder: HOUND_COMMANDS.RALLY,
    commandCooldown: 0,
    commandCount: 0,
    managedHounds: [],
  };
}

export function registerHoundToPack(state, houndEntity) {
  if (!state || !houndEntity) return;
  if (!state.managedHounds.includes(houndEntity)) {
    state.managedHounds.push(houndEntity);
    houndEntity.packRole = 'pack_hound';
  }
}

export function issueHoundOrder(state, orderType, targetPosition, hunterPosition, audio = audioSynth) {
  if (!state || state.commandCooldown > 0) return false;

  state.currentOrder = orderType;
  state.commandCooldown = WHISTLE_CONSTANTS.COMMAND_COOLDOWN;
  state.commandCount += 1;

  if (audio && typeof audio.playHoundWhistleHighPitch === 'function') {
    audio.playHoundWhistleHighPitch();
  }

  // Distribution des directives tactiques aux molosses
  state.managedHounds.forEach((hound, idx) => {
    if (!hound || hound.isDead) return;

    if (orderType === HOUND_COMMANDS.RALLY) {
      hound.targetVector = {
        x: hunterPosition.x + (idx === 0 ? -1.8 : 1.8),
        y: hunterPosition.y,
        z: hunterPosition.z + 1.2,
      };
      hound.behaviorMode = 'guard';
      hound.speedMultiplier = 1.35;
    } else if (orderType === HOUND_COMMANDS.FLANK && targetPosition) {
      const side = idx % 2 === 0 ? -1 : 1;
      const dx = targetPosition.x - hunterPosition.x;
      const dz = targetPosition.z - hunterPosition.z;
      const angle = Math.atan2(dz, dx) + side * WHISTLE_CONSTANTS.FLANK_SPREAD_ANGLE;
      const dist = 12.0;

      hound.targetVector = {
        x: targetPosition.x + Math.cos(angle) * dist,
        y: targetPosition.y,
        z: targetPosition.z + Math.sin(angle) * dist,
      };
      hound.behaviorMode = 'pincer_flank';
      hound.speedMultiplier = 1.5;

      if (audio && typeof audio.playHoundFlankBark === 'function') {
        audio.playHoundFlankBark();
      }
    } else if (orderType === HOUND_COMMANDS.FLUSH && targetPosition) {
      hound.targetVector = { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z };
      hound.behaviorMode = 'flush_charge';
      hound.speedMultiplier = 1.65;
    }
  });

  return true;
}

export function updateHoundWhistleSystem(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.commandCooldown > 0) {
    state.commandCooldown = Math.max(0, state.commandCooldown - dt);
  }

  // Nettoyage des molosses défaits
  state.managedHounds = state.managedHounds.filter(h => h && !h.isDead);
}
