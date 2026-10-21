/**
 * Prey1719FeralBoneShieldAndFlechetteSector.js
 * 
 * Chantier Level Design #7 - Bouclier Rétractable en Éventail & Fléchettes Guidées du Feral.
 * Canonical 1:1 Prey (2022 / 1719) fidelity:
 * - Feral Predator biomechanical equipment suite:
 *   - Expandable Bone Fan Shield:
 *     - Multi-segmented folding shield constructed of alien obsidian bone and carbonized alloy.
 *     - Deploys from left gauntlet in 0.12s, forming an 0.85m diameter protective fan.
 *     - Completely deflects French trapper lead musket balls, bear swipes, and tomahawk throws (94 dB clang).
 *   - Guided Bone Flechette Launcher:
 *     - Tri-laser targeting device attached to bone bio-mask.
 *     - Fired flechettes dynamically adjust flight path in mid-air to intercept the laser target dot.
 *   - The iconic mask-redirection climax:
 *     - Naru severs the Feral Predator's bio-mask and embeds it in the bog bank, pointing the targeting lasers
 *       back at the Feral Predator.
 *     - The Feral fires his flechette launcher; the guided dart follows the laser trajectory in a 180° loop
 *       and pierces the Feral Predator's own cranial plate.
 */

export class Prey1719FeralBoneShieldAndFlechetteSector {
  /**
   * @param {Object} options
   * @param {number} [options.shieldDiameterM=0.85]
   */
  constructor(options = {}) {
    this.shieldDiameterM = options.shieldDiameterM ?? 0.85;
    this.shieldDeployed = false;
    this.flechetteTargetLocked = false;
    this.maskRedirected = false;
    this.feralDefeatedByOwnFlechette = false;
  }

  /**
   * Deploys the multi-segmented expandable bone fan shield from the gauntlet.
   * @returns {Object} Shield deployment telemetry
   */
  deployBoneFanShield() {
    this.shieldDeployed = true;

    return {
      success: true,
      shieldDeployed: true,
      shieldDiameterM: this.shieldDiameterM,
      deploySpeedSec: 0.12,
      shieldMaterial: 'ALIEN_OBSIDIAN_BONE_AND_ALLOY',
      segmentPlatesCount: 8,
      deploySnapAcousticDb: 76,
      deflectionCapacityJoules: 4500
    };
  }

  /**
   * Deflects incoming projectile or melee strike using the bone fan shield.
   * @param {string} [incomingThreatType='LEAD_MUSKET_BALL']
   * @param {number} [impactEnergyJoules=1200]
   * @returns {Object} Deflection telemetry
   */
  deflectProjectileWithShield(incomingThreatType = 'LEAD_MUSKET_BALL', impactEnergyJoules = 1200) {
    if (!this.shieldDeployed) {
      return { success: false, reason: 'SHIELD_NOT_DEPLOYED' };
    }

    return {
      success: true,
      incomingThreatType,
      impactEnergyJoules,
      projectileDeflected: true,
      sparksProduced: true,
      deflectionClangAcousticDb: 94,
      damageAbsorbedPct: 100.0,
      wearPercentage: 2.5
    };
  }

  /**
   * Sets up the laser targeting for the guided bone flechette pistol.
   * @param {boolean} [redirectedToFeral=false]
   * @returns {Object} Laser targeting telemetry
   */
  lockTriLaserFlechetteTarget(redirectedToFeral = false) {
    this.flechetteTargetLocked = true;
    this.maskRedirected = redirectedToFeral;

    return {
      success: true,
      flechetteTargetLocked: true,
      maskRedirected: this.maskRedirected,
      targetingLaserCount: 3,
      targetEntity: this.maskRedirected ? 'FERAL_PREDATOR_OWN_SKULL' : 'COMANCHE_WARRIOR',
      laserWhistleDb: 68
    };
  }

  /**
   * Fires the guided flechette; if mask was redirected, flechette loops back and hits Feral Predator.
   * @returns {Object} Flechette flight outcome
   */
  fireGuidedBoneFlechette() {
    if (!this.flechetteTargetLocked) {
      return { success: false, reason: 'TARGET_NOT_LOCKED' };
    }

    if (this.maskRedirected) {
      this.feralDefeatedByOwnFlechette = true;
      return {
        success: true,
        flechetteFired: true,
        trajectoryLoopDeg: 180.0,
        laserTargetHit: 'FERAL_PREDATOR_CRANIAL_PLATE',
        feralDefeatedByOwnFlechette: true,
        cranialPenetrationDepthCm: 12.0,
        skullCrunchAcousticDb: 102,
        naruVictorious: true,
        honorPointsAwarded: 500
      };
    } else {
      return {
        success: true,
        flechetteFired: true,
        trajectoryLoopDeg: 0.0,
        laserTargetHit: 'COMANCHE_WARRIOR',
        feralDefeatedByOwnFlechette: false,
        strikeLethal: true
      };
    }
  }
}
