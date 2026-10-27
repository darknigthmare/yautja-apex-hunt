import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Predator1987MacScorpioHuntAndCounterweightTreeSector } from '../src/gameplay/Predator1987MacScorpioHuntAndCounterweightTreeSector.js';
import { Predator21990BathroomMedicompAndLostTribeCouncilSector } from '../src/gameplay/Predator21990BathroomMedicompAndLostTribeCouncilSector.js';
import { Avp2004SteppedPyramidFlashbackAndAcidTongueDaggerSector } from '../src/gameplay/Avp2004SteppedPyramidFlashbackAndAcidTongueDaggerSector.js';
import { AvpRequiem2007GunnisonPowerPlantBlackoutSector } from '../src/gameplay/AvpRequiem2007GunnisonPowerPlantBlackoutSector.js';
import { Predators2010CuchilloBaitAndClassicBerserkerClashSector } from '../src/gameplay/Predators2010CuchilloBaitAndClassicBerserkerClashSector.js';
import { Prey2022GrizzlyRiverCombatAndBadlandsThroneSector } from '../src/gameplay/Prey2022GrizzlyRiverCombatAndBadlandsThroneSector.js';
import { PredatorFranchiseUltimateSagaYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseUltimateSagaYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseUltimateSagaHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseUltimateSagaHUDDirector.js';
import { HumanQaPredatorFranchiseUltimateSagaMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseUltimateSagaMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v205): Predator (1987) — Mac Scorpio Crush, Phosphor Blood Trail, Counterweight Tree Drop & Respect Mercy', () => {
  const sector = new Predator1987MacScorpioHuntAndCounterweightTreeSector();

  const scorpio = sector.crushScorpionOnShoulderAndHumSong({
    scorpionCrushed: true,
    humDecibels: 42
  });
  assert.equal(scorpio.scorpionCrushedAndSongHummed, true);
  assert.equal(scorpio.humDecibels, 42);

  const phosphor = sector.trackLuminousPhosphorBloodDropletsInCanopy({
    dropletsFound: 5,
    greenGlowWavelengthNm: 520
  });
  assert.equal(phosphor.phosphorBloodTrailFollowed, true);
  assert.equal(phosphor.dropletsFound, 5);

  const tree = sector.triggerCounterweightTreeTrunkTrap({
    counterweightMassKg: 1850,
    dropHeightMeters: 6.2
  });
  assert.equal(tree.counterweightTreeTrunkDropped, true);
  assert.equal(tree.counterweightMassKg, 1850);

  const mercy = sector.spareCrushedYautjaHeadWithHeavyStone({
    warriorRespectHonored: true,
    mercyAwarded: true
  });
  assert.equal(mercy.pinnedYautjaSparedWithRespect, true);
  assert.equal(mercy.honorAwarded, 350);
});

test('Chantier 2 (v205): Predator 2 (1990) — Bathroom Medicomp Surgery, Window Agony Roar & Lost Tribe Adolini Flintlock', () => {
  const sector = new Predator21990BathroomMedicompAndLostTribeCouncilSector();

  const medicomp = sector.performEmergencyMedicompSeveredArmCauterization({
    coagulantInjectedMl: 12,
    tileShardMeltedTempCelsius: 680
  });
  assert.equal(medicomp.medicompEmergencySurgeryCompleted, true);
  assert.equal(medicomp.coagulantInjectedMl, 12);

  const roar = sector.unleashBathroomWindowRoarOfAgony({
    roarDecibels: 110,
    elderlyWitnessesTerrified: true
  });
  assert.equal(roar.bathroomWindowAgonyRoarDelivered, true);
  assert.equal(roar.roarDecibels, 110);

  const ship = sector.enterSubterraneanLostTribeMothership({
    eldersSurroundingCount: 9,
    mothershipDisguisedUnderSubway: true
  });
  assert.equal(ship.subterraneanMothershipEntered, true);
  assert.equal(ship.eldersSurroundingCount, 9);

  const flintlock = sector.receiveRaphaelAdolini1715FlintlockFromGreyback({
    elderGreybackSpokeTakeIt: true,
    flintlockSeizedByHarrigan: true
  });
  assert.equal(flintlock.adoliniFlintlockReceivedFromGreyback, true);
  assert.equal(flintlock.honorAwarded, 400);
});

test('Chantier 3 (v205): AVP (2004) — Stepped Pyramid 150 Xeno Swarm Flashback, Pharyngeal Jaw Dagger & Lex Acid Brand', () => {
  const sector = new Avp2004SteppedPyramidFlashbackAndAcidTongueDaggerSector();

  const flashback = sector.witnessAncientSteppedPyramidXenoSwarmFlashback({
    xenosSwarmingCount: 150,
    nuclearSelfDestructActivated: true
  });
  assert.equal(flashback.pyramidSwarmFlashbackWitnessed, true);
  assert.equal(flashback.xenosSwarmingCount, 150);

  const jaw = sector.sliceXenomorphInnerPharyngealJaw({
    innerJawSevered: true,
    jawTensileStrengthMpa: 420
  });
  assert.equal(jaw.innerPharyngealJawSevered, true);
  assert.equal(jaw.jawTensileStrengthMpa, 420);

  const dagger = sector.craftAcidResistantTongueDaggerAndLexShield({
    tongueDaggerCrafted: true,
    shieldChitinBound: true
  });
  assert.equal(dagger.acidResistantTongueDaggerCrafted, true);

  const brand = sector.brandLexCheekWithBubblingAcidBloodClanMark({
    acidFingerMarkApplied: true,
    blooodedWarriorStatusConferred: true
  });
  assert.equal(brand.lexCheekBloodedMarkBranded, true);
  assert.equal(brand.honorAwarded, 400);
});

test('Chantier 4 (v205): AVP: Requiem (2007) — Gunnison Substation Blackout, Cemetery Purge & Dual Shoulder Plasma Calibration', () => {
  const sector = new AvpRequiem2007GunnisonPowerPlantBlackoutSector();

  const blackout = sector.sabotageGunnisonElectricalSubstationGrid({
    transformerMegavoltsOverloaded: 115,
    townCastIntoDarkness: true
  });
  assert.equal(blackout.townCastIntoDarkness, true);
  assert.equal(blackout.transformerMegavoltsOverloaded, 115);

  const mortuary = sector.purgeInfestedCemeteryGroundskeeperAndMortuary({
    acidVialDisposed: true,
    mortuaryCleaned: true
  });
  assert.equal(mortuary.cemeteryAndMortuaryPurged, true);

  const casters = sector.synchronizeDualPlasmaCasterTargetingTriangles({
    leftCasterCalibrated: true,
    rightCasterCalibrated: true
  });
  assert.equal(casters.dualPlasmaCastersSynchronized, true);

  const nuke = sector.extractStevensBriefcaseBeforeB61TacticalNukeDetonation({
    blastDistanceKm: 12.5,
    briefcaseRetrievedForYutani: true
  });
  assert.equal(nuke.stevensBriefcaseExtractedBeforeNuke, true);
  assert.equal(nuke.honorAwarded, 400);
});

test('Chantier 5 (v205): Predators (2010) & The Predator (2018) — Cuchillo Mimic Bait, Classic vs Berserker & Forcefield Barrier', () => {
  const sector = new Predators2010CuchilloBaitAndClassicBerserkerClashSector();

  const mimic = sector.detectCuchilloAcousticMimicSniperTrap({
    mimicLoopIdentified: true,
    squadSavedFromCrossfire: true
  });
  assert.equal(mimic.cuchilloMimicTrapIdentified, true);

  const classic = sector.unleashFreedClassicPredatorAgainstBerserker({
    classicFreedFromTotem: true,
    twinRedMoonsIlluminating: true
  });
  assert.equal(classic.classicFreedToDuelBerserker, true);

  const spine = sector.witnessBerserkerSpineExtractionVictory({
    berserkerVictorious: true,
    classicHeadClaimed: true
  });
  assert.equal(spine.berserkerClassicSpineExtracted, true);

  const forcefield = sector.deploySubdermalForcefieldDecapitationBarrier({
    bulletResistantExoskeletonActive: true,
    forcefieldSliceWidthMm: 1.2
  });
  assert.equal(forcefield.ultimateForcefieldBarrierDeployed, true);
  assert.equal(forcefield.honorAwarded, 450);
});

test('Chantier 6 (v205): Prey (2022) & Badlands (2025) — Grizzly River Spine Snap, Expandable Bone Shield & 9 Trophies Pillar', () => {
  const sector = new Prey2022GrizzlyRiverCombatAndBadlandsThroneSector();

  const grizzly = sector.engageEightHundredPoundGrizzlyInRiverCombat({
    bearChargeForceNewtons: 9400,
    bearSpineSnappedOverhead: true
  });
  assert.equal(grizzly.grizzlyBearOverheadSpineSnapped, true);
  assert.equal(grizzly.bearChargeForceNewtons, 9400);

  const shield = sector.deployExpandableBoneShieldToBifurcateChargingFauna({
    shieldExpandedRadiusMeters: 1.1,
    cleanBifurcationLanded: true
  });
  assert.equal(shield.expandableBoneShieldBifurcationLanded, true);
  assert.equal(shield.shieldExpandedRadiusMeters, 1.1);

  const forest = sector.maneuverThroughFrenchTrapperCharredForestBurnout({
    steelBearTrapsAvoided: 8,
    taabeHorseDistractionSuccess: true
  });
  assert.equal(forest.charredForestTrapperTrapsEvaded, true);

  const pillar = sector.presentNineTrophiesOnYautjaPrimeObsidianPillar({
    trophiesCount: 9,
    elderCouncilThroneRecognized: true
  });
  assert.equal(pillar.nineTrophiesMountedOnObsidianPillar, true);
  assert.equal(pillar.honorAwarded, 500);
});

test('Chantier 7 (v205): Strict Rule 3 — Yautja Defeat Protocol triggers ONLY when isYautja === true, healthPoints <= 0, and configuration === PREDATOR_FRANCHISE_ULTIMATE_SAGA_APEX_SANCTUM', () => {
  const sector = new PredatorFranchiseUltimateSagaYautjaDefeatProtocolSector();

  // Case 1: Human player loses in sanctum -> rejected
  const humanLoss = sector.evaluateUltimateSagaDefeatProtocol({
    isYautja: false,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_ULTIMATE_SAGA_APEX_SANCTUM'
  });
  assert.equal(humanLoss.selfDestructTriggered, false);
  assert.equal(humanLoss.rejectionReason, 'PLAYER_NOT_YAUTJA');

  // Case 2: Yautja alive (HP > 0) in sanctum -> rejected
  const yautjaAlive = sector.evaluateUltimateSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 35,
    levelConfiguration: 'PREDATOR_FRANCHISE_ULTIMATE_SAGA_APEX_SANCTUM'
  });
  assert.equal(yautjaAlive.selfDestructTriggered, false);
  assert.equal(yautjaAlive.rejectionReason, 'YAUTJA_STILL_ALIVE');

  // Case 3: Yautja loses (HP <= 0) in wrong configuration -> rejected
  const wrongConfig = sector.evaluateUltimateSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'STANDARD_JUNGLE_ARENA'
  });
  assert.equal(wrongConfig.selfDestructTriggered, false);
  assert.equal(wrongConfig.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');

  // Case 4: Yautja loses (HP <= 0) in PREDATOR_FRANCHISE_ULTIMATE_SAGA_APEX_SANCTUM -> triggered!
  const validDefeat = sector.evaluateUltimateSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_ULTIMATE_SAGA_APEX_SANCTUM'
  });
  assert.equal(validDefeat.selfDestructTriggered, true);
  assert.deepEqual(validDefeat.glyphSequence, ['᚛', 'ᚈ', 'ᚎ', 'ᚘ', '᚜']);
  assert.equal(validDefeat.roarDecibels, 115);
  assert.equal(validDefeat.countdownSeconds, 15);
  assert.equal(validDefeat.blastRadiusMeters, 65);
  assert.equal(validDefeat.ultimateSagaSanctumVaporized, true);
  assert.equal(validDefeat.honorAwarded, 500);
});

test('Chantier 8 (v205): HumanQaPredatorFranchiseUltimateSagaHUDDirector & CSS HUD Styling', () => {
  const director = new HumanQaPredatorFranchiseUltimateSagaHUDDirector();
  assert.equal(director.qaPlaytesters.length, 5);

  const cssPath = path.resolve('src/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.predator-franchise-v205-ultimate-saga-hud-panel'));
  assert.ok(cssContent.includes('.predator-franchise-v205-ultimate-saga-row.yautja-defeat-ultimate-saga.armed'));
});

test('Chantier 9 (v205): AudioSynthesizer v205 Acoustic Models & 15 Canonical SFX Triggers', () => {
  const synth = audioSynth;

  const scorpio = synth.computeMacScorpioCrushAcoustics({
    humFreqHz: 110,
    branchSnapNewtons: 850
  });
  assert.equal(scorpio.humFreqHz, 110);
  assert.equal(scorpio.scorpioCrushConfirmed, true);

  const grizzly = synth.computeGrizzlyRiverCombatAcoustics({
    bearRoarDb: 108,
    riverSplashFlowRateLps: 320
  });
  assert.equal(grizzly.apexPredationRecognized, true);
  assert.ok(grizzly.splashCentroidHz > 500);

  const sfxMethods = [
    'playMacScorpioHummingAndCrushSFX',
    'playPhosphorGreenBloodDripCanopySFX',
    'playCounterweightTreeTrunkCrushSFX',
    'playBathroomMedicompTileMeltSFX',
    'playLostTribeMothershipDustBlastSFX',
    'playAncientSteppedPyramidNuclearFlashbackSFX',
    'playPharyngealTongueDaggerCarveSFX',
    'playGunnisonSubstationPowerGridBlackoutSFX',
    'playDualPlasmaCasterTriangulationToneSFX',
    'playCuchilloMimicTapeDistortionSFX',
    'playClassicVsBerserkerHeadRipSFX',
    'playSubdermalForcefieldHumSliceSFX',
    'playGrizzlyBearRiverOverheadSnapSFX',
    'playYautjaPrimeNineTrophyPillarSlamSFX',
    'playPredatorFranchiseUltimateSagaNuclearPurgeSFX'
  ];

  for (const methodName of sfxMethods) {
    assert.equal(typeof synth[methodName], 'function', `Missing SFX method: ${methodName}`);
    assert.doesNotThrow(() => synth[methodName]());
  }
});

test('Chantier 10 (v205): HumanQaPredatorFranchiseUltimateSagaMasterAuditor End-to-End Verification & WebGL Draw Call Budget', () => {
  const auditor = new HumanQaPredatorFranchiseUltimateSagaMasterAuditor();
  const report = auditor.runFullUltimateSagaAudit();

  assert.equal(report.allSectorsPassed, true);
  assert.equal(report.rule3Verified, true);
  assert.equal(report.drawCallBudgetPassed, true);
  assert.ok(report.estimatedMothershipDrawCalls <= 300);
  assert.equal(report.totalHonorAwarded, 3000);
});
