/**
 * ElRookApartmentBreachSector.js
 * 
 * Predator 2 (1990) - South Central LA Tenement Apartment & Fire Escape Labyrinth.
 * Simulates the claustrophobic residential apartment shootout:
 * - Narrow wallpapered interior corridors with plasterboard & lath drywalls (penetrable for wall-bang takedowns)
 * - Rusted exterior iron fire escape stairs and balconies providing vertical escape routes (4 stories, 14m)
 * - Shootable halogen ceiling light fixtures that can be shattered to plunge the hallway into darkness
 * - Living room barricades (sofas, oak tables, television sets) as temporary destructible cover.
 */

export class ElRookApartmentBreachSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-apartment-breach-01']
   * @param {number} [options.storyLevel=4]
   * @param {number} [options.drywallThicknessCm=12.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-apartment-breach-01';
    this.storyLevel = options.storyLevel || 4;
    this.drywallThicknessCm = options.drywallThicknessCm || 12.0;

    this.hallwayLightsActive = true;
    this.fireEscapeAccessible = true;
    this.interiorWallsPenetratedCount = 0;
  }

  /**
   * Performs a wall-bang penetration attack through interior plasterboard drywall.
   * High-velocity smart discs or spear gun bolts pierce through the 12cm drywall to strike concealed targets.
   * @param {number} incomingEnergyJoules
   * @param {string} weaponType - 'SMART_DISC' or 'SPEARGUN' or 'PLASMACASTER'
   * @returns {Object} Drywall penetration telemetry
   */
  resolveDrywallWallBangAttack(incomingEnergyJoules = 320.0, weaponType = 'SPEARGUN') {
    const wallResistanceJoules = 65.0; // Drywall absorbs minimal kinetic energy
    const penetrated = incomingEnergyJoules > wallResistanceJoules;
    const residualEnergyJoules = penetrated ? incomingEnergyJoules - wallResistanceJoules : 0;
    this.interiorWallsPenetratedCount++;

    const plasterDustCloudRadiusM = 2.4;
    const plasterShrapnelDamage = 18;
    const breachHoleDiameterCm = weaponType === 'SMART_DISC' ? 35.0 : 6.5;

    return {
      penetrated,
      weaponType,
      incomingEnergyJoules,
      residualEnergyJoules,
      breachHoleDiameterCm,
      plasterDustCloudRadiusM,
      plasterShrapnelDamage,
      targetBehindWallHit: penetrated,
      wallBangDecibels: 92
    };
  }

  /**
   * Shoots out the halogen ceiling light fixtures in the apartment corridor.
   * Plunges the corridor into pitch blackness, granting thermal vision supremacy.
   * @returns {Object} Light fixture destruction telemetry
   */
  shootOutHallwayLightFixtures() {
    this.hallwayLightsActive = false;
    const illuminationLuxDropPct = 95.0;
    const humanNightVisionImpairmentPct = 85.0;

    return {
      success: true,
      hallwayLightsActive: false,
      illuminationLuxDropPct,
      humanNightVisionImpairmentPct,
      glassShatterDecibels: 68,
      predatorThermalPredominance: true
    };
  }

  /**
   * Vaults through an open window onto the exterior rusted fire escape stairwell.
   * @returns {Object} Fire escape vault telemetry
   */
  vaultToExteriorFireEscape() {
    const fireEscapeElevationM = this.storyLevel * 3.5; // ~14m
    const ironLadderRattleDecibels = 58;

    return {
      success: true,
      fireEscapeElevationM,
      ironLadderRattleDecibels,
      verticalTransitAllowed: true,
      exteriorAlleywayDropAvailable: true
    };
  }
}
