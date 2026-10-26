/**
 * ThePredator2018SwampMudClimaxShowdownSector.js
 *
 * Chantier de Level Design 5 (v188) - The Predator (2018) Swamp Basin Climax & Severed Arm Plasmacaster Showdown
 * 1:1 Canonical Level Design:
 * - Murky Pacific Northwest swamp basin and peat bog terrain.
 * - Thermal mud masking application breaking the melanistic Upgrade Predator's retinal optic scanning.
 * - Upgrade Predator's ejectable wrist-blade harpoon attack and tether mechanics.
 * - Dismemberment of the Upgrade Predator's arm and utilizing the severed wrist gauntlet/plasmacaster to deliver the coup de grâce.
 */

export class ThePredator2018SwampMudClimaxShowdownSector {
  /**
   * @param {Object} options
   * @param {number} [options.swampWaterDepthM=0.85] Profondeur de l'eau marécageuse
   * @param {number} [options.upgradePredatorHealth=1200.0] Points de vie de l'Upgrade Predator
   */
  constructor(options = {}) {
    this.swampWaterDepthM = options.swampWaterDepthM ?? 0.85;
    this.upgradePredatorHealth = options.upgradePredatorHealth ?? 1200.0;

    // État runtime
    this.mudThermalMaskingActive = false;
    this.mudMaskEfficiency = 0.0;
    this.wristBladeHarpoonDodged = false;
    this.upgradePredatorChitinArmSevered = false;
    this.severedArmPlasmacasterFired = false;
    this.quinnFinalStrikeLethal = false;
  }

  /**
   * S'enduire de boue marécageuse pour masquer son empreinte thermique
   * @param {number} coverageRatio Taux de couverture de boue (0.0 à 1.0)
   */
  coatInSwampMud(coverageRatio = 0.92) {
    this.mudThermalMaskingActive = true;
    this.mudMaskEfficiency = Math.min(1.0, Math.max(0.1, coverageRatio));

    return {
      status: 'SWAMP_MUD_THERMAL_MASK_APPLIED',
      coverageRatio: this.mudMaskEfficiency,
      retinalThermalSignatureSuppressed: true,
      ambushAdvantageGranted: true
    };
  }

  /**
   * Esquiver la lame de poignet éjectable harponnée tirée par l'Upgrade Predator
   * @param {number} dodgeReflexSec Temps de réaction à l'esquive (s)
   */
  dodgeEjectedWristBladeHarpoon(dodgeReflexSec = 0.22) {
    const success = dodgeReflexSec <= 0.35;
    this.wristBladeHarpoonDodged = success;

    return {
      status: success ? 'EJECTABLE_WRIST_HARPOON_EVADED' : 'PINNED_BY_WRIST_HARPOON',
      success,
      projectileVelocityMps: 110.0,
      tetherLineEmbeddedInTree: success
    };
  }

  /**
   * Sectionner le bras exo-chitineux de l'Upgrade Predator à l'aide du champ de force / piège
   */
  severUpgradePredatorArm() {
    this.upgradePredatorChitinArmSevered = true;
    this.upgradePredatorHealth -= 600.0;

    return {
      status: 'UPGRADE_CHITIN_ARM_SEVERED',
      success: true,
      severedLimbRecoverable: true,
      integratedPlasmacasterActive: true,
      targetBleedingPhosphorescentGreen: true
    };
  }

  /**
   * Braquer le bras coupé et faire feu avec le canon plasmique intégré
   * @param {number} dischargeVolley Tirs de plasma délivrés
   */
  fireSeveredArmPlasmacasterAtApex(dischargeVolley = 3) {
    if (!this.upgradePredatorChitinArmSevered) {
      return { status: 'FAILED_ARM_NOT_SEVERED', lethal: false };
    }

    this.severedArmPlasmacasterFired = true;
    this.upgradePredatorHealth = 0.0;
    this.quinnFinalStrikeLethal = true;

    return {
      status: 'SEVERED_ARM_PLASMACASTER_LETHAL_VOLLEY',
      volleyCount: dischargeVolley,
      upgradePredatorHealthRemaining: this.upgradePredatorHealth,
      apexPredatorDefeated: true,
      trophyEarned: 'APEX_HYBRID_CHITIN_SKULL'
    };
  }
}
