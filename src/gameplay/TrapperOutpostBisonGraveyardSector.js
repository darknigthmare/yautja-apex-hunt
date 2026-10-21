/**
 * TrapperOutpostBisonGraveyardSector.js
 * 
 * Prey (2022) - French Trapper Fortified Outpost & Skinned Bison Graveyard.
 * Simulates the frontier level design of the Northern Great Plains:
 * - Pine log stockade walls with narrow gun embrasures (destructible wooden fortifications)
 * - Industrial quicklime slaking pits (exothermic reaction boiling at 150 °C, caustic burns)
 * - Desolate field of skinned bison carcasses and bleached skull piles (acoustic rattle when trodden)
 * - High birch tree roosts at 14m elevation providing long-range thermal sniper overwatch.
 */

export class TrapperOutpostBisonGraveyardSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='prey-trapper-outpost-01']
   * @param {number} [options.stockadeIntegrity=1.0]
   * @param {number} [options.bisonCarcassCount=45]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'prey-trapper-outpost-01';
    this.stockadeIntegrity = options.stockadeIntegrity || 1.0;
    this.bisonCarcassCount = options.bisonCarcassCount || 45;

    this.quicklimePitActive = true;
    this.quicklimeTemperatureC = 152.0;
    this.stockadeBreached = false;
    this.birchRoostElevationM = 14.0;
  }

  /**
   * Resolves physical or plasma damage against the wooden pine log stockade.
   * Palisade logs withstand 320 damage before splintering into cover breaches.
   * @param {number} incomingDamage
   * @param {boolean} isPlasmaExplosive
   * @returns {Object} Stockade damage telemetry
   */
  damageStockadePalisade(incomingDamage = 180, isPlasmaExplosive = false) {
    const effectiveDamage = isPlasmaExplosive ? incomingDamage * 1.5 : incomingDamage;
    const damagePct = effectiveDamage / 320.0;
    this.stockadeIntegrity = Math.max(0, this.stockadeIntegrity - damagePct);

    if (this.stockadeIntegrity <= 0.25) {
      this.stockadeBreached = true;
    }

    const woodSplinterShards = Math.round(effectiveDamage * 0.12);

    return {
      stockadeIntegrityRemaining: Number(this.stockadeIntegrity.toFixed(2)),
      stockadeBreached: this.stockadeBreached,
      woodSplinterShards,
      breachWidthM: this.stockadeBreached ? 2.8 : 0.0,
      splinterDamageRadiusM: 2.2,
      coverDegraded: true
    };
  }

  /**
   * Evaluates entity immersion or contact with the bubbling quicklime slaking pit.
   * Inflicts 60 caustic dps and exothermic burns, and masks thermal body heat with chemical heat bloom.
   * @param {number} contactDurationSec
   * @returns {Object} Quicklime pit hazard telemetry
   */
  resolveQuicklimePitImmersion(contactDurationSec = 1.5) {
    const causticDps = 60;
    const totalCausticDamage = Math.round(causticDps * contactDurationSec);
    const thermalBloomTempC = this.quicklimeTemperatureC;
    const causticSkinCharringPct = Math.min(100.0, contactDurationSec * 35.0);

    return {
      pitActive: this.quicklimePitActive,
      contactDurationSec,
      totalCausticDamage,
      thermalBloomTempC,
      causticSkinCharringPct: Number(causticSkinCharringPct.toFixed(1)),
      chemicalAlkalineReaction: 'CaO + H2O -> Ca(OH)2 + Heat',
      thermalContrastSaturated: true
    };
  }

  /**
   * Treads on bleached bison skull piles, generating an acoustic rattle audible to nearby sentries.
   * @param {number} walkSpeedMps
   * @returns {Object} Bone pile acoustic telemetry
   */
  triggerBisonBonePileAcousticRattle(walkSpeedMps = 3.5) {
    const acousticClatterDb = Math.round(55 + walkSpeedMps * 7.5);
    const detectionRadiusM = Number((acousticClatterDb * 0.35).toFixed(1));

    return {
      carcassCount: this.bisonCarcassCount,
      walkSpeedMps,
      acousticClatterDb,
      detectionRadiusM,
      alertTrapperGuards: acousticClatterDb >= 72
    };
  }
}
