import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ExplosiveBowDeadfallAmbushSector } from '../src/gameplay/Predator1987ExplosiveBowDeadfallAmbushSector.js';
import { Predator21990SkylightTackleCauterizationSector } from '../src/gameplay/Predator21990SkylightTackleCauterizationSector.js';
import { Avp2004IceShelfQueenWhalingChainSector } from '../src/gameplay/Avp2004IceShelfQueenWhalingChainSector.js';
import { AvpRequiem2007ShurikenWallRicochetChemicalSector } from '../src/gameplay/AvpRequiem2007ShurikenWallRicochetChemicalSector.js';
import { Predators2010RoyceMudDecoyUpgradeClashSector } from '../src/gameplay/Predators2010RoyceMudDecoyUpgradeClashSector.js';
import { Prey2022OrangeFlowerHypothermiaDiscTrapSector } from '../src/gameplay/Prey2022OrangeFlowerHypothermiaDiscTrapSector.js';
import {
  PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector,
  PREDATOR_FRANCHISE_ULTIME_SUPREME_APEX_SANCTUM
} from '../src/gameplay/PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseUltimeSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseUltimeSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseUltimeSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseUltimeSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v234 - Predator Franchise Ultime Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): bamboo grenade arrow, canopy deadfall rig, explosive bow shot & mandible roar (+350 Honor)', () => {
    const sector = new Predator1987ExplosiveBowDeadfallAmbushSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.rigCounterweightDeadfall(), /Must craft explosive arrow/);

    const arrowRes = sector.craftExplosiveBambooArrow({
      bambooShaftLengthCm: 85,
      grenadeWarheadYieldGrams: 180,
      flightStabilizationScore: 0.95
    });
    assert.equal(arrowRes.explosiveArrowCrafted, true);

    const deadfallRes = sector.rigCounterweightDeadfall({
      deadfallLogWeightKg: 250,
      vineTripwireTensionNewtons: 1200,
      deadfallDropElevationMeters: 7.5
    });
    assert.equal(deadfallRes.counterweightDeadfallRigged, true);

    const shotRes = sector.fireCanopyExplosiveBow({
      arrowDrawForceLbs: 65,
      canopyDetonationRadiusMeters: 3.5,
      camouflageDisruptionDurationSec: 4.2
    });
    assert.equal(shotRes.canopyExplosiveBowFired, true);

    const roarRes = sector.endureUnmaskedMandibleRoar({
      bioMaskPneumaticHissDb: 82,
      mandibleSpreadDegrees: 78,
      gutturalChallengeAcousticDb: 114
    });
    assert.equal(roarRes.unmaskedMandibleRoarEndured, true);
    assert.equal(roarRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): penthouse cornice standoff, smart disc forearm severance, medicomp foam cauterize & skylight tackle (+400 Honor)', () => {
    const sector = new Predator21990SkylightTackleCauterizationSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.severForearmWithSmartDisc(), /Must engage cornice standoff/);

    const corniceRes = sector.engageCorniceStandoff({
      corniceHeightMeters: 85.0,
      windBuffetVelocityKmh: 64,
      harriganShotgunProximityM: 3.2
    });
    assert.equal(corniceRes.corniceStandoffEngaged, true);

    const discRes = sector.severForearmWithSmartDisc({
      discRotationRpm: 18000,
      forearmBoneCleaveJoules: 4200,
      luminousGreenBloodGushLitres: 1.2
    });
    assert.equal(discRes.smartDiscForearmSevered, true);

    const foamRes = sector.cauterizeWithMedicompFoam({
      chemicalBurnerTempCelsius: 640,
      blueCoagulantFoamVolumeMl: 120,
      agonyRoarDecibels: 118
    });
    assert.equal(foamRes.medicompFoamCauterized, true);

    const crashRes = sector.resolveSkylightTackleCrash({
      skylightGlassThicknessMm: 12.0,
      tackleImpactKineticJoules: 8900,
      bathroomTileFloorBreached: true
    });
    assert.equal(crashRes.skylightTackleCrashResolved, true);
    assert.equal(crashRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): ice shelf Queen pursuit, combistick crest impalement, whaling chain lashing & oceanic abyss plunge (+400 Honor)', () => {
    const sector = new Avp2004IceShelfQueenWhalingChainSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.interceptQueenCharge(), /Must pursue across ice shelf/);

    const iceRes = sector.pursueAcrossCollapsingIceShelf({
      iceFissureDepthMeters: 45.0,
      shelfBreakRateMps: 12.5,
      queenSpeedKmh: 52.0
    });
    assert.equal(iceRes.iceShelfCollapsePursued, true);

    const chargeRes = sector.interceptQueenCharge({
      queenImpactMassKg: 4500,
      lexTailShieldParryJoules: 6800,
      queenTailStingerDeflected: true
    });
    assert.equal(chargeRes.queenChargeIntercepted, true);

    const crestRes = sector.hurlCombistickThroughCrest({
      combistickThrowForceNewtons: 8500,
      chitinCrestPenetrationDepthCm: 38,
      acidBloodVaporizationSpike: true
    });
    assert.equal(crestRes.combistickCrestHurled, true);

    const plungeRes = sector.executeWhalingChainDeepPlunge({
      whalingChainTensileTons: 80,
      waterTowerMassTons: 45,
      abyssPlungeDepthMeters: 850
    });
    assert.equal(plungeRes.whalingChainDeepPlungeExecuted, true);
    assert.equal(plungeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): crypt corridor infiltration, twin smart shurikens, banked wall ricochet & blue acid vaporization (+400 Honor)', () => {
    const sector = new AvpRequiem2007ShurikenWallRicochetChemicalSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.unholsterSmartShurikens(), /Must infiltrate crypt standoff/);

    const cryptRes = sector.infiltrateCryptStandoff({
      confinedCorridorWidthM: 3.2,
      xenomorphAmbushCount: 4,
      sewerMethaneSaturationPercent: 24
    });
    assert.equal(cryptRes.cryptStandoffInfiltrated, true);

    const shurikenRes = sector.unholsterSmartShurikens({
      bladeCountPerShuriken: 6,
      centrifugalSpikeRpm: 14500,
      dualWieldReadinessScore: 0.98
    });
    assert.equal(shurikenRes.smartShurikensUnholstered, true);

    const ricochetRes = sector.executeBankedWallRicochet({
      ricochetBankAngleDeg: 48,
      xenoCarapaceBisectionCount: 4,
      concretePillarEmbedDepthCm: 15
    });
    assert.equal(ricochetRes.bankedWallRicochetCleaved, true);

    const acidRes = sector.applyBlueAcidDissolution({
      dissolutionFluidVolumeMl: 250,
      molecularDissolutionTimeSec: 2.4,
      forensicSignatureEliminated: true
    });
    assert.equal(acidRes.blueAcidDissolutionVaporized, true);
    assert.equal(acidRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): quarry fire trenches, Isabelle sniper decoy, Upgrade exoskeleton & hydraulic clash (+450 Honor)', () => {
    const sector = new Predators2010RoyceMudDecoyUpgradeClashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.coordinateIsabelleSniperDecoy(), /Must ignite fire trenches/);

    const trenchRes = sector.igniteQuarryFireTrenches({
      fireTrenchCircumferenceMeters: 85,
      thermalBlindingTempCelsius: 920,
      opticalCamouflageInterferenceIndex: 0.98
    });
    assert.equal(trenchRes.quarryFireTrenchesIgnited, true);

    const sniperRes = sector.coordinateIsabelleSniperDecoy({
      sniperRangeMeters: 120,
      muzzleFlashDecoyLuminosityLumens: 32000,
      berserkerAttentionDiverted: true
    });
    assert.equal(sniperRes.isabelleSniperDecoyCoordinated, true);

    const exoRes = sector.interceptUpgradeExoskeleton({
      upgradePredatorHeightMeters: 3.3,
      hybridChitinTensileMpa: 1450,
      kineticDeflectionEfficiency: 0.96
    });
    assert.equal(exoRes.upgradeExoskeletonIntercepted, true);

    const punchRes = sector.resolveHydraulicImpactClash({
      hydraulicPunchJoules: 24000,
      canopyTrunkShatterDiameterCm: 65,
      mutualWarriorHonorSalute: true
    });
    assert.equal(punchRes.hydraulicImpactClashResolved, true);
    assert.equal(punchRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): orange flower hypothermia, quagmire mud lure, helmet laser redirection & Ultime Sanctum (+500 Honor)', () => {
    const sector = new Prey2022OrangeFlowerHypothermiaDiscTrapSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.positionQuagmireMudLure(), /Must ingest orange flower/);

    const flowerRes = sector.ingestOrangeFlowerHypothermia({
      orangeFlowerDosageGrams: 14.5,
      inducedCoreBodyTempCelsius: 28.2,
      thermalInvisibilityFactor: 0.99
    });
    assert.equal(flowerRes.orangeFlowerHypothermiaIngested, true);

    const lureRes = sector.positionQuagmireMudLure({
      mudBogDepthMeters: 2.2,
      quagmireViscosityCentipoise: 45000,
      severedShieldArmPositioned: true
    });
    assert.equal(lureRes.quagmireMudLurePositioned, true);

    const redirectRes = sector.executeHelmetLaserRedirect({
      triLaserAlignmentDeviationDegrees: 0.4,
      homingBoltVelocityMps: 240,
      cranialBonePerforationConfirmed: true
    });
    assert.equal(redirectRes.helmetLaserRedirectExecuted, true);

    const sanctumRes = sector.consecrateUltimeSanctumMastery({
      badlandsBionicDroneCount: 2,
      crystallineDesertScanRangeKm: 5.2,
      ultimeSanctumConsecrated: true
    });
    assert.equal(sanctumRes.ultimeSanctumMasteryConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector();

    // Case 1: Yautja + Defeated + In Ultime Sanctum -> NUCLEAR PURGE
    const case1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: -20,
      arenaConfiguration: PREDATOR_FRANCHISE_ULTIME_SUPREME_APEX_SANCTUM
    });
    assert.equal(case1.selfDestructTriggered, true);
    assert.equal(case1.reason, 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE');
    assert.equal(case1.purgeYieldMegatons, 0.75);
    assert.equal(case1.honorAwarded, 500);
    assert.equal(sector.isFullyCompleted(), true);

    // Case 2: Yautja + Alive + In Ultime Sanctum -> LOCKED
    const case2 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 90,
      arenaConfiguration: PREDATOR_FRANCHISE_ULTIME_SUPREME_APEX_SANCTUM
    });
    assert.equal(case2.selfDestructTriggered, false);
    assert.equal(case2.reason, 'YAUTJA_STILL_ALIVE');

    // Case 3: Human / Synthetic + Defeated + In Ultime Sanctum -> LOCKED
    const case3 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ULTIME_SUPREME_APEX_SANCTUM
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
    const director = new HumanQaPredatorFranchiseUltimeSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v234');
    assert.equal(snapshot.pantheon, 'Ultime Suprême Apex (1987-2025)');
    assert.equal(typeof snapshot.totalHonor, 'number');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.craftExplosiveBambooArrow({ bambooShaftLengthCm: 85, grenadeWarheadYieldGrams: 180, flightStabilizationScore: 0.95 });
    director.sectors.predator1987.rigCounterweightDeadfall({ deadfallLogWeightKg: 250, vineTripwireTensionNewtons: 1200, deadfallDropElevationMeters: 7.5 });
    director.sectors.predator1987.fireCanopyExplosiveBow({ arrowDrawForceLbs: 65, canopyDetonationRadiusMeters: 3.5, camouflageDisruptionDurationSec: 4.2 });
    director.sectors.predator1987.endureUnmaskedMandibleRoar({ bioMaskPneumaticHissDb: 82, mandibleSpreadDegrees: 78, gutturalChallengeAcousticDb: 114 });

    director.sectors.predator21990.engageCorniceStandoff({ corniceHeightMeters: 85.0, windBuffetVelocityKmh: 64, harriganShotgunProximityM: 3.2 });
    director.sectors.predator21990.severForearmWithSmartDisc({ discRotationRpm: 18000, forearmBoneCleaveJoules: 4200, luminousGreenBloodGushLitres: 1.2 });
    director.sectors.predator21990.cauterizeWithMedicompFoam({ chemicalBurnerTempCelsius: 640, blueCoagulantFoamVolumeMl: 120, agonyRoarDecibels: 118 });
    director.sectors.predator21990.resolveSkylightTackleCrash({ skylightGlassThicknessMm: 12.0, tackleImpactKineticJoules: 8900, bathroomTileFloorBreached: true });

    director.sectors.avp2004.pursueAcrossCollapsingIceShelf({ iceFissureDepthMeters: 45.0, shelfBreakRateMps: 12.5, queenSpeedKmh: 52.0 });
    director.sectors.avp2004.interceptQueenCharge({ queenImpactMassKg: 4500, lexTailShieldParryJoules: 6800, queenTailStingerDeflected: true });
    director.sectors.avp2004.hurlCombistickThroughCrest({ combistickThrowForceNewtons: 8500, chitinCrestPenetrationDepthCm: 38, acidBloodVaporizationSpike: true });
    director.sectors.avp2004.executeWhalingChainDeepPlunge({ whalingChainTensileTons: 80, waterTowerMassTons: 45, abyssPlungeDepthMeters: 850 });

    director.sectors.avpRequiem2007.infiltrateCryptStandoff({ confinedCorridorWidthM: 3.2, xenomorphAmbushCount: 4, sewerMethaneSaturationPercent: 24 });
    director.sectors.avpRequiem2007.unholsterSmartShurikens({ bladeCountPerShuriken: 6, centrifugalSpikeRpm: 14500, dualWieldReadinessScore: 0.98 });
    director.sectors.avpRequiem2007.executeBankedWallRicochet({ ricochetBankAngleDeg: 48, xenoCarapaceBisectionCount: 4, concretePillarEmbedDepthCm: 15 });
    director.sectors.avpRequiem2007.applyBlueAcidDissolution({ dissolutionFluidVolumeMl: 250, molecularDissolutionTimeSec: 2.4, forensicSignatureEliminated: true });

    director.sectors.predators2010.igniteQuarryFireTrenches({ fireTrenchCircumferenceMeters: 85, thermalBlindingTempCelsius: 920, opticalCamouflageInterferenceIndex: 0.98 });
    director.sectors.predators2010.coordinateIsabelleSniperDecoy({ sniperRangeMeters: 120, muzzleFlashDecoyLuminosityLumens: 32000, berserkerAttentionDiverted: true });
    director.sectors.predators2010.interceptUpgradeExoskeleton({ upgradePredatorHeightMeters: 3.3, hybridChitinTensileMpa: 1450, kineticDeflectionEfficiency: 0.96 });
    director.sectors.predators2010.resolveHydraulicImpactClash({ hydraulicPunchJoules: 24000, canopyTrunkShatterDiameterCm: 65, mutualWarriorHonorSalute: true });

    director.sectors.prey2022.ingestOrangeFlowerHypothermia({ orangeFlowerDosageGrams: 14.5, inducedCoreBodyTempCelsius: 28.2, thermalInvisibilityFactor: 0.99 });
    director.sectors.prey2022.positionQuagmireMudLure({ mudBogDepthMeters: 2.2, quagmireViscosityCentipoise: 45000, severedShieldArmPositioned: true });
    director.sectors.prey2022.executeHelmetLaserRedirect({ triLaserAlignmentDeviationDegrees: 0.4, homingBoltVelocityMps: 240, cranialBonePerforationConfirmed: true });
    director.sectors.prey2022.consecrateUltimeSanctumMastery({ badlandsBionicDroneCount: 2, crystallineDesertScanRangeKm: 5.2, ultimeSanctumConsecrated: true });

    director.sectors.defeatProtocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ULTIME_SUPREME_APEX_SANCTUM
    });

    assert.equal(director.isAllSectorsCompleted(), true);
    assert.equal(director.calculateTotalHonor(), 3000);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseUltimeSupremeApexMasterAuditor();
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

  it('10. AudioSynthesizer: Ultime Suprême acoustic models & SFX synthesized', () => {
    // 1. Deadfall bow acoustic model
    const deadfallAcoustics = audioSynth.computeUltimeDeadfallBowAcoustics({
      arrowDrawForceLbs: 65,
      deadfallLogWeightKg: 250
    });
    assert.ok(deadfallAcoustics.bowstringThrumHz > 0);
    assert.ok(deadfallAcoustics.deadfallImpactDecibels > 0);

    // 2. Ice shelf Queen acoustic model
    const iceQueenAcoustics = audioSynth.computeUltimeIceShelfQueenAcoustics({
      iceFissureDepthMeters: 45.0,
      whalingChainTensileTons: 80
    });
    assert.ok(iceQueenAcoustics.abyssalReverbMs > 0);
    assert.ok(iceQueenAcoustics.chainTensionWhineHz > 0);

    // 3. Verify all 15 SFX methods exist and execute cleanly
    const sfxMethods = [
      'playPredator1987UltimeBowReleaseSFX',
      'playPredator1987UltimeDeadfallCrashSFX',
      'playPredator1987UltimeMandibleRoarSFX',
      'playPredator21990UltimeMedicompFoamBurnerSFX',
      'playPredator21990UltimeSkylightGlassCrashSFX',
      'playAvp2004UltimeQueenChitinCrestStrikeSFX',
      'playAvp2004UltimeWhalingChainAbyssPlungeSFX',
      'playAvpRequiem2007UltimeShurikenBankedRicochetSFX',
      'playAvpRequiem2007UltimeBlueAcidVaporizationSFX',
      'playPredators2010UltimeQuarryFireTrenchBlazeSFX',
      'playPredators2010UltimeUpgradeHydraulicPunchSFX',
      'playPrey2022UltimeOrangeFlowerWhisperSFX',
      'playPrey2022UltimeHelmetLaserRedirectSFX',
      'playPrey2022UltimeDesertBionicDronePingSFX',
      'playPredatorFranchiseUltimeSanctumNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof audioSynth[method], 'function', `Expected method ${method} on audioSynth`);
      assert.doesNotThrow(() => audioSynth[method]());
    }
  });
});
