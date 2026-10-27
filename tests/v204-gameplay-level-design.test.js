import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Predator1987BillySoleBridgeStandAndMudCamouflageSector } from '../src/gameplay/Predator1987BillySoleBridgeStandAndMudCamouflageSector.js';
import { Predator21990KingWillieAlleywayAndMeatLockerNitrogenSector } from '../src/gameplay/Predator21990KingWillieAlleywayAndMeatLockerNitrogenSector.js';
import { Avp2004ShiftingPyramidLabyrinthAndQueenChasmSinkSector } from '../src/gameplay/Avp2004ShiftingPyramidLabyrinthAndQueenChasmSinkSector.js';
import { AvpRequiem2007HospitalMaternityAndRooftopWhipDuelSector } from '../src/gameplay/AvpRequiem2007HospitalMaternityAndRooftopWhipDuelSector.js';
import { Predators2010HanzoKatanaDuelAndRoyceFireRingSector } from '../src/gameplay/Predators2010HanzoKatanaDuelAndRoyceFireRingSector.js';
import { Prey2022NaruBogHelmetInversionAndDekGlaiveSector } from '../src/gameplay/Prey2022NaruBogHelmetInversionAndDekGlaiveSector.js';
import { PredatorFranchiseGrandCanonYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseGrandCanonYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseGrandCanonHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseGrandCanonHUDDirector.js';
import { HumanQaPredatorFranchiseGrandCanonMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseGrandCanonMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v204): Predator (1987) — Billy Sole Bridge Machete Stand, Death Cry, Dutch River Mud Camouflage & Primal War Cry', () => {
  const sector = new Predator1987BillySoleBridgeStandAndMudCamouflageSector();

  const chest = sector.carveChestAndDiscardRifleOnFallenLogBridge({
    macheteSlashDepthCm: 1.5,
    rifleDiscardedInGorge: true
  });
  assert.equal(chest.billyChestCarvedAndRifleDiscarded, true);
  assert.equal(chest.macheteSlashDepthCm, 1.5);

  const stand = sector.executeBillySoleLoneWarriorStand({
    standDurationSeconds: 22,
    jungleEchoScreamDecibels: 104
  });
  assert.equal(stand.billyLoneStandCompleted, true);
  assert.equal(stand.jungleEchoScreamDecibels, 104);

  const mud = sector.coatDutchBodyInCoolingRiverMud({
    bodyTempDropCelsius: 14.5,
    thermalSignatureMasked: true
  });
  assert.equal(mud.dutchRiverMudCamouflageApplied, true);

  const trap = sector.craftSharpenedSpikeTripwireTrapAndWarCry({
    trapTensionNewtons: 2400,
    warCryDecibels: 115
  });
  assert.equal(trap.dutchSpikeTrapAndWarCryCompleted, true);
  assert.equal(trap.honorAwarded, 350);
});

test('Chantier 2 (v204): Predator 2 (1990) — King Willie Voodoo Oracle, Alleyway Decapitation, Meat-Locker Nitrogen & Smart Disc Bisect', () => {
  const sector = new Predator21990KingWillieAlleywayAndMeatLockerNitrogenSector();

  const oracle = sector.consultKingWillieVoodooOracleInMist({
    swordCaneDrawn: true,
    propheticWarningDelivered: true
  });
  assert.equal(oracle.kingWillieOracleConsulted, true);

  const skull = sector.executeKingWillieDecapitationAndSkullPolish({
    decapitationForceNewtons: 4800,
    spineExtractedCleanly: true
  });
  assert.equal(skull.kingWillieDuelAndSkullPolished, true);

  const nitrogen = sector.spraySlaughterhouseLiquidNitrogenOnCityHunter({
    nitrogenTempCelsius: -196,
    uvBeamGridLocked: true
  });
  assert.equal(nitrogen.slaughterhouseNitrogenAmbushTriggered, true);

  const duel = sector.sliceKeyesWithSmartDiscAndExecuteShotgunDuel({
    smartDiscCutVelocityKmh: 95,
    harriganSlugLanded: true
  });
  assert.equal(duel.keyesBisectedAndShotgunDuelResolved, true);
  assert.equal(duel.honorAwarded, 400);
});

test('Chantier 3 (v204): AVP (2004) — 10-Minute Shifting Pyramid Chambers, Sarcophagus Casters & Queen Whaling Chasm Sink', () => {
  const sector = new Avp2004ShiftingPyramidLabyrinthAndQueenChasmSinkSector();

  const shift = sector.shiftSubterraneanPyramidChambers({
    cycleMinutes: 10,
    stoneGearTorqueKiloNewtons: 850
  });
  assert.equal(shift.pyramidChambersShifted, true);

  const casters = sector.unlockSacrificialChamberPlasmaCasterSarcophagus({
    hieroglyphSequenceSolved: true,
    castersRecovered: 3
  });
  assert.equal(casters.plasmaCastersRecoveredFromSarcophagus, true);

  const tether = sector.tetherQueenXenomorphToWhalingWaterTower({
    ironChainTensionKiloNewtons: 420,
    waterTowerCoupled: true
  });
  assert.equal(tether.queenChainedToWaterTower, true);

  const drag = sector.dragQueenOverCollapsingIceCliffIntoAbyssalOcean({
    cliffHeightMeters: 85,
    queenSubmergedInAbyss: true
  });
  assert.equal(drag.queenDraggedIntoAbyssalOcean, true);
  assert.equal(drag.honorAwarded, 400);
});

test('Chantier 4 (v204): AVP: Requiem (2007) — Hospital Maternity Infiltration, Supersonic Tail Whip & Rooftop Duel', () => {
  const sector = new AvpRequiem2007HospitalMaternityAndRooftopWhipDuelSector();

  const spore = sector.trackPredalienSporeTrailToHospitalWard({
    sporeResidueMicrograms: 74,
    maternityWardBreached: true
  });
  assert.equal(spore.predalienSporeTrailTracked, true);

  const whip = sector.deployXenomorphTailBarbedWhipStrikes({
    whipCrackVelocityMps: 340,
    targetsDissevered: 4
  });
  assert.equal(whip.xenomorphTailWhipDeployed, true);

  const shuriken = sector.pinXenomorphDuoWithFoldingShuriken({
    dualShurikenThrown: true,
    concreteDepthMm: 65
  });
  assert.equal(shuriken.foldingShurikenDuoPinned, true);

  const roof = sector.executeThunderstormRooftopHandToHandClimax({
    lightningStrikesCount: 3,
    dualWristBladeImpale: true
  });
  assert.equal(roof.thunderstormRooftopClimaxResolved, true);
  assert.equal(roof.honorAwarded, 400);
});

test('Chantier 5 (v204): Predators (2010) & The Predator (2018) — Hanzo Tall Grass Katana Duel, Royce Fire Ring & Upgrade Hunter Pod', () => {
  const sector = new Predators2010HanzoKatanaDuelAndRoyceFireRingSector();

  const hanzo = sector.conductHanzoMoonlitTallGrassKatanaDuel({
    shoesDiscarded: true,
    simultaneousLethalStrike: true
  });
  assert.equal(hanzo.hanzoMoonlitKatanaDuelCompleted, true);

  const fire = sector.encircleBerserkerWithCampfireHeatRings({
    fireRingTempCelsius: 760,
    berserkerThermalBlinded: true
  });
  assert.equal(fire.berserkerThermalBlindedByFireRing, true);

  const axe = sector.severBerserkerHeadWithAxeCombatives({
    axeBlowForceNewtons: 6200,
    royceVictoryHonored: true
  });
  assert.equal(axe.berserkerAxeDecapitationCompleted, true);

  const pod = sector.interceptUpgradePredatorAcousticHoundsAndGauntletPod({
    houndAcousticSensorScrambled: true,
    predatorKillerPodSecured: true
  });
  assert.equal(pod.upgradeHoundScrambledAndPodSecured, true);
  assert.equal(pod.honorAwarded, 450);
});

test('Chantier 6 (v204): Prey (2022) & Badlands (2025) — Naru Orange Flower, Mud Bog Flechette Helmet Inversion & Dek Dual Glaive', () => {
  const sector = new Prey2022NaruBogHelmetInversionAndDekGlaiveSector();

  const flower = sector.consumeOrangeMedicinalFlowerAndDropCoreTemp({
    coreTempCelsius: 31.5,
    thermalVisionInvisible: true
  });
  assert.equal(flower.orangeFlowerConsumedAndCoreTempDropped, true);

  const bog = sector.baitFeralPredatorIntoQuicksandBog({
    bogSuctionForceNewtons: 3800,
    feralMiredInBog: true
  });
  assert.equal(bog.feralMiredInQuicksandBog, true);

  const helmet = sector.redirectHeatSeekingLaserHelmetIntoFeralSkull({
    laserTriangulationAligned: true,
    flechetteSelfHeadshotLanded: true
  });
  assert.equal(helmet.helmetFlechetteInversionHeadshotLanded, true);

  const glaive = sector.forgeDekDualPlasmaGlaiveWithKweiClasp({
    powerLoaderCoreTapped: true,
    dualGlaiveHarmonicHz: 660
  });
  assert.equal(glaive.dekDualPlasmaGlaiveForged, true);
  assert.equal(glaive.honorAwarded, 500);
});

test('Chantier 7 (v204): Strict Rule 3 — Yautja Defeat Protocol triggers ONLY when isYautja === true, healthPoints <= 0, and configuration === PREDATOR_FRANCHISE_GRAND_CANON_APEX_SANCTUM', () => {
  const sector = new PredatorFranchiseGrandCanonYautjaDefeatProtocolSector();

  // Case 1: Human player loses in sanctum -> rejected
  const humanLoss = sector.evaluateGrandCanonDefeatProtocol({
    isYautja: false,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_GRAND_CANON_APEX_SANCTUM'
  });
  assert.equal(humanLoss.selfDestructTriggered, false);
  assert.equal(humanLoss.rejectionReason, 'PLAYER_NOT_YAUTJA');

  // Case 2: Yautja alive (HP > 0) in sanctum -> rejected
  const yautjaAlive = sector.evaluateGrandCanonDefeatProtocol({
    isYautja: true,
    healthPoints: 35,
    levelConfiguration: 'PREDATOR_FRANCHISE_GRAND_CANON_APEX_SANCTUM'
  });
  assert.equal(yautjaAlive.selfDestructTriggered, false);
  assert.equal(yautjaAlive.rejectionReason, 'YAUTJA_STILL_ALIVE');

  // Case 3: Yautja loses (HP <= 0) in wrong configuration -> rejected
  const wrongConfig = sector.evaluateGrandCanonDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'STANDARD_JUNGLE_ARENA'
  });
  assert.equal(wrongConfig.selfDestructTriggered, false);
  assert.equal(wrongConfig.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');

  // Case 4: Yautja loses (HP <= 0) in PREDATOR_FRANCHISE_GRAND_CANON_APEX_SANCTUM -> triggered!
  const validDefeat = sector.evaluateGrandCanonDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_GRAND_CANON_APEX_SANCTUM'
  });
  assert.equal(validDefeat.selfDestructTriggered, true);
  assert.deepEqual(validDefeat.glyphSequence, ['᚛', 'ᚅ', 'ᚑ', 'ᚏ', '᚜']);
  assert.equal(validDefeat.roarDecibels, 114);
  assert.equal(validDefeat.countdownSeconds, 15);
  assert.equal(validDefeat.blastRadiusMeters, 65);
  assert.equal(validDefeat.grandCanonSanctumVaporized, true);
  assert.equal(validDefeat.honorAwarded, 500);
});

test('Chantier 8 (v204): HumanQaPredatorFranchiseGrandCanonHUDDirector & CSS HUD Styling', () => {
  const director = new HumanQaPredatorFranchiseGrandCanonHUDDirector();
  assert.equal(director.qaPlaytesters.length, 5);

  const cssPath = path.resolve('src/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.predator-franchise-v204-grand-canon-hud-panel'));
  assert.ok(cssContent.includes('.predator-franchise-v204-grand-canon-row.yautja-defeat-grand-canon.armed'));
});

test('Chantier 9 (v204): AudioSynthesizer v204 Acoustic Models & 15 Canonical SFX Triggers', () => {
  const synth = audioSynth;

  const heartbeat = synth.computeBillySoleLogBridgeHeartbeatAcoustics({
    heartbeatBpm: 160,
    gorgeWindShearMs: 18
  });
  assert.equal(heartbeat.heartbeatBpm, 160);
  assert.equal(heartbeat.warriorResolveLocked, true);

  const flechette = synth.computeNaruFlechetteHelmetInversionAcoustics({
    flechetteSpeedMps: 320,
    helmetResonanceKhz: 12.8
  });
  assert.equal(flechette.fatalInversionLanded, true);
  assert.ok(flechette.impactEnergyJoules > 2000);

  const sfxMethods = [
    'playBillySoleChestMacheteCarveSFX',
    'playDutchMudCamouflageRiverSloshSFX',
    'playKingWillieSwordCaneSlideSFX',
    'playMeatLockerNitrogenHissSFX',
    'playSmartDiscKeyesBisectSFX',
    'playShiftingPyramidMassiveStoneGearSFX',
    'playQueenXenomorphChainedWaterTowerDragSFX',
    'playWolfTailWhipCrackSFX',
    'playWolfFoldingShurikenWallEmbedSFX',
    'playHanzoTallGrassKatanaClashSFX',
    'playRoyceCampfireBlindingCrackSFX',
    'playUpgradePredatorExoskeletonRoarSFX',
    'playNaruOrangeFlowerHeartrateDropSFX',
    'playDekDualPlasmaGlaiveIgniteSFX',
    'playPredatorFranchiseGrandCanonNuclearPurgeSFX'
  ];

  for (const methodName of sfxMethods) {
    assert.equal(typeof synth[methodName], 'function', `Missing SFX method: ${methodName}`);
    assert.doesNotThrow(() => synth[methodName]());
  }
});

test('Chantier 10 (v204): HumanQaPredatorFranchiseGrandCanonMasterAuditor End-to-End Verification & WebGL Draw Call Budget', () => {
  const auditor = new HumanQaPredatorFranchiseGrandCanonMasterAuditor();
  const report = auditor.runFullGrandCanonAudit();

  assert.equal(report.allSectorsPassed, true);
  assert.equal(report.rule3Verified, true);
  assert.equal(report.drawCallBudgetPassed, true);
  assert.ok(report.estimatedMothershipDrawCalls <= 300);
  assert.equal(report.totalHonorAwarded, 3000);
});
