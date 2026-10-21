/**
 * HumanQaLevelDesignDestructibleCoverAuditor.js
 * 
 * Chantier Level Design #10 - Physique des Matériaux & Couvertures Destructibles Environnementales.
 * Addresses playtester feedback: "Cover across the maps felt either completely static/indestructible or binary;
 * shooting high-caliber .50 BMG or plasma bolts into wooden palisades, ice walls, or concrete barriers
 * showed no material deformation, penetration, spalling, or progressive structural collapse."
 * 
 * Provides:
 * - Material physical properties (tensile strength, hardness, density) across 8 franchise materials:
 *   GRANITE_ROCK, FROZEN_ICE_PACK, OAK_TIMBER, INDUSTRIAL_BRICK, REINFORCED_CONCRETE, SHEET_METAL, BONE_CAGE, BEEF_CARCASS
 * - Ballistic/plasma penetration depth and residual damage to occupants behind cover
 * - Secondary spalling generation (rock chips, wood splinters, ice needles, metal shards)
 * - Progressive structural collapse mechanics opening dynamic breach lanes
 * - DOM HUD cover health stress gauge (.destructible-cover-stress-gauge)
 */

export class HumanQaLevelDesignDestructibleCoverAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.coverId='env-cover-01']
   * @param {string} [options.materialType='OAK_TIMBER']
   * @param {number} [options.coverThicknessCm=25.0]
   * @param {number} [options.maxStructuralHealth=350.0]
   */
  constructor(options = {}) {
    this.coverId = options.coverId || 'env-cover-01';
    this.materialType = options.materialType || 'OAK_TIMBER';
    this.coverThicknessCm = options.coverThicknessCm || 25.0;
    this.maxStructuralHealth = options.maxStructuralHealth || 350.0;
    this.currentStructuralHealth = this.maxStructuralHealth;

    this.isBreached = false;
    this.isCollapsed = false;
  }

  /**
   * Resolves an impact (ballistic, plasma, or blunt melee) on the destructible cover.
   * Calculates energy absorption, penetration through to occupants, and secondary spall fragments.
   * @param {number} incomingEnergyJoules
   * @param {string} damageType - 'BALLISTIC' or 'PLASMA' or 'BLUNT_MELEE'
   * @returns {Object} Cover impact resolution
   */
  resolveCoverImpact(incomingEnergyJoules = 240.0, damageType = 'BALLISTIC') {
    if (this.isCollapsed) {
      return { penetrated: true, remainingEnergyJoules: incomingEnergyJoules, coverCollapsed: true };
    }

    const materialResistanceMultiplier = {
      GRANITE_ROCK: 2.2,
      REINFORCED_CONCRETE: 1.9,
      INDUSTRIAL_BRICK: 1.4,
      SHEET_METAL: 1.2,
      OAK_TIMBER: 1.0,
      FROZEN_ICE_PACK: 0.85,
      BEEF_CARCASS: 0.75,
      BONE_CAGE: 0.65
    }[this.materialType] || 1.0;

    const structuralDamage = incomingEnergyJoules / materialResistanceMultiplier;
    this.currentStructuralHealth = Math.max(0, this.currentStructuralHealth - structuralDamage);

    const healthRatio = this.currentStructuralHealth / this.maxStructuralHealth;
    if (this.currentStructuralHealth <= 0) {
      this.isCollapsed = true;
      this.isBreached = true;
    } else if (healthRatio <= 0.35) {
      this.isBreached = true;
    }

    // Penetration calculation: did projectile have surplus energy beyond barrier capacity?
    const barrierEnergyThreshold = this.coverThicknessCm * 15.0 * materialResistanceMultiplier;
    const penetrated = incomingEnergyJoules > barrierEnergyThreshold;
    const remainingEnergy = penetrated ? incomingEnergyJoules - barrierEnergyThreshold : 0.0;

    // Secondary spall fragments ejected behind cover
    const spallFragmentCount = Math.round((incomingEnergyJoules / 40.0) * (damageType === 'PLASMA' ? 1.4 : 1.0));
    const spallDamagePerFragment = Math.max(4, Math.round(12 / materialResistanceMultiplier));

    return {
      coverId: this.coverId,
      materialType: this.materialType,
      currentHealth: Number(this.currentStructuralHealth.toFixed(1)),
      maxHealth: this.maxStructuralHealth,
      healthRatio: Number(healthRatio.toFixed(2)),
      isBreached: this.isBreached,
      isCollapsed: this.isCollapsed,
      penetrated,
      remainingEnergyJoules: Number(remainingEnergy.toFixed(1)),
      spallFragmentCount,
      spallDamagePerFragment,
      spallHazardRadiusM: 2.5
    };
  }

  /**
   * Mounts or attaches the destructible cover stress gauge element.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountCoverStressGauge(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.destructible-cover-stress-gauge') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = 'destructible-cover-stress-gauge';

      const bar = document.createElement('div');
      bar.className = 'cover-health-bar-fill';
      const pct = Math.round((this.currentStructuralHealth / this.maxStructuralHealth) * 100);
      bar.style.width = `${pct}%`;
      container.appendChild(bar);

      if (parentElement) {
        parentElement.appendChild(container);
      }
    }
    return container;
  }
}
