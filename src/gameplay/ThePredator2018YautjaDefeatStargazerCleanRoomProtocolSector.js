/**
 * ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector.js
 *
 * Chantier de Level Design 7 (v189) - The Predator (2018) Stargazer Clean-Room & User Rule Implementation
 * 1:1 Canonical Level Design & User Rule:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Règle d'Activation Stricte :
 * Ce protocole ne s'active STRICTEMENT QUE si :
 * 1. Le joueur est dans le rôle d'un chasseur Yautja (isYautjaPlayer === true)
 * 2. Le joueur subit une défaite mortelle dans l'affrontement (healthPoints <= 0)
 * 3. La partie se déroule dans la configuration de The Predator (2018) Stargazer Clean-Room / Lab
 *
 * Séquence Canonique 1:1 :
 * - Le blindage supérieur du gantelet s'ouvre sous détente pneumatique avec panache de vapeur.
 * - 6 glyphes cunéiformes rouge écarlate s'allument séquentiellement : ᚲ -> ᚳ -> ᚴ -> ᚵ -> ᚶ -> ᚷ.
 * - Le rire moqueur numérisé enregistré de Dutch résonne à 105 dB à travers les parois stériles en acier inox.
 * - Compte à rebours de 15,0 secondes accordé aux scientifiques et mercenaires humains pour évacuer.
 * - Température du cœur plasmique atteignant 1,4e7 Kelvin.
 * - Explosion micro-nucléaire (rayon 65m) pulvérisant tout échantillon biologique, matrice ADN et technologie (+500 Honneur).
 */

export class ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false] Si le joueur actuel incarne le Yautja
   * @param {number} [options.countdownDurationSeconds=15.0] Durée du compte à rebours (s)
   * @param {number} [options.blastRadiusM=65.0] Rayon de la détonation nucléaire (m)
   * @param {number} [options.laughterDb=105.0] Intensité sonore du rire moqueur (dB)
   */
  constructor(options = {}) {
    this.isYautjaPlayer = options.isYautjaPlayer ?? false;
    this.countdownDurationSeconds = options.countdownDurationSeconds ?? 15.0;
    this.blastRadiusM = options.blastRadiusM ?? 65.0;
    this.laughterDb = options.laughterDb ?? 105.0;

    // État runtime
    this.protocolArmed = false;
    this.pneumaticCoverOpened = false;
    this.glyphDisplayActive = false;
    this.laughterLoopEchoing = false;
    this.countdownTimerRemaining = this.countdownDurationSeconds;
    this.plasmaReactorTempK = 300.0;
    this.cleansingBlastExecuted = false;
    this.honorPreserved = false;

    this.glyphs = ['ᚲ', 'ᚳ', 'ᚴ', 'ᚵ', 'ᚶ', 'ᚷ'];
    this.currentGlyphIndex = 0;
  }

  /**
   * Évaluation rigoureuse de la condition utilisateur :
   * "uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
   * @param {Object} context
   * @param {boolean} context.isYautja
   * @param {number} context.healthPoints
   * @param {string} [context.configuration='THE_PREDATOR_2018_CLEAN_ROOM']
   */
  evaluateDefeatCondition(context = {}) {
    const isYautja = context.isYautja ?? this.isYautjaPlayer;
    const health = context.healthPoints ?? 100;
    const config = context.configuration ?? 'THE_PREDATOR_2018_CLEAN_ROOM';

    // Condition stricte : DOIT être Yautja ET DOIT avoir perdu (HP <= 0) ET en arène The Predator 2018 Clean-Room
    if (isYautja && health <= 0 && config === 'THE_PREDATOR_2018_CLEAN_ROOM') {
      return this.armPneumaticGauntletOverload();
    }

    return {
      armed: false,
      reason: !isYautja
        ? 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL'
        : (health > 0 ? 'YAUTJA_HUNTER_STILL_ALIVE' : 'INVALID_ARENA_CONFIGURATION')
    };
  }

  /**
   * Armement pneumatique du gantelet et initialisation du compte à rebours
   */
  armPneumaticGauntletOverload() {
    this.protocolArmed = true;
    this.pneumaticCoverOpened = true;
    this.glyphDisplayActive = true;
    this.laughterLoopEchoing = true;
    this.countdownTimerRemaining = this.countdownDurationSeconds;

    return {
      status: 'CLEAN_ROOM_YAUTJA_GAUNTLET_OVERLOAD_ARMED',
      countdownSeconds: this.countdownDurationSeconds,
      initialGlyph: this.glyphs[0],
      mockingLaughterDb: this.laughterDb,
      warning: 'THERMAL_PLASMA_OVERLOAD_INITIATED_EVACUATE_AREA'
    };
  }

  /**
   * Défilement temporel du compte à rebours par pas delta
   * @param {number} deltaSeconds
   */
  updateCountdown(deltaSeconds) {
    if (!this.protocolArmed || this.cleansingBlastExecuted) {
      return { active: false, remainingSeconds: this.countdownTimerRemaining };
    }

    this.countdownTimerRemaining = Math.max(0, this.countdownTimerRemaining - deltaSeconds);

    const progress = 1.0 - (this.countdownTimerRemaining / this.countdownDurationSeconds);
    this.currentGlyphIndex = Math.min(
      this.glyphs.length - 1,
      Math.floor(progress * this.glyphs.length)
    );

    this.plasmaReactorTempK = 300.0 + progress * 14000000.0;

    if (this.countdownTimerRemaining <= 0) {
      return this.triggerCleansingMicroNuclearBlast();
    }

    return {
      active: true,
      remainingSeconds: Number(this.countdownTimerRemaining.toFixed(2)),
      activeGlyph: this.glyphs[this.currentGlyphIndex],
      reactorCoreKelvin: Math.round(this.plasmaReactorTempK),
      laughterEchoing: this.laughterLoopEchoing
    };
  }

  /**
   * Explosion micro-nucléaire purificatrice finale
   */
  triggerCleansingMicroNuclearBlast() {
    this.cleansingBlastExecuted = true;
    this.laughterLoopEchoing = false;
    this.honorPreserved = true;

    return {
      status: 'CLEAN_ROOM_MICRO_NUCLEAR_CLEANSING_BLAST',
      blastRadiusM: this.blastRadiusM,
      thermalJoules: 5.5e11,
      biologicalTracesObliterated: true,
      honorScoreGranted: 500,
      alienTechWiped: true
    };
  }
}
