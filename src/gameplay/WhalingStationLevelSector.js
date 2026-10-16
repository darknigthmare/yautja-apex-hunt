// Secteur de niveau Station Baleinière 1904 de l'Île Bouvet (Lore 1:1)
// Référence canonique : Alien vs Predator (2004) - Ruines de la station baleinière en surface, blizzard à -30°C et cuves d'huile

import { audioSynth } from '../AudioSynthesizer.js';

export const WHALING_CONSTANTS = {
  SUBZERO_TEMP_CELSIUS: -28.0,
  THERMAL_MESH_DRAIN_PER_SEC: 1.2,
  BLIZZARD_VISIBILITY_METERS: 12.0,
};

export function createWhalingStationSector() {
  return {
    ambientTemperature: WHALING_CONSTANTS.SUBZERO_TEMP_CELSIUS,
    blizzardActive: true,
    visibilityRange: WHALING_CONSTANTS.BLIZZARD_VISIBILITY_METERS,
    oilCauldrons: [
      { id: 'cauldron_1', x: -10, y: 0, z: 12, hasResidualOil: true, health: 150 },
      { id: 'cauldron_2', x: 8, y: 0, z: -5, hasResidualOil: false, health: 200 },
    ],
    iceShaftDescentUnlocked: false,
    thermalMeshActive: true,
  };
}

export function toggleThermalMeshHeater(sector, hunter) {
  if (!sector) return false;
  sector.thermalMeshActive = !sector.thermalMeshActive;
  if (hunter) {
    hunter.isThermalMeshHeating = sector.thermalMeshActive;
  }
  return sector.thermalMeshActive;
}

export function interactOilCauldron(sector, cauldronId, audio = audioSynth) {
  if (!sector) return false;
  const cauldron = sector.oilCauldrons.find(c => c.id === cauldronId);
  if (!cauldron) return false;

  if (audio && typeof audio.playOilCauldronClang === 'function') {
    audio.playOilCauldronClang();
  }

  if (cauldron.hasResidualOil) {
    cauldron.hasResidualOil = false;
    return { detonated: true, damage: 120.0, blastRadius: 4.5 };
  }

  return { detonated: false, damage: 0 };
}

export function updateWhalingStationSector(sector, delta, hunter, audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance de blizzard
  if (sector.blizzardActive && audio && Math.random() < 0.05 && typeof audio.playBlizzardHowl === 'function') {
    audio.playBlizzardHowl();
  }

  // Gestion du froid extrême sur le chasseur
  if (hunter) {
    if (sector.thermalMeshActive) {
      // Consommation lente d'énergie de combinaison
      if (hunter.energy !== undefined) {
        hunter.energy = Math.max(0, hunter.energy - WHALING_CONSTANTS.THERMAL_MESH_DRAIN_PER_SEC * dt);
        if (hunter.energy <= 0) {
          sector.thermalMeshActive = false;
        }
      }
    } else {
      // Sans chauffage de maillage thermique, l'endurance régénère 2x moins vite
      if (hunter.staminaRecoveryMultiplier !== undefined) {
        hunter.staminaRecoveryMultiplier = 0.5;
      }
    }
  }
}
