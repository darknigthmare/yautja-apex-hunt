/**
 * HumanQaAdaptivePlasmaLeadCrosshairDirector.js
 * 
 * Human Playtester QA Audit #1: Adaptive Predictive Plasma Lead Reticle.
 * Resolves missed Plasmacaster shots against fast-moving targets (Predator Hounds, Xenomorph runners)
 * by computing real-time ballistic projectile lead points and triggering visual/audio lock-on cues.
 */

export class HumanQaAdaptivePlasmaLeadCrosshairDirector {
  /**
   * @param {Object} options
   * @param {number} [options.plasmaProjectileSpeedMps=65.0]
   * @param {number} [options.angularLockThresholdDeg=4.0]
   */
  constructor(options = {}) {
    this.plasmaProjectileSpeedMps = options.plasmaProjectileSpeedMps || 65.0;
    this.angularLockThresholdDeg = options.angularLockThresholdDeg || 4.0;

    this.activeTargetId = null;
    this.isLeadLocked = false;
    this.lastComputedLeadPoint = { x: 0, y: 0, z: 0 };
    this.flightTimeSeconds = 0.0;
  }

  /**
   * Computes the exact 3D ballistic intercept lead point for a moving target.
   * r_lead = r_target + v_target * delta_t
   * @param {{x: number, y: number, z: number}} targetPos
   * @param {{x: number, y: number, z: number}} targetVel
   * @param {{x: number, y: number, z: number}} hunterPos
   * @param {number} [projectileSpeedMps]
   * @returns {Object} Calculated lead coordinates and flight time
   */
  computeLeadPoint(targetPos, targetVel, hunterPos, projectileSpeedMps = this.plasmaProjectileSpeedMps) {
    const dx = targetPos.x - hunterPos.x;
    const dy = targetPos.y - hunterPos.y;
    const dz = targetPos.z - hunterPos.z;
    const distanceM = Math.hypot(dx, dy, dz);

    // Initial flight time approximation
    let flightTime = distanceM / projectileSpeedMps;

    // Iterative refinement for fast target displacement
    const leadX = targetPos.x + targetVel.x * flightTime;
    const leadY = targetPos.y + targetVel.y * flightTime;
    const leadZ = targetPos.z + targetVel.z * flightTime;

    const refinedDist = Math.hypot(leadX - hunterPos.x, leadY - hunterPos.y, leadZ - hunterPos.z);
    flightTime = +(refinedDist / projectileSpeedMps).toFixed(3);

    this.flightTimeSeconds = flightTime;
    this.lastComputedLeadPoint = {
      x: +(targetPos.x + targetVel.x * flightTime).toFixed(2),
      y: +(targetPos.y + targetVel.y * flightTime).toFixed(2),
      z: +(targetPos.z + targetVel.z * flightTime).toFixed(2)
    };

    return {
      leadPoint: this.lastComputedLeadPoint,
      flightTimeSeconds: this.flightTimeSeconds,
      distanceMeters: +distanceM.toFixed(1)
    };
  }

  /**
   * Updates tracking on a specific entity and evaluates if crosshair is within lock tolerance.
   * @param {string} targetId
   * @param {{x: number, y: number, z: number}} targetPos
   * @param {{x: number, y: number, z: number}} targetVel
   * @param {{x: number, y: number, z: number}} hunterPos
   * @param {{x: number, y: number, z: number}} aimDirectionVector
   * @returns {Object} Tracking update
   */
  updateTargetTracking(targetId, targetPos, targetVel, hunterPos, aimDirectionVector = { x: 0, y: 0, z: 1 }) {
    this.activeTargetId = targetId;
    const leadResult = this.computeLeadPoint(targetPos, targetVel, hunterPos);

    // Compute angle between aim direction vector and vector towards lead point
    const toLeadX = leadResult.leadPoint.x - hunterPos.x;
    const toLeadY = leadResult.leadPoint.y - hunterPos.y;
    const toLeadZ = leadResult.leadPoint.z - hunterPos.z;
    const toLeadLen = Math.hypot(toLeadX, toLeadY, toLeadZ) || 1.0;

    const aimLen = Math.hypot(aimDirectionVector.x, aimDirectionVector.y, aimDirectionVector.z) || 1.0;

    const dotProduct = (toLeadX * aimDirectionVector.x + toLeadY * aimDirectionVector.y + toLeadZ * aimDirectionVector.z) / (toLeadLen * aimLen);
    const clampedDot = Math.max(-1.0, Math.min(1.0, dotProduct));
    const angularDeviationDeg = +(Math.acos(clampedDot) * (180 / Math.PI)).toFixed(1);

    this.isLeadLocked = angularDeviationDeg <= this.angularLockThresholdDeg;

    return {
      targetId,
      leadPoint: leadResult.leadPoint,
      flightTimeSeconds: leadResult.flightTimeSeconds,
      angularDeviationDeg,
      isLeadLocked: this.isLeadLocked
    };
  }

  /**
   * Generates HUD payload for rendering the `.plasma-lead-crosshair` component.
   * @returns {Object}
   */
  getCrosshairHudPayload() {
    return {
      activeTargetId: this.activeTargetId,
      leadPoint: { ...this.lastComputedLeadPoint },
      isLeadLocked: this.isLeadLocked,
      flightTimeSeconds: this.flightTimeSeconds,
      cssClass: this.isLeadLocked ? 'plasma-lead-crosshair lead-locked' : 'plasma-lead-crosshair',
      angularLockThresholdDeg: this.angularLockThresholdDeg
    };
  }
}
