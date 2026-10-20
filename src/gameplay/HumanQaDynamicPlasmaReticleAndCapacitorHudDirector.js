import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 6 + Audit Testeur Humain QA #1 (v157) — Persona "Joueur Clavier/Souris & Précision Tactique du Réticule"
 * Corrige deux manques d'ergonomie visuelle sur l'armement lourd Yautja :
 * 1. Réticule dynamique de dispersion thermique : s'élargit progressivement (de 36 px au repos jusqu'à 72 px en tir soutenu) pour matérialiser la perte de précision balistique.
 * 2. Télémétrie en segments du condensateur plasma : jauge à 4 segments (25 % par palier) avec alerte de surchauffe (overheat) et retour haptique/acoustique.
 */
export class HumanQaDynamicPlasmaReticleAndCapacitorHudDirector {
  constructor(options = {}) {
    this.minSpreadPx = options.minSpreadPx ?? 36;
    this.maxSpreadPx = options.maxSpreadPx ?? 72;
    this.currentSpreadPx = this.minSpreadPx;
    this.capacitorChargeRatio = 1.0; // 0..1
    this.heatAccumulationRatio = 0.0; // 0..1
    this.coolingRatePerSec = options.coolingRatePerSec ?? 0.35;
    this.overheated = false;
  }

  recordPlasmaDischarge(powerLevel = 'standard') {
    const heatCost = powerLevel === 'overcharged' ? 0.45 : 0.18;
    const energyCost = powerLevel === 'overcharged' ? 0.4 : 0.15;

    this.heatAccumulationRatio = Math.min(1.0, this.heatAccumulationRatio + heatCost);
    this.capacitorChargeRatio = Math.max(0.0, this.capacitorChargeRatio - energyCost);
    this.currentSpreadPx = Math.min(this.maxSpreadPx, this.minSpreadPx + this.heatAccumulationRatio * (this.maxSpreadPx - this.minSpreadPx));

    if (this.heatAccumulationRatio >= 0.85) {
      this.overheated = true;
    }

    audioSynth.playPlasmaReticleThermalSpreadClick?.();

    return {
      discharged: true,
      currentSpreadPx: Math.round(this.currentSpreadPx),
      heatRatio: Number(this.heatAccumulationRatio.toFixed(2)),
      overheated: this.overheated,
      activeSegmentsCount: Math.ceil(this.capacitorChargeRatio * 4)
    };
  }

  updateCooling(dtSec = 0.1) {
    if (this.heatAccumulationRatio > 0) {
      this.heatAccumulationRatio = Math.max(0, this.heatAccumulationRatio - this.coolingRatePerSec * dtSec);
      this.currentSpreadPx = Math.max(this.minSpreadPx, this.minSpreadPx + this.heatAccumulationRatio * (this.maxSpreadPx - this.minSpreadPx));
      if (this.heatAccumulationRatio < 0.4) {
        this.overheated = false;
      }
    }

    if (this.capacitorChargeRatio < 1.0) {
      this.capacitorChargeRatio = Math.min(1.0, this.capacitorChargeRatio + 0.2 * dtSec);
    }

    return {
      currentSpreadPx: Math.round(this.currentSpreadPx),
      heatRatio: Number(this.heatAccumulationRatio.toFixed(2)),
      overheated: this.overheated,
      activeSegmentsCount: Math.ceil(this.capacitorChargeRatio * 4),
      cssVariableStyle: `--reticle-spread: ${Math.round(this.currentSpreadPx)}px;`
    };
  }
}
