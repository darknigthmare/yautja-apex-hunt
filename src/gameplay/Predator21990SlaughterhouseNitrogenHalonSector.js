/**
 * Predator21990SlaughterhouseNitrogenHalonSector (v232)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Keyes' OWLF team deploying liquid nitrogen spray (-196°C) inside the meatpacker freezer to freeze the City Hunter.
 * 2. City Hunter cycling bio-mask vision from infrared to ultraviolet (UV) electromagnetic spectrum, exposing human heartbeats and flashlights.
 * 3. Targeting the overhead industrial sprinkler pipes with shoulder plasmacaster.
 * 4. Rupturing warm water main line to wash off nitrogen freeze and trigger massive steam blinding human scopes (+400 Honor).
 */
export class Predator21990SlaughterhouseNitrogenHalonSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SLAUGHTERHOUSE_NITROGEN_HALON';
    this.filmReference = 'Predator 2 (1990) - Meat Locker Liquid Nitrogen Ambush, UV Spectrum Switch & Halon Pipe Rupture';
    this.reset();
  }

  reset() {
    this.nitrogenSprayEndured = false;
    this.uvSpectrumModeActivated = false;
    this.sprinklerPipeTargeted = false;
    this.warmWaterCountermeasureExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  endureLiquidNitrogenAmbush({
    nitrogenCryoTempCelsius = -196.0,
    sprayNozzlePressurePsi = 240,
    cityHunterArmorFrostIndex = 0.88
  } = {}) {
    const temp = Number(nitrogenCryoTempCelsius) || 0;
    const psi = Math.max(0, Number(sprayNozzlePressurePsi) || 0);
    const frost = Number(cityHunterArmorFrostIndex) || 0;

    this.nitrogenSprayEndured = temp <= -150.0 && psi >= 180 && frost >= 0.75;
    this.eventLog.push({
      step: 'NITROGEN_SPRAY_ENDURED',
      nitrogenCryoTempCelsius: temp,
      sprayNozzlePressurePsi: psi,
      cityHunterArmorFrostIndex: frost,
      nitrogenSprayEndured: this.nitrogenSprayEndured
    });
    return {
      nitrogenSprayEndured: this.nitrogenSprayEndured
    };
  }

  activateUvSpectrumMode({
    uvWavelengthNanometers = 365,
    owlfBiometricPulseIdentified = true,
    bioMaskLensHue = 'EMERALD_ULTRAVIOLET'
  } = {}) {
    if (!this.nitrogenSprayEndured) {
      throw new Error('Must endure nitrogen ambush before switching vision mode.');
    }
    const wave = Math.max(0, Number(uvWavelengthNanometers) || 0);

    this.uvSpectrumModeActivated = wave >= 300 && wave <= 400 && owlfBiometricPulseIdentified === true && bioMaskLensHue === 'EMERALD_ULTRAVIOLET';
    this.eventLog.push({
      step: 'UV_SPECTRUM_MODE_ACTIVATED',
      uvWavelengthNanometers: wave,
      owlfBiometricPulseIdentified,
      bioMaskLensHue,
      uvSpectrumModeActivated: this.uvSpectrumModeActivated
    });
    return {
      uvSpectrumModeActivated: this.uvSpectrumModeActivated
    };
  }

  targetIndustrialSprinklerPipe({
    ceilingPipeHeightMeters = 5.2,
    plasmacasterLockTimeMs = 180,
    waterMainValveAcquired = true
  } = {}) {
    if (!this.uvSpectrumModeActivated) {
      throw new Error('Must activate UV spectrum before targeting ceiling pipes.');
    }
    const height = Math.max(0, Number(ceilingPipeHeightMeters) || 0);
    const lock = Math.max(0, Number(plasmacasterLockTimeMs) || 0);

    this.sprinklerPipeTargeted = height >= 4.0 && lock <= 300 && waterMainValveAcquired === true;
    this.eventLog.push({
      step: 'SPRINKLER_PIPE_TARGETED',
      ceilingPipeHeightMeters: height,
      plasmacasterLockTimeMs: lock,
      waterMainValveAcquired,
      sprinklerPipeTargeted: this.sprinklerPipeTargeted
    });
    return {
      sprinklerPipeTargeted: this.sprinklerPipeTargeted
    };
  }

  executeWarmWaterCountermeasure({
    burstFlowRateLpm = 1200,
    ambientSteamVolumeCubicMeters = 850,
    humanScopeBlindingFactor = 0.96
  } = {}) {
    if (!this.sprinklerPipeTargeted) {
      throw new Error('Must target sprinkler pipes before executing countermeasure.');
    }
    const flow = Math.max(0, Number(burstFlowRateLpm) || 0);
    const steam = Math.max(0, Number(ambientSteamVolumeCubicMeters) || 0);
    const blind = Number(humanScopeBlindingFactor) || 0;

    this.warmWaterCountermeasureExecuted = flow >= 1000 && steam >= 500 && blind >= 0.90;
    if (this.warmWaterCountermeasureExecuted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'WARM_WATER_COUNTERMEASURE_EXECUTED',
      burstFlowRateLpm: flow,
      ambientSteamVolumeCubicMeters: steam,
      humanScopeBlindingFactor: blind,
      warmWaterCountermeasureExecuted: this.warmWaterCountermeasureExecuted,
      honorAwarded: this.honorAwarded
    });
    return {
      warmWaterCountermeasureExecuted: this.warmWaterCountermeasureExecuted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.nitrogenSprayEndured &&
      this.uvSpectrumModeActivated &&
      this.sprinklerPipeTargeted &&
      this.warmWaterCountermeasureExecuted &&
      this.honorAwarded === 400
    );
  }
}
