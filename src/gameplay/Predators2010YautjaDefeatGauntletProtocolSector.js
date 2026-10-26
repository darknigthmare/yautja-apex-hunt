/**
 * Predators2010YautjaDefeatGauntletProtocolSector.js
 *
 * Chantier de Level Design 7 (v184) - Predators (2010) Preserve & User Rule Implementation
 * 1:1 Canonical Level Design & User Rule:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Condition Stricte d'Activation :
 * Ce protocole ne s'active STRICTEMENT QUE si :
 * 1. Le joueur incarne un Yautja (isYautjaPlayer === true)
 * 2. Le chasseur subit une défaite mortelle (healthPoints <= 0)
 * 3. Le combat se déroule dans la configuration de la réserve de chasse de Predators (2010)
 *
 * Séquence Canonique 1:1 :
 * - Le clapet du gantelet s'ouvre sous ressort (snap mécanique).
 * - Les glyphes extraterrestres rouges s'illuminent et défilent en compte à rebours : ᚦ -> ᛉ -> ᛟ -> ᚢ.
 * - Le rire moqueur synthétique enregistré (Dutch/Billy mimicry) retentit en écho à travers la jungle (105 dB).
 * - Fenêtre d'évacuation tactique de 15,0 secondes.
 * - Surchauffe thermique critique du cœur de plasma (1,2e7 K).
 * - Détonation micro-nucléaire de purification (rayon 50m, Delta P >= 185 kPa) détruisant toute technologie Yautja (+500 Honneur).
 */

export class Predators2010YautjaDefeatGauntletProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false] Si le joueur actuel est un Yautja
   * @param {number} [options.countdownDurationSeconds=15.0] Durée du compte à rebours (s)
   * @param {number} [options.blastRadiusM=50.0] Rayon de la détonation nucléaire (m)
   * @param {number} [options.audioLaughterDb=105.0] Volume de diffusion du rire (dB)
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
    this.laughterEchoing = false;
    this.countdownTimerRemaining = this.countdownDurationSeconds;
    this.coreOverloadTemperatureK = 300.0;
    this.vaporizationDetonated = false;
    this.honorPreserved = false;

    this.glyphs = ['ᚦ', 'ᛉ', 'ᛟ', 'ᚢ'];
    this.activeGlyphIndex = 0;
  }

  /**
   * Évaluation stricte de la condition utilisateur :
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

    // DOIT être Yautja ET DOIT avoir perdu (HP <= 0) ET en configuration de la réserve de chasse
    if (isYautja && health <= 0 && config === 'PREDATORS_2010_GAME_PRESERVE') {
      return this.armGauntletSelfDestruct();
    }

    return {
      armed: false,
      reason: !isYautja
        ? 'HUMAN_PLAYER_CANNOT_ARM_YAUTJA_PROTOCOL'
        : (health > 0 ? 'YAUTJA_SURVIVING_PROTOCOL_STANDBY' : 'OUTSIDE_PRESERVE_CONFIGURATION')
    };
  }

  /**
   * Armement du gantelet et amorçage du compte à rebours
   */
  armGauntletSelfDestruct() {
    this.protocolArmed = true;
    this.gauntletLidOpen = true;
    this.glyphsActive = true;
    this.laughterEchoing = true;
    this.countdownTimerRemaining = this.countdownDurationSeconds;

    return {
      status: 'YAUTJA_GAUNTLET_SELF_DESTRUCT_INITIATED',
      gauntletLid: 'FLIPPED_OPEN',
      countdownSeconds: this.countdownDurationSeconds,
      initialGlyph: this.glyphs[0],
      laughterVolumeDb: this.audioLaughterDb,
      cleanseRadiusM: this.blastRadiusM
    };
  }

  /**
   * Défilement du compte à rebours par delta
   * @param {number} deltaSeconds
   */
  tickCountdown(deltaSeconds) {
    if (!this.protocolArmed || this.vaporizationDetonated) {
      return { active: false, detonated: this.vaporizationDetonated };
    }

    this.countdownTimerRemaining = Math.max(0.0, this.countdownTimerRemaining - deltaSeconds);
    const progress = 1.0 - (this.countdownTimerRemaining / this.countdownDurationSeconds);

    this.activeGlyphIndex = Math.floor(progress * this.glyphs.length) % this.glyphs.length;
    this.coreOverloadTemperatureK = 300.0 * Math.exp(10.6 * progress); // 1.2e7 K au point zéro

    if (this.countdownTimerRemaining === 0.0) {
      return this.detonateMicroNuclearCleansing();
    }

    return {
      active: true,
      remainingSeconds: parseFloat(this.countdownTimerRemaining.toFixed(2)),
      activeGlyph: this.glyphs[this.activeGlyphIndex],
      coreTempK: Math.round(this.coreOverloadTemperatureK),
      laughterEchoing: this.laughterEchoing
    };
  }

  /**
   * Détonation micro-nucléaire thermique
   */
  detonateMicroNuclearCleansing() {
    this.vaporizationDetonated = true;
    this.laughterEchoing = false;
    this.honorPreserved = true;

    return {
      status: 'MICRO_NUCLEAR_CLEANSING_VAPORIZATION',
      blastRadiusM: this.blastRadiusM,
      shockwaveOverpressureKpa: 185.0,
      clanSecretsPreserved: true,
      honorScoreGranted: 500
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010YautjaDefeatGauntletProtocolSector',
      protocolArmed: this.protocolArmed,
      gauntletLidOpen: this.gauntletLidOpen,
      countdownTimerRemaining: this.countdownTimerRemaining,
      activeGlyph: this.glyphs[this.activeGlyphIndex],
      vaporizationDetonated: this.vaporizationDetonated,
      honorPreserved: this.honorPreserved
    };
  }
}
