import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987BillyLogBridgeMacheteDefianceSector } from '../src/gameplay/Predator1987BillyLogBridgeMacheteDefianceSector.js';
import { Predator21990KingWillieVoodooCulDeSacSector } from '../src/gameplay/Predator21990KingWillieVoodooCulDeSacSector.js';
import { Avp2004LexChitinShieldAndTailSpearSector } from '../src/gameplay/Avp2004LexChitinShieldAndTailSpearSector.js';
import { AvpRequiem2007DualShoulderCasterFusionSector } from '../src/gameplay/AvpRequiem2007DualShoulderCasterFusionSector.js';
import { Predators2010CuchilloBoobyTrapAndExocortexHarvestSector } from '../src/gameplay/Predators2010CuchilloBoobyTrapAndExocortexHarvestSector.js';
import { Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector } from '../src/gameplay/Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector.js';
import { PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchisePrimordialSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchisePrimordialSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchisePrimordialSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchisePrimordialSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v228 - Predator Franchise Primordial Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): Billy log bridge position, ritual machete chest slash, fearless 72 BPM cardiac telemetry & honorable melee clash (+350 Honor)', () => {
    const sector = new Predator1987BillyLogBridgeMacheteDefianceSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeRitualMacheteChestSlash(), /Must take position on log bridge/);

    const posRes = sector.takePositionOnFallenLogBridge({
      chasmDepthMeters: 28,
      logSpanLengthMeters: 18.5
    });
    assert.equal(posRes.logBridgePositionTaken, true);

    const slashRes = sector.executeRitualMacheteChestSlash({
      macheteBladeLengthCm: 45,
      slashIncisionDepthMm: 2.5,
      defianceVowConfirmed: true
    });
    assert.equal(slashRes.ritualChestSlashExecuted, true);

    const heartRes = sector.analyzeFearlessHeartRateTelemetry({
      steadyHeartRateBpm: 72,
      adrenalineStabilityScore: 0.99
    });
    assert.equal(heartRes.fearlessHeartRateAnalyzed, true);

    const meleeRes = sector.engageLogBridgeHonorableMelee({
      wristBladeExtensionJoules: 4200,
      closeQuartersClashConfirmed: true
    });
    assert.equal(meleeRes.logBridgeMeleeEngaged, true);
    assert.equal(meleeRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): King Willie flooded voodoo cul-de-sac infiltration, cane sword defiance, puddle optical refraction & skull trophy (+400 Honor)', () => {
    const sector = new Predator21990KingWillieVoodooCulDeSacSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.unsheatheCaneSwordDefiance(), /Must infiltrate cul-de-sac/);

    const infiltRes = sector.infiltrateVoodooCulDeSac({
      candleCount: 42,
      puddleWaterDepthCm: 4.5
    });
    assert.equal(infiltRes.voodooCulDeSacInfiltrated, true);

    const swordRes = sector.unsheatheCaneSwordDefiance({
      bladeLengthCm: 68,
      skullGripCarvingScore: 0.99
    });
    assert.equal(swordRes.caneSwordUnsheathed, true);

    const puddleRes = sector.detectCloakPuddleRefraction({
      refractionVariance: 0.04,
      puddleRipplesDetected: true
    });
    assert.equal(puddleRes.cloakPuddleRefractionDetected, true);

    const trophyRes = sector.washAndExtractSpinalSkullTrophy({
      decapitationForceNewtons: 6200,
      trophyWaterWashConfirmed: true
    });
    assert.equal(trophyRes.skullTrophyWashedAndExtracted, true);
    assert.equal(trophyRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): slain xenomorph chitin harvest, acid-proof head dome shield carving, tail stinger spear forge & Lex armament (+400 Honor)', () => {
    const sector = new Avp2004LexChitinShieldAndTailSpearSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.carveAcidProofHeadDomeShield(), /Must harvest chitin/);

    const harvestRes = sector.harvestSlainXenomorphChitin({
      carapaceThicknessMm: 14,
      fleshyTissueDissolvedConfirmed: true
    });
    assert.equal(harvestRes.carcassChitinHarvested, true);

    const shieldRes = sector.carveAcidProofHeadDomeShield({
      shieldCurvatureRadiusCm: 38,
      acidResistancePhScore: 0.2
    });
    assert.equal(shieldRes.acidProofShieldCarved, true);

    const spearRes = sector.forgeTailStingerSpear({
      spearShaftLengthMeters: 2.1,
      stingerBarbSharpnessMohs: 8.5
    });
    assert.equal(spearRes.tailStingerSpearForged, true);

    const bestowRes = sector.bestowChitinArmamentToLex({
      lexCombatPactConfirmed: true,
      warriorKinshipEstablished: true
    });
    assert.equal(bestowRes.chitinArmamentBestowedToLex, true);
    assert.equal(bestowRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): secondary plasmacaster salvage, twin harness conduit fusion, dual-target HUD calibration & synchronized blast (+400 Honor)', () => {
    const sector = new AvpRequiem2007DualShoulderCasterFusionSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.fuseTwinShoulderHarnessConduits(), /Must salvage secondary caster/);

    const salvageRes = sector.salvageSecondaryPlasmacaster({
      wreckageRadiationLevelRads: 45,
      casterEnergyCellCapacityJoules: 15000
    });
    assert.equal(salvageRes.secondaryPlasmaCasterSalvaged, true);

    const fuseRes = sector.fuseTwinShoulderHarnessConduits({
      powerCouplingVoltage: 480,
      harnessTensileStrengthNewtons: 7400
    });
    assert.equal(fuseRes.twinHarnessConduitFused, true);

    const trackRes = sector.calibrateDualTargetHUDTracking({
      targetOneAngularVelocityDegS: 42,
      targetTwoAngularVelocityDegS: 58,
      dualTrackingLatencyMs: 3.8
    });
    assert.equal(trackRes.dualTargetHUDCalibrated, true);

    const blastRes = sector.dischargeSynchronizedDualPlasmaBlast({
      combinedPlasmaJoules: 28000,
      twinVaporizationConfirmed: true
    });
    assert.equal(blastRes.synchronizedDualPlasmaDischarged, true);
    assert.equal(blastRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): Cuchillo vocal mimicry lure, vest tripmines rigging, acoustic trap disarm & hound exocortex (+450 Honor)', () => {
    const sector = new Predators2010CuchilloBoobyTrapAndExocortexHarvestSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.rigMonofilamentVestTripmines(), /Must broadcast vocal mimicry/);

    const lureRes = sector.broadcastVocalMimicryLure({
      mimicryFidelityScore: 0.98,
      ambientDecibels: 68
    });
    assert.equal(lureRes.vocalMimicryBroadcasted, true);

    const rigRes = sector.rigMonofilamentVestTripmines({
      tripwireTensileGrams: 180,
      fragmentationMineCount: 3
    });
    assert.equal(rigRes.monofilamentTripminesRigged, true);

    const disarmRes = sector.disarmAcousticDecoyTrap({
      frequencyDistortionPercent: 1.2,
      tripwireSeveredCleanly: true
    });
    assert.equal(disarmRes.acousticDistortionDisarmed, true);

    const harvestRes = sector.harvestHoundSpinalExocortex({
      houndNeuralFluidVolumeMl: 180,
      exocortexIntegrationScore: 0.99
    });
    assert.equal(harvestRes.houndExocortexHarvested, true);
    assert.equal(harvestRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): musket volley endure, folding multi-segmented arm shield kinetic absorption, smoke flechettes & Sanctum (+500 Honor)', () => {
    const sector = new Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.deployFoldingArmShield(), /Must endure musket barrage/);

    const musketRes = sector.endureMusketVolley({
      trapperCount: 12,
      leadBallCaliber: 0.58
    });
    assert.equal(musketRes.musketBarrageEndured, true);

    const shieldRes = sector.deployFoldingArmShield({
      kineticAbsorptionJoules: 25000,
      shieldSegmentCount: 6
    });
    assert.equal(shieldRes.foldingShieldDeployed, true);

    const flechetteRes = sector.dischargeFlechettesThroughSmoke({
      flechetteVelocityMs: 240,
      denseSmokePenetrationScore: 0.99
    });
    assert.equal(flechetteRes.smokeFlechettesDischarged, true);

    const sanctumRes = sector.ascendToPrimordialSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 16400,
      companionSyncScore: 0.99,
      primordialGlyph: 'PRIMORDIAL_SUPREME_1987_2025'
    });
    assert.equal(sanctumRes.primordialSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: isYautja: true, HP <= 0, valid arena -> ALLOWED
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: isYautja: false (Human player) -> FORBIDDEN
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: isYautja: true, HP > 0 (Hunter still alive) -> FORBIDDEN
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 40,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: isYautja: true, HP <= 0, wrong config -> FORBIDDEN
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'INVALID_ARENA_CONFIG'
    });
    assert.equal(c4.allowed, false);

    // Attempt arming under invalid condition throws
    assert.throws(() => sector.armDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    }), /Rule 3 Violation/);

    // Valid arming & execution
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterPrimordialSupremeGlyphsSequence({
      glyphs: ['᚛', 'ᚚ', 'ᚑ', 'ᚏ', '᚜']
    });
    assert.equal(glyphRes.primordialGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({
      laughterDecibels: 141,
      mockeryFrequencyHz: 600
    });
    assert.equal(roarRes.finalRoarEchoed, true);

    const purgeRes = sector.executePrimordialSupremeMicroNuclearPurge({
      countdownSeconds: 10.0,
      blastRadiusMeters: 110
    });
    assert.equal(purgeRes.nuclearDetonationExecuted, true);
    assert.equal(purgeRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchisePrimordialSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v228');
    assert.equal(snapshot.pantheon, 'Primordial Suprême Apex (1987-2025)');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.takePositionOnFallenLogBridge({ chasmDepthMeters: 28, logSpanLengthMeters: 18.5 });
    director.sectors.predator1987.executeRitualMacheteChestSlash({ macheteBladeLengthCm: 45, slashIncisionDepthMm: 2.5, defianceVowConfirmed: true });
    director.sectors.predator1987.analyzeFearlessHeartRateTelemetry({ steadyHeartRateBpm: 72, adrenalineStabilityScore: 0.99 });
    director.sectors.predator1987.engageLogBridgeHonorableMelee({ wristBladeExtensionJoules: 4200, closeQuartersClashConfirmed: true });

    director.sectors.predator21990.infiltrateVoodooCulDeSac({ candleCount: 42, puddleWaterDepthCm: 4.5 });
    director.sectors.predator21990.unsheatheCaneSwordDefiance({ bladeLengthCm: 68, skullGripCarvingScore: 0.99 });
    director.sectors.predator21990.detectCloakPuddleRefraction({ refractionVariance: 0.04, puddleRipplesDetected: true });
    director.sectors.predator21990.washAndExtractSpinalSkullTrophy({ decapitationForceNewtons: 6200, trophyWaterWashConfirmed: true });

    director.sectors.avp2004.harvestSlainXenomorphChitin({ carapaceThicknessMm: 14, fleshyTissueDissolvedConfirmed: true });
    director.sectors.avp2004.carveAcidProofHeadDomeShield({ shieldCurvatureRadiusCm: 38, acidResistancePhScore: 0.2 });
    director.sectors.avp2004.forgeTailStingerSpear({ spearShaftLengthMeters: 2.1, stingerBarbSharpnessMohs: 8.5 });
    director.sectors.avp2004.bestowChitinArmamentToLex({ lexCombatPactConfirmed: true, warriorKinshipEstablished: true });

    director.sectors.avpRequiem2007.salvageSecondaryPlasmacaster({ wreckageRadiationLevelRads: 45, casterEnergyCellCapacityJoules: 15000 });
    director.sectors.avpRequiem2007.fuseTwinShoulderHarnessConduits({ powerCouplingVoltage: 480, harnessTensileStrengthNewtons: 7400 });
    director.sectors.avpRequiem2007.calibrateDualTargetHUDTracking({ targetOneAngularVelocityDegS: 42, targetTwoAngularVelocityDegS: 58, dualTrackingLatencyMs: 3.8 });
    director.sectors.avpRequiem2007.dischargeSynchronizedDualPlasmaBlast({ combinedPlasmaJoules: 28000, twinVaporizationConfirmed: true });

    director.sectors.predators2010.broadcastVocalMimicryLure({ mimicryFidelityScore: 0.98, ambientDecibels: 68 });
    director.sectors.predators2010.rigMonofilamentVestTripmines({ tripwireTensileGrams: 180, fragmentationMineCount: 3 });
    director.sectors.predators2010.disarmAcousticDecoyTrap({ frequencyDistortionPercent: 1.2, tripwireSeveredCleanly: true });
    director.sectors.predators2010.harvestHoundSpinalExocortex({ houndNeuralFluidVolumeMl: 180, exocortexIntegrationScore: 0.99 });

    director.sectors.prey2022.endureMusketVolley({ trapperCount: 12, leadBallCaliber: 0.58 });
    director.sectors.prey2022.deployFoldingArmShield({ kineticAbsorptionJoules: 25000, shieldSegmentCount: 6 });
    director.sectors.prey2022.dischargeFlechettesThroughSmoke({ flechetteVelocityMs: 240, denseSmokePenetrationScore: 0.99 });
    director.sectors.prey2022.ascendToPrimordialSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 16400,
      companionSyncScore: 0.99,
      primordialGlyph: 'PRIMORDIAL_SUPREME_1987_2025'
    });

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_PRIMORDIAL_SUPREME_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterPrimordialSupremeGlyphsSequence({ glyphs: ['᚛', 'ᚚ', 'ᚑ', 'ᚏ', '᚜'] });
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar({ laughterDecibels: 141, mockeryFrequencyHz: 600 });
    director.sectors.defeatProtocol.executePrimordialSupremeMicroNuclearPurge({ countdownSeconds: 10.0, blastRadiusMeters: 110 });

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchisePrimordialSupremeApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.version, 'v228');
    assert.equal(results.allSectorsCompleted, true);
    assert.equal(results.totalHonorAwarded, 3000);
    assert.equal(results.maxHonorPossible, 3000);
    assert.equal(results.rule3Compliant, true);
    assert.equal(results.rule3Validation.case1_validYautjaLossConfig, true);
    assert.equal(results.rule3Validation.case2_humanForbidden, true);
    assert.equal(results.rule3Validation.case3_aliveHunterForbidden, true);
    assert.equal(results.rule3Validation.case4_wrongArenaConfigForbidden, true);
    assert.equal(results.webglBudget.drawCalls <= 300, true);
    assert.equal(results.webglBudget.audioLatencyCompliant, true);
    assert.equal(results.isFullyCertified, true);
  });

  it('10. AudioSynthesizer: Primordial Suprême acoustic models & SFX synthesized', () => {
    const billyAcoustics = audioSynth.computePrimordialBillyDefianceAcoustics({
      steadyHeartRateBpm: 72,
      wristBladeExtensionJoules: 4200
    });
    assert.equal(billyAcoustics.steadyHeartRateBpm, 72);
    assert.equal(billyAcoustics.wristBladeExtensionJoules, 4200);
    assert.equal(typeof billyAcoustics.heartThumpPulseHz, 'number');
    assert.equal(typeof billyAcoustics.bladeExtensionHissDb, 'number');

    const dualCasterAcoustics = audioSynth.computePrimordialDualCasterAcoustics({
      combinedPlasmaJoules: 28000,
      dualTrackingLatencyMs: 3.8
    });
    assert.equal(dualCasterAcoustics.combinedPlasmaJoules, 28000);
    assert.equal(dualCasterAcoustics.dualTrackingLatencyMs, 3.8);
    assert.equal(typeof dualCasterAcoustics.dualPlasmaResonanceHz, 'number');
    assert.equal(typeof dualCasterAcoustics.targetingServoWhineDb, 'number');

    const sfxMethods = [
      'playPredator1987PrimordialBillyMacheteSlashSFX',
      'playPredator1987PrimordialLogBridgeClashSFX',
      'playPredator21990PrimordialKingWillieCaneSwordSFX',
      'playPredator21990PrimordialPuddleWashedSkullSFX',
      'playAvp2004PrimordialChitinShieldDeflectSFX',
      'playAvp2004PrimordialTailSpearStabSFX',
      'playAvpRequiem2007PrimordialTwinCasterHumSFX',
      'playAvpRequiem2007PrimordialTwinConvergentPlasmaSFX',
      'playPredators2010PrimordialCuchilloMimicryStaticSFX',
      'playPredators2010PrimordialHoundExocortexHarvestSFX',
      'playPrey2022PrimordialFoldingShieldDeploySFX',
      'playPrey2022PrimordialSmokeFlechetteDischargeSFX',
      'playPredatorFranchisePrimordialSupremeApexNuclearPurgeSFX',
      'playPredatorFranchisePrimordialSupremeVictoryAnthemSFX',
      'playPredatorFranchisePrimordialSupremeSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
