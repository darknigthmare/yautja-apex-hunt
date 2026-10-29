/**
 * Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector (v223)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Keyes and OWLF unit spraying liquid nitrogen into the meat locker, creating sub-zero fog (-196°C).
 * 2. City Hunter hanging upside down on conveyor rails, switching mask to blue-light spectrum.
 * 3. Hurling smart-disc along the curved overhead rail to sever steam conduits and cables.
 * 4. Harrigan breaching meat locker and clashing point-blank with combistick against shotgun.
 */
export class Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SLAUGHTERHOUSE_NITROGEN_AND_SMART_DISC_RAIL_TOSS';
    this.filmReference = 'Predator 2 (1990) - Meat Locker Nitrogen Sprayers, Blue Light Spectrum Shift & Smart-Disc Rail Toss';
    this.reset();
  }

  reset() {
    this.subZeroFogEndured = false;
    this.blueLightSpectrumShifted = false;
    this.curvedRailDiscTossExecuted = false;
    this.harriganShotgunClashHonored = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  endureSubZeroNitrogenFog({
    nitrogenFogTempCelsius = -196,
    ambientVisibilityMeters = 2.5
  } = {}) {
    const temp = Number(nitrogenFogTempCelsius) || 0;
    const vis = Math.max(0, Number(ambientVisibilityMeters) || 0);
    this.subZeroFogEndured = temp <= -150 && vis <= 4.0;
    this.eventLog.push({
      step: 'SUB_ZERO_FOG_ENDURED',
      nitrogenFogTempCelsius: temp,
      ambientVisibilityMeters: vis,
      subZeroFogEndured: this.subZeroFogEndured
    });
    return {
      subZeroFogEndured: this.subZeroFogEndured
    };
  }

  shiftMaskToBlueLightSpectrum({
    spectrumWavelengthNm = 460,
    conveyorRailInversionConfirmed = true
  } = {}) {
    if (!this.subZeroFogEndured) {
      throw new Error('Must endure sub-zero fog before shifting mask to blue-light spectrum.');
    }
    const wave = Math.max(0, Number(spectrumWavelengthNm) || 0);
    this.blueLightSpectrumShifted = wave >= 440 && wave <= 490 && conveyorRailInversionConfirmed === true;
    this.eventLog.push({
      step: 'BLUE_LIGHT_SPECTRUM_SHIFTED',
      spectrumWavelengthNm: wave,
      conveyorRailInversionConfirmed,
      blueLightSpectrumShifted: this.blueLightSpectrumShifted
    });
    return {
      blueLightSpectrumShifted: this.blueLightSpectrumShifted
    };
  }

  executeCurvedRailSmartDiscToss({
    discFlightVelocityMs = 58,
    steamConduitsSeveredCount = 3
  } = {}) {
    if (!this.blueLightSpectrumShifted) {
      throw new Error('Must shift to blue-light spectrum before executing curved rail smart-disc toss.');
    }
    const vel = Math.max(0, Number(discFlightVelocityMs) || 0);
    const conduits = Math.max(0, Number(steamConduitsSeveredCount) || 0);
    this.curvedRailDiscTossExecuted = vel >= 45 && conduits >= 2;
    this.eventLog.push({
      step: 'CURVED_RAIL_DISC_TOSS_EXECUTED',
      discFlightVelocityMs: vel,
      steamConduitsSeveredCount: conduits,
      curvedRailDiscTossExecuted: this.curvedRailDiscTossExecuted
    });
    return {
      curvedRailDiscTossExecuted: this.curvedRailDiscTossExecuted
    };
  }

  honorHarriganPointBlankDuel({
    shotgunSlugBlastJoules = 5200,
    combistickParrySuccessScore = 0.98
  } = {}) {
    if (!this.curvedRailDiscTossExecuted) {
      throw new Error('Must execute disc toss before honoring Harrigan point-blank duel.');
    }
    const joules = Math.max(0, Number(shotgunSlugBlastJoules) || 0);
    const score = Number(combistickParrySuccessScore) || 0;
    this.harriganShotgunClashHonored = joules >= 4000 && score >= 0.95;
    if (this.harriganShotgunClashHonored) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'HARRIGAN_SHOTGUN_CLASH_HONORED',
      shotgunSlugBlastJoules: joules,
      combistickParrySuccessScore: score,
      harriganShotgunClashHonored: this.harriganShotgunClashHonored,
      honorAwarded: this.honorAwarded
    });
    return {
      harriganShotgunClashHonored: this.harriganShotgunClashHonored,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.subZeroFogEndured &&
      this.blueLightSpectrumShifted &&
      this.curvedRailDiscTossExecuted &&
      this.harriganShotgunClashHonored &&
      this.honorAwarded === 400
    );
  }
}
