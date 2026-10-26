/**
 * Prey1719ComancheMedicineLodgeSector.js
 *
 * Chantier de Level Design 6 (v193) - Prey (2022) Comanche Medicine Tipi & Herbal Triage
 * 1:1 Canonical Level Design:
 * - Interior of the sacred Comanche medicine tipi with central stone hearth fire.
 * - Boiling wild willow bark infusion (natural salicin) to reduce acute fever and pain.
 * - Deer sinew threads and polished bone needles for suturing severe lacerations.
 * - Restoring hunter vitality, stamina pools, and sensory sharpness prior to the final hunt.
 */

export class Prey1719ComancheMedicineLodgeSector {
  /**
   * @param {Object} options
   * @param {number} [options.willowBarkSupplyGrams=150.0] Quantité d'écorce de saule en réserve (g)
   * @param {number} [options.sinewSuturesCount=4] Nombre de fils de suture en tendon de cerf
   */
  constructor(options = {}) {
    this.willowBarkSupplyGrams = options.willowBarkSupplyGrams ?? 150.0;
    this.sinewSuturesCount = options.sinewSuturesCount ?? 4;

    // État runtime
    this.hearthFireKindled = false;
    this.willowBarkTeaBrewed = false;
    this.salicinInfusionConsumed = false;
    this.lacerationsSutured = 0;
    this.vitalityRestoredPct = 0.0;
  }

  /**
   * Allumer le feu cérémoniel de sauge et d'écorces
   */
  kindleHearthFire() {
    this.hearthFireKindled = true;

    return {
      status: 'MEDICINE_HEARTH_FIRE_KINDLED',
      hearthTempCelsius: 320.0,
      sageAromaActive: true,
      sacredSanctuarySecured: true
    };
  }

  /**
   * Faire infuser l'écorce de saule pour extraire le salicin antalgique
   * @param {number} boilTimeMinutes Temps d'ébullition (min)
   */
  brewWillowBarkTea(boilTimeMinutes = 8.0) {
    if (!this.hearthFireKindled) {
      return { status: 'FAILED_HEARTH_NOT_KINDLED', brewed: false };
    }

    this.willowBarkTeaBrewed = true;
    this.salicinInfusionConsumed = true;
    this.vitalityRestoredPct += 45.0;

    return {
      status: 'WILLOW_BARK_SALICIN_INFUSION_CONSUMED',
      boilTimeMinutes,
      analgesicReliefActive: true,
      painThresholdBoostPct: 50.0,
      staminaRegenRateMultiplier: 1.8
    };
  }

  /**
   * Suture chirurgicale des lacérations au fil de tendon de cerf
   * @param {number} woundsToStitch Nombre de blessures à suturer
   */
  sutureLacerationsWithSinew(woundsToStitch = 2) {
    const stitched = Math.min(this.sinewSuturesCount, woundsToStitch);
    this.sinewSuturesCount -= stitched;
    this.lacerationsSutured += stitched;
    this.vitalityRestoredPct = Math.min(100.0, this.vitalityRestoredPct + stitched * 25.0);

    return {
      status: 'LACERATIONS_SUTURED_WITH_DEER_SINEW',
      woundsStitched: stitched,
      suturesRemaining: this.sinewSuturesCount,
      hemorrhageHalted: true,
      vitalityRestoredPct: this.vitalityRestoredPct
    };
  }
}
