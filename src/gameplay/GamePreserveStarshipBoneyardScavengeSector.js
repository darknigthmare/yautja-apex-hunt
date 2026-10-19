// Cimetière d'Épaves de Vaisseaux de la Réserve de Chasse (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Les épaves d'astronefs et de sondes anciennes disséminées sur la planète-réserve (comme la foreuse habitée par Noland) contenant des cellules d'énergie plasma et des pièces d'équipement.

import { audioSynth } from '../AudioSynthesizer.js';

export const BONEYARD_SCAVENGE_CONSTANTS = {
  ENERGY_CELL_RESTORE: 75,           // Énergie plasma restaurée par cellule récupérée
  AMMO_SALVAGE_COUNT: 3,             // Munitions/charges secondaires récupérées dans la soute
  PERCH_ELEVATION_M: 9.0,            // Hauteur de surplomb tactique sur la coque de l'épave
};

export function createStarshipBoneyardSectorState() {
  return {
    wrecks: [],
    totalSalvagedWrecks: 0,
  };
}

export function registerCrashedStarshipWreck(state, wreckId, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.wrecks.push({
    id: wreckId || `wreck_${state.wrecks.length + 1}`,
    x: position.x || 0,
    z: position.z || 0,
    isSalvaged: false,
    elevationM: BONEYARD_SCAVENGE_CONSTANTS.PERCH_ELEVATION_M,
  });
  return true;
}

export function salvageStarshipCargoBay(state, wreckIndex = 0, hunter = null, audio = audioSynth) {
  if (!state || !state.wrecks[wreckIndex] || state.wrecks[wreckIndex].isSalvaged) {
    return { salvaged: false };
  }

  const wreck = state.wrecks[wreckIndex];
  wreck.isSalvaged = true;
  state.totalSalvagedWrecks++;

  if (audio) {
    if (typeof audio.playStarshipBoneyardSalvageClank === 'function') {
      audio.playStarshipBoneyardSalvageClank();
    }
    if (typeof audio.playAncientPowerCellRechargeHum === 'function') {
      audio.playAncientPowerCellRechargeHum();
    }
  }

  if (hunter) {
    if (typeof hunter.energy === 'number') {
      hunter.energy = Math.min(hunter.maxEnergy || 100, hunter.energy + BONEYARD_SCAVENGE_CONSTANTS.ENERGY_CELL_RESTORE);
    }
    hunter.salvagedGadgetCharges = (hunter.salvagedGadgetCharges || 0) + BONEYARD_SCAVENGE_CONSTANTS.AMMO_SALVAGE_COUNT;
  }

  return {
    salvaged: true,
    energyRestored: BONEYARD_SCAVENGE_CONSTANTS.ENERGY_CELL_RESTORE,
    ammoGranted: BONEYARD_SCAVENGE_CONSTANTS.AMMO_SALVAGE_COUNT,
  };
}
