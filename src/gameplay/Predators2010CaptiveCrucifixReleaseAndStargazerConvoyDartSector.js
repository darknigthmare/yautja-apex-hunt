/**
 * Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector (v209)
 *
 * Implements iconic 1:1 set-pieces from Predators (2010) and The Predator (2018):
 * 1. Royce severing the thick alien vines binding the captive Classic Predator to the totem crucifix tree with his kukri.
 * 2. Exchanging the ship launch override code and mutual warrior honor salute between human and captive Yautja.
 * 3. The Fugitive Predator ambushing Project Stargazer's armored convoy transport trucks in the Georgia pine forest.
 * 4. Firing guided explosive armor-piercing micro-dart rounds (410 m/s) from the wrist-launcher to detonate truck engine blocks.
 */
export class Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector {
  constructor() {
    this.sectorId = 'PREDATORS_2010_CAPTIVE_CRUCIFIX_RELEASE_AND_STARGAZER_CONVOY_DART';
    this.filmReference = 'Predators (2010) & The Predator (2018) - Crucifix Release, Honor Code Exchange & Stargazer Convoy Darts';
    this.reset();
  }

  reset() {
    this.captiveCrucifixBondsSevered = false;
    this.honorCodeExchanged = false;
    this.stargazerConvoyAmbushed = false;
    this.explosiveWristDartsDischarged = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  severClassicPredatorCrucifixBondsWithKukri({
    bondSeverJoules = 3400,
    captiveReleased = true
  } = {}) {
    const joules = Math.max(0, Number(bondSeverJoules) || 0);
    this.captiveCrucifixBondsSevered = joules >= 2500 && Boolean(captiveReleased);
    this.eventLog.push({
      step: 'CAPTIVE_CRUCIFIX_BONDS_SEVERED',
      bondSeverJoules: joules,
      captiveCrucifixBondsSevered: this.captiveCrucifixBondsSevered
    });
    return {
      captiveCrucifixBondsSevered: this.captiveCrucifixBondsSevered,
      bondSeverJoules: joules
    };
  }

  exchangeYautjaShipUnlockCodeForHonor({
    unlockCodesExchanged = true,
    respectSaluteExchanged = true
  } = {}) {
    if (!this.captiveCrucifixBondsSevered) {
      throw new Error('Captive Yautja must be freed from crucifix tree before exchanging honor code.');
    }
    this.honorCodeExchanged = Boolean(unlockCodesExchanged) && Boolean(respectSaluteExchanged);
    this.eventLog.push({
      step: 'HONOR_CODE_EXCHANGED',
      unlockCodesExchanged: Boolean(unlockCodesExchanged),
      respectSaluteExchanged: Boolean(respectSaluteExchanged),
      honorCodeExchanged: this.honorCodeExchanged
    });
    return {
      honorCodeExchanged: this.honorCodeExchanged
    };
  }

  ambushStargazerArmoredConvoyInPineForest({
    convoyTrucksAmbushedCount = 3,
    armorPierced = true
  } = {}) {
    if (!this.honorCodeExchanged) {
      throw new Error('Honor code exchange must resolve before engaging Stargazer armored convoy.');
    }
    const count = Math.max(0, Number(convoyTrucksAmbushedCount) || 0);
    this.stargazerConvoyAmbushed = count >= 2 && Boolean(armorPierced);
    this.eventLog.push({
      step: 'STARGAZER_CONVOY_AMBUSHED',
      convoyTrucksAmbushedCount: count,
      armorPierced: Boolean(armorPierced),
      stargazerConvoyAmbushed: this.stargazerConvoyAmbushed
    });
    return {
      stargazerConvoyAmbushed: this.stargazerConvoyAmbushed,
      convoyTrucksAmbushedCount: count
    };
  }

  dischargeExplosiveDartRoundsFromWristLauncher({
    dartVelocityMps = 410,
    targetEngineBlocksVaporized = true
  } = {}) {
    if (!this.stargazerConvoyAmbushed) {
      throw new Error('Convoy must be ambushed before discharging wrist-launcher explosive dart rounds.');
    }
    const velocity = Math.max(0, Number(dartVelocityMps) || 0);
    this.explosiveWristDartsDischarged = velocity >= 350 && Boolean(targetEngineBlocksVaporized);
    if (this.explosiveWristDartsDischarged) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'EXPLOSIVE_WRIST_DARTS_DISCHARGED',
      dartVelocityMps: velocity,
      targetEngineBlocksVaporized: Boolean(targetEngineBlocksVaporized),
      explosiveWristDartsDischarged: this.explosiveWristDartsDischarged,
      honorAwarded: this.honorAwarded
    });
    return {
      explosiveWristDartsDischarged: this.explosiveWristDartsDischarged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      captiveCrucifixBondsSevered: this.captiveCrucifixBondsSevered,
      honorCodeExchanged: this.honorCodeExchanged,
      stargazerConvoyAmbushed: this.stargazerConvoyAmbushed,
      explosiveWristDartsDischarged: this.explosiveWristDartsDischarged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
