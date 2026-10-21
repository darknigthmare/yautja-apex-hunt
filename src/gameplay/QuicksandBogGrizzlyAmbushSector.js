/**
 * QuicksandBogGrizzlyAmbushSector.js
 * 
 * Prey (2022) - Great Plains Quicksand Peat Bog & Grizzly Bear Clash.
 * Simulates the treacherous non-Newtonian silt mud bog:
 * 2.0m depth, exponential sinking dynamics if stationary > 2.5s, suction pull requiring
 * composite shield flotation anchor to break surface tension, and a savage duel against a 520kg Grizzly.
 */

export class QuicksandBogGrizzlyAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.bogId='comanche-quicksand-bog-01']
   * @param {number} [options.bogDepthM=2.0]
   * @param {number} [options.slurryViscosityPas=145.0]
   */
  constructor(options = {}) {
    this.bogId = options.bogId || 'comanche-quicksand-bog-01';
    this.bogDepthM = options.bogDepthM || 2.0;
    this.slurryViscosityPas = options.slurryViscosityPas || 145.0;

    this.currentSubmersionDepthM = 0.0;
    this.stationaryTimeSec = 0.0;
    this.grizzlyHealth = 650;
    this.grizzlyEnraged = false;
  }

  /**
   * Updates quicksand sinking dynamics based on delta time and hunter movement state.
   * @param {number} deltaSec
   * @param {boolean} isMoving
   * @returns {Object} Sinking status
   */
  updateQuicksandSinking(deltaSec = 0.5, isMoving = false) {
    if (!isMoving) {
      this.stationaryTimeSec += deltaSec;
      if (this.stationaryTimeSec > 2.0) {
        const sinkRateMps = 0.14 * (1.0 + this.currentSubmersionDepthM / this.bogDepthM);
        this.currentSubmersionDepthM = Math.min(this.bogDepthM, this.currentSubmersionDepthM + sinkRateMps * deltaSec);
      }
    } else {
      this.stationaryTimeSec = Math.max(0, this.stationaryTimeSec - deltaSec * 1.5);
      // Moving slowly drags against suction
      const dragSinkMps = 0.04;
      this.currentSubmersionDepthM = Math.min(this.bogDepthM, this.currentSubmersionDepthM + dragSinkMps * deltaSec);
    }

    const suctionForceN = Math.round(this.currentSubmersionDepthM * 1850.0);
    const speedMultiplier = Math.max(0.12, 1.0 - (this.currentSubmersionDepthM / this.bogDepthM) * 0.88);
    const suffocationRisk = this.currentSubmersionDepthM >= 1.7;

    return {
      submersionDepthM: Number(this.currentSubmersionDepthM.toFixed(3)),
      suctionForceN,
      speedMultiplier: Number(speedMultiplier.toFixed(2)),
      suffocationRisk,
      stationaryTimeSec: Number(this.stationaryTimeSec.toFixed(2))
    };
  }

  /**
   * Uses the retractable arm shield as a wide flotation pad to push against the silt and extricate the hunter.
   * @param {number} shieldAreaM2
   * @returns {Object} Shield vault extrication telemetry
   */
  deployShieldFlotationExtrication(shieldAreaM2 = 1.6) {
    if (this.currentSubmersionDepthM <= 0.05) {
      return { success: false, reason: 'NOT_SUBMERGED_ENOUGH' };
    }

    const buoyancyForceN = shieldAreaM2 * 2400.0;
    const depthExtricatedM = Math.min(this.currentSubmersionDepthM, 0.95);
    this.currentSubmersionDepthM -= depthExtricatedM;
    this.stationaryTimeSec = 0.0;

    return {
      success: true,
      buoyancyForceN,
      depthExtricatedM: Number(depthExtricatedM.toFixed(2)),
      remainingSubmersionM: Number(this.currentSubmersionDepthM.toFixed(2)),
      staminaCost: 30,
      surfaceTensionBroken: true
    };
  }

  /**
   * Resolves a massive charging swipe or bite from the 520kg Grizzly.
   * @param {number} distanceM
   * @returns {Object} Grizzly attack resolution
   */
  resolveGrizzlyChargeAttack(distanceM = 2.0) {
    const grizzlyMassKg = 520.0;
    const chargeVelocityMps = 12.5; // ~45 km/h
    const kineticEnergyJ = 0.5 * grizzlyMassKg * chargeVelocityMps * chargeVelocityMps;
    const jawPressurePsi = 1200.0;
    const swipeDamage = 135;

    if (this.grizzlyHealth < 300) {
      this.grizzlyEnraged = true;
    }

    return {
      chargeSuccess: distanceM <= 3.5,
      grizzlyMassKg,
      kineticEnergyJ: Math.round(kineticEnergyJ),
      jawPressurePsi,
      swipeDamage: this.grizzlyEnraged ? Math.round(swipeDamage * 1.35) : swipeDamage,
      knockdownDurationSec: 1.8,
      grizzlyEnraged: this.grizzlyEnraged
    };
  }
}
