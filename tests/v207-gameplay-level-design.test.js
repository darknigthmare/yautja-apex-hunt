import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Predator1987UnmaskingHissAndBareKnuckleDuelSector } from '../src/gameplay/Predator1987UnmaskingHissAndBareKnuckleDuelSector.js';
import { Predator21990ScorpioHeatwaveShootoutAndGargoyleSpearSector } from '../src/gameplay/Predator21990ScorpioHeatwaveShootoutAndGargoyleSpearSector.js';
import { Avp2004WhalingStationBlizzardAmbushSector } from '../src/gameplay/Avp2004WhalingStationBlizzardAmbushSector.js';
import { AvpRequiem2007HighSchoolPoolAndCombiStickClashSector } from '../src/gameplay/AvpRequiem2007HighSchoolPoolAndCombiStickClashSector.js';
import { Predators2010WaterfallJumpAndShipHullZeroGSector } from '../src/gameplay/Predators2010WaterfallJumpAndShipHullZeroGSector.js';
import { Prey2022CougarTreeHuntAndEternalApexThroneSector } from '../src/gameplay/Prey2022CougarTreeHuntAndEternalApexThroneSector.js';
import { PredatorFranchiseEternalApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseEternalApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseEternalApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseEternalApexHUDDirector.js';
import { HumanQaPredatorFranchiseEternalApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseEternalApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v207): Predator (1987) — Biomask Pneumatic Hiss, "Ugly Motherfucker" Face-Off & Bare-Knuckle Beatdown', () => {
  const sector = new Predator1987UnmaskingHissAndBareKnuckleDuelSector();

  const hiss = sector.disconnectBiomaskHoseAndVentPneumaticHiss({
    pneumaticPressureKpa: 380,
    maskDroppedInMud: true
  });
  assert.equal(hiss.biomaskHoseDisconnected, true);
  assert.equal(hiss.pneumaticPressureKpa, 380);

  const quote = sector.revealJungleHunterMandiblesAndDeliverUglyQuote({
    mandiblesSpreadAngleDegrees: 68,
    quoteDelivered: true
  });
  assert.equal(quote.uglyMotherfuckerQuoteDelivered, true);
  assert.equal(quote.mandiblesSpreadAngleDegrees, 68);

  const brawl = sector.endureBareKnuckleTreeThrowBeatdown({
    punchForceNewtons: 7400,
    dutchThrownIntoTrunk: true
  });
  assert.equal(brawl.bareKnuckleBeatdownEndured, true);
  assert.equal(brawl.punchForceNewtons, 7400);

  const lure = sector.lureHunterUnderneathCounterweightTrapDropZone({
    hunterPositionLocked: true,
    triggerVinePrimed: true
  });
  assert.equal(lure.hunterLuredUnderneathCounterweight, true);
  assert.equal(lure.honorAwarded, 350);
});

test('Chantier 2 (v207): Predator 2 (1990) — 109°F Scorpio Heatwave Shootout, Gargoyle Lightning Spear & Non-Ferrous Alloy', () => {
  const sector = new Predator21990ScorpioHeatwaveShootoutAndGargoyleSpearSector();

  const shootout = sector.breachScorpioCartelPenthouseInHeatwave({
    ambientTempFahrenheit: 109,
    scorpioGunnersDowned: 6
  });
  assert.equal(shootout.scorpioPenthouseBreached, true);
  assert.equal(shootout.ambientTempFahrenheit, 109);

  const lightning = sector.hoistCombiSpearAloftGargoyleInLightningStorm({
    lightningCurrentKiloAmps: 45,
    lightningSpearAloft: true
  });
  assert.equal(lightning.gargoyleLightningSpearAloft, true);
  assert.equal(lightning.lightningCurrentKiloAmps, 45);

  const forensics = sector.extractDannyArchuletaSpearTipNonFerrousAlloy({
    atomicWeightOffChart: true,
    periodicTableAnomalyConfirmed: true
  });
  assert.equal(forensics.spearTipNonFerrousAlloyConfirmed, true);

  const roof = sector.cornerElScorpioOnSizzlingAsphaltRooftop({
    rooftopPursuitResolved: true,
    harriganVictorious: true
  });
  assert.equal(roof.elScorpioCorneredOnRooftop, true);
  assert.equal(roof.honorAwarded, 400);
});

test('Chantier 3 (v207): AVP (2004) — Bouvetøya 1904 Whaling Station, Adolescent Trio Descent & 2,000-Foot Shaft Sled Launch', () => {
  const sector = new Avp2004WhalingStationBlizzardAmbushSector();

  const station = sector.exploreBouvetoyaAbandonedWhalingStation({
    stationExplored: true,
    boreholeRigLocated: true
  });
  assert.equal(station.bouvetoyaStationExplored, true);

  const trio = sector.descendAdolescentYautjaTrioInBlizzard({
    scarDeployed: true,
    celticDeployed: true,
    chopperDeployed: true
  });
  assert.equal(trio.adolescentYautjaTrioDescended, true);

  const guards = sector.neutralizeWeylandMercenaryPerimeterInSnow({
    guardsNeutralizedCount: 8,
    thermalStealthCloakActive: true
  });
  assert.equal(guards.weylandMercenaryPerimeterNeutralized, true);
  assert.equal(guards.guardsNeutralizedCount, 8);

  const shaft = sector.breachTwoThousandFootIceShaftEntrance({
    shaftDepthMeters: 610,
    sledLaunchSecured: true
  });
  assert.equal(shaft.verticalIceShaftBreached, true);
  assert.equal(shaft.honorAwarded, 400);
});

test('Chantier 4 (v207): AVP: Requiem (2007) — High School Pool Sonic Mines, Combi-Stick Brawl & Hospital Roof Scramble', () => {
  const sector = new AvpRequiem2007HighSchoolPoolAndCombiStickClashSector();

  const pool = sector.trackPredalienIntoHighSchoolSwimmingPool({
    poolWaterContaminated: true,
    predalienSubmerged: true
  });
  assert.equal(pool.poolWaterContaminatedAndTracked, true);

  const mines = sector.deployDissolvingFluidAndSonicProximityMines({
    fluidCanistersDeployed: 3,
    sonicMinesArmed: 2
  });
  assert.equal(mines.dissolvingFluidAndSonicMinesDeployed, true);

  const clash = sector.engagePredalienInCorridorCombiStickClash({
    combiStickImpactJoules: 7800,
    parrySuccess: true
  });
  assert.equal(clash.corridorCombiStickClashResolved, true);
  assert.equal(clash.combiStickImpactJoules, 7800);

  const scramble = sector.scrambleToHospitalEvacuationRooftopZone({
    survivorsEscorted: 4,
    rooftopClearanceConfirmed: true
  });
  assert.equal(scramble.survivorsEscortedToHospitalRoof, true);
  assert.equal(scramble.honorAwarded, 400);
});

test('Chantier 5 (v207): Predators (2010) & The Predator (2018) — Hell-Hound Waterfall Leap & Zero-G Ship Turbine Sabotage', () => {
  const sector = new Predators2010WaterfallJumpAndShipHullZeroGSector();

  const hounds = sector.evadeHellHoundPackThroughAlienJungle({
    houndsPursuingCount: 6,
    hornTusksEvaded: true
  });
  assert.equal(hounds.hellHoundPackEvaded, true);
  assert.equal(hounds.houndsPursuingCount, 6);

  const leap = sector.leapOffSixtyMeterWaterfallCliffIntoDeepPool({
    cliffDropMeters: 60,
    waterImpactSurvived: true
  });
  assert.equal(leap.sixtyMeterWaterfallLeapSurvived, true);
  assert.equal(leap.cliffDropMeters, 60);

  const hull = sector.climbExteriorAscendingShipHullInZeroG({
    exteriorHullClimbed: true,
    atmosphericReentrySurvived: true
  });
  assert.equal(hull.exteriorAscendingShipHullClimbed, true);

  const sabotage = sector.sliceShipForcefieldTurbineWithGauntletBlade({
    gauntletEnergyBladeActive: true,
    driveCoreSabotaged: true
  });
  assert.equal(sabotage.shipForcefieldTurbineSabotaged, true);
  assert.equal(sabotage.honorAwarded, 450);
});

test('Chantier 6 (v207): Prey (2022) & Badlands (2025) — Cougar Tree Hunt, French Musket Bone Shield & Eternal Apex Throne', () => {
  const sector = new Prey2022CougarTreeHuntAndEternalApexThroneSector();

  const cougar = sector.trackMountainLionCougarIntoHighCanopy({
    cougarSpottedInBranch: true,
    bowTensionDrawn: true
  });
  assert.equal(cougar.cougarSpottedAndBowDrawn, true);

  const musket = sector.deflectFrenchVoyageurMusketVolleyWithBoneShield({
    musketBallsDeflected: 12,
    boneShieldExpanded: true
  });
  assert.equal(musket.frenchMusketVolleyDeflected, true);
  assert.equal(musket.musketBallsDeflected, 12);

  const sarii = sector.retrieveSariiAndDeployMedicinalAmbushCooling({
    sariiRecovered: true,
    medicinalFlowerChewed: true
  });
  assert.equal(sarii.sariiRecoveredAndFlowerChewed, true);

  const throne = sector.consecrateEternalApexThroneOnYautjaPrime({
    nineSagasUnified: true,
    councilGrandChieftainCoronated: true
  });
  assert.equal(throne.eternalApexThroneConsecrated, true);
  assert.equal(throne.honorAwarded, 500);
});

test('Chantier 7 (v207): Strict Rule 3 — Yautja Defeat Protocol triggers ONLY when isYautja === true, healthPoints <= 0, and configuration === PREDATOR_FRANCHISE_ETERNAL_APEX_SANCTUM', () => {
  const sector = new PredatorFranchiseEternalApexYautjaDefeatProtocolSector();

  // Case 1: Human player loses in sanctum -> rejected
  const humanLoss = sector.evaluateEternalApexDefeatProtocol({
    isYautja: false,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_ETERNAL_APEX_SANCTUM'
  });
  assert.equal(humanLoss.selfDestructTriggered, false);
  assert.equal(humanLoss.rejectionReason, 'PLAYER_NOT_YAUTJA');

  // Case 2: Yautja alive (HP > 0) in sanctum -> rejected
  const yautjaAlive = sector.evaluateEternalApexDefeatProtocol({
    isYautja: true,
    healthPoints: 35,
    levelConfiguration: 'PREDATOR_FRANCHISE_ETERNAL_APEX_SANCTUM'
  });
  assert.equal(yautjaAlive.selfDestructTriggered, false);
  assert.equal(yautjaAlive.rejectionReason, 'YAUTJA_STILL_ALIVE');

  // Case 3: Yautja loses (HP <= 0) in wrong configuration -> rejected
  const wrongConfig = sector.evaluateEternalApexDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'STANDARD_JUNGLE_ARENA'
  });
  assert.equal(wrongConfig.selfDestructTriggered, false);
  assert.equal(wrongConfig.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');

  // Case 4: Yautja loses (HP <= 0) in PREDATOR_FRANCHISE_ETERNAL_APEX_SANCTUM -> triggered!
  const validDefeat = sector.evaluateEternalApexDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_ETERNAL_APEX_SANCTUM'
  });
  assert.equal(validDefeat.selfDestructTriggered, true);
  assert.deepEqual(validDefeat.glyphSequence, ['᚛', 'ᚍ', 'ᚒ', '᚛', '᚜']);
  assert.equal(validDefeat.roarDecibels, 117);
  assert.equal(validDefeat.countdownSeconds, 15);
  assert.equal(validDefeat.blastRadiusMeters, 65);
  assert.equal(validDefeat.eternalApexSanctumVaporized, true);
  assert.equal(validDefeat.honorAwarded, 500);
});

test('Chantier 8 (v207): HumanQaPredatorFranchiseEternalApexHUDDirector & CSS HUD Styling', () => {
  const director = new HumanQaPredatorFranchiseEternalApexHUDDirector();
  assert.equal(director.qaPlaytesters.length, 5);

  const cssPath = path.resolve('src/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.predator-franchise-v207-eternal-apex-hud-panel'));
  assert.ok(cssContent.includes('.predator-franchise-v207-eternal-apex-row.yautja-defeat-eternal-apex.armed'));
});

test('Chantier 9 (v207): AudioSynthesizer v207 Acoustic Models & 15 Canonical SFX Triggers', () => {
  const synth = audioSynth;

  const hiss = synth.computePneumaticBiomaskHissAcoustics({
    pneumaticPressureKpa: 380,
    ventDurationMs: 450
  });
  assert.equal(hiss.pneumaticPressureKpa, 380);
  assert.equal(hiss.unmaskPneumaticVented, true);

  const lightning = synth.computeLightningSpearGargoyleAcoustics({
    lightningCurrentKa: 45,
    thunderDecibels: 120
  });
  assert.equal(lightning.combiSpearLightningChanneled, true);
  assert.ok(lightning.ionizationFrequencyKhz > 15);

  const sfxMethods = [
    'playPneumaticBiomaskHissSFX',
    'playUglyMotherfuckerMandiblesRoarSFX',
    'playBareKnuckleTreeImpactThudSFX',
    'playLightningSpearGargoyleStrikeSFX',
    'playNonFerrousSpearTipAnalysisChimeSFX',
    'playWhalingStationBlizzardHowlSFX',
    'playAdolescentTrioLandingDropSFX',
    'playPoolDissolvingFluidHissSFX',
    'playSonicProximityMinePulseSFX',
    'playWaterfallSixtyMeterSplashSFX',
    'playShipHullZeroGFreefallWindSFX',
    'playGauntletTurbineEnergySliceSFX',
    'playCougarHighBranchGrowlSFX',
    'playEternalApexGrandCouncilGongSFX',
    'playPredatorFranchiseEternalApexNuclearPurgeSFX'
  ];

  for (const methodName of sfxMethods) {
    assert.equal(typeof synth[methodName], 'function', `Missing SFX method: ${methodName}`);
    assert.doesNotThrow(() => synth[methodName]());
  }
});

test('Chantier 10 (v207): HumanQaPredatorFranchiseEternalApexMasterAuditor End-to-End Verification & WebGL Draw Call Budget', () => {
  const auditor = new HumanQaPredatorFranchiseEternalApexMasterAuditor();
  const report = auditor.runFullEternalApexAudit();

  assert.equal(report.allSectorsPassed, true);
  assert.equal(report.rule3Verified, true);
  assert.equal(report.drawCallBudgetPassed, true);
  assert.ok(report.estimatedMothershipDrawCalls <= 300);
  assert.equal(report.totalHonorAwarded, 3000);
});
