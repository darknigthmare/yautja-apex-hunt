/**
 * ValVerdeButtressRootTrenchTunnelSector.js
 * 
 * Chantier Level Design #5 - Galerie Souterraine de Racines Contreforts Géantes & Tanière de Sanglier.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Claustrophobic subterranean crawlspace beneath giant buttress roots of a massive 200-year-old kapok tree.
 * - Vertical clearance restricted to 0.85m: forces belly crawling in alluvial silt.
 * - 100% overhead cover: massive root buttresses (30cm thick hardwood) completely shield from overhead plasma fire.
 * - Mud-caked ceiling provides continuous thermal shielding against bio-mask scanning from the canopy.
 * - Tunnel nodes: Mud Entrance, Root Choke-Point, Secret Ambush Sump, and Deadfall Liana Chamber.
 * - Close-quarters knife duel mechanics within tight subterranean spaces.
 */

export class ValVerdeButtressRootTrenchTunnelSector {
  /**
   * @param {Object} options
   * @param {number} [options.tunnelLengthM=14.5]
   * @param {number} [options.ceilingClearanceM=0.85]
   */
  constructor(options = {}) {
    this.tunnelLengthM = options.tunnelLengthM ?? 14.5;
    this.ceilingClearanceM = options.ceilingClearanceM ?? 0.85;

    this.playerInsideTunnel = false;
    this.currentPositionM = 0;
  }

  /**
   * Enters the subterranean crawlspace beneath the roots.
   * @returns {Object} Entry status
   */
  enterRootTunnel() {
    this.playerInsideTunnel = true;
    this.currentPositionM = 0.5;

    return {
      success: true,
      playerInsideTunnel: true,
      ceilingClearanceM: this.ceilingClearanceM,
      overheadPlasmaShielded: true,
      thermalScanOccluded: true,
      crawlSpeedMps: 0.9,
      acousticDampingScore: 82
    };
  }

  /**
   * Crawls forward along the tunnel towards specific nodes.
   * @param {number} distanceM - Distance advanced
   * @returns {Object} Position update
   */
  crawlAdvance(distanceM = 3.0) {
    if (!this.playerInsideTunnel) {
      return { success: false, reason: 'NOT_INSIDE_TUNNEL' };
    }

    this.currentPositionM = Math.min(this.tunnelLengthM, this.currentPositionM + distanceM);
    const reachedExit = this.currentPositionM >= this.tunnelLengthM;

    let currentNode = 'ROOT_CHOKE_POINT';
    if (this.currentPositionM >= 10.0) currentNode = 'DEADFALL_LIANA_CHAMBER';
    else if (this.currentPositionM >= 5.0) currentNode = 'AMBUSH_SUMP_ALCOVE';

    return {
      success: true,
      currentPositionM: this.currentPositionM,
      currentNode,
      reachedExit,
      closeQuartersCombatBonus: true,
      crawlingMudSquishDb: 34
    };
  }

  /**
   * Exits tunnel into the open deadfall clearing.
   * @returns {Object} Exit status
   */
  exitTunnelIntoClearing() {
    this.playerInsideTunnel = false;

    return {
      success: true,
      playerInsideTunnel: false,
      emergedIntoClearing: true,
      deadfallTriggerWithinReach: true
    };
  }
}
