/**
 * Prey1719FeralCombistickSplitDaggerSector.js
 *
 * Chantier de Level Design 5 (v191) - Prey (2022) Feral Predator Telescopic Combistick & Dual Split-Daggers
 * 1:1 Canonical Level Design:
 * - Primitive telescopic bone-and-obsidian combistick polearm measuring 2.4 meters extended.
 * - Central pneumatic separation splitting the polearm into twin curved close-quarter combat daggers.
 * - Barbed hooking mechanisms designed to impale and disarm opponent weaponry.
 * - High-speed transitions between two-handed polearm thrusts and whirling twin-dagger flurries.
 */

export class Prey1719FeralCombistickSplitDaggerSector {
  /**
   * @param {Object} options
   * @param {number} [options.extendedLengthM=2.4] Longueur du combistick étendu (m)
   * @param {number} [options.splitDaggerLengthM=0.55] Longueur de chaque dague scindée (m)
   */
  constructor(options = {}) {
    this.extendedLengthM = options.extendedLengthM ?? 2.4;
    this.splitDaggerLengthM = options.splitDaggerLengthM ?? 0.55;

    // État runtime
    this.currentMode = 'EXTENDED_POLEARM';
    this.polearmThrustExecuted = false;
    this.twinDaggersSeparated = false;
    this.whirlingFlurryComboActive = false;
    this.barbedHookDisarmSuccess = false;
  }

  /**
   * Exécuter un coup d'estoc puissant avec le combistick étendu
   * @param {number} thrustForceNewtons Force de pénétration de l'estoc (N)
   */
  executePolearmThrust(thrustForceNewtons = 2800.0) {
    if (this.currentMode !== 'EXTENDED_POLEARM') {
      return { status: 'FAILED_NOT_IN_POLEARM_MODE', success: false };
    }

    this.polearmThrustExecuted = true;

    return {
      status: 'EXTENDED_POLEARM_THRUST_DELIVERED',
      reachM: this.extendedLengthM,
      thrustForceNewtons,
      penetrationDepthCm: 18.0,
      armoredPlateBreached: true
    };
  }

  /**
   * Scinder le combistick en deux dagues de combat jumelées
   */
  splitCombistickIntoTwinDaggers() {
    this.currentMode = 'TWIN_DAGGERS';
    this.twinDaggersSeparated = true;

    return {
      status: 'COMBISTICK_SPLIT_INTO_TWIN_DAGGERS',
      activeMode: this.currentMode,
      daggerLengthM: this.splitDaggerLengthM,
      attackSpeedBonusPct: 65.0,
      dualWieldingActive: true
    };
  }

  /**
   * Déclencher un enchaînement tournoyant au corps-à-corps avec les deux dagues
   * @param {number} strikesCount Nombre de frappes tranchantes assénées
   */
  executeWhirlingTwinDaggerFlurry(strikesCount = 4) {
    if (this.currentMode !== 'TWIN_DAGGERS') {
      return { status: 'FAILED_NOT_IN_TWIN_DAGGER_MODE', success: false };
    }

    this.whirlingFlurryComboActive = true;

    return {
      status: 'WHIRLING_TWIN_DAGGER_FLURRY_EXECUTED',
      strikesLanded: strikesCount,
      comboDurationSec: 0.8,
      opponentGuardBroken: true,
      lethalSlashingDamageJoules: strikesCount * 950.0
    };
  }

  /**
   * Recombiner les deux dagues pour reformer le combistick
   */
  recombineIntoExtendedCombistick() {
    this.currentMode = 'EXTENDED_POLEARM';
    this.twinDaggersSeparated = false;

    return {
      status: 'TWIN_DAGGERS_RECOMBINED_INTO_POLEARM',
      activeMode: this.currentMode,
      extendedLengthM: this.extendedLengthM,
      mechanicalLatchClickSecured: true
    };
  }
}
