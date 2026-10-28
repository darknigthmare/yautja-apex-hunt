/**
 * Predator1987PinePitchTorchAndPrimalValleyRoarSector (v215)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. Crafting a flaming pitch torch from thick jungle pine sap and cloth wraps.
 * 2. Uttering Dutch's thunderous primal battle roar echoing across the river valley.
 * 3. Hurling the blazing torch directly at the Jungle Hunter's mask to temporarily blind his thermal vision spectrum.
 * 4. Triggering the counterweight log ramp crush to pin the Jungle Hunter against the earthen bank.
 */
export class Predator1987PinePitchTorchAndPrimalValleyRoarSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_PINE_PITCH_TORCH_AND_PRIMAL_VALLEY_ROAR';
    this.filmReference = 'Predator (1987) - Pine Pitch Torch Crafting, Primal Valley Roar, Thermal Visor Blind & Counterweight Ramp Crush';
    this.reset();
  }

  reset() {
    this.pinePitchTorchCrafted = false;
    this.primalValleyRoarEchoed = false;
    this.thermalSensorsBlindedWithTorch = false;
    this.counterweightLogRampCrushTriggered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  craftPinePitchTorchWithJungleSap({
    sapViscosityCpoise = 850,
    torchBurnMinutes = 25
  } = {}) {
    const visc = Math.max(0, Number(sapViscosityCpoise) || 0);
    const burn = Math.max(0, Number(torchBurnMinutes) || 0);
    this.pinePitchTorchCrafted = visc >= 500 && burn >= 15;
    this.eventLog.push({
      step: 'PINE_PITCH_TORCH_CRAFTED',
      sapViscosityCpoise: visc,
      torchBurnMinutes: burn,
      pinePitchTorchCrafted: this.pinePitchTorchCrafted
    });
    return {
      pinePitchTorchCrafted: this.pinePitchTorchCrafted,
      torchBurnMinutes: burn
    };
  }

  unleashPrimalValleyChallengeRoar({
    roarDecibels = 114,
    echoDurationSeconds = 4.2
  } = {}) {
    if (!this.pinePitchTorchCrafted) {
      throw new Error('Must craft flaming pine pitch torch before issuing primal valley roar.');
    }
    const db = Math.max(0, Number(roarDecibels) || 0);
    const echo = Math.max(0, Number(echoDurationSeconds) || 0);
    this.primalValleyRoarEchoed = db >= 95 && echo >= 2.5;
    this.eventLog.push({
      step: 'PRIMAL_VALLEY_ROAR_ECHOED',
      roarDecibels: db,
      echoDurationSeconds: echo,
      primalValleyRoarEchoed: this.primalValleyRoarEchoed
    });
    return {
      primalValleyRoarEchoed: this.primalValleyRoarEchoed,
      roarDecibels: db
    };
  }

  hurlBlazingTorchToOverwhelmThermalSensors({
    throwVelocityMps = 22,
    thermalFilterBlinded = true
  } = {}) {
    if (!this.primalValleyRoarEchoed) {
      throw new Error('Must challenge the Jungle Hunter with primal roar before throwing torch.');
    }
    const vel = Math.max(0, Number(throwVelocityMps) || 0);
    this.thermalSensorsBlindedWithTorch = vel >= 15 && Boolean(thermalFilterBlinded);
    this.eventLog.push({
      step: 'THERMAL_SENSORS_BLINDED_WITH_TORCH',
      throwVelocityMps: vel,
      thermalFilterBlinded: Boolean(thermalFilterBlinded),
      thermalSensorsBlindedWithTorch: this.thermalSensorsBlindedWithTorch
    });
    return {
      thermalSensorsBlindedWithTorch: this.thermalSensorsBlindedWithTorch,
      throwVelocityMps: vel
    };
  }

  triggerCounterweightLogRampCrush({
    logRampMassKg = 750,
    rampDropJoules = 18200
  } = {}) {
    if (!this.thermalSensorsBlindedWithTorch) {
      throw new Error('Jungle Hunter must be blinded by flaming torch before dropping counterweight ramp.');
    }
    const mass = Math.max(0, Number(logRampMassKg) || 0);
    const joules = Math.max(0, Number(rampDropJoules) || 0);
    this.counterweightLogRampCrushTriggered = mass >= 500 && joules >= 12000;
    if (this.counterweightLogRampCrushTriggered) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'COUNTERWEIGHT_LOG_RAMP_CRUSH_TRIGGERED',
      logRampMassKg: mass,
      rampDropJoules: joules,
      counterweightLogRampCrushTriggered: this.counterweightLogRampCrushTriggered,
      honorAwarded: this.honorAwarded
    });
    return {
      counterweightLogRampCrushTriggered: this.counterweightLogRampCrushTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      pinePitchTorchCrafted: this.pinePitchTorchCrafted,
      primalValleyRoarEchoed: this.primalValleyRoarEchoed,
      thermalSensorsBlindedWithTorch: this.thermalSensorsBlindedWithTorch,
      counterweightLogRampCrushTriggered: this.counterweightLogRampCrushTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
