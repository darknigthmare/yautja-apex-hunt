/**
 * AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector (v208)
 *
 * Implements iconic 1:1 set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Dallas Howard and survivors raiding the Gunnison National Guard Armory for heavy weapons and M4 carbines.
 * 2. Wolf Predator dual-wielding his combi-spear and razor-barbed whip in torrential rain against Xenomorph swarms.
 * 3. The military B61 tactical nuclear airburst (15 kilotons at 650m altitude) obliterating the town of Gunnison.
 * 4. The medical evacuation helicopter lifting off from the hospital rooftop and surfing the nuke's thermal shockwave.
 */
export class AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_NATIONAL_GUARD_ARMORY_RAID_AND_NUKE_AIRBURST';
    this.filmReference = 'AVP: Requiem (2007) - National Guard Armory, Wolf Whip Rain Duel, 15kt Nuke & Helipad Evac';
    this.reset();
  }

  reset() {
    this.nationalGuardArmoryRaided = false;
    this.wolfDualWieldDuelResolved = false;
    this.nukeAirburstWitnessed = false;
    this.helipadEvacuationSuccessful = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  raidNationalGuardArmoryForHeavyCarbines({
    m4CarbinesEquipped = 6,
    m2HeavyFiftyCalMounted = true
  } = {}) {
    const carbines = Math.max(0, Number(m4CarbinesEquipped) || 0);
    this.nationalGuardArmoryRaided = carbines >= 4 && Boolean(m2HeavyFiftyCalMounted);
    this.eventLog.push({
      step: 'NATIONAL_GUARD_ARMORY_RAIDED',
      m4CarbinesEquipped: carbines,
      m2HeavyFiftyCalMounted: Boolean(m2HeavyFiftyCalMounted),
      nationalGuardArmoryRaided: this.nationalGuardArmoryRaided
    });
    return {
      nationalGuardArmoryRaided: this.nationalGuardArmoryRaided,
      m4CarbinesEquipped: carbines
    };
  }

  dualWieldWolfCombiSpearAndBarbedWhipInRain({
    spearThrustRateHz = 3.2,
    whipCrackVelocityMps = 340
  } = {}) {
    if (!this.nationalGuardArmoryRaided) {
      throw new Error('Survivors must raid armory before Wolf unleashes his dual spear and whip combat in rain.');
    }
    const thrustRate = Math.max(0, Number(spearThrustRateHz) || 0);
    const whipVelocity = Math.max(0, Number(whipCrackVelocityMps) || 0);
    this.wolfDualWieldDuelResolved = thrustRate >= 2.5 && whipVelocity >= 300;
    this.eventLog.push({
      step: 'WOLF_DUAL_WIELD_DUEL_RESOLVED',
      spearThrustRateHz: thrustRate,
      whipCrackVelocityMps: whipVelocity,
      wolfDualWieldDuelResolved: this.wolfDualWieldDuelResolved
    });
    return {
      wolfDualWieldDuelResolved: this.wolfDualWieldDuelResolved,
      whipCrackVelocityMps: whipVelocity
    };
  }

  witnessFifteenKilotonB61NukeAirburst({
    yieldKilotonB61 = 15,
    airburstAltitudeMeters = 650
  } = {}) {
    if (!this.wolfDualWieldDuelResolved) {
      throw new Error('Wolf duel must conclude before B61 tactical nuke airburst detonates over Gunnison.');
    }
    const yieldKt = Math.max(0, Number(yieldKilotonB61) || 0);
    const altitude = Math.max(0, Number(airburstAltitudeMeters) || 0);
    this.nukeAirburstWitnessed = yieldKt === 15 && altitude >= 500;
    this.eventLog.push({
      step: 'NUKE_AIRBURST_WITNESSED',
      yieldKilotonB61: yieldKt,
      airburstAltitudeMeters: altitude,
      nukeAirburstWitnessed: this.nukeAirburstWitnessed
    });
    return {
      nukeAirburstWitnessed: this.nukeAirburstWitnessed,
      yieldKilotonB61: yieldKt
    };
  }

  evacuateHospitalHelipadInShockwaveSlipstream({
    helipadLiftoffSpeedKmh = 140,
    shockwaveSurvived = true
  } = {}) {
    if (!this.nukeAirburstWitnessed) {
      throw new Error('Nuclear airburst detonation must trigger before helicopter outruns thermal shockwave.');
    }
    const speed = Math.max(0, Number(helipadLiftoffSpeedKmh) || 0);
    this.helipadEvacuationSuccessful = speed >= 100 && Boolean(shockwaveSurvived);
    if (this.helipadEvacuationSuccessful) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'HELIPAD_EVACUATION_SUCCESSFUL',
      helipadLiftoffSpeedKmh: speed,
      helipadEvacuationSuccessful: this.helipadEvacuationSuccessful,
      honorAwarded: this.honorAwarded
    });
    return {
      helipadEvacuationSuccessful: this.helipadEvacuationSuccessful,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      nationalGuardArmoryRaided: this.nationalGuardArmoryRaided,
      wolfDualWieldDuelResolved: this.wolfDualWieldDuelResolved,
      nukeAirburstWitnessed: this.nukeAirburstWitnessed,
      helipadEvacuationSuccessful: this.helipadEvacuationSuccessful,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
