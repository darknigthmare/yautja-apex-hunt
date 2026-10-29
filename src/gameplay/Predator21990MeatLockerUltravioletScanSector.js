/**
 * Predator21990MeatLockerUltravioletScanSector (v230)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. City Hunter infiltrating the sub-zero slaughterhouse refrigeration locker (temperature -12°C).
 * 2. Peter Keyes' OWLF tactical team deploying pressurized liquid nitrogen spray suits to suppress thermal signatures.
 * 3. City Hunter detecting the absence of infrared emissions and switching the bio-mask HUD to the Ultraviolet / Electromagnetic spectrum.
 * 4. Tracking the OWLF team's ultraviolet searchlights and heart monitor telemetry, then ambushing from overhead meat rails (+400 Honor).
 */
export class Predator21990MeatLockerUltravioletScanSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_MEAT_LOCKER_ULTRAVIOLET_SCAN';
    this.filmReference = 'Predator 2 (1990) - Slaughterhouse Cold Locker, Liquid Nitrogen Masking & Ultraviolet HUD Spectrum Switch';
    this.reset();
  }

  reset() {
    this.subZeroMeatLockerInfiltrated = false;
    this.nitrogenThermalMaskingDetected = false;
    this.ultravioletSpectrumSwitched = false;
    this.overheadMeatRailAmbushExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  infiltrateSubZeroMeatLocker({
    ambientTemperatureCelsius = -12,
    hangingCarcassCount = 140
  } = {}) {
    const temp = Number(ambientTemperatureCelsius) || 0;
    const count = Math.max(0, Number(hangingCarcassCount) || 0);
    this.subZeroMeatLockerInfiltrated = temp <= -8 && count >= 100;
    this.eventLog.push({
      step: 'SUB_ZERO_MEAT_LOCKER_INFILTRATED',
      ambientTemperatureCelsius: temp,
      hangingCarcassCount: count,
      subZeroMeatLockerInfiltrated: this.subZeroMeatLockerInfiltrated
    });
    return {
      subZeroMeatLockerInfiltrated: this.subZeroMeatLockerInfiltrated
    };
  }

  detectNitrogenThermalMasking({
    infraredThermalSuppressionScore = 0.98,
    nitrogenVaporDensityLpm = 450
  } = {}) {
    if (!this.subZeroMeatLockerInfiltrated) {
      throw new Error('Must infiltrate meat locker before detecting nitrogen thermal suppression.');
    }
    const score = Number(infraredThermalSuppressionScore) || 0;
    const flow = Math.max(0, Number(nitrogenVaporDensityLpm) || 0);
    this.nitrogenThermalMaskingDetected = score >= 0.95 && flow >= 350;
    this.eventLog.push({
      step: 'NITROGEN_THERMAL_MASKING_DETECTED',
      infraredThermalSuppressionScore: score,
      nitrogenVaporDensityLpm: flow,
      nitrogenThermalMaskingDetected: this.nitrogenThermalMaskingDetected
    });
    return {
      nitrogenThermalMaskingDetected: this.nitrogenThermalMaskingDetected
    };
  }

  switchBioMaskToUltravioletSpectrum({
    ultravioletWavelengthNm = 365,
    electromagneticBeaconIdentified = true
  } = {}) {
    if (!this.nitrogenThermalMaskingDetected) {
      throw new Error('Must detect thermal masking before switching to ultraviolet spectrum.');
    }
    const wave = Math.max(0, Number(ultravioletWavelengthNm) || 0);
    this.ultravioletSpectrumSwitched = wave >= 320 && wave <= 400 && electromagneticBeaconIdentified === true;
    this.eventLog.push({
      step: 'ULTRAVIOLET_SPECTRUM_SWITCHED',
      ultravioletWavelengthNm: wave,
      electromagneticBeaconIdentified,
      ultravioletSpectrumSwitched: this.ultravioletSpectrumSwitched
    });
    return {
      ultravioletSpectrumSwitched: this.ultravioletSpectrumSwitched
    };
  }

  executeOverheadMeatRailAmbush({
    overheadDropElevationMeters = 5.8,
    wristBladeCleaveForceNewtons = 6400
  } = {}) {
    if (!this.ultravioletSpectrumSwitched) {
      throw new Error('Must switch to ultraviolet spectrum before overhead rail ambush.');
    }
    const elev = Math.max(0, Number(overheadDropElevationMeters) || 0);
    const force = Math.max(0, Number(wristBladeCleaveForceNewtons) || 0);
    this.overheadMeatRailAmbushExecuted = elev >= 4.5 && force >= 5000;
    if (this.overheadMeatRailAmbushExecuted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'OVERHEAD_MEAT_RAIL_AMBUSH_EXECUTED',
      overheadDropElevationMeters: elev,
      wristBladeCleaveForceNewtons: force,
      overheadMeatRailAmbushExecuted: this.overheadMeatRailAmbushExecuted,
      honorAwarded: this.honorAwarded
    });
    return {
      overheadMeatRailAmbushExecuted: this.overheadMeatRailAmbushExecuted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.subZeroMeatLockerInfiltrated &&
      this.nitrogenThermalMaskingDetected &&
      this.ultravioletSpectrumSwitched &&
      this.overheadMeatRailAmbushExecuted &&
      this.honorAwarded === 400
    );
  }
}
