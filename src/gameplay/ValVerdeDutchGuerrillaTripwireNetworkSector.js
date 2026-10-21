/**
 * ValVerdeDutchGuerrillaTripwireNetworkSector.js
 * 
 * Chantier Level Design #5 - Système de Guérilla & Pièges d'Alerte Primitifs de Dutch.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch lays an interconnected 60m perimeter defensive perimeter around the mud wallow / arena.
 * - Multi-tiered guerrilla sensor & trap nodes:
 *   1. Brass shell casing windchimes tied with fishing line / jungle vine (58 dB acoustic perimeter alert).
 *   2. Spring-loaded tensioned vine tripwires linked to bamboo lash-whips.
 *   3. M26 fragmentation grenade clusters primed with tension release wire pins.
 * - Resolves intruder tripwire triggers, chain detonations, and perimeter telemetry.
 */

export class ValVerdeDutchGuerrillaTripwireNetworkSector {
  /**
   * @param {Object} options
   * @param {number} [options.perimeterSpanM=60.0]
   * @param {number} [options.totalNodesCount=6]
   */
  constructor(options = {}) {
    this.perimeterSpanM = options.perimeterSpanM ?? 60.0;
    this.totalNodesCount = options.totalNodesCount ?? 6;

    this.nodes = [
      { id: 'node-brass-chime-north', type: 'BRASS_CASING_CHIME', tripped: false, alertLevel: 'ACOUSTIC_WARNING' },
      { id: 'node-bamboo-lash-east', type: 'BAMBOO_LASH_WHIP', tripped: false, alertLevel: 'KINETIC_STRIKE' },
      { id: 'node-m26-grenade-south', type: 'M26_GRENADE_CLUSTER', tripped: false, alertLevel: 'LETHAL_EXPLOSIVE' },
      { id: 'node-brass-chime-west', type: 'BRASS_CASING_CHIME', tripped: false, alertLevel: 'ACOUSTIC_WARNING' },
      { id: 'node-bamboo-lash-northeast', type: 'BAMBOO_LASH_WHIP', tripped: false, alertLevel: 'KINETIC_STRIKE' },
      { id: 'node-m26-grenade-northwest', type: 'M26_GRENADE_CLUSTER', tripped: false, alertLevel: 'LETHAL_EXPLOSIVE' }
    ];

    this.trippedCount = 0;
  }

  /**
   * Simulates an entity passing through a specific perimeter sector.
   * @param {string} nodeId - Target node identifier
   * @returns {Object} Trigger resolution
   */
  triggerPerimeterNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) {
      return { success: false, message: 'NODE_NOT_FOUND' };
    }

    if (node.tripped) {
      return { success: false, message: 'NODE_ALREADY_TRIPPED', node };
    }

    node.tripped = true;
    this.trippedCount++;

    let acousticDb = 58;
    let kineticDamage = 0;
    let shrapnelYield = 0;

    if (node.type === 'BRASS_CASING_CHIME') {
      acousticDb = 58;
    } else if (node.type === 'BAMBOO_LASH_WHIP') {
      acousticDb = 74;
      kineticDamage = 160;
    } else if (node.type === 'M26_GRENADE_CLUSTER') {
      acousticDb = 132;
      kineticDamage = 320;
      shrapnelYield = 450;
    }

    return {
      success: true,
      nodeId: node.id,
      nodeType: node.type,
      alertLevel: node.alertLevel,
      acousticDb,
      kineticDamage,
      shrapnelYield,
      intruderAlertRaised: true
    };
  }

  /**
   * Evaluates entire perimeter security status.
   * @returns {Object} Network status
   */
  getPerimeterStatus() {
    return {
      perimeterSpanM: this.perimeterSpanM,
      totalNodesCount: this.nodes.length,
      trippedCount: this.trippedCount,
      intactCount: this.nodes.length - this.trippedCount,
      integrityPct: Math.round(((this.nodes.length - this.trippedCount) / this.nodes.length) * 100),
      nodes: this.nodes.map(n => ({ id: n.id, type: n.type, tripped: n.tripped }))
    };
  }
}
