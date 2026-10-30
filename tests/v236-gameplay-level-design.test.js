import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987BillyMacheteRitualBridgeSector } from '../src/gameplay/Predator1987BillyMacheteRitualBridgeSector.js';
import { Predator21990MeatLockerOwlfcryoStandoffSector } from '../src/gameplay/Predator21990MeatLockerOwlfcryoStandoffSector.js';
import { Avp2004PyramidWallShiftLabyrinthSector } from '../src/gameplay/Avp2004PyramidWallShiftLabyrinthSector.js';
import { AvpRequiem2007CemeteryCryptWhipCleaveSector } from '../src/gameplay/AvpRequiem2007CemeteryCryptWhipCleaveSector.js';
import { Predators2010AlienHoundFlushingSector } from '../src/gameplay/Predators2010AlienHoundFlushingSector.js';
import { Prey2022TetheredTomahawkSeismicBadlandsSector } from '../src/gameplay/Prey2022TetheredTomahawkSeismicBadlandsSector.js';
import {
  PredatorFranchiseOriginelSupremeApexYautjaDefeatProtocolSector,
  PREDATOR_FRANCHISE_ORIGINEL_SUPREME_APEX_SANCTUM
} from '../src/gameplay/PredatorFranchiseOriginelSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseOriginelSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseOriginelSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseOriginelSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseOriginelSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v236 - Predator Franchise Originel Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): gorge bridge occupancy, firearms discard into abyss, chest slash ritual & machete stand (+350 Honor)', () => {
    const sector = new Predator1987BillyMacheteRitualBridgeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.discardFirearmsIntoAbyss(), /Must occupy gorge bridge/);

    const bridgeRes = sector.occupyGorgeBridgeSpan({
      gorgeBridgeSpanMeters: 18.0,
      chasmMistElevationMeters: 35.0,
      warriorCalmIndex: 0.98
    });
    assert.equal(bridgeRes.gorgeBridgeSpanOccupied, true);

    const dropRes = sector.discardFirearmsIntoAbyss({
      rifleDropWeightKg: 4.8,
      abyssSplashAcousticDb: 48,
      allTacticalFirearmsDiscarded: true
    });
    assert.equal(dropRes.firearmsDiscardedIntoAbyss, true);

    const slashRes = sector.performChestSlashRitual({
      macheteBladeLengthCm: 45,
      ritualChestIncisionDepthMm: 2.5,
      bloodChallengeScentPpm: 450
    });
    assert.equal(slashRes.chestSlashRitualPerformed, true);

    const standRes = sector.resolveSolitaryMacheteStandoff({
      jungleHunterApproachMeters: 8.0,
      macheteGlazeReflectionLux: 0.92,
      mutualWarriorCodeHonored: true
    });
    assert.equal(standRes.solitaryMacheteStandoffResolved, true);
    assert.equal(standRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): meat locker conveyor infiltration, OWLF thermal suits, UV phosphorescence scan & rail ambush (+400 Honor)', () => {
    const sector = new Predator21990MeatLockerOwlfcryoStandoffSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detectOwlfThermalSuits(), /Must infiltrate meat locker/);

    const meatRes = sector.infiltrateMeatLockerConveyor({
      ambientFreezerTempCelsius: -16.5,
      hangingBeefCarcassCount: 48,
      overheadConveyorElevationM: 6.8
    });
    assert.equal(meatRes.meatLockerConveyorInfiltrated, true);

    const suitRes = sector.detectOwlfThermalSuits({
      owlfOperativeCount: 6,
      cryoInsulationLeakageCelsius: 1.4,
      liquidNitrogenCylinderPressurePsi: 3200
    });
    assert.equal(suitRes.owlfThermalSuitsDetected, true);

    const uvRes = sector.scanUvBeamPhosphorescence({
      uvWavelengthNanometers: 375,
      bioMaskLensFilterMode: 'ULTRAVIOLET_DUAL_SPECTRUM',
      phosphorescentFlashlightTrackingConfirmed: true
    });
    assert.equal(uvRes.uvBeamPhosphorescenceScanned, true);

    const railRes = sector.resolveCarcassRailAmbush({
      plasmacasterBlastJoules: 16500,
      nitrogenEmittersNeutralized: true,
      keyesTaskForceDefeated: true
    });
    assert.equal(railRes.carcassRailAmbushResolved, true);
    assert.equal(railRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): granite labyrinth entrance, base-8 calendar glyphs, 10-minute clockwork shift & crushing slab escape (+400 Honor)', () => {
    const sector = new Avp2004PyramidWallShiftLabyrinthSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.translateBase8CalendarGlyphs(), /Must enter granite labyrinth/);

    const labRes = sector.enterGraniteLabyrinth({
      labyrinthChamberDepthM: 680,
      graniteBlockMassTons: 52.0,
      subterraneanAcousticEchoDb: 68
    });
    assert.equal(labRes.graniteLabyrinthEntered, true);

    const glyphRes = sector.translateBase8CalendarGlyphs({
      astronomicalDialDiameterCm: 95,
      glyphTranslationAccuracyPercent: 98.5,
      tenMinuteCycleCalculated: true
    });
    assert.equal(glyphRes.base8CalendarGlyphsTranslated, true);

    const shiftRes = sector.triggerMegalithicClockworkShift({
      gearHydraulicTensionKn: 4800,
      wallShiftSpeedMps: 1.8,
      corridorReconfigurationPercent: 100
    });
    assert.equal(shiftRes.megalithicClockworkShiftTriggered, true);

    const slabRes = sector.resolveCrushingSlabNavigation({
      slabClearanceMarginCm: 14,
      escapeReactionTimeSec: 0.42,
      corridorExitSecured: true
    });
    assert.equal(slabRes.crushingSlabNavigationResolved, true);
    assert.equal(slabRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): cemetery mausoleum infiltration, barbed tail whip uncoil, iron gate cleave & mid-leap decapitation (+400 Honor)', () => {
    const sector = new AvpRequiem2007CemeteryCryptWhipCleaveSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.uncoilBarbedTailWhip(), /Must infiltrate cemetery mausoleum/);

    const cryptRes = sector.infiltrateCemeteryMausoleum({
      stormRainIntensityMmPerHour: 82,
      cemeteryCryptDepthMeters: 8.5,
      tombstoneCoverDensity: 0.94
    });
    assert.equal(cryptRes.cemeteryMausoleumInfiltrated, true);

    const whipRes = sector.uncoilBarbedTailWhip({
      whipSegmentCount: 36,
      segmentedVertebraeTensileStrengthMpa: 1850,
      coiledLengthMeters: 4.2
    });
    assert.equal(whipRes.barbedTailWhipUncoiled, true);

    const gateRes = sector.cleaveWroughtIronGate({
      whipTipSupersonicVelocityMps: 380,
      gateSeveranceKineticJoules: 9800,
      ironBarThicknessMm: 24
    });
    assert.equal(gateRes.wroughtIronGateCleaved, true);

    const decapRes = sector.resolveMidLeapWhipDecapitation({
      constrictionThrottleTorqueNm: 740,
      droneDecapitationConfirmed: true,
      acidBloodSplashDeflected: true
    });
    assert.equal(decapRes.midLeapWhipDecapitationResolved, true);
    assert.equal(decapRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): hound pack ambush, armored charge endure, claymore crossfire & neural whistle (+450 Honor)', () => {
    const sector = new Predators2010AlienHoundFlushingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.endureArmoredHoundCharge(), /Must encounter hound ambush/);

    const houndRes = sector.encounterHoundClearingAmbush({
      houndPackCount: 6,
      grasslandClearingDiameterMeters: 75,
      trackerHornAcousticCallDb: 94
    });
    assert.equal(houndRes.houndClearingAmbushEncountered, true);

    const chargeRes = sector.endureArmoredHoundCharge({
      houndSprintVelocityKmh: 62.0,
      cranialBoneArmorThicknessMm: 32,
      quillLacerationDamageMitigationScore: 0.95
    });
    assert.equal(chargeRes.armoredHoundChargeEndured, true);

    const claymoreRes = sector.triggerTacticalClaymoreCrossfire({
      claymoreFragmentationBearings: 1400,
      houndPackSuppressionFactor: 0.98,
      bambooStakeBarricadeIntact: true
    });
    assert.equal(claymoreRes.tacticalClaymoreCrossfireTriggered, true);

    const whistleRes = sector.pacifyWithUltrasonicNeuralWhistle({
      ultrasonicFrequencyKhz: 28.5,
      neuralCommandSignalWatts: 120,
      houndPackRedirectConfirmed: true
    });
    assert.equal(whistleRes.ultrasonicNeuralWhistlePacified, true);
    assert.equal(whistleRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): riverbank standoff, tethered tomahawk prime, bone mask latch sever & Originel Sanctum (+500 Honor)', () => {
    const sector = new Prey2022TetheredTomahawkSeismicBadlandsSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.primeTetheredTomahawk(), /Must engage riverbank standoff/);

    const riverRes = sector.engageComancheRiverbankStandoff({
      riverCurrentVelocityMps: 4.2,
      feralPredatorProximityM: 8.5,
      naruWarriorResolveScore: 0.99
    });
    assert.equal(riverRes.comancheRiverbankStandoffEngaged, true);

    const primeRes = sector.primeTetheredTomahawk({
      rawhideTetherLengthMeters: 7.5,
      braidedTensileStrengthNewtons: 3800,
      flintEdgeSharpnessScore: 0.98
    });
    assert.equal(primeRes.tetheredTomahawkPrimed, true);

    const severRes = sector.severBoneMaskHydraulicLatch({
      tomahawkThrowVelocityMps: 26.5,
      latchSeverancePrecisionMm: 1.4,
      tetherSnapReturnMs: 280
    });
    assert.equal(severRes.boneMaskHydraulicLatchSevered, true);

    const sanctumRes = sector.crownOriginelSanctumMastery({
      seismicProbeFrequencyHz: 18.5,
      badlandsFaultLinePenetrationKm: 4.8,
      originelSanctumCrowned: true
    });
    assert.equal(sanctumRes.originelSanctumMasteryCrowned, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseOriginelSupremeApexYautjaDefeatProtocolSector();

    // Case 1: Yautja + Defeated + In Originel Sanctum -> NUCLEAR PURGE
    const case1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: -30,
      arenaConfiguration: PREDATOR_FRANCHISE_ORIGINEL_SUPREME_APEX_SANCTUM
    });
    assert.equal(case1.selfDestructTriggered, true);
    assert.equal(case1.reason, 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE');
    assert.equal(case1.purgeYieldMegatons, 0.85);
    assert.equal(case1.honorAwarded, 500);
    assert.equal(sector.isFullyCompleted(), true);

    // Case 2: Yautja + Alive + In Originel Sanctum -> LOCKED
    const case2 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 85,
      arenaConfiguration: PREDATOR_FRANCHISE_ORIGINEL_SUPREME_APEX_SANCTUM
    });
    assert.equal(case2.selfDestructTriggered, false);
    assert.equal(case2.reason, 'YAUTJA_STILL_ALIVE');

    // Case 3: Human / Synthetic + Defeated + In Originel Sanctum -> LOCKED
    const case3 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ORIGINEL_SUPREME_APEX_SANCTUM
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
    const director = new HumanQaPredatorFranchiseOriginelSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v236');
    assert.equal(snapshot.pantheon, 'Originel Suprême Apex (1987-2025)');
    assert.equal(typeof snapshot.totalHonor, 'number');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.occupyGorgeBridgeSpan({ gorgeBridgeSpanMeters: 18.0, chasmMistElevationMeters: 35.0, warriorCalmIndex: 0.98 });
    director.sectors.predator1987.discardFirearmsIntoAbyss({ rifleDropWeightKg: 4.8, abyssSplashAcousticDb: 48, allTacticalFirearmsDiscarded: true });
    director.sectors.predator1987.performChestSlashRitual({ macheteBladeLengthCm: 45, ritualChestIncisionDepthMm: 2.5, bloodChallengeScentPpm: 450 });
    director.sectors.predator1987.resolveSolitaryMacheteStandoff({ jungleHunterApproachMeters: 8.0, macheteGlazeReflectionLux: 0.92, mutualWarriorCodeHonored: true });

    director.sectors.predator21990.infiltrateMeatLockerConveyor({ ambientFreezerTempCelsius: -16.5, hangingBeefCarcassCount: 48, overheadConveyorElevationM: 6.8 });
    director.sectors.predator21990.detectOwlfThermalSuits({ owlfOperativeCount: 6, cryoInsulationLeakageCelsius: 1.4, liquidNitrogenCylinderPressurePsi: 3200 });
    director.sectors.predator21990.scanUvBeamPhosphorescence({ uvWavelengthNanometers: 375, bioMaskLensFilterMode: 'ULTRAVIOLET_DUAL_SPECTRUM', phosphorescentFlashlightTrackingConfirmed: true });
    director.sectors.predator21990.resolveCarcassRailAmbush({ plasmacasterBlastJoules: 16500, nitrogenEmittersNeutralized: true, keyesTaskForceDefeated: true });

    director.sectors.avp2004.enterGraniteLabyrinth({ labyrinthChamberDepthM: 680, graniteBlockMassTons: 52.0, subterraneanAcousticEchoDb: 68 });
    director.sectors.avp2004.translateBase8CalendarGlyphs({ astronomicalDialDiameterCm: 95, glyphTranslationAccuracyPercent: 98.5, tenMinuteCycleCalculated: true });
    director.sectors.avp2004.triggerMegalithicClockworkShift({ gearHydraulicTensionKn: 4800, wallShiftSpeedMps: 1.8, corridorReconfigurationPercent: 100 });
    director.sectors.avp2004.resolveCrushingSlabNavigation({ slabClearanceMarginCm: 14, escapeReactionTimeSec: 0.42, corridorExitSecured: true });

    director.sectors.avpRequiem2007.infiltrateCemeteryMausoleum({ stormRainIntensityMmPerHour: 82, cemeteryCryptDepthMeters: 8.5, tombstoneCoverDensity: 0.94 });
    director.sectors.avpRequiem2007.uncoilBarbedTailWhip({ whipSegmentCount: 36, segmentedVertebraeTensileStrengthMpa: 1850, coiledLengthMeters: 4.2 });
    director.sectors.avpRequiem2007.cleaveWroughtIronGate({ whipTipSupersonicVelocityMps: 380, gateSeveranceKineticJoules: 9800, ironBarThicknessMm: 24 });
    director.sectors.avpRequiem2007.resolveMidLeapWhipDecapitation({ constrictionThrottleTorqueNm: 740, droneDecapitationConfirmed: true, acidBloodSplashDeflected: true });

    director.sectors.predators2010.encounterHoundClearingAmbush({ houndPackCount: 6, grasslandClearingDiameterMeters: 75, trackerHornAcousticCallDb: 94 });
    director.sectors.predators2010.endureArmoredHoundCharge({ houndSprintVelocityKmh: 62.0, cranialBoneArmorThicknessMm: 32, quillLacerationDamageMitigationScore: 0.95 });
    director.sectors.predators2010.triggerTacticalClaymoreCrossfire({ claymoreFragmentationBearings: 1400, houndPackSuppressionFactor: 0.98, bambooStakeBarricadeIntact: true });
    director.sectors.predators2010.pacifyWithUltrasonicNeuralWhistle({ ultrasonicFrequencyKhz: 28.5, neuralCommandSignalWatts: 120, houndPackRedirectConfirmed: true });

    director.sectors.prey2022.engageComancheRiverbankStandoff({ riverCurrentVelocityMps: 4.2, feralPredatorProximityM: 8.5, naruWarriorResolveScore: 0.99 });
    director.sectors.prey2022.primeTetheredTomahawk({ rawhideTetherLengthMeters: 7.5, braidedTensileStrengthNewtons: 3800, flintEdgeSharpnessScore: 0.98 });
    director.sectors.prey2022.severBoneMaskHydraulicLatch({ tomahawkThrowVelocityMps: 26.5, latchSeverancePrecisionMm: 1.4, tetherSnapReturnMs: 280 });
    director.sectors.prey2022.crownOriginelSanctumMastery({ seismicProbeFrequencyHz: 18.5, badlandsFaultLinePenetrationKm: 4.8, originelSanctumCrowned: true });

    director.sectors.defeatProtocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ORIGINEL_SUPREME_APEX_SANCTUM
    });

    assert.equal(director.isAllSectorsCompleted(), true);
    assert.equal(director.calculateTotalHonor(), 3000);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseOriginelSupremeApexMasterAuditor();
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

  it('10. AudioSynthesizer: Originel Suprême acoustic models & SFX synthesized', () => {
    // 1. Machete gorge acoustic model
    const gorgeAcoustics = audioSynth.computeOriginelMacheteGorgeAcoustics({
      gorgeBridgeSpanMeters: 18.0,
      chasmMistElevationMeters: 35.0
    });
    assert.ok(gorgeAcoustics.gorgeWindResonanceHz > 0);
    assert.ok(gorgeAcoustics.abyssMistEchoDb > 0);

    // 2. Pyramid clockwork acoustic model
    const clockworkAcoustics = audioSynth.computeOriginelPyramidClockworkAcoustics({
      graniteBlockMassTons: 52.0,
      gearHydraulicTensionKn: 4800
    });
    assert.ok(clockworkAcoustics.graniteGrindRumbleHz > 0);
    assert.ok(clockworkAcoustics.gearTensionDecibels > 0);

    // 3. Verify all 15 SFX methods exist and execute cleanly
    const sfxMethods = [
      'playPredator1987OriginelMacheteGlintSFX',
      'playPredator1987OriginelChestSlashChallengeSFX',
      'playPredator1987OriginelAbyssFirearmDropSFX',
      'playPredator21990OriginelMeatLockerCryoHissSFX',
      'playPredator21990OriginelConveyorRailCasterVolleySFX',
      'playAvp2004OriginelClockworkGraniteShiftSFX',
      'playAvp2004OriginelCrushingSlabSlamSFX',
      'playAvpRequiem2007OriginelBarbedTailWhipCrackSFX',
      'playAvpRequiem2007OriginelMausoleumIronGateSeverSFX',
      'playPredators2010OriginelHoundPackSnarlSFX',
      'playPredators2010OriginelUltrasonicNeuralWhistleSFX',
      'playPrey2022OriginelTetheredTomahawkWhistleSFX',
      'playPrey2022OriginelMaskLatchSnapReturnSFX',
      'playPrey2022OriginelSeismicFaultProbePingSFX',
      'playPredatorFranchiseOriginelSanctumNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof audioSynth[method], 'function', `Expected method ${method} on audioSynth`);
      assert.doesNotThrow(() => audioSynth[method]());
    }
  });
});
