import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987CanopyLeapLogSwingAndTriLaserAimSector } from '../src/gameplay/Predator1987CanopyLeapLogSwingAndTriLaserAimSector.js';
import { Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector } from '../src/gameplay/Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector.js';
import { Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector } from '../src/gameplay/Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector.js';
import { AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector } from '../src/gameplay/AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector.js';
import { Predators2010FalconDroneTelemetryAndShipHullForceFieldSector } from '../src/gameplay/Predators2010FalconDroneTelemetryAndShipHullForceFieldSector.js';
import { Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector } from '../src/gameplay/Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector.js';
import { PredatorFranchiseSouverainApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseSouverainApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseSouverainApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseSouverainApexHUDDirector.js';
import { HumanQaPredatorFranchiseSouverainApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseSouverainApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v225 - Predator Franchise Souverain Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): canopy leap, spiked log pendulum suspension, tri-laser lock & canopy sweep (+350 Honor)', () => {
    const sector = new Predator1987CanopyLeapLogSwingAndTriLaserAimSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.suspendSpikedLogPendulum(), /Must execute canopy leaps/);

    const leapRes = sector.executeCanopyBranchLeap({
      branchLeapDistanceMeters: 14,
      canopyAgilityScore: 0.98
    });
    assert.equal(leapRes.canopyBranchLeapExecuted, true);

    const pendRes = sector.suspendSpikedLogPendulum({
      pendulumMassKg: 350,
      vineTensileLimitNewtons: 8200
    });
    assert.equal(pendRes.spikedLogPendulumSuspended, true);

    const lockRes = sector.lockTriLaserTargetingMatrix({
      targetingRangeMeters: 25,
      reticleConvergenceScore: 0.99
    });
    assert.equal(lockRes.triLaserTargetingLocked, true);

    const sweepRes = sector.releaseSpikedLogCanopySweep({
      vineSeverCuttingForceJoules: 640,
      pendulumKineticEnergyJoules: 14200
    });
    assert.equal(sweepRes.spikedLogSweepReleased, true);
    assert.equal(sweepRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): alleyway quarry stalking, combistick torque throw, wall scale & sutures (+400 Honor)', () => {
    const sector = new Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeCombistickTorqueThrow(), /Must stalk quarry/);

    const stalkRes = sector.stalkAlleywayQuarryInRain({
      rainIntensityMmH: 75,
      neonInterferenceLux: 14.5
    });
    assert.equal(stalkRes.alleywayQuarryStalked, true);

    const throwRes = sector.executeCombistickTorqueThrow({
      throwVelocityMs: 65,
      pinningRangeMeters: 22
    });
    assert.equal(throwRes.combistickTorqueThrowExecuted, true);

    const scaleRes = sector.scaleBrickWallFireEscape({
      wallVerticalHeightMeters: 18.5,
      clawGripReliabilityScore: 0.99
    });
    assert.equal(scaleRes.brickWallFireEscapeScaled, true);

    const sutureRes = sector.applyMedicompCoagulantAndStaples({
      coagulantVolumeMl: 45,
      surgicalStaplesSecuredCount: 6
    });
    assert.equal(sutureRes.medicompCoagulantStapled, true);
    assert.equal(sutureRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): acid clan mark gash, Queen ice surface breach, whaling winch cable hooking & abyss drag (+400 Honor)', () => {
    const sector = new Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.endureQueenSurfaceBreach(), /Must burn clan mark/);

    const gashRes = sector.burnClanMarkGashRitual({
      cauterizingAcidTempCelsius: 420,
      clanSymbolIntegrityScore: 0.99
    });
    assert.equal(gashRes.clanMarkGashRitualBurned, true);

    const breachRes = sector.endureQueenSurfaceBreach({
      iceThicknessMeters: 2.4,
      matriarchLungeImpactJoules: 24000
    });
    assert.equal(breachRes.queenSurfaceBreachEndured, true);

    const hookRes = sector.hookWhalingWinchCable({
      cableTensionCapacityNewtons: 28000,
      dualAnchorLockConfirmed: true
    });
    assert.equal(hookRes.whalingWinchCableHooked, true);

    const dragRes = sector.releaseWinchDrumIntoAbyssalOcean({
      abyssDropDepthMeters: 850,
      cliffReleaseExecuted: true
    });
    assert.equal(dragRes.queenDraggedIntoAbyssalOcean, true);
    assert.equal(dragRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): sporting store rafter infiltration, criss-cross laser grid, chestburster extraction & plasma volley (+400 Honor)', () => {
    const sector = new AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.deployCrissCrossLaserGrid(), /Must infiltrate rafters/);

    const infilRes = sector.infiltrateSportsStoreRafters({
      rafterElevationMeters: 8.5,
      roofHiveContaminationScore: 0.98
    });
    assert.equal(infilRes.sportsStoreRaftersInfiltrated, true);

    const gridRes = sector.deployCrissCrossLaserGrid({
      laserNodesCount: 6,
      beamFrequencyThz: 600
    });
    assert.equal(gridRes.crissCrossLaserGridDeployed, true);

    const extRes = sector.extractChestbursterEmbryo({
      scalpelPrecisionScore: 0.99,
      embryoPreservationState: 'SPECIMEN_EXTRACTED_AND_DISSOLVED'
    });
    assert.equal(extRes.chestbursterEmbryoExtracted, true);

    const plasmaRes = sector.executeDualCorridorPlasmaDischarge({
      dualPlasmaVolleyJoules: 16800,
      droneVaporizationConfirmed: true
    });
    assert.equal(plasmaRes.dualCorridorPlasmaDischargeExecuted, true);
    assert.equal(plasmaRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): falcon drone launch, biomask telemetry, downed ship force field & EMP overload (+450 Honor)', () => {
    const sector = new Predators2010FalconDroneTelemetryAndShipHullForceFieldSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.streamBiomaskTelemetry(), /Must launch falcon drone/);

    const droneRes = sector.launchMechanicalFalconDrone({
      flightAltitudeMeters: 120,
      opticalZoomMagnification: 20
    });
    assert.equal(droneRes.falconDroneLaunched, true);

    const teleRes = sector.streamBiomaskTelemetry({
      dataTransferRateMbps: 850,
      thermalTrackingAccuracyScore: 0.99
    });
    assert.equal(teleRes.biomaskTelemetryStreamed, true);

    const fieldRes = sector.engageShipHullForceField({
      fieldIntegrityPercent: 98,
      capacitorThresholdJoules: 15000
    });
    assert.equal(fieldRes.shipHullForceFieldEngaged, true);

    const empRes = sector.overloadForceFieldPerimeter({
      empPulseMegawatts: 42,
      airlockBreachConfirmed: true
    });
    assert.equal(empRes.forceFieldPerimeterOverloaded, true);
    assert.equal(empRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): grizzly melee clash, bone spear impalement, trophy extraction & Souverain Sanctum (+500 Honor)', () => {
    const sector = new Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.impaleChargingBeastWithBoneSpear(), /Must engage grizzly/);

    const clashRes = sector.engageGrizzlyBearKineticClash({
      bearMassKg: 800,
      kineticPunchJoules: 5400
    });
    assert.equal(clashRes.grizzlyBearKineticEngaged, true);

    const spearRes = sector.impaleChargingBeastWithBoneSpear({
      spearThrustForceNewtons: 8600,
      sternumPenetrationCm: 32
    });
    assert.equal(spearRes.boneTippedSpearImpaled, true);

    const trophyRes = sector.extractGrizzlySkullAndSpineTrophy({
      hoistMassKg: 800,
      trophyCleanCutScore: 0.99
    });
    assert.equal(trophyRes.grizzlyTrophyExtracted, true);

    const sanctumRes = sector.ascendToSouverainApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 14500,
      synthSyncIndex: 0.99,
      souverainSealGlyph: 'SOUVERAIN_1987_2025'
    });
    assert.equal(sanctumRes.souverainApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Souverain Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseSouverainApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 50,
      arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_SOUVERAIN_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterSouverainGlyphsSequence({ glyphs: ['᚛', 'ᚄ', 'ᚑ', 'ᚏ', '᚜'] });
    assert.equal(glyphRes.souverainGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 138, mockeryFrequencyHz: 570 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeSouverainMicroNuclearPurge({ countdownSeconds: 11.5, blastRadiusMeters: 95 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Souverain Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseSouverainApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all 7 sectors
    director.sectors.predator1987.executeCanopyBranchLeap();
    director.sectors.predator1987.suspendSpikedLogPendulum();
    director.sectors.predator1987.lockTriLaserTargetingMatrix();
    director.sectors.predator1987.releaseSpikedLogCanopySweep();

    director.sectors.predator21990.stalkAlleywayQuarryInRain();
    director.sectors.predator21990.executeCombistickTorqueThrow();
    director.sectors.predator21990.scaleBrickWallFireEscape();
    director.sectors.predator21990.applyMedicompCoagulantAndStaples();

    director.sectors.avp2004.burnClanMarkGashRitual();
    director.sectors.avp2004.endureQueenSurfaceBreach();
    director.sectors.avp2004.hookWhalingWinchCable();
    director.sectors.avp2004.releaseWinchDrumIntoAbyssalOcean();

    director.sectors.avpRequiem2007.infiltrateSportsStoreRafters();
    director.sectors.avpRequiem2007.deployCrissCrossLaserGrid();
    director.sectors.avpRequiem2007.extractChestbursterEmbryo();
    director.sectors.avpRequiem2007.executeDualCorridorPlasmaDischarge();

    director.sectors.predators2010.launchMechanicalFalconDrone();
    director.sectors.predators2010.streamBiomaskTelemetry();
    director.sectors.predators2010.engageShipHullForceField();
    director.sectors.predators2010.overloadForceFieldPerimeter();

    director.sectors.prey2022.engageGrizzlyBearKineticClash();
    director.sectors.prey2022.impaleChargingBeastWithBoneSpear();
    director.sectors.prey2022.extractGrizzlySkullAndSpineTrophy();
    director.sectors.prey2022.ascendToSouverainApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_SOUVERAIN_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterSouverainGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeSouverainMicroNuclearPurge();

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
    assert.equal(completedSnap.playtesters.length, 5);

    // Verify SSR/Node DOM safe handling
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);
  });

  it('9. Human QA Souverain Apex Master Auditor: full-spectrum certification, Rule 3 & draw calls <= 300', () => {
    const auditor = new HumanQaPredatorFranchiseSouverainApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.allSectorsCompleted, true);
    assert.equal(results.totalHonorAwarded, 3000);
    assert.equal(results.maxHonorPossible, 3000);
    assert.equal(results.rule3Compliant, true);
    assert.equal(results.rule3Validation.case1_validYautjaLossConfig, true);
    assert.equal(results.rule3Validation.case2_humanForbidden, true);
    assert.equal(results.rule3Validation.case3_aliveHunterForbidden, true);
    assert.equal(results.rule3Validation.case4_wrongArenaConfigForbidden, true);

    // Rendering draw calls budget constraint
    assert.equal(results.webglBudget.drawCalls <= 300, true);
    assert.equal(results.webglBudget.audioLatencyCompliant, true);
    assert.equal(results.isFullyCertified, true);
  });

  it('10. AudioSynthesizer: Souverain acoustic models & 15 dedicated SFX synthesized', () => {
    const canopyAcoustics = audioSynth.computeSouverainCanopyAcoustics({
      branchLeapDistanceMeters: 14,
      pendulumMassKg: 350
    });
    assert.equal(canopyAcoustics.branchLeapDistanceMeters, 14);
    assert.equal(canopyAcoustics.pendulumMassKg, 350);
    assert.equal(typeof canopyAcoustics.canopyWindRumbleHz, 'number');
    assert.equal(typeof canopyAcoustics.pendulumSwooshDb, 'number');

    const winchAcoustics = audioSynth.computeSouverainWhalingWinchAcoustics({
      cableTensionCapacityNewtons: 28000,
      abyssDropDepthMeters: 850
    });
    assert.equal(winchAcoustics.cableTensionCapacityNewtons, 28000);
    assert.equal(winchAcoustics.abyssDropDepthMeters, 850);
    assert.equal(typeof winchAcoustics.steelCableStrainWhineHz, 'number');
    assert.equal(typeof winchAcoustics.abyssalEchoDb, 'number');

    const sfxMethods = [
      'playPredator1987SouverainCanopyLeapSFX',
      'playPredator1987SouverainSpikedPendulumSweepSFX',
      'playPredator21990SouverainAlleyCombistickThrowSFX',
      'playPredator21990SouverainWallSutureStapleSFX',
      'playAvp2004SouverainClanMarkAcidGashSFX',
      'playAvp2004SouverainWhalingWinchAbyssDragSFX',
      'playAvpRequiem2007SouverainSportsStoreLaserWebSFX',
      'playAvpRequiem2007SouverainChestbursterDissectionSFX',
      'playPredators2010SouverainFalconDroneFlightSFX',
      'playPredators2010SouverainShipForceFieldOverloadSFX',
      'playPrey2022SouverainGrizzlyBearSpearClashSFX',
      'playPrey2022SouverainGrizzlyTrophyHoistSFX',
      'playPredatorFranchiseSouverainApexNuclearPurgeSFX',
      'playPredatorFranchiseSouverainVictoryAnthemSFX',
      'playPredatorFranchiseSouverainSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
