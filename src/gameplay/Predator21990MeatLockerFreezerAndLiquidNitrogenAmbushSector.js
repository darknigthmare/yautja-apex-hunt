/**
 * Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector (v220)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Keyes' OWLF team deploying liquid nitrogen sprayers (-196°C) in meat locker to freeze thermal silhouette.
 * 2. City Hunter detecting ultraviolet flashlight beam scatter and switching mask vision to Ultraviolet (380 nm).
 * 3. City Hunter leaping across ceiling rails, dropping down through cold fog onto the OWLF unit.
 * 4. Smart-disc boomerang throw cleaving frozen beef carcasses and slicing Keyes' team weapons.
 */
export class Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_MEAT_LOCKER_FREEZER_AND_LIQUID_NITROGEN_AMBUSH';
    this.filmReference = 'Predator 2 (1990) - Meat Locker Liquid Nitrogen Ambush, UV Vision Shift & Smart-Disc Cleave';
    this.reset();
  }

  reset() {
    this.liquidNitrogenSprayersActivated = false;
    this.uvVisionShiftCompleted = false;
    this.meatHookCeilingLeapExecuted = false;
    this.smartDiscCarcassCleaveExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  activateLiquidNitrogenSprayers({
    sprayTempCelsius = -196,
    ambientFreezerTempCelsius = -25
  } = {}) {
    const sprayTemp = Number(sprayTempCelsius) || 0;
    const ambTemp = Number(ambientFreezerTempCelsius) || 0;
    this.liquidNitrogenSprayersActivated = sprayTemp <= -150 && ambTemp <= -10;
    this.eventLog.push({
      step: 'LIQUID_NITROGEN_SPRAYERS_ACTIVATED',
      sprayTempCelsius: sprayTemp,
      ambientFreezerTempCelsius: ambTemp,
      liquidNitrogenSprayersActivated: this.liquidNitrogenSprayersActivated
    });
    return {
      liquidNitrogenSprayersActivated: this.liquidNitrogenSprayersActivated
    };
  }

  shiftMaskVisionToUltraviolet({
    uvWavelengthNm = 380,
    dustParticleScatterDetected = true
  } = {}) {
    if (!this.liquidNitrogenSprayersActivated) {
      throw new Error('Must activate liquid nitrogen environment before shifting mask vision to UV.');
    }
    const wave = Math.max(0, Number(uvWavelengthNm) || 0);
    this.uvVisionShiftCompleted = wave >= 320 && wave <= 400 && dustParticleScatterDetected === true;
    this.eventLog.push({
      step: 'UV_VISION_SHIFT_COMPLETED',
      uvWavelengthNm: wave,
      dustParticleScatterDetected,
      uvVisionShiftCompleted: this.uvVisionShiftCompleted
    });
    return {
      uvVisionShiftCompleted: this.uvVisionShiftCompleted
    };
  }

  executeMeatHookCeilingLeap({
    railHeightMeters = 5.2,
    dropVelocityMs = 12.5
  } = {}) {
    if (!this.uvVisionShiftCompleted) {
      throw new Error('Must shift vision to UV before executing ceiling leap.');
    }
    const height = Math.max(0, Number(railHeightMeters) || 0);
    const vel = Math.max(0, Number(dropVelocityMs) || 0);
    this.meatHookCeilingLeapExecuted = height >= 4.0 && vel >= 8.0;
    this.eventLog.push({
      step: 'MEAT_HOOK_CEILING_LEAP_EXECUTED',
      railHeightMeters: height,
      dropVelocityMs: vel,
      meatHookCeilingLeapExecuted: this.meatHookCeilingLeapExecuted
    });
    return {
      meatHookCeilingLeapExecuted: this.meatHookCeilingLeapExecuted
    };
  }

  cleaveFrozenCarcassesWithSmartDisc({
    discThrowJoules = 4200,
    carcassesCleaved = 3
  } = {}) {
    if (!this.meatHookCeilingLeapExecuted) {
      throw new Error('Must drop down from ceiling before cleaving carcasses with smart-disc.');
    }
    const energy = Math.max(0, Number(discThrowJoules) || 0);
    const cleaved = Math.max(0, Number(carcassesCleaved) || 0);
    this.smartDiscCarcassCleaveExecuted = energy >= 3000 && cleaved >= 2;
    if (this.smartDiscCarcassCleaveExecuted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'SMART_DISC_CARCASS_CLEAVE_EXECUTED',
      discThrowJoules: energy,
      carcassesCleaved: cleaved,
      smartDiscCarcassCleaveExecuted: this.smartDiscCarcassCleaveExecuted,
      honorAwarded: this.honorAwarded
    });
    return {
      smartDiscCarcassCleaveExecuted: this.smartDiscCarcassCleaveExecuted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.liquidNitrogenSprayersActivated &&
      this.uvVisionShiftCompleted &&
      this.meatHookCeilingLeapExecuted &&
      this.smartDiscCarcassCleaveExecuted &&
      this.honorAwarded === 400
    );
  }
}
