/**
 * Predators2010CuchilloPuppetDecoyTrapSector.js
 *
 * Chantier de Level Design 3 (v183) - Predators (2010)
 * 1:1 Canonical Level Design: Cuchillo Wounded Puppet Bait & Acoustic Voice Mimicry Ambush
 *
 * Canonical Scene: Cuchillo is found in the center of an open clearing, mortally wounded.
 * He repeatedly murmurs "Help me... I can't move... Help me..." in an eerie monotone loop.
 * Royce recognizes the hunting trap: monofilament tripwires surround Cuchillo, and the Predators
 * are using recorded vocal mimicry to draw the squad into a crossfire killzone.
 */

export class Predators2010CuchilloPuppetDecoyTrapSector {
  /**
   * @param {Object} options
   * @param {number} [options.clearingRadius=25.0] Rayon de la clairière piégée (m)
   * @param {number} [options.tripwireTensionThresholdN=1200.0] Tension de rupture des câbles monofilament (N)
   * @param {number} [options.decoyAudioDb=62.0] Volume sonore de la boucle vocale synthétique (dB)
   */
  constructor(options = {}) {
    this.clearingRadius = options.clearingRadius ?? 25.0;
    this.tripwireTensionThresholdN = options.tripwireTensionThresholdN ?? 1200.0;
    this.decoyAudioDb = options.decoyAudioDb ?? 62.0;

    // Définition canonique du piège
    this.monofilamentWiresCount = 6;
    this.wiresIntact = 6;
    this.cuchilloVitals = {
      isAlive: false, // Déjà mort ou état critique irréversible
      isDecoySpeakerActive: true,
      voiceLoopPhrase: 'Help me... Please... Help me...',
      mimicryModulationHz: 180.0
    };

    // Embûche Super Predator en attente
    this.ambushPredatorsCount = 3;
    this.crossfireTriangulated = true;
    this.ambushTriggered = false;
    this.trapIdentifiedByRoyce = false;
    this.safelyDisarmed = false;
  }

  /**
   * Analyse tactique à distance de la clairière
   * @param {number} distanceToBait Distance d'observation (m)
   */
  inspectClearingFromCover(distanceToBait = 30.0) {
    if (distanceToBait >= 20.0) {
      this.trapIdentifiedByRoyce = true;
      return {
        status: 'TRAP_IDENTIFIED_PUPPET_BAIT',
        cuchilloDead: true,
        voiceSyntheticDetected: true,
        monofilamentLatticeDetected: true,
        tacticalCommand: 'DO_NOT_APPROACH_HOLD_FIRE'
      };
    }

    return {
      status: 'APPROACHING_DANGER_ZONE',
      warning: 'TRIPWIRES_WITHIN_PROXIMITY'
    };
  }

  /**
   * Simule une tentative d'approche imprudente (déclenchement des pièges)
   * @param {number} appliedForceN
   */
  triggerTripwire(appliedForceN = 1400.0) {
    if (appliedForceN >= this.tripwireTensionThresholdN) {
      this.ambushTriggered = true;
      this.wiresIntact = Math.max(0, this.wiresIntact - 1);

      return {
        status: 'TRIPWIRE_SNAPPED_AMBUSH_SPRING',
        ambushFired: true,
        crossfireProjectiles: 3,
        lethalBlastShockwaveRadiusM: 8.5
      };
    }

    return {
      status: 'TRIPWIRE_TENSIONED_NEAR_FAILURE',
      currentTensionN: appliedForceN,
      thresholdN: this.tripwireTensionThresholdN
    };
  }

  /**
   * Désarmement méthodique au couteau ou tir de neutralisation sur les ancrages
   * @param {number} wiresToSever
   */
  severTripwiresSafely(wiresToSever = 6) {
    if (!this.trapIdentifiedByRoyce) {
      return { success: false, reason: 'TRAP_NOT_IDENTIFIED_CANNOT_DISARM_SAFELY' };
    }

    this.wiresIntact = Math.max(0, this.wiresIntact - wiresToSever);
    if (this.wiresIntact === 0) {
      this.safelyDisarmed = true;
      this.cuchilloVitals.isDecoySpeakerActive = false;
      return {
        success: true,
        status: 'KILLZONE_DISARMED_MIMICRY_SILENCED',
        ambushEvaded: true,
        honorBonusScore: 180
      };
    }

    return {
      success: false,
      status: 'DISARM_IN_PROGRESS',
      remainingWires: this.wiresIntact
    };
  }

  /**
   * Rapport télémétrique complet
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010CuchilloPuppetDecoyTrapSector',
      clearingRadius: this.clearingRadius,
      wiresIntact: this.wiresIntact,
      cuchilloSpeakerActive: this.cuchilloVitals.isDecoySpeakerActive,
      trapIdentifiedByRoyce: this.trapIdentifiedByRoyce,
      safelyDisarmed: this.safelyDisarmed,
      ambushTriggered: this.ambushTriggered
    };
  }
}
