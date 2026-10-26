/**
 * YautjaDefeatSelfDestructProtocolSector.js
 *
 * Chantier de Level Design 7 (v183) - Predators (2010) & Franchise Canon
 * 1:1 Canonical Level Design & User Rule:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Ce protocole ne s'active STRICTEMENT QUE si :
 * 1. Le joueur incarne un chasseur Yautja (isYautjaPlayer === true)
 * 2. Le joueur subit une défaite mortelle dans l'arène / Game Preserve (healthPoints <= 0)
 *
 * Séquence Canonique 1:1 :
 * - Le clapet du gantelet s'ouvre d'un coup sec.
 * - Les glyphes holographiques extraterrestres rouges s'allument et défilent en compte à rebours.
 * - Le rire moqueur synthétique numérisé (vocal mimicry) retentit en boucle sur 5 harmoniques (105 dB).
 * - Chronomètre d'évacuation de 15.0 secondes avant détonation micro-nucléaire de plasma (rayon létal 50m).
 * - Nettoyage total de la technologie Yautja pour préserver les secrets du clan (+500 Honneur).
 */

export class YautjaDefeatSelfDestructProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false] Si le joueur actuel est un Yautja
   * @param {number} [options.countdownDurationSeconds=15.0] Durée du compte à rebours (s)
   * @param {number} [options.blastRadiusM=50.0] Rayon de vaporisation thermique (m)
   * @param {number} [options.audioLaughterDb=105.0] Intensité sonore du rire moqueur (dB)
   */
  constructor(options = {}) {
    this.isYautjaPlayer = options.isYautjaPlayer ?? false;
    this.countdownDurationSeconds = options.countdownDurationSeconds ?? 15.0;
    this.blastRadiusM = options.blastRadiusM ?? 50.0;
    this.audioLaughterDb = options.audioLaughterDb ?? 105.0;

    // État du protocole
    this.protocolArmed = false;
    this.gauntletLidOpen = false;
    this.glyphsActive = false;
    this.laughterLoopActive = false;
    this.countdownTimerRemaining = this.countdownDurationSeconds;
    this.plasmaCoreTemperatureKelvin = 300.0; // Température ambiante de repos
    this.detonationExecuted = false;
    this.honorPreserved = false;

    // Glyphes d'autodestruction canoniques (représentation textuelle des symboles Yautja)
    this.glyphSequence = ['ᚦ', 'ᛉ', 'ᛟ', 'ᚢ'];
    this.currentGlyphIndex = 0;
  }

  /**
   * Vérifie la condition stricte demandée par l'utilisateur :
   * "uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
   * @param {Object} state
   * @param {boolean} state.isYautja
   * @param {number} state.healthPoints
   * @param {boolean} state.inArenaConfiguration
   */
  evaluateDefeatCondition(state = {}) {
    const isYautja = state.isYautja ?? this.isYautjaPlayer;
    const health = state.healthPoints ?? 100;
    const inConfig = state.inArenaConfiguration ?? true;

    // Condition stricte : DOIT être Yautja ET DOIT avoir perdu (HP <= 0) ET en configuration d'arène
    if (isYautja && health <= 0 && inConfig) {
      return this.armSelfDestructSequence();
    }

    return {
      armed: false,
      reason: !isYautja
        ? 'PLAYER_IS_HUMAN_PROTOCOL_INERT'
        : (health > 0 ? 'YAUTJA_ALIVE_PROTOCOL_DORMANT' : 'INVALID_ARENA_CONFIGURATION')
    };
  }

  /**
   * Armement de la séquence d'autodestruction
   */
  armSelfDestructSequence() {
    this.protocolArmed = true;
    this.gauntletLidOpen = true;
    this.glyphsActive = true;
    this.laughterLoopActive = true;
    this.countdownTimerRemaining = this.countdownDurationSeconds;

    return {
      armed: true,
      status: 'YAUTJA_DEFEAT_SELF_DESTRUCT_ARMED',
      gauntletLid: 'OPEN',
      glyphs: this.glyphSequence,
      countdownSeconds: this.countdownDurationSeconds,
      laughterAudioDb: this.audioLaughterDb,
      warning: 'MICRO_NUCLEAR_PLASMA_OVERLOAD_INITIATED'
    };
  }

  /**
   * Avance le compte à rebours et fait monter la surchauffe du cœur de plasma
   * @param {number} deltaSeconds
   */
  updateCountdown(deltaSeconds) {
    if (!this.protocolArmed || this.detonationExecuted) {
      return { active: false, detonated: this.detonationExecuted };
    }

    this.countdownTimerRemaining = Math.max(0.0, this.countdownTimerRemaining - deltaSeconds);

    // Progression exponentielle de la température du cœur
    const progress = 1.0 - (this.countdownTimerRemaining / this.countdownDurationSeconds);
    this.plasmaCoreTemperatureKelvin = 300.0 * Math.exp(10.6 * progress); // Atteint 1.2e7 K au détonateur
    this.currentGlyphIndex = Math.floor(progress * this.glyphSequence.length) % this.glyphSequence.length;

    if (this.countdownTimerRemaining === 0.0) {
      return this.triggerNuclearDetonation();
    }

    return {
      active: true,
      remainingSeconds: parseFloat(this.countdownTimerRemaining.toFixed(2)),
      currentGlyph: this.glyphSequence[this.currentGlyphIndex],
      coreTempKelvin: Math.round(this.plasmaCoreTemperatureKelvin),
      laughterEchoing: this.laughterLoopActive
    };
  }

  /**
   * Détonation finale purificatrice
   */
  triggerNuclearDetonation() {
    this.detonationExecuted = true;
    this.laughterLoopActive = false;
    this.honorPreserved = true;

    return {
      status: 'TACTICAL_MICRO_NUCLEAR_DETONATION',
      blastRadiusM: this.blastRadiusM,
      shockwaveOverpressureKpa: 185.0,
      clanTechnologyVaporized: true,
      honorScoreGranted: 500
    };
  }

  /**
   * Rapport télémétrique complet pour l'audit QA
   */
  getTelemetryReport() {
    return {
      sectorName: 'YautjaDefeatSelfDestructProtocolSector',
      isYautjaPlayer: this.isYautjaPlayer,
      protocolArmed: this.protocolArmed,
      gauntletLidOpen: this.gauntletLidOpen,
      glyphsActive: this.glyphsActive,
      laughterLoopActive: this.laughterLoopActive,
      countdownTimerRemaining: this.countdownTimerRemaining,
      detonationExecuted: this.detonationExecuted,
      honorPreserved: this.honorPreserved
    };
  }
}
