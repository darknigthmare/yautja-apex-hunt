/**
 * Prey1719BigBeardCutlassDuelSector.js
 *
 * Chantier de Level Design 4 (v193) - Prey (2022) Big Beard French Cutlass Melee Duel
 * 1:1 Canonical Level Design:
 * - Hand-to-hand duel against Big Beard, the hulking French voyageur commander.
 * - Heavy steel cavalry cutlass / sabre delivering cleaving strikes.
 * - Tomahawk parry deflection against high-mass steel impacts.
 * - Comanche low dirt leg sweep and leather tether rope choke/disarm maneuver.
 */

export class Prey1719BigBeardCutlassDuelSector {
  /**
   * @param {Object} options
   * @param {number} [options.cutlassBladeLengthCm=72.0] Longueur de la lame du coutelas en acier (cm)
   * @param {number} [options.bigBeardMassKg=115.0] Masse du commandant trappeur (kg)
   */
  constructor(options = {}) {
    this.cutlassBladeLengthCm = options.cutlassBladeLengthCm ?? 72.0;
    this.bigBeardMassKg = options.bigBeardMassKg ?? 115.0;

    // État runtime
    this.heavyCutlassChopDeflected = false;
    this.lowDirtLegSweepExecuted = false;
    this.tetherChokeDisarmLethal = false;
    this.bigBeardDefeated = false;
  }

  /**
   * Parer le coup de taille plongeant du coutelas d'acier au tomahawk
   * @param {number} parryAngleDeg Angle de parade (degrés)
   */
  parryHeavyCutlassChop(parryAngleDeg = 45.0) {
    this.heavyCutlassChopDeflected = true;

    return {
      status: 'HEAVY_STEEL_CUTLASS_CHOP_DEFLECTED',
      parryAngleDeg,
      sparksProduced: true,
      kineticImpactJoules: 1600.0,
      staggerWindowSeconds: 1.2
    };
  }

  /**
   * Exécuter une balayette basse dans la poussière pour déséquilibrer le colosse
   */
  executeLowDirtLegSweep() {
    if (!this.heavyCutlassChopDeflected) {
      return { status: 'FAILED_NO_STAGGER_WINDOW', success: false };
    }

    this.lowDirtLegSweepExecuted = true;

    return {
      status: 'LOW_DIRT_LEG_SWEEP_EXECUTED',
      bigBeardKnockedToGround: true,
      fallImpactJoules: 1800.0,
      groundedVulnerabilityActive: true
    };
  }

  /**
   * Étrangler et désarmer Big Beard à l'aide de la cordelette de cuir du tomahawk
   */
  executeTetherChokeAndDisarm() {
    if (!this.lowDirtLegSweepExecuted) {
      return { status: 'FAILED_OPPONENT_NOT_GROUNDED', success: false };
    }

    this.tetherChokeDisarmLethal = true;
    this.bigBeardDefeated = true;

    return {
      status: 'TETHER_CHOKE_DISARM_LETHAL_EXECUTION',
      cutlassDisarmedAndClaimed: true,
      voyageurLeaderEliminated: true,
      bigBeardDefeated: this.bigBeardDefeated,
      honorScoreGranted: 300
    };
  }
}
