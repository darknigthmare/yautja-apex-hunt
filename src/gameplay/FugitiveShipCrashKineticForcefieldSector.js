/**
 * FugitiveShipCrashKineticForcefieldSector.js
 * 
 * The Predator (2018) - Crashed Fugitive Scout Ship & Kinetic Forcefield Perimeter.
 * Simulates the extraterrestrial vessel crash site in the forest:
 * - Biomechanical Yautja hull geometry with elevated observation ramparts at 16.0m
 * - Active spherical kinetic forcefield dome deflecting ballistic munitions and vaporizing light matter
 * - Four overloadable plasma power junction nodes controlling 90° forcefield quadrants
 * - High-speed grav-tether zip lines connecting ship hull to surrounding tree perches.
 */

export class FugitiveShipCrashKineticForcefieldSector {
  /**
   * @param {Object} options
   * @param {string} [options.crashSiteId='fugitive-ship-crash-01']
   * @param {number} [options.hullIntegrity=0.82]
   * @param {number} [options.forcefieldRadiusM=32.0]
   */
  constructor(options = {}) {
    this.crashSiteId = options.crashSiteId || 'fugitive-ship-crash-01';
    this.hullIntegrity = options.hullIntegrity || 0.82;
    this.forcefieldRadiusM = options.forcefieldRadiusM || 32.0;

    this.forcefieldQuadrants = [
      { id: 'quad-north', active: true, powerNodeIntegrity: 1.0, azimuthSpan: [0, 90] },
      { id: 'quad-east', active: true, powerNodeIntegrity: 1.0, azimuthSpan: [90, 180] },
      { id: 'quad-south', active: true, powerNodeIntegrity: 1.0, azimuthSpan: [180, 270] },
      { id: 'quad-west', active: true, powerNodeIntegrity: 1.0, azimuthSpan: [270, 360] }
    ];

    this.rampartElevationM = 16.0;
    this.gravTetherActive = true;
  }

  /**
   * Resolves a projectile or entity impact against an active forcefield quadrant.
   * Deflects ballistic projectiles with 100% kinetic reversal; vaporizes fragile objects.
   * @param {string} quadrantId
   * @param {string} incomingType - 'BALLISTIC_BULLET' or 'PLASMA_BOLT' or 'PLAYER_BODY'
   * @param {number} impactVelocityMps
   * @returns {Object} Forcefield impact telemetry
   */
  resolveForcefieldBarrierImpact(quadrantId = 'quad-north', incomingType = 'BALLISTIC_BULLET', impactVelocityMps = 890.0) {
    const quad = this.forcefieldQuadrants.find(q => q.id === quadrantId);
    if (!quad || !quad.active) {
      return { penetrated: true, reason: 'QUADRANT_DEACTIVATED_OR_ABSENT' };
    }

    if (incomingType === 'BALLISTIC_BULLET') {
      const ricochetVelocityMps = Number((impactVelocityMps * 0.92).toFixed(1));
      return {
        penetrated: false,
        quadrantId: quad.id,
        action: 'KINETIC_DEFLECTION',
        ricochetVelocityMps,
        harmonicDischargeDb: 88,
        plasmaFlashColor: '#00e5ff'
      };
    } else if (incomingType === 'PLAYER_BODY') {
      const repulsionForceN = 5400.0;
      const electroKineticShockDamage = 75;
      return {
        penetrated: false,
        quadrantId: quad.id,
        action: 'BIOMECHANICAL_REPULSION',
        repulsionForceN,
        electroKineticShockDamage,
        knockbackDistanceM: 5.2
      };
    } else {
      // High-energy plasma can stress the node
      quad.powerNodeIntegrity = Math.max(0, quad.powerNodeIntegrity - 0.35);
      return {
        penetrated: false,
        quadrantId: quad.id,
        action: 'PLASMA_ENERGY_ABSORPTION',
        powerNodeIntegrityRemaining: Number(quad.powerNodeIntegrity.toFixed(2)),
        thermalStressWarning: quad.powerNodeIntegrity < 0.4
      };
    }
  }

  /**
   * Strikes a power junction node to disable an entire quadrant of the protective dome.
   * @param {string} quadrantId
   * @param {number} damage
   * @returns {Object} Node overload telemetry
   */
  overloadPowerJunctionNode(quadrantId = 'quad-north', damage = 120) {
    const quad = this.forcefieldQuadrants.find(q => q.id === quadrantId);
    if (!quad) {
      return { success: false, reason: 'QUADRANT_NOT_FOUND' };
    }

    quad.powerNodeIntegrity = Math.max(0, quad.powerNodeIntegrity - (damage / 100.0));
    if (quad.powerNodeIntegrity <= 0) {
      quad.active = false;
    }

    return {
      success: true,
      quadrantId: quad.id,
      powerNodeIntegrity: Number(quad.powerNodeIntegrity.toFixed(2)),
      quadrantDisabled: !quad.active,
      empSparksBurstRadiusM: 3.8,
      breachAzimuthRange: quad.azimuthSpan
    };
  }
}
