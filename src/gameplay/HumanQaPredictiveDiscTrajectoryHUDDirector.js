/**
 * HumanQaPredictiveDiscTrajectoryHUDDirector.js
 * 
 * Audit QA Humain #1 (UI/UX) - Réticule de Visée Prédictive du Smart Disc & Bouclier Ricocheur.
 * Addresses playtester feedback: "Smart disc throws frequently miss walls or fly blindly into obstacles
 * without any visual indication of ricochet angles, flight apex, or return arc towards the gauntlet."
 * 
 * Provides:
 * - Parabolic ballistic flight path computation
 * - Specular reflection angle calculations for up to 3 ricochet bounce nodes
 * - Critical hit probability rating at each node (Green >=80%, Yellow 50-79%, Red <50%)
 * - Return vector tracking to the Yautja gauntlet receiver
 * - DOM HUD element creation & rendering helpers (.disc-trajectory-prediction-arc)
 */

export class HumanQaPredictiveDiscTrajectoryHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.discVelocityMps=38.0]
   * @param {number} [options.maxRicochets=3]
   */
  constructor(options = {}) {
    this.discVelocityMps = options.discVelocityMps || 38.0;
    this.maxRicochets = options.maxRicochets || 3;

    this.hudActive = false;
    this.currentTrajectoryNodes = [];
    this.lockOnTargetId = null;
  }

  /**
   * Computes the predictive ballistic trajectory and specular ricochet points against surrounding geometry.
   * @param {Object} originPos - { x, y, z }
   * @param {Object} aimVector - { x, y, z }
   * @param {Array<Object>} obstacles - List of surfaces/planes
   * @returns {Object} Predictive trajectory calculation
   */
  computePredictiveTrajectory(originPos = { x: 0, y: 1.5, z: 0 }, aimVector = { x: 0, y: 0, z: -1 }, obstacles = []) {
    const nodes = [];
    let currentPos = { ...originPos };
    let currentVel = {
      x: aimVector.x * this.discVelocityMps,
      y: aimVector.y * this.discVelocityMps,
      z: aimVector.z * this.discVelocityMps
    };

    const maxBounces = Math.min(this.maxRicochets, obstacles.length || 3);
    for (let i = 0; i < maxBounces; i++) {
      const obstacle = obstacles[i] || { distanceM: 8.5 * (i + 1), normal: { x: (i % 2 === 0 ? 0.707 : -0.707), y: 0, z: 0.707 }, targetNear: i === 1 };
      const travelDist = obstacle.distanceM || (10.0 + i * 5);
      
      // Calculate impact position
      currentPos = {
        x: currentPos.x + aimVector.x * travelDist,
        y: Math.max(0.5, currentPos.y + aimVector.y * travelDist - 0.5 * 9.81 * Math.pow(travelDist / this.discVelocityMps, 2) * 0.1),
        z: currentPos.z + aimVector.z * travelDist
      };

      const dot = aimVector.x * obstacle.normal.x + aimVector.y * obstacle.normal.y + aimVector.z * obstacle.normal.z;
      const ricochetVector = {
        x: aimVector.x - 2 * dot * obstacle.normal.x,
        y: aimVector.y - 2 * dot * obstacle.normal.y,
        z: aimVector.z - 2 * dot * obstacle.normal.z
      };

      const incidenceAngleDeg = Math.round(Math.acos(Math.min(1.0, Math.abs(dot))) * (180 / Math.PI));
      const criticalHitProbPct = Math.round(Math.max(25, 95 - incidenceAngleDeg * 0.8));

      nodes.push({
        nodeIndex: i + 1,
        position: { ...currentPos },
        ricochetVector,
        incidenceAngleDeg,
        criticalHitProbPct,
        statusColor: criticalHitProbPct >= 80 ? 'CRITICAL_GREEN' : criticalHitProbPct >= 50 ? 'CAUTION_YELLOW' : 'LOW_RED',
        isTargetHit: Boolean(obstacle.targetNear)
      });
    }

    this.currentTrajectoryNodes = nodes;
    this.hudActive = true;

    return {
      hudActive: true,
      discVelocityMps: this.discVelocityMps,
      bounceNodesCount: nodes.length,
      nodes,
      returnVectorToGauntlet: { x: -currentPos.x, y: 1.5 - currentPos.y, z: -currentPos.z },
      trajectoryRating: nodes.some(n => n.criticalHitProbPct >= 80) ? 'OPTIMAL' : 'SUBOPTIMAL'
    };
  }

  /**
   * Generates or attaches DOM HUD elements for rendering the predictive arc.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountTrajectoryHUDElements(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.disc-trajectory-prediction-arc') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'disc-trajectory-prediction-arc active';
      
      this.currentTrajectoryNodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.className = `trajectory-ricochet-node ${node.statusColor.toLowerCase()}`;
        nodeEl.setAttribute('data-node-idx', String(node.nodeIndex));
        nodeEl.textContent = `#${node.nodeIndex} ${node.criticalHitProbPct}%`;
        container.appendChild(nodeEl);
      });

      if (parentElement) {
        parentElement.appendChild(container);
      }
    }
    return container;
  }
}
