/**
 * Predator21990KingWillieAlleywayAndMeatLockerNitrogenSector (v204)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. Mike Harrigan consulting King Willie in the foggy Los Angeles alleyway,
 *    King Willie's voodoo prophecy ("There's no stopping what can't be stopped, no killing what can't be killed").
 * 2. King Willie drawing his silver sword-cane in the mist for a 1v1 duel against the City Hunter,
 *    followed by the City Hunter polishing King Willie's skull in the trophy lair.
 * 3. Peter Keyes and the OWLF task force ambushing the City Hunter inside the meat-packing slaughterhouse
 *    with liquid nitrogen cannons (-196°C) and ultraviolet beam tracking.
 * 4. City Hunter shifting to ultraviolet vision, throwing the Smart Disc to bisect Keyes,
 *    and engaging Harrigan in a point-blank Ithaca 37 shotgun duel.
 */
export class Predator21990KingWillieAlleywayAndMeatLockerNitrogenSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_KING_WILLIE_ALLEYWAY_AND_MEAT_LOCKER_NITROGEN';
    this.filmReference = 'Predator 2 (1990) - King Willie Sword-Cane Duel & Slaughterhouse Liquid Nitrogen Ambush';
    this.reset();
  }

  reset() {
    this.kingWillieOracleConsulted = false;
    this.kingWillieDuelAndSkullPolished = false;
    this.slaughterhouseNitrogenAmbushTriggered = false;
    this.keyesBisectedAndShotgunDuelResolved = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  consultKingWillieVoodooOracleInMist({
    swordCaneDrawn = true,
    propheticWarningDelivered = true
  } = {}) {
    this.kingWillieOracleConsulted = Boolean(swordCaneDrawn) && Boolean(propheticWarningDelivered);
    this.eventLog.push({
      step: 'KING_WILLIE_ORACLE_CONSULTED_IN_MIST',
      kingWillieOracleConsulted: this.kingWillieOracleConsulted
    });
    return {
      kingWillieOracleConsulted: this.kingWillieOracleConsulted
    };
  }

  executeKingWillieDecapitationAndSkullPolish({
    decapitationForceNewtons = 4800,
    spineExtractedCleanly = true
  } = {}) {
    if (!this.kingWillieOracleConsulted) {
      throw new Error('Harrigan must consult King Willie before the City Hunter initiates alleyway ambush.');
    }
    const force = Math.max(0, Number(decapitationForceNewtons) || 0);
    this.kingWillieDuelAndSkullPolished = force >= 3500 && Boolean(spineExtractedCleanly);
    this.eventLog.push({
      step: 'KING_WILLIE_DECAPITATION_AND_SKULL_POLISH',
      decapitationForceNewtons: force,
      kingWillieDuelAndSkullPolished: this.kingWillieDuelAndSkullPolished
    });
    return {
      kingWillieDuelAndSkullPolished: this.kingWillieDuelAndSkullPolished,
      decapitationForceNewtons: force
    };
  }

  spraySlaughterhouseLiquidNitrogenOnCityHunter({
    nitrogenTempCelsius = -196,
    uvBeamGridLocked = true
  } = {}) {
    if (!this.kingWillieDuelAndSkullPolished) {
      throw new Error('King Willie skull sequence must precede the slaughterhouse OWLF operation.');
    }
    const temp = Math.min(0, Number(nitrogenTempCelsius) || 0);
    this.slaughterhouseNitrogenAmbushTriggered = temp <= -180 && Boolean(uvBeamGridLocked);
    this.eventLog.push({
      step: 'SLAUGHTERHOUSE_LIQUID_NITROGEN_AMBUSH',
      nitrogenTempCelsius: temp,
      slaughterhouseNitrogenAmbushTriggered: this.slaughterhouseNitrogenAmbushTriggered
    });
    return {
      slaughterhouseNitrogenAmbushTriggered: this.slaughterhouseNitrogenAmbushTriggered,
      nitrogenTempCelsius: temp
    };
  }

  sliceKeyesWithSmartDiscAndExecuteShotgunDuel({
    smartDiscCutVelocityKmh = 95,
    harriganSlugLanded = true
  } = {}) {
    if (!this.slaughterhouseNitrogenAmbushTriggered) {
      throw new Error('Liquid nitrogen spray must be active before City Hunter reconfigures sensors to throw Smart Disc.');
    }
    const discSpeed = Math.max(0, Number(smartDiscCutVelocityKmh) || 0);
    this.keyesBisectedAndShotgunDuelResolved = discSpeed >= 70 && Boolean(harriganSlugLanded);
    if (this.keyesBisectedAndShotgunDuelResolved) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'KEYES_BISECTED_AND_SHOTGUN_DUEL_RESOLVED',
      smartDiscCutVelocityKmh: discSpeed,
      keyesBisectedAndShotgunDuelResolved: this.keyesBisectedAndShotgunDuelResolved,
      honorAwarded: this.honorAwarded
    });
    return {
      keyesBisectedAndShotgunDuelResolved: this.keyesBisectedAndShotgunDuelResolved,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      kingWillieOracleConsulted: this.kingWillieOracleConsulted,
      kingWillieDuelAndSkullPolished: this.kingWillieDuelAndSkullPolished,
      slaughterhouseNitrogenAmbushTriggered: this.slaughterhouseNitrogenAmbushTriggered,
      keyesBisectedAndShotgunDuelResolved: this.keyesBisectedAndShotgunDuelResolved,
      honorAwarded: this.honorAwarded
    };
  }
}
