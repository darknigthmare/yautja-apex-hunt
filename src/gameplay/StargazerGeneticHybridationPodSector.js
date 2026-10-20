/**
 * StargazerGeneticHybridationPodSector.js
 * 
 * The Predator (2018) - Project Stargazer gene-splicing cleanroom and cryogenic stasis pod.
 * Simulates transgenic gene hybridization protocols, cryo-preservation fluid drainage,
 * DNA sequencing combinations (Homo Sapiens, Yautja Prime, Xenomorph XX121),
 * and mutagen upgrade canister synthesis.
 */

export class StargazerGeneticHybridationPodSector {
  /**
   * @param {Object} options
   * @param {string} [options.podId='stargazer-gene-pod-01']
   * @param {boolean} [options.cryoFluidFilled=true]
   * @param {boolean} [options.dnaSequenceIntegrated=false]
   * @param {number} [options.sampleIntegrity=0.95]
   */
  constructor(options = {}) {
    this.podId = options.podId || 'stargazer-gene-pod-01';
    this.cryoFluidFilled = options.cryoFluidFilled !== undefined ? options.cryoFluidFilled : true;
    this.dnaSequenceIntegrated = options.dnaSequenceIntegrated !== undefined ? options.dnaSequenceIntegrated : false;
    this.sampleIntegrity = options.sampleIntegrity !== undefined ? options.sampleIntegrity : 0.95;

    this.fluidVolumeLiters = 450.0;
    this.podHatchUnlocked = false;
    this.harvestedCanister = null;
  }

  /**
   * Drains the fluorocarbon cryo-chemical preservation fluid from the incubation vessel.
   * @param {number} [drainRateLps=75.0]
   * @param {number} [durationSec=6.0]
   * @returns {Object} Drainage telemetry
   */
  drainCryoFluidVessel(drainRateLps = 75.0, durationSec = 6.0) {
    const drainedAmount = drainRateLps * durationSec;
    this.fluidVolumeLiters = Math.max(0, +(this.fluidVolumeLiters - drainedAmount).toFixed(1));

    if (this.fluidVolumeLiters <= 0) {
      this.cryoFluidFilled = false;
      this.podHatchUnlocked = true;
      return {
        drained: true,
        remainingVolumeLiters: 0,
        podHatchUnlocked: true,
        specimenExposed: true
      };
    }

    return {
      drained: false,
      remainingVolumeLiters: this.fluidVolumeLiters,
      podHatchUnlocked: false
    };
  }

  /**
   * Synthesizes transgenic mutagen combining two distinct biological donors.
   * @param {string} donorSpeciesA - 'YAUTJA_PRIME', 'HOMO_SAPIENS', 'XENOMORPH_XX121'
   * @param {string} donorSpeciesB
   * @returns {Object} Splicing synthesis telemetry
   */
  synthesizeTransgenicMutagen(donorSpeciesA = 'YAUTJA_PRIME', donorSpeciesB = 'HOMO_SAPIENS') {
    const validDonors = ['YAUTJA_PRIME', 'HOMO_SAPIENS', 'XENOMORPH_XX121', 'CANIS_HYBRID'];
    if (!validDonors.includes(donorSpeciesA) || !validDonors.includes(donorSpeciesB)) {
      return { success: false, reason: 'INVALID_GENETIC_DONOR' };
    }

    this.dnaSequenceIntegrated = true;
    const splicingCompatibilityScore = +(this.sampleIntegrity * 0.94).toFixed(2);
    const hybridArchetype = `${donorSpeciesA}_X_${donorSpeciesB}`;

    this.harvestedCanister = {
      archetype: hybridArchetype,
      stabilityScore: splicingCompatibilityScore,
      chitinExoskeletonBoostPercentage: donorSpeciesB === 'XENOMORPH_XX121' ? 45 : 20,
      cognitiveTacticalBonus: donorSpeciesB === 'HOMO_SAPIENS' ? 25 : 10
    };

    return {
      success: true,
      hybridArchetype,
      splicingCompatibilityScore,
      canisterSynthesized: true,
      traitsUnlocked: ['DERMAL_CHITIN_HARDENING', 'EXPANDED_NEURAL_RECEPTORS']
    };
  }

  /**
   * Extracts the synthesized mutagen canister from the pod console.
   * @returns {Object} Extraction outcome
   */
  extractMutagenCanister() {
    if (!this.harvestedCanister) {
      return { success: false, reason: 'NO_CANISTER_SYNTHESIZED' };
    }

    const item = { ...this.harvestedCanister };
    this.harvestedCanister = null;

    return {
      success: true,
      harvestedItem: item,
      inventoryCategory: 'TRANSGENIC_UPGRADE_SERUM'
    };
  }

  /**
   * Returns current diagnostics of the genetic pod.
   * @returns {Object}
   */
  getPodDiagnostics() {
    return {
      podId: this.podId,
      cryoFluidFilled: this.cryoFluidFilled,
      fluidVolumeLiters: this.fluidVolumeLiters,
      podHatchUnlocked: this.podHatchUnlocked,
      dnaSequenceIntegrated: this.dnaSequenceIntegrated,
      sampleIntegrity: this.sampleIntegrity,
      hasCanisterReady: this.harvestedCanister !== null
    };
  }
}
