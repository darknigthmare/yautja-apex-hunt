/**
 * Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector (v211)
 *
 * Implements iconic 1:1 set-pieces from Prey (2022) and Predator: Badlands (2025):
 * 1. Naru retrieving the engraved flintlock pistol ("Raphael Adolini 1715") from the dying French voyageur translator.
 * 2. Firing the heavy lead ball through Feral's leg to force the wounded hunter into the treacherous quicksand bog.
 * 3. Dek, Thia, and Bud ascending the wind-swept 3,400-meter Primordial Peak of Yautja Prime bearing the 1715 pistol.
 * 4. Placing the Adolini flintlock beside the Badlands Double Glaive upon the Primordial Apex Altar, unifying the 38-year saga (1987-2025).
 */
export class Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector {
  constructor() {
    this.sectorId = 'PREY_2022_FLINTLOCK_ADOLINI_1715_AND_PRIMORDIAL_APEX_ALTAR';
    this.filmReference = 'Prey (2022) & Predator: Badlands (2025) - Raphael Adolini 1715, Quicksand Shot & Primordial Apex Altar';
    this.reset();
  }

  reset() {
    this.flintlock1715Retrieved = false;
    this.flintlockLeadBallFiredIntoFeralLeg = false;
    this.primordialPeakAscended = false;
    this.primordialApexAltarConsecrated = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  retrieveEngravedFlintlockFromRaphaelAdolini({
    inscriptionMatched = 'Raphael Adolini 1715',
    primedWithBlackPowder = true
  } = {}) {
    this.flintlock1715Retrieved =
      inscriptionMatched === 'Raphael Adolini 1715' && Boolean(primedWithBlackPowder);
    this.eventLog.push({
      step: 'FLINTLOCK_1715_RETRIEVED',
      inscriptionMatched,
      primedWithBlackPowder: Boolean(primedWithBlackPowder),
      flintlock1715Retrieved: this.flintlock1715Retrieved
    });
    return {
      flintlock1715Retrieved: this.flintlock1715Retrieved,
      inscriptionMatched
    };
  }

  fireLeadBallThroughFeralPredatorLeg({
    muzzleVelocityMps = 280,
    bogQuicksandTrapSprung = true
  } = {}) {
    if (!this.flintlock1715Retrieved) {
      throw new Error('Must retrieve Raphael Adolini 1715 flintlock before taking aim at Feral leg.');
    }
    const vel = Math.max(0, Number(muzzleVelocityMps) || 0);
    this.flintlockLeadBallFiredIntoFeralLeg = vel >= 240 && Boolean(bogQuicksandTrapSprung);
    this.eventLog.push({
      step: 'FLINTLOCK_LEAD_BALL_FIRED_INTO_FERAL_LEG',
      muzzleVelocityMps: vel,
      bogQuicksandTrapSprung: Boolean(bogQuicksandTrapSprung),
      flintlockLeadBallFiredIntoFeralLeg: this.flintlockLeadBallFiredIntoFeralLeg
    });
    return {
      flintlockLeadBallFiredIntoFeralLeg: this.flintlockLeadBallFiredIntoFeralLeg,
      muzzleVelocityMps: vel
    };
  }

  ascendPrimordialPeakOnYautjaPrimeWithFlintlock({
    peakAltitudeMeters = 3400,
    councilChamberReached = true
  } = {}) {
    if (!this.flintlockLeadBallFiredIntoFeralLeg) {
      throw new Error('Feral must be forced into bog trap before carrying the 1715 relic to Yautja Prime.');
    }
    const alt = Math.max(0, Number(peakAltitudeMeters) || 0);
    this.primordialPeakAscended = alt >= 2800 && Boolean(councilChamberReached);
    this.eventLog.push({
      step: 'PRIMORDIAL_PEAK_ASCENDED',
      peakAltitudeMeters: alt,
      councilChamberReached: Boolean(councilChamberReached),
      primordialPeakAscended: this.primordialPeakAscended
    });
    return {
      primordialPeakAscended: this.primordialPeakAscended,
      peakAltitudeMeters: alt
    };
  }

  consecratePrimordialApexAltarUnifyingThirtyEightYearSaga({
    flintlockPlacedOnAltar = true,
    thirtyEightYearSagaUnified = true
  } = {}) {
    if (!this.primordialPeakAscended) {
      throw new Error('Must ascend Primordial Peak before consecrating the Primordial Apex Altar.');
    }
    this.primordialApexAltarConsecrated =
      Boolean(flintlockPlacedOnAltar) && Boolean(thirtyEightYearSagaUnified);
    if (this.primordialApexAltarConsecrated) {
      this.honorAwarded = 500;
    }
    this.eventLog.push({
      step: 'PRIMORDIAL_APEX_ALTAR_CONSECRATED',
      flintlockPlacedOnAltar: Boolean(flintlockPlacedOnAltar),
      thirtyEightYearSagaUnified: Boolean(thirtyEightYearSagaUnified),
      primordialApexAltarConsecrated: this.primordialApexAltarConsecrated,
      honorAwarded: this.honorAwarded
    });
    return {
      primordialApexAltarConsecrated: this.primordialApexAltarConsecrated,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      flintlock1715Retrieved: this.flintlock1715Retrieved,
      flintlockLeadBallFiredIntoFeralLeg: this.flintlockLeadBallFiredIntoFeralLeg,
      primordialPeakAscended: this.primordialPeakAscended,
      primordialApexAltarConsecrated: this.primordialApexAltarConsecrated,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
