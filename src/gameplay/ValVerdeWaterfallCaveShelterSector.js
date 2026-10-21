/**
 * ValVerdeWaterfallCaveShelterSector.js
 * 
 * Predator (1987) - Val Verde Roaring Waterfall Cave & Dutch's Final Trap Sanctuary.
 * Simulates the granite cavern shielded by a 40m high, 120,000 L/min waterfall curtain:
 * complete infrared masking (cold water wall blocks thermal vision into the cave),
 * 85 dB acoustic white noise masking all movement sounds, resin flare torches,
 * and an 800kg suspended swinging oak trunk deadfall trap.
 */

export class ValVerdeWaterfallCaveShelterSector {
  /**
   * @param {Object} options
   * @param {string} [options.cavernId='val-verde-waterfall-cave-01']
   * @param {number} [options.waterfallHeightM=40.0]
   * @param {number} [options.waterCurtainFlowRateLpm=120000.0]
   */
  constructor(options = {}) {
    this.cavernId = options.cavernId || 'val-verde-waterfall-cave-01';
    this.waterfallHeightM = options.waterfallHeightM || 40.0;
    this.waterCurtainFlowRateLpm = options.waterCurtainFlowRateLpm || 120000.0;

    this.suspendedLogMassKg = 800.0;
    this.suspendedLogTriggered = false;
    this.resinTorchesLit = 2;
  }

  /**
   * Computes the thermal masking and acoustic shielding provided by the 40m waterfall curtain.
   * @param {number} waterTemperatureC
   * @returns {Object} Waterfall shielding telemetry
   */
  computeWaterfallCurtainShielding(waterTemperatureC = 11.5) {
    const thermalTransmissionPct = 1.2; // 98.8% thermal IR blocked
    const acousticMaskingDecibels = 86.5; // Drowns out footsteps and breathing
    const plasmaQuenchCoolingRateDegPerSec = 75.0; // Instantly cools overheated shoulder cannon

    return {
      waterfallHeightM: this.waterfallHeightM,
      waterCurtainFlowRateLpm: this.waterCurtainFlowRateLpm,
      waterTemperatureC,
      thermalTransmissionPct,
      thermalInfraredMasked: true,
      acousticMaskingDecibels,
      footstepAcousticsDrownedOut: true,
      plasmaQuenchCoolingRateDegPerSec
    };
  }

  /**
   * Releases Dutch's counterweighted swinging log deadfall trap across the cave entrance.
   * @param {number} swingDropHeightM
   * @returns {Object} Deadfall trap resolution
   */
  releaseCounterweightedLogTrap(swingDropHeightM = 6.5) {
    if (this.suspendedLogTriggered) {
      return { success: false, reason: 'DEADFALL_TRAP_ALREADY_TRIGGERED' };
    }

    this.suspendedLogTriggered = true;
    const swingVelocityMps = Math.sqrt(2 * 9.81 * swingDropHeightM);
    const kineticEnergyJoules = 0.5 * this.suspendedLogMassKg * swingVelocityMps * swingVelocityMps;
    const bluntCrushDamage = 280;
    const knockbackImpulseNs = this.suspendedLogMassKg * swingVelocityMps;

    return {
      success: true,
      suspendedLogMassKg: this.suspendedLogMassKg,
      swingVelocityMps: Number(swingVelocityMps.toFixed(2)),
      kineticEnergyJoules: Math.round(kineticEnergyJoules),
      bluntCrushDamage,
      knockbackImpulseNs: Math.round(knockbackImpulseNs),
      concussionKnockdownDurationSec: 3.2,
      graniteWallSpallFragments: 16
    };
  }

  /**
   * Lights a pine resin flare torch inside the dark cave for non-thermal illumination.
   * @returns {Object} Torch lighting telemetry
   */
  lightResinTorch() {
    this.resinTorchesLit++;
    const lumenOutput = 450;
    const burnDurationMinutes = 25.0;

    return {
      success: true,
      resinTorchesLit: this.resinTorchesLit,
      lumenOutput,
      burnDurationMinutes,
      thermalBloomLocalRadiusM: 1.5,
      dispelsDarkness: true
    };
  }
}
