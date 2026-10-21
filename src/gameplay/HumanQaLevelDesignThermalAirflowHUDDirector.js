/**
 * HumanQaLevelDesignThermalAirflowHUDDirector.js
 * 
 * Chantier Level Design #8 - Directoire des Courants d'Air & Convection Thermique de Niveau.
 * Addresses playtester feedback: "In industrial and subterranean levels (slaughterhouse, sewers, pyramid shafts),
 * air drafts and vertical thermal updrafts had zero visual feedback on the bio-mask, even though scent and acoustic
 * propagation depend entirely on whether the hunter is upwind or downwind of enemy beasts."
 * 
 * Provides:
 * - Real-time 3D airflow vector computation (velocity in m/s and compass bearing in degrees)
 * - Scent dispersion cone calculation (upwind reduces hound scent detection by 75%; downwind doubles it)
 * - Thermal chimney updraft boost (+25% jump elevation inside hot exhaust flues and vents)
 * - Acoustic drift attenuation (sound carries +40% farther downwind)
 * - DOM HUD elements mounting helper (.thermal-airflow-draft-hud)
 */

export class HumanQaLevelDesignThermalAirflowHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.windSpeedMps=4.2]
   * @param {number} [options.windBearingDeg=225.0] // South-West
   * @param {number} [options.ambientTempC=18.0]
   */
  constructor(options = {}) {
    this.windSpeedMps = options.windSpeedMps || 4.2;
    this.windBearingDeg = options.windBearingDeg || 225.0;
    this.ambientTempC = options.ambientTempC || 18.0;

    this.inThermalChimney = false;
    this.hudMounted = false;
  }

  /**
   * Computes scent and acoustic propagation modifiers based on relative angle between hunter and quarry.
   * @param {number} hunterToQuarryBearingDeg
   * @returns {Object} Airflow propagation telemetry
   */
  computeAirflowPropagationModifiers(hunterToQuarryBearingDeg = 225.0) {
    const angleDiff = Math.abs((this.windBearingDeg - hunterToQuarryBearingDeg + 180) % 360 - 180);
    const isDownwind = angleDiff < 60.0; // Wind blows from hunter toward quarry
    const isUpwind = angleDiff > 120.0; // Wind blows from quarry toward hunter

    const scentDetectionMultiplier = isDownwind ? 2.1 : isUpwind ? 0.25 : 1.0;
    const acousticReachBonusDb = isDownwind ? 12 : isUpwind ? -8 : 0;

    return {
      windSpeedMps: this.windSpeedMps,
      windBearingDeg: this.windBearingDeg,
      angleDiffDeg: Number(angleDiff.toFixed(1)),
      isDownwind,
      isUpwind,
      scentDetectionMultiplier,
      acousticReachBonusDb,
      stealthAdvantage: isUpwind ? 'OPTIMAL_UPWIND_MASK' : isDownwind ? 'DANGEROUS_DOWNWIND_EXPOSURE' : 'CROSSWIND'
    };
  }

  /**
   * Evaluates a thermal chimney updraft inside an exhaust flue, volcanic fissure, or ventilation shaft.
   * Rising hot air currents grant +25% vertical jump boost and lift grapple cables faster.
   * @param {number} updraftAirTempC
   * @returns {Object} Chimney updraft telemetry
   */
  evaluateThermalChimneyUpdraft(updraftAirTempC = 65.0) {
    this.inThermalChimney = updraftAirTempC > this.ambientTempC + 15.0;
    const verticalAirflowVelocityMps = this.inThermalChimney ? Number(((updraftAirTempC - this.ambientTempC) * 0.18).toFixed(2)) : 0.0;
    const jumpElevationBoostPct = this.inThermalChimney ? 25.0 : 0.0;

    return {
      inThermalChimney: this.inThermalChimney,
      updraftAirTempC,
      verticalAirflowVelocityMps,
      jumpElevationBoostPct,
      gliderOrCloakFlapFlutter: this.inThermalChimney,
      rapidCoolingOrHeating: 'HEATING_CONVECTION'
    };
  }

  /**
   * Mounts the thermal airflow draft HUD indicator into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountAirflowHUD(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.thermal-airflow-draft-hud') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'thermal-airflow-draft-hud active';

      const arrow = document.createElement('div');
      arrow.className = 'airflow-vector-arrow';
      arrow.style.transform = `rotate(${this.windBearingDeg}deg)`;
      arrow.textContent = '➤';
      container.appendChild(arrow);

      const label = document.createElement('div');
      label.className = 'airflow-speed-label';
      label.textContent = `${this.windSpeedMps.toFixed(1)} m/s`;
      container.appendChild(label);

      if (parentElement) {
        parentElement.appendChild(container);
      }
      this.hudMounted = true;
    }
    return container;
  }
}
