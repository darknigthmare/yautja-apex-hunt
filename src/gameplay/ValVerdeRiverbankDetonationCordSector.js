/**
 * ValVerdeRiverbankDetonationCordSector.js
 * 
 * Chantier Level Design #4 - Épreuve du Piégeage des Rivières & Fil Détonant de Grenades de Dutch.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch stretches military primacord (detonation cord) across shallow riverbank crossings.
 * - Connected to 4x M26 fragmentation grenades anchored beneath river boulders.
 * - Submerged trip line: when the Hunter wades into the river ford, the cord detonates with velocity 7,000 m/s.
 * - Creates a 140 dB wall of water and shrapnel (550 steel fragments) that short-circuits cloaking and blinds the Hunter.
 */

export class ValVerdeRiverbankDetonationCordSector {
  /**
   * @param {Object} options
   * @param {number} [options.riverSpanM=22.0]
   * @param {number} [options.chargesCount=4]
   */
  constructor(options = {}) {
    this.riverSpanM = options.riverSpanM ?? 22.0;
    this.chargesCount = options.chargesCount ?? 4;

    this.primacordArmed = true;
    this.detonated = false;
  }

  /**
   * Evaluates the arming status of the river primacord trap.
   * @returns {Object} Trap status
   */
  getTrapStatus() {
    return {
      riverSpanM: this.riverSpanM,
      chargesCount: this.chargesCount,
      primacordArmed: this.primacordArmed,
      detonated: this.detonated,
      submergedCordConcealed: true
    };
  }

  /**
   * Triggers the river detonation cord when an entity wades across the crossing.
   * @param {number} waterDepthM
   * @returns {Object} Detonation telemetry
   */
  triggerRiverDetonation(waterDepthM = 0.5) {
    if (!this.primacordArmed || this.detonated) {
      return { success: false, reason: 'TRAP_NOT_ARMED_OR_ALREADY_FIRED' };
    }

    this.detonated = true;
    this.primacordArmed = false;

    return {
      success: true,
      detonationSpeedMps: 7000.0,
      chargesCount: this.chargesCount,
      waterGeyserHeightM: 14.5,
      shrapnelCount: 550,
      acousticDetonationDb: 140,
      forcedCloakShortCircuit: true,
      hunterDisorientedDurationSec: 3.5
    };
  }
}
