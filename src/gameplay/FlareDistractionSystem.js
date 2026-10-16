// Système de leurres thermiques et fusées éclairantes au phosphore (Lore 1:1)
// Références canoniques : Predator 2 (1990) - Fusées de détresse de Harrigan ; Predators (2010) - Éblouissement infrarouge

import { audioSynth } from '../AudioSynthesizer.js';

export const FLARE_CONSTANTS = {
  DEFAULT_BURN_DURATION: 15.0,  // Durée de combustion (secondes)
  BLINDING_RADIUS: 6.5,         // Rayon d'éblouissement du capteur infrarouge
  FLARE_CORE_TEMP_CELSIUS: 1400,// Température du cœur au phosphore
  THERMAL_BLOOM_SATURATION: 1.0,// Saturation totale du spectre thermique
};

export function createFlareSystemState() {
  return {
    flares: [],
    activeThermalBloom: 0,
    forcedVisionSwitchNeeded: false,
  };
}

export function igniteFlare(system, position, options = {}, audio = audioSynth) {
  if (!system || !position) return null;

  const flare = {
    id: `flare_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    duration: Number(options.duration) || FLARE_CONSTANTS.DEFAULT_BURN_DURATION,
    remainingBurnTime: Number(options.duration) || FLARE_CONSTANTS.DEFAULT_BURN_DURATION,
    temperatureCelsius: Number(options.temperature) || FLARE_CONSTANTS.FLARE_CORE_TEMP_CELSIUS,
    blindingRadius: Number(options.radius) || FLARE_CONSTANTS.BLINDING_RADIUS,
    isExtinguished: false,
  };

  system.flares.push(flare);

  if (audio && typeof audio.playFlareIgnition === 'function') {
    audio.playFlareIgnition();
  }
  return flare;
}

export function updateFlareSystem(system, delta, playerBiomask, audio = audioSynth) {
  if (!system) return;
  const dt = Math.max(0, Number(delta) || 0);

  let maxBloom = 0;

  system.flares = system.flares.filter(flare => {
    flare.remainingBurnTime -= dt;

    if (flare.remainingBurnTime > 0) {
      if (playerBiomask && playerBiomask.position) {
        const dx = playerBiomask.position.x - flare.x;
        const dy = (playerBiomask.position.y || 0) - flare.y;
        const dz = playerBiomask.position.z - flare.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist <= flare.blindingRadius) {
          // L'éblouissement n'affecte QUE le spectre infrarouge (Lore 1:1)
          const isThermalVisionActive = !playerBiomask.currentMode || playerBiomask.currentMode === 'thermal';
          if (isThermalVisionActive) {
            const bloomFactor = (1.0 - dist / flare.blindingRadius) * FLARE_CONSTANTS.THERMAL_BLOOM_SATURATION;
            maxBloom = Math.max(maxBloom, bloomFactor);
          }
        }
      }
      return true;
    }

    flare.isExtinguished = true;
    return false;
  });

  system.activeThermalBloom = maxBloom;
  system.forcedVisionSwitchNeeded = maxBloom > 0.65;
}

export function isTargetObscuredByFlare(system, targetPos) {
  if (!system || !targetPos) return false;
  return system.flares.some(f => {
    const dx = f.x - targetPos.x;
    const dy = f.y - (targetPos.y || 0);
    const dz = f.z - targetPos.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) <= f.blindingRadius;
  });
}
