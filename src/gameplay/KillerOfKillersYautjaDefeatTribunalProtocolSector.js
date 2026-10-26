/**
 * KillerOfKillersYautjaDefeatTribunalProtocolSector.js
 *
 * Chantier de Level Design 7 (v196) - Predator: Killer of Killers (2025)
 * 1:1 Canonical Level Design & User Rule Implementation:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Règle d'Activation Stricte :
 * 1. Le joueur incarne un Yautja (isYautja === true)
 * 2. Le joueur est vaincu (healthPoints <= 0)
 * 3. Configuration : KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL
 *
 * Séquence : clapet à ressort, 5 glyphes ᚁ ᚂ ᚃ ᚄ ᚅ, rire 105 dB, compte à rebours 15 s,
 * 1,4e7 K, déflagration micro-nucléaire de 65 m (+500 Honneur).
 */

export class KillerOfKillersYautjaDefeatTribunalProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false]
   * @param {number} [options.countdownDurationSeconds=15.0]
   * @param {number} [options.blastRadiusM=65.0]
   * @param {number} [options.laughterDb=105.0]
   */
  constructor(options = {}) {
    this.isYautjaPlayer = options.isYautjaPlayer ?? false;
    this.countdownDurationSeconds = options.countdownDurationSeconds ?? 15.0;
    this.blastRadiusM = options.blastRadiusM ?? 65.0;
    this.laughterDb = options.laughterDb ?? 105.0;

    this.protocolArmed = false;
    this.springCoverOpened = false;
    this.glyphDisplayActive = false;
    this.laughterLoopEchoing = false;
    this.countdownTimerRemaining = this.countdownDurationSeconds;
    this.thermalCoreTempK = 300.0;
    this.cleansingBlastExecuted = false;
    this.honorPreserved = false;

    this.glyphs = ['ᚁ', 'ᚂ', 'ᚃ', 'ᚄ', 'ᚅ'];
    this.currentGlyphIndex = 0;
  }

  evaluateDefeatCondition(context = {}) {
    const isYautja = context.isYautja ?? this.isYautjaPlayer;
    const health = context.healthPoints ?? 100;
    const config = context.configuration ?? 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL';

    if (isYautja && health <= 0 && config === 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL') {
      return this.armTribunalGauntletOverload();
    }

    return {
      armed: false,
      reason: !isYautja
        ? 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL'
        : (health > 0 ? 'YAUTJA_HUNTER_STILL_ALIVE' : 'INVALID_ARENA_CONFIGURATION')
    };
  }

  armTribunalGauntletOverload() {
    this.protocolArmed = true;
    this.springCoverOpened = true;
    this.glyphDisplayActive = true;
    this.laughterLoopEchoing = true;
    this.countdownTimerRemaining = this.countdownDurationSeconds;

    return {
      status: 'KILLER_OF_KILLERS_TRIBUNAL_GAUNTLET_OVERLOAD_ARMED',
      countdownSeconds: this.countdownDurationSeconds,
      initialGlyph: this.glyphs[0],
      mockingLaughterDb: this.laughterDb,
      warning: 'THERMAL_PLASMA_PURGE_INITIATED_CONSUMING_TRIBUNAL_HALL'
    };
  }

  updateCountdown(deltaSeconds) {
    if (!this.protocolArmed || this.cleansingBlastExecuted) {
      return { active: false, remainingSeconds: this.countdownTimerRemaining };
    }

    this.countdownTimerRemaining = Math.max(0, this.countdownTimerRemaining - deltaSeconds);
    const progress = 1.0 - (this.countdownTimerRemaining / this.countdownDurationSeconds);
    this.currentGlyphIndex = Math.min(this.glyphs.length - 1, Math.floor(progress * this.glyphs.length));
    this.thermalCoreTempK = 300.0 + progress * 14000000.0;

    if (this.countdownTimerRemaining <= 0) {
      return this.triggerCleansingMicroNuclearBlast();
    }

    return {
      active: true,
      remainingSeconds: Number(this.countdownTimerRemaining.toFixed(2)),
      activeGlyph: this.glyphs[this.currentGlyphIndex],
      reactorCoreKelvin: Math.round(this.thermalCoreTempK),
      laughterEchoing: this.laughterLoopEchoing
    };
  }

  triggerCleansingMicroNuclearBlast() {
    this.cleansingBlastExecuted = true;
    this.laughterLoopEchoing = false;
    this.honorPreserved = true;

    return {
      status: 'KILLER_OF_KILLERS_TRIBUNAL_MICRO_NUCLEAR_CLEANSING_BLAST',
      blastRadiusM: this.blastRadiusM,
      thermalJoules: 5.4e11,
      biologicalTracesObliterated: true,
      honorScoreGranted: 500,
      alienMetalsDisintegrated: true
    };
  }
}
