import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #3 (v154) — Persona "Puriste Lore & Immersion Diégétique : Mimétisme Vocal & Surcharge Thermique"
 * Corrige deux incohérences diégétiques relevées lors du playtest lore :
 * 1. Surcharge Thermique Ambiante (*Thermal Whiteout*) : lorsque le Yautja se trouve près d'un incendie intense, de torches de boue de Dutch (*Predator 1987*) ou de conduites de vapeur brûlante (*Predator 2*), la température ambiante ($\ge 38\text{ }^\circ\text{C}$) sature le capteur infrarouge (`THERMAL_INFRA`) et masque les silhouettes humaines à `37 °C`, obligeant à basculer en `ELECTROMAGNETIC_TECH`.
 * 2. Distorsion du Leurre Vocal (*Vocal Mimicry*) sur Bio-Masque Endommagé : si l'intégrité du masque tombe sous `40 %`, l'émetteur vocal grésille et trahit un cliquetis Yautja qui éveille la méfiance des ennemis vétérans au lieu de les attirer aveuglément.
 */
export class HumanQaDiegeticSensorGlitchAndMimicryAuditor {
  constructor(options = {}) {
    this.humanBodyTempC = options.humanBodyTempC ?? 37.0;
    this.maskGlitchThreshold = options.maskGlitchThreshold ?? 40;
  }

  evaluateThermalVisionSaturation(environmentState = {}) {
    const ambientTempC = Number(environmentState.ambientTemperatureCelsius ?? 24.0);
    const visionMode = environmentState.visionMode ?? 'THERMAL_INFRA';

    if (visionMode !== 'THERMAL_INFRA') {
      return {
        thermalWhiteoutActive: false,
        thermalContrastRatio: 1.0,
        recommendedFallbackMode: visionMode
      };
    }

    const tempDelta = Math.abs(this.humanBodyTempC - ambientTempC);
    if (ambientTempC >= 36.0 && tempDelta <= 3.5) {
      return {
        thermalWhiteoutActive: true,
        thermalContrastRatio: 0.12,
        humanTargetsCamouflagedByHeat: true,
        recommendedFallbackMode: 'ELECTROMAGNETIC_TECH'
      };
    }

    return {
      thermalWhiteoutActive: false,
      thermalContrastRatio: 0.92,
      humanTargetsCamouflagedByHeat: false,
      recommendedFallbackMode: 'THERMAL_INFRA'
    };
  }

  evaluateVocalMimicryFidelity(maskState = {}) {
    const integrity = Number(maskState.maskIntegrity ?? 100);
    const phrase = maskState.phrase ?? 'over_here';

    if (integrity < this.maskGlitchThreshold) {
      audioSynth.playCrackedMaskMimicryGlitchWarble?.();
      return {
        phrase,
        glitched: true,
        credibilityScore: 0.28,
        yautjaClickBleedThrough: true,
        veteranEnemiesSuspicious: true
      };
    }

    return {
      phrase,
      glitched: false,
      credibilityScore: 0.96,
      yautjaClickBleedThrough: false,
      veteranEnemiesSuspicious: false
    };
  }
}
