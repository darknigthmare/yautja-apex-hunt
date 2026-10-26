/**
 * Chantier 2 (v203) : Sacrifice de Jerry Lambert dans le Métro & Scan Échographique de Leona Cantrell (Predator 2 - 1990)
 * Complète en fidélité 1:1 les scènes humaines et d'honneur de Predator 2 (1990) : expulsion du
 * journaliste à scandale Tony Pope (Hard Core TV), baroud d'honneur de l'inspecteur Jerry Lambert
 * (« Want some candy? », 15 tirs) couvrant l'évacuation de 18 passagers par Leona Cantrell, et scan
 * échographique du bio-masque détectant le fœtus (148 BPM) dans le ventre de Leona pour l'épargner.
 */
export class Predator21990LeonaAndJerrySubwayPursuitAndTonyPopeBriefcaseSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_JERRY_STAND_AND_LEONA_ULTRASOUND_MERCY';
    this.filmReference = 'Predator 2 (1990) - Tony Pope Ejection, Jerry Lambert Subway Stand & Leona Pregnancy Mercy';
    this.reset();
  }

  reset() {
    this.tonyPopeEjected = false;
    this.jerryLastStandCompleted = false;
    this.passengersEvacuatedCount = 0;
    this.leonaSparedDueToPregnancyScan = false;
    this.fetalHeartbeatBpm = 0;
    this.jerryTrophyClaimedOnSubwayRoof = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  ejectTabloidReporterTonyPopeFromCrimeScene({
    cameraConfiscated = true,
    perimeterResealed = true
  } = {}) {
    this.tonyPopeEjected =
      Boolean(cameraConfiscated) && Boolean(perimeterResealed);
    this.eventLog.push({
      step: 'TONY_POPE_EJECTED_FROM_CRIME_SCENE',
      tonyPopeEjected: this.tonyPopeEjected
    });
    return {
      tonyPopeEjected: this.tonyPopeEjected
    };
  }

  jerryLambertLastStandInStrobeSubwayCar({
    roundsFiredByJerry = 15,
    passengersEvacuatedByLeona = 18
  } = {}) {
    if (!this.tonyPopeEjected) {
      throw new Error('Crime scene sequence must complete before Jerry and Leona board the Blue Line subway.');
    }
    const rounds = Math.max(0, Math.floor(Number(roundsFiredByJerry) || 0));
    this.passengersEvacuatedCount = Math.max(0, Math.floor(Number(passengersEvacuatedByLeona) || 0));
    this.jerryLastStandCompleted =
      rounds >= 12 && this.passengersEvacuatedCount >= 15;
    this.eventLog.push({
      step: 'JERRY_LAMBERT_SUBWAY_LAST_STAND',
      roundsFiredByJerry: rounds,
      passengersEvacuatedCount: this.passengersEvacuatedCount,
      jerryLastStandCompleted: this.jerryLastStandCompleted
    });
    return {
      jerryLastStandCompleted: this.jerryLastStandCompleted,
      passengersEvacuatedCount: this.passengersEvacuatedCount
    };
  }

  scanLeonaCantrellWombWithBioMaskUltrasound({
    fetalHeartbeatBpm = 148,
    unarmedPregnantTargetSpared = true
  } = {}) {
    if (!this.jerryLastStandCompleted) {
      throw new Error('Jerry Lambert stand must occur before the City Hunter corners Leona Cantrell.');
    }
    this.fetalHeartbeatBpm = Math.max(0, Number(fetalHeartbeatBpm) || 0);
    this.leonaSparedDueToPregnancyScan =
      this.fetalHeartbeatBpm >= 120 &&
      this.fetalHeartbeatBpm <= 175 &&
      Boolean(unarmedPregnantTargetSpared);
    this.eventLog.push({
      step: 'LEONA_PREGNANCY_ULTRASOUND_SCAN_MERCY',
      fetalHeartbeatBpm: this.fetalHeartbeatBpm,
      leonaSparedDueToPregnancyScan: this.leonaSparedDueToPregnancyScan
    });
    return {
      leonaSparedDueToPregnancyScan: this.leonaSparedDueToPregnancyScan,
      fetalHeartbeatBpm: this.fetalHeartbeatBpm
    };
  }

  claimJerryLambertSpineTrophyInSubwayRoof({
    skullAndSpineExtracted = true,
    harriganArrivesAtAftermath = true
  } = {}) {
    if (!this.leonaSparedDueToPregnancyScan) {
      throw new Error('Leona ultrasound mercy scan must complete before claiming Jerry Lambert warrior trophy.');
    }
    this.jerryTrophyClaimedOnSubwayRoof =
      Boolean(skullAndSpineExtracted) && Boolean(harriganArrivesAtAftermath);
    if (this.jerryTrophyClaimedOnSubwayRoof) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'JERRY_LAMBERT_WARRIOR_TROPHY_CLAIMED',
      jerryTrophyClaimedOnSubwayRoof: this.jerryTrophyClaimedOnSubwayRoof,
      honorAwarded: this.honorAwarded
    });
    return {
      jerryTrophyClaimedOnSubwayRoof: this.jerryTrophyClaimedOnSubwayRoof,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      tonyPopeEjected: this.tonyPopeEjected,
      jerryLastStandCompleted: this.jerryLastStandCompleted,
      leonaSparedDueToPregnancyScan: this.leonaSparedDueToPregnancyScan,
      jerryTrophyClaimedOnSubwayRoof: this.jerryTrophyClaimedOnSubwayRoof,
      honorAwarded: this.honorAwarded
    };
  }
}
