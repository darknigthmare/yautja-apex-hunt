/**
 * KillerOfKillersOniBioMaskKusarigamaSector.js
 *
 * Chantier de Level Design 6 (v194) - Predator: Killer of Killers (2025)
 * Feudal Japanese Oni Bio-Mask & Biomechanical Kusarigama Combat
 * 1:1 Canonical Level Design:
 * - Alien horned Oni bio-mask forged in lacquer-sheened alloy with demon fangs and twin crimson optic lenses.
 * - Yautja biomechanical kusarigama: High-tensile mono-filament chain with plasma-charged scythe and counterweight.
 * - Shinobi weighted chain entanglement wrapping around the alien's wrist gauntlet.
 * - Katana strike cleaving the bio-mask latches to expose the acoustic auditory canals and unmasked face.
 */

export class KillerOfKillersOniBioMaskKusarigamaSector {
  /**
   * @param {Object} options
   * @param {number} [options.chainLengthM=4.8] Longueur de la chaîne kusarigama (m)
   * @param {number} [options.plasmaScytheJoules=2200.0] Énergie cinétique de la lame de faux plasma (J)
   */
  constructor(options = {}) {
    this.chainLengthM = options.chainLengthM ?? 4.8;
    this.plasmaScytheJoules = options.plasmaScytheJoules ?? 2200.0;

    // État runtime
    this.kusarigamaSwingAvoided = false;
    this.alienWristGauntletEntangled = false;
    this.oniBioMaskSevered = false;
    this.oniDemonExposed = false;
  }

  /**
   * Esquiver le fauchage rotatif de la faux plasma du kusarigama
   * @param {number} dodgeReflexMs Vitesse de réaction du shinobi (ms)
   */
  avoidKusarigamaPlasmaSwing(dodgeReflexMs = 120.0) {
    this.kusarigamaSwingAvoided = dodgeReflexMs <= 180.0;

    return {
      status: this.kusarigamaSwingAvoided ? 'KUSARIGAMA_PLASMA_SWING_EVADED' : 'GRAZED_BY_PLASMA_SCYTHE',
      evaded: this.kusarigamaSwingAvoided,
      chainLengthM: this.chainLengthM,
      plasmaImpactJoules: this.plasmaScytheJoules
    };
  }

  /**
   * Enchevêtrer la chaîne lestée shinobi autour du gantelet alien
   * @param {number} tensionForceN Force de serrage de la chaîne (N)
   */
  entangleAlienWristGauntlet(tensionForceN = 1850.0) {
    if (!this.kusarigamaSwingAvoided) {
      return { status: 'FAILED_CANNOT_ENTANGLE_WHILE_STAGGERED', success: false };
    }

    this.alienWristGauntletEntangled = true;

    return {
      status: 'ALIEN_WRIST_GAUNTLET_ENTANGLED',
      tensionForceN,
      plasmaCasterLockDisabled: true,
      alienImmobilizedBriefly: true
    };
  }

  /**
   * Sectionner les fixations du masque d'Oni d'un coup d'estoc précis au katana
   */
  severOniBioMaskLatches() {
    if (!this.alienWristGauntletEntangled) {
      return { status: 'FAILED_PREDATOR_NOT_IMMOBILIZED', success: false };
    }

    this.oniBioMaskSevered = true;
    this.oniDemonExposed = true;

    return {
      status: 'ONI_BIO_MASK_SEVERED_AND_DETACHED',
      crimsonLensesShattered: true,
      demonFangsDismantled: true,
      vulnerableMandiblesExposed: true,
      acousticSensitivityMultiplier: 2.4,
      honorScoreGranted: 350
    };
  }
}
