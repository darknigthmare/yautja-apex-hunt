/**
 * Chantier 5 (v202) : Duel de Couloir Tracker Predator contre Nikolai (2010) & Évasion du Fugitive Predator (2018)
 * Complète en fidélité 1:1 la traque souterraine de Tracker Predator dans Predators (2010)
 * (vaporisation de Noland au tir plasma coudé à 5 800 J et sacrifice de Nikolai avec 2 mines
 * Claymore M18A1 projetant 1 400 billes d'acier), ainsi que le bris des entraves en titane (1 850 N·m)
 * par le Fugitive Predator dans le laboratoire Project Stargazer de The Predator (2018).
 */
export class Predators2010TrackerPredatorFlushingHoundsAndNikolaiStandSector {
  constructor() {
    this.sectorId = 'PREDATORS_2010_TRACKER_NIKOLAI_AND_2018_FUGITIVE_LAB_BREAKOUT';
    this.filmReference = 'Predators (2010) Tracker vs Nikolai & The Predator (2018) Fugitive Titanium Restraint Breakout';
    this.reset();
  }

  reset() {
    this.nolandVaporizedByCornerPlasma = false;
    this.trackerKilledByNikolaiClaymores = false;
    this.fugitiveTitaniumRestraintsSnapped = false;
    this.fugitiveBioMaskRecovered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  vaporizeNolandInSubterraneanCorridorWithCornerPlasma({
    plasmaBoltYieldJoules = 5800,
    nolandCloakRigDestroyed = true
  } = {}) {
    const joules = Math.max(0, Number(plasmaBoltYieldJoules) || 0);
    this.nolandVaporizedByCornerPlasma =
      joules >= 5000 && Boolean(nolandCloakRigDestroyed);
    this.eventLog.push({
      step: 'NOLAND_VAPORIZED_BY_CORNER_PLASMA',
      plasmaBoltYieldJoules: joules,
      nolandVaporizedByCornerPlasma: this.nolandVaporizedByCornerPlasma
    });
    return {
      nolandVaporizedByCornerPlasma: this.nolandVaporizedByCornerPlasma,
      plasmaBoltYieldJoules: joules
    };
  }

  engageTrackerPredatorWithNikolaiDualClaymores({
    claymoreBallBearingsCount = 1400,
    trackerPredatorKilled = true
  } = {}) {
    if (!this.nolandVaporizedByCornerPlasma) {
      throw new Error('Noland corridor ambush must occur before Nikolai engages Tracker Predator.');
    }
    const bearings = Math.max(0, Math.floor(Number(claymoreBallBearingsCount) || 0));
    this.trackerKilledByNikolaiClaymores =
      bearings >= 1200 && Boolean(trackerPredatorKilled);
    this.eventLog.push({
      step: 'NIKOLAI_DUAL_CLAYMORES_KILL_TRACKER',
      claymoreBallBearingsCount: bearings,
      trackerKilledByNikolaiClaymores: this.trackerKilledByNikolaiClaymores
    });
    return {
      trackerKilledByNikolaiClaymores: this.trackerKilledByNikolaiClaymores,
      claymoreBallBearingsCount: bearings
    };
  }

  fugitivePredatorSnapTitaniumRestraintsInStargazerLab({
    snapTorqueNm = 1850,
    humanRifleUsedImprovised = true
  } = {}) {
    if (!this.trackerKilledByNikolaiClaymores) {
      throw new Error('Tracker corridor sequence must complete before Fugitive Predator lab breakout.');
    }
    const torque = Math.max(0, Number(snapTorqueNm) || 0);
    this.fugitiveTitaniumRestraintsSnapped =
      torque >= 1500 && Boolean(humanRifleUsedImprovised);
    this.eventLog.push({
      step: 'FUGITIVE_PREDATOR_TITANIUM_RESTRAINTS_SNAPPED',
      snapTorqueNm: torque,
      fugitiveTitaniumRestraintsSnapped: this.fugitiveTitaniumRestraintsSnapped
    });
    return {
      fugitiveTitaniumRestraintsSnapped: this.fugitiveTitaniumRestraintsSnapped,
      snapTorqueNm: torque
    };
  }

  recoverFugitiveBioMaskFromTechVault({
    retinalHudRebooted = true,
    rooftopLeapCompleted = true
  } = {}) {
    if (!this.fugitiveTitaniumRestraintsSnapped) {
      throw new Error('Titanium restraints must be snapped before recovering the Fugitive bio-mask.');
    }
    this.fugitiveBioMaskRecovered =
      Boolean(retinalHudRebooted) && Boolean(rooftopLeapCompleted);
    if (this.fugitiveBioMaskRecovered) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'FUGITIVE_BIOMASK_RECOVERED_AND_ROOFTOP_LEAP',
      fugitiveBioMaskRecovered: this.fugitiveBioMaskRecovered,
      honorAwarded: this.honorAwarded
    });
    return {
      fugitiveBioMaskRecovered: this.fugitiveBioMaskRecovered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      nolandVaporizedByCornerPlasma: this.nolandVaporizedByCornerPlasma,
      trackerKilledByNikolaiClaymores: this.trackerKilledByNikolaiClaymores,
      fugitiveTitaniumRestraintsSnapped: this.fugitiveTitaniumRestraintsSnapped,
      fugitiveBioMaskRecovered: this.fugitiveBioMaskRecovered,
      honorAwarded: this.honorAwarded
    };
  }
}
