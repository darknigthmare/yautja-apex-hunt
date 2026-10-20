/**
 * BisonPlainsBarbedArrowFeralShieldSector.js
 * 
 * Prey (2022) - Northern Great Plains Golden Prairie & Bison Stampede.
 * Simulates open grassland combat: bison herd stampede ground tremors (13.5 m/s),
 * Comanche triple-barbed obsidian recurve arrows, and the Feral Predator's
 * retractable fan-blade shield deflecting horn charges and projectiles.
 */

export class BisonPlainsBarbedArrowFeralShieldSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='bison-plains-prairie-01']
   * @param {number} [options.tallGrassHeightM=1.6]
   * @param {number} [options.bisonHerdCount=25]
   * @param {number} [options.windSpeedMps=6.2]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'bison-plains-prairie-01';
    this.tallGrassHeightM = options.tallGrassHeightM || 1.6;
    this.bisonHerdCount = options.bisonHerdCount || 25;
    this.windSpeedMps = options.windSpeedMps || 6.2;

    this.stampedeActive = false;
    this.feralFanShieldExpanded = false;
  }

  /**
   * Triggers a stampede across the prairie grassland.
   * @param {number} panicSeverity - 0.0 to 1.0
   * @returns {Object} Stampede telemetry
   */
  triggerBisonStampede(panicSeverity = 0.8) {
    this.stampedeActive = true;
    const herdVelocityMps = +(11.0 + panicSeverity * 4.5).toFixed(1); // up to 15.5 m/s
    const seismicTremorAmplitude = +(panicSeverity * 3.2).toFixed(2);
    const audioRumbleDecibels = Math.round(86 + panicSeverity * 12);

    return {
      stampedeActive: true,
      bisonHerdCount: this.bisonHerdCount,
      herdVelocityMps,
      seismicTremorAmplitude,
      audioRumbleDecibels,
      dustCloudRadiusM: 45.0,
      trampleHazardDamage: 180
    };
  }

  /**
   * Expands the Feral Predator's bone-and-metal fan shield to block charging hazards.
   * @param {boolean} expand
   * @returns {Object} Shield deployment telemetry
   */
  toggleFeralFanShield(expand = true) {
    this.feralFanShieldExpanded = Boolean(expand);

    return {
      feralFanShieldExpanded: this.feralFanShieldExpanded,
      coverageArcDeg: this.feralFanShieldExpanded ? 180 : 0,
      deployTimeSec: 0.15,
      kineticImpactThresholdJoules: 14000,
      retractablePalesCount: 8
    };
  }

  /**
   * Resolves a projectile or charging bison striking the deployed fan shield.
   * @param {string} attackType - 'TRIPLE_BARBED_ARROW' or 'CHARGING_BULL_BISON'
   * @param {number} incomingKineticEnergyJoules
   * @returns {Object} Collision deflection outcome
   */
  resolveShieldDeflection(attackType = 'TRIPLE_BARBED_ARROW', incomingKineticEnergyJoules = 450) {
    if (!this.feralFanShieldExpanded) {
      return {
        deflected: false,
        damageTaken: Math.round(incomingKineticEnergyJoules * 0.4),
        shieldIntegrityLost: 0.0
      };
    }

    const isBisonCharge = attackType === 'CHARGING_BULL_BISON';
    const deflectionSparksLumens = isBisonCharge ? 18000 : 3500;
    const recoilPushbackM = isBisonCharge ? 1.2 : 0.05;

    return {
      deflected: true,
      attackType,
      incomingKineticEnergyJoules,
      damageTaken: 0,
      recoilPushbackM,
      deflectionSparksLumens,
      projectileRicochetAngleDeg: Math.round(25 + Math.random() * 40)
    };
  }

  /**
   * Evaluates tall grass concealment when crouched.
   * @param {boolean} isCrouched
   * @returns {Object} Stealth rating
   */
  evaluateGrassConcealment(isCrouched = true) {
    const concealmentRatio = isCrouched ? 0.88 : 0.25;

    return {
      isCrouched,
      tallGrassHeightM: this.tallGrassHeightM,
      concealmentRatio,
      visualDetectionRangeM: +(25.0 * (1.0 - concealmentRatio)).toFixed(1),
      windSwayMasksMovement: this.windSpeedMps > 4.0
    };
  }
}
