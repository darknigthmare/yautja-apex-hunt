/**
 * StargazerGeneticHybridLabContainmentSector.js
 * 
 * The Predator (2018) - Project Stargazer Genetic Splicing Lab & Bio-Containment Pods.
 * Simulates the covert military research facility: laminated tempered glass incubation tanks
 * holding transgenic Yautja-human DNA specimens, security guards deploying sonic pulse disruptors,
 * and high-pressure chemical flood upon tank breach.
 */

export class StargazerGeneticHybridLabContainmentSector {
  /**
   * @param {Object} options
   * @param {string} [options.labSectorId='stargazer-gene-vault-02']
   * @param {number} [options.incubationTanksCount=6]
   * @param {number} [options.glassPlexiThicknessMm=30.0]
   * @param {number} [options.sonicPulseFrequencyHz=14200.0]
   */
  constructor(options = {}) {
    this.labSectorId = options.labSectorId || 'stargazer-gene-vault-02';
    this.incubationTanksCount = options.incubationTanksCount || 6;
    this.glassPlexiThicknessMm = options.glassPlexiThicknessMm || 30.0;
    this.sonicPulseFrequencyHz = options.sonicPulseFrequencyHz || 14200.0;

    this.shatteredTanksCount = 0;
    this.neuralDisruptionActive = false;
    this.harvestedDnaVials = [];
  }

  /**
   * Stargazer guards fire a sonic pulse disruptor rifle at the hunter.
   * High-frequency acoustic beam targets Yautja auditory canals, destabilizing equilibrium.
   * @param {number} pulseDurationSec
   * @param {number} pulseSplDb - Sound pressure level (~125 dB)
   * @returns {Object} Sonic disruption telemetry
   */
  deploySonicDisruptorPulse(pulseDurationSec = 1.5, pulseSplDb = 125.0) {
    this.neuralDisruptionActive = pulseSplDb >= 110.0;
    const motorControlReductionRatio = +(Math.min(0.75, (pulseSplDb - 100.0) * 0.025)).toFixed(2);
    const cloakDisrupted = pulseSplDb >= 115.0;

    return {
      success: true,
      pulseFrequencyHz: this.sonicPulseFrequencyHz,
      pulseSplDb,
      neuralDisruptionActive: this.neuralDisruptionActive,
      motorControlReductionRatio,
      cloakDisrupted,
      disorientationDurationSec: +(pulseDurationSec * 2.0).toFixed(1)
    };
  }

  /**
   * Smashes an incubation tank using heavy melee or plasma fire.
   * Laminated 30mm glass requires > 400 Joules to shatter.
   * @param {number} impactEnergyJoules
   * @returns {Object} Tank breach outcome
   */
  shatterIncubationContainmentTank(impactEnergyJoules = 650) {
    const shatterThresholdJoules = 400;
    const shattered = impactEnergyJoules >= shatterThresholdJoules && this.incubationTanksCount > 0;

    if (!shattered) {
      return { shattered: false, reason: 'INSUFFICIENT_IMPACT_OR_NO_TANKS' };
    }

    this.incubationTanksCount--;
    this.shatteredTanksCount++;
    const floodFluidLiters = 450;
    const glassShrapnelDamage = 35;

    return {
      shattered: true,
      impactEnergyJoules,
      shatteredTanksCount: this.shatteredTanksCount,
      tanksRemaining: this.incubationTanksCount,
      floodFluidLiters,
      glassShrapnelDamage,
      glassShatterDecibels: 96,
      specimenFlooded: true
    };
  }

  /**
   * Harvests transgenic composite Yautja-human DNA vial from the shattered lab.
   * @param {string} specimenType - e.g. "Upgraded Muscular Spinal Hybrid"
   * @returns {Object} DNA harvest details
   */
  harvestTransgenicDnaSample(specimenType = 'Upgraded Muscular Spinal Hybrid') {
    const dnaVial = {
      specimenType,
      geneticPurityRatio: 0.94,
      dnaHelixIntegrity: 0.98,
      loreOrigin: 'The Predator (2018) Project Stargazer Hybridization'
    };

    this.harvestedDnaVials.push(dnaVial);

    return {
      success: true,
      dnaVial,
      totalVialsHarvested: this.harvestedDnaVials.length,
      upgradeBiotechEligible: true
    };
  }
}
