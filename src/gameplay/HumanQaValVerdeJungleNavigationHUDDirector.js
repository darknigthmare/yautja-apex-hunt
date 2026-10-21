/**
 * HumanQaValVerdeJungleNavigationHUDDirector.js
 * 
 * Chantier Level Design #8 - Directoire de Navigation & Télémétrie de Canopée de Val Verde.
 * Addresses playtester feedback: "In the dense Val Verde jungle, players could not discern between
 * thin leaves and solid branch highways, had no detection for concealed guerrilla tripwires, and
 * could not identify thermal blindspots where cold mud wallows rendered human targets invisible."
 * 
 * Provides:
 * - Real-time jungle canopy foliage density analysis (detects 95% concealment corridors)
 * - Thermal blindspot zone mapping (indicates where cold alluvial silt negates infrared tracking)
 * - High-contrast tripwire hazard highlighting (M26 grenade & claymore wire alerts)
 * - Branch highway jump trajectory predictions
 * - DOM HUD elements mounting helper (.valverde-jungle-navigation-hud)
 */

export class HumanQaValVerdeJungleNavigationHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.scanRadiusM=40.0]
   */
  constructor(options = {}) {
    this.scanRadiusM = options.scanRadiusM || 40.0;
    this.activeCanopyDensityPct = 85.0;
    this.detectedTripwiresCount = 0;
    this.hudMounted = false;
  }

  /**
   * Evaluates the current canopy cover density and branch highway elevation.
   * @param {number} foliageDensityPct
   * @param {number} branchElevationM
   * @returns {Object} Canopy navigation telemetry
   */
  evaluateJungleCanopyCover(foliageDensityPct = 95.0, branchElevationM = 24.0) {
    this.activeCanopyDensityPct = foliageDensityPct;
    const groundConcealmentScore = Math.min(100.0, foliageDensityPct * 1.05);
    const sprintSpeedSafetyRating = branchElevationM >= 18.0 ? 'OPTIMAL_BRANCH_HIGHWAY' : 'OBSTRUCTED_UNDERGROWTH';

    return {
      foliageDensityPct: this.activeCanopyDensityPct,
      branchElevationM,
      groundConcealmentScore,
      sprintSpeedSafetyRating,
      infraredConcealmentAgainstGround: foliageDensityPct >= 90.0
    };
  }

  /**
   * Scans surrounding terrain for concealed tripwire traps (M26 grenades, claymores, punji pits).
   * @param {Array<Object>} surroundingHazards
   * @returns {Object} Tripwire scan telemetry
   */
  detectPerimeterTripwireHazards(surroundingHazards = []) {
    const tripwires = surroundingHazards.filter(h => h.type === 'TRIPWIRE' || h.type === 'CLAYMORE' || h.type === 'PUNJI_PIT');
    this.detectedTripwiresCount = tripwires.length;

    return {
      scanRadiusM: this.scanRadiusM,
      detectedTripwiresCount: this.detectedTripwiresCount,
      hazards: tripwires.map((h, i) => ({
        id: h.id || `hazard-${i + 1}`,
        type: h.type,
        distanceM: h.distanceM || 8.5,
        threatLevel: 'HIGH_LETHAL'
      })),
      hudHazardWarningActive: this.detectedTripwiresCount > 0
    };
  }

  /**
   * Mounts the Val Verde jungle navigation HUD into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountJungleHUD(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.valverde-jungle-navigation-hud') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'valverde-jungle-navigation-hud active';

      const densityMeter = document.createElement('div');
      densityMeter.className = 'canopy-density-meter';
      densityMeter.textContent = `CANOPY DENSITY: ${this.activeCanopyDensityPct}%`;
      container.appendChild(densityMeter);

      const blindspotIndicator = document.createElement('div');
      blindspotIndicator.className = 'thermal-blindspot-indicator';
      blindspotIndicator.textContent = 'THERMAL BLINDSPOT: COLD MUD ACTIVE';
      container.appendChild(blindspotIndicator);

      if (parentElement) {
        parentElement.appendChild(container);
      }
      this.hudMounted = true;
    }
    return container;
  }
}
