// Système de Combinaisons Isolantes Thermiques de Caoutchouc Plombé OWLF (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — L'équipe tactique d'infiltration de Keyes masquant sa signature thermique infrarouge, obligeant le City Hunter à permuter ses modes de vision (UV / Tech).

import { audioSynth } from '../AudioSynthesizer.js';

export const VISION_SPECTRUMS = {
  THERMAL: 'THERMAL_IR',
  ULTRAVIOLET: 'ULTRAVIOLET',
  TECH_ELECTROMAGNETIC: 'TECH_EM',
  NORMAL: 'NORMAL',
};

export const OWLF_INSULATION_CONSTANTS = {
  BASE_THERMAL_OPACITY: 0.04,          // Silhouette quasi-invisible sur le spectre infrarouge
  UV_REVEAL_INTENSITY: 0.95,           // Très haute visibilité en vision ultraviolette (fluorescence des polymères)
  TECH_REVEAL_INTENSITY: 0.88,         // Haute visibilité en vision Tech (électronique des radios et chargeurs SPAS-12)
  BREACH_LEAK_DURATION: 12.0,          // Durée pendant laquelle la chaleur s'échappe après perforation
  BREACH_DAMAGE_THRESHOLD: 25.0,       // Dégâts minimaux pour perforer le blindage en plomb
};

export function createOwlfInsulatedUnitState(unitId = 'owlf_operative_01') {
  return {
    unitId,
    isInsulated: true,
    isBreached: false,
    leakTimer: 0.0,
    activeVisionSignature: 0.0,
  };
}

export function evaluateVisionVisibility(unitState, activeVisionMode = VISION_SPECTRUMS.THERMAL) {
  if (!unitState || !unitState.isInsulated) {
    return { isVisible: true, signatureStrength: 1.0, mode: activeVisionMode };
  }

  // Si la combinaison est perforée, la chaleur corporelle jaillit
  if (unitState.isBreached && unitState.leakTimer > 0) {
    return {
      isVisible: true,
      signatureStrength: 1.0,
      mode: activeVisionMode,
      isThermalBreach: true,
    };
  }

  switch (activeVisionMode) {
    case VISION_SPECTRUMS.THERMAL:
      // Invisible au thermique infrarouge classique
      return {
        isVisible: false,
        signatureStrength: OWLF_INSULATION_CONSTANTS.BASE_THERMAL_OPACITY,
        mode: activeVisionMode,
        reason: 'LEAD_INSULATION_SHIELDED',
      };

    case VISION_SPECTRUMS.ULTRAVIOLET:
      // Fluorescence éclatante des polymères sous UV
      return {
        isVisible: true,
        signatureStrength: OWLF_INSULATION_CONSTANTS.UV_REVEAL_INTENSITY,
        mode: activeVisionMode,
        reason: 'UV_POLYMER_FLUORESCENCE',
      };

    case VISION_SPECTRUMS.TECH_ELECTROMAGNETIC:
      // Détection des circuits de communication et batteries dorsales
      return {
        isVisible: true,
        signatureStrength: OWLF_INSULATION_CONSTANTS.TECH_REVEAL_INTENSITY,
        mode: activeVisionMode,
        reason: 'EM_WEAPON_CIRCUITS',
      };

    default:
      return {
        isVisible: true,
        signatureStrength: 0.5,
        mode: activeVisionMode,
      };
  }
}

export function breachThermalSuit(unitState, damage = 30.0, audio = audioSynth) {
  if (!unitState || !unitState.isInsulated) return false;

  if (damage >= OWLF_INSULATION_CONSTANTS.BREACH_DAMAGE_THRESHOLD) {
    unitState.isBreached = true;
    unitState.leakTimer = OWLF_INSULATION_CONSTANTS.BREACH_LEAK_DURATION;

    if (audio && typeof audio.playThermalSuitBreachHiss === 'function') {
      audio.playThermalSuitBreachHiss();
    }
    return true;
  }
  return false;
}

export function updateThermalInsulation(unitState, delta = 0.1) {
  if (!unitState) return;

  if (unitState.isBreached && unitState.leakTimer > 0) {
    unitState.leakTimer = Math.max(0, unitState.leakTimer - delta);
    if (unitState.leakTimer === 0) {
      unitState.isBreached = false; // Colmatage d'urgence du gel étanche
    }
  }
}
