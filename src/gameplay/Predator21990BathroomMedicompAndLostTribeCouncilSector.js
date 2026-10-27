/**
 * Predator21990BathroomMedicompAndLostTribeCouncilSector (v205)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. The wounded City Hunter performing emergency surgery in an apartment bathroom
 *    using his Medicomp kit, injecting coagulants and melting tile shards at 680°C to cauterize his severed arm stump.
 * 2. The City Hunter roaring in agony through the cracked frosted window, terrifying elderly apartment residents.
 * 3. Mike Harrigan descending into the subterranean Lost Tribe mothership hidden beneath the Los Angeles subway,
 *    surrounded by 9 Elder Yautja hunters.
 * 4. Elder Greyback stepping forward, handing the antique flintlock pistol engraved "Raphael Adolini 1715"
 *    to Harrigan with the immortal line: "Take it."
 */
export class Predator21990BathroomMedicompAndLostTribeCouncilSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_BATHROOM_MEDICOMP_AND_LOST_TRIBE_COUNCIL';
    this.filmReference = 'Predator 2 (1990) - Apartment Medicomp Cauterization & Lost Tribe Mothership Council';
    this.reset();
  }

  reset() {
    this.medicompEmergencySurgeryCompleted = false;
    this.bathroomWindowAgonyRoarDelivered = false;
    this.subterraneanMothershipEntered = false;
    this.adoliniFlintlockReceivedFromGreyback = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  performEmergencyMedicompSeveredArmCauterization({
    coagulantInjectedMl = 12,
    tileShardMeltedTempCelsius = 680
  } = {}) {
    const ml = Math.max(0, Number(coagulantInjectedMl) || 0);
    const temp = Math.max(0, Number(tileShardMeltedTempCelsius) || 0);
    this.medicompEmergencySurgeryCompleted = ml >= 8 && temp >= 600;
    this.eventLog.push({
      step: 'MEDICOMP_EMERGENCY_SURGERY_COMPLETED',
      coagulantInjectedMl: ml,
      tileShardMeltedTempCelsius: temp,
      medicompEmergencySurgeryCompleted: this.medicompEmergencySurgeryCompleted
    });
    return {
      medicompEmergencySurgeryCompleted: this.medicompEmergencySurgeryCompleted,
      coagulantInjectedMl: ml,
      tileShardMeltedTempCelsius: temp
    };
  }

  unleashBathroomWindowRoarOfAgony({
    roarDecibels = 110,
    elderlyWitnessesTerrified = true
  } = {}) {
    if (!this.medicompEmergencySurgeryCompleted) {
      throw new Error('Cauterization must be applied before the City Hunter lets out the window roar of agony.');
    }
    const db = Math.max(0, Number(roarDecibels) || 0);
    this.bathroomWindowAgonyRoarDelivered = db >= 95 && Boolean(elderlyWitnessesTerrified);
    this.eventLog.push({
      step: 'BATHROOM_WINDOW_AGONY_ROAR_DELIVERED',
      roarDecibels: db,
      bathroomWindowAgonyRoarDelivered: this.bathroomWindowAgonyRoarDelivered
    });
    return {
      bathroomWindowAgonyRoarDelivered: this.bathroomWindowAgonyRoarDelivered,
      roarDecibels: db
    };
  }

  enterSubterraneanLostTribeMothership({
    eldersSurroundingCount = 9,
    mothershipDisguisedUnderSubway = true
  } = {}) {
    if (!this.bathroomWindowAgonyRoarDelivered) {
      throw new Error('Bathroom surgery aftermath must precede the subway descent into the Lost Tribe ship.');
    }
    const count = Math.max(0, Math.floor(Number(eldersSurroundingCount) || 0));
    this.subterraneanMothershipEntered = count === 9 && Boolean(mothershipDisguisedUnderSubway);
    this.eventLog.push({
      step: 'SUBTERRANEAN_MOTHERSHIP_ENTERED',
      eldersSurroundingCount: count,
      subterraneanMothershipEntered: this.subterraneanMothershipEntered
    });
    return {
      subterraneanMothershipEntered: this.subterraneanMothershipEntered,
      eldersSurroundingCount: count
    };
  }

  receiveRaphaelAdolini1715FlintlockFromGreyback({
    elderGreybackSpokeTakeIt = true,
    flintlockSeizedByHarrigan = true
  } = {}) {
    if (!this.subterraneanMothershipEntered) {
      throw new Error('Harrigan must enter the mothership chamber before Elder Greyback presents the flintlock.');
    }
    this.adoliniFlintlockReceivedFromGreyback =
      Boolean(elderGreybackSpokeTakeIt) && Boolean(flintlockSeizedByHarrigan);
    if (this.adoliniFlintlockReceivedFromGreyback) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'ADOLINI_FLINTLOCK_RECEIVED_FROM_GREYBACK',
      adoliniFlintlockReceivedFromGreyback: this.adoliniFlintlockReceivedFromGreyback,
      honorAwarded: this.honorAwarded
    });
    return {
      adoliniFlintlockReceivedFromGreyback: this.adoliniFlintlockReceivedFromGreyback,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      medicompEmergencySurgeryCompleted: this.medicompEmergencySurgeryCompleted,
      bathroomWindowAgonyRoarDelivered: this.bathroomWindowAgonyRoarDelivered,
      subterraneanMothershipEntered: this.subterraneanMothershipEntered,
      adoliniFlintlockReceivedFromGreyback: this.adoliniFlintlockReceivedFromGreyback,
      honorAwarded: this.honorAwarded
    };
  }
}
