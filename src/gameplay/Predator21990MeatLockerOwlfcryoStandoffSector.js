/**
 * Predator21990MeatLockerOwlfcryoStandoffSector (v236)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Sub-zero refrigerated meatpacking plant (-15°C) hanging beef carcass rows.
 * 2. Peter Keyes' OWLF black-ops task force deploying thermal insulating suits and UV floodlights.
 * 3. City Hunter suspended inverted from overhead conveyor hooks, scanning UV phosphorescence.
 * 4. Firing plasmacaster volleys through hanging beef carcasses, destroying nitrogen emitters (+400 Honor).
 */
export class Predator21990MeatLockerOwlfcryoStandoffSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_MEAT_LOCKER_OWLF_CRYO_STANDOFF';
    this.filmReference = 'Predator 2 (1990) - Refrigerated Meat Locker, OWLF Insulated Suits, UV Beams & Rail Ambush';
    this.reset();
  }

  reset() {
    this.meatLockerConveyorInfiltrated = false;
    this.owlfThermalSuitsDetected = false;
    this.uvBeamPhosphorescenceScanned = false;
    this.carcassRailAmbushResolved = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  infiltrateMeatLockerConveyor({
    ambientFreezerTempCelsius = -16.5,
    hangingBeefCarcassCount = 48,
    overheadConveyorElevationM = 6.8
  } = {}) {
    const temp = Number(ambientFreezerTempCelsius) || 0;
    const beef = Math.max(0, Number(hangingBeefCarcassCount) || 0);
    const elev = Math.max(0, Number(overheadConveyorElevationM) || 0);

    this.meatLockerConveyorInfiltrated = temp <= -10.0 && beef >= 30 && elev >= 5.0;
    this.eventLog.push({
      step: 'MEAT_LOCKER_CONVEYOR_INFILTRATED',
      ambientFreezerTempCelsius: temp,
      hangingBeefCarcassCount: beef,
      overheadConveyorElevationM: elev,
      meatLockerConveyorInfiltrated: this.meatLockerConveyorInfiltrated
    });
    return {
      meatLockerConveyorInfiltrated: this.meatLockerConveyorInfiltrated
    };
  }

  detectOwlfThermalSuits({
    owlfOperativeCount = 6,
    cryoInsulationLeakageCelsius = 1.4,
    liquidNitrogenCylinderPressurePsi = 3200
  } = {}) {
    if (!this.meatLockerConveyorInfiltrated) {
      throw new Error('Must infiltrate meat locker before detecting OWLF operatives.');
    }
    const count = Math.max(0, Number(owlfOperativeCount) || 0);
    const leak = Number(cryoInsulationLeakageCelsius) || 0;
    const psi = Math.max(0, Number(liquidNitrogenCylinderPressurePsi) || 0);

    this.owlfThermalSuitsDetected = count >= 4 && leak <= 3.0 && psi >= 2500;
    this.eventLog.push({
      step: 'OWLF_THERMAL_SUITS_DETECTED',
      owlfOperativeCount: count,
      cryoInsulationLeakageCelsius: leak,
      liquidNitrogenCylinderPressurePsi: psi,
      owlfThermalSuitsDetected: this.owlfThermalSuitsDetected
    });
    return {
      owlfThermalSuitsDetected: this.owlfThermalSuitsDetected
    };
  }

  scanUvBeamPhosphorescence({
    uvWavelengthNanometers = 375,
    bioMaskLensFilterMode = 'ULTRAVIOLET_DUAL_SPECTRUM',
    phosphorescentFlashlightTrackingConfirmed = true
  } = {}) {
    if (!this.owlfThermalSuitsDetected) {
      throw new Error('Must detect thermal suits before scanning UV phosphorescence.');
    }
    const wave = Math.max(0, Number(uvWavelengthNanometers) || 0);

    this.uvBeamPhosphorescenceScanned = wave >= 320 && wave <= 400 && bioMaskLensFilterMode === 'ULTRAVIOLET_DUAL_SPECTRUM' && phosphorescentFlashlightTrackingConfirmed === true;
    this.eventLog.push({
      step: 'UV_BEAM_PHOSPHORESCENCE_SCANNED',
      uvWavelengthNanometers: wave,
      bioMaskLensFilterMode,
      phosphorescentFlashlightTrackingConfirmed,
      uvBeamPhosphorescenceScanned: this.uvBeamPhosphorescenceScanned
    });
    return {
      uvBeamPhosphorescenceScanned: this.uvBeamPhosphorescenceScanned
    };
  }

  resolveCarcassRailAmbush({
    plasmacasterBlastJoules = 16500,
    nitrogenEmittersNeutralized = true,
    keyesTaskForceDefeated = true
  } = {}) {
    if (!this.uvBeamPhosphorescenceScanned) {
      throw new Error('Must scan UV phosphorescence before resolving rail ambush.');
    }
    const j = Math.max(0, Number(plasmacasterBlastJoules) || 0);

    this.carcassRailAmbushResolved = j >= 12000 && nitrogenEmittersNeutralized === true && keyesTaskForceDefeated === true;
    if (this.carcassRailAmbushResolved) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CARCASS_RAIL_AMBUSH_RESOLVED',
      plasmacasterBlastJoules: j,
      nitrogenEmittersNeutralized,
      keyesTaskForceDefeated,
      carcassRailAmbushResolved: this.carcassRailAmbushResolved,
      honorAwarded: this.honorAwarded
    });
    return {
      carcassRailAmbushResolved: this.carcassRailAmbushResolved,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.meatLockerConveyorInfiltrated &&
      this.owlfThermalSuitsDetected &&
      this.uvBeamPhosphorescenceScanned &&
      this.carcassRailAmbushResolved &&
      this.honorAwarded === 400
    );
  }
}
