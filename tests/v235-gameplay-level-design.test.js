import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987OldPainlessCanopyDefoliationSector } from '../src/gameplay/Predator1987OldPainlessCanopyDefoliationSector.js';
import { Predator21990SmartDiscMeleeBuzzsawSector } from '../src/gameplay/Predator21990SmartDiscMeleeBuzzsawSector.js';
import { Avp2004LexXenoChitinShieldForgeSector } from '../src/gameplay/Avp2004LexXenoChitinShieldForgeSector.js';
import { AvpRequiem2007LaserMeshTripwireSector } from '../src/gameplay/AvpRequiem2007LaserMeshTripwireSector.js';
import { Predators2010PredatorKillerNanotechSuitSector } from '../src/gameplay/Predators2010PredatorKillerNanotechSuitSector.js';
import { Prey2022FlechetteCrossboltVoyageurSector } from '../src/gameplay/Prey2022FlechetteCrossboltVoyageurSector.js';
import {
  PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector,
  PREDATOR_FRANCHISE_DIVIN_SUPREME_APEX_SANCTUM
} from '../src/gameplay/PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseDivinSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseDivinSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseDivinSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseDivinSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v235 - Predator Franchise Divin Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): blood fern tracking, minigun spool up, 6000 RPM canopy defoliation sweep & branch graze (+350 Honor)', () => {
    const sector = new Predator1987OldPainlessCanopyDefoliationSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.initiateMinigunPreSpinSpool(), /Must track bioluminescent blood/);

    const trackRes = sector.trackBioluminescentBloodFern({
      luminescentGreenLux: 4.8,
      bloodDripFernCount: 14,
      nightTrackingFlashlightBeamLumens: 850
    });
    assert.equal(trackRes.bioluminescentBloodTracked, true);

    const spoolRes = sector.initiateMinigunPreSpinSpool({
      barrelClusterRpm: 6000,
      electricMotorTorqueNm: 45.0,
      spoolUpDurationSec: 0.45
    });
    assert.equal(spoolRes.minigunPreSpinSpoolInitiated, true);

    const sweepRes = sector.executeCanopyDefoliationSweep({
      roundsFired: 800,
      defoliatedCanopyAreaSquareMeters: 220,
      chainsawAcousticRoarDb: 138
    });
    assert.equal(sweepRes.canopyDefoliationSweepExecuted, true);

    const grazeRes = sector.resolveJungleHunterBranchGraze({
      shrapnelGrazeVelocityMps: 840,
      severedBoughDropElevationMeters: 18.0,
      confirmedBloodSplatterRetreat: true
    });
    assert.equal(grazeRes.jungleHunterBranchGrazeResolved, true);
    assert.equal(grazeRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): Mother Ship catwalk engagement, smart disc buzzsaw grip, wristblade deflection & carapace strike (+400 Honor)', () => {
    const sector = new Predator21990SmartDiscMeleeBuzzsawSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.primeHandheldDiscGrip(), /Must engage catwalk/);

    const catwalkRes = sector.engageMotherShipCatwalk({
      catwalkElevationMeters: 32.0,
      hyperspaceCoolantSteamLux: 5.6,
      cityHunterArmorRemainingPercent: 42
    });
    assert.equal(catwalkRes.motherShipCatwalkEngaged, true);

    const gripRes = sector.primeHandheldDiscGrip({
      gyroscopicSpinRateRpm: 22000,
      handheldGripForceNewtons: 2800,
      discEdgeUltrasonicWhineDb: 88
    });
    assert.equal(gripRes.handheldDiscGripPrimed, true);

    const deflectRes = sector.deflectWristbladeLunge({
      wristbladeLungeVelocityMps: 16.5,
      discDeflectionAngleDegrees: 34,
      sparkEjectionJoules: 3200
    });
    assert.equal(deflectRes.wristbladeLungeDeflected, true);

    const strikeRes = sector.resolveCarapaceBuzzsawStrike({
      discPenetrationDepthCm: 18.0,
      carapaceAlloyShatterJoules: 14200,
      mortalYautjaWarriorSalute: true
    });
    assert.equal(strikeRes.carapaceBuzzsawStrikeResolved, true);
    assert.equal(strikeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): pyramid forge entry, cranial carapace cut, acid-proof hand grips & tail stinger spear (+400 Honor)', () => {
    const sector = new Avp2004LexXenoChitinShieldForgeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.severCranialCarapace(), /Must enter pyramid forge/);

    const enterRes = sector.enterPyramidForgeChamber({
      pyramidLevelDepthMeters: 720,
      ceremonialBrazierTempCelsius: 580,
      dispatchedDroneCorpseCount: 3
    });
    assert.equal(enterRes.pyramidForgeChamberEntered, true);

    const severRes = sector.severCranialCarapace({
      wristbladePrecisionCutMm: 1.2,
      carapaceWeightKg: 8.5,
      acidBloodNeutralizedFactor: 0.96
    });
    assert.equal(severRes.cranialCarapaceSevered, true);

    const gripRes = sector.hollowAcidEtchedHandGrips({
      acidEtchPpm: 7500,
      strapTensileStrengthNewtons: 3400,
      acidImmunityProofScore: 0.99
    });
    assert.equal(gripRes.acidEtchedHandGripsHollowed, true);

    const spearRes = sector.presentTailStingerSpear({
      stingerLengthCm: 28,
      spearShaftHardnessRockwell: 62,
      warriorAllianceSaluteConfirmed: true
    });
    assert.equal(spearRes.tailStingerSpearPresented, true);
    assert.equal(spearRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): pool facility infiltration, roof cupola anchor, 4-point laser tripmines & grid bisection (+400 Honor)', () => {
    const sector = new AvpRequiem2007LaserMeshTripwireSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.anchorRoofCupola(), /Must infiltrate pool facility/);

    const poolRes = sector.infiltratePoolFacility({
      poolReservoirLengthMeters: 50.0,
      chlorineVaporPpm: 35,
      ambientDarknessLux: 0.4
    });
    assert.equal(poolRes.poolFacilityInfiltrated, true);

    const cupolaRes = sector.anchorRoofCupola({
      roofElevationMeters: 16.5,
      rafterGripTensionNewtons: 4800,
      opticalCamouflageSubmergedFactor: 0.96
    });
    assert.equal(cupolaRes.roofCupolaAnchored, true);

    const tripmineRes = sector.mountLaserTripmines({
      tripmineCount: 4,
      laserBeamWavelengthNm: 635,
      wallAnchorPenetrationCm: 6.2
    });
    assert.equal(tripmineRes.laserTripminesMounted, true);

    const bisectionRes = sector.executeIntersectingGridBisection({
      laserGridDensityIntersections: 12,
      xenomorphDroneBisectionCount: 3,
      chlorinatedWaterSteamSpike: true
    });
    assert.equal(bisectionRes.intersectingGridBisectionExecuted, true);
    assert.equal(bisectionRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): research bunker vault, cryo-pod unseal, liquid metal nanites & Predator Killer suit (+450 Honor)', () => {
    const sector = new Predators2010PredatorKillerNanotechSuitSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.unsealCryoStasisPod(), /Must discover research vault/);

    const vaultRes = sector.discoverResearchBunkerVault({
      reinforcedVaultBlastRatingPsi: 12000,
      atmosphericPressureAtm: 1.05,
      ancientPreserveDataCoresIdentified: true
    });
    assert.equal(vaultRes.researchBunkerVaultDiscovered, true);

    const podRes = sector.unsealCryoStasisPod({
      podCoolantNitrogenTempCelsius: -185,
      biometricHandprintAuthorized: true,
      holographicGiftBeaconActive: true
    });
    assert.equal(podRes.cryoStasisPodUnsealed, true);

    const graftRes = sector.graftLiquidMetalNanites({
      naniteSwarmDensityBillionPerCc: 42,
      epidermalBondingRateMs: 280,
      neuralInterfaceSyncScore: 0.98
    });
    assert.equal(graftRes.liquidMetalNanitesGrafted, true);

    const suitRes = sector.deployPredatorKillerSuit({
      twinPlasmacasterDeploymentSec: 0.65,
      ballisticChitinPlatingMpa: 2400,
      hudTargetingMatrixOnline: true
    });
    assert.equal(suitRes.predatorKillerSuitDeployed, true);
    assert.equal(suitRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): voyageur gunline, black powder volley bone shield parry, multi-flechette burst & Divin Sanctum (+500 Honor)', () => {
    const sector = new Prey2022FlechetteCrossboltVoyageurSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.absorbBlackPowderVolleyWithShield(), /Must encounter voyageur gunline/);

    const lineRes = sector.encounterVoyageurGunline({
      trapperCount: 12,
      blackPowderMusketCaliberMm: 17.5,
      forestMistVisibilityMeters: 8.5
    });
    assert.equal(lineRes.voyageurGunlineEncountered, true);

    const shieldRes = sector.absorbBlackPowderVolleyWithShield({
      totalVolleyKineticJoules: 5400,
      shieldFanExpansionMs: 120,
      zeroPenetrationConfirmed: true
    });
    assert.equal(shieldRes.blackPowderVolleyShieldAbsorbed, true);

    const burstRes = sector.fireMultiFlechetteBurst({
      flechetteCount: 6,
      steelFlechetteVelocityMps: 320,
      pineTrunkPenetrationDepthCm: 14
    });
    assert.equal(burstRes.multiFlechetteBurstFired, true);

    const sanctumRes = sector.establishDivinSanctumMastery({
      badlandsCelestialUplinkGhz: 24.5,
      starChartTelemetryPackets: 1024,
      divinSanctumEstablished: true
    });
    assert.equal(sanctumRes.divinSanctumMasteryEstablished, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector();

    // Case 1: Yautja + Defeated + In Divin Sanctum -> NUCLEAR PURGE
    const case1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: -25,
      arenaConfiguration: PREDATOR_FRANCHISE_DIVIN_SUPREME_APEX_SANCTUM
    });
    assert.equal(case1.selfDestructTriggered, true);
    assert.equal(case1.reason, 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE');
    assert.equal(case1.purgeYieldMegatons, 0.80);
    assert.equal(case1.honorAwarded, 500);
    assert.equal(sector.isFullyCompleted(), true);

    // Case 2: Yautja + Alive + In Divin Sanctum -> LOCKED
    const case2 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 95,
      arenaConfiguration: PREDATOR_FRANCHISE_DIVIN_SUPREME_APEX_SANCTUM
    });
    assert.equal(case2.selfDestructTriggered, false);
    assert.equal(case2.reason, 'YAUTJA_STILL_ALIVE');

    // Case 3: Human / Synthetic + Defeated + In Divin Sanctum -> LOCKED
    const case3 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_DIVIN_SUPREME_APEX_SANCTUM
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
    const director = new HumanQaPredatorFranchiseDivinSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v235');
    assert.equal(snapshot.pantheon, 'Divin Suprême Apex (1987-2025)');
    assert.equal(typeof snapshot.totalHonor, 'number');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.trackBioluminescentBloodFern({ luminescentGreenLux: 4.8, bloodDripFernCount: 14, nightTrackingFlashlightBeamLumens: 850 });
    director.sectors.predator1987.initiateMinigunPreSpinSpool({ barrelClusterRpm: 6000, electricMotorTorqueNm: 45.0, spoolUpDurationSec: 0.45 });
    director.sectors.predator1987.executeCanopyDefoliationSweep({ roundsFired: 800, defoliatedCanopyAreaSquareMeters: 220, chainsawAcousticRoarDb: 138 });
    director.sectors.predator1987.resolveJungleHunterBranchGraze({ shrapnelGrazeVelocityMps: 840, severedBoughDropElevationMeters: 18.0, confirmedBloodSplatterRetreat: true });

    director.sectors.predator21990.engageMotherShipCatwalk({ catwalkElevationMeters: 32.0, hyperspaceCoolantSteamLux: 5.6, cityHunterArmorRemainingPercent: 42 });
    director.sectors.predator21990.primeHandheldDiscGrip({ gyroscopicSpinRateRpm: 22000, handheldGripForceNewtons: 2800, discEdgeUltrasonicWhineDb: 88 });
    director.sectors.predator21990.deflectWristbladeLunge({ wristbladeLungeVelocityMps: 16.5, discDeflectionAngleDegrees: 34, sparkEjectionJoules: 3200 });
    director.sectors.predator21990.resolveCarapaceBuzzsawStrike({ discPenetrationDepthCm: 18.0, carapaceAlloyShatterJoules: 14200, mortalYautjaWarriorSalute: true });

    director.sectors.avp2004.enterPyramidForgeChamber({ pyramidLevelDepthMeters: 720, ceremonialBrazierTempCelsius: 580, dispatchedDroneCorpseCount: 3 });
    director.sectors.avp2004.severCranialCarapace({ wristbladePrecisionCutMm: 1.2, carapaceWeightKg: 8.5, acidBloodNeutralizedFactor: 0.96 });
    director.sectors.avp2004.hollowAcidEtchedHandGrips({ acidEtchPpm: 7500, strapTensileStrengthNewtons: 3400, acidImmunityProofScore: 0.99 });
    director.sectors.avp2004.presentTailStingerSpear({ stingerLengthCm: 28, spearShaftHardnessRockwell: 62, warriorAllianceSaluteConfirmed: true });

    director.sectors.avpRequiem2007.infiltratePoolFacility({ poolReservoirLengthMeters: 50.0, chlorineVaporPpm: 35, ambientDarknessLux: 0.4 });
    director.sectors.avpRequiem2007.anchorRoofCupola({ roofElevationMeters: 16.5, rafterGripTensionNewtons: 4800, opticalCamouflageSubmergedFactor: 0.96 });
    director.sectors.avpRequiem2007.mountLaserTripmines({ tripmineCount: 4, laserBeamWavelengthNm: 635, wallAnchorPenetrationCm: 6.2 });
    director.sectors.avpRequiem2007.executeIntersectingGridBisection({ laserGridDensityIntersections: 12, xenomorphDroneBisectionCount: 3, chlorinatedWaterSteamSpike: true });

    director.sectors.predators2010.discoverResearchBunkerVault({ reinforcedVaultBlastRatingPsi: 12000, atmosphericPressureAtm: 1.05, ancientPreserveDataCoresIdentified: true });
    director.sectors.predators2010.unsealCryoStasisPod({ podCoolantNitrogenTempCelsius: -185, biometricHandprintAuthorized: true, holographicGiftBeaconActive: true });
    director.sectors.predators2010.graftLiquidMetalNanites({ naniteSwarmDensityBillionPerCc: 42, epidermalBondingRateMs: 280, neuralInterfaceSyncScore: 0.98 });
    director.sectors.predators2010.deployPredatorKillerSuit({ twinPlasmacasterDeploymentSec: 0.65, ballisticChitinPlatingMpa: 2400, hudTargetingMatrixOnline: true });

    director.sectors.prey2022.encounterVoyageurGunline({ trapperCount: 12, blackPowderMusketCaliberMm: 17.5, forestMistVisibilityMeters: 8.5 });
    director.sectors.prey2022.absorbBlackPowderVolleyWithShield({ totalVolleyKineticJoules: 5400, shieldFanExpansionMs: 120, zeroPenetrationConfirmed: true });
    director.sectors.prey2022.fireMultiFlechetteBurst({ flechetteCount: 6, steelFlechetteVelocityMps: 320, pineTrunkPenetrationDepthCm: 14 });
    director.sectors.prey2022.establishDivinSanctumMastery({ badlandsCelestialUplinkGhz: 24.5, starChartTelemetryPackets: 1024, divinSanctumEstablished: true });

    director.sectors.defeatProtocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_DIVIN_SUPREME_APEX_SANCTUM
    });

    assert.equal(director.isAllSectorsCompleted(), true);
    assert.equal(director.calculateTotalHonor(), 3000);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseDivinSupremeApexMasterAuditor();
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

  it('10. AudioSynthesizer: Divin Suprême acoustic models & SFX synthesized', () => {
    // 1. Minigun defoliation acoustic model
    const minigunAcoustics = audioSynth.computeDivinMinigunDefoliationAcoustics({
      barrelClusterRpm: 6000,
      roundsFired: 800
    });
    assert.ok(minigunAcoustics.rotaryGatlingHumHz > 0);
    assert.ok(minigunAcoustics.defoliationThunderDb > 0);

    // 2. Pool laser mesh acoustic model
    const laserMeshAcoustics = audioSynth.computeDivinPoolLaserMeshAcoustics({
      poolReservoirLengthMeters: 50.0,
      laserGridDensityIntersections: 12
    });
    assert.ok(laserMeshAcoustics.underwaterLaserHumHz > 0);
    assert.ok(laserMeshAcoustics.poolChamberEchoMs > 0);

    // 3. Verify all 15 SFX methods exist and execute cleanly
    const sfxMethods = [
      'playPredator1987DivinBloodFernDripSFX',
      'playPredator1987DivinMinigunDefoliationSweepSFX',
      'playPredator1987DivinCanopyBranchGrazeSFX',
      'playPredator21990DivinSmartDiscGyroscopicWhineSFX',
      'playPredator21990DivinCarapaceBuzzsawBiteSFX',
      'playAvp2004DivinPyramidForgeBrazierSFX',
      'playAvp2004DivinXenoCarapaceChitinClawSFX',
      'playAvpRequiem2007DivinPoolWaterDomeBreachSFX',
      'playAvpRequiem2007DivinLaserMeshHumSFX',
      'playAvpRequiem2007DivinGridBisectionLaserZapSFX',
      'playPredators2010DivinVaultCryoStasisHissSFX',
      'playPredators2010DivinNanotechSuitGraftSFX',
      'playPrey2022DivinVoyageurMusketVolleySFX',
      'playPrey2022DivinMultiFlechetteImpaleSFX',
      'playPredatorFranchiseDivinSanctumNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof audioSynth[method], 'function', `Expected method ${method} on audioSynth`);
      assert.doesNotThrow(() => audioSynth[method]());
    }
  });
});
