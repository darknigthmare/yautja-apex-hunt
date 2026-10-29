import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MaskRemovalPrimalMeleeSector } from '../src/gameplay/Predator1987MaskRemovalPrimalMeleeSector.js';
import { Predator21990PenthouseRaidAndFlayedCeilingSector } from '../src/gameplay/Predator21990PenthouseRaidAndFlayedCeilingSector.js';
import { Avp2004ChopperCelticStairsGrappleSector } from '../src/gameplay/Avp2004ChopperCelticStairsGrappleSector.js';
import { AvpRequiem2007CemeteryMortuaryLaserMeshSector } from '../src/gameplay/AvpRequiem2007CemeteryMortuaryLaserMeshSector.js';
import { Predators2010TrackerHoundFlushAndLabEscapeSector } from '../src/gameplay/Predators2010TrackerHoundFlushAndLabEscapeSector.js';
import { Prey2022LaserGuidedBoltAndEternelSanctumSector } from '../src/gameplay/Prey2022LaserGuidedBoltAndEternelSanctumSector.js';
import { PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseEternelSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseEternelSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseEternelSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseEternelSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v229 - Predator Franchise Éternel Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): bio-mask depressurization, mandible snarl, plasma caster disarm & primal melee throw (+350 Honor)', () => {
    const sector = new Predator1987MaskRemovalPrimalMeleeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.flareMandiblesInPrimalSnarl(), /Must depressurize bio-mask/);

    const depressRes = sector.depressurizeBioMaskHoses({
      depressurizationHissBars: 4.2,
      hoseSealDisengaged: true
    });
    assert.equal(depressRes.maskPneumaticsDepressurized, true);

    const snarlRes = sector.flareMandiblesInPrimalSnarl({
      mandibleSpanCm: 24,
      clickingSnarlDecibels: 115
    });
    assert.equal(snarlRes.mandibleSnarlRoared, true);

    const disarmRes = sector.disarmPlasmaCasterForHonorableDuel({
      casterDecoupledFromHarness: true,
      unarmedHonorableChallengeIssued: true
    });
    assert.equal(disarmRes.plasmaCasterDisarmedForDuel, true);

    const throwRes = sector.executePrimalMeleeThrow({
      punchKineticJoules: 7800,
      treeImpactDistanceMeters: 6.5
    });
    assert.equal(throwRes.primalMeleeBrawlExecuted, true);
    assert.equal(throwRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): penthouse terrace glass breach, combistick enforcer spearing, drywall ricochets & suspended flayed prey (+400 Honor)', () => {
    const sector = new Predator21990PenthouseRaidAndFlayedCeilingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.spearEnforcerWithCombistick(), /Must breach penthouse glass/);

    const breachRes = sector.breachPenthouseTerraceGlass({
      glassImpactVelocityMs: 18,
      shatteredPanelCount: 3
    });
    assert.equal(breachRes.penthouseGlassBreached, true);

    const spearRes = sector.spearEnforcerWithCombistick({
      throwVelocityMs: 62,
      concretePillarPenetrationDepthCm: 12
    });
    assert.equal(spearRes.combistickEnforcerSpeared, true);

    const ricochetRes = sector.executeSmartDiscDrywallRicochets({
      ricochetPointCount: 4,
      drywallSeveranceConfirmed: true
    });
    assert.equal(ricochetRes.smartDiscRicochetsExecuted, true);

    const suspendRes = sector.suspendFlayedCartelFromCeiling({
      ceilingGirderHeightMeters: 5.2,
      ritualFlayingConfirmed: true
    });
    assert.equal(suspendRes.flayedCeilingSuspensionCompleted, true);
    assert.equal(suspendRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): Chopper stairway vigil, Grid Alien tail ambush, Celtic stairway tackle & granite balustrade shatter (+400 Honor)', () => {
    const sector = new Avp2004ChopperCelticStairsGrappleSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.endureGridAlienTailAmbush(), /Must establish stairway vigil/);

    const vigilRes = sector.establishStairwayVigil({
      stairStepCount: 45,
      pyramidElevationMeters: 24
    });
    assert.equal(vigilRes.chopperStairwayVigilEstablished, true);

    const ambushRes = sector.endureGridAlienTailAmbush({
      tailImpalementForceNewtons: 9200,
      verticalLiftElevationMeters: 2.4
    });
    assert.equal(ambushRes.gridAlienTailAmbushExecuted, true);

    const tackleRes = sector.engageCelticStairwayTackle({
      tackleMomentumKgmS: 2200,
      stairwayDescentSteps: 18
    });
    assert.equal(tackleRes.celticStairwayTackleEngaged, true);

    const shatterRes = sector.shatterStoneBalustradeInHeavyGrapple({
      grappleImpactJoules: 11500,
      graniteBalustradeDestroyed: true
    });
    assert.equal(shatterRes.stoneBalustradeGrappleShattered, true);
    assert.equal(shatterRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): mortuary basement trail tracking, blue solvent cleanse, laser mesh grid & plasma pistol burner (+400 Honor)', () => {
    const sector = new AvpRequiem2007CemeteryMortuaryLaserMeshSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.applyCorrosiveBlueSolventCleanse(), /Must track mortuary trail/);

    const trackRes = sector.trackMortuaryEmbryoTrail({
      impregnationScentDistanceMeters: 48,
      cemeteryMistDensityScore: 0.92
    });
    assert.equal(trackRes.mortuaryBasementTracked, true);

    const solventRes = sector.applyCorrosiveBlueSolventCleanse({
      solventVialVolumeMl: 250,
      biologicalDissolutionPh: 0.05
    });
    assert.equal(solventRes.corrosiveSolventApplied, true);

    const gridRes = sector.deployLaserMeshPerimeterGrid({
      laserEmittersCount: 6,
      gridCoverageSquareMeters: 36
    });
    assert.equal(gridRes.laserMeshGridDeployed, true);

    const burnerRes = sector.dischargeHandheldPlasmaPistolBurner({
      plasmaBoltTemperatureCelsius: 3800,
      cleanseVaporizationConfirmed: true
    });
    assert.equal(burnerRes.plasmaPistolBurnerDischarged, true);
    assert.equal(burnerRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): hound whistle pincer flush, hound bullet absorption, surgical restraints shatter & lab breakout (+450 Honor)', () => {
    const sector = new Predators2010TrackerHoundFlushAndLabEscapeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.observeHoundArmorBulletAbsorption(), /Must command hound pincer/);

    const pincerRes = sector.commandHoundWhistlePincer({
      whistleFrequencyKhz: 24.5,
      packFlankSpeedMs: 18.2
    });
    assert.equal(pincerRes.houndWhistlePincerCommanded, true);

    const bulletRes = sector.observeHoundArmorBulletAbsorption({
      carapaceHardnessHrc: 68,
      bulletImpactJoulesDeflected: 3200
    });
    assert.equal(bulletRes.houndArmorBulletAbsorptionObserved, true);

    const shatterRes = sector.shatterSurgicalRestraints({
      burstBreakoutForceNewtons: 8400,
      anestheticMetabolicPurgeScore: 0.99
    });
    assert.equal(shatterRes.surgicalRestraintsShattered, true);

    const breakoutRes = sector.breachCleanroomContainmentFacility({
      containmentGlassBlastJoules: 9600,
      labEscapeConfirmed: true
    });
    assert.equal(breakoutRes.cleanroomContainmentBreached, true);
    assert.equal(breakoutRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): tri-laser homing vector lock, homing bolt trajectory, mid-air tomahawk crush & Éternel Sanctum (+500 Honor)', () => {
    const sector = new Prey2022LaserGuidedBoltAndEternelSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.launchHomingAerodynamicBolt(), /Must lock tri-laser targeting vector/);

    const lockRes = sector.lockTriLaserTargetingVector({
      targetLockRangeMeters: 55,
      lockAcquisitionTimeMs: 280
    });
    assert.equal(lockRes.triLaserTargetLocked, true);

    const boltRes = sector.launchHomingAerodynamicBolt({
      boltVelocityMs: 185,
      vectorCurvatureDegrees: 48
    });
    assert.equal(boltRes.homingBoltTrajectoryCorrected, true);

    const crushRes = sector.interceptAndCrushFlyingTomahawk({
      tomahawkIncomingVelocityMs: 32,
      gripCrushForceNewtons: 4500
    });
    assert.equal(crushRes.midAirTomahawkCrushed, true);

    const sanctumRes = sector.ascendToEternelSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 17200,
      companionSyncScore: 0.99,
      eternelGlyph: 'ETERNEL_SUPREME_1987_2025'
    });
    assert.equal(sanctumRes.eternelSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: isYautja: true, HP <= 0, valid arena -> ALLOWED
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: isYautja: false (Human player) -> FORBIDDEN
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: isYautja: true, HP > 0 (Hunter still alive) -> FORBIDDEN
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 50,
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
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
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
    }), /Rule 3 Violation/);

    // Valid arming & execution
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterEternelSupremeGlyphsSequence({
      glyphs: ['᚛', 'ᚏ', 'ᚑ', 'ᚏ', '᚜']
    });
    assert.equal(glyphRes.eternelGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({
      laughterDecibels: 142,
      mockeryFrequencyHz: 610
    });
    assert.equal(roarRes.finalRoarEchoed, true);

    const purgeRes = sector.executeEternelSupremeMicroNuclearPurge({
      countdownSeconds: 9.5,
      blastRadiusMeters: 115
    });
    assert.equal(purgeRes.nuclearDetonationExecuted, true);
    assert.equal(purgeRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchiseEternelSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v229');
    assert.equal(snapshot.pantheon, 'Éternel Suprême Apex (1987-2025)');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.depressurizeBioMaskHoses({ depressurizationHissBars: 4.2, hoseSealDisengaged: true });
    director.sectors.predator1987.flareMandiblesInPrimalSnarl({ mandibleSpanCm: 24, clickingSnarlDecibels: 115 });
    director.sectors.predator1987.disarmPlasmaCasterForHonorableDuel({ casterDecoupledFromHarness: true, unarmedHonorableChallengeIssued: true });
    director.sectors.predator1987.executePrimalMeleeThrow({ punchKineticJoules: 7800, treeImpactDistanceMeters: 6.5 });

    director.sectors.predator21990.breachPenthouseTerraceGlass({ glassImpactVelocityMs: 18, shatteredPanelCount: 3 });
    director.sectors.predator21990.spearEnforcerWithCombistick({ throwVelocityMs: 62, concretePillarPenetrationDepthCm: 12 });
    director.sectors.predator21990.executeSmartDiscDrywallRicochets({ ricochetPointCount: 4, drywallSeveranceConfirmed: true });
    director.sectors.predator21990.suspendFlayedCartelFromCeiling({ ceilingGirderHeightMeters: 5.2, ritualFlayingConfirmed: true });

    director.sectors.avp2004.establishStairwayVigil({ stairStepCount: 45, pyramidElevationMeters: 24 });
    director.sectors.avp2004.endureGridAlienTailAmbush({ tailImpalementForceNewtons: 9200, verticalLiftElevationMeters: 2.4 });
    director.sectors.avp2004.engageCelticStairwayTackle({ tackleMomentumKgmS: 2200, stairwayDescentSteps: 18 });
    director.sectors.avp2004.shatterStoneBalustradeInHeavyGrapple({ grappleImpactJoules: 11500, graniteBalustradeDestroyed: true });

    director.sectors.avpRequiem2007.trackMortuaryEmbryoTrail({ impregnationScentDistanceMeters: 48, cemeteryMistDensityScore: 0.92 });
    director.sectors.avpRequiem2007.applyCorrosiveBlueSolventCleanse({ solventVialVolumeMl: 250, biologicalDissolutionPh: 0.05 });
    director.sectors.avpRequiem2007.deployLaserMeshPerimeterGrid({ laserEmittersCount: 6, gridCoverageSquareMeters: 36 });
    director.sectors.avpRequiem2007.dischargeHandheldPlasmaPistolBurner({ plasmaBoltTemperatureCelsius: 3800, cleanseVaporizationConfirmed: true });

    director.sectors.predators2010.commandHoundWhistlePincer({ whistleFrequencyKhz: 24.5, packFlankSpeedMs: 18.2 });
    director.sectors.predators2010.observeHoundArmorBulletAbsorption({ carapaceHardnessHrc: 68, bulletImpactJoulesDeflected: 3200 });
    director.sectors.predators2010.shatterSurgicalRestraints({ burstBreakoutForceNewtons: 8400, anestheticMetabolicPurgeScore: 0.99 });
    director.sectors.predators2010.breachCleanroomContainmentFacility({ containmentGlassBlastJoules: 9600, labEscapeConfirmed: true });

    director.sectors.prey2022.lockTriLaserTargetingVector({ targetLockRangeMeters: 55, lockAcquisitionTimeMs: 280 });
    director.sectors.prey2022.launchHomingAerodynamicBolt({ boltVelocityMs: 185, vectorCurvatureDegrees: 48 });
    director.sectors.prey2022.interceptAndCrushFlyingTomahawk({ tomahawkIncomingVelocityMs: 32, gripCrushForceNewtons: 4500 });
    director.sectors.prey2022.ascendToEternelSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 17200,
      companionSyncScore: 0.99,
      eternelGlyph: 'ETERNEL_SUPREME_1987_2025'
    });

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_ETERNEL_SUPREME_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterEternelSupremeGlyphsSequence({ glyphs: ['᚛', 'ᚏ', 'ᚑ', 'ᚏ', '᚜'] });
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar({ laughterDecibels: 142, mockeryFrequencyHz: 610 });
    director.sectors.defeatProtocol.executeEternelSupremeMicroNuclearPurge({ countdownSeconds: 9.5, blastRadiusMeters: 115 });

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseEternelSupremeApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.version, 'v229');
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

  it('10. AudioSynthesizer: Éternel Suprême acoustic models & SFX synthesized', () => {
    const maskAcoustics = audioSynth.computeEternelMaskDepressurizationAcoustics({
      depressurizationHissBars: 4.2,
      mandibleSpanCm: 24
    });
    assert.equal(maskAcoustics.depressurizationHissBars, 4.2);
    assert.equal(maskAcoustics.mandibleSpanCm, 24);
    assert.equal(typeof maskAcoustics.pneumaticHissWhistleHz, 'number');
    assert.equal(typeof maskAcoustics.mandibleSnarlDecibels, 'number');

    const homingAcoustics = audioSynth.computeEternelLaserHomingAcoustics({
      lockAcquisitionTimeMs: 280,
      vectorCurvatureDegrees: 48
    });
    assert.equal(homingAcoustics.lockAcquisitionTimeMs, 280);
    assert.equal(homingAcoustics.vectorCurvatureDegrees, 48);
    assert.equal(typeof homingAcoustics.targetingBeepToneHz, 'number');
    assert.equal(typeof homingAcoustics.homingThrusterWhistleDb, 'number');

    const sfxMethods = [
      'playPredator1987EternelMaskPneumaticHissSFX',
      'playPredator1987EternelPrimalMandibleRoarSFX',
      'playPredator21990EternelPenthouseGlassBreachSFX',
      'playPredator21990EternelFlayedGirderSuspensionSFX',
      'playAvp2004EternelChopperTailImpalementSFX',
      'playAvp2004EternelCelticStairwayBalustradeShatterSFX',
      'playAvpRequiem2007EternelMortuarySolventCleanseSFX',
      'playAvpRequiem2007EternelHandheldPlasmaBurnerSFX',
      'playPredators2010EternelHoundWhistlePincerSFX',
      'playPredators2010EternelStargazerLabBreakoutSFX',
      'playPrey2022EternelLaserGuidedBoltLaunchSFX',
      'playPrey2022EternelMidAirTomahawkCrushSFX',
      'playPredatorFranchiseEternelSupremeApexNuclearPurgeSFX',
      'playPredatorFranchiseEternelSupremeVictoryAnthemSFX',
      'playPredatorFranchiseEternelSupremeSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
