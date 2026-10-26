/**
 * KillerOfKillers1942SaharaDuneCrashSector.js
 *
 * Chantier de Level Design 3 (v195) - Predator: Killer of Killers (2025)
 * Segment 3 (Part II): 1942 Libyan Sahara Sand Dune Crash & Flare Gun Ambush
 * 1:1 Canonical Level Design:
 * - Crash site of John Torres' Grumman F4F Wildcat in the rolling sand dunes of the Libyan Sahara.
 * - Searing ambient ground temperature (54°C) creating intense heat shimmer and optical mirages that dazzle Yautja thermal optics.
 * - Salvaged AN-M8 37mm pyrotechnic flare pistol and pooling 100-octane aviation fuel in the sand trench.
 * - Igniting a blinding white-phosphorus flare (3,000°C) directly in front of the alien's optic mask, followed by an M1911 .45 ACP point-blank discharge.
 */

export class KillerOfKillers1942SaharaDuneCrashSector {
  /**
   * @param {Object} options
   * @param {number} [options.sandDuneHeightM=18.0] Hauteur de la crête de dune de sable (m)
   * @param {number} [options.groundTempCelsius=54.0] Température du sable au sol (°C)
   * @param {number} [options.m1911RoundsRemaining=7] Nombre de cartouches .45 ACP restantes
   */
  constructor(options = {}) {
    this.sandDuneHeightM = options.sandDuneHeightM ?? 18.0;
    this.groundTempCelsius = options.groundTempCelsius ?? 54.0;
    this.m1911RoundsRemaining = options.m1911RoundsRemaining ?? 7;

    // État runtime
    this.cockpitExtricated = false;
    this.thermalMirageActive = false;
    this.phosphorusFlareFired = false;
    this.m1911MagDumpExecuted = false;
  }

  /**
   * S'extraire du cockpit écrasé du chasseur Wildcat dans le sable
   */
  extricateFromWildcatCockpitWreckage() {
    this.cockpitExtricated = true;

    return {
      status: 'EXTRICATED_FROM_WILDCAT_WRECKAGE',
      fuelLeakPuddleRadiusM: 4.5,
      octaneRating: 100,
      flarePistolSalvaged: true,
      sandDuneHeightM: this.sandDuneHeightM
    };
  }

  /**
   * Exploiter le mirage thermique du désert libyen pour saturer les scanners infrarouges
   */
  utilizeSaharaHeatMirageCamouflage() {
    if (!this.cockpitExtricated) {
      return { status: 'FAILED_TRAPPED_IN_COCKPIT', success: false };
    }

    this.thermalMirageActive = true;

    return {
      status: 'SAHARA_HEAT_MIRAGE_CAMOUFLAGE_ACTIVE',
      groundTempCelsius: this.groundTempCelsius,
      ambientInfraredBloomPct: 92.0,
      thermalDifferentialNormalized: true,
      hunterTrackingDisoriented: true
    };
  }

  /**
   * Tirer une fusée éclairante au phosphore blanc (AN-M8) pour aveugler le masque du prédateur
   */
  dischargePhosphorusFlareBlindness() {
    if (!this.thermalMirageActive) {
      return { status: 'FAILED_NO_STEALTH_WINDOW', success: false };
    }

    this.phosphorusFlareFired = true;

    return {
      status: 'PHOSPHORUS_FLARE_BLINDNESS_TRIGGERED',
      flareBurnTempCelsius: 3000.0,
      lumensPeak: 120000.0,
      alienBiomaskOpticsSaturated: true,
      opticOverloadDurationSec: 3.5
    };
  }

  /**
   * Vider le chargeur du pistolet Colt M1911 calibre .45 ACP à bout portant
   */
  executePointBlankM1911MagDump() {
    if (!this.phosphorusFlareFired) {
      return { status: 'FAILED_PREDATOR_NOT_BLINDED', success: false };
    }

    const roundsFired = this.m1911RoundsRemaining;
    this.m1911RoundsRemaining = 0;
    this.m1911MagDumpExecuted = true;

    return {
      status: 'POINT_BLANK_M1911_MAG_DUMP_EXECUTED',
      roundsFired,
      bulletCaliber: '.45 ACP Full Metal Jacket',
      fuelPuddleIgnited: true,
      hunterThrownBackJoules: 2800.0,
      honorScoreGranted: 400
    };
  }
}
