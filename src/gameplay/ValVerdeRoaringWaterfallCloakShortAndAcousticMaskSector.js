import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 4 (v155) — Rivière à Rapides & Cascade de Décamouflage de Val Verde (*Predator 1987*)
 * Reproduit la chute d'eau rugissante par laquelle Dutch chute et où le Jungle Hunter le traque sur la berge :
 * - Rideau d'eau torrentiel qui court-circuite immédiatement le camouflage optique (`Cloak`) à la traversée.
 * - Le grondement basse fréquence de la cascade masque à `85 %` les bruits de pas et de respiration.
 * - Les éclaboussures d'eau froide lavent également les couches superficielles de boue ou d'acide.
 */
export class ValVerdeRoaringWaterfallCloakShortAndAcousticMaskSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_roaring_waterfall_basin';
    this.acousticMaskingRatio = options.acousticMaskingRatio ?? 0.85;
    this.waterCurtainTemperatureC = 14.5;
  }

  traverseWaterfallCurtain(actorState = {}) {
    const wasCloaked = Boolean(actorState.cloakActive);
    actorState.cloakActive = false;
    actorState.shortCircuitedByWaterfall = wasCloaked;
    actorState.acidCorroding = false;

    audioSynth.playValVerdeWaterfallCurtainCloakSpark?.();

    return {
      traversed: true,
      cloakShortCircuited: wasCloaked,
      acidWashedOff: true,
      acousticMaskingRatio: this.acousticMaskingRatio,
      footstepNoiseMultiplier: Number((1 - this.acousticMaskingRatio).toFixed(2))
    };
  }
}
