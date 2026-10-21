/**
 * ValVerdeHopperSkinnedPatrolClearingSector.js
 * 
 * Predator (1987) - Val Verde Jim Hopper's Skinned Green Beret Patrol Clearing.
 * Simulates the horrifying discovery made by Dutch's rescue team in the high canopy:
 * - Three Green Beret special forces corpses suspended upside-down from 8.5m high kapok branches
 * - Bodies stripped of skin with surgical precision, dog tags dangling and clinking in the breeze
 * - Thermal signatures cooling from 37 °C human core to 26 °C jungle ambient
 * - Swarms of necrophagous jungle flies producing an acoustic tracking cue (48 dB)
 * - Support rope severance mechanics: cutting ropes drops bodies, generating decoy distractions
 *   and allowing salvage of discarded M16 magazines and fragmentation grenades.
 */

export class ValVerdeHopperSkinnedPatrolClearingSector {
  /**
   * @param {Object} options
   * @param {string} [options.clearingId='val-verde-hopper-clearing-01']
   * @param {number} [options.branchElevationM=8.5]
   * @param {number} [options.ambientTempC=26.5]
   */
  constructor(options = {}) {
    this.clearingId = options.clearingId || 'val-verde-hopper-clearing-01';
    this.branchElevationM = options.branchElevationM || 8.5;
    this.ambientTempC = options.ambientTempC || 26.5;

    this.suspendedCorpses = [
      { id: 'corpse-hopper', name: 'Major Jim Hopper', heightM: 8.5, ropeCut: false, tempC: 28.0, dogTagsIntact: true },
      { id: 'corpse-beret-01', name: 'Green Beret Scout', heightM: 8.2, ropeCut: false, tempC: 27.2, dogTagsIntact: true },
      { id: 'corpse-beret-02', name: 'Green Beret Radio Operator', heightM: 8.8, ropeCut: false, tempC: 26.8, dogTagsIntact: true }
    ];

    this.fliesBuzzingActive = true;
    this.salvagedGrenadesCount = 0;
  }

  /**
   * Evaluates the thermal cooling progression of the suspended skinned corpses.
   * Thermal signatures fade toward jungle ambient temperature, reducing contrast on bio-mask viewports.
   * @param {number} hoursSinceDeath
   * @returns {Object} Thermal telemetry
   */
  evaluateCorpseThermalSignatures(hoursSinceDeath = 4.5) {
    this.suspendedCorpses.forEach(c => {
      // Exponential cooling toward ambient
      c.tempC = Number((this.ambientTempC + (37.0 - this.ambientTempC) * Math.exp(-hoursSinceDeath * 0.45)).toFixed(1));
    });

    const avgTempC = Number((this.suspendedCorpses.reduce((sum, c) => sum + c.tempC, 0) / this.suspendedCorpses.length).toFixed(1));
    const thermalContrastPct = Number(((avgTempC - this.ambientTempC) / (37.0 - this.ambientTempC) * 100).toFixed(1));

    return {
      clearingId: this.clearingId,
      hoursSinceDeath,
      ambientTempC: this.ambientTempC,
      corpsesCount: this.suspendedCorpses.length,
      averageCorpseTempC: avgTempC,
      thermalContrastPct,
      fliesAcousticDb: 48,
      predatorPsychologicalImpactScore: 95
    };
  }

  /**
   * Cuts the suspension rope of a corpse to drop it to the forest floor.
   * Creates an acoustic thump decoy (68 dB) and allows salvaging military munitions.
   * @param {string} corpseId
   * @returns {Object} Rope severance telemetry
   */
  cutSuspendedCorpseRope(corpseId = 'corpse-hopper') {
    const corpse = this.suspendedCorpses.find(c => c.id === corpseId);
    if (!corpse || corpse.ropeCut) {
      return { success: false, reason: 'CORPSE_NOT_FOUND_OR_ALREADY_CUT' };
    }

    corpse.ropeCut = true;
    const impactVelocityMps = Number(Math.sqrt(2 * 9.81 * corpse.heightM).toFixed(2));
    this.salvagedGrenadesCount += 2;

    return {
      success: true,
      corpseId: corpse.id,
      name: corpse.name,
      impactVelocityMps,
      groundThumpDecibels: 68,
      salvagedFragGrenades: 2,
      salvagedM16Magazines: 3,
      decoyDistractionGenerated: true,
      patrolInvestigationRadiusM: 35.0
    };
  }
}
