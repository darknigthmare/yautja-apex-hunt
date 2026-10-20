import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #3 (v158) — Persona "Puriste Immersion Diégétique : Fumée de Bobine Plasma & Décharge d'Ions"
 * Dans le lore de la franchise (*Predator 2*, *AVP 2004*) :
 * - Après des tirs de plasma répétés, les bobines supraconductrices du canon d'épaule chauffent et expulsent un filet de vapeur bleutée chaude. Ce panache dissipe l'invisibilité thermique à courte portée.
 * - Le passage à proximité de câbles électriques coupés ou de générateurs produit des micro-arcs électrostatiques qui dégradent le camouflage optique (scintillement IFF forcé).
 */
export class HumanQaDiegeticElectrostaticDischargeAndCoilSmokeAuditor {
  constructor(options = {}) {
    this.coilSmokeDensity = 0.0; // 0..1
    this.ionFieldInterference = 0.0;
  }

  evaluatePlasmacasterCoilSmoke(consecutiveShots = 0, dtSec = 0.1) {
    if (consecutiveShots >= 3) {
      this.coilSmokeDensity = Math.min(1.0, this.coilSmokeDensity + 0.35);
    } else {
      this.coilSmokeDensity = Math.max(0.0, this.coilSmokeDensity - 0.2 * dtSec);
    }

    const stealthPenalty = Number((this.coilSmokeDensity * 0.45).toFixed(2));
    return {
      coilSmoking: this.coilSmokeDensity > 0.25,
      coilSmokeDensity: Number(this.coilSmokeDensity.toFixed(2)),
      stealthPenalty,
      thermalSignatureBleedThrough: this.coilSmokeDensity > 0.5
    };
  }

  evaluateElectrostaticIonField(ionFieldStrength = 0.0, hunterState = {}) {
    this.ionFieldInterference = Number(ionFieldStrength) || 0;

    if (this.ionFieldInterference >= 0.5 && hunterState.cloakActive) {
      audioSynth.playElectrostaticIonDischargeSizzle?.();
      return {
        ionSparksActive: true,
        cloakDisrupted: true,
        flickerFrequencyHz: 12.0,
        stealthCompromised: true
      };
    }

    return {
      ionSparksActive: false,
      cloakDisrupted: false,
      stealthCompromised: false
    };
  }
}
