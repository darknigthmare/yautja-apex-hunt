/**
 * ComancheMedicineHerbPoulticeCoagulationSystem.js
 * Chantier 6 (v150) : Cataplasme d'herbes médicinales Comanche & hémostase rapide (Prey 2022).
 * Préparation médicinale traditionnelle de Naru (fleurs d'oranger Totsiyaa & mousse hémostatique) :
 * - Stoppe immédiatement les saignements actifs, supprimant les traces de sang chaud au sol
 *   que les chiens-loups Yautja ou les capteurs thermiques pourraient pister.
 * - Abaisse la température corporelle à 26.5 °C tout en restaurant les points de vie.
 */

export class ComancheMedicineHerbPoulticeCoagulationSystem {
  constructor(options = {}) {
    this.maxPoultices = options.maxPoultices ?? 4;
    this.healAmount = options.healAmount ?? 45;
    this.cooledBodyTempCelsius = options.cooledBodyTempCelsius ?? 26.5;

    this.state = {
      poulticesRemaining: this.maxPoultices,
      totalApplications: 0,
      totalBloodTrailsStopped: 0
    };
  }

  applyHerbPoultice(patient = {}, audioSynthesizer = null) {
    if (this.state.poulticesRemaining <= 0) {
      return { applied: false, reason: 'no_poultices_remaining' };
    }

    this.state.poulticesRemaining -= 1;
    this.state.totalApplications += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playComancheHerbPoulticeCrushApply === 'function') {
      audioSynthesizer.playComancheHerbPoulticeCrushApply(0.95);
    }

    const wasBleeding = Boolean(patient.isBleeding || patient.leavingWarmBloodTrail);
    if (wasBleeding) {
      this.state.totalBloodTrailsStopped += 1;
    }

    patient.isBleeding = false;
    patient.leavingWarmBloodTrail = false;
    patient.bodyTempCelsius = this.cooledBodyTempCelsius;
    patient.thermalSignatureReduced = true;
    patient.health = Math.min(Number(patient.maxHealth ?? 100), Number(patient.health ?? 55) + this.healAmount);

    return {
      applied: true,
      poulticesRemaining: this.state.poulticesRemaining,
      bleedingStopped: wasBleeding,
      bodyTempCelsius: patient.bodyTempCelsius,
      healthAfterHeal: patient.health
    };
  }

  getStatus() {
    return {
      poulticesRemaining: this.state.poulticesRemaining,
      totalApplications: this.state.totalApplications,
      totalBloodTrailsStopped: this.state.totalBloodTrailsStopped
    };
  }
}
