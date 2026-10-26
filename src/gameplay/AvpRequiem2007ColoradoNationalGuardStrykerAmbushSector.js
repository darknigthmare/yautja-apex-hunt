/**
 * Chantier 4 (v201) : Embuscade du Convoi Stryker de la Garde Nationale à Gunnison & Mallette de Mme Yutani (AVPR - 2007)
 * Complète en fidélité 1:1 les séquences manquantes d'Aliens vs. Predator: Requiem (2007) :
 * massacre sous la pluie battante (65 mm/h) des blindés M1126 Stryker de la Garde Nationale du
 * Colorado, conversion par Wolf de son second canon d'épaule en pistolet plasma portatif, frappe
 * nucléaire tactique B61 (15 kt) du colonel Stevens et remise du pistolet plasma à Mme Yutani à Tokyo.
 */
export class AvpRequiem2007ColoradoNationalGuardStrykerAmbushSector {
  constructor() {
    this.sectorId = 'AVPR_2007_GUNNISON_STRYKER_CONVOY_AND_YUTANI_BRIEFCASE';
    this.filmReference = 'AVP: Requiem (2007) - National Guard Stryker Rain Ambush, B61 Nuke & Ms. Yutani Tokyo Epilogue';
    this.reset();
  }

  reset() {
    this.strykerConvoyAmbushed = false;
    this.strykerVehiclesDisabled = 0;
    this.plasmaPistolHandgunConverted = false;
    this.b61NuclearShockwaveEscaped = false;
    this.blastYieldKilotons = 0;
    this.msYutaniBriefcaseDelivered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  ambushNationalGuardStrykerConvoyInRain({
    strykerVehiclesDisabled = 3,
    rainfallMmPerHour = 65
  } = {}) {
    this.strykerVehiclesDisabled = Math.max(0, Math.floor(Number(strykerVehiclesDisabled) || 0));
    const rain = Math.max(0, Number(rainfallMmPerHour) || 0);
    this.strykerConvoyAmbushed = this.strykerVehiclesDisabled >= 3 && rain >= 50;
    this.eventLog.push({
      step: 'NATIONAL_GUARD_STRYKER_CONVOY_AMBUSHED',
      strykerVehiclesDisabled: this.strykerVehiclesDisabled,
      rainfallMmPerHour: rain,
      strykerConvoyAmbushed: this.strykerConvoyAmbushed
    });
    return {
      strykerConvoyAmbushed: this.strykerConvoyAmbushed,
      strykerVehiclesDisabled: this.strykerVehiclesDisabled
    };
  }

  wolfInterceptPlasmacasterInDowntownCrossfire({
    dualCasterOverloadDetected = true,
    salvagedPistolConverted = true
  } = {}) {
    if (!this.strykerConvoyAmbushed) {
      throw new Error('Stryker convoy ambush must occur before Wolf converts his damaged shoulder caster into a handheld plasma pistol.');
    }
    this.plasmaPistolHandgunConverted =
      Boolean(dualCasterOverloadDetected) && Boolean(salvagedPistolConverted);
    this.eventLog.push({
      step: 'WOLF_HANDHELD_PLASMA_PISTOL_CONVERTED',
      plasmaPistolHandgunConverted: this.plasmaPistolHandgunConverted
    });
    return {
      plasmaPistolHandgunConverted: this.plasmaPistolHandgunConverted
    };
  }

  escapeB61TacticalNuclearShockwaveInHuey({
    blastYieldKilotons = 15,
    shockwaveTurbulenceG = 4.8
  } = {}) {
    if (!this.plasmaPistolHandgunConverted) {
      throw new Error('Handheld plasma pistol conversion must occur before the B61 tactical nuclear strike on Gunnison.');
    }
    this.blastYieldKilotons = Math.max(0, Number(blastYieldKilotons) || 0);
    const gForce = Math.max(0, Number(shockwaveTurbulenceG) || 0);
    this.b61NuclearShockwaveEscaped = this.blastYieldKilotons >= 10 && gForce >= 3.5;
    this.eventLog.push({
      step: 'B61_TACTICAL_NUCLEAR_SHOCKWAVE_ESCAPED',
      blastYieldKilotons: this.blastYieldKilotons,
      shockwaveTurbulenceG: gForce,
      b61NuclearShockwaveEscaped: this.b61NuclearShockwaveEscaped
    });
    return {
      b61NuclearShockwaveEscaped: this.b61NuclearShockwaveEscaped,
      blastYieldKilotons: this.blastYieldKilotons
    };
  }

  deliverSalvagedPlasmacasterBriefcaseToMsYutani({
    tokyoCorporateVaultSealed = true,
    weylandYutaniMergerForeshadowed = true
  } = {}) {
    if (!this.b61NuclearShockwaveEscaped) {
      throw new Error('Must escape the Gunnison B61 nuclear strike before delivering the briefcase to Ms. Yutani.');
    }
    this.msYutaniBriefcaseDelivered =
      Boolean(tokyoCorporateVaultSealed) && Boolean(weylandYutaniMergerForeshadowed);
    if (this.msYutaniBriefcaseDelivered) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'PLASMACASTER_BRIEFCASE_DELIVERED_TO_MS_YUTANI',
      msYutaniBriefcaseDelivered: this.msYutaniBriefcaseDelivered,
      honorAwarded: this.honorAwarded
    });
    return {
      msYutaniBriefcaseDelivered: this.msYutaniBriefcaseDelivered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      strykerConvoyAmbushed: this.strykerConvoyAmbushed,
      plasmaPistolHandgunConverted: this.plasmaPistolHandgunConverted,
      b61NuclearShockwaveEscaped: this.b61NuclearShockwaveEscaped,
      msYutaniBriefcaseDelivered: this.msYutaniBriefcaseDelivered,
      honorAwarded: this.honorAwarded
    };
  }
}
