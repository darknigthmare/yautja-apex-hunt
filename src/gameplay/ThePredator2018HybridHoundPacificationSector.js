/**
 * ThePredator2018HybridHoundPacificationSector.js
 *
 * Chantier de Level Design 5 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Dreadlocked Hybrid Predator Hound Baseball Field Chase
 *
 * Canonical Scene: The dreadlocked, bullet-sponge modified Predator hound charges through the suburban
 * baseball diamond at 22 m/s. Small-arms rounds ricochet harmlessly off its thick chitinous skull plate.
 * Nebraska lands a high-angle shot into the cranial neural soft spot, lobotomizing the beast and turning it
 * into a docile, pacified companion ("Good dog").
 */

export class ThePredator2018HybridHoundPacificationSector {
  /**
   * @param {Object} options
   * @param {number} [options.houndSprintSpeedMs=22.0] Vitesse de charge du molosse (m/s)
   * @param {number} [options.cranialArmorKineticLimitJ=3800.0] Seuil d'absorption balistique du crâne (J)
   */
  constructor(options = {}) {
    this.houndSprintSpeedMs = options.houndSprintSpeedMs ?? 22.0;
    this.cranialArmorKineticLimitJ = options.cranialArmorKineticLimitJ ?? 3800.0;

    // État runtime
    this.houndCharging = false;
    this.roundsDeflectedCount = 0;
    this.neuralSoftSpotTargeted = false;
    this.houndPacified = false;
    this.houndCompanionLoyal = false;
  }

  /**
   * Déclenchement de la charge du molosse à travers le terrain de baseball
   */
  unleashHoundCharge() {
    this.houndCharging = true;
    return {
      status: 'HYBRID_HOUND_SPRINTING_ACROSS_DIAMOND',
      sprintSpeedMs: this.houndSprintSpeedMs,
      dreadlocksFlowing: true,
      biteForceN: 4200.0
    };
  }

  /**
   * Tirs conventionnels rebondissant sur la plaque crânienne
   * @param {number} rounds
   */
  deflectConventionalRounds(rounds = 12) {
    if (!this.houndCharging) {
      return { success: false, reason: 'HOUND_NOT_CHARGING' };
    }

    this.roundsDeflectedCount += rounds;
    return {
      success: true,
      status: 'ROUNDS_RICOCHETED_OFF_CHITIN_PLATE',
      deflectedCount: this.roundsDeflectedCount,
      houndUnfazed: true,
      clackSoundDb: 108.0
    };
  }

  /**
   * Tir de précision dans le point faible neural occipital (lobotomie de pacification)
   * @param {boolean} accurateAim
   */
  targetNeuralSoftSpot(accurateAim = true) {
    if (!this.houndCharging) {
      return { success: false, reason: 'HOUND_NOT_ACTIVE' };
    }

    if (accurateAim) {
      this.neuralSoftSpotTargeted = true;
      this.houndCharging = false;
      this.houndPacified = true;
      this.houndCompanionLoyal = true;

      return {
        success: true,
        status: 'NEURAL_SOFT_SPOT_PIERCED_HOUND_PACIFIED',
        aggressionZeroed: true,
        docileCompanionTamed: true, // Devient l'allié docile du groupe
        honorScoreGranted: 280
      };
    }

    return {
      success: false,
      reason: 'SHOT_MISSED_NEURAL_CANAL'
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018HybridHoundPacificationSector',
      houndCharging: this.houndCharging,
      roundsDeflectedCount: this.roundsDeflectedCount,
      houndPacified: this.houndPacified,
      houndCompanionLoyal: this.houndCompanionLoyal
    };
  }
}
