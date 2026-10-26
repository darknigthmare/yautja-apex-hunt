/**
 * Predators2010BerserkerMaskRipShowdownSector.js
 *
 * Chantier de Level Design 4 (v184) - Predators (2010)
 * 1:1 Canonical Level Design: Berserker vs Classic Predator Mask Rip & Blood Feud Duel
 *
 * Canonical Scene: The freed Classic Jungle Hunter engages the larger Super Predator Berserker.
 * They trade vicious wristblade strikes and wrestling slams. The Berserker delivers a bone-shattering
 * knee strike to the Classic's sternum (F >= 6,500 N), rips his iconic bio-mask off with bare hands,
 * and executes him with an extended wristblade thrust to settle the ancient blood feud.
 */

export class Predators2010BerserkerMaskRipShowdownSector {
  /**
   * @param {Object} options
   * @param {number} [options.classicPredatorHp=450.0] Points de vie du Classic Jungle Hunter
   * @param {number} [options.berserkerPredatorHp=650.0] Points de vie du Berserker
   * @param {number} [options.sternumKneeStrikeForceN=6500.0] Force d'impact du coup de genou (N)
   */
  constructor(options = {}) {
    this.classicPredatorHp = options.classicPredatorHp ?? 450.0;
    this.berserkerPredatorHp = options.berserkerPredatorHp ?? 650.0;
    this.sternumKneeStrikeForceN = options.sternumKneeStrikeForceN ?? 6500.0;

    // État du duel cinématique
    this.duelStage = 'WRISTBLADE_CLASH'; // 'WRISTBLADE_CLASH' -> 'GRAPPLE_KNEE_STRIKE' -> 'MASK_RIPPED' -> 'EXECUTION'
    this.classicMaskIntact = true;
    this.classicDefeated = false;
    this.berserkerRoaring = false;
    this.clashesExchanged = 0;
  }

  /**
   * Échange d'assauts aux wristblades entre les deux Predators
   * @param {number} damageExchanged
   */
  exchangeMeleeClashes(damageExchanged = 75.0) {
    this.clashesExchanged += 1;
    this.classicPredatorHp = Math.max(100.0, this.classicPredatorHp - damageExchanged);
    this.berserkerPredatorHp = Math.max(450.0, this.berserkerPredatorHp - damageExchanged * 0.4);

    if (this.clashesExchanged >= 3) {
      this.duelStage = 'GRAPPLE_KNEE_STRIKE';
    }

    return {
      stage: this.duelStage,
      clashesCount: this.clashesExchanged,
      classicHp: this.classicPredatorHp,
      berserkerHp: this.berserkerPredatorHp,
      sparksFlying: true
    };
  }

  /**
   * Coup de genou dévastateur au sternum par le Berserker
   */
  deliverSternumKneeDrive() {
    if (this.duelStage !== 'GRAPPLE_KNEE_STRIKE') {
      return { success: false, reason: 'MUST_ENGAGE_GRAPPLE_STAGE_FIRST' };
    }

    this.classicPredatorHp = Math.max(20.0, this.classicPredatorHp - 180.0);
    this.duelStage = 'MASK_RIPPED';

    return {
      success: true,
      status: 'STERNUM_CRUSHED_BY_KNEE_DRIVE',
      impactForceN: this.sternumKneeStrikeForceN,
      classicStunned: true,
      readyForMaskRip: true
    };
  }

  /**
   * Le Berserker arrache le bio-masque du Classic à mains nues
   */
  ripClassicBioMask() {
    if (this.duelStage !== 'MASK_RIPPED') {
      return { success: false, reason: 'TARGET_NOT_PRIMED_FOR_DISARM' };
    }

    this.classicMaskIntact = false;
    this.duelStage = 'EXECUTION';
    this.berserkerRoaring = true;

    return {
      success: true,
      status: 'CLASSIC_BIOMASK_TORN_AWAY',
      metalClatterDecibels: 88.0,
      classicFaceExposed: true,
      berserkerDominanceAsserted: true
    };
  }

  /**
   * Exécution finale à la wristblade
   */
  executeClassicPredator() {
    if (this.duelStage !== 'EXECUTION') {
      return { success: false, reason: 'MUST_RIP_MASK_FIRST' };
    }

    this.classicPredatorHp = 0.0;
    this.classicDefeated = true;

    return {
      success: true,
      status: 'CLASSIC_PREDATOR_SLAIN_CLAN_VENDETTA_SETTLED',
      classicSlain: true,
      shipExplosionTriggerReady: true // Le Berserker peut désormais se retourner vers le vaisseau
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010BerserkerMaskRipShowdownSector',
      duelStage: this.duelStage,
      classicMaskIntact: this.classicMaskIntact,
      classicDefeated: this.classicDefeated,
      classicPredatorHp: this.classicPredatorHp,
      berserkerPredatorHp: this.berserkerPredatorHp
    };
  }
}
