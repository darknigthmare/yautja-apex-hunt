// Système de corne de chasse et guidage de meute de Chiens Prédateurs (Lore 1:1)
// Référence canonique : Predators (2010) - Le Tracker sonnant de la corne pour rabattre le gibier humain

import { audioSynth } from '../AudioSynthesizer.js';

export const HORN_COMMANDS = {
  FLUSH_COVER: 'FLUSH_COVER',       // Débusquer les proies tapies dans le couvert
  ENCIRCLE_PINCER: 'ENCIRCLE_PINCER', // Encerclement en tenaille
  RECALL_PACK: 'RECALL_PACK',       // Rappel au pied du maître
};

export function createHellHoundPackState() {
  return {
    activeCommand: HORN_COMMANDS.RECALL_PACK,
    hounds: [
      { id: 'hound_alpha', x: 0, z: 2, health: 120, damage: 35.0 },
      { id: 'hound_beta', x: -2, z: 1, health: 100, damage: 30.0 },
      { id: 'hound_gamma', x: 2, z: 1, health: 100, damage: 30.0 },
    ],
    hornCooldown: 0,
  };
}

export function blowHuntingHorn(packState, command = HORN_COMMANDS.FLUSH_COVER, audio = audioSynth) {
  if (!packState || packState.hornCooldown > 0) return false;
  packState.activeCommand = command;
  packState.hornCooldown = 3.0;

  if (audio && typeof audio.playTrackerHornCall === 'function') {
    audio.playTrackerHornCall();
  }
  return true;
}

export function updateHoundPack(packState, delta, preyEntities = [], audio = audioSynth) {
  if (!packState) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (packState.hornCooldown > 0) {
    packState.hornCooldown = Math.max(0, packState.hornCooldown - dt);
  }

  // Comportement de la meute selon l'ordre
  for (const hound of packState.hounds) {
    if (hound.health > 0) {
      if (packState.activeCommand === HORN_COMMANDS.FLUSH_COVER && preyEntities.length > 0) {
        const target = preyEntities[0];
        const dx = target.x - hound.x;
        const dz = target.z - hound.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= 2.0) {
          if (typeof target.applyDamage === 'function') {
            target.applyDamage(hound.damage * dt, 'hound_bite');
          } else if (typeof target.health === 'number') {
            target.health = Math.max(0, target.health - hound.damage * dt);
          }
          target.isFlushedFromCover = true;
          if (audio && Math.random() < 0.05 && typeof audio.playHoundSnarlBurst === 'function') {
            audio.playHoundSnarlBurst();
          }
        } else {
          hound.x += (dx / dist) * 12.0 * dt;
          hound.z += (dz / dist) * 12.0 * dt;
        }
      } else if (packState.activeCommand === HORN_COMMANDS.ENCIRCLE_PINCER && preyEntities.length > 0) {
        hound.isFlanking = true;
      }
    }
  }
}
