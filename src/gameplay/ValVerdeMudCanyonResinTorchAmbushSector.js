/**
 * ValVerdeMudCanyonResinTorchAmbushSector.js
 * 
 * Predator (1987) - Val Verde deep mud canyon ambush sector.
 * Simulates Dutch's tactical trap network: pine resin thermal torches blinding infrared optics,
 * mud camouflage coating ablation rates, swinging log deadfall traps, and viscous mud movement drag.
 */

export class ValVerdeMudCanyonResinTorchAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.canyonId='val-verde-mud-canyon-01']
   * @param {number} [options.torchCount=6]
   * @param {number} [options.mudDepthMeters=0.45]
   * @param {number} [options.trapRiggingIntegrity=1.0]
   */
  constructor(options = {}) {
    this.canyonId = options.canyonId || 'val-verde-mud-canyon-01';
    this.torchCount = options.torchCount !== undefined ? options.torchCount : 6;
    this.mudDepthMeters = options.mudDepthMeters !== undefined ? options.mudDepthMeters : 0.45;
    this.trapRiggingIntegrity = options.trapRiggingIntegrity !== undefined ? options.trapRiggingIntegrity : 1.0;

    this.torchesLit = new Array(this.torchCount).fill(false);
    this.deadfallTriggered = false;
    this.mudCamouflageLayerMm = 3.5; // Initial mud coating thickness
  }

  /**
   * Ignites specific resin torches to saturate Predator thermal optics.
   * @param {Array<number>} torchIndices
   * @returns {Object} Torch flaring status
   */
  lightResinTorches(torchIndices = [0, 1, 2]) {
    for (const idx of torchIndices) {
      if (idx >= 0 && idx < this.torchCount) {
        this.torchesLit[idx] = true;
      }
    }

    const activeCount = this.torchesLit.filter(Boolean).length;
    // Each lit torch burns at ~650 C (923 K), saturating thermal visor
    const thermalSaturationLevel = +(Math.min(1.0, (activeCount * 0.18))).toFixed(2);
    const visionDisruption = activeCount >= 4;

    return {
      activeTorchesCount: activeCount,
      totalTorches: this.torchCount,
      resinBurnTempCelsius: 650,
      thermalSaturationLevel,
      visionDisruption
    };
  }

  /**
   * Calculates mud coating wash-off and ablation over time.
   * Mud hides body heat from thermal sensors until washed off.
   * @param {number} movementSpeedMps
   * @param {boolean} rainActive
   * @param {number} deltaSeconds
   * @returns {Object} Mud camouflage status
   */
  calculateMudAblation(movementSpeedMps = 3.0, rainActive = false, deltaSeconds = 1.0) {
    if (this.mudCamouflageLayerMm <= 0) {
      return {
        mudCamouflageLayerMm: 0,
        thermalCamouflageEffective: false,
        heatLeakPercentage: 100
      };
    }

    const movementFrictionRate = 0.05 * (movementSpeedMps / 4.0);
    const rainWashRate = rainActive ? 0.35 : 0.02;
    const totalAblation = (movementFrictionRate + rainWashRate) * deltaSeconds;

    this.mudCamouflageLayerMm = Math.max(0, +(this.mudCamouflageLayerMm - totalAblation).toFixed(3));
    const thermalCamouflageEffective = this.mudCamouflageLayerMm >= 0.8;
    const heatLeakPercentage = Math.round((1 - Math.min(1.0, this.mudCamouflageLayerMm / 3.0)) * 100);

    return {
      mudCamouflageLayerMm: this.mudCamouflageLayerMm,
      thermalCamouflageEffective,
      heatLeakPercentage
    };
  }

  /**
   * Triggers the swinging tree log deadfall trap.
   * @param {number} triggerDistanceM - Distance between entity and tripwire
   * @returns {Object} Trap kinetic outcome
   */
  triggerDeadfallTrap(triggerDistanceM = 2.0) {
    if (this.deadfallTriggered) {
      return { success: false, reason: 'TRAP_ALREADY_SPENT' };
    }

    this.deadfallTriggered = true;
    const logMassKg = 420;
    const swingVelocityMps = 14.5;
    const kineticImpactJoules = Math.round(0.5 * logMassKg * Math.pow(swingVelocityMps, 2)); // ~44 kJ
    const dodgeWindowMs = Math.round(Math.max(150, 480 - triggerDistanceM * 80));

    return {
      success: true,
      deadfallTriggered: true,
      logMassKg,
      swingVelocityMps,
      kineticImpactJoules,
      dodgeWindowMs,
      lethalToHuman: true
    };
  }

  /**
   * Computes ground speed deceleration from viscous canyon mud.
   * @param {number} entitySpeedMps
   * @returns {Object} Mud drag and effective speed
   */
  computeMudViscosityDrag(entitySpeedMps = 6.0) {
    const depthFactor = Math.min(1.0, this.mudDepthMeters / 0.6); // 0.45m mud is knee-deep
    const dragMultiplier = +(0.45 + (1 - depthFactor) * 0.55).toFixed(2);
    const effectiveSpeedMps = +(entitySpeedMps * dragMultiplier).toFixed(2);
    const splashAcousticDb = Math.round(45 + entitySpeedMps * 4.2);

    return {
      mudDepthMeters: this.mudDepthMeters,
      dragMultiplier,
      effectiveSpeedMps,
      splashAcousticDb
    };
  }

  /**
   * Returns complete state of the ambush sector.
   * @returns {Object}
   */
  getAmbushSectorState() {
    return {
      canyonId: this.canyonId,
      torchCount: this.torchCount,
      torchesLit: [...this.torchesLit],
      mudDepthMeters: this.mudDepthMeters,
      mudCamouflageLayerMm: this.mudCamouflageLayerMm,
      deadfallTriggered: this.deadfallTriggered,
      trapRiggingIntegrity: this.trapRiggingIntegrity
    };
  }
}
