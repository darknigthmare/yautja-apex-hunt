// Secteur de Niveau : Conduits d'Égouts et Jets de Vapeur Brûlante (Lore 1:1)
// Référence canonique : AVP:R (2007) - Traque souterraine de Wolf dans les égouts de Gunnison

import { audioSynth } from '../AudioSynthesizer.js';

export const SEWER_STEAM_CONSTANTS = {
  PIPE_RADIUS: 1.4,               // Rayon de la section circulaire du conduit d'égout (m)
  STEAM_BURST_INTERVAL: 3.5,       // Fréquence d'échappement des soupapes thermiques (s)
  STEAM_ACTIVE_DURATION: 1.4,      // Durée du jet de vapeur vive sous pression (s)
  STEAM_DPS: 34.0,                 // Dommages thermiques intenses par seconde
  THERMAL_BLUR_FACTOR: 0.85,       // Perturbation d'éblouissement du biomasque thermique
  ACOUSTIC_RESONANCE_MULT: 2.2,    // Amplification de l'écho des pas dans le béton
};

export function createSewerSteamSectorState() {
  return {
    steamVents: [
      { id: 'vent_01', x: 0, y: 1.2, z: -10.0, isActive: false, timer: 1.0 },
      { id: 'vent_02', x: 0, y: 1.2, z: 0.0,    isActive: false, timer: 2.5 },
      { id: 'vent_03', x: 0, y: 1.2, z: 12.0,   isActive: false, timer: 0.5 },
    ],
    sludgeWaterDepth: 0.35,
    thermalBlindedEntities: [],
  };
}

export function updateSewerSteamSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (const vent of state.steamVents) {
    vent.timer -= dt;

    if (!vent.isActive && vent.timer <= 0) {
      vent.isActive = true;
      vent.timer = SEWER_STEAM_CONSTANTS.STEAM_ACTIVE_DURATION;

      if (audio && typeof audio.playSewerSteamBurst === 'function') {
        audio.playSewerSteamBurst();
      }
    } else if (vent.isActive && vent.timer <= 0) {
      vent.isActive = false;
      vent.timer = SEWER_STEAM_CONSTANTS.STEAM_BURST_INTERVAL;
    }

    // Application de la brûlure et aveuglement thermique si le jet est actif
    if (vent.isActive) {
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ey = ent.y ?? (ent.position ? ent.position.y : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);

        const dx = ex - vent.x;
        const dy = ey - vent.y;
        const dz = ez - vent.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist <= 2.2) {
          const dmg = SEWER_STEAM_CONSTANTS.STEAM_DPS * dt;
          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(dmg, 'scalding_steam_burn');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - dmg);
          }

          ent.isThermalBlinded = true;
          ent.thermalBlindTimer = 2.0;
        }
      }
    }
  }
}
