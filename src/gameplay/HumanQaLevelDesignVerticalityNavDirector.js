/**
 * HumanQaLevelDesignVerticalityNavDirector.js
 * 
 * Chantier Level Design #8 & Navigation System - Réticule Altimétrique & Topographie 3D de Canopée.
 * Addresses playtester feedback: "When traversing vertical multi-tier level structures (treetops, industrial catwalks,
 * pyramid shafts, transmission towers), the HUD provides zero elevation feedback, fall damage thresholds,
 * or branch runway connectivity vectors, leading to disorienting blind falls."
 * 
 * Provides:
 * - Real-time altimetric elevation readout (meters above ground level)
 * - 3D tactical vantage score evaluation (0 to 100%)
 * - Fall kinetic impact risk classification (SAFE, TACTICAL_ROLL, HEAVY_DAMAGE, FATAL)
 * - Branch runway connectivity node linking
 * - DOM HUD elements mounting helper (.vertical-topography-elevation-hud)
 */

export class HumanQaLevelDesignVerticalityNavDirector {
  /**
   * @param {Object} options
   * @param {number} [options.currentElevationM=0.0]
   * @param {number} [options.fatalDropThresholdM=28.0]
   */
  constructor(options = {}) {
    this.currentElevationM = options.currentElevationM || 0.0;
    this.fatalDropThresholdM = options.fatalDropThresholdM || 28.0;

    this.hudMounted = false;
    this.vantageNodes = [];
    this.activeVantageScorePct = 0.0;
  }

  /**
   * Evaluates the vertical vantage point at a given player coordinate.
   * @param {number} elevationM
   * @param {number} surroundingTerrainAvgM
   * @param {number} visibleSightlinesCount
   * @returns {Object} Tactical elevation telemetry
   */
  evaluateVerticalVantage(elevationM = 24.0, surroundingTerrainAvgM = 2.0, visibleSightlinesCount = 8) {
    this.currentElevationM = elevationM;
    const heightAdvantageM = Math.max(0, elevationM - surroundingTerrainAvgM);

    // Calculate tactical vantage score
    const vantageScore = Math.min(100.0, heightAdvantageM * 3.8 + visibleSightlinesCount * 2.5);
    this.activeVantageScorePct = Number(vantageScore.toFixed(1));

    // Fall risk classification
    let fallRiskCategory = 'SAFE';
    let expectedImpactDamage = 0;
    let safeRollFeasible = true;

    if (heightAdvantageM > 25.0) {
      fallRiskCategory = 'FATAL_WITHOUT_GRAPPLE';
      expectedImpactDamage = 999;
      safeRollFeasible = false;
    } else if (heightAdvantageM > 14.0) {
      fallRiskCategory = 'HEAVY_IMPACT_DAMAGE';
      expectedImpactDamage = Math.round((heightAdvantageM - 14.0) * 28 + 60);
      safeRollFeasible = false;
    } else if (heightAdvantageM > 4.5) {
      fallRiskCategory = 'TACTICAL_ROLL_REQUIRED';
      expectedImpactDamage = 15;
      safeRollFeasible = true;
    }

    return {
      currentElevationM: this.currentElevationM,
      heightAdvantageM: Number(heightAdvantageM.toFixed(1)),
      vantageScorePct: this.activeVantageScorePct,
      fallRiskCategory,
      expectedImpactDamage,
      safeRollFeasible,
      tacticalRating: this.activeVantageScorePct >= 75.0 ? 'DOMINANT_HIGH_GROUND' : 'STANDARD_ELEVATION'
    };
  }

  /**
   * Registers or updates nearby canopy branch navigation nodes.
   * @param {Array<Object>} nodes
   * @returns {Object} Navigation graph update
   */
  updateCanopyRunwayNodes(nodes = []) {
    this.vantageNodes = nodes.map((node, i) => ({
      id: node.id || `node-${i + 1}`,
      heightM: node.heightM || 20.0,
      runwayLengthM: node.runwayLengthM || 10.0,
      jumpDistanceM: node.jumpDistanceM || 4.5,
      isReachable: (node.jumpDistanceM || 4.5) <= 6.5
    }));

    return {
      nodeCount: this.vantageNodes.length,
      reachableNodesCount: this.vantageNodes.filter(n => n.isReachable).length,
      nodes: this.vantageNodes
    };
  }

  /**
   * Mounts the vertical topography elevation HUD component into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountVerticalityHUD(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.vertical-topography-elevation-hud') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'vertical-topography-elevation-hud active';

      const altimeter = document.createElement('div');
      altimeter.className = 'altimeter-readout';
      altimeter.textContent = `ALT: ${this.currentElevationM.toFixed(1)}m`;
      container.appendChild(altimeter);

      const scoreMeter = document.createElement('div');
      scoreMeter.className = 'vantage-score-meter';
      scoreMeter.textContent = `VANTAGE: ${this.activeVantageScorePct}%`;
      container.appendChild(scoreMeter);

      if (parentElement) {
        parentElement.appendChild(container);
      }
      this.hudMounted = true;
    }
    return container;
  }
}
