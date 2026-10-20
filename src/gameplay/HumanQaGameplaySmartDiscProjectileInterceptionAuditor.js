/**
 * HumanQaGameplaySmartDiscProjectileInterceptionAuditor.js
 * 
 * Human Playtester QA Audit #4: Defensive Smart Disc Projectile Interception & Mid-Air Parry.
 * Transforms the Smart Disc from a purely offensive weapon into an acrobatic defensive tool:
 * detects incoming high-threat projectiles (RPG rockets, Comanche flint arrows, Xenomorph acid spit),
 * computes collision trajectory intercepts, and cleaves/detonates threats harmlessly in mid-air.
 */

export class HumanQaGameplaySmartDiscProjectileInterceptionAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.interceptionRadiusMeters=1.2]
   * @param {number} [options.discBladeRpm=14000]
   */
  constructor(options = {}) {
    this.interceptionRadiusMeters = options.interceptionRadiusMeters || 1.2;
    this.discBladeRpm = options.discBladeRpm || 14000;

    this.successfulDeflections = 0;
    this.interceptedProjectiles = [];
  }

  /**
   * Evaluates whether a flying Smart Disc trajectory intersects an incoming hostile projectile.
   * @param {{x: number, y: number, z: number}} discPos
   * @param {{x: number, y: number, z: number}} discVelocity
   * @param {{x: number, y: number, z: number}} projPos
   * @param {{x: number, y: number, z: number}} projVelocity
   * @returns {Object} Interception analysis
   */
  evaluateProjectileInterception(discPos, discVelocity, projPos, projVelocity) {
    const dx = discPos.x - projPos.x;
    const dy = discPos.y - projPos.y;
    const dz = discPos.z - projPos.z;
    const currentDistanceMeters = Math.hypot(dx, dy, dz);

    // Relative velocity vector
    const relVx = discVelocity.x - projVelocity.x;
    const relVy = discVelocity.y - projVelocity.y;
    const relVz = discVelocity.z - projVelocity.z;
    const relativeSpeedMps = Math.hypot(relVx, relVy, relVz) || 1.0;

    // Time to closest point of approach (CPA)
    const tCpa = -(dx * relVx + dy * relVy + dz * relVz) / Math.pow(relativeSpeedMps, 2);
    const clampedTCpa = Math.max(0, tCpa);

    const cpaDx = dx + relVx * clampedTCpa;
    const cpaDy = dy + relVy * clampedTCpa;
    const cpaDz = dz + relVz * clampedTCpa;
    const closestDistanceMeters = Math.hypot(cpaDx, cpaDy, cpaDz);

    const willIntercept = closestDistanceMeters <= this.interceptionRadiusMeters && clampedTCpa <= 0.8;

    return {
      currentDistanceMeters: +currentDistanceMeters.toFixed(2),
      closestDistanceMeters: +closestDistanceMeters.toFixed(2),
      timeToInterceptSec: +clampedTCpa.toFixed(3),
      willIntercept,
      interceptPoint: {
        x: +(discPos.x + discVelocity.x * clampedTCpa).toFixed(2),
        y: +(discPos.y + discVelocity.y * clampedTCpa).toFixed(2),
        z: +(discPos.z + discVelocity.z * clampedTCpa).toFixed(2)
      }
    };
  }

  /**
   * Executes a mid-air deflection or neutralisation of an incoming projectile.
   * @param {string} projectileId
   * @param {string} projectileType - 'RPG_ROCKET', 'FLINT_ARROW', 'XENO_ACID_SPIT', 'SNIPER_BULLET'
   * @returns {Object} Deflection result
   */
  executeMidAirDeflection(projectileId, projectileType = 'RPG_ROCKET') {
    this.successfulDeflections++;
    const deflectionEntry = {
      projectileId,
      projectileType,
      timestamp: Date.now()
    };
    this.interceptedProjectiles.push(deflectionEntry);

    let detonationOccurred = false;
    let deflectionAction = 'SLICED_IN_TWAIN';

    switch (projectileType) {
      case 'RPG_ROCKET':
        detonationOccurred = true;
        deflectionAction = 'PREMATURE_AIRBURST_DETONATION';
        break;
      case 'XENO_ACID_SPIT':
        deflectionAction = 'DISPERSED_CENTRIFUGAL_VAPOR';
        break;
      case 'FLINT_ARROW':
      case 'SNIPER_BULLET':
      default:
        deflectionAction = 'RICOCHET_KINETIC_DEFLECTION';
        break;
    }

    return {
      success: true,
      projectileId,
      projectileType,
      deflectionAction,
      detonationOccurred,
      successfulDeflections: this.successfulDeflections,
      smartDiscBladeIntegrity: 1.0 // Nanocarbon alloy resists fragmentation
    };
  }

  /**
   * Returns current deflection telemetry.
   * @returns {Object}
   */
  getInterceptionTelemetry() {
    return {
      interceptionRadiusMeters: this.interceptionRadiusMeters,
      discBladeRpm: this.discBladeRpm,
      successfulDeflections: this.successfulDeflections,
      historyCount: this.interceptedProjectiles.length
    };
  }
}
