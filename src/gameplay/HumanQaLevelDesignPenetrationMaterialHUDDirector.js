/**
 * HumanQaLevelDesignPenetrationMaterialHUDDirector.js
 * 
 * Chantier Level Design #8 - Analyseur Télémétrique de Pénétration de Cloisons & Wall-Bang HUD.
 * Addresses playtester feedback: "When tracking human or xeno quarry behind walls (apartment drywall, tin barracks,
 * wooden palisades), the bio-mask HUD showed thermal silhouettes but provided no feedback on whether
 * smart discs, spearguns, or plasmacaster bolts could penetrate the obstacle without wasting ammo."
 * 
 * Provides:
 * - Real-time environmental surface scanning and material density evaluation (kg/m³)
 * - Wall thickness measurement in centimeters
 * - Ballistic/plasma wall-bang penetration probability scoring (0 to 100%)
 * - Vector calculation for lethal through-wall headshots on thermal targets
 * - DOM HUD elements mounting helper (.wall-penetration-analysis-hud)
 */

export class HumanQaLevelDesignPenetrationMaterialHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.scanRangeM=30.0]
   */
  constructor(options = {}) {
    this.scanRangeM = options.scanRangeM || 30.0;
    this.activeScanResult = null;
    this.hudMounted = false;
  }

  /**
   * Scans an environmental partition or wall surface directly in the crosshairs.
   * @param {string} materialType - 'PLASTERBOARD_DRYWALL' or 'OAK_TIMBER' or 'CORRUGATED_TIN' or 'REINFORCED_CONCRETE'
   * @param {number} wallThicknessCm
   * @param {number} targetBehindDistanceM
   * @returns {Object} Wall penetration scan telemetry
   */
  scanWallPartitionProperties(materialType = 'PLASTERBOARD_DRYWALL', wallThicknessCm = 12.0, targetBehindDistanceM = 2.5) {
    const materialDensitiesKgM3 = {
      CORRUGATED_TIN: 450,
      PLASTERBOARD_DRYWALL: 750,
      OAK_TIMBER: 850,
      SANDBAG_WALL: 1600,
      BRICK_MASONRY: 1900,
      REINFORCED_CONCRETE: 2400,
      SOLID_GRANITE: 2700
    };

    const density = materialDensitiesKgM3[materialType] || 1000;
    const kineticResistanceScore = (density * wallThicknessCm) / 100.0;

    // Penetration probability calculation based on barrier kinetic resistance
    const speargunPenetrationPct = Math.max(0, Math.min(100, Math.round(Math.max(0, 100 - (kineticResistanceScore * 0.45) / 3.5))));
    const plasmaPenetrationPct = Math.max(0, Math.min(100, Math.round(Math.max(0, 100 - (kineticResistanceScore * 0.25) / 3.5))));

    const wallBangFeasible = speargunPenetrationPct >= 65 || plasmaPenetrationPct >= 65;

    this.activeScanResult = {
      materialType,
      densityKgM3: density,
      wallThicknessCm,
      targetBehindDistanceM,
      speargunPenetrationPct,
      plasmaPenetrationPct,
      wallBangFeasible,
      recommendedWeapon: plasmaPenetrationPct >= 80 ? 'PLASMACASTER' : speargunPenetrationPct >= 65 ? 'SPEARGUN' : 'EXPLOSIVE_BREACH'
    };

    return this.activeScanResult;
  }

  /**
   * Mounts the wall penetration analysis HUD component into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountPenetrationHUD(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.wall-penetration-analysis-hud') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'wall-penetration-analysis-hud active';

      const densityEl = document.createElement('div');
      densityEl.className = 'material-density-readout';
      densityEl.textContent = this.activeScanResult ? `MAT: ${this.activeScanResult.materialType} (${this.activeScanResult.wallThicknessCm}cm)` : 'SCANNING SURFACE...';
      container.appendChild(densityEl);

      const vectorEl = document.createElement('div');
      vectorEl.className = 'wall-bang-vector-indicator';
      vectorEl.textContent = this.activeScanResult?.wallBangFeasible ? 'WALL-BANG: LETHAL VECTOR LOCKED' : 'WALL-BANG: DEFLECTION RISK';
      container.appendChild(vectorEl);

      if (parentElement) {
        parentElement.appendChild(container);
      }
      this.hudMounted = true;
    }
    return container;
  }
}
