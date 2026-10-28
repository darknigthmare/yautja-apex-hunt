/**
 * AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector (v211)
 *
 * Implements iconic 1:1 set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Tracking Predalien contamination and acid spore residues across the darkened Gunnison hospital pediatric ward.
 * 2. Uncoiling the barbed segment whip at 350 m/s to bisect ambushing Xenomorph warriors against the metal corridor lockers.
 * 3. Self-injecting blue cauterizing medicinal serum into Wolf's bleeding chest cavity using his wrist medicomp syringe.
 * 4. Holding the reinforced steel stairwell door to cover the evacuation of civilian survivors towards the rooftop helipad.
 */
export class AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_HOSPITAL_PEDIATRIC_WARD_AND_SONIC_WHIP_STRIKE';
    this.filmReference = 'AVP: Requiem (2007) - Pediatric Ward Tracking, Sonic Whip Bissection, Medicomp Injection & Helipad Stairwell';
    this.reset();
  }

  reset() {
    this.pediatricWardContaminationTracked = false;
    this.dronesBisectedByWhip = false;
    this.medicompSerumInjected = false;
    this.helipadStairwellDefended = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  trackPredalienContaminationInPediatricWard({
    sporeTracesIdentified = 12,
    nightVisionActive = true
  } = {}) {
    const spores = Math.max(0, Number(sporeTracesIdentified) || 0);
    this.pediatricWardContaminationTracked = spores >= 8 && Boolean(nightVisionActive);
    this.eventLog.push({
      step: 'PEDIATRIC_WARD_CONTAMINATION_TRACKED',
      sporeTracesIdentified: spores,
      nightVisionActive: Boolean(nightVisionActive),
      pediatricWardContaminationTracked: this.pediatricWardContaminationTracked
    });
    return {
      pediatricWardContaminationTracked: this.pediatricWardContaminationTracked,
      sporeTracesIdentified: spores
    };
  }

  bisectAmbushingDronesWithSonicWhipStrike({
    whipTipVelocityMps = 350,
    dronesBisectedCount = 3
  } = {}) {
    if (!this.pediatricWardContaminationTracked) {
      throw new Error('Must track contamination trail before engaging ambushing drones with whip.');
    }
    const vel = Math.max(0, Number(whipTipVelocityMps) || 0);
    const count = Math.max(0, Number(dronesBisectedCount) || 0);
    this.dronesBisectedByWhip = vel >= 320 && count >= 2;
    this.eventLog.push({
      step: 'DRONES_BISECTED_BY_WHIP',
      whipTipVelocityMps: vel,
      dronesBisectedCount: count,
      dronesBisectedByWhip: this.dronesBisectedByWhip
    });
    return {
      dronesBisectedByWhip: this.dronesBisectedByWhip,
      whipTipVelocityMps: vel
    };
  }

  selfInjectMedicompHealingSerumIntoChestWound({
    serumDosageMl = 25,
    tissueRegenerationRatePercent = 45
  } = {}) {
    if (!this.dronesBisectedByWhip) {
      throw new Error('Combat round must conclude before administering medicomp emergency injection.');
    }
    const dosage = Math.max(0, Number(serumDosageMl) || 0);
    const rate = Math.max(0, Number(tissueRegenerationRatePercent) || 0);
    this.medicompSerumInjected = dosage >= 15 && rate >= 35;
    this.eventLog.push({
      step: 'MEDICOMP_SERUM_INJECTED',
      serumDosageMl: dosage,
      tissueRegenerationRatePercent: rate,
      medicompSerumInjected: this.medicompSerumInjected
    });
    return {
      medicompSerumInjected: this.medicompSerumInjected,
      serumDosageMl: dosage
    };
  }

  defendHelipadStairwellDoorForCivilianEscape({
    survivorsEscortedCount = 3,
    stairwellSealed = true
  } = {}) {
    if (!this.medicompSerumInjected) {
      throw new Error('Must administer healing serum before mounting helipad stairwell last stand.');
    }
    const survivors = Math.max(0, Number(survivorsEscortedCount) || 0);
    this.helipadStairwellDefended = survivors >= 2 && Boolean(stairwellSealed);
    if (this.helipadStairwellDefended) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'HELIPAD_STAIRWELL_DEFENDED',
      survivorsEscortedCount: survivors,
      stairwellSealed: Boolean(stairwellSealed),
      helipadStairwellDefended: this.helipadStairwellDefended,
      honorAwarded: this.honorAwarded
    });
    return {
      helipadStairwellDefended: this.helipadStairwellDefended,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      pediatricWardContaminationTracked: this.pediatricWardContaminationTracked,
      dronesBisectedByWhip: this.dronesBisectedByWhip,
      medicompSerumInjected: this.medicompSerumInjected,
      helipadStairwellDefended: this.helipadStairwellDefended,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
