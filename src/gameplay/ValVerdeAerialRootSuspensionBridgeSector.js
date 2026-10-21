/**
 * ValVerdeAerialRootSuspensionBridgeSector.js
 * 
 * Chantier Level Design #7 - Arène de la Crevasse & Pont Suspendu de Racines Aériennes.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Living aerial root bridge formed by entwined ficus and liana vines spanning an 18m chasm over a 24m gorge.
 * - Dynamic structural sway (sway angle up to 12 deg under tropical winds and heavy 200kg Yautja footsteps).
 * - Destructible load-bearing root strands: plasmacaster fire or heavy machete slashes can sever supporting cords.
 * - Severing more than 4 support strands causes bridge failure, plunging combatants into the river torrent below.
 */

export class ValVerdeAerialRootSuspensionBridgeSector {
  /**
   * @param {Object} options
   * @param {number} [options.bridgeSpanM=18.0]
   * @param {number} [options.gorgeDepthM=24.0]
   */
  constructor(options = {}) {
    this.bridgeSpanM = options.bridgeSpanM ?? 18.0;
    this.gorgeDepthM = options.gorgeDepthM ?? 24.0;

    this.totalSupportStrands = 8;
    this.severedStrands = 0;
    this.bridgeCollapsed = false;
  }

  /**
   * Traverses the suspension root bridge.
   * @param {number} traverseSpeedMps
   * @param {number} entityMassKg
   * @returns {Object} Bridge traverse telemetry
   */
  traverseRootBridge(traverseSpeedMps = 2.0, entityMassKg = 105.0) {
    if (this.bridgeCollapsed) {
      return { success: false, reason: 'BRIDGE_COLLAPSED' };
    }

    const dynamicSwayAngleDeg = Math.min(15.0, (entityMassKg / 100.0) * 3.5 + traverseSpeedMps * 1.8);
    const slipRiskPct = Math.round(dynamicSwayAngleDeg * 3.2);

    return {
      success: true,
      bridgeSpanM: this.bridgeSpanM,
      gorgeDepthM: this.gorgeDepthM,
      dynamicSwayAngleDeg: Math.round(dynamicSwayAngleDeg * 10) / 10,
      slipRiskPct,
      bridgeIntegrityPct: Math.round(((this.totalSupportStrands - this.severedStrands) / this.totalSupportStrands) * 100),
      bridgeCreakAcousticDb: 58
    };
  }

  /**
   * Severs one or more root strands via weapons fire or blade slashes.
   * @param {number} [strandsCount=1]
   * @returns {Object} Sever outcome
   */
  severRootStrand(strandsCount = 1) {
    this.severedStrands = Math.min(this.totalSupportStrands, this.severedStrands + strandsCount);
    if (this.severedStrands >= 5) {
      this.bridgeCollapsed = true;
    }

    return {
      success: true,
      severedStrands: this.severedStrands,
      remainingStrands: this.totalSupportStrands - this.severedStrands,
      bridgeCollapsed: this.bridgeCollapsed,
      dropIntoGorgeTriggered: this.bridgeCollapsed,
      snapAcousticDb: 76
    };
  }
}
