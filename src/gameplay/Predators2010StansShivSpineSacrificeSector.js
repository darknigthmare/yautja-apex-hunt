/**
 * Predators2010StansShivSpineSacrificeSector.js
 *
 * Chantier de Level Design 6 (v184) - Predators (2010)
 * 1:1 Canonical Level Design: Stans Prison Shiv Rear Ambush & Spine Severance Sacrifice
 *
 * Canonical Scene: As the Berserker corners Isabelle and Edwin, Stans leaps onto the Predator's back
 * wielding an improvised prison shiv. He repeatedly stabs the unarmored neck tissues, distracting the
 * titan for 8.0 seconds to allow the survivors to escape into the foliage, before the Berserker
 * rips him off and extracts his spinal column trophy.
 */

export class Predators2010StansShivSpineSacrificeSector {
  /**
   * @param {Object} options
   * @param {number} [options.shivDamagePerStrike=35.0] Dégâts perforants par coup de surin
   * @param {number} [options.distractionTimeSeconds=8.0] Temps de diversion accordé à l'escouade (s)
   */
  constructor(options = {}) {
    this.shivDamagePerStrike = options.shivDamagePerStrike ?? 35.0;
    this.distractionTimeSeconds = options.distractionTimeSeconds ?? 8.0;

    // État du combat
    this.rearAmbushMounted = false;
    this.strikesLanded = 0;
    this.distractionTimerRemaining = 0.0;
    this.stansSpineExtracted = false;
    this.squadEscapeSecured = false;
  }

  /**
   * Saut surprise de Stans dans le dos du Berserker
   */
  mountRearShivAmbush() {
    this.rearAmbushMounted = true;
    this.distractionTimerRemaining = this.distractionTimeSeconds;

    return {
      status: 'REAR_AMBUSH_MOUNTED_ON_BERSERKER',
      predatorGrappled: true,
      timeBoughtSeconds: this.distractionTimeSeconds,
      berserkerEnraged: true
    };
  }

  /**
   * Coups de surin répétés dans la nuque du monstre
   * @param {number} count Nombre de frappes
   */
  deliverNeckShivStrikes(count = 3) {
    if (!this.rearAmbushMounted) {
      return { success: false, reason: 'NOT_MOUNTED_ON_PREDATOR' };
    }

    this.strikesLanded += count;
    const totalDamage = count * this.shivDamagePerStrike;

    return {
      success: true,
      status: 'SHIV_STRIKES_PENETRATED_NECK_TISSUE',
      strikesCount: this.strikesLanded,
      totalDamageInflicted: totalDamage,
      predatorStaggered: true
    };
  }

  /**
   * Progression de la diversion et mise à l'abri de l'escouade
   * @param {number} deltaSeconds
   */
  updateDistraction(deltaSeconds) {
    if (!this.rearAmbushMounted || this.stansSpineExtracted) {
      return { active: false, remaining: 0 };
    }

    this.distractionTimerRemaining = Math.max(0.0, this.distractionTimerRemaining - deltaSeconds);
    if (this.distractionTimerRemaining <= 2.0 && !this.squadEscapeSecured) {
      this.squadEscapeSecured = true;
    }

    if (this.distractionTimerRemaining === 0.0) {
      return this.executeSpinalTrophyRip();
    }

    return {
      active: true,
      status: 'DISTRACTION_HOLDING_BERSERKER_ATTENTION',
      remainingSeconds: parseFloat(this.distractionTimerRemaining.toFixed(1)),
      squadEscapeSecured: this.squadEscapeSecured
    };
  }

  /**
   * Le Berserker se dégage et arrache le trophée spinal de Stans
   */
  executeSpinalTrophyRip() {
    this.rearAmbushMounted = false;
    this.stansSpineExtracted = true;

    return {
      status: 'SPINE_AND_SKULL_TROPHY_EXTRACTED',
      stansSacrificeComplete: true,
      squadEscapeSecured: true,
      nobleSacrificeHonorBonus: 300
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010StansShivSpineSacrificeSector',
      rearAmbushMounted: this.rearAmbushMounted,
      strikesLanded: this.strikesLanded,
      stansSpineExtracted: this.stansSpineExtracted,
      squadEscapeSecured: this.squadEscapeSecured
    };
  }
}
