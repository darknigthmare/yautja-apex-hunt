// Pont Suspendu de Cordes au-dessus du Gouffre Volcanique (Predators 2010 / AVP — Lore 1:1)
// Référence canonique : Predators (2010) & AVP — Les passerelles suspendues au-dessus de failles magmatiques dont le sectionnement des câbles porteurs précipite les poursuivants dans la lave.

import { audioSynth } from '../AudioSynthesizer.js';

export const VOLCANIC_BRIDGE_CONSTANTS = {
  BRIDGE_LENGTH_M: 18.0,             // Longueur de la travée suspendue
  LAVA_INCINERATION_DAMAGE: 999,     // Dégâts létaux de chute dans le gouffre volcanique
  REQUIRED_CABLES_TO_COLLAPSE: 2,    // Nombre de câbles porteurs à trancher
};

export function createVolcanicBridgeSectorState() {
  return {
    cablesIntact: VOLCANIC_BRIDGE_CONSTANTS.REQUIRED_CABLES_TO_COLLAPSE,
    isBridgeCollapsed: false,
    plungedEnemiesCount: 0,
  };
}

export function severBridgeSupportCable(state, enemiesOnBridge = [], audio = audioSynth) {
  if (!state || state.isBridgeCollapsed) {
    return { collapsed: false, plungedCount: 0 };
  }

  state.cablesIntact = Math.max(0, state.cablesIntact - 1);

  if (audio && typeof audio.playRopeBridgeCableSnapTwang === 'function') {
    audio.playRopeBridgeCableSnapTwang();
  }

  if (state.cablesIntact > 0) {
    return { collapsed: false, plungedCount: 0 };
  }

  state.isBridgeCollapsed = true;

  if (audio && typeof audio.playVolcanicLavaPlungeRoar === 'function') {
    audio.playVolcanicLavaPlungeRoar();
  }

  let plungedCount = 0;
  if (Array.isArray(enemiesOnBridge)) {
    for (const enemy of enemiesOnBridge) {
      if (!enemy) continue;
      enemy.isPlungedIntoLava = true;
      plungedCount++;
      state.plungedEnemiesCount++;

      if (typeof enemy.takeDamage === 'function') {
        enemy.takeDamage(VOLCANIC_BRIDGE_CONSTANTS.LAVA_INCINERATION_DAMAGE);
      } else if (typeof enemy.health === 'number') {
        enemy.health = 0;
      }
    }
  }

  return {
    collapsed: true,
    plungedCount,
  };
}
