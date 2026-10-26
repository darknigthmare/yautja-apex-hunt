/**
 * Prey1719TaabeSacrificialDuelSector.js
 *
 * Chantier de Level Design 6 (v192) - Prey (2022) Taabe's Heroic Sacrificial Duel & Dying Revelation
 * 1:1 Canonical Level Design:
 * - Dusk duel in the tall prairie grass between Taabe and the towering Feral Predator.
 * - Rear spinal spear impalement inflicting severe iridescent green blood loss on the Yautja.
 * - Close-quarters knife combat buying critical observation time for Naru.
 * - Dying revelation whispered to Naru: "It cannot see you... its weapon follows the light of its eyes."
 */

export class Prey1719TaabeSacrificialDuelSector {
  /**
   * @param {Object} options
   * @param {number} [options.taabeCourageRatingPct=100.0] Degré de bravoure du chef de guerre
   * @param {number} [options.combatObservationSeconds=12.0] Durée d'observation accordée à Naru
   */
  constructor(options = {}) {
    this.taabeCourageRatingPct = options.taabeCourageRatingPct ?? 100.0;
    this.combatObservationSeconds = options.combatObservationSeconds ?? 12.0;

    // État runtime
    this.rearSpineSpearImpaled = false;
    this.knifeMeleeClashExecuted = false;
    this.taabeSacrificeLethal = false;
    this.laserWeaknessRevealedToNaru = false;
  }

  /**
   * Empaler le Feral Predator par l'arrière au niveau de la colonne vertébrale
   */
  impalePredatorSpineFromBehind() {
    this.rearSpineSpearImpaled = true;

    return {
      status: 'YAUTJA_SPINE_IMPALED_BY_COMANCHE_SPEAR',
      penetrationDepthCm: 14.0,
      iridescentBloodFountain: true,
      predatorStaggerSec: 3.2,
      criticalWeaknessExposed: true
    };
  }

  /**
   * Engager le combat au couteau au corps-à-corps pour fixer l'attention du monstre
   */
  engageCloseQuartersKnifeCombat() {
    this.knifeMeleeClashExecuted = true;

    return {
      status: 'CLOSE_QUARTERS_KNIFE_CLASH_ENGAGED',
      taabeFlurriesLanded: 3,
      distractionDurationSec: this.combatObservationSeconds,
      naruObservationWindowSecured: true
    };
  }

  /**
   * Le sacrifice final de Taabe délivrant la révélation de la faiblesse du masque
   */
  deliverDyingWeaknessRevelation() {
    this.taabeSacrificeLethal = true;
    this.laserWeaknessRevealedToNaru = true;

    return {
      status: 'TAABE_HEROIC_SACRIFICE_AND_REVELATION',
      taabeFallenWithHonor: true,
      whisperedRevelation: 'IT_CANNOT_SEE_YOU_WEAPON_HOMES_ON_ITS_OWN_LIGHT',
      tacticalKeyUnlocked: 'ALIGN_MASK_LASER_TO_PREDATOR_TO_KILL_IT',
      honorScoreGranted: 500
    };
  }
}
