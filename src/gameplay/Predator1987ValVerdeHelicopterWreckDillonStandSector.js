/**
 * Chantier 1 (v201) : Épave du Huey dans la Canopée de Val Verde & Dernier Carré de Mac et Dillon (Predator - 1987)
 * Complète en fidélité 1:1 les séquences manquantes du film original de 1987 : découverte de
 * l'hélicoptère Bell UH-1H Huey suspendu à 18 m dans la canopée (plaques de l'équipe de Jim Hopper),
 * reptation de Mac sous les racines (« Here kitty, kitty... ») face au tri-laser, et rafale
 * désespérée à deux MP5 de l'agent CIA George Dillon dont le bras sectionné continue de tirer au sol.
 */
export class Predator1987ValVerdeHelicopterWreckDillonStandSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_VAL_VERDE_HUEY_WRECK_DILLON_STAND';
    this.filmReference = 'Predator (1987) - Canopy Huey Wreckage & Mac/Dillon Final Pursuit';
    this.canopyHueyAltitudeMeters = 18;
    this.reset();
  }

  reset() {
    this.hueyWreckInspected = false;
    this.hopperDogTagsRecovered = false;
    this.macRootTunnelAmbushTriggered = false;
    this.dillonArmSeveredWhileFiring = false;
    this.severedArmContinueFiringMs = 0;
    this.dutchFlankSecured = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  inspectCanopyEntangledHueyWreck({
    canopyAltitudeMeters = 18,
    hopperDogTagsRecovered = true
  } = {}) {
    const alt = Math.max(0, Number(canopyAltitudeMeters) || 0);
    this.hopperDogTagsRecovered = Boolean(hopperDogTagsRecovered);
    this.hueyWreckInspected = alt >= 15 && this.hopperDogTagsRecovered;
    this.eventLog.push({
      step: 'CANOPY_HUEY_WRECK_INSPECTED',
      canopyAltitudeMeters: alt,
      hopperDogTagsRecovered: this.hopperDogTagsRecovered,
      hueyWreckInspected: this.hueyWreckInspected
    });
    return {
      hueyWreckInspected: this.hueyWreckInspected,
      hopperDogTagsRecovered: this.hopperDogTagsRecovered
    };
  }

  macCrawlUnderRootTunnelAmbush({
    whisperDecibels = 28,
    triLaserForeheadLockDetected = true
  } = {}) {
    if (!this.hueyWreckInspected) {
      throw new Error('Canopy Huey wreck must be inspected before Mac and Dillon pursue the Jungle Hunter.');
    }
    const db = Math.max(0, Number(whisperDecibels) || 0);
    this.macRootTunnelAmbushTriggered =
      db <= 35 && Boolean(triLaserForeheadLockDetected);
    this.eventLog.push({
      step: 'MAC_ROOT_TUNNEL_AMBUSH_TRIGGERED',
      whisperDecibels: db,
      triLaserForeheadLockDetected: Boolean(triLaserForeheadLockDetected),
      macRootTunnelAmbushTriggered: this.macRootTunnelAmbushTriggered
    });
    return {
      macRootTunnelAmbushTriggered: this.macRootTunnelAmbushTriggered,
      whisperDecibels: db
    };
  }

  dillonDualMp5SuppressionAndArmSeverance({
    firingRateRpm = 800,
    severedArmContinueFiringMs = 1800
  } = {}) {
    if (!this.macRootTunnelAmbushTriggered) {
      throw new Error('Mac root-tunnel ambush must occur before Dillon dual-MP5 stand.');
    }
    const rpm = Math.max(0, Number(firingRateRpm) || 0);
    this.severedArmContinueFiringMs = Math.max(0, Number(severedArmContinueFiringMs) || 0);
    this.dillonArmSeveredWhileFiring =
      rpm >= 700 && this.severedArmContinueFiringMs >= 1200;
    this.eventLog.push({
      step: 'DILLON_DUAL_MP5_ARM_SEVERANCE',
      firingRateRpm: rpm,
      severedArmContinueFiringMs: this.severedArmContinueFiringMs,
      dillonArmSeveredWhileFiring: this.dillonArmSeveredWhileFiring
    });
    return {
      dillonArmSeveredWhileFiring: this.dillonArmSeveredWhileFiring,
      severedArmContinueFiringMs: this.severedArmContinueFiringMs
    };
  }

  extractDillonCoordinatesBeforeJungleHunterStrike({
    dutchFlankSecured = true
  } = {}) {
    if (!this.dillonArmSeveredWhileFiring) {
      throw new Error('Dillon stand must be completed before securing Dutch flank.');
    }
    this.dutchFlankSecured = Boolean(dutchFlankSecured);
    if (this.dutchFlankSecured) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'DUTCH_FLANK_SECURED_AFTER_DILLON_STAND',
      dutchFlankSecured: this.dutchFlankSecured,
      honorAwarded: this.honorAwarded
    });
    return {
      dutchFlankSecured: this.dutchFlankSecured,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      hueyWreckInspected: this.hueyWreckInspected,
      macRootTunnelAmbushTriggered: this.macRootTunnelAmbushTriggered,
      dillonArmSeveredWhileFiring: this.dillonArmSeveredWhileFiring,
      dutchFlankSecured: this.dutchFlankSecured,
      honorAwarded: this.honorAwarded
    };
  }
}
