import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987LogBridgePunjiPitSprintSector } from '../src/gameplay/Predator1987LogBridgePunjiPitSprintSector.js';
import { Predator21990PenthouseLightningSwordSpineSector } from '../src/gameplay/Predator21990PenthouseLightningSwordSpineSector.js';
import { Avp2004WhalingStationCelticNetgunSector } from '../src/gameplay/Avp2004WhalingStationCelticNetgunSector.js';
import { AvpRequiem2007PowerPlantPlasmaBlackoutSector } from '../src/gameplay/AvpRequiem2007PowerPlantPlasmaBlackoutSector.js';
import { Predators2010HanzoDuelFugitiveGauntletSector } from '../src/gameplay/Predators2010HanzoDuelFugitiveGauntletSector.js';
import { Prey2022GrizzlyBearLiftBadlandsSanctumSector } from '../src/gameplay/Prey2022GrizzlyBearLiftBadlandsSanctumSector.js';
import {
  PredatorFranchiseAbsoluSupremeApexYautjaDefeatProtocolSector,
  PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM
} from '../src/gameplay/PredatorFranchiseAbsoluSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseAbsoluSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseAbsoluSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseAbsoluSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseAbsoluSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v233 - Predator Franchise Absolu Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): log bridge balance, thermal skin flaking, tri-laser plasmacaster lock & punji pit leap (+350 Honor)', () => {
    const sector = new Predator1987LogBridgePunjiPitSprintSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.exposeThermalSkinFlaking(), /Must establish log bridge position/);

    const logRes = sector.establishLogBridgePosition({
      logBridgeSpanMeters: 16.5,
      ravineChasmDepthMeters: 24.0,
      balanceStabilityScore: 0.96
    });
    assert.equal(logRes.logBridgePositionEstablished, true);

    const skinRes = sector.exposeThermalSkinFlaking({
      ambientJungleTempCelsius: 39.5,
      mudFlakeDehydrationPercent: 88,
      exposedTorsoInfraredTempCelsius: 36.8
    });
    assert.equal(skinRes.thermalSkinFlakingExposed, true);

    const lockRes = sector.lockTriLaserPlasmacaster({
      triLaserConvergenceMm: 12,
      plasmacasterCapacitorChargePercent: 95,
      acousticTriDotHumDb: 72
    });
    assert.equal(lockRes.triLaserPlasmacasterLocked, true);

    const leapRes = sector.executePunjiStakeLeap({
      sprintVelocityMps: 8.4,
      punjiPitClearanceMeters: 4.2,
      counterweightTriggerPulled: true
    });
    assert.equal(leapRes.punjiStakeLeapExecuted, true);
    assert.equal(leapRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): penthouse alley standoff, lightning cloak surge, cane sword parry & spinal trophy cleanse (+400 Honor)', () => {
    const sector = new Predator21990PenthouseLightningSwordSpineSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.ionizeLightningCamouflage(), /Must initiate standoff/);

    const standRes = sector.initiateRooftopAlleyStandoff({
      rainIntensityPph: 78,
      voodooSwordStanceAcquired: true,
      kingWillieDreadQuotient: 0.95
    });
    assert.equal(standRes.rooftopAlleyStandoffInitiated, true);

    const surgeRes = sector.ionizeLightningCamouflage({
      lightningDischargeJoules: 450000,
      opticalCamouflageSurgeFactor: 0.98,
      sparksSilhouetteRevealScore: 0.99
    });
    assert.equal(surgeRes.lightningCamouflageIonized, true);

    const parryRes = sector.parryCaneSwordStrike({
      caneSwordVelocityMps: 14.5,
      combistickDeflectionTorqueNm: 620,
      bladeLockAcousticDb: 94
    });
    assert.equal(parryRes.caneSwordStrikeParried, true);

    const cleanRes = sector.executeSpinalTrophyCleanse({
      spinalExtractionForceNewtons: 5600,
      dissolvingCleanerWashPpm: 9800,
      cranialBonePolishingScore: 0.99
    });
    assert.equal(cleanRes.spinalTrophyCleanseExecuted, true);
    assert.equal(cleanRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): whaling station blizzard stalk, Grid Alien tracking, netgun constriction & acid wristblade counter (+400 Honor)', () => {
    const sector = new Avp2004WhalingStationCelticNetgunSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.trackGridAlienAcrossMachinery(), /Must stalk whaling station blizzard/);

    const stalkRes = sector.stalkWhalingStationBlizzard({
      ambientTempCelsius: -42.0,
      blizzardWindSpeedKmh: 95,
      ironWhalingStructureElevationM: 14.5
    });
    assert.equal(stalkRes.whalingStationBlizzardStalked, true);

    const trackRes = sector.trackGridAlienAcrossMachinery({
      gridCarapaceScarsIdentified: true,
      scaffoldTailSweepVelocityMps: 18.2,
      celticBioMaskTrackingScore: 0.98
    });
    assert.equal(trackRes.gridAlienTracked, true);

    const netRes = sector.fireNetgunConstriction({
      netTensionFactor: 0.97,
      constrictionPressurePsi: 480,
      meshContactNodes: 16
    });
    assert.equal(netRes.netgunConstrictionFired, true);

    const acidRes = sector.executeAcidBurnWristbladeCounter({
      acidWireMeltingRateMmPerSec: 14.0,
      acidSprayDodgeReactionSec: 0.14,
      dualWristbladeThrustDamage: 950
    });
    assert.equal(acidRes.acidBurnWristbladeCounterExecuted, true);
    assert.equal(acidRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): power station grid infiltration, dual plasma pistols, transformer overload & EMP blackout (+400 Honor)', () => {
    const sector = new AvpRequiem2007PowerPlantPlasmaBlackoutSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.armorDualPlasmaPistols(), /Must infiltrate power grid/);

    const gridRes = sector.infiltratePowerStationGrid({
      gridVoltageKilovolts: 500,
      transformerTurbineRpm: 3600,
      xenomorphInfestationDensityPpm: 860
    });
    assert.equal(gridRes.powerStationGridInfiltrated, true);

    const pistolRes = sector.armorDualPlasmaPistols({
      dualHandheldConversionVerified: true,
      plasmaBoltFrequencyGhz: 14.5,
      coolingCellEfficiencyScore: 0.96
    });
    assert.equal(pistolRes.dualPlasmaPistolsArmored, true);

    const overRes = sector.chargeTransformerOverload({
      plasmaCapacitorJoules: 28000,
      magneticConfinementFieldTesla: 8.5,
      transformerCoreSuperheatCelsius: 1850
    });
    assert.equal(overRes.transformerOverloadCharged, true);

    const empRes = sector.executeEmpBlackoutVaporization({
      empPulseRadiusMeters: 650,
      xenomorphVaporizationCount: 8,
      countyElectricalBlackoutConfirmed: true
    });
    assert.equal(empRes.empBlackoutVaporizationExecuted, true);
    assert.equal(empRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): moonlight grass duel, katana cross-slash, Stargazer lab breakout & smart armor recall (+450 Honor)', () => {
    const sector = new Predators2010HanzoDuelFugitiveGauntletSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeKatanaCrossSlash(), /Must engage moonlight grass duel/);

    const duelRes = sector.engageMoonlightGrassDuel({
      grassFieldWindSpeedKmh: 14,
      moonlightIlluminationLux: 0.85,
      falconerHonorableDuelAccepted: true
    });
    assert.equal(duelRes.moonlightGrassDuelEngaged, true);

    const slashRes = sector.executeKatanaCrossSlash({
      katanaEdgeKeennessScore: 0.99,
      falconerChestLacerationDepthCm: 12.0,
      mutualHonorSaluteConfirmed: true
    });
    assert.equal(slashRes.katanaCrossSlashExecuted, true);

    const labRes = sector.shatterStargazerLabInhibitors({
      labSedativeDosageMg: 850,
      adrenalSurgeIndex: 0.98,
      inhibitorClampSeveranceForceNewtons: 5200
    });
    assert.equal(labRes.stargazerLabInhibitorsShattered, true);

    const recallRes = sector.resolveSmartArmorRecallBreach({
      magneticSmartArmorCouplingMs: 180,
      reinforcementDoorBreachJoules: 14500,
      containmentTeamDisarmedCount: 6
    });
    assert.equal(recallRes.smartArmorRecallBreachResolved, true);
    assert.equal(recallRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): river grizzly charge, camouflage blood wash, concussive skull punch & Absolu Sanctum (+500 Honor)', () => {
    const sector = new Prey2022GrizzlyBearLiftBadlandsSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.revealCamouflageBloodWash(), /Must encounter grizzly charge/);

    const bearRes = sector.encounterRiverGrizzlyCharge({
      grizzlyWeightKg: 540,
      chargeVelocityMps: 13.8,
      riverbedWaterDepthM: 0.65
    });
    assert.equal(bearRes.riverGrizzlyChargeEncountered, true);

    const washRes = sector.revealCamouflageBloodWash({
      bloodSpatterCoverageFactor: 0.94,
      waterSprayDisruptionIndex: 0.96,
      feralSilhouetteExposed: true
    });
    assert.equal(washRes.camouflageBloodWashRevealed, true);

    const hoistRes = sector.executeConcussiveNeckBreakHoist({
      punchKineticForceJoules: 12500,
      cervicalSpineFractureConfirmed: true,
      carcassLiftElevationMeters: 2.45
    });
    assert.equal(hoistRes.concussiveNeckBreakHoisted, true);

    const sanctumRes = sector.secureAbsoluSanctumMastery({
      badlandsAutonomousPlatforms: 2,
      canyonRavineScanGhz: 18.5,
      absoluSanctumConsecrated: true
    });
    assert.equal(sanctumRes.absoluSanctumMasterySecured, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseAbsoluSupremeApexYautjaDefeatProtocolSector();

    // Case 1: Yautja + Defeated + In Absolu Sanctum -> NUCLEAR PURGE
    const case1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: -15,
      arenaConfiguration: PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM
    });
    assert.equal(case1.selfDestructTriggered, true);
    assert.equal(case1.reason, 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE');
    assert.equal(case1.purgeYieldMegatons, 0.70);
    assert.equal(case1.honorAwarded, 500);
    assert.equal(sector.isFullyCompleted(), true);

    // Case 2: Yautja + Alive + In Absolu Sanctum -> LOCKED
    const case2 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 65,
      arenaConfiguration: PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM
    });
    assert.equal(case2.selfDestructTriggered, false);
    assert.equal(case2.reason, 'YAUTJA_STILL_ALIVE');

    // Case 3: Human / Synthetic + Defeated + In Absolu Sanctum -> LOCKED
    const case3 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM
    });
    assert.equal(case3.selfDestructTriggered, false);
    assert.equal(case3.reason, 'NOT_A_YAUTJA');

    // Case 4: Yautja + Defeated + Outside Target Sanctum -> LOCKED
    const case4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: 'VALHALLA_CORRIDOR_STAGE_2'
    });
    assert.equal(case4.selfDestructTriggered, false);
    assert.equal(case4.reason, 'INVALID_ARENA_CONFIGURATION');
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchiseAbsoluSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v233');
    assert.equal(snapshot.pantheon, 'Absolu Suprême Apex (1987-2025)');
    assert.equal(typeof snapshot.totalHonor, 'number');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.establishLogBridgePosition({ logBridgeSpanMeters: 16.5, ravineChasmDepthMeters: 24.0, balanceStabilityScore: 0.96 });
    director.sectors.predator1987.exposeThermalSkinFlaking({ ambientJungleTempCelsius: 39.5, mudFlakeDehydrationPercent: 88, exposedTorsoInfraredTempCelsius: 36.8 });
    director.sectors.predator1987.lockTriLaserPlasmacaster({ triLaserConvergenceMm: 12, plasmacasterCapacitorChargePercent: 95, acousticTriDotHumDb: 72 });
    director.sectors.predator1987.executePunjiStakeLeap({ sprintVelocityMps: 8.4, punjiPitClearanceMeters: 4.2, counterweightTriggerPulled: true });

    director.sectors.predator21990.initiateRooftopAlleyStandoff({ rainIntensityPph: 78, voodooSwordStanceAcquired: true, kingWillieDreadQuotient: 0.95 });
    director.sectors.predator21990.ionizeLightningCamouflage({ lightningDischargeJoules: 450000, opticalCamouflageSurgeFactor: 0.98, sparksSilhouetteRevealScore: 0.99 });
    director.sectors.predator21990.parryCaneSwordStrike({ caneSwordVelocityMps: 14.5, combistickDeflectionTorqueNm: 620, bladeLockAcousticDb: 94 });
    director.sectors.predator21990.executeSpinalTrophyCleanse({ spinalExtractionForceNewtons: 5600, dissolvingCleanerWashPpm: 9800, cranialBonePolishingScore: 0.99 });

    director.sectors.avp2004.stalkWhalingStationBlizzard({ ambientTempCelsius: -42.0, blizzardWindSpeedKmh: 95, ironWhalingStructureElevationM: 14.5 });
    director.sectors.avp2004.trackGridAlienAcrossMachinery({ gridCarapaceScarsIdentified: true, scaffoldTailSweepVelocityMps: 18.2, celticBioMaskTrackingScore: 0.98 });
    director.sectors.avp2004.fireNetgunConstriction({ netTensionFactor: 0.97, constrictionPressurePsi: 480, meshContactNodes: 16 });
    director.sectors.avp2004.executeAcidBurnWristbladeCounter({ acidWireMeltingRateMmPerSec: 14.0, acidSprayDodgeReactionSec: 0.14, dualWristbladeThrustDamage: 950 });

    director.sectors.avpRequiem2007.infiltratePowerStationGrid({ gridVoltageKilovolts: 500, transformerTurbineRpm: 3600, xenomorphInfestationDensityPpm: 860 });
    director.sectors.avpRequiem2007.armorDualPlasmaPistols({ dualHandheldConversionVerified: true, plasmaBoltFrequencyGhz: 14.5, coolingCellEfficiencyScore: 0.96 });
    director.sectors.avpRequiem2007.chargeTransformerOverload({ plasmaCapacitorJoules: 28000, magneticConfinementFieldTesla: 8.5, transformerCoreSuperheatCelsius: 1850 });
    director.sectors.avpRequiem2007.executeEmpBlackoutVaporization({ empPulseRadiusMeters: 650, xenomorphVaporizationCount: 8, countyElectricalBlackoutConfirmed: true });

    director.sectors.predators2010.engageMoonlightGrassDuel({ grassFieldWindSpeedKmh: 14, moonlightIlluminationLux: 0.85, falconerHonorableDuelAccepted: true });
    director.sectors.predators2010.executeKatanaCrossSlash({ katanaEdgeKeennessScore: 0.99, falconerChestLacerationDepthCm: 12.0, mutualHonorSaluteConfirmed: true });
    director.sectors.predators2010.shatterStargazerLabInhibitors({ labSedativeDosageMg: 850, adrenalSurgeIndex: 0.98, inhibitorClampSeveranceForceNewtons: 5200 });
    director.sectors.predators2010.resolveSmartArmorRecallBreach({ magneticSmartArmorCouplingMs: 180, reinforcementDoorBreachJoules: 14500, containmentTeamDisarmedCount: 6 });

    director.sectors.prey2022.encounterRiverGrizzlyCharge({ grizzlyWeightKg: 540, chargeVelocityMps: 13.8, riverbedWaterDepthM: 0.65 });
    director.sectors.prey2022.revealCamouflageBloodWash({ bloodSpatterCoverageFactor: 0.94, waterSprayDisruptionIndex: 0.96, feralSilhouetteExposed: true });
    director.sectors.prey2022.executeConcussiveNeckBreakHoist({ punchKineticForceJoules: 12500, cervicalSpineFractureConfirmed: true, carcassLiftElevationMeters: 2.45 });
    director.sectors.prey2022.secureAbsoluSanctumMastery({ badlandsAutonomousPlatforms: 2, canyonRavineScanGhz: 18.5, absoluSanctumConsecrated: true });

    director.sectors.defeatProtocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM
    });

    assert.equal(director.isAllSectorsCompleted(), true);
    assert.equal(director.calculateTotalHonor(), 3000);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseAbsoluSupremeApexMasterAuditor();
    const report = auditor.runFullAuditSuite();

    assert.equal(report.allSectorsPassed, true);
    assert.equal(report.rule3StrictCompliance, true);
    assert.equal(report.webglBudgetCompliant, true);
    assert.ok(report.drawCallsReported <= 300);

    assert.equal(report.rule3TruthTable.case1_YautjaDefeatedInSanctum, true);
    assert.equal(report.rule3TruthTable.case2_YautjaAliveInSanctum, true);
    assert.equal(report.rule3TruthTable.case3_HumanDefeatedInSanctum, true);
    assert.equal(report.rule3TruthTable.case4_YautjaDefeatedOutsideSanctum, true);
  });

  it('10. AudioSynthesizer: Absolu Suprême acoustic models & SFX synthesized', () => {
    // 1. Log bridge acoustic model
    const logAcoustics = audioSynth.computeAbsoluLogBridgeAcoustics({
      logBridgeSpanMeters: 16.5,
      plasmacasterCapacitorChargePercent: 95
    });
    assert.ok(logAcoustics.woodStressCreakHz > 0);
    assert.ok(logAcoustics.capacitorWhineDb > 0);

    // 2. Whaling blizzard acoustic model
    const blizzardAcoustics = audioSynth.computeAbsoluWhalingBlizzardAcoustics({
      blizzardWindSpeedKmh: 95,
      ambientTempCelsius: -42.0
    });
    assert.ok(blizzardAcoustics.galeHowlAcousticDb > 0);
    assert.ok(blizzardAcoustics.cryogenicMetalStrainHz > 0);

    // 3. Verify all 15 SFX methods exist and execute cleanly
    const sfxMethods = [
      'playPredator1987AbsoluLogBridgeCreakSFX',
      'playPredator1987AbsoluPunjiStakeLeapSFX',
      'playPredator21990AbsoluLightningDischargeSFX',
      'playPredator21990AbsoluSpinalExtractionCleanseSFX',
      'playAvp2004AbsoluWhalingBlizzardHowlSFX',
      'playAvp2004AbsoluNetgunWireConstrictionSFX',
      'playAvp2004AbsoluAcidWireMeltSFX',
      'playAvpRequiem2007AbsoluDualPlasmaPistolDischargeSFX',
      'playAvpRequiem2007AbsoluPowerGridEmpBlackoutSFX',
      'playPredators2010AbsoluHanzoKatanaCrossSlashSFX',
      'playPredators2010AbsoluFugitiveSmartArmorAssemblySFX',
      'playPrey2022AbsoluRiverGrizzlyRoarSFX',
      'playPrey2022AbsoluConcussiveSkullPunchSFX',
      'playPrey2022AbsoluCarcassOverheadHoistSFX',
      'playPredatorFranchiseAbsoluSanctumNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof audioSynth[method], 'function', `Expected method ${method} on audioSynth`);
      assert.doesNotThrow(() => audioSynth[method]());
    }
  });
});
