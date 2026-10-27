/**
 * AvpRequiem2007GunnisonPowerPlantBlackoutSector (v205)
 *
 * Implements iconic 1:1 set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Wolf infiltrating the Gunnison electrical power plant substation, overloading transformers with 115 MV
 *    to plunge the entire town into terrifying total darkness.
 * 2. Purging the cemetery groundskeeper and mortuary victims using the blue acid solvent to erase all bio-evidence.
 * 3. Synchronizing dual shoulder plasma casters to create independent sweeping tri-laser targeting fields.
 * 4. Recovering Colonel Stevens' briefcase before the B61 tactical thermonuclear bomb detonates over Gunnison,
 *    delivering the alien weapon system to Ms. Yutani in Tokyo.
 */
export class AvpRequiem2007GunnisonPowerPlantBlackoutSector {
  constructor() {
    this.sectorId = 'AVPR_2007_GUNNISON_POWER_PLANT_BLACKOUT_SECTOR';
    this.filmReference = 'AVP: Requiem (2007) - Power Substation Blackout & Dual Shoulder Plasma Triangulation';
    this.reset();
  }

  reset() {
    this.townCastIntoDarkness = false;
    this.cemeteryAndMortuaryPurged = false;
    this.dualPlasmaCastersSynchronized = false;
    this.stevensBriefcaseExtractedBeforeNuke = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  sabotageGunnisonElectricalSubstationGrid({
    transformerMegavoltsOverloaded = 115,
    townCastIntoDarkness = true
  } = {}) {
    const mv = Math.max(0, Number(transformerMegavoltsOverloaded) || 0);
    this.townCastIntoDarkness = mv >= 90 && Boolean(townCastIntoDarkness);
    this.eventLog.push({
      step: 'GUNNISON_ELECTRICAL_SUBSTATION_SABOTAGED',
      transformerMegavoltsOverloaded: mv,
      townCastIntoDarkness: this.townCastIntoDarkness
    });
    return {
      townCastIntoDarkness: this.townCastIntoDarkness,
      transformerMegavoltsOverloaded: mv
    };
  }

  purgeInfestedCemeteryGroundskeeperAndMortuary({
    acidVialDisposed = true,
    mortuaryCleaned = true
  } = {}) {
    if (!this.townCastIntoDarkness) {
      throw new Error('Blackout must occur before Wolf moves silently through the cemetery mortuary.');
    }
    this.cemeteryAndMortuaryPurged = Boolean(acidVialDisposed) && Boolean(mortuaryCleaned);
    this.eventLog.push({
      step: 'CEMETERY_AND_MORTUARY_PURGED',
      cemeteryAndMortuaryPurged: this.cemeteryAndMortuaryPurged
    });
    return {
      cemeteryAndMortuaryPurged: this.cemeteryAndMortuaryPurged
    };
  }

  synchronizeDualPlasmaCasterTargetingTriangles({
    leftCasterCalibrated = true,
    rightCasterCalibrated = true
  } = {}) {
    if (!this.cemeteryAndMortuaryPurged) {
      throw new Error('Mortuary evidence must be dissolved before calibrating twin shoulder plasma casters.');
    }
    this.dualPlasmaCastersSynchronized = Boolean(leftCasterCalibrated) && Boolean(rightCasterCalibrated);
    this.eventLog.push({
      step: 'DUAL_PLASMA_CASTERS_SYNCHRONIZED',
      dualPlasmaCastersSynchronized: this.dualPlasmaCastersSynchronized
    });
    return {
      dualPlasmaCastersSynchronized: this.dualPlasmaCastersSynchronized
    };
  }

  extractStevensBriefcaseBeforeB61TacticalNukeDetonation({
    blastDistanceKm = 12.5,
    briefcaseRetrievedForYutani = true
  } = {}) {
    if (!this.dualPlasmaCastersSynchronized) {
      throw new Error('Twin plasma casters must be calibrated before exfiltrating with the tactical briefcase.');
    }
    const dist = Math.max(0, Number(blastDistanceKm) || 0);
    this.stevensBriefcaseExtractedBeforeNuke = dist >= 10.0 && Boolean(briefcaseRetrievedForYutani);
    if (this.stevensBriefcaseExtractedBeforeNuke) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'STEVENS_BRIEFCASE_EXTRACTED_BEFORE_NUKE',
      blastDistanceKm: dist,
      stevensBriefcaseExtractedBeforeNuke: this.stevensBriefcaseExtractedBeforeNuke,
      honorAwarded: this.honorAwarded
    });
    return {
      stevensBriefcaseExtractedBeforeNuke: this.stevensBriefcaseExtractedBeforeNuke,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      townCastIntoDarkness: this.townCastIntoDarkness,
      cemeteryAndMortuaryPurged: this.cemeteryAndMortuaryPurged,
      dualPlasmaCastersSynchronized: this.dualPlasmaCastersSynchronized,
      stevensBriefcaseExtractedBeforeNuke: this.stevensBriefcaseExtractedBeforeNuke,
      honorAwarded: this.honorAwarded
    };
  }
}
