/**
 * ValVerdeYautjaDefeatSelfDestructCinematicSector.js
 * 
 * Chantier Level Design #3 - Séquence Diégétique de Défaite Yautja : Dévissage du Masque, Gantelet & Rire Sardonique.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Activates ONLY when playing in the Yautja defeat configuration (pinned beneath Dutch's 1,200 kg deadfall log).
 * - Multi-phase ritualistic suicide sequence when facing dishonorable defeat:
 *   1. PINNED_UNDER_DEADFALL (crushed under timber, unable to escape, health critical).
 *   2. MASK_PNEUMATIC_RELEASE (pneumatic hoses hiss and uncouple, revealing yellow-eyed reptilian face and flared mandibles).
 *   3. GAUNTLET_GLYPH_ACTIVATION (sliding the gauntlet cover open, dialing glowing red extraterrestrial numeric glyphs).
 *   4. MIMICKED_BILLY_LAUGHTER (haunting playback of Billy Sole's sardonic laughter through the vocoder).
 *   5. COUNTDOWN_TICKING (10-second evacuation countdown, glyph pulse rate accelerating from 2 Hz to 16 Hz).
 *   6. THERMONUCLEAR_OBLITERATION (micro-atomic blast wave annihilating 35m radius with rising mushroom cloud).
 */

export class ValVerdeYautjaDefeatSelfDestructCinematicSector {
  /**
   * @param {Object} options
   * @param {string} [options.playerRole='YAUTJA'] - 'YAUTJA' | 'DUTCH'
   */
  constructor(options = {}) {
    this.playerRole = options.playerRole ?? 'YAUTJA';
    this.isPinnedUnderDeadfall = false;
    this.currentPhase = 'IDLE';
    this.countdownSecondsRemaining = 10;
    this.laughterPlaying = false;
  }

  /**
   * Evaluates if the defeat self-destruct configuration criteria are met.
   * @param {boolean} isPinnedUnderDeadfall
   * @param {number} yautjaHealth
   * @returns {Object} Trigger qualification
   */
  evaluateDefeatCondition(isPinnedUnderDeadfall = true, yautjaHealth = 0) {
    this.isPinnedUnderDeadfall = isPinnedUnderDeadfall;
    const qualifiesForSelfDestruct = this.playerRole === 'YAUTJA' && isPinnedUnderDeadfall && yautjaHealth <= 15;

    return {
      playerRole: this.playerRole,
      isPinnedUnderDeadfall,
      yautjaHealth,
      qualifiesForSelfDestruct,
      status: qualifiesForSelfDestruct ? 'QUALIFIED_FOR_RITUAL_SELF_DESTRUCT' : 'STANDARD_COMBAT'
    };
  }

  /**
   * Initiates the multi-phase self-destruct cinematic ritual upon defeat.
   * @returns {Object} Phase sequence initiation
   */
  initiateDefeatSelfDestructSequence() {
    if (!this.isPinnedUnderDeadfall) {
      return { success: false, reason: 'MUST_BE_PINNED_UNDER_DEADFALL_IN_DEFEAT' };
    }

    this.currentPhase = 'MASK_PNEUMATIC_RELEASE';

    return {
      success: true,
      phase: this.currentPhase,
      maskHosesDepressurized: true,
      unmaskedFaceRevealed: true,
      mandibleSpreadAngleDeg: 52,
      famousQuote: 'What the hell are you? ... What the hell are you?',
      pneumaticHissAcousticDb: 76
    };
  }

  /**
   * Activates the wrist gauntlet numeric glyphs and starts Billy's mimicked laughter.
   * @returns {Object} Gauntlet activation telemetry
   */
  activateGauntletGlyphCountDown() {
    this.currentPhase = 'GAUNTLET_GLYPH_COUNTDOWN';
    this.countdownSecondsRemaining = 10;
    this.laughterPlaying = true;

    return {
      success: true,
      phase: this.currentPhase,
      gauntletCoverSlidOpen: true,
      glowingRedGlyphsActive: true,
      countdownSecondsRemaining: this.countdownSecondsRemaining,
      mimickedBillyLaughterActive: true,
      laughterAcousticDb: 86,
      initialGlyphPulseHz: 2.0,
      evacuateBlastRadiusWarningM: 35.0
    };
  }

  /**
   * Advances the 10-second countdown tick.
   * @param {number} deltaSeconds
   * @returns {Object} Countdown status
   */
  updateCountdownTick(deltaSeconds = 1.0) {
    this.countdownSecondsRemaining = Math.max(0, Math.round((this.countdownSecondsRemaining - deltaSeconds) * 10) / 10);
    const glyphPulseHz = Math.min(16.0, Math.round((2.0 + (10 - this.countdownSecondsRemaining) * 1.4) * 10) / 10);
    const isDetonated = this.countdownSecondsRemaining <= 0;

    if (isDetonated) {
      this.currentPhase = 'THERMONUCLEAR_OBLITERATION';
    }

    return {
      countdownSecondsRemaining: this.countdownSecondsRemaining,
      glyphPulseHz,
      isDetonated,
      currentPhase: this.currentPhase,
      blastYieldKiloton: 0.05,
      blastRadiusM: 35.0,
      mushroomCloudHeightM: 220.0
    };
  }
}
