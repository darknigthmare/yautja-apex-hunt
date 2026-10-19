// Château d'Eau d'Entrepôt & Déluge Conducteur sur les Toits (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Les châteaux d'eau surplombant les immeubles de Los Angeles dont le perçage déverse une trombe d'eau éteignant les flammes mais amplifiant les décharges électriques et plasma.

import { audioSynth } from '../AudioSynthesizer.js';

export const WATER_TOWER_CONSTANTS = {
  DELUGE_RADIUS_M: 8.5,              // Rayon d'inondation du toit
  ELECTRIC_PLASMA_BONUS_MULT: 1.5,   // +50% de dégâts électriques/plasma sur cibles trempées
};

export function createWaterTowerSectorState() {
  return {
    isTankIntact: true,
    isSectorFlooded: false,
    drenchedTargetsCount: 0,
  };
}

export function ruptureWaterTowerTank(state, towerPos = { x: 0, z: 0 }, entitiesInZone = [], audio = audioSynth) {
  if (!state || !state.isTankIntact) {
    return { ruptured: false, drenchedCount: 0 };
  }

  state.isTankIntact = false;
  state.isSectorFlooded = true;

  if (audio && typeof audio.playWaterTowerTankRuptureRush === 'function') {
    audio.playWaterTowerTankRuptureRush();
  }

  let drenchedCount = 0;
  if (Array.isArray(entitiesInZone)) {
    for (const ent of entitiesInZone) {
      if (!ent) continue;
      const dist = Math.hypot((ent.x || 0) - (towerPos.x || 0), (ent.z || 0) - (towerPos.z || 0));
      if (dist <= WATER_TOWER_CONSTANTS.DELUGE_RADIUS_M) {
        ent.isBurning = false;
        ent.isDrenchedConductive = true;
        ent.plasmaDamageVulnerability = WATER_TOWER_CONSTANTS.ELECTRIC_PLASMA_BONUS_MULT;
        drenchedCount++;
        state.drenchedTargetsCount++;
      }
    }
  }

  return {
    ruptured: true,
    drenchedCount,
  };
}
