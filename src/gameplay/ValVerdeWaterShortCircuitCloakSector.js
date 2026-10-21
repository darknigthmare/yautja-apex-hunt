/**
 * ValVerdeWaterShortCircuitCloakSector.js
 * 
 * Chantier Level Design #3 - Court-Circuit Aquatique & Défaillance du Camouflage Optique Yautja.
 * Canonical 1:1 Predator (1987) fidelity:
 * - When the Jungle Hunter wades, falls, or splashes into river water, the optical cloaking field suffers dielectric breakdown.
 * - Violent electrical arcing (15 kV micro-arcs, 3200 K blue/violet plasma sparks).
 * - Multi-phase failure transition:
 *   1. OPTICAL_BENDING_ACTIVE (100% camouflage)
 *   2. WATER_CONTACT_SHORT_CIRCUIT (severe distortion, sparkling discharges)
 *   3. DIELECTRIC_FAILURE_FLICKER (intermittent reveal)
 *   4. FULL_PHYSICAL_REVEAL (cloak forced offline)
 * - Capacitor cooldown and drying timer (15s) required before cloaking can be reactivated.
 */

export class ValVerdeWaterShortCircuitCloakSector {
  /**
   * @param {Object} options
   * @param {number} [options.waterConductivityUsCm=450.0] - Freshwater tropical river conductivity
   * @param {number} [options.arcVoltageKv=15.0]
   */
  constructor(options = {}) {
    this.waterConductivityUsCm = options.waterConductivityUsCm ?? 450.0;
    this.arcVoltageKv = options.arcVoltageKv ?? 15.0;

    this.cloakState = 'OPTICAL_BENDING_ACTIVE';
    this.cloakEfficiencyPct = 100.0;
    this.sparkArcsCount = 0;
    this.rechargeTimerSec = 0;
  }

  /**
   * Simulates water immersion or torrential splash on the active cloaking matrix.
   * @param {number} waterDepthM - Depth of water contact (m)
   * @param {number} splashFlowLps - Rate of splashing water (liters per second)
   * @returns {Object} Electrical short-circuit telemetry
   */
  triggerWaterShortCircuit(waterDepthM = 0.4, splashFlowLps = 18.0) {
    if (waterDepthM >= 0.15 || splashFlowLps >= 10.0) {
      this.cloakState = 'WATER_CONTACT_SHORT_CIRCUIT';
      this.sparkArcsCount = Math.round(splashFlowLps * 1.8 + waterDepthM * 20);
      this.cloakEfficiencyPct = Math.max(0, 100.0 - (waterDepthM * 180 + splashFlowLps * 3.5));
      this.cloakEfficiencyPct = Math.round(this.cloakEfficiencyPct * 10) / 10;
      this.rechargeTimerSec = 15.0; // 15-second capacitor recharge & drying period

      const forcedOffline = this.cloakEfficiencyPct <= 15.0;
      if (forcedOffline) {
        this.cloakState = 'FULL_PHYSICAL_REVEAL';
        this.cloakEfficiencyPct = 0;
      }

      return {
        shortCircuitTriggered: true,
        cloakState: this.cloakState,
        cloakEfficiencyPct: this.cloakEfficiencyPct,
        sparkArcsCount: this.sparkArcsCount,
        arcVoltageKv: this.arcVoltageKv,
        sparkColor: '#00d4ff', // Cyan-blue high voltage plasma
        sparkAcousticSizzleDb: 82,
        visibleToHumanNakedEye: true,
        forcedOffline,
        rechargeTimerSec: this.rechargeTimerSec
      };
    }

    return {
      shortCircuitTriggered: false,
      cloakState: this.cloakState,
      cloakEfficiencyPct: this.cloakEfficiencyPct,
      sparkArcsCount: 0,
      visibleToHumanNakedEye: false
    };
  }

  /**
   * Updates drying and capacitor re-arm timer.
   * @param {number} deltaSeconds
   * @returns {Object} Reboot status
   */
  updateCloakRebootCycle(deltaSeconds = 5.0) {
    if (this.rechargeTimerSec > 0) {
      this.rechargeTimerSec = Math.max(0, Math.round((this.rechargeTimerSec - deltaSeconds) * 10) / 10);
      if (this.rechargeTimerSec === 0) {
        this.cloakState = 'OPTICAL_BENDING_ACTIVE';
        this.cloakEfficiencyPct = 100.0;
        return {
          rebootComplete: true,
          cloakState: this.cloakState,
          cloakEfficiencyPct: 100.0,
          readyToEngage: true
        };
      }

      return {
        rebootComplete: false,
        cloakState: this.cloakState,
        remainingRechargeSec: this.rechargeTimerSec,
        readyToEngage: false
      };
    }

    return {
      rebootComplete: true,
      cloakState: this.cloakState,
      readyToEngage: true
    };
  }
}
