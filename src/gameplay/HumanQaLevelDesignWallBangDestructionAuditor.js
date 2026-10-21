/**
 * HumanQaLevelDesignWallBangDestructionAuditor.js
 * 
 * Chantier Level Design #10 - Audit de Micro-Destruction de Cloisons & Mécaniques de Wall-Bang.
 * Addresses playtester feedback: "Interior gunfights and urban stalking felt sterile because thin partitions
 * (apartment drywall, tin sheds, wooden doors) acted like invincible concrete barriers rather than destructible
 * materials that can be pierced, perforated, and chipped away to create dynamic sightline murder-holes."
 * 
 * Provides:
 * - Dynamic through-wall ballistic energy dissipation across 5 partition materials:
 *   PLASTERBOARD_DRYWALL, OAK_PLYWOOD, CORRUGATED_TIN, SANDBAG_WALL, GLASS_PARTITION
 * - Residual kinetic energy calculation and damage delivery to targets concealed behind cover
 * - Dynamic breach hole diameter tracking (creates persistent line-of-sight gaps)
 * - Secondary spall shrapnel generation (plaster dust, wood splinters, metal burrs)
 * - DOM HUD breach indicator helper (.wall-bang-breach-indicator)
 */

export class HumanQaLevelDesignWallBangDestructionAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.auditorId='wall-bang-auditor-01']
   * @param {number} [options.breachCount=0]
   */
  constructor(options = {}) {
    this.auditorId = options.auditorId || 'wall-bang-auditor-01';
    this.breachCount = options.breachCount || 0;
    this.persistentBreachHoles = [];
  }

  /**
   * Resolves a projectile or smart disc impact attempting to penetrate through an interior partition.
   * @param {number} incomingEnergyJoules
   * @param {string} weaponType - 'SPEARGUN' or 'SMART_DISC' or 'PLASMACASTER' or 'SNIPER_RIFLE'
   * @param {string} wallMaterial - 'PLASTERBOARD_DRYWALL' or 'OAK_PLYWOOD' or 'CORRUGATED_TIN' or 'SANDBAG_WALL'
   * @param {number} wallThicknessCm
   * @returns {Object} Wall-bang penetration telemetry
   */
  resolveThroughWallBallisticShot(incomingEnergyJoules = 350.0, weaponType = 'SPEARGUN', wallMaterial = 'PLASTERBOARD_DRYWALL', wallThicknessCm = 12.0) {
    const materialAbsorptionJoulesPerCm = {
      GLASS_PARTITION: 2.5,
      CORRUGATED_TIN: 4.8,
      PLASTERBOARD_DRYWALL: 5.2,
      OAK_PLYWOOD: 9.5,
      SANDBAG_WALL: 65.0
    }[wallMaterial] || 8.0;

    const totalBarrierAbsorption = materialAbsorptionJoulesPerCm * wallThicknessCm;
    const penetrated = incomingEnergyJoules > totalBarrierAbsorption;
    const residualEnergyJoules = penetrated ? incomingEnergyJoules - totalBarrierAbsorption : 0.0;
    const penetrationEfficiencyPct = Number(((residualEnergyJoules / incomingEnergyJoules) * 100).toFixed(1));

    // Calculate breach hole diameter
    const baseHoleDiameterCm = weaponType === 'SMART_DISC' ? 32.0 : weaponType === 'PLASMACASTER' ? 18.0 : 5.5;
    const breachHoleDiameterCm = penetrated ? baseHoleDiameterCm : Number((baseHoleDiameterCm * 0.4).toFixed(1));

    this.breachCount++;
    this.persistentBreachHoles.push({
      id: `breach-hole-${this.breachCount}`,
      material: wallMaterial,
      diameterCm: breachHoleDiameterCm,
      penetrated
    });

    const spallShrapnelDamage = penetrated ? Math.round(residualEnergyJoules * 0.065) : 0;
    const lineOfSightOpened = penetrated && breachHoleDiameterCm >= 5.0;

    return {
      penetrated,
      weaponType,
      wallMaterial,
      wallThicknessCm,
      incomingEnergyJoules,
      absorbedEnergyJoules: Number(Math.min(incomingEnergyJoules, totalBarrierAbsorption).toFixed(1)),
      residualEnergyJoules: Number(residualEnergyJoules.toFixed(1)),
      penetrationEfficiencyPct,
      breachHoleDiameterCm,
      spallShrapnelDamage,
      lineOfSightOpened,
      totalBreachesCount: this.breachCount
    };
  }

  /**
   * Calculates new line-of-sight sightline visibility through an established breach hole.
   * @param {number} breachHoleDiameterCm
   * @returns {Object} Sightline gap telemetry
   */
  calculateLineOfSightBreachGap(breachHoleDiameterCm = 18.0) {
    const sightlineApertureAngleDeg = Number(Math.min(65.0, breachHoleDiameterCm * 2.2).toFixed(1));
    const thermalSilhouetteVisible = breachHoleDiameterCm >= 5.0;
    const directSniperShotAllowed = breachHoleDiameterCm >= 10.0;

    return {
      breachHoleDiameterCm,
      sightlineApertureAngleDeg,
      thermalSilhouetteVisible,
      directSniperShotAllowed,
      murderHoleTacticalAdvantage: directSniperShotAllowed ? 'LETHAL_FIRE_APERTURE' : 'PEEKING_VISIBILITY_ONLY'
    };
  }

  /**
   * Mounts the wall-bang breach indicator into the DOM.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountWallBangBreachIndicator(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.wall-bang-breach-indicator') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'wall-bang-breach-indicator';

      const tag = document.createElement('div');
      tag.className = 'wall-density-tag';
      tag.textContent = `BREACHES: ${this.breachCount}`;
      container.appendChild(tag);

      if (parentElement) {
        parentElement.appendChild(container);
      }
    }
    return container;
  }
}
