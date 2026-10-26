import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ValVerdeHelicopterWreckDillonStandSector } from '../src/gameplay/Predator1987ValVerdeHelicopterWreckDillonStandSector.js';
import { Predator21990ColombianScorpioCartelRooftopBreachSector } from '../src/gameplay/Predator21990ColombianScorpioCartelRooftopBreachSector.js';
import { Avp2004CelticVsGridAlienNetMeshArenaDuelSector } from '../src/gameplay/Avp2004CelticVsGridAlienNetMeshArenaDuelSector.js';
import { AvpRequiem2007ColoradoNationalGuardStrykerAmbushSector } from '../src/gameplay/AvpRequiem2007ColoradoNationalGuardStrykerAmbushSector.js';
import { Predators2010ClassicPredatorGauntletHologramShipNavSector } from '../src/gameplay/Predators2010ClassicPredatorGauntletHologramShipNavSector.js';
import { Prey1719RaphaelFlintlockLegacyChronicleSector } from '../src/gameplay/Prey1719RaphaelFlintlockLegacyChronicleSector.js';
import { PredatorFranchiseUnifiedYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseUnifiedYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseCompletionHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseCompletionHUDDirector.js';
import { HumanQaPredatorFranchiseCompletionMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseCompletionMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v201 Complete Predator Franchise (1987 -> 2025) Missing Links & Unified Level Design Suite', () => {
  it('Chantier 1: Predator (1987) Canopy Huey wreck inspection, Mac root-tunnel ambush, and Dillon dual-MP5 severed-arm stand', () => {
    const sector = new Predator1987ValVerdeHelicopterWreckDillonStandSector();
    const huey = sector.inspectCanopyEntangledHueyWreck({
      canopyAltitudeMeters: 18,
      hopperDogTagsRecovered: true
    });
    assert.equal(huey.hueyWreckInspected, true);

    const mac = sector.macCrawlUnderRootTunnelAmbush({
      whisperDecibels: 28,
      triLaserForeheadLockDetected: true
    });
    assert.equal(mac.macRootTunnelAmbushTriggered, true);

    const dillon = sector.dillonDualMp5SuppressionAndArmSeverance({
      firingRateRpm: 800,
      severedArmContinueFiringMs: 1800
    });
    assert.equal(dillon.dillonArmSeveredWhileFiring, true);

    const flank = sector.extractDillonCoordinatesBeforeJungleHunterStrike({
      dutchFlankSecured: true
    });
    assert.equal(flank.dutchFlankSecured, true);
    assert.equal(flank.honorAwarded, 350);
  });

  it('Chantier 2: Predator 2 (1990) LA heatwave Crown Vic barricade ram and Danny Archuleta AC-vent spear-tip recovery', () => {
    const sector = new Predator21990ColombianScorpioCartelRooftopBreachSector();
    const ram = sector.ramStreetBarricadeWithCrownVic({
      vehicleSpeedKmh: 78,
      pinnedOfficersRescued: 2
    });
    assert.equal(ram.barricadeRammedWithCrownVic, true);

    const climb = sector.climbPenthouseTableToAirConditioningDuct({
      ceilingHeightMeters: 4.2,
      thermalFloorHeatCelsius: 42.8
    });
    assert.equal(climb.penthouseAcDuctReached, true);

    const pry = sector.pryOutYautjaAlloySpearTipFromVent({
      alloyAtomicNumberUnknown: true,
      forensicEvidenceBagged: true
    });
    assert.equal(pry.spearTipPriedFromVent, true);

    const ambush = sector.triggerCityHunterCeilingThermalDropAmbush({
      cloakShimmerLux: 3.2
    });
    assert.equal(ambush.cityHunterCeilingAmbushTriggered, true);
    assert.equal(ambush.honorAwarded, 350);
  });

  it('Chantier 3: AVP (2004) Celtic vs Grid Alien stone pillar slam, ballistic net acid grid-scar, and tail-tip severance', () => {
    const sector = new Avp2004CelticVsGridAlienNetMeshArenaDuelSector();
    const slam = sector.grappleSlamXenomorphThroughStonePillars({
      brokenPillarsCount: 3,
      impactForceNewtons: 14500
    });
    assert.equal(slam.xenomorphSlammedThroughPillars, true);

    const net = sector.pinXenomorphInBallisticMeshNet({
      netTensionKn: 38,
      gridAcidPatternSlicedIntoCarapace: true
    });
    assert.equal(net.gridPatternEtchedByNet, true);

    const sever = sector.severGridAlienTailTipWithReversibleWristblade({
      tailTipSevered: true,
      wristbladeMeltedByAcid: true
    });
    assert.equal(sever.gridTailTipSevered, true);

    const climax = sector.surviveGridAlienInnerJawCounterPin({
      tacticalRetreatOrTrophyLogged: true
    });
    assert.equal(climax.duelClimaxLogged, true);
    assert.equal(climax.honorAwarded, 400);
  });

  it('Chantier 4: AVPR (2007) Gunnison National Guard Stryker rain ambush, Wolf plasma pistol conversion, B61 nuke escape, and Ms. Yutani briefcase', () => {
    const sector = new AvpRequiem2007ColoradoNationalGuardStrykerAmbushSector();
    const ambush = sector.ambushNationalGuardStrykerConvoyInRain({
      strykerVehiclesDisabled: 3,
      rainfallMmPerHour: 65
    });
    assert.equal(ambush.strykerConvoyAmbushed, true);

    const convert = sector.wolfInterceptPlasmacasterInDowntownCrossfire({
      dualCasterOverloadDetected: true,
      salvagedPistolConverted: true
    });
    assert.equal(convert.plasmaPistolHandgunConverted, true);

    const nuke = sector.escapeB61TacticalNuclearShockwaveInHuey({
      blastYieldKilotons: 15,
      shockwaveTurbulenceG: 4.8
    });
    assert.equal(nuke.b61NuclearShockwaveEscaped, true);

    const deliver = sector.deliverSalvagedPlasmacasterBriefcaseToMsYutani({
      tokyoCorporateVaultSealed: true,
      weylandYutaniMergerForeshadowed: true
    });
    assert.equal(deliver.msYutaniBriefcaseDelivered, true);
    assert.equal(deliver.honorAwarded, 450);
  });

  it('Chantier 5: Predators (2010) Classic Predator 3D Earth star-chart hologram & The Predator (2018) Rory McKenna gauntlet decryption', () => {
    const sector = new Predators2010ClassicPredatorGauntletHologramShipNavSector();
    const free = sector.severCrucifiedClassicPredatorTotemChains({
      chainsCut: 4,
      honorTruceAcceptedByClassic: true
    });
    assert.equal(free.classicPredatorFreedFromTotem, true);

    const starmap = sector.projectThreeDimensionalEarthStarChartHologram({
      earthCoordinatesLocked: true,
      scoutShipAutopilotSet: true
    });
    assert.equal(starmap.earthStarChartProjected, true);

    const decrypt = sector.roryMcKennaDecryptYautjaGauntletLanguageMatrix({
      glyphPermutationsSolved: 64,
      stargazerAlertTriggered: true
    });
    assert.equal(decrypt.roryGauntletMatrixDecrypted, true);

    const resupply = sector.resupplyLooniesSquadForFinalIntercept({
      improvisedOrdnanceLoaded: 6,
      teamCohesionIndex: 0.95
    });
    assert.equal(resupply.looniesSquadResupplied, true);
    assert.equal(resupply.honorAwarded, 400);
  });

  it('Chantier 6: 300-year Raphael Adolini 1715 flintlock chronicle (1719 Naru -> 1997 Greyback/Harrigan -> 2025 Yautja Prime Cryo-Vault)', () => {
    const sector = new Prey1719RaphaelFlintlockLegacyChronicleSector();
    const trade = sector.complete1719AdoliniPoulticeFlintlockTrade({
      engravingVerified: 'Raphael Adolini 1715',
      orangeFlowerPoulticeApplied: true
    });
    assert.equal(trade.adolini1719TradeCompleted, true);

    const shot = sector.naruPointBlankShotDislodgesFeralBioMask({
      muzzleVelocityMps: 265,
      feralLaserSightCaptured: true
    });
    assert.equal(shot.feralMaskShotOffByNaru, true);

    const bestow = sector.elderGreyback1997BestowAdoliniPistolToHarrigan({
      lostTribeCircleWitnesses: 9,
      spokenPhrase: 'Take it.'
    });
    assert.equal(bestow.greyback1997TrophyHandedToHarrigan, true);

    const vault = sector.verify2025YautjaPrimeApexSurvivorCryoVault({
      preservedSurvivors: ['NARU_1719', 'DUTCH_1987', 'HARRIGAN_1997', 'URSA_841', 'KENJI_1609', 'TORRES_1942'],
      codexContinuitySealed: true
    });
    assert.equal(vault.yautjaPrime2025SurvivorVaultVerified, true);
    assert.equal(vault.preservedApexSurvivorsCount, 6);
    assert.equal(vault.honorAwarded, 500);
  });

  it('Chantier 7: Strict User Rule 3 verification in Unified Franchise Arena (isYautja && health <= 0 && config === PREDATOR_FRANCHISE_UNIFIED_APEX_ARENA)', () => {
    const sector = new PredatorFranchiseUnifiedYautjaDefeatProtocolSector();

    const nonYautja = sector.evaluateAndTriggerProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_UNIFIED_APEX_ARENA'
    });
    assert.equal(nonYautja.protocolArmed, false);
    assert.equal(nonYautja.rejectionReason, 'REJECTED_NOT_YAUTJA');

    const yautjaAlive = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 80,
      levelConfiguration: 'PREDATOR_FRANCHISE_UNIFIED_APEX_ARENA'
    });
    assert.equal(yautjaAlive.protocolArmed, false);
    assert.equal(yautjaAlive.rejectionReason, 'REJECTED_YAUTJA_STILL_ALIVE');

    const wrongLevel = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_CLONE_VAULT'
    });
    assert.equal(wrongLevel.protocolArmed, false);
    assert.equal(wrongLevel.rejectionReason, 'REJECTED_WRONG_CONFIGURATION');

    const validTrigger = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_UNIFIED_APEX_ARENA'
    });
    assert.equal(validTrigger.protocolArmed, true);
    assert.deepEqual(validTrigger.glyphsEntered, ['᚛', 'ᚁ', 'ᚐ', 'ᚙ', '᚜']);
    assert.equal(validTrigger.franchiseApexArenaVaporized, true);
    assert.equal(validTrigger.honorAwarded, 500);
  });

  it('Chantier 8: HumanQaPredatorFranchiseCompletionHUDDirector telemetry and defeat widget update', () => {
    const auditor = new HumanQaPredatorFranchiseCompletionMasterAuditor();
    const cert = auditor.runFullCertification();
    const hud = new HumanQaPredatorFranchiseCompletionHUDDirector();
    assert.equal(hud.qaPlaytesterAudits.length, 5);
    assert.equal(cert.hudState.panelClass, 'predator-franchise-v201-completion-hud-panel');
    assert.equal(cert.hudState.defeatWidgetVisible, true);
    assert.equal(cert.hudState.defeatGlyphBanner, '᚛-ᚁ-ᚐ-ᚙ-᚜');
    assert.equal(cert.hudState.totalHonorDisplayed, 2950);
  });

  it('Chantier 9: HumanQaPredatorFranchiseCompletionMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPredatorFranchiseCompletionMasterAuditor();
    const result = auditor.runFullCertification();
    assert.equal(result.allSectorsCertified, true);
    assert.equal(result.rule3StrictVerified, true);
    assert.equal(result.webglDrawCalls.withinBudget, true);
    assert.ok(result.webglDrawCalls.estimated <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v201 SFX triggers', () => {
    const synth = audioSynth;
    const gridAcoustics = synth.computeCelticGridAlienNetAcidSizzleAcoustics({
      netTensionKn: 38,
      brokenPillarsCount: 3
    });
    assert.ok(gridAcoustics.wireSnapFrequencyHz > 2000);
    assert.ok(gridAcoustics.acidHissBandpassHz > 3500);
    assert.ok(gridAcoustics.carapaceEtchDurationSeconds >= 2.0);

    const flintlockAcoustics = synth.computeAdolini1715FlintlockBlackPowderAcoustics({
      muzzleVelocityMps: 265,
      preservedSurvivorsCount: 6
    });
    assert.ok(flintlockAcoustics.flintSparkTransientHz > 3800);
    assert.ok(flintlockAcoustics.blackPowderBoomFundamentalHz > 110);
    assert.equal(flintlockAcoustics.historicalEchoDecaySeconds, 2.7);

    const sfxMethods = [
      'playCanopyHueyWreckCreakSFX',
      'playMacRootTunnelTriLaserLockSFX',
      'playDillonDualMp5SeveredArmBurstSFX',
      'playHarriganCrownVicBarricadeRamSFX',
      'playArchuletaVentSpearTipPrySFX',
      'playCelticXenomorphPillarSlamSFX',
      'playGridAlienNetMeshAcidSizzleSFX',
      'playGunnisonStrykerRainAmbushSFX',
      'playGunnisonB61TacticalNukeShockwaveSFX',
      'playMsYutaniBriefcaseUnlockChimeSFX',
      'playClassicPredatorEarthStarMapHologramSFX',
      'playRoryMcKennaGauntletMatrixDecryptSFX',
      'playAdolini1715FlintlockMiqueletShotSFX',
      'playElderGreybackPistolTrophyTossSFX',
      'playPredatorFranchiseUnifiedNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof synth[method], 'function', `Missing SFX method: ${method}`);
      assert.doesNotThrow(() => synth[method]());
    }
  });
});
