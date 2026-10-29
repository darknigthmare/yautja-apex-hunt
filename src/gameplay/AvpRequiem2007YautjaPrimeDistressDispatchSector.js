/**
 * AvpRequiem2007YautjaPrimeDistressDispatchSector (v231)
 *
 * Implements iconic 1:1 canonical set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Zero-G facehugger containment breach causing catastrophic atmospheric crash of the scout ship into Gunnison forest.
 * 2. Dying Yautja scout broadcasting an encrypted sub-space distress beacon directly to the homeworld Yautja Prime.
 * 3. Wolf Predator viewing the holographic distress feed in his domed spires on Yautja Prime under dual suns.
 * 4. Selecting customized Cleaner equipment (dissolution vials, twin casters, whip) and launching solo orbital insertion (+400 Honor).
 */
export class AvpRequiem2007YautjaPrimeDistressDispatchSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_YAUTJA_PRIME_DISTRESS_DISPATCH';
    this.filmReference = 'AVP: Requiem (2007) - Scout Ship Crash, Sub-Space Beacon to Yautja Prime & Wolf Cleaner Launch';
    this.reset();
  }

  reset() {
    this.scoutShipZeroGCrashRecorded = false;
    this.subSpaceBeaconTransmitted = false;
    this.yautjaPrimeHologramReceived = false;
    this.cleanerDropPodLaunched = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  recordScoutShipZeroGCrash({
    zeroGDecelerationGForce = 18.5,
    atmosphericReentryAngleDegrees = 32
  } = {}) {
    const g = Number(zeroGDecelerationGForce) || 0;
    const deg = Number(atmosphericReentryAngleDegrees) || 0;
    this.scoutShipZeroGCrashRecorded = g >= 15.0 && deg >= 25;
    this.eventLog.push({
      step: 'SCOUT_SHIP_ZERO_G_CRASH_RECORDED',
      zeroGDecelerationGForce: g,
      atmosphericReentryAngleDegrees: deg,
      scoutShipZeroGCrashRecorded: this.scoutShipZeroGCrashRecorded
    });
    return {
      scoutShipZeroGCrashRecorded: this.scoutShipZeroGCrashRecorded
    };
  }

  transmitSubSpaceDistressBeacon({
    subSpaceTransmissionLightYears = 42,
    encryptedYautjaTelemetry = true
  } = {}) {
    if (!this.scoutShipZeroGCrashRecorded) {
      throw new Error('Must record crash before transmitting sub-space beacon.');
    }
    const ly = Math.max(0, Number(subSpaceTransmissionLightYears) || 0);
    this.subSpaceBeaconTransmitted = ly >= 30 && encryptedYautjaTelemetry === true;
    this.eventLog.push({
      step: 'SUB_SPACE_BEACON_TRANSMITTED',
      subSpaceTransmissionLightYears: ly,
      encryptedYautjaTelemetry,
      subSpaceBeaconTransmitted: this.subSpaceBeaconTransmitted
    });
    return {
      subSpaceBeaconTransmitted: this.subSpaceBeaconTransmitted
    };
  }

  receiveHologramOnYautjaPrime({
    yautjaPrimeDualSunAltitudeDeg = 45,
    hologramPredalienFaceIdentified = true
  } = {}) {
    if (!this.subSpaceBeaconTransmitted) {
      throw new Error('Must transmit beacon before receiving hologram on Yautja Prime.');
    }
    const alt = Number(yautjaPrimeDualSunAltitudeDeg) || 0;
    this.yautjaPrimeHologramReceived = alt >= 30 && hologramPredalienFaceIdentified === true;
    this.eventLog.push({
      step: 'YAUTJA_PRIME_HOLOGRAM_RECEIVED',
      yautjaPrimeDualSunAltitudeDeg: alt,
      hologramPredalienFaceIdentified,
      yautjaPrimeHologramReceived: this.yautjaPrimeHologramReceived
    });
    return {
      yautjaPrimeHologramReceived: this.yautjaPrimeHologramReceived
    };
  }

  launchCleanerSoloDropPod({
    dropPodInsertionVelocityKmh = 28500,
    cleanerKitArmamentConfirmed = true
  } = {}) {
    if (!this.yautjaPrimeHologramReceived) {
      throw new Error('Must receive hologram before launching cleaner drop pod.');
    }
    const speed = Math.max(0, Number(dropPodInsertionVelocityKmh) || 0);
    this.cleanerDropPodLaunched = speed >= 22000 && cleanerKitArmamentConfirmed === true;
    if (this.cleanerDropPodLaunched) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CLEANER_DROP_POD_LAUNCHED',
      dropPodInsertionVelocityKmh: speed,
      cleanerKitArmamentConfirmed,
      cleanerDropPodLaunched: this.cleanerDropPodLaunched,
      honorAwarded: this.honorAwarded
    });
    return {
      cleanerDropPodLaunched: this.cleanerDropPodLaunched,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.scoutShipZeroGCrashRecorded &&
      this.subSpaceBeaconTransmitted &&
      this.yautjaPrimeHologramReceived &&
      this.cleanerDropPodLaunched &&
      this.honorAwarded === 400
    );
  }
}
