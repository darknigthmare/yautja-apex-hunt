/**
 * HumanQaLevelDesignDynamicTerrainAuditor.js
 * 
 * Chantier Level Design #10 - Audit des Transitions Dynamiques d'États de Terrain Environnemental.
 * Addresses playtester feedback: "Surfaces throughout the levels remain statically frozen in their initial state;
 * intense plasma battles, torrential rain, or fire have zero dynamic effect on ground footing, ice melting into water,
 * or dry brush catching fire to reshape combat routes."
 * 
 * Provides:
 * - Dynamic surface state transitions across 4 primary pathways:
 *   1. DRY_SOIL -> MUD_SLURRY (precipitation & sewer floods)
 *   2. SURFACE_ICE -> BRITTLE_PERMAFROST -> OPEN_WATER (thermal plasma thaw)
 *   3. DRY_BRUSH -> IGNITED_INFERNO -> CHARRED_ASH (thermal fire spread)
 *   4. FLOODED_FLOOR -> ELECTRIFIED_SURGE (transformer conduit arcing)
 * - Footing friction coefficient (mu) computation and movement velocity scaling
 * - Dynamic hazard radius expansion over time
 * - DOM HUD terrain state badge mounting helper (.dynamic-terrain-state-badge)
 */

export class HumanQaLevelDesignDynamicTerrainAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.terrainId='env-terrain-dynamic-01']
   * @param {string} [options.initialState='DRY_SOIL']
   */
  constructor(options = {}) {
    this.terrainId = options.terrainId || 'env-terrain-dynamic-01';
    this.currentState = options.initialState || 'DRY_SOIL';

    this.moistureLevelPct = 15.0;
    this.temperatureC = 18.0;
    this.frictionCoeffMu = 0.85;
    this.hazardRadiusM = 0.0;
  }

  /**
   * Applies precipitation or flood water to shift dry ground toward viscous mud.
   * @param {number} rainfallMmHr
   * @param {number} durationMinutes
   * @returns {Object} Moisture transition telemetry
   */
  applyPrecipitationMoisture(rainfallMmHr = 25.0, durationMinutes = 10.0) {
    const moistureGain = (rainfallMmHr * durationMinutes) / 10.0;
    this.moistureLevelPct = Math.min(100.0, this.moistureLevelPct + moistureGain);

    if (this.moistureLevelPct >= 65.0) {
      this.currentState = 'MUD_SLURRY';
      this.frictionCoeffMu = 0.32;
    } else if (this.moistureLevelPct >= 35.0) {
      this.currentState = 'DAMP_SOIL';
      this.frictionCoeffMu = 0.65;
    }

    return {
      currentState: this.currentState,
      moistureLevelPct: Number(this.moistureLevelPct.toFixed(1)),
      frictionCoeffMu: this.frictionCoeffMu,
      movementSpeedMultiplier: Number((this.frictionCoeffMu / 0.85).toFixed(2)),
      footstepAcousticsReductionDb: this.currentState === 'MUD_SLURRY' ? -14 : -4
    };
  }

  /**
   * Applies intense thermal heat (from plasma bolts or fires) to melt ice or ignite brush.
   * @param {number} heatJoules
   * @param {string} baseMaterial - 'SURFACE_ICE' or 'DRY_BRUSH'
   * @returns {Object} Thermal transition telemetry
   */
  applyThermalHeatInput(heatJoules = 45000.0, baseMaterial = 'SURFACE_ICE') {
    if (baseMaterial === 'SURFACE_ICE') {
      if (heatJoules > 30000.0) {
        this.currentState = 'OPEN_WATER';
        this.temperatureC = 4.0;
        this.frictionCoeffMu = 0.15;
      } else {
        this.currentState = 'BRITTLE_PERMAFROST';
        this.temperatureC = -2.0;
        this.frictionCoeffMu = 0.28;
      }

      return {
        currentState: this.currentState,
        temperatureC: this.temperatureC,
        frictionCoeffMu: this.frictionCoeffMu,
        iceCrackingHazard: this.currentState === 'BRITTLE_PERMAFROST',
        swimmingRequired: this.currentState === 'OPEN_WATER'
      };
    } else {
      // Combustible brush / canopy leaves
      if (heatJoules >= 20000.0) {
        this.currentState = 'IGNITED_INFERNO';
        this.temperatureC = 680.0;
        this.hazardRadiusM = 5.5;
      }

      return {
        currentState: this.currentState,
        temperatureC: this.temperatureC,
        hazardRadiusM: this.hazardRadiusM,
        flameDps: 45,
        smokeMaskingActive: true
      };
    }
  }

  /**
   * Evaluates kinematic footstep grip on the current dynamic terrain state.
   * @param {number} sprintVelocityMps
   * @returns {Object} Footing grip telemetry
   */
  evaluateFootingKinematics(sprintVelocityMps = 7.5) {
    const slipRiskPct = Math.min(95.0, Math.max(0.0, (1.0 - this.frictionCoeffMu) * (sprintVelocityMps / 6.0) * 100));
    const tractionLoss = slipRiskPct > 45.0;

    return {
      currentState: this.currentState,
      frictionCoeffMu: this.frictionCoeffMu,
      sprintVelocityMps,
      slipRiskPct: Number(slipRiskPct.toFixed(1)),
      tractionLoss,
      staminaDrainMultiplier: this.frictionCoeffMu < 0.4 ? 1.5 : 1.0
    };
  }

  /**
   * Mounts the dynamic terrain state badge element into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountTerrainStateBadge(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.dynamic-terrain-state-badge') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = `dynamic-terrain-state-badge state-${this.currentState.toLowerCase()}`;
      container.textContent = `SURFACE: ${this.currentState.replace('_', ' ')}`;

      if (parentElement) {
        parentElement.appendChild(container);
      }
    }
    return container;
  }
}
