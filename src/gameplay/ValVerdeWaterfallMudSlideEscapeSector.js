/**
 * ValVerdeWaterfallMudSlideEscapeSector.js
 * Chantier 8 (v149) : Chute d'eau de Val Verde, toboggan de boue & plongeon d'échappée (Predator 1987).
 * Cataracte vertigineuse et berge d'argile sous les racines géantes :
 * - Glissade rapide suivie d'un saut du haut de la cascade amortissant 100% des dégâts de chute
 *   et éteignant immédiatement toute brûlure plasma/incendiaire.
 * - L'immersion dans le bassin rince le camouflage de boue existant, mais émerger sous la rive
 *   racinaire permet de s'enduire d'une couche d'argile froide fraîche masquant la signature IR.
 */

export class ValVerdeWaterfallMudSlideEscapeSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_waterfall_root_bank';
    this.waterfallDropHeightMeters = options.waterfallDropHeightMeters ?? 28.0;
    this.riverThermalMaskingTempCelsius = options.riverThermalMaskingTempCelsius ?? 14.5;

    this.state = {
      totalPlungesExecuted: 0,
      totalClayBankApplications: 0
    };
  }

  executeMudSlideWaterfallPlunge(survivor = {}, audioSynthesizer = null) {
    this.state.totalPlungesExecuted += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playWaterfallMudSlideSplashPlunge === 'function') {
      audioSynthesizer.playWaterfallMudSlideSplashPlunge(1.1);
    }

    survivor.fallDamageTaken = 0;
    survivor.burning = false;
    survivor.plasmaLockBroken = true;
    survivor.mudCamouflageRatio = 0.0; // L'eau vive rince la boue initiale
    survivor.inDeepPool = true;

    return {
      plunged: true,
      dropHeightMeters: this.waterfallDropHeightMeters,
      fallDamageTaken: 0,
      plasmaLockBroken: true,
      mudWashedOffByCurrent: true
    };
  }

  crawlOntoRootClayBankAndApplyMud(survivor = {}) {
    this.state.totalClayBankApplications += 1;

    survivor.inDeepPool = false;
    survivor.mudCamouflageRatio = 1.0;
    survivor.surfaceSkinTempCelsius = this.riverThermalMaskingTempCelsius;
    survivor.invisibleToYautjaThermalVision = true;

    return {
      applied: true,
      mudCamouflageRatio: survivor.mudCamouflageRatio,
      surfaceSkinTempCelsius: survivor.surfaceSkinTempCelsius,
      invisibleToYautjaThermalVision: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      totalPlungesExecuted: this.state.totalPlungesExecuted,
      totalClayBankApplications: this.state.totalClayBankApplications
    };
  }
}
