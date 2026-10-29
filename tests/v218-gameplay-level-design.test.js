import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987RiverMudSubmersionAndReedBreathingSector } from '../src/gameplay/Predator1987RiverMudSubmersionAndReedBreathingSector.js';
import { Predator21990SubwayStrobeMassacreAndJerryStandoffSector } from '../src/gameplay/Predator21990SubwayStrobeMassacreAndJerryStandoffSector.js';
import { Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector } from '../src/gameplay/Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector.js';
import { AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector } from '../src/gameplay/AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector.js';
import { Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector } from '../src/gameplay/Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector.js';
import { Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector } from '../src/gameplay/Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector.js';
import { PredatorFranchiseStellaireApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseStellaireApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseStellaireApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseStellaireApexHUDDirector.js';
import { HumanQaPredatorFranchiseStellaireApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseStellaireApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v218 - Predator Franchise Stellaire Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): clay mud coat, reed breathing submersion, overhead log scan & thermal masking (+350 Honor)', () => {
    const sector = new Predator1987RiverMudSubmersionAndReedBreathingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.submergeUnderWaterlineWithHollowReed(), /Must apply cold clay mud coat/);

    const mudRes = sector.applyColdRiverClayMudCoat({ mudLayerThicknessMm: 14, clayTemperatureCelsius: 18.2 });
    assert.equal(mudRes.clayMudCoatApplied, true);

    const subRes = sector.submergeUnderWaterlineWithHollowReed({ reedLengthCm: 32, submersionDepthMeters: 0.85 });
    assert.equal(subRes.hollowReedBreathingSecured, true);

    const scanRes = sector.endureOverheadLogHunterScan({ hunterScanDurationSeconds: 18, hunterDistanceMeters: 1.8 });
    assert.equal(scanRes.overheadLogScanEndured, true);

    const maskRes = sector.confirmThermalMaskingContrast({ bodyHeatDissipationDeltaCelsius: 0.4, infraredContrastLux: 0 });
    assert.equal(maskRes.thermalMaskingConfirmed, true);
    assert.equal(maskRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): strobe blackout, roof cut breach, Jerry distraction fire & heroic stand (+400 Honor)', () => {
    const sector = new Predator21990SubwayStrobeMassacreAndJerryStandoffSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.breachCarriageRoofWithSmartDisc(), /Must trigger strobe blackout/);

    const strobeRes = sector.triggerSubwayStrobeFlickerBlackout({ strobeFrequencyHz: 8.2, tunnelDarknessLux: 1.5 });
    assert.equal(strobeRes.strobeLightBlackoutTriggered, true);

    const breachRes = sector.breachCarriageRoofWithSmartDisc({ roofSheetSteelThicknessMm: 3.5, roofBreachSpeedSeconds: 2.8 });
    assert.equal(breachRes.carriageRoofCutBreached, true);

    const fireRes = sector.dischargeJerryDesertEagleDistraction({ magRoundsFired: 8, civilianEvacuationWindowSeconds: 12 });
    assert.equal(fireRes.jerryDistractionFireDischarged, true);

    const standRes = sector.honorJerryHeroicLastStand({ macheteParryAttempted: true, warriorValianceScore: 0.98 });
    assert.equal(standRes.heroicStandHonored, true);
    assert.equal(standRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): matriarch chamber, thermal thaw injectors, pedestal bomb timer & shaft sled ascent (+400 Honor)', () => {
    const sector = new Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.triggerThermalThawInjectors(), /Must reach matriarch chamber/);

    const chamberRes = sector.enterChainedMatriarchChamber({ chamberDepthMeters: 610, chainTensileStrengthKpa: 8500 });
    assert.equal(chamberRes.matriarchChamberReached, true);

    const thawRes = sector.triggerThermalThawInjectors({ fluidTempCelsius: 165, carapaceThawRateMmPerMin: 24 });
    assert.equal(thawRes.thermalThawInjectorsTriggered, true);

    const bombRes = sector.armPedestalGauntletBombTimer({ countdownSeconds: 240, yieldKilotonEquivalent: 2.4 });
    assert.equal(bombRes.pedestalBombTimerArmed, true);

    const sledRes = sector.executeShaftWinchSledAscent({ ascentSpeedMs: 28, shaftVerticalMeters: 610 });
    assert.equal(sledRes.shaftSledAscentCompleted, true);
    assert.equal(sledRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): triangular laser nodes, frequency sync, xeno bisection & power grid brawl (+400 Honor)', () => {
    const sector = new AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.synchronizeGridLaserFrequency(), /Must place 3 emitter nodes/);

    const nodeRes = sector.deployTriangularLaserNodes({ emitterNodeCount: 3, perimeterEnclosureAreaM2: 45 });
    assert.equal(nodeRes.laserTripwireNodesPlaced, true);

    const syncRes = sector.synchronizeGridLaserFrequency({ laserFrequencyThz: 680, beamCuttingJoules: 7500 });
    assert.equal(syncRes.gridFrequencySynchronized, true);

    const bisectRes = sector.lureAndBisectChargingXenomorphs({ chargingDronesCount: 4, bisectionCleanlinessPercent: 99 });
    assert.equal(bisectRes.xenomorphDronesBisectedCount >= 3, true);

    const brawlRes = sector.engagePowerGridTurbineBrawl({ generatorVoltageKv: 13.8, arcDischargeJoules: 11200 });
    assert.equal(brawlRes.powerGridBrawlCompleted, true);
    assert.equal(brawlRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): cliff leap, water impact, cavern bottleneck & alpha hound (+450 Honor)', () => {
    const sector = new Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.surviveRiverBasinWaterImpact(), /Must execute cliff leap/);

    const leapRes = sector.executeWaterfallCliffLeap({ fallHeightMeters: 62, freefallTimeSeconds: 3.5 });
    assert.equal(leapRes.waterfallCliffLeapExecuted, true);

    const impactRes = sector.surviveRiverBasinWaterImpact({ waterEntryVelocityMs: 34, impactDepthMeters: 4.8 });
    assert.equal(impactRes.riverBasinImpactSurvived, true);

    const chokeRes = sector.channelHoundsIntoCavernBottleneck({ bottleneckWidthMeters: 2.4, houndsTrappedInChoke: 5 });
    assert.equal(chokeRes.houndBottleneckChokePointFormed, true);

    const alphaRes = sector.neutralizeAlphaTrackerHound({ leadSlugImpactJoules: 3800, headshotConfirmed: true });
    assert.equal(alphaRes.alphaHoundNeutralized, true);
    assert.equal(alphaRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): expanding net snare, wire contraction, bone mask telemetry & Stellaire Sanctum (+500 Honor)', () => {
    const sector = new Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.contractWireWithKineticTension(), /Must fire net snare/);

    const netRes = sector.fireExpandingRazorNetSnare({ snareFlightVelocityMs: 38, expandingNetDiameterM: 2.6 });
    assert.equal(netRes.expandingNetSnareFired, true);

    const wireRes = sector.contractWireWithKineticTension({ wireTensileStrengthMpa: 1420, constrictionForceNewtons: 4600 });
    assert.equal(wireRes.wireContractionLethal, true);

    const teleRes = sector.decipherBoneMaskLaserTelemetry({ triLaserConvergenceAngleDegrees: 14.5, boltHomingAccuracyScore: 0.98 });
    assert.equal(teleRes.boneMaskTelemetryDeciphered, true);

    const sanctumRes = sector.consecrateStellaireApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 9500,
      synthSyncIndex: 0.99,
      stellaireSealGlyph: 'STELLAIRE_1987_2025'
    });
    assert.equal(sanctumRes.stellaireApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Stellaire Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseStellaireApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 75,
      arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_STELLAIRE_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterStellaireGlyphsSequence({ glyphs: ['᚛', 'ᚆ', 'ᚓ', 'ᚎ', '᚜'] });
    assert.equal(glyphRes.stellaireGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 128, mockeryFrequencyHz: 480 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeStellaireMicroNuclearPurge({ countdownSeconds: 15, blastRadiusMeters: 65 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Stellaire Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseStellaireApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all sectors
    director.sectors.predator1987.applyColdRiverClayMudCoat();
    director.sectors.predator1987.submergeUnderWaterlineWithHollowReed();
    director.sectors.predator1987.endureOverheadLogHunterScan();
    director.sectors.predator1987.confirmThermalMaskingContrast();

    director.sectors.predator21990.triggerSubwayStrobeFlickerBlackout();
    director.sectors.predator21990.breachCarriageRoofWithSmartDisc();
    director.sectors.predator21990.dischargeJerryDesertEagleDistraction();
    director.sectors.predator21990.honorJerryHeroicLastStand();

    director.sectors.avp2004.enterChainedMatriarchChamber();
    director.sectors.avp2004.triggerThermalThawInjectors();
    director.sectors.avp2004.armPedestalGauntletBombTimer();
    director.sectors.avp2004.executeShaftWinchSledAscent();

    director.sectors.avpRequiem2007.deployTriangularLaserNodes();
    director.sectors.avpRequiem2007.synchronizeGridLaserFrequency();
    director.sectors.avpRequiem2007.lureAndBisectChargingXenomorphs();
    director.sectors.avpRequiem2007.engagePowerGridTurbineBrawl();

    director.sectors.predators2010.executeWaterfallCliffLeap();
    director.sectors.predators2010.surviveRiverBasinWaterImpact();
    director.sectors.predators2010.channelHoundsIntoCavernBottleneck();
    director.sectors.predators2010.neutralizeAlphaTrackerHound();

    director.sectors.prey2022.fireExpandingRazorNetSnare();
    director.sectors.prey2022.contractWireWithKineticTension();
    director.sectors.prey2022.decipherBoneMaskLaserTelemetry();
    director.sectors.prey2022.consecrateStellaireApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_STELLAIRE_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterStellaireGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeStellaireMicroNuclearPurge();

    const finalSnap = director.getTelemetrySnapshot();
    assert.equal(finalSnap.totalHonor, 3000);
    assert.equal(finalSnap.allCompleted, true);

    // Mock DOM test
    const mockContainer = {
      appendChild: (node) => { mockContainer.child = node; },
      child: null
    };
    const panel = director.render(mockContainer);
    assert.ok(panel);
    assert.equal(panel.className, 'predator-franchise-v218-stellaire-apex-hud-panel');

    director.destroy();
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (128 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseStellaireApexMasterAuditor();
    const result = auditor.runFullAuditSuite();

    assert.equal(result.version, 'v218');
    assert.equal(result.totalHonor, 3000);
    assert.equal(result.allSectorsComplete, true);
    assert.equal(result.rule3TruthTablePassed, true);
    assert.equal(result.drawCallsBudgetMet, true);
    assert.ok(result.estimatedDrawCalls <= 300);
  });

  it('10. AudioSynthesizer: river submersion acoustics, laser grid acoustics and 15 v218 SFX triggers', () => {
    const riverAcoustics = audioSynth.computeStellaireRiverSubmersionAcoustics({ mudThicknessMm: 14, submersionDepthMeters: 0.85 });
    assert.ok(riverAcoustics.aquaticMuffleFactor > 0);
    assert.ok(riverAcoustics.mudSquishFrequencyHz > 0);

    const laserAcoustics = audioSynth.computeStellaireLaserGridResonanceAcoustics({ laserFrequencyThz: 680, emitterNodeCount: 3 });
    assert.ok(laserAcoustics.nodeHarmonicResonanceHz > 0);
    assert.ok(laserAcoustics.beamIonizationDecibels > 0);

    // Trigger all 15 SFX safely without unhandled errors
    assert.doesNotThrow(() => {
      audioSynth.playPredator1987StellaireRiverClaySquishSFX();
      audioSynth.playPredator1987StellaireHollowReedBubblesSFX();
      audioSynth.playPredator21990StellaireSubwayStrobeHumSFX();
      audioSynth.playPredator21990StellaireJerryDesertEagleVolleySFX();
      audioSynth.playPredator21990StellaireCarriageRoofShearSFX();
      audioSynth.playAvp2004StellaireMatriarchChainRattleSFX();
      audioSynth.playAvp2004StellaireThermalInjectorThawHissSFX();
      audioSynth.playAvp2004StellaireWinchSledRocketAscentSFX();
      audioSynth.playAvpRequiem2007StellaireTriangularLaserHumSFX();
      audioSynth.playAvpRequiem2007StellaireLaserGridBisectionSFX();
      audioSynth.playAvpRequiem2007StellairePowerGridArcFlashSFX();
      audioSynth.playPredators2010StellaireWaterfallChasmPlungeSFX();
      audioSynth.playPredators2010StellaireAlphaHoundSnarlClashSFX();
      audioSynth.playPrey2022StellaireExpandingNetSnareWhirSFX();
      audioSynth.playPredatorFranchiseStellaireApexNuclearPurgeSFX();
    });
  });
});
