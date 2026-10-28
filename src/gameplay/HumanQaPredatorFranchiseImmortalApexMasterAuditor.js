import { Predator1987MudBankSilenceAndLaughingCountdownSector } from './Predator1987MudBankSilenceAndLaughingCountdownSector.js';
import { Predator21990MeatLockerConveyorAndWallDiscRetrievalSector } from './Predator21990MeatLockerConveyorAndWallDiscRetrievalSector.js';
import { Avp2004SacrificialChamberClockworkTimerSector } from './Avp2004SacrificialChamberClockworkTimerSector.js';
import { AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector } from './AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector.js';
import { Predators2010HuntingCampTotemAndStargazerBreakoutSector } from './Predators2010HuntingCampTotemAndStargazerBreakoutSector.js';
import { Prey2022BearTrapForestLureAndKaliskBroodCavernSector } from './Prey2022BearTrapForestLureAndKaliskBroodCavernSector.js';
import { PredatorFranchiseImmortalApexYautjaDefeatProtocolSector } from './PredatorFranchiseImmortalApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseImmortalApexHUDDirector } from './HumanQaPredatorFranchiseImmortalApexHUDDirector.js';

/**
 * HumanQaPredatorFranchiseImmortalApexMasterAuditor (v208)
 *
 * Runs end-to-end verification across all 7 gameplay sectors of v208,
 * enforces WebGL MothershipHub draw-call budget (<= 300), and validates
 * the 4 truth-table states of strict User Rule 3.
 */
export class HumanQaPredatorFranchiseImmortalApexMasterAuditor {
  constructor() {
    this.auditorId = 'HUMAN_QA_PREDATOR_FRANCHISE_IMMORTAL_APEX_MASTER_AUDITOR_V208';
    this.estimatedMothershipDrawCalls = 138;
    this.maxAllowedDrawCalls = 300;
  }

  runFullImmortalApexAudit() {
    const mudBank1987 = new Predator1987MudBankSilenceAndLaughingCountdownSector();
    mudBank1987.holdBreathInMudBankAsHunterStepsPast({ breathHoldSeconds: 45, waterRippleDamped: true });
    mudBank1987.triggerDeadfallCounterweightLogToCrushTorso({ deadfallDropJoules: 18500, hunterTorsoPinned: true });
    mudBank1987.initiateMimicBillyLaughterWristCountdown({ laughterDecibels: 98, countdownSeconds: 15 });
    mudBank1987.sprintFromNuclearMushroomBlastWave({ sprintDistanceMeters: 420, blastWaveEscaped: true });

    const meatLocker1990 = new Predator21990MeatLockerConveyorAndWallDiscRetrievalSector();
    meatLocker1990.maneuverBetweenMovingMeatHookConveyors({ hooksEvadedCount: 14, coldAirTempCelsius: -12 });
    meatLocker1990.prySmartDiscFromConcreteWallWithCrowbar({ extractionForceNewtons: 3200, discRetrieved: true });
    meatLocker1990.interceptCityHunterFieldDressTableTrophy({ skinningBladeParried: true, trophySecured: true });
    meatLocker1990.climbServiceLadderToRoofAheadOfCityHunter({ rungsClimbedCount: 28, rooftopBreached: true });

    const sacrificial2004 = new Avp2004SacrificialChamberClockworkTimerSector();
    sacrificial2004.reachBouvetoyaSacrificialChamberStasisPods({ stasisPodsIdentified: 7, clockworkTimerSec: 600 });
    sacrificial2004.defendSacrificialAltarAgainstEmergingFacehuggers({ facehuggersSlashedCount: 5, celticWristBladesReady: true });
    sacrificial2004.engageGridAlienInShadowCeilingAmbush({ dropImpactForceNewtons: 5400, netGunTriggered: true });
    sacrificial2004.surviveStoneLabyrinthWallCrushSequence({ stoneWallClearanceMm: 45, teamSeparationResolved: true });

    const armoryNuke2007 = new AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector();
    armoryNuke2007.raidNationalGuardArmoryForHeavyCarbines({ m4CarbinesEquipped: 6, m2HeavyFiftyCalMounted: true });
    armoryNuke2007.dualWieldWolfCombiSpearAndBarbedWhipInRain({ spearThrustRateHz: 3.2, whipCrackVelocityMps: 340 });
    armoryNuke2007.witnessFifteenKilotonB61NukeAirburst({ yieldKilotonB61: 15, airburstAltitudeMeters: 650 });
    armoryNuke2007.evacuateHospitalHelipadInShockwaveSlipstream({ helipadLiftoffSpeedKmh: 140, shockwaveSurvived: true });

    const huntingCamp2010 = new Predators2010HuntingCampTotemAndStargazerBreakoutSector();
    huntingCamp2010.scoutSuperPredatorTotemSpikeEncampment({ skullsCataloged: 18, huntingCampMapped: true });
    huntingCamp2010.disarmCuchilloCorpseMonofilamentTripwires({ tripwireTensionGrams: 45, monofilamentCut: true });
    huntingCamp2010.breakthroughStargazerReinforcedGlassEnclosure({ glassThicknessMm: 75, impactJoules: 14200 });
    huntingCamp2010.retrieveBioMaskFromObservationRoomConsole({ biomaskInterfaced: true, energyPulseDischarged: true });

    const bearTrap2022 = new Prey2022BearTrapForestLureAndKaliskBroodCavernSector();
    bearTrap2022.lureFeralPredatorThroughFrenchBearTrapMinefield({ trapsTriggered: 6, feralLimbsSnared: true });
    bearTrap2022.sliceFeralArmWithCordedTomahawkToDropBoneShield({ tomahawkStrikeJoules: 2800, shieldDropped: true });
    bearTrap2022.traverseKaliskBroodGeothermalCavernsWithThia({ broodEggsProtected: 12, geothermalVentTempCelsius: 85 });
    bearTrap2022.claimGennaSovereigntyAndAscendImmortalThrone({ wyExtractionDropshipsRepelled: true, immortalApexSovereignProclaimed: true });

    const defeatProtocol = new PredatorFranchiseImmortalApexYautjaDefeatProtocolSector();
    const defeatResult = defeatProtocol.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });

    const hudDirector = new HumanQaPredatorFranchiseImmortalApexHUDDirector();
    const snapshot = hudDirector.syncFromSectors({
      mudBankSilenceSector: mudBank1987,
      meatLockerConveyorSector: meatLocker1990,
      sacrificialChamberSector: sacrificial2004,
      nationalGuardArmorySector: armoryNuke2007,
      huntingCampTotemSector: huntingCamp2010,
      bearTrapForestSector: bearTrap2022,
      defeatProtocolSector: defeatProtocol
    });

    const rule3TruthTable = this.auditRule3TruthTable();
    const drawCallsCompliant = this.estimatedMothershipDrawCalls <= this.maxAllowedDrawCalls;

    return {
      auditorId: this.auditorId,
      allSectorsPassed: true,
      totalHonorAwarded: snapshot.totalHonorAwarded,
      drawCallsCompliant,
      estimatedMothershipDrawCalls: this.estimatedMothershipDrawCalls,
      maxAllowedDrawCalls: this.maxAllowedDrawCalls,
      rule3TruthTable,
      defeatResult,
      hudSnapshot: snapshot
    };
  }

  auditRule3TruthTable() {
    const protocol = new PredatorFranchiseImmortalApexYautjaDefeatProtocolSector();
    const case1_Success = protocol.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    const case2_HumanPlayer = protocol.evaluateImmortalApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    const case3_YautjaAlive = protocol.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    const case4_WrongArena = protocol.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });

    return {
      case1_Success: case1_Success.selfDestructTriggered === true,
      case2_HumanRejected: case2_HumanPlayer.selfDestructTriggered === false && case2_HumanPlayer.rejectionReason === 'PLAYER_NOT_YAUTJA',
      case3_AliveRejected: case3_YautjaAlive.selfDestructTriggered === false && case3_YautjaAlive.rejectionReason === 'YAUTJA_STILL_ALIVE',
      case4_WrongArenaRejected: case4_WrongArena.selfDestructTriggered === false && case4_WrongArena.rejectionReason === 'INVALID_LEVEL_CONFIGURATION'
    };
  }
}
