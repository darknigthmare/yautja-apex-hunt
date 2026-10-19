/**
 * GunnisonFloodedSewerPredalienHiveResinSector.js
 * Chantier 4 (v150) : Égouts inondés de Gunnison & nidification souterraine du Predalien (AVP: Requiem 2007).
 * Tunnels de drainage pluvial envahis par la résine biomécanique du Predalien :
 * - Ralentit la vitesse de déplacement des proies humaines et propage l'écho des pas dans l'eau.
 * - Permet à Wolf (Cleaner) d'asperger son liquide dissolvant bleu corrosif sur les cocons et
 *   la résine pour détruire les preuves biologiques et libérer le passage tout en récupérant de l'honneur.
 */

export class GunnisonFloodedSewerPredalienHiveResinSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_flooded_storm_drain_hive';
    this.resinNodes = (options.resinNodes ?? [
      { id: 'resin_node_north_junction', x: -8, z: 6, dissolved: false, movementSpeedMultiplier: 0.48 },
      { id: 'resin_node_central_spillway', x: 0, z: 14, dissolved: false, movementSpeedMultiplier: 0.45 },
      { id: 'resin_node_south_outfall', x: 10, z: 22, dissolved: false, movementSpeedMultiplier: 0.5 }
    ]).map((n) => ({ ...n }));

    this.state = {
      waterDepthMeters: 0.55,
      acousticSplashPropagationMultiplier: 1.65,
      dissolvedNodesCount: 0,
      cleanerHonorEarned: 0
    };
  }

  evaluateTraversalAt(entity = { x: 0, z: 0 }, audioSynthesizer = null) {
    let speedMultiplier = 0.85; // Ralentissement de base dû à l'eau jusqu'aux genoux
    let inActiveResinNodeId = null;

    for (const node of this.resinNodes) {
      if (node.dissolved) continue;
      const dist = Math.hypot((entity.x ?? 0) - node.x, (entity.z ?? 0) - node.z);
      if (dist <= 4.5) {
        speedMultiplier = node.movementSpeedMultiplier;
        inActiveResinNodeId = node.id;
        break;
      }
    }

    if (audioSynthesizer && typeof audioSynthesizer.playSewerPredalienResinSquelchStep === 'function') {
      audioSynthesizer.playSewerPredalienResinSquelchStep(0.85);
    }

    return {
      speedMultiplier,
      inActiveResinNodeId,
      acousticRippleRadiusMeters: Number((12.0 * this.state.acousticSplashPropagationMultiplier).toFixed(1))
    };
  }

  applyWolfBlueCorrosiveSolvent(nodeId, audioSynthesizer = null) {
    const node = this.resinNodes.find((n) => n.id === nodeId);
    if (!node) {
      return { dissolved: false, reason: 'node_not_found' };
    }
    if (node.dissolved) {
      return { dissolved: false, reason: 'already_dissolved' };
    }

    node.dissolved = true;
    node.movementSpeedMultiplier = 1.0;
    this.state.dissolvedNodesCount += 1;
    this.state.cleanerHonorEarned += 85;

    if (audioSynthesizer && typeof audioSynthesizer.playWolfCorrosiveSolventResinFizz === 'function') {
      audioSynthesizer.playWolfCorrosiveSolventResinFizz(1.1);
    }

    return {
      dissolved: true,
      nodeId: node.id,
      dissolvedNodesCount: this.state.dissolvedNodesCount,
      cleanerHonorEarned: this.state.cleanerHonorEarned
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      dissolvedNodesCount: this.state.dissolvedNodesCount,
      remainingResinNodes: this.resinNodes.filter((n) => !n.dissolved).length,
      cleanerHonorEarned: this.state.cleanerHonorEarned
    };
  }
}
