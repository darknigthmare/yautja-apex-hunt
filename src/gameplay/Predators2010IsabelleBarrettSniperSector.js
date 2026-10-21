/**
 * Predators2010IsabelleBarrettSniperSector.js
 * 
 * Chantier Level Design #5 - Tir de Précision d'Isabelle au Fusil Barrett .50 BMG.
 * Canonical 1:1 Predators (2010) fidelity:
 * - IDF sniper Isabelle perches on an elevated granite boulder overlooking the fire trench (120m distance).
 * - Armed with her Barrett heavy anti-materiel sniper rifle firing .50 BMG armor-piercing ammunition.
 * - Ballistics & targeting:
 *   - Muzzle velocity 928 m/s, kinetic impact 18,000 J.
 *   - Isabelle calculates thermal windage through the rising heat shimmer of the fire trench.
 * - The decisive shot:
 *   - Fires directly into the Berserker Super Predator's left shoulder clavicle armor plate (144 dB blast).
 *   - The heavy slug shatters the armor, punching through tissue and staggering the Berserker back by 2 paces,
 *     giving Royce the crucial opening to attack with his battleaxe.
 */

export class Predators2010IsabelleBarrettSniperSector {
  /**
   * @param {Object} options
   * @param {number} [options.sniperDistanceM=120.0]
   */
  constructor(options = {}) {
    this.sniperDistanceM = options.sniperDistanceM ?? 120.0;
    this.targetLocked = false;
    this.sniperShotFired = false;
    this.berserkerStaggered = false;
  }

  /**
   * Acquires the Berserker through the optical scope despite the heat distortion.
   * @returns {Object} Target acquisition telemetry
   */
  acquireBerserkerTarget() {
    this.targetLocked = true;

    return {
      success: true,
      targetLocked: true,
      sniperDistanceM: this.sniperDistanceM,
      weaponModel: 'BARRETT_M82A1_50_BMG_ANTI_MATERIEL',
      scopeMagnification: '10X_MIL_DOT',
      heatMirageCompensationPct: 18.0,
      targetArmorWeaknessIdentified: 'LEFT_CLAVICLE_SHOULDER_JOINT',
      targetAcquiredConfirmed: true
    };
  }

  /**
   * Fires the heavy .50 BMG armor-piercing sniper round.
   * @returns {Object} Sniper shot outcome
   */
  fireFiftyCaliberSniperRound() {
    if (!this.targetLocked) {
      return { success: false, reason: 'TARGET_NOT_LOCKED' };
    }

    this.sniperShotFired = true;
    this.berserkerStaggered = true;

    const muzzleVelocityMps = 928.0;
    const timeOfFlightSec = Math.round((this.sniperDistanceM / muzzleVelocityMps) * 1000) / 1000;
    const kineticYieldJoules = 18000;

    return {
      success: true,
      sniperShotFired: true,
      muzzleVelocityMps,
      timeOfFlightSec,
      kineticYieldJoules,
      rifleBlastAcousticDb: 144,
      armorPlatePenetrated: true,
      berserkerStaggered: true,
      staggerDurationSec: 1.8,
      openingCreatedForRoyce: true
    };
  }
}
