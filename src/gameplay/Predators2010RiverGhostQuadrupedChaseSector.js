/**
 * Predators2010RiverGhostQuadrupedChaseSector.js
 *
 * Chantier de Level Design 1 (v185) - Predators (2010)
 * 1:1 Canonical Level Design: River Ghost Quadrupedal Chase & Mossy Boulder Hazards
 *
 * Canonical Scene: The squad encounters an exotic bipedal alien prey ("River Ghost") with pale mottled skin,
 * an elongated cranial crest, and quadrupedal bounding locomotion (velocity ~14 m/s). It darts across
 * moss-covered river boulders (friction mu = 0.22), drawing the squad into a high-speed pursuit while
 * avoiding dangerous slip-and-fall hazards.
 */

export class Predators2010RiverGhostQuadrupedChaseSector {
  /**
   * @param {Object} options
   * @param {number} [options.riverGhostTopSpeedMs=14.0] Vitesse de pointe du River Ghost (m/s)
   * @param {number} [options.boulderFrictionMu=0.22] Coefficient de friction sur les rochers moussus
   * @param {number} [options.chaseDistanceM=120.0] Distance totale de la poursuite dans le canyon (m)
   */
  constructor(options = {}) {
    this.riverGhostTopSpeedMs = options.riverGhostTopSpeedMs ?? 14.0;
    this.boulderFrictionMu = options.boulderFrictionMu ?? 0.22;
    this.chaseDistanceM = options.chaseDistanceM ?? 120.0;

    // État runtime
    this.riverGhostSpotted = false;
    this.chaseActive = false;
    this.distanceCoveredM = 0.0;
    this.currentGhostVelocityMs = 0.0;
    this.squadSlippedOnBoulder = false;
    this.riverGhostCornered = false;
    this.quadrupedalStanceActive = false;
  }

  /**
   * Repérage initial de la créature dans les fougères bioluminescentes
   */
  spotRiverGhost() {
    this.riverGhostSpotted = true;
    this.quadrupedalStanceActive = true;
    this.currentGhostVelocityMs = 6.5;

    return {
      status: 'RIVER_GHOST_SPOTTED_IN_FOLIAGE',
      cranialCrestVisible: true,
      alienPreyClassification: 'XENOMORPHIC_BIPED_RUNNER',
      initialVelocityMs: this.currentGhostVelocityMs
    };
  }

  /**
   * Démarrage de la poursuite sur les rochers humides
   * @param {number} squadPursuitSpeedMs Vitesse de course de l'escouade (m/s)
   * @param {number} deltaSeconds
   */
  pursueAcrossRiverBoulders(squadPursuitSpeedMs = 11.5, deltaSeconds = 1.0) {
    if (!this.riverGhostSpotted) {
      return { success: false, reason: 'TARGET_NOT_SPOTTED_YET' };
    }

    this.chaseActive = true;
    // Le River Ghost accélère sur 4 membres
    this.currentGhostVelocityMs = Math.min(this.riverGhostTopSpeedMs, this.currentGhostVelocityMs + 2.8 * deltaSeconds);
    this.distanceCoveredM += squadPursuitSpeedMs * deltaSeconds;

    // Calcul du risque de dérapage sur roche moussue si vitesse > 10 m/s et friction basse
    const slipRiskThreshold = 10.0 * (1.0 - this.boulderFrictionMu);
    if (squadPursuitSpeedMs > slipRiskThreshold && Math.random() < 0.25) {
      this.squadSlippedOnBoulder = true;
    }

    if (this.distanceCoveredM >= this.chaseDistanceM) {
      this.riverGhostCornered = true;
      this.chaseActive = false;
      return {
        success: true,
        status: 'RIVER_GHOST_CORNERED_AT_WATERFALL_CHASM',
        distanceTraversedM: this.distanceCoveredM,
        slipped: this.squadSlippedOnBoulder,
        waterfallPlungeImminent: true
      };
    }

    return {
      success: true,
      status: 'PURSUIT_IN_PROGRESS',
      distanceTraversedM: parseFloat(this.distanceCoveredM.toFixed(1)),
      ghostVelocityMs: parseFloat(this.currentGhostVelocityMs.toFixed(1)),
      slipped: this.squadSlippedOnBoulder
    };
  }

  /**
   * Neutralisation propre de la glissade par récupération d'équilibre
   */
  recoverBalance() {
    this.squadSlippedOnBoulder = false;
    return {
      status: 'FOOTING_RECOVERED_ON_DRY_ROCK',
      speedRestored: true
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010RiverGhostQuadrupedChaseSector',
      riverGhostSpotted: this.riverGhostSpotted,
      chaseActive: this.chaseActive,
      distanceCoveredM: this.distanceCoveredM,
      currentGhostVelocityMs: this.currentGhostVelocityMs,
      boulderFrictionMu: this.boulderFrictionMu,
      riverGhostCornered: this.riverGhostCornered
    };
  }
}
