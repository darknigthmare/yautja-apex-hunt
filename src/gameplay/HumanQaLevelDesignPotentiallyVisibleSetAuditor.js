/**
 * HumanQaLevelDesignPotentiallyVisibleSetAuditor.js
 * 
 * Human Playtester QA Audit #5: Spatial Cell Partitioning & Potentially Visible Set (PVS).
 * Solves draw call and lighting overhead during transitions between exterior biomes and underground
 * pyramid chambers/shipwrecks by computing portal visibility graphs and culling occluded sectors.
 */

export class HumanQaLevelDesignPotentiallyVisibleSetAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.maxDrawCallBudget=300]
   */
  constructor(options = {}) {
    this.maxDrawCallBudget = options.maxDrawCallBudget || 300;
    this.cells = new Map();
    this.currentVisibleSet = new Set();
    this.activeCellId = null;
    this.totalDrawCallsEstimated = 0;
  }

  /**
   * Registers a spatial room/sector cell into the navigation PVS graph.
   * @param {string} cellId - Unique identifier (e.g. 'JUNGLE_CANYON', 'PYRAMID_CORRIDOR')
   * @param {Object} bounds - Bounding volume { minX, maxX, minY, maxY, minZ, maxZ }
   * @param {Array<{targetCellId: string, portalOpen: boolean, portalNormal: {x: number, y: number, z: number}}>} portals
   * @param {number} [drawCallCost=35]
   */
  registerCell(cellId, bounds, portals = [], drawCallCost = 35) {
    this.cells.set(cellId, {
      cellId,
      bounds: bounds || { minX: 0, maxX: 10, minY: 0, maxY: 10, minZ: 0, maxZ: 10 },
      portals: Array.isArray(portals) ? portals : [],
      drawCallCost: Number(drawCallCost) || 35
    });
  }

  /**
   * Computes the Potentially Visible Set (PVS) traversing open portals from the active cell.
   * @param {string} startCellId - Player's current containing room cell
   * @param {{x: number, y: number, z: number}} [cameraLookVector]
   * @returns {Object} PVS evaluation
   */
  computePotentiallyVisibleSet(startCellId, cameraLookVector = { x: 0, y: 0, z: 1 }) {
    if (!this.cells.has(startCellId)) {
      return { success: false, reason: 'CELL_NOT_REGISTERED', visibleCells: [] };
    }

    this.activeCellId = startCellId;
    this.currentVisibleSet.clear();
    this.currentVisibleSet.add(startCellId);

    const visited = new Set([startCellId]);
    const queue = [startCellId];
    let drawCalls = this.cells.get(startCellId).drawCallCost;

    while (queue.length > 0) {
      const currentId = queue.shift();
      const cell = this.cells.get(currentId);
      if (!cell) continue;

      for (const portal of cell.portals) {
        if (!portal.portalOpen) continue;
        const neighborId = portal.targetCellId;

        if (!visited.has(neighborId) && this.cells.has(neighborId)) {
          // Check directional alignment with portal normal
          const dot = portal.portalNormal
            ? (portal.portalNormal.x * cameraLookVector.x + portal.portalNormal.y * cameraLookVector.y + portal.portalNormal.z * cameraLookVector.z)
            : 1.0;

          // If portal is facing camera view or neutral, traverse it
          if (dot >= -0.2) {
            visited.add(neighborId);
            this.currentVisibleSet.add(neighborId);
            drawCalls += this.cells.get(neighborId).drawCallCost;
            queue.push(neighborId);
          }
        }
      }
    }

    this.totalDrawCallsEstimated = drawCalls;
    const withinBudget = this.totalDrawCallsEstimated <= this.maxDrawCallBudget;

    return {
      success: true,
      activeCellId: this.activeCellId,
      visibleCells: Array.from(this.currentVisibleSet),
      culledCellCount: this.cells.size - this.currentVisibleSet.size,
      totalDrawCallsEstimated: this.totalDrawCallsEstimated,
      withinBudget
    };
  }

  /**
   * Checks whether a specific room/entity cell is within the active visible set.
   * @param {string} cellId
   * @returns {boolean}
   */
  isCellVisible(cellId) {
    return this.currentVisibleSet.has(cellId);
  }

  /**
   * Retrieves overall PVS audit telemetry.
   * @returns {Object}
   */
  getPvsTelemetry() {
    return {
      registeredCellCount: this.cells.size,
      activeCellId: this.activeCellId,
      visibleCellCount: this.currentVisibleSet.size,
      totalDrawCallsEstimated: this.totalDrawCallsEstimated,
      maxDrawCallBudget: this.maxDrawCallBudget
    };
  }
}
