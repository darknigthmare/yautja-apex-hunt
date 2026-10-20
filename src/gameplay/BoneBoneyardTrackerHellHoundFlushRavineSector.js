import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 2 (v156) — Cimetière de Squelettes & Fosse d'Embuscade du Tracker Predator et de ses Hell-Hounds (*Predators 2010*)
 * Reproduit la ravine tapissée d'ossements et de crânes du camp des Super Predators :
 * - Le Tracker Predator utilise son sifflet guttural biomécanique pour rabattre ou rappeler sa meute de Hell-Hounds à cornes.
 * - Les chiens forcent les proies à sortir de leur couvert vers l'angle de tir du canon plasma rotatif du Tracker.
 */
export class BoneBoneyardTrackerHellHoundFlushRavineSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_skull_boneyard_ravine';
    this.activeHoundsCount = options.activeHoundsCount ?? 4;
    this.preyFlushedFromCover = false;
    this.whistleRecalled = false;
  }

  commandHellHoundPackFlush(targetPrey = {}) {
    this.preyFlushedFromCover = true;
    targetPrey.inCover = false;
    targetPrey.exposedToTrackerCaster = true;

    audioSynth.playTrackerBoneyardHoundWhistleCall?.();

    return {
      packDispatched: true,
      activeHoundsCount: this.activeHoundsCount,
      preyFlushedFromCover: true,
      trackerPlasmaLockBonus: 0.4
    };
  }

  fireTrackerHeavyRotaryPlasmaSalvo(targetPrey = {}) {
    const bonusDamage = targetPrey.exposedToTrackerCaster ? 45 : 0;
    const totalDamage = 95 + bonusDamage;
    targetPrey.health = Math.max(0, Number(targetPrey.health ?? 180) - totalDamage);

    audioSynth.playBoneyardRotaryPlasmaSalvoBoom?.();

    return {
      salvoFired: true,
      damageDealt: totalDamage,
      remainingHealth: targetPrey.health
    };
  }
}
