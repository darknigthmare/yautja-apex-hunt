/**
 * Prey1719ComancheQuicksandBogSector.js
 * 
 * Chantier Level Design #6 - Tourbière Mouvante des Comanches & Camouflage de Boue Glacée.
 * Canonical 1:1 Prey (2022 / 1719) fidelity:
 * - 1719 Northern Great Plains / Comanche tribal hunting lands.
 * - Deep non-Newtonian quicksand mud pit surrounded by beaver dams, bulrushes, and tangled willow roots.
 * - Sinking mechanics:
 *   - Mud viscosity: 160 Pa·s. Heavy struggles increase downward sinking velocity exponentially.
 *   - Naru uses a tethered tomahawk rope to haul herself out of the bog.
 * - Cold mud immersion:
 *   - Orange river mud (10 °C) coats the hunter's skin.
 *   - Drops surface body temperature below ambient air, rendering the wearer 100% invisible to the
 *     Feral Predator's bone-mask infrared vision.
 * - Deceptive bog baiting: Naru lures the massive 195 kg Feral Predator onto the thin crust of the bog,
 *   causing him to sink to waist depth and trapping his leg locomotion.
 */

export class Prey1719ComancheQuicksandBogSector {
  /**
   * @param {Object} options
   * @param {number} [options.bogViscosityPaS=160.0]
   */
  constructor(options = {}) {
    this.bogViscosityPaS = options.bogViscosityPaS ?? 160.0;
    this.naruMudCoated = false;
    this.feralPredatorBogged = false;
    this.ropeTetherDeployed = false;
  }

  /**
   * Evaluates sinking depth inside the non-Newtonian quicksand pit.
   * @param {number} victimMassKg - Mass of person/creature (kg)
   * @param {number} struggleIntensity - Struggle factor (0 to 1)
   * @returns {Object} Sinking dynamics telemetry
   */
  calculateQuicksandSinking(victimMassKg = 60.0, struggleIntensity = 0.5) {
    const sinkRateMps = (victimMassKg / 100.0) * (0.04 + struggleIntensity * 0.08);
    const sinkDepthM = Math.min(2.2, Math.round(sinkRateMps * 12.0 * 100) / 100);

    return {
      success: true,
      victimMassKg,
      struggleIntensity,
      bogViscosityPaS: this.bogViscosityPaS,
      sinkRateMps: Math.round(sinkRateMps * 1000) / 1000,
      sinkDepthM,
      viscousGurgleAcousticDb: 58,
      submersionRiskCritical: sinkDepthM >= 1.5
    };
  }

  /**
   * Naru applies cold river mud to drop body temperature and achieve thermal invisibility.
   * @param {number} coveragePct - Mud coverage (0 - 100%)
   * @returns {Object} Mud camouflage telemetry
   */
  applyColdRiverMudCamouflage(coveragePct = 95.0) {
    this.naruMudCoated = coveragePct >= 80.0;

    return {
      success: true,
      coveragePct,
      mudTemperatureC: 10.0,
      skinSurfaceTempC: 11.5,
      boneMaskInfraredDetectionPct: this.naruMudCoated ? 0.0 : 85.0,
      naruMudCoated: this.naruMudCoated,
      thermalCloakingActive: this.naruMudCoated
    };
  }

  /**
   * Lures the heavy Feral Predator into the quicksand crust, trapping him to waist depth.
   * @returns {Object} Bog trap telemetry
   */
  trapFeralPredatorInQuicksand() {
    this.feralPredatorBogged = true;

    return {
      success: true,
      feralPredatorBogged: true,
      feralMassKg: 195.0,
      trappedDepthM: 1.1,
      locomotionImmobilizedPct: 85.0,
      viscousMudSuctionForceN: 4200.0,
      feralFrustrationRoarDb: 106,
      readyForDecisiveCounterAttack: true
    };
  }
}
