// Bassin d'Égout Inondé & Embuscade Subaquatique de Xénomorphes (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Les bassins d'eaux usées sous Gunnison où les Xénomorphes nagent en immersion silencieuse avant de jaillir hors de l'eau, ou peuvent être foudroyés par un tir plasma dans la nappe.

import { audioSynth } from '../AudioSynthesizer.js';

export const SEWER_BASIN_CONSTANTS = {
  ELECTRIFIED_WATER_DAMAGE: 175,     // Dégâts d'électrocution plasma dans le bassin
  BREACH_POUNCE_DAMAGE: 95,          // Dégâts de bond hors de l'eau si non neutralisé
};

export function createFloodedSewerBasinState() {
  return {
    submergedXenomorphs: [],
    isWaterElectrified: false,
  };
}

export function registerSubmergedXenomorph(state, xenoEntity) {
  if (!state || !xenoEntity) return false;
  xenoEntity.isSubmergedHidden = true;
  state.submergedXenomorphs.push(xenoEntity);
  return true;
}

export function electrifySewerBasinWithPlasma(state, audio = audioSynth) {
  if (!state) return { shockedCount: 0 };

  state.isWaterElectrified = true;
  let shockedCount = 0;

  if (audio && typeof audio.playSewerBasinWaterBreachSplash === 'function') {
    audio.playSewerBasinWaterBreachSplash();
  }

  for (const xeno of state.submergedXenomorphs) {
    if (!xeno) continue;
    xeno.isSubmergedHidden = false;
    xeno.isFlushedOutByPlasma = true;
    shockedCount++;

    if (typeof xeno.takeDamage === 'function') {
      xeno.takeDamage(SEWER_BASIN_CONSTANTS.ELECTRIFIED_WATER_DAMAGE);
    } else if (typeof xeno.health === 'number') {
      xeno.health = Math.max(0, xeno.health - SEWER_BASIN_CONSTANTS.ELECTRIFIED_WATER_DAMAGE);
    }
  }

  return {
    shockedCount,
  };
}
