// Système de Vision Magnétique Spectrale et Noyaux d'Énergie (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar basculant son masque bio-optique sur le spectre électromagnétique violet pour localiser les conduits d'énergie enfouis sous la station baleinière et les moteurs de translation de la pyramide.

import { audioSynth } from '../AudioSynthesizer.js';

export const SCAR_EM_VISION_CONSTANTS = {
  SCAN_RADIUS_M: 35.0,               // Portée de détection à travers la roche et la glace
  WEAKPOINT_DAMAGE_MULTIPLIER: 1.65, // +65% de dégâts sur les générateurs/conduits révélés
  ENERGY_SIPHON_AMOUNT: 40,          // Énergie plasma récupérée par drainage d'un noyau
};

export function createElectromagneticVisionState() {
  return {
    isEmVisionActive: false,
    detectedPowerNodes: [],
    siphonedEnergyTotal: 0,
  };
}

export function activateElectromagneticSpectrum(state, audio = audioSynth) {
  if (!state) return false;
  state.isEmVisionActive = true;

  if (audio && typeof audio.playScarEmVisionSpectrumShift === 'function') {
    audio.playScarEmVisionSpectrumShift();
  }

  return true;
}

export function scanBuriedPowerConduits(state, userPos = { x: 0, z: 0 }, powerNodes = [], audio = audioSynth) {
  if (!state || !state.isEmVisionActive || !Array.isArray(powerNodes)) {
    return { scannedCount: 0, nodes: [] };
  }

  const revealed = [];
  for (const node of powerNodes) {
    if (!node) continue;
    const dx = (node.x || 0) - (userPos.x || 0);
    const dz = (node.z || 0) - (userPos.z || 0);
    const dist = Math.hypot(dx, dz);

    if (dist <= SCAR_EM_VISION_CONSTANTS.SCAN_RADIUS_M) {
      node.isEmHighlighted = true;
      node.vulnerabilityMultiplier = SCAR_EM_VISION_CONSTANTS.WEAKPOINT_DAMAGE_MULTIPLIER;
      revealed.push(node);
    }
  }

  state.detectedPowerNodes = revealed;

  if (revealed.length > 0 && audio && typeof audio.playPowerConduitResonanceHum === 'function') {
    audio.playPowerConduitResonanceHum();
  }

  return {
    scannedCount: revealed.length,
    nodes: revealed,
  };
}

export function siphonPowerCoreNode(state, node, hunter = null) {
  if (!state || !node || !node.isEmHighlighted || node.isDepleted) {
    return { siphoned: false, energyRestored: 0 };
  }

  node.isDepleted = true;
  const restored = SCAR_EM_VISION_CONSTANTS.ENERGY_SIPHON_AMOUNT;
  state.siphonedEnergyTotal += restored;

  if (hunter && typeof hunter.energy === 'number') {
    const maxEnergy = hunter.maxEnergy || 100;
    hunter.energy = Math.min(maxEnergy, hunter.energy + restored);
  }

  return {
    siphoned: true,
    energyRestored: restored,
  };
}
