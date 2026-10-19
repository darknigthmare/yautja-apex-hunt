import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #3 (v155) — Persona "Puriste Lore & Simulation Sensorielle : Givrage du Bio-Masque en Blizzard & Empreintes Thermiques Résiduelles"
 * 1. Givrage périphérique de la visière sur Bouvetøya (`ambientTempC <= -15 °C`) lorsque le chasseur reste immobile, dissipé par l'impulsion de dégivrage thermique du masque.
 * 2. Décroissance exponentielle réaliste des empreintes de pas thermiques laissées sur le sol en mode `THERMAL_INFRA`.
 */
export class HumanQaDiegeticMaskFrostAndResidualHeatAuditor {
  constructor() {
    this.visorFrostRatio = 0;
  }

  updateVisorFrostState(state = {}) {
    const tempC = Number(state.ambientTemperatureCelsius ?? 20);
    const moving = Boolean(state.isMoving);
    const autoDefrost = state.autoDefrostEnabled !== false;

    if (tempC <= -15 && !moving) {
      this.visorFrostRatio = Math.min(1.0, this.visorFrostRatio + 0.35);
    } else {
      this.visorFrostRatio = Math.max(0, this.visorFrostRatio - 0.25);
    }

    if (this.visorFrostRatio >= 0.6 && autoDefrost) {
      this.visorFrostRatio = 0.1;
      audioSynth.playBioMaskVisorThermalDefrostHiss?.();
      return {
        defrostTriggered: true,
        visorFrostRatio: this.visorFrostRatio,
        energyCost: 2
      };
    }

    return {
      defrostTriggered: false,
      visorFrostRatio: Number(this.visorFrostRatio.toFixed(2)),
      energyCost: 0
    };
  }

  computeResidualFootprintThermalIntensity(ageSeconds = 0, halfLifeSeconds = 6.0) {
    const safeAge = Math.max(0, Number(ageSeconds) || 0);
    const intensity = Math.pow(0.5, safeAge / Math.max(0.5, halfLifeSeconds));
    return {
      intensity: Number(intensity.toFixed(3)),
      visibleInThermalVision: intensity >= 0.15
    };
  }
}
