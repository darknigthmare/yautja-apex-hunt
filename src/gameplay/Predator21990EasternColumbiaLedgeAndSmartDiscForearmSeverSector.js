/**
 * Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector (v209)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. Mike Harrigan dangling from the Eastern Columbia Building turquoise terracotta ledge 140m above Broadway.
 * 2. Being pinned to the ornamental masonry cornice by the City Hunter's high-tension wire net-gun.
 * 3. Throwing the recovered Smart-Disc to cleanly sever the City Hunter's left forearm and computer gauntlet.
 * 4. Watching the City Hunter plunge 18m through a lower residential apartment window into a bathroom.
 */
export class Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_EASTERN_COLUMBIA_LEDGE_AND_SMART_DISC_FOREARM_SEVER';
    this.filmReference = 'Predator 2 (1990) - Eastern Columbia Cornice Ledge, Net-Gun Pin, Forearm Sever & Window Plunge';
    this.reset();
  }

  reset() {
    this.corniceLedgeDangled = false;
    this.netGunCornicePinned = false;
    this.cityHunterForearmSevered = false;
    this.apartmentWindowPlunged = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  dangleOverEasternColumbiaCorniceLedge({
    dropHeightMeters = 140,
    gripStrengthNewtons = 850
  } = {}) {
    const height = Math.max(0, Number(dropHeightMeters) || 0);
    const grip = Math.max(0, Number(gripStrengthNewtons) || 0);
    this.corniceLedgeDangled = height >= 120 && grip >= 600;
    this.eventLog.push({
      step: 'CORNICE_LEDGE_DANGLED',
      dropHeightMeters: height,
      gripStrengthNewtons: grip,
      corniceLedgeDangled: this.corniceLedgeDangled
    });
    return {
      corniceLedgeDangled: this.corniceLedgeDangled,
      dropHeightMeters: height
    };
  }

  endureNetGunPinAgainstOrnamentalCornice({
    wireTensionNewtons = 2800,
    fleshIncisionMm = 8
  } = {}) {
    if (!this.corniceLedgeDangled) {
      throw new Error('Must dangle from exterior ledge before being pinned by net-gun against the cornice.');
    }
    const tension = Math.max(0, Number(wireTensionNewtons) || 0);
    const incision = Math.max(0, Number(fleshIncisionMm) || 0);
    this.netGunCornicePinned = tension >= 2000 && incision <= 12;
    this.eventLog.push({
      step: 'NET_GUN_CORNICE_PINNED',
      wireTensionNewtons: tension,
      fleshIncisionMm: incision,
      netGunCornicePinned: this.netGunCornicePinned
    });
    return {
      netGunCornicePinned: this.netGunCornicePinned,
      wireTensionNewtons: tension
    };
  }

  severCityHunterForearmWithSmartDisc({
    throwVelocityMps = 75,
    forearmSeveredClean = true
  } = {}) {
    if (!this.netGunCornicePinned) {
      throw new Error('Net-gun pin must be endured before slicing City Hunter forearm with the Smart-Disc.');
    }
    const velocity = Math.max(0, Number(throwVelocityMps) || 0);
    this.cityHunterForearmSevered = velocity >= 60 && Boolean(forearmSeveredClean);
    this.eventLog.push({
      step: 'CITY_HUNTER_FOREARM_SEVERED',
      throwVelocityMps: velocity,
      forearmSeveredClean: Boolean(forearmSeveredClean),
      cityHunterForearmSevered: this.cityHunterForearmSevered
    });
    return {
      cityHunterForearmSevered: this.cityHunterForearmSevered,
      throwVelocityMps: velocity
    };
  }

  witnessCityHunterPlungeIntoApartmentWindow({
    plungeDistanceMeters = 18,
    windowShattered = true
  } = {}) {
    if (!this.cityHunterForearmSevered) {
      throw new Error('Forearm must be severed before City Hunter falls from cornice into apartment window.');
    }
    const fallMeters = Math.max(0, Number(plungeDistanceMeters) || 0);
    this.apartmentWindowPlunged = fallMeters >= 12 && Boolean(windowShattered);
    if (this.apartmentWindowPlunged) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'APARTMENT_WINDOW_PLUNGED',
      plungeDistanceMeters: fallMeters,
      windowShattered: Boolean(windowShattered),
      apartmentWindowPlunged: this.apartmentWindowPlunged,
      honorAwarded: this.honorAwarded
    });
    return {
      apartmentWindowPlunged: this.apartmentWindowPlunged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      corniceLedgeDangled: this.corniceLedgeDangled,
      netGunCornicePinned: this.netGunCornicePinned,
      cityHunterForearmSevered: this.cityHunterForearmSevered,
      apartmentWindowPlunged: this.apartmentWindowPlunged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
