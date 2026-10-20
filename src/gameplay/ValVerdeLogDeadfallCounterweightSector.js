/**
 * ValVerdeLogDeadfallCounterweightSector.js
 * 
 * Predator (1987) - Dutch Schaefer's Counterweight Tree Trunk Deadfall & Self-Destruct.
 * Simulates the canonical climax in the Val Verde jungle gorge: an 850 kg suspended
 * hardwood log deadfall released by vine trigger pin, crushing kinetic impact (50,000 J),
 * and the defeated Jungle Hunter activating the wrist gauntlet self-destruct countdown
 * with eerie mimicry of Billy's laughter.
 */

export class ValVerdeLogDeadfallCounterweightSector {
  /**
   * @param {Object} options
   * @param {string} [options.trapSectorId='val-verde-deadfall-gorge-01']
   * @param {number} [options.logMassKg=850.0]
   * @param {number} [options.suspensionHeightM=6.0]
   * @param {boolean} [options.vineTriggerArmed=true]
   */
  constructor(options = {}) {
    this.trapSectorId = options.trapSectorId || 'val-verde-deadfall-gorge-01';
    this.logMassKg = options.logMassKg || 850.0;
    this.suspensionHeightM = options.suspensionHeightM || 6.0;
    this.vineTriggerArmed = options.vineTriggerArmed !== undefined ? options.vineTriggerArmed : true;

    this.deadfallTriggered = false;
    this.targetCrushed = false;
    this.selfDestructActive = false;
    this.selfDestructCountdownSec = 30.0;
  }

  /**
   * Baits the Jungle Hunter beneath the suspended log using torch flames and war cries.
   * @param {boolean} torchLit
   * @param {boolean} warCryEmitted
   * @returns {Object} Baiting outcome
   */
  baitHunterIntoKillzone(torchLit = true, warCryEmitted = true) {
    const baitSuccess = torchLit && warCryEmitted;

    return {
      baitSuccess,
      hunterDrawnUnderDeadfall: baitSuccess,
      killzoneProximityM: baitSuccess ? 1.2 : 12.0,
      hunterSuspiciousRating: 0.35 // Blinded by thermal glare of the torches
    };
  }

  /**
   * Cuts or pulls the vine trigger cord, dropping the 850 kg tree trunk.
   * Potential energy converted to kinetic: E = m * g * h
   * @returns {Object} Deadfall drop resolution
   */
  triggerLogDeadfallDrop() {
    if (!this.vineTriggerArmed) {
      return { triggered: false, reason: 'TRAP_ALREADY_SPRUNG' };
    }

    this.vineTriggerArmed = false;
    this.deadfallTriggered = true;

    const gravityMps2 = 9.81;
    const impactVelocityMps = +(Math.sqrt(2 * gravityMps2 * this.suspensionHeightM)).toFixed(2);
    const dropDurationSec = +(Math.sqrt((2 * this.suspensionHeightM) / gravityMps2)).toFixed(2);
    const impactKineticEnergyJoules = Math.round(this.logMassKg * gravityMps2 * this.suspensionHeightM); // ~50031 J

    this.targetCrushed = true;

    return {
      triggered: true,
      dropDurationSec,
      impactVelocityMps,
      impactKineticEnergyJoules,
      crushingBluntDamage: 1200,
      targetCrushed: this.targetCrushed,
      splinterRadiusM: 4.5
    };
  }

  /**
   * The fallen Jungle Hunter activates the wrist computer self-destruct device.
   * Initiates the 30-second countdown with ominous laughing voice mimicry.
   * @returns {Object} Self-destruct sequence status
   */
  initiateGauntletSelfDestruct() {
    this.selfDestructActive = true;
    this.selfDestructCountdownSec = 30.0;

    return {
      selfDestructActive: true,
      countdownSec: this.selfDestructCountdownSec,
      glyphDisplayFlashing: true,
      audioMimicryPlaying: "Billy's Laughter (Echoing)",
      blastRadiusMeters: 300.0,
      microNuclearYieldKilotons: 0.05,
      escapeWindowSec: 25.0
    };
  }
}
