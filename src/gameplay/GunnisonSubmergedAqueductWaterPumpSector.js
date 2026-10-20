/**
 * GunnisonSubmergedAqueductWaterPumpSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison, Colorado municipal drainage & aqueduct sector.
 * Simulates submerged water turbine dynamics, hydraulic floodgate pressure seals, flow currents,
 * electrical failure hazards, and hydrodynamic drag for aquatic combat encounters.
 */

export class GunnisonSubmergedAqueductWaterPumpSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='gunnison-aqueduct-01']
   * @param {number} [options.waterDepthMeters=3.8]
   * @param {number} [options.flowVelocityMps=2.4]
   * @param {boolean} [options.drainageValveLocked=true]
   * @param {boolean} [options.turbineOperational=true]
   * @param {number} [options.floodgateSealIntegrity=1.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'gunnison-aqueduct-01';
    this.waterDepthMeters = options.waterDepthMeters !== undefined ? options.waterDepthMeters : 3.8;
    this.flowVelocityMps = options.flowVelocityMps !== undefined ? options.flowVelocityMps : 2.4;
    this.drainageValveLocked = options.drainageValveLocked !== undefined ? options.drainageValveLocked : true;
    this.turbineOperational = options.turbineOperational !== undefined ? options.turbineOperational : true;
    this.floodgateSealIntegrity = options.floodgateSealIntegrity !== undefined ? options.floodgateSealIntegrity : 1.0;
    
    this.turbineRpm = this.turbineOperational ? 320 : 0;
    this.electricalShortCircuitActive = false;
    this.waterConductivityMsCm = 0.85; // brackish municipal storm runoff
    this.waterDensityKgM3 = 1000.0;
  }

  /**
   * Cycles turbine pump RPM and evaluates cavitation risk.
   * @param {number} powerSurgePercentage - Surge percentage (-100 to +100)
   * @returns {Object} Turbine telemetry
   */
  cyclePumpTurbine(powerSurgePercentage = 0) {
    if (!this.turbineOperational) {
      this.turbineRpm = 0;
      this.flowVelocityMps = Math.max(0.2, this.flowVelocityMps * 0.9);
      return {
        operational: false,
        turbineRpm: 0,
        flowVelocityMps: +this.flowVelocityMps.toFixed(2),
        cavitationOccurring: false
      };
    }

    const baseRpm = 320;
    this.turbineRpm = Math.max(0, Math.min(650, Math.round(baseRpm * (1 + powerSurgePercentage / 100))));
    this.flowVelocityMps = +(1.2 + (this.turbineRpm / 650) * 3.6).toFixed(2);
    const cavitationOccurring = this.turbineRpm > 500;

    if (this.turbineRpm > 580) {
      this.floodgateSealIntegrity = Math.max(0, +(this.floodgateSealIntegrity - 0.05).toFixed(2));
      if (this.floodgateSealIntegrity < 0.3) {
        this.electricalShortCircuitActive = true;
      }
    }

    return {
      operational: true,
      turbineRpm: this.turbineRpm,
      flowVelocityMps: this.flowVelocityMps,
      cavitationOccurring,
      floodgateSealIntegrity: this.floodgateSealIntegrity
    };
  }

  /**
   * Overrides drainage valve lock using Yautja wristpad decrypter.
   * @param {string} wristpadSecurityCode - Decryption sequence
   * @returns {Object} Drainage result
   */
  overrideDrainageValve(wristpadSecurityCode) {
    const validCodes = ['YAUTJA-GUNNISON-PUMP-DRAIN', 'OMEGA-VALVE-774', 'OVERRIDE-AQUEDUCT-SIGMA'];
    const success = validCodes.includes(wristpadSecurityCode) || (typeof wristpadSecurityCode === 'string' && wristpadSecurityCode.startsWith('OVERRIDE-'));

    if (success) {
      this.drainageValveLocked = false;
      const drainedMeters = Math.min(2.2, this.waterDepthMeters - 0.6);
      this.waterDepthMeters = +(this.waterDepthMeters - drainedMeters).toFixed(2);
      this.flowVelocityMps = Math.max(0.5, +(this.flowVelocityMps * 0.5).toFixed(2));
      return {
        success: true,
        drainageValveLocked: false,
        waterDepthMeters: this.waterDepthMeters,
        drainedAmountMeters: +drainedMeters.toFixed(2),
        evacuationHatchAccessible: this.waterDepthMeters <= 1.8
      };
    }

    return {
      success: false,
      drainageValveLocked: true,
      waterDepthMeters: this.waterDepthMeters,
      drainedAmountMeters: 0,
      evacuationHatchAccessible: false
    };
  }

  /**
   * Calculates hydrodynamic drag force on an entity.
   * F_d = 0.5 * rho * v^2 * C_d * A
   * @param {number} entityMassKg
   * @param {number} relativeVelocityMps
   * @param {boolean} isSubmerged
   * @returns {Object} Drag calculations
   */
  calculateUnderwaterDrag(entityMassKg, relativeVelocityMps, isSubmerged) {
    if (!isSubmerged) {
      return {
        dragForceNewtons: 0,
        speedPenaltyFactor: 1.0,
        submerged: false
      };
    }

    const frontalAreaM2 = Math.min(1.4, Math.max(0.4, (entityMassKg / 160) * 0.85));
    const dragCoefficient = 0.82; // Bluff body in turbulent water
    const effectiveSpeed = Math.abs(relativeVelocityMps) + this.flowVelocityMps * 0.4;
    const dragForceNewtons = +(0.5 * this.waterDensityKgM3 * Math.pow(effectiveSpeed, 2) * dragCoefficient * frontalAreaM2).toFixed(1);

    // Speed penalty factor: fraction between 0.25 (heavy drag) and 0.85 (light drag)
    const speedPenaltyFactor = +(Math.max(0.25, 1.0 - (dragForceNewtons / (entityMassKg * 9.81 * 0.6)))).toFixed(2);

    return {
      dragForceNewtons,
      speedPenaltyFactor,
      submerged: true,
      frontalAreaM2: +frontalAreaM2.toFixed(2)
    };
  }

  /**
   * Evaluates electrical hazard in flooded waters when conduits rupture.
   * @param {number} conduitDamagePercentage - 0 to 100
   * @param {boolean} wristbladeExtended - Metallic conductor check
   * @returns {Object} Hazard status and shock damage
   */
  evaluateTurbineElectricalHazard(conduitDamagePercentage = 0, wristbladeExtended = false) {
    const isElectrified = this.electricalShortCircuitActive || conduitDamagePercentage > 45;
    if (!isElectrified || this.waterDepthMeters < 0.5) {
      return {
        electrified: false,
        shockDamagePerSec: 0,
        conductiveArcRisk: false
      };
    }

    const baseVoltage = 480; // 480V industrial 3-phase pump power
    const waterDissipationFactor = Math.max(0.2, 1.0 - (this.waterDepthMeters / 6.0));
    const conductivityBonus = wristbladeExtended ? 1.6 : 1.0;
    const shockDamagePerSec = Math.round(35 * waterDissipationFactor * conductivityBonus * (conduitDamagePercentage / 100));

    return {
      electrified: true,
      voltage: baseVoltage,
      shockDamagePerSec,
      conductiveArcRisk: wristbladeExtended && conduitDamagePercentage > 70
    };
  }

  /**
   * Returns current sector diagnostics.
   * @returns {Object}
   */
  getSectorDiagnostics() {
    return {
      sectorId: this.sectorId,
      waterDepthMeters: this.waterDepthMeters,
      flowVelocityMps: this.flowVelocityMps,
      drainageValveLocked: this.drainageValveLocked,
      turbineOperational: this.turbineOperational,
      turbineRpm: this.turbineRpm,
      floodgateSealIntegrity: this.floodgateSealIntegrity,
      electricalShortCircuitActive: this.electricalShortCircuitActive
    };
  }
}
