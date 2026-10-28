/**
 * Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector (v211)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. Detective Jerry Lambert drawing his sidearms in the flickering 4Hz strobe-lit subway carriage to cover civilians and Leona.
 * 2. Facing the City Hunter alone and delivering his iconic battle cry ("You want some candy? Well here's a jawbreaker!").
 * 3. Slashing through the City Hunter's metallic chest mesh armor with his serrated combat blade in close-quarters melee.
 * 4. Jerry being hoisted by the throat into the carriage ceiling ventilation shaft to yield a warrior trophy.
 */
export class Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_JERRY_LAMBERT_SUBWAY_STAND_AND_MESH_ARMOR_SLASH';
    this.filmReference = 'Predator 2 (1990) - Subway Strobe Stand, Jawbreaker Quote, Mesh Armor Slash & Ceiling Hoist';
    this.reset();
  }

  reset() {
    this.subwayEvacuationCovered = false;
    this.jawbreakerQuoteDelivered = false;
    this.cityHunterMeshArmorSlashed = false;
    this.jerryHoistedIntoCeilingVent = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  drawSidearmsToCoverSubwayCommuterEvacuation({
    roundsChambered = 16,
    evacuationSecured = true
  } = {}) {
    const rounds = Math.max(0, Number(roundsChambered) || 0);
    this.subwayEvacuationCovered = rounds >= 12 && Boolean(evacuationSecured);
    this.eventLog.push({
      step: 'SUBWAY_EVACUATION_COVERED',
      roundsChambered: rounds,
      evacuationSecured: Boolean(evacuationSecured),
      subwayEvacuationCovered: this.subwayEvacuationCovered
    });
    return {
      subwayEvacuationCovered: this.subwayEvacuationCovered,
      roundsChambered: rounds
    };
  }

  deliverJawbreakerQuoteAndEmptyMagazine({
    roundsFired = 15,
    quoteDelivered = true
  } = {}) {
    if (!this.subwayEvacuationCovered) {
      throw new Error('Must cover evacuation before delivering jawbreaker challenge and firing.');
    }
    const fired = Math.max(0, Number(roundsFired) || 0);
    this.jawbreakerQuoteDelivered = fired >= 10 && Boolean(quoteDelivered);
    this.eventLog.push({
      step: 'JAWBREAKER_QUOTE_DELIVERED',
      roundsFired: fired,
      quoteDelivered: Boolean(quoteDelivered),
      jawbreakerQuoteDelivered: this.jawbreakerQuoteDelivered
    });
    return {
      jawbreakerQuoteDelivered: this.jawbreakerQuoteDelivered,
      roundsFired: fired
    };
  }

  slashCityHunterMeshArmorWithCombatBlade({
    bladeSlashJoules = 1850,
    meshSeveredMm = 45
  } = {}) {
    if (!this.jawbreakerQuoteDelivered) {
      throw new Error('Magazine must be emptied before engaging in blade combat against mesh armor.');
    }
    const joules = Math.max(0, Number(bladeSlashJoules) || 0);
    const severed = Math.max(0, Number(meshSeveredMm) || 0);
    this.cityHunterMeshArmorSlashed = joules >= 1400 && severed >= 30;
    this.eventLog.push({
      step: 'CITY_HUNTER_MESH_ARMOR_SLASHED',
      bladeSlashJoules: joules,
      meshSeveredMm: severed,
      cityHunterMeshArmorSlashed: this.cityHunterMeshArmorSlashed
    });
    return {
      cityHunterMeshArmorSlashed: this.cityHunterMeshArmorSlashed,
      bladeSlashJoules: joules
    };
  }

  liftJerryIntoCeilingVentilationShaft({
    liftHeightMeters = 2.4,
    trophyExtracted = true
  } = {}) {
    if (!this.cityHunterMeshArmorSlashed) {
      throw new Error('Blade slash melee must conclude before City Hunter lifts Jerry into ventilation duct.');
    }
    const height = Math.max(0, Number(liftHeightMeters) || 0);
    this.jerryHoistedIntoCeilingVent = height >= 2.0 && Boolean(trophyExtracted);
    if (this.jerryHoistedIntoCeilingVent) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'JERRY_HOISTED_INTO_CEILING_VENT',
      liftHeightMeters: height,
      trophyExtracted: Boolean(trophyExtracted),
      jerryHoistedIntoCeilingVent: this.jerryHoistedIntoCeilingVent,
      honorAwarded: this.honorAwarded
    });
    return {
      jerryHoistedIntoCeilingVent: this.jerryHoistedIntoCeilingVent,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      subwayEvacuationCovered: this.subwayEvacuationCovered,
      jawbreakerQuoteDelivered: this.jawbreakerQuoteDelivered,
      cityHunterMeshArmorSlashed: this.cityHunterMeshArmorSlashed,
      jerryHoistedIntoCeilingVent: this.jerryHoistedIntoCeilingVent,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
