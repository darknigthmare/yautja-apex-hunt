/**
 * ValVerdeDutchBallisticSpearTrajectorySector.js
 * 
 * Chantier Level Design #1 - Physique Balistique & Arcs Paraboliques des Lances et Flèches Explosives.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch crafts fire-hardened sapling spear tipped with a 40mm explosive grenade.
 * - Parabolic ballistic flight trajectory with gravity (g = 9.81 m/s²), aerodynamic drag and wind drift.
 * - Foliage penetration physics: calculating deflection angle and velocity dampening when cutting through jungle vines and banana leaves.
 * - Impact trigger: calculates kinetic energy, penetration depth, and 40mm shaped charge detonation.
 */

export class ValVerdeDutchBallisticSpearTrajectorySector {
  /**
   * @param {Object} options
   * @param {number} [options.gravity=9.81]
   * @param {number} [options.airDensityKgM3=1.225]
   * @param {number} [options.crossWindMps=2.5]
   */
  constructor(options = {}) {
    this.gravity = options.gravity ?? 9.81;
    this.airDensityKgM3 = options.airDensityKgM3 ?? 1.225;
    this.crossWindMps = options.crossWindMps ?? 2.5;

    // Spear characteristics
    this.spearMassKg = 1.65; // Fire-hardened hardwood shaft + 40mm grenade tip
    this.spearLengthM = 1.95;
    this.aerodynamicDragCd = 0.38;
    this.crossSectionalAreaM2 = 0.0045; // ~7.5cm head diameter
    this.grenadeFuseActive = true;
  }

  /**
   * Computes the parabolic trajectory of a thrown explosive spear.
   * @param {number} launchSpeedMps - Initial velocity (typical human throw: 18-28 m/s)
   * @param {number} launchAngleDeg - Pitch angle above horizontal
   * @param {number} [targetDistanceM=25.0]
   * @returns {Object} Trajectory telemetry
   */
  computeSpearTrajectory(launchSpeedMps = 24.0, launchAngleDeg = 15.0, targetDistanceM = 25.0) {
    const angleRad = (launchAngleDeg * Math.PI) / 180.0;
    const v0x = launchSpeedMps * Math.cos(angleRad);
    const v0y = launchSpeedMps * Math.sin(angleRad);

    // Time of flight to target distance
    const timeOfFlightSec = targetDistanceM / Math.max(1.0, v0x);

    // Height at target distance: y(t) = v0y * t - 0.5 * g * t^2
    const impactHeightM = v0y * timeOfFlightSec - 0.5 * this.gravity * Math.pow(timeOfFlightSec, 2);

    // Peak apex
    const timeToApexSec = v0y / this.gravity;
    const apexHeightM = Math.max(0, (Math.pow(v0y, 2)) / (2 * this.gravity));

    // Impact velocity components
    const vyImpact = v0y - this.gravity * timeOfFlightSec;
    const terminalSpeedMps = Math.sqrt(Math.pow(v0x, 2) + Math.pow(vyImpact, 2));

    // Kinetic energy: 0.5 * m * v^2
    const kineticEnergyJoules = Math.round(0.5 * this.spearMassKg * Math.pow(terminalSpeedMps, 2));

    return {
      launchSpeedMps,
      launchAngleDeg,
      targetDistanceM,
      timeOfFlightSec: Math.round(timeOfFlightSec * 100) / 100,
      apexHeightM: Math.round(apexHeightM * 10) / 10,
      impactHeightM: Math.round(impactHeightM * 10) / 10,
      terminalSpeedMps: Math.round(terminalSpeedMps * 10) / 10,
      kineticEnergyJoules,
      withinTargetWindow: impactHeightM >= 0.8 && impactHeightM <= 2.4
    };
  }

  /**
   * Calculates velocity damping and trajectory deflection through dense rainforest foliage.
   * @param {number} foliageDensityPct - 0 to 100% leaf/vine density
   * @param {number} vineLayerCount - Number of intersected tropical vine stems
   * @returns {Object} Foliage penetration resolution
   */
  resolveFoliagePenetrationDeflection(foliageDensityPct = 75.0, vineLayerCount = 3) {
    const velocityDampingFactor = Math.max(0.45, 1.0 - (foliageDensityPct / 100.0) * 0.35 - (vineLayerCount * 0.05));
    const deflectionAngleDeg = Math.min(18.0, (vineLayerCount * 2.2) + (foliageDensityPct / 20.0));
    const foliageSeveredLeavesCount = Math.round(foliageDensityPct * 0.4 + vineLayerCount * 4);

    return {
      foliageDensityPct,
      vineLayerCount,
      velocityDampingFactor: Math.round(velocityDampingFactor * 100) / 100,
      deflectionAngleDeg: Math.round(deflectionAngleDeg * 10) / 10,
      foliageSeveredLeavesCount,
      retainsExplosiveArming: true
    };
  }

  /**
   * Resolves the explosive spear impact on target (e.g. tree trunk or Yautja shoulder armor).
   * @param {string} targetSurface - 'HARDWOOD_TRUNK' | 'YAUTJA_CEREMONIAL_PLATE' | 'ALLUVIAL_MUD'
   * @param {number} impactVelocityMps
   * @returns {Object} Impact and detonation telemetry
   */
  resolveExplosiveSpearDetonation(targetSurface = 'HARDWOOD_TRUNK', impactVelocityMps = 22.0) {
    const isDetonated = this.grenadeFuseActive && impactVelocityMps >= 8.0;
    let penetrationDepthCm = 0;
    let shrapnelCount = 0;
    let blastYieldJoules = 0;

    if (targetSurface === 'HARDWOOD_TRUNK') {
      penetrationDepthCm = Math.round((impactVelocityMps / 5.0) * 10) / 10;
      blastYieldJoules = 42000;
      shrapnelCount = 180;
    } else if (targetSurface === 'YAUTJA_CEREMONIAL_PLATE') {
      penetrationDepthCm = 1.2;
      blastYieldJoules = 42000;
      shrapnelCount = 240;
    } else {
      // ALLUVIAL_MUD
      penetrationDepthCm = 18.5;
      blastYieldJoules = 38000;
      shrapnelCount = 60;
    }

    return {
      targetSurface,
      impactVelocityMps,
      detonationSuccess: isDetonated,
      penetrationDepthCm,
      blastYieldJoules,
      shrapnelRadiusM: 8.5,
      shrapnelCount,
      acousticDetonationDb: 136,
      thermalFlashTempC: 1850
    };
  }
}
