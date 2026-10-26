/**
 * KillerOfKillers1609BambooGroveShojiSector.js
 *
 * Chantier de Level Design 2 (v195) - Predator: Killer of Killers (2025)
 * Segment 2 (Part II): 1609 Feudal Bamboo Grove & Shoji Paper Silhouette Ambush
 * 1:1 Canonical Level Design:
 * - Mountain bamboo forest with towering hollow culms (height 14m) filtering moonlight.
 * - Spreading four-pointed iron makibishi caltrops across needle-covered dirt tracks to slow alien stalkers.
 * - Outbuilding with translucent washi paper shoji screens revealing the towering demon silhouette of the Oni Yautja.
 * - Concealed fukidake blowpipe delivering a tetrodotoxin blowdart through the paper membrane, followed by a double katana cleave.
 */

export class KillerOfKillers1609BambooGroveShojiSector {
  /**
   * @param {Object} options
   * @param {number} [options.bambooCulmDensity=85] Densité de tiges de bambou par are
   * @param {number} [options.makibishiStock=24] Réserve de chausse-trapes en fer forgé (makibishi)
   */
  constructor(options = {}) {
    this.bambooCulmDensity = options.bambooCulmDensity ?? 85;
    this.makibishiStock = options.makibishiStock ?? 24;

    // État runtime
    this.makibishiScattered = false;
    this.shojiSilhouetteTracked = false;
    this.blowdartDischarged = false;
    this.shojiScreenCleaved = false;
  }

  /**
   * Disperser les chausse-trapes en fer forgé (makibishi) sur le sentier de bambou
   * @param {number} countToDrop Nombre de makibishi jetés
   */
  scatterMakibishiCaltropsOnTrail(countToDrop = 16) {
    const dropped = Math.min(this.makibishiStock, countToDrop);
    this.makibishiStock -= dropped;
    this.makibishiScattered = true;

    return {
      status: 'MAKIBISHI_CALTROPS_SCATTERED_ON_TRAIL',
      droppedCount: dropped,
      stockRemaining: this.makibishiStock,
      caltropPointSpacingCm: 12.0,
      alienFootPerforationRiskPct: 88.0
    };
  }

  /**
   * Observer la silhouette du prédateur Oni projetée à travers les écrans de papier shoji
   * @param {number} lanternAngleDeg Angle de la lanterne projetant l'ombre (degrés)
   */
  trackShadowSilhouetteThroughShoji(lanternAngleDeg = 45.0) {
    if (!this.makibishiScattered) {
      return { status: 'FAILED_TRAIL_NOT_SECURED', success: false };
    }

    this.shojiSilhouetteTracked = true;

    return {
      status: 'SHADOW_SILHOUETTE_TRACKED_THROUGH_SHOJI',
      lanternAngleDeg,
      shadowHeightM: 2.35,
      hornedMaskProfileIdentified: true,
      paperThicknessMm: 0.15,
      targetCoordinatesLocked: true
    };
  }

  /**
   * Tirer une fléchette empoisonnée au sarbacane (fukidake) à travers le papier washi
   */
  dischargeFukidakeBlowdartThroughWashi() {
    if (!this.shojiSilhouetteTracked) {
      return { status: 'FAILED_TARGET_NOT_LOCKED', success: false };
    }

    this.blowdartDischarged = true;

    return {
      status: 'FUKIDAKE_BLOWDART_DISCHARGED_THROUGH_WASHI',
      washiPaperPuncturedSilently: true,
      poisonType: 'TETRODOTOXIN_BLOWDART',
      toxinAbsorptionSec: 1.2,
      alienMotorReflexSlowdownPct: 40.0
    };
  }

  /**
   * Fendre l'écran de papier shoji d'un coup de katana traversant
   */
  cleaveThroughPaperScreenWithKatana() {
    if (!this.blowdartDischarged) {
      return { status: 'FAILED_PREDATOR_ALERT_AND_DODGING', success: false };
    }

    this.shojiScreenCleaved = true;

    return {
      status: 'SHOJI_SCREEN_CLEAVED_WITH_KATANA',
      paperFrameShattered: true,
      alienTorsoSlashed: true,
      kineticImpactJoules: 1450.0,
      honorScoreGranted: 350
    };
  }
}
