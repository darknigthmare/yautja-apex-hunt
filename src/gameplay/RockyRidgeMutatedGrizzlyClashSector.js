/**
 * RockyRidgeMutatedGrizzlyClashSector.js
 * 
 * Prey (2022) - High mountain rocky ridge sector.
 * Simulates the brutal close-quarters confrontation between the Feral Predator and an 800 kg Apex Grizzly.
 * Features kinetic charge physics, bare-hand parry timing windows, bear-hug clinch struggle mechanics,
 * overhead lift counters, and cliffside ledge hazard physics.
 */

export class RockyRidgeMutatedGrizzlyClashSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='rocky-ridge-grizzly-01']
   * @param {number} [options.grizzlyMassKg=780]
   * @param {number} [options.grizzlyHealth=650]
   * @param {number} [options.feralStamina=100]
   * @param {string} [options.clashState='STALKING'] - 'STALKING', 'CHARGING', 'CLINCH', 'OVERHEAD_LIFT', 'DEFEATED'
   * @param {number} [options.ledgeProximityM=8.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'rocky-ridge-grizzly-01';
    this.grizzlyMassKg = options.grizzlyMassKg !== undefined ? options.grizzlyMassKg : 780;
    this.grizzlyHealth = options.grizzlyHealth !== undefined ? options.grizzlyHealth : 650;
    this.feralStamina = options.feralStamina !== undefined ? options.feralStamina : 100;
    this.clashState = options.clashState || 'STALKING';
    this.ledgeProximityM = options.ledgeProximityM !== undefined ? options.ledgeProximityM : 8.5;

    this.feralMassKg = 165; // Feral Predator muscle density
    this.finisherExecuted = false;
  }

  /**
   * Initiates the grizzly charge down the ridge path.
   * @param {number} chargeSpeedMps - Speed in m/s (typically 11.0 to 14.0 m/s for sprinting bear)
   * @returns {Object} Charge kinetic telemetry
   */
  initiateGrizzlyCharge(chargeSpeedMps = 12.5) {
    this.clashState = 'CHARGING';
    const momentum = +(this.grizzlyMassKg * chargeSpeedMps).toFixed(1);
    const kineticEnergyJoules = Math.round(0.5 * this.grizzlyMassKg * Math.pow(chargeSpeedMps, 2));
    const parryWindowMs = Math.round(Math.max(120, 320 - (chargeSpeedMps * 12)));

    return {
      clashState: this.clashState,
      chargeSpeedMps,
      momentumKgMps: momentum,
      kineticEnergyJoules,
      parryWindowMs
    };
  }

  /**
   * Evaluates the Feral Predator's bare-handed parry / redirect against the charge.
   * @param {number} timingWindowMs - Ideal timing window (e.g. 200ms)
   * @param {number} reactionMs - Actual player response delay
   * @returns {Object} Parry outcome
   */
  executeBareHandParry(timingWindowMs = 200, reactionMs = 150) {
    const deltaMs = Math.abs(reactionMs - timingWindowMs);
    const isPerfect = deltaMs <= 40;
    const isSuccess = deltaMs <= 110;

    if (isPerfect) {
      this.clashState = 'OVERHEAD_LIFT';
      this.grizzlyHealth -= 140;
      this.feralStamina = Math.max(0, this.feralStamina - 15);
      return {
        success: true,
        quality: 'PERFECT_COUNTER',
        clashState: this.clashState,
        grizzlyHealth: this.grizzlyHealth,
        feralStamina: this.feralStamina,
        readyForFinisher: true
      };
    } else if (isSuccess) {
      this.clashState = 'CLINCH';
      this.feralStamina = Math.max(0, this.feralStamina - 25);
      return {
        success: true,
        quality: 'CLINCH_GRAPPLE',
        clashState: this.clashState,
        grizzlyHealth: this.grizzlyHealth,
        feralStamina: this.feralStamina,
        readyForFinisher: false
      };
    } else {
      // Missed parry: heavy tackle damage taken
      this.clashState = 'STALKING';
      const recoilDistanceM = 3.5;
      this.ledgeProximityM = Math.max(0, +(this.ledgeProximityM - recoilDistanceM).toFixed(1));
      this.feralStamina = Math.max(0, this.feralStamina - 45);
      return {
        success: false,
        quality: 'TACKLED',
        clashState: this.clashState,
        feralStamina: this.feralStamina,
        ledgeProximityM: this.ledgeProximityM,
        nearCliffFall: this.ledgeProximityM <= 1.5
      };
    }
  }

  /**
   * Resolves a bear-hug clinch struggle sequence.
   * @param {number} buttonMashesPerSecond - Struggle input rate
   * @param {number} durationSec - Length of struggle
   * @returns {Object} Clinch resolution
   */
  resolveBearHugClinch(buttonMashesPerSecond = 7.5, durationSec = 2.0) {
    if (this.clashState !== 'CLINCH') {
      return { state: this.clashState, resolved: false };
    }

    const yautjaTorqueNm = 620 * (buttonMashesPerSecond / 6.0);
    const bearClinchTorqueNm = 580;

    if (yautjaTorqueNm >= bearClinchTorqueNm) {
      this.clashState = 'OVERHEAD_LIFT';
      this.grizzlyHealth -= 90;
      this.feralStamina = Math.max(0, this.feralStamina - 10);
      return {
        resolved: true,
        winner: 'FERAL_PREDATOR',
        clashState: this.clashState,
        yautjaTorqueNm: Math.round(yautjaTorqueNm),
        readyForFinisher: true
      };
    } else {
      this.clashState = 'STALKING';
      this.feralStamina = Math.max(0, this.feralStamina - 30);
      return {
        resolved: true,
        winner: 'GRIZZLY',
        clashState: this.clashState,
        yautjaTorqueNm: Math.round(yautjaTorqueNm),
        readyForFinisher: false
      };
    }
  }

  /**
   * Executes the iconic Prey overhead two-handed spine-break / skull-shatter finisher.
   * @returns {Object} Finisher execution telemetry
   */
  executeOverheadSpineBreak() {
    if (this.clashState !== 'OVERHEAD_LIFT' && this.grizzlyHealth > 150) {
      return { success: false, reason: 'TARGET_NOT_LIFTED_OR_WEAKENED' };
    }

    this.clashState = 'DEFEATED';
    this.grizzlyHealth = 0;
    this.finisherExecuted = true;
    const honorRatingEarned = 500; // Apex earth predator defeated barehanded

    return {
      success: true,
      clashState: this.clashState,
      finisherExecuted: true,
      honorRatingEarned,
      trophyAvailable: 'APEX_GRIZZLY_CLAW_AND_SKULL'
    };
  }

  /**
   * Returns current telemetry.
   * @returns {Object}
   */
  getClashTelemetry() {
    return {
      sectorId: this.sectorId,
      grizzlyMassKg: this.grizzlyMassKg,
      grizzlyHealth: this.grizzlyHealth,
      feralStamina: this.feralStamina,
      clashState: this.clashState,
      ledgeProximityM: this.ledgeProximityM,
      finisherExecuted: this.finisherExecuted
    };
  }
}
