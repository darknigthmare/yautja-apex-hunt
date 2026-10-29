import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ThermalWaterDispersionAndMudReflectionSector } from '../src/gameplay/Predator1987ThermalWaterDispersionAndMudReflectionSector.js';
import { Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector } from '../src/gameplay/Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector.js';
import { Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector } from '../src/gameplay/Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector.js';
import { AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector } from '../src/gameplay/AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector.js';
import { Predators2010HanzoKatanaMoonlitDuelAndShurikenSector } from '../src/gameplay/Predators2010HanzoKatanaMoonlitDuelAndShurikenSector.js';
import { Prey2022BeaverDamTrapAndInfiniApexSanctumSector } from '../src/gameplay/Prey2022BeaverDamTrapAndInfiniApexSanctumSector.js';
import { PredatorFranchiseInfiniApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseInfiniApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseInfiniApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseInfiniApexHUDDirector.js';
import { HumanQaPredatorFranchiseInfiniApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseInfiniApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v220 - Predator Franchise Infini Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): riverbank mud crawl, camo water dielectric spark & thermal standoff (+350 Honor)', () => {
    const sector = new Predator1987ThermalWaterDispersionAndMudReflectionSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.triggerOpticCamoWaterSparkInterference(), /Must complete riverbank crawl/);

    const crawlRes = sector.crawlOntoRiverbankInRainstorm({
      crawlDistanceMeters: 8.5,
      rainfallRateMmPerHour: 48
    });
    assert.equal(crawlRes.riverbankMudCrawlCompleted, true);

    const sparkRes = sector.triggerOpticCamoWaterSparkInterference({
      waterConductivityUsm: 280,
      camoSparkFrequencyHz: 14.5
    });
    assert.equal(sparkRes.opticCamoWaterSparkTriggered, true);

    const deltaRes = sector.verifyThermalDeltaNeutralization({
      skinTempCelsius: 21.0,
      foliageTempCelsius: 21.0
    });
    assert.equal(deltaRes.thermalDeltaNeutralized, true);

    const standRes = sector.endureBreathlessHunterStandoff({
      hunterProximityMeters: 0.45,
      holdBreathDurationSeconds: 24
    });
    assert.equal(standRes.breathlessStandoffEndured, true);
    assert.equal(standRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): meat locker nitrogen spray, UV shift, rail drop & carcass cleave (+400 Honor)', () => {
    const sector = new Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.shiftMaskVisionToUltraviolet(), /Must activate liquid nitrogen/);

    const sprayRes = sector.activateLiquidNitrogenSprayers({
      sprayTempCelsius: -196,
      ambientFreezerTempCelsius: -25
    });
    assert.equal(sprayRes.liquidNitrogenSprayersActivated, true);

    const uvRes = sector.shiftMaskVisionToUltraviolet({
      uvWavelengthNm: 380,
      dustParticleScatterDetected: true
    });
    assert.equal(uvRes.uvVisionShiftCompleted, true);

    const leapRes = sector.executeMeatHookCeilingLeap({
      railHeightMeters: 5.2,
      dropVelocityMs: 12.5
    });
    assert.equal(leapRes.meatHookCeilingLeapExecuted, true);

    const cleaveRes = sector.cleaveFrozenCarcassesWithSmartDisc({
      discThrowJoules: 4200,
      carcassesCleaved: 3
    });
    assert.equal(cleaveRes.smartDiscCarcassCleaveExecuted, true);
    assert.equal(cleaveRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): Bouvetøya sub-zero blizzard, shaft defense, Celtic plasma shield & cauldron slam (+400 Honor)', () => {
    const sector = new Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.secureWhalingStationShaftHead(), /Must endure Bouvet/);

    const blizRes = sector.endureBouvetoyaSubZeroBlizzard({
      surfaceTempCelsius: -35,
      galeWindKnots: 45
    });
    assert.equal(blizRes.blizzardGaleEndured, true);

    const shaftRes = sector.secureWhalingStationShaftHead({
      mercenariesNeutralized: 5,
      shaftWinchIntact: true
    });
    assert.equal(shaftRes.whalingStationShaftSecured, true);

    const shieldRes = sector.activateCelticPlasmaShieldMesh({
      shieldDeflectionJoules: 6500,
      iceBreachDetected: true
    });
    assert.equal(shieldRes.plasmaShieldMeshActivated, true);

    const slamRes = sector.slamGridAlienAgainstIronCauldron({
      grappleImpactForceNewtons: 7800,
      acidSplatterDeflected: true
    });
    assert.equal(slamRes.ironCauldronSlamCompleted, true);
    assert.equal(slamRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): cemetery trench storm, luminescent spoor, tail whip & drone bisection (+400 Honor)', () => {
    const sector = new AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.trackLuminescentXenoSpoor(), /Must navigate cemetery trench/);

    const trenchRes = sector.navigateCemeteryMudTrenchInThunderstorm({
      trenchDepthMeters: 2.2,
      stormRainfallMmPerHour: 72
    });
    assert.equal(trenchRes.cemeteryMudTrenchNavigated, true);

    const spoorRes = sector.trackLuminescentXenoSpoor({
      spoorLuminescenceLux: 18.5,
      trailIntegrityPercent: 95
    });
    assert.equal(spoorRes.luminescentSpoorTracked, true);

    const whipRes = sector.uncoilSegmentedBarbedTailWhip({
      vertebraeSegmentCount: 28,
      tensileStrengthNewtons: 12500
    });
    assert.equal(whipRes.barbedTailWhipUncoiled, true);

    const bisectRes = sector.executeMidAirDroneBisection({
      droneLungeVelocityMs: 32,
      whipSliceCleanlinessPercent: 100
    });
    assert.equal(bisectRes.droneMidAirBisectionExecuted, true);
    assert.equal(bisectRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): moonlit grass field, honor duel weapons, blade clash & shuriken intercept (+450 Honor)', () => {
    const sector = new Predators2010HanzoKatanaMoonlitDuelAndShurikenSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.unclaspWeaponsForHonorDuel(), /Must enter moonlit grass field/);

    const fieldRes = sector.enterMoonlitGrassField({
      fieldVisibilityLux: 4.2,
      grassHeightMeters: 1.3
    });
    assert.equal(fieldRes.moonlitFieldEntered, true);

    const unclaspRes = sector.unclaspWeaponsForHonorDuel({
      plasmaCasterDiscarded: true,
      singleWristBladeExtended: true
    });
    assert.equal(unclaspRes.honorWeaponsUnclasped, true);

    const clashRes = sector.executeSymmetricalBladeClash({
      bladeImpactJoules: 1850,
      clashSparksEmitted: true
    });
    assert.equal(clashRes.bladeSymmetricalClashExecuted, true);

    const honorRes = sector.honorMutualStrikeAndInterceptShuriken({
      warriorHonorScore: 1.0,
      sixBladeShurikenIntercepted: true
    });
    assert.equal(honorRes.mutualStrikeAndShurikenHonored, true);
    assert.equal(honorRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): beaver dam mud bog, bone shield fan spin, helmet tri-laser & Infini Sanctum (+500 Honor)', () => {
    const sector = new Prey2022BeaverDamTrapAndInfiniApexSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeBoneShieldFanSpin(), /Must enter beaver dam mud bog/);

    const bogRes = sector.enterBeaverDamMudBog({
      timberDensityPerM2: 8,
      bogDepthMeters: 1.1
    });
    assert.equal(bogRes.beaverDamMudBogEntered, true);

    const fanRes = sector.executeBoneShieldFanSpin({
      fanExpansionAngleDeg: 180,
      kineticDeflectionJoules: 5400
    });
    assert.equal(fanRes.boneShieldFanSpinExecuted, true);

    const laserRes = sector.alignHelmetTriLaserTelemetryLock({
      convergenceDeviationDeg: 0.08,
      trackingStabilityScore: 0.99
    });
    assert.equal(laserRes.helmetTriLaserLockAligned, true);

    const sanctumRes = sector.ascendToInfiniApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 11000,
      synthSyncIndex: 0.99,
      infiniSealGlyph: 'INFINI_1987_2025'
    });
    assert.equal(sanctumRes.infiniApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Infini Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseInfiniApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 75,
      arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_INFINI_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterInfiniGlyphsSequence({ glyphs: ['᚛', 'ᚉ', 'ᚑ', 'ᚏ', '᚜'] });
    assert.equal(glyphRes.infiniGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 132, mockeryFrequencyHz: 510 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeInfiniMicroNuclearPurge({ countdownSeconds: 14.0, blastRadiusMeters: 72 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Infini Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseInfiniApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all 7 sectors
    director.sectors.predator1987.crawlOntoRiverbankInRainstorm();
    director.sectors.predator1987.triggerOpticCamoWaterSparkInterference();
    director.sectors.predator1987.verifyThermalDeltaNeutralization();
    director.sectors.predator1987.endureBreathlessHunterStandoff();

    director.sectors.predator21990.activateLiquidNitrogenSprayers();
    director.sectors.predator21990.shiftMaskVisionToUltraviolet();
    director.sectors.predator21990.executeMeatHookCeilingLeap();
    director.sectors.predator21990.cleaveFrozenCarcassesWithSmartDisc();

    director.sectors.avp2004.endureBouvetoyaSubZeroBlizzard();
    director.sectors.avp2004.secureWhalingStationShaftHead();
    director.sectors.avp2004.activateCelticPlasmaShieldMesh();
    director.sectors.avp2004.slamGridAlienAgainstIronCauldron();

    director.sectors.avpRequiem2007.navigateCemeteryMudTrenchInThunderstorm();
    director.sectors.avpRequiem2007.trackLuminescentXenoSpoor();
    director.sectors.avpRequiem2007.uncoilSegmentedBarbedTailWhip();
    director.sectors.avpRequiem2007.executeMidAirDroneBisection();

    director.sectors.predators2010.enterMoonlitGrassField();
    director.sectors.predators2010.unclaspWeaponsForHonorDuel();
    director.sectors.predators2010.executeSymmetricalBladeClash();
    director.sectors.predators2010.honorMutualStrikeAndInterceptShuriken();

    director.sectors.prey2022.enterBeaverDamMudBog();
    director.sectors.prey2022.executeBoneShieldFanSpin();
    director.sectors.prey2022.alignHelmetTriLaserTelemetryLock();
    director.sectors.prey2022.ascendToInfiniApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_INFINI_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterInfiniGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeInfiniMicroNuclearPurge();

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
    assert.equal(completedSnap.playtesters.length, 5);

    // Verify SSR/Node DOM safe handling
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);
  });

  it('9. Human QA Infini Apex Master Auditor: full-spectrum certification, Rule 3 & draw calls <= 300', () => {
    const auditor = new HumanQaPredatorFranchiseInfiniApexMasterAuditor();
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

  it('10. AudioSynthesizer: Infini acoustic models & 15 dedicated SFX synthesized', () => {
    const waterAcoustics = audioSynth.computeInfiniThermalWaterAcoustics({
      rainfallRateMmPerHour: 48,
      waterConductivityUsm: 280
    });
    assert.equal(waterAcoustics.rainfallRateMmPerHour, 48);
    assert.equal(waterAcoustics.waterConductivityUsm, 280);
    assert.equal(typeof waterAcoustics.dielectricHissDecibels, 'number');
    assert.equal(typeof waterAcoustics.sparkFrequencyHz, 'number');

    const blizzardAcoustics = audioSynth.computeInfiniBlizzardGaleAcoustics({
      surfaceTempCelsius: -35,
      galeWindKnots: 45
    });
    assert.equal(blizzardAcoustics.surfaceTempCelsius, -35);
    assert.equal(blizzardAcoustics.galeWindKnots, 45);
    assert.equal(typeof blizzardAcoustics.windHowlPitchHz, 'number');
    assert.equal(typeof blizzardAcoustics.chillFlutterFactor, 'number');

    const sfxMethods = [
      'playPredator1987InfiniWaterDispersionSFX',
      'playPredator1987InfiniMudThermalMaskSFX',
      'playPredator21990InfiniNitrogenSprayerHissSFX',
      'playPredator21990InfiniUvVisionShiftSFX',
      'playPredator21990InfiniSmartDiscMeatHookCleaveSFX',
      'playAvp2004InfiniBlizzardCauldronClashSFX',
      'playAvp2004InfiniCelticPlasmaShieldSFX',
      'playAvpRequiem2007InfiniCemeteryMudGrappleSFX',
      'playAvpRequiem2007InfiniWhipBisectionSFX',
      'playPredators2010InfiniHanzoKatanaClashSFX',
      'playPredators2010InfiniFalconerBladeHonorSFX',
      'playPrey2022InfiniBoneShieldFanSpinSFX',
      'playPrey2022InfiniSanctumAscentSFX',
      'playPredatorFranchiseInfiniApexNuclearPurgeSFX',
      'playPredatorFranchiseInfiniVictoryAnthemSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
