/**
 * BouvetoyaGlacialChasmSnowBridgeSector.js
 * 
 * Alien vs. Predator (2004) - Bouvetoya Sub-Glacial Crevasse & Snow Bridge.
 * Simulates the 50-meter deep sub-glacial abyss: fragile packed snow bridge crossing,
 * weight-triggered collapse (>200 kg), emergency wrist grapple ice wall pick anchoring,
 * and razor-sharp falling ice stalactite hazards.
 */

export class BouvetoyaGlacialChasmSnowBridgeSector {
  /**
   * @param {Object} options
   * @param {string} [options.crevasseId='bouvet-glacial-chasm-01']
   * @param {number} [options.chasmDepthM=50.0]
   * @param {number} [options.snowBridgeMaxCapacityKg=220.0]
   * @param {number} [options.iceTemperatureC=-28.0]
   */
  constructor(options = {}) {
    this.crevasseId = options.crevasseId || 'bouvet-glacial-chasm-01';
    this.chasmDepthM = options.chasmDepthM || 50.0;
    this.snowBridgeMaxCapacityKg = options.snowBridgeMaxCapacityKg || 220.0;
    this.iceTemperatureC = options.iceTemperatureC || -28.0;

    this.snowBridgeCollapsed = false;
    this.grappleAnchoredToIce = false;
    this.fallingStalactitesCount = 4;
  }

  /**
   * Crosses the fragile snow bridge and tests load capacity.
   * Heavy Yautja armor (~150kg + 90kg body = 240kg) risks instant fracture unless moving softly.
   * @param {number} crossingLoadKg
   * @param {boolean} isSprintingHeavy
   * @returns {Object} Bridge crossing outcome
   */
  crossSnowBridge(crossingLoadKg = 240.0, isSprintingHeavy = false) {
    if (this.snowBridgeCollapsed) {
      return { crossed: false, reason: 'BRIDGE_ALREADY_COLLAPSED' };
    }

    const dynamicWeightMultiplier = isSprintingHeavy ? 1.35 : 1.0;
    const effectiveLoadKg = crossingLoadKg * dynamicWeightMultiplier;
    const triggersCollapse = effectiveLoadKg > this.snowBridgeMaxCapacityKg;

    if (triggersCollapse) {
      this.snowBridgeCollapsed = true;
    }

    return {
      crossingLoadKg,
      effectiveLoadKg,
      snowBridgeMaxCapacityKg: this.snowBridgeMaxCapacityKg,
      triggersCollapse,
      snowBridgeCollapsed: this.snowBridgeCollapsed,
      fallIntoChasmRisk: triggersCollapse,
      collapseRumbleDecibels: triggersCollapse ? 98 : 45
    };
  }

  /**
   * Fires the wrist grapple hook to anchor into the sheer blue hardpack ice wall during a fall.
   * @param {number} fallDistanceM
   * @returns {Object} Ice anchor outcome
   */
  anchorEmergencyIceGrapple(fallDistanceM = 8.5) {
    const iceAnchorHoldingForceN = 12000;
    const hunterMassKg = 160;
    const impactVelocityMps = Math.sqrt(2 * 9.81 * fallDistanceM);
    const arrestTensionN = Math.round(hunterMassKg * (9.81 + impactVelocityMps * 4.0));
    const holds = arrestTensionN < iceAnchorHoldingForceN;

    if (holds) {
      this.grappleAnchoredToIce = true;
    }

    return {
      success: holds,
      fallDistanceM,
      impactVelocityMps: +impactVelocityMps.toFixed(2),
      arrestTensionN,
      iceAnchorHoldingForceN,
      grappleAnchoredToIce: this.grappleAnchoredToIce,
      savedFromBottomlessFall: holds
    };
  }

  /**
   * Simulates a heavy ice stalactite detaching from the crevasse ceiling.
   * @param {number} stalactiteMassKg
   * @param {number} dropHeightM
   * @returns {Object} Stalactite impact telemetry
   */
  resolveStalactiteFallImpact(stalactiteMassKg = 120.0, dropHeightM = 22.0) {
    const impactVelocityMps = +(Math.sqrt(2 * 9.81 * dropHeightM)).toFixed(2);
    const impactKineticEnergyJoules = Math.round(0.5 * stalactiteMassKg * Math.pow(impactVelocityMps, 2)); // ~25898 J
    const piercingDamage = Math.round(impactKineticEnergyJoules * 0.012);

    return {
      stalactiteMassKg,
      dropHeightM,
      impactVelocityMps,
      impactKineticEnergyJoules,
      piercingDamage,
      brittleIceShatterRadiusM: 3.8,
      iceShatterCrashDecibels: 94
    };
  }
}
