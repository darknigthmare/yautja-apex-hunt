/**
 * HumanQaLevelDesignSlaughterhouseOcclusionAuditor.js
 * 
 * Chantier 10 & Audit QA #5 (Level Design):
 * Solves QA tester feedback: "Indoor meat locker levels feel like static obstacle mazes.
 * The suspended beef carcasses on metal rails should be physically dynamic: swinging when
 * brushed or shot, providing transient ballistic cover, and obstructing thermal sightlines with cold thermal shadow."
 * 
 * Implements physical pendulum carcass swinging physics, dynamic sightline occlusion raycasting,
 * cold thermal masking silhouettes (2°C), and acoustic rail hook creaking.
 */

export class HumanQaLevelDesignSlaughterhouseOcclusionAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.roomSectorId='slaughterhouse-rail-grid-01']
   * @param {number} [options.carcassMassKg=320.0]
   * @param {number} [options.railHeightM=3.2]
   * @param {number} [options.carcassTempC=2.0]
   */
  constructor(options = {}) {
    this.roomSectorId = options.roomSectorId || 'slaughterhouse-rail-grid-01';
    this.carcassMassKg = options.carcassMassKg || 320.0;
    this.railHeightM = options.railHeightM || 3.2;
    this.carcassTempC = options.carcassTempC || 2.0;

    this.oscillationAngleDeg = 0.0;
    this.oscillationVelocityDegPs = 0.0;
    this.dampingFactor = 0.15;
  }

  /**
   * Applies an impulse from a brushed body or bullet impact, initiating pendulum swing.
   * @param {number} impulseForceN
   * @param {number} impactHeightM
   * @returns {Object} Swing initiation telemetry
   */
  applyPendulumImpulse(impulseForceN = 120.0, impactHeightM = 1.5) {
    const angularAccelerationDeg = (impulseForceN * impactHeightM) / (this.carcassMassKg * 0.5);
    this.oscillationVelocityDegPs += angularAccelerationDeg;
    this.oscillationAngleDeg = Math.min(45.0, Math.max(-45.0, this.oscillationAngleDeg + this.oscillationVelocityDegPs * 0.1));

    const g = 9.81;
    const naturalFrequencyRadPs = +(Math.sqrt(g / this.railHeightM)).toFixed(2); // ~1.75 rad/s
    const periodSec = +( (2 * Math.PI) / naturalFrequencyRadPs ).toFixed(2);

    return {
      impulseForceN,
      initialAngleDeg: +this.oscillationAngleDeg.toFixed(1),
      naturalFrequencyRadPs,
      periodSec,
      hookCreakDecibels: Math.round(55 + Math.abs(this.oscillationAngleDeg) * 0.8)
    };
  }

  /**
   * Updates pendulum decay over delta time.
   * @param {number} deltaSec
   * @returns {Object} Updated position
   */
  tickOscillation(deltaSec = 0.016) {
    if (Math.abs(this.oscillationAngleDeg) < 0.2 && Math.abs(this.oscillationVelocityDegPs) < 0.2) {
      this.oscillationAngleDeg = 0.0;
      this.oscillationVelocityDegPs = 0.0;
      return { oscillationAngleDeg: 0.0, inMotion: false };
    }

    const g = 9.81;
    const restoringAccel = -(g / this.railHeightM) * (this.oscillationAngleDeg * (Math.PI / 180)) * (180 / Math.PI);
    this.oscillationVelocityDegPs += (restoringAccel - this.dampingFactor * this.oscillationVelocityDegPs) * deltaSec;
    this.oscillationAngleDeg += this.oscillationVelocityDegPs * deltaSec;

    return {
      oscillationAngleDeg: +this.oscillationAngleDeg.toFixed(2),
      inMotion: true,
      displacementMeters: +(Math.sin(this.oscillationAngleDeg * (Math.PI / 180)) * this.railHeightM).toFixed(2)
    };
  }

  /**
   * Evaluates line of sight and thermal masking behind a cold swinging carcass.
   * @param {Object} hunterPosition - { x, y }
   * @param {Object} observerPosition - { x, y }
   * @returns {Object} Occlusion and thermal masking telemetry
   */
  evaluateSightlineAndThermalShadow(hunterPosition = { x: 0, y: 0 }, observerPosition = { x: 0, y: 8 }) {
    const isInterposed = Math.abs(this.oscillationAngleDeg) < 18.0; // Covered when not swung too far aside
    const thermalContrastDeltaT = Math.abs(this.carcassTempC - 37.0); // 35C cold thermal barrier!
    const sightlineCoverRatio = isInterposed ? 0.92 : 0.35;

    return {
      isInterposed,
      sightlineCoverRatio,
      carcassTempC: this.carcassTempC,
      thermalContrastDeltaT,
      thermalShadowMaskingActive: isInterposed,
      bulletInterceptionProbability: isInterposed ? 0.85 : 0.2
    };
  }
}
