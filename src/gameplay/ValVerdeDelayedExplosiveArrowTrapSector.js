/**
 * ValVerdeDelayedExplosiveArrowTrapSector.js
 * 
 * Chantier Level Design #2 - Flèches Explosives à Détonation Retardée & Pièges Multiples Coordonnés.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch crafts arrows with slow-burning sulfur/fuse-delay cords (adjustable timer: 3.0s to 8.0s).
 * - Coordinated multi-trap tactical diversion:
 *   - Dutch fires a delayed arrow into a hollow kapok trunk 40m away.
 *   - The burning cord hisses softly (38 dB) before detonating in a powerful flash-bang explosion (132 dB).
 *   - The Jungle Hunter moves to investigate the acoustic signature, walking directly into a concealed punji pit
 *     or the deadfall killzone.
 * - Evaluates diversion success rate, trap coordination synergy, and shrapnel dispersion.
 */

export class ValVerdeDelayedExplosiveArrowTrapSector {
  /**
   * @param {Object} options
   * @param {number} [options.defaultFuseDelaySec=4.5]
   */
  constructor(options = {}) {
    this.defaultFuseDelaySec = options.defaultFuseDelaySec ?? 4.5;
    this.arrowsRemaining = 3;
    this.activeDelayedTraps = [];
  }

  /**
   * Fires a delayed explosive arrow into target terrain/tree to establish a timed diversion trap.
   * @param {string} targetLocationId - e.g. 'HOLLOW_KAPOK_TRUNK_NORTH'
   * @param {number} distanceM - Distance to target (m)
   * @param {number} [fuseDelaySec=4.5] - Timer duration
   * @returns {Object} Fired trap telemetry
   */
  fireDelayedExplosiveArrow(targetLocationId = 'HOLLOW_KAPOK_TRUNK_NORTH', distanceM = 35.0, fuseDelaySec = 4.5) {
    if (this.arrowsRemaining <= 0) {
      return { success: false, reason: 'OUT_OF_EXPLOSIVE_ARROWS' };
    }

    this.arrowsRemaining--;
    const trap = {
      id: `delay-arrow-${Date.now()}`,
      targetLocationId,
      distanceM,
      fuseDelaySec,
      remainingSec: fuseDelaySec,
      detonated: false
    };

    this.activeDelayedTraps.push(trap);

    return {
      success: true,
      trapId: trap.id,
      targetLocationId,
      distanceM,
      fuseDelaySec,
      arrowsRemaining: this.arrowsRemaining,
      fuseHissAcousticDb: 38,
      primedForDiversion: true
    };
  }

  /**
   * Updates fuse timers on all active delayed traps.
   * @param {number} deltaSeconds
   * @returns {Object} Timer tick update and detonations
   */
  updateDelayTimers(deltaSeconds = 1.0) {
    const detonatedTraps = [];

    for (const trap of this.activeDelayedTraps) {
      if (!trap.detonated) {
        trap.remainingSec = Math.max(0, Math.round((trap.remainingSec - deltaSeconds) * 10) / 10);
        if (trap.remainingSec <= 0) {
          trap.detonated = true;
          detonatedTraps.push({
            trapId: trap.id,
            targetLocationId: trap.targetLocationId,
            blastDamageJoules: 35000,
            shrapnelCount: 160,
            acousticBlastDb: 132,
            decoyLureRadiusM: 45.0
          });
        }
      }
    }

    return {
      activeTrapsCount: this.activeDelayedTraps.filter(t => !t.detonated).length,
      detonatedCount: detonatedTraps.length,
      detonatedTraps
    };
  }

  /**
   * Resolves coordinated diversion to bait the Hunter into a secondary trap (punji pit or deadfall).
   * @param {string} secondaryTrapType - 'PUNJI_PIT' | 'COUNTERWEIGHTED_DEADFALL'
   * @returns {Object} Tactical synergy outcome
   */
  resolveCoordinatedTrapSynergy(secondaryTrapType = 'COUNTERWEIGHTED_DEADFALL') {
    const hadDetonation = this.activeDelayedTraps.some(t => t.detonated);
    if (!hadDetonation) {
      return { success: false, reason: 'NO_ACTIVE_DIVERSION_EXPLOSION' };
    }

    return {
      success: true,
      diversionSuccessful: true,
      hunterBaitPositionConfirmed: true,
      secondaryTrapType,
      killzoneSynergyMultiplier: 2.5,
      hunterFlankVulnerable: true
    };
  }
}
