/**
 * LosAngelesSubwayStrobeNeonCarSector.js
 * 
 * Predator 2 (1990) - Stalled Los Angeles subway train car in dark tunnel.
 * Simulates defective fluorescent neon lights pulsing in stochastic stroboscopic cycles (8-14 Hz),
 * cloaked movement synchronized with strobe darkness phases, panicked armed gang members,
 * and pneumatic emergency track brake triggers.
 */

export class LosAngelesSubwayStrobeNeonCarSector {
  /**
   * @param {Object} options
   * @param {string} [options.trainCarId='la-subway-car-07']
   * @param {number} [options.strobeFrequencyHz=11.5]
   * @param {boolean} [options.neonBulbFunctional=true]
   * @param {number} [options.panickedTargetsCount=8]
   * @param {boolean} [options.cloakPhaseSynced=false]
   */
  constructor(options = {}) {
    this.trainCarId = options.trainCarId || 'la-subway-car-07';
    this.strobeFrequencyHz = options.strobeFrequencyHz || 11.5;
    this.neonBulbFunctional = options.neonBulbFunctional !== undefined ? options.neonBulbFunctional : true;
    this.panickedTargetsCount = options.panickedTargetsCount !== undefined ? options.panickedTargetsCount : 8;
    this.cloakPhaseSynced = options.cloakPhaseSynced !== undefined ? options.cloakPhaseSynced : false;

    this.isLightPhase = false;
    this.strobeAccumulatorSec = 0.0;
    this.emergencyBrakesEngaged = false;
  }

  /**
   * Cycles stroboscopic illumination pulses based on elapsed delta time.
   * @param {number} deltaSec
   * @returns {Object} Strobe phase state
   */
  cycleStrobeNeonPulse(deltaSec = 0.05) {
    if (!this.neonBulbFunctional) {
      this.isLightPhase = false;
      return { isLightPhase: false, blackoutActive: true };
    }

    this.strobeAccumulatorSec += deltaSec;
    const periodSec = 1.0 / this.strobeFrequencyHz;
    // 35% duty cycle (flash is short, dark phase is long)
    this.isLightPhase = (this.strobeAccumulatorSec % periodSec) < (periodSec * 0.35);

    return {
      isLightPhase: this.isLightPhase,
      strobeFrequencyHz: this.strobeFrequencyHz,
      darknessDurationMs: Math.round(periodSec * 0.65 * 1000),
      disorientingToHumans: true
    };
  }

  /**
   * Synchronizes hunter footsteps and cloaked stalking exclusively during dark strobe phases.
   * @param {number} hunterSpeedMps
   * @returns {Object} Stealth synchronization telemetry
   */
  syncCloakWithStrobeDarkness(hunterSpeedMps = 2.5) {
    if (this.isLightPhase) {
      this.cloakPhaseSynced = false;
      return {
        synced: false,
        stealthMultiplier: 0.35,
        cloakSilhouetteExposed: true,
        reason: 'MOVED_DURING_LIGHT_PULSE'
      };
    }

    // Moving during dark interval yields cinematic predator illusion
    this.cloakPhaseSynced = true;
    return {
      synced: true,
      stealthMultiplier: 1.0,
      cloakSilhouetteExposed: false,
      terrorFactor: 0.95,
      stalkingAdvantageActive: true
    };
  }

  /**
   * Slams the manual emergency pneumatic train brakes.
   * Severe inertia throws targets to the ground, disabling their return fire.
   * @returns {Object} Brake deceleration telemetry
   */
  breakSubwayEmergencyBrakes() {
    this.emergencyBrakesEngaged = true;
    const decelerationGForce = 1.8; // 1.8G sudden deceleration
    const targetsDisarmed = Math.min(this.panickedTargetsCount, 5);

    return {
      emergencyBrakesEngaged: true,
      decelerationGForce,
      targetsDisarmed,
      targetsFloorKnockedDown: true,
      sparksFromWheelsAcousticDb: 88
    };
  }

  /**
   * Returns current subway car telemetry.
   * @returns {Object}
   */
  getSubwayCarTelemetry() {
    return {
      trainCarId: this.trainCarId,
      strobeFrequencyHz: this.strobeFrequencyHz,
      isLightPhase: this.isLightPhase,
      panickedTargetsCount: this.panickedTargetsCount,
      cloakPhaseSynced: this.cloakPhaseSynced,
      emergencyBrakesEngaged: this.emergencyBrakesEngaged
    };
  }
}
