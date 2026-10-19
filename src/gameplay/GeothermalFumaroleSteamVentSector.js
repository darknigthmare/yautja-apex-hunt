// Secteur de Fumerolles Géothermiques et Brouillage de Visière Thermique (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Les crevasses volcaniques de la planète réserve crachant des geysers de vapeur chaude sulfureuse perturbant le camouflage et créant des artéfacts thermiques.

import { audioSynth } from '../AudioSynthesizer.js';

export const FUMAROLE_CONSTANTS = {
  VENT_RADIUS_METERS: 5.0,            // Rayon de diffusion de la vapeur chaude
  STEAM_BURST_DURATION_SEC: 6.0,      // Durée d'émission active du panache
  THERMAL_DISTORTION_LEVEL: 0.75,     // Intensité de brouillage des capteurs optiques
};

export function createFumaroleSectorState(vents = [{ x: 0, z: 0 }]) {
  return {
    fumaroles: vents.map((v, i) => ({
      id: `fumarole_${i}`,
      x: v.x || 0,
      z: v.z || 0,
      isActive: false,
      remainingSteamTime: 0.0,
    })),
    totalEruptionsCount: 0,
  };
}

export function eruptFumarole(state, index = 0, audio = audioSynth) {
  if (!state || !state.fumaroles[index]) return false;

  const vent = state.fumaroles[index];
  vent.isActive = true;
  vent.remainingSteamTime = FUMAROLE_CONSTANTS.STEAM_BURST_DURATION_SEC;
  state.totalEruptionsCount++;

  if (audio && typeof audio.playGeothermalSteamHissRoar === 'function') {
    audio.playGeothermalSteamHissRoar();
  }

  return true;
}

export function evaluateFumaroleAtmosphere(state, hunter, audio = audioSynth) {
  if (!state || !hunter) return { inSteam: false };

  for (const vent of state.fumaroles) {
    if (!vent.isActive) continue;

    const dx = (hunter.x || 0) - vent.x;
    const dz = (hunter.z || 0) - vent.z;
    if (Math.hypot(dx, dz) <= FUMAROLE_CONSTANTS.VENT_RADIUS_METERS) {
      // Le chasseur est immergé dans le panache de vapeur sulfureuse
      if (hunter.isCloaked) {
        hunter.isCloaked = false;
        hunter.cloakShortCircuited = true;
      }
      hunter.isThermalGlitched = true;

      if (audio && typeof audio.playThermalOpticsFumaroleGlitch === 'function') {
        audio.playThermalOpticsFumaroleGlitch();
      }

      return {
        inSteam: true,
        fumaroleId: vent.id,
        cloakDisrupted: true,
        distortion: FUMAROLE_CONSTANTS.THERMAL_DISTORTION_LEVEL,
      };
    }
  }

  return { inSteam: false };
}

export function updateFumaroleSector(state, delta = 0.1) {
  if (!state) return;

  for (const vent of state.fumaroles) {
    if (vent.isActive && vent.remainingSteamTime > 0) {
      vent.remainingSteamTime = Math.max(0, vent.remainingSteamTime - delta);
      if (vent.remainingSteamTime === 0) {
        vent.isActive = false;
      }
    }
  }
}
