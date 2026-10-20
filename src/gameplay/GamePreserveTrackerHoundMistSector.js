/**
 * GamePreserveTrackerHoundMistSector.js
 * 
 * Predators (2010) - Game Preserve Planet Swamp Mist & Hell-Hound Ambush.
 * Simulates the Tracker Super Predator's coordinated hunting tactics with armored
 * quadruped hounds, ultrasonic command whistles (24.5 kHz), swamp fog optical
 * scattering, and razor-sharp thorn wire choke points.
 */

export class GamePreserveTrackerHoundMistSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='game-preserve-mist-swamp-01']
   * @param {number} [options.mistDensity=0.82]
   * @param {number} [options.houndCount=4]
   * @param {number} [options.ultrasonicWhistleKhz=24.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'game-preserve-mist-swamp-01';
    this.mistDensity = options.mistDensity || 0.82;
    this.houndCount = options.houndCount || 4;
    this.ultrasonicWhistleKhz = options.ultrasonicWhistleKhz || 24.5;

    this.hounds = [];
    for (let i = 0; i < this.houndCount; i++) {
      this.hounds.push({
        id: `hell-hound-${i + 1}`,
        health: 220,
        speedMps: 14.2,
        armorRidgeHardness: 7.5, // Mohs scale
        state: 'STALKING_MIST',
        tackling: false
      });
    }

    this.thornStakesPlaced = 6;
    this.whistleCommandActive = false;
  }

  /**
   * Calculates visibility attenuation through dense swamp mist.
   * Beer-Lambert optical attenuation: I = I_0 * e^(-alpha * distance)
   * @param {number} distanceMeters
   * @returns {Object} Optical transparency metrics
   */
  computeMistOpticalAttenuation(distanceMeters = 15.0) {
    const attenuationCoeff = this.mistDensity * 0.18;
    const opticalTransmissionRatio = +(Math.exp(-attenuationCoeff * distanceMeters)).toFixed(3);
    const laserBeamScattered = this.mistDensity > 0.6;
    const effectiveVisibilityM = +(1.0 / (attenuationCoeff + 0.001)).toFixed(1);

    return {
      distanceMeters,
      mistDensity: this.mistDensity,
      opticalTransmissionRatio,
      laserBeamScattered,
      effectiveVisibilityM,
      triLaserDefocusAngleDeg: laserBeamScattered ? 2.4 : 0.0
    };
  }

  /**
   * Blows the Tracker Super Predator's ultrasonic hunting whistle.
   * @param {number} burstDurationSec
   * @returns {Object} Command dispatch telemetry
   */
  blowUltrasonicHoundWhistle(burstDurationSec = 0.8) {
    this.whistleCommandActive = true;
    const humanAudible = this.ultrasonicWhistleKhz <= 20.0; // Above 20 kHz is ultrasonic
    
    // Command hounds into pincer charge
    this.hounds.forEach((hound, idx) => {
      hound.state = (idx % 2 === 0) ? 'FLANKING_LEFT' : 'FLANKING_RIGHT';
    });

    return {
      success: true,
      whistleFrequencyKhz: this.ultrasonicWhistleKhz,
      humanAudible,
      houndsAlerted: this.hounds.length,
      houndTacticalFormation: 'PINCER_ENVELOPMENT',
      burstDurationSec
    };
  }

  /**
   * Executes a heavy quadruped hound charge and tackle against a target.
   * @param {string} houndId
   * @param {number} targetDistanceM
   * @returns {Object} Charge impact resolution
   */
  executeHoundCharge(houndId = 'hell-hound-1', targetDistanceM = 12.0) {
    const hound = this.hounds.find(h => h.id === houndId) || this.hounds[0];
    const houndMassKg = 140; // Dense extraterrestrial canine musculature
    const chargeTimeSec = +(targetDistanceM / hound.speedMps).toFixed(2);
    const kineticEnergyJoules = Math.round(0.5 * houndMassKg * Math.pow(hound.speedMps, 2)); // ~14100 J
    const tackleKnockdownProbability = targetDistanceM <= 25.0 ? 0.85 : 0.45;

    hound.state = 'CHARGING';
    hound.tackling = true;

    return {
      houndId: hound.id,
      chargeSpeedMps: hound.speedMps,
      chargeTimeSec,
      kineticEnergyJoules,
      tackleKnockdownProbability,
      tackleDamage: 95,
      carapaceSpikeDamage: 45
    };
  }

  /**
   * Checks if prey trips into the perimeter thorn wire barricade.
   * @param {number} movementSpeedMps
   * @param {boolean} sprintingBlindly
   * @returns {Object} Thorn wire hazard outcome
   */
  checkThornWireTrapCollision(movementSpeedMps = 6.2, sprintingBlindly = true) {
    if (!sprintingBlindly || this.thornStakesPlaced === 0) {
      return { triggered: false, bleedingApplied: false, speedReductionRatio: 0.0 };
    }

    return {
      triggered: true,
      punctureDamage: 38,
      bleedingApplied: true,
      speedReductionRatio: 0.55,
      entangledDurationSec: 1.8
    };
  }
}
