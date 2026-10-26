/**
 * KillerOfKillers841AdMeadHallSiegeSector.js
 *
 * Chantier de Level Design 1 (v196) - Predator: Killer of Killers (2025)
 * Segment 1 (Part III): 841 AD Viking Mead Hall Siege & Burning Thatch Defense
 * 1:1 Canonical Level Design:
 * - Timber longhouse (38m) with central fire pit, roof thatch and carved oak pillars.
 * - Barricading the double oak doors with a 6-man bench ram brace against the rival warband.
 * - Rolling cauldrons of boiling fat from the loft ladder onto the boarding party.
 * - Shield-wall (skjaldborg) pivot at the doorway, 4-shield overlap stopping 2,100 J spear thrusts.
 */

export class KillerOfKillers841AdMeadHallSiegeSector {
  /**
   * @param {Object} options
   * @param {number} [options.longhouseLengthM=38.0] Longueur de la grande salle (m)
   * @param {number} [options.shieldWallCount=4] Nombre de boucliers du mur
   */
  constructor(options = {}) {
    this.longhouseLengthM = options.longhouseLengthM ?? 38.0;
    this.shieldWallCount = options.shieldWallCount ?? 4;

    this.doorsBarricaded = false;
    this.fatCauldronPoured = false;
    this.shieldWallFormed = false;
    this.warbandRepelled = false;
  }

  barricadeOakDoorsWithBenchBrace(menCount = 6) {
    this.doorsBarricaded = true;
    return {
      status: 'OAK_DOORS_BARRICADED_WITH_BENCH_BRACE',
      menCount,
      ramResistanceJoules: 5200.0,
      longhouseLengthM: this.longhouseLengthM
    };
  }

  pourBoilingFatCauldronFromLoft() {
    if (!this.doorsBarricaded) {
      return { status: 'FAILED_DOORS_NOT_SECURED', success: false };
    }
    this.fatCauldronPoured = true;
    return {
      status: 'BOILING_FAT_CAULDRON_POURED_FROM_LOFT',
      fatTempCelsius: 190.0,
      boardingPartyScalded: 5,
      thatchFireRiskPct: 35.0
    };
  }

  formSkjaldborgShieldWall() {
    if (!this.fatCauldronPoured) {
      return { status: 'FAILED_BOARDERS_NOT_STAGGERED', success: false };
    }
    this.shieldWallFormed = true;
    return {
      status: 'SKJALDBORG_SHIELD_WALL_FORMED',
      shieldsOverlapped: this.shieldWallCount,
      spearThrustAbsorbedJoules: 2100.0,
      doorwayHeld: true
    };
  }

  repelRivalWarbandAtThreshold() {
    if (!this.shieldWallFormed) {
      return { status: 'FAILED_NO_SHIELD_WALL', success: false };
    }
    this.warbandRepelled = true;
    return {
      status: 'RIVAL_WARBAND_REPELLED_AT_THRESHOLD',
      raidersFallen: 11,
      clanMoraleBoostPct: 40.0,
      honorScoreGranted: 300
    };
  }
}
