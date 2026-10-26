/**
 * Predators2010YautjaDefeatThermalOverloadProtocolSector.js
 *
 * Chantier de Level Design 7 (v185) - Predators (2010) Preserve & User Rule Implementation
 * 1:1 Canonical Level Design & User Rule:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Règle d'Activation Stricte :
 * Ce protocole ne s'arme STRICTEMENT QUE si :
 * 1. Le joueur est dans le rôle d'un chasseur Yautja (isYautjaPlayer === true)
 * 2. Le joueur subit une défaite mortelle dans l'affrontement (healthPoints <= 0)
 * 3. La partie se déroule dans la configuration de la réserve de chasse de Predators 2010
 *
 * Séquence Canonique 1:1 :
 * - Le blindage supérieur du gantelet saute sous pression pneumatique.
 * - Les 4 glyphes de compte à rebours extraterrestres s'allument en rouge incandescent : ᚦ -> ᛉ -> ᛟ -> ᚢ.
 * - Le rire moqueur numérisé enregistré de Dutch retentit en boucle sur 5 harmoniques (105 dB).
 * - Délai d'évacuation tactique de 15,0 secondes accordé aux survivants.
 * - Emballement thermique critique du réacteur à plasma (T >= 1,2e7 K).
 * - Détonation thermobarique micro-nucléaire (rayon 50m, Delta P >= 185 kPa) détruisant l'armement Yautja (+500 Honneur).
 */

export class Predators2010YautjaDefeatThermalOverloadProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false] Si le joueur actuel incarne le Yautja
   * @param {number} [options.countdownDurationSeconds=15.0] Durée du compte à rebours (s)
   * @param {number} [options.blastRadiusM=50.0] Rayon de la détonation nucléaire (m)
   * @param {number} [options.laughterDb=105.0] Intensité sonore du rire moqueur (dB)
   */
  constructor(options = {}) {
    this.isYautjaPlayer = options.isYautjaPlayer ?? false;
    this.countdownDurationSeconds = options.countdownDurationSeconds ?? 15.0;
    this.blastRadiusM = options.blastRadiusM ?? 50.0;
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

    this.glyphs = ['ᚦ', 'ᛉ', 'ᛟ', 'ᚢ'];
    this.currentGlyphIndex = 0;
  }

  /**
   * Évaluation rigoureuse de la condition utilisateur :
   * "uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
   * @param {Object} context
   * @param {boolean} context.isYautja
   * @param {number} context.healthPoints
   * @param {string} [context.configuration='PREDATORS_2010_GAME_PRESERVE']
   */
  evaluateDefeatCondition(context = {}) {
    const isYautja = context.isYautja ?? this.isYautjaPlayer;
    const health = context.healthPoints ?? 100;
    const config = context.configuration ?? 'PREDATORS_2010_GAME_PRESERVE';

    // Condition stricte : DOIT être Yautja ET DOIT avoir perdu (HP <= 0) ET en arène Predators 2010
    if (isYautja && health <= 0 && config === 'PREDATORS_2010_GAME_PRESERVE') {
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
      status: 'PNEUMATIC_GAUNTLET_COVER_OPENED_OVERLOAD_ARMED',
      countdownSeconds: this.countdownDurationSeconds,
      initialGlyph: this.glyphs[0],
      mockingLaughterDb: this.laughterDb,
      warning: 'THERMAL_RUNAWAY_INITIATED_EVACUATE_IMMEDIATELY'
    };
  }

  /**
   * Défilement temporel du compte à rebours par pas delta
   * @param {number} deltaSeconds
   */
  updateCountdown(deltaSeconds) {
    if (!this.protocolArmed || this.cleansingBlastExecuted) {
      return { active: false, detonated: this.cleansingBlastExecuted };
    }

    this.countdownTimerRemaining = Math.max(0.0, this.countdownTimerRemaining - deltaSeconds);
    const progress = 1.0 - (this.countdownTimerRemaining / this.countdownDurationSeconds);

    this.currentGlyphIndex = Math.floor(progress * this.glyphs.length) % this.glyphs.length;
    this.plasmaReactorTempK = 300.0 * Math.exp(10.6 * progress); // 1.2e7 K à zéro seconde

    if (this.countdownTimerRemaining === 0.0) {
      return this.triggerThermobaricCleansingBlast();
    }

    return {
      active: true,
      remainingSeconds: parseFloat(this.countdownTimerRemaining.toFixed(2)),
      activeGlyph: this.glyphs[this.currentGlyphIndex],
      reactorTempK: Math.round(this.plasmaReactorTempK),
      laughterEchoing: this.laughterLoopEchoing
    };
  }

  /**
   * Détonation thermobarique finale purificatrice
   */
  triggerThermobaricCleansingBlast() {
    this.cleansingBlastExecuted = true;
    this.laughterLoopEchoing = false;
    this.honorPreserved = true;

    return {
      status: 'THERMOBARIC_MICRO_NUCLEAR_CLEANSING_BLAST',
      blastRadiusM: this.blastRadiusM,
      shockwaveOverpressureKpa: 185.0,
      clanSecretsSafeguarded: true,
      honorScoreGranted: 500
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010YautjaDefeatThermalOverloadProtocolSector',
      protocolArmed: this.protocolArmed,
      pneumaticCoverOpened: this.pneumaticCoverOpened,
      countdownTimerRemaining: this.countdownTimerRemaining,
      activeGlyph: this.glyphs[this.currentGlyphIndex],
      cleansingBlastExecuted: this.cleansingBlastExecuted,
      honorPreserved: this.honorPreserved
    };
  }
}
