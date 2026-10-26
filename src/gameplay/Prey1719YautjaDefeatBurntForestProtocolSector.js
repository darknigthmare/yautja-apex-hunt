/**
 * Prey1719YautjaDefeatBurntForestProtocolSector.js
 *
 * Chantier de Level Design 7 (v192) - Prey (2022) Burnt Forest Clearing & User Rule Implementation
 * 1:1 Canonical Level Design & User Rule:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Règle d'Activation Stricte :
 * Ce protocole ne s'active STRICTEMENT QUE si :
 * 1. Le joueur est dans le rôle d'un chasseur Yautja Feral (isYautjaPlayer === true)
 * 2. Le joueur subit une défaite mortelle dans l'affrontement (healthPoints <= 0)
 * 3. La partie se déroule dans la configuration de Prey (2022) / Forêt Brûlée (Burnt Forest Clearing)
 *
 * Séquence Canonique 1:1 :
 * - Le clapet à ressort forgé du gantelet archaïque saute avec panache d'étincelles et sifflement thermique.
 * - Les 5 glyphes oghamiques rouge sang s'allument séquentiellement : ᚐ -> ᚑ -> ᚒ -> ᚓ -> ᚔ.
 * - Le rire moqueur guttural numérisé résonne à 105 dB à travers les troncs calcinés et la brume de cendre.
 * - Compte à rebours de 15,0 secondes accordé aux guerriers comanches et trappeurs pour fuir.
 * - Température du cœur thermique montant à 1,4e7 Kelvin.
 * - Déflagration micro-nucléaire (rayon 65m) pulvérisant tout alliage métallique alien (+500 Honneur).
 */

export class Prey1719YautjaDefeatBurntForestProtocolSector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isYautjaPlayer=false] Si le joueur actuel incarne le Yautja Feral
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
    this.archaicSpringCoverOpened = false;
    this.glyphDisplayActive = false;
    this.laughterLoopEchoing = false;
    this.countdownTimerRemaining = this.countdownDurationSeconds;
    this.thermalCoreTempK = 300.0;
    this.cleansingBlastExecuted = false;
    this.honorPreserved = false;

    this.glyphs = ['ᚐ', 'ᚑ', 'ᚒ', 'ᚓ', 'ᚔ'];
    this.currentGlyphIndex = 0;
  }

  /**
   * Évaluation rigoureuse de la condition utilisateur :
   * "uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
   * @param {Object} context
   * @param {boolean} context.isYautja
   * @param {number} context.healthPoints
   * @param {string} [context.configuration='PREY_1719_BURNT_FOREST']
   */
  evaluateDefeatCondition(context = {}) {
    const isYautja = context.isYautja ?? this.isYautjaPlayer;
    const health = context.healthPoints ?? 100;
    const config = context.configuration ?? 'PREY_1719_BURNT_FOREST';

    // Condition stricte : DOIT être Yautja ET DOIT avoir perdu (HP <= 0) ET en arène Prey Burnt Forest
    if (isYautja && health <= 0 && config === 'PREY_1719_BURNT_FOREST') {
      return this.armArchaicGauntletOverload();
    }

    return {
      armed: false,
      reason: !isYautja
        ? 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL'
        : (health > 0 ? 'YAUTJA_HUNTER_STILL_ALIVE' : 'INVALID_ARENA_CONFIGURATION')
    };
  }

  /**
   * Armement à ressort du gantelet archaïque et initialisation du compte à rebours
   */
  armArchaicGauntletOverload() {
    this.protocolArmed = true;
    this.archaicSpringCoverOpened = true;
    this.glyphDisplayActive = true;
    this.laughterLoopEchoing = true;
    this.countdownTimerRemaining = this.countdownDurationSeconds;

    return {
      status: 'PREY_BURNT_FOREST_GAUNTLET_OVERLOAD_ARMED',
      countdownSeconds: this.countdownDurationSeconds,
      initialGlyph: this.glyphs[0],
      mockingLaughterDb: this.laughterDb,
      warning: 'THERMAL_PLASMA_PURGE_INITIATED_CONSUMING_BURNT_FOREST'
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

  /**
   * Explosion purificatrice finale
   */
  triggerCleansingMicroNuclearBlast() {
    this.cleansingBlastExecuted = true;
    this.laughterLoopEchoing = false;
    this.honorPreserved = true;

    return {
      status: 'PREY_BURNT_FOREST_MICRO_NUCLEAR_CLEANSING_BLAST',
      blastRadiusM: this.blastRadiusM,
      thermalJoules: 5.4e11,
      biologicalTracesObliterated: true,
      honorScoreGranted: 500,
      alienMetalsDisintegrated: true
    };
  }
}
