import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Predator1987ValVerdeGeneralPhillipsBriefingAndGuerrillaTruckSector } from '../src/gameplay/Predator1987ValVerdeGeneralPhillipsBriefingAndGuerrillaTruckSector.js';
import { Predator21990LeonaAndJerrySubwayPursuitAndTonyPopeBriefcaseSector } from '../src/gameplay/Predator21990LeonaAndJerrySubwayPursuitAndTonyPopeBriefcaseSector.js';
import { Avp2004WeylandIcebreakerSatelliteScanAndInhalerTorchSector } from '../src/gameplay/Avp2004WeylandIcebreakerSatelliteScanAndInhalerTorchSector.js';
import { AvpRequiem2007ForestFatherSonHuntAndWolfTreehouseAcidDissolveSector } from '../src/gameplay/AvpRequiem2007ForestFatherSonHuntAndWolfTreehouseAcidDissolveSector.js';
import { Predators2010StansShivAndIsabelleNeurotoxinMercyShotSector } from '../src/gameplay/Predators2010StansShivAndIsabelleNeurotoxinMercyShotSector.js';
import { KillerOfKillersAndBadlands2025CompleteCodexSynthesisSector } from '../src/gameplay/KillerOfKillersAndBadlands2025CompleteCodexSynthesisSector.js';
import { PredatorFranchiseCompleteSagaYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseCompleteSagaYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseCompleteSagaHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseCompleteSagaHUDDirector.js';
import { HumanQaPredatorFranchiseCompleteSagaMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseCompleteSagaMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v203): Predator (1987) — General Phillips Briefing, Flaming Diesel Truck, Pole-Jack Drop & Knock-Knock Grenade Volley', () => {
  const sector = new Predator1987ValVerdeGeneralPhillipsBriefingAndGuerrillaTruckSector();

  const clasp = sector.completeDutchAndDillonArmWrestleBriefing({
    gripForceNewtons: 1450,
    ciaMissionAccepted: true
  });
  assert.equal(clasp.dutchDillonArmWrestleCompleted, true);
  assert.equal(clasp.gripForceNewtons, 1450);

  const truck = sector.launchFlamingDieselTruckIntoWatchtower({
    truckSpeedKmh: 46,
    watchtowerCollapsed: true
  });
  assert.equal(truck.flamingTruckLaunched, true);
  assert.equal(truck.watchtowerCollapsed, true);

  const pickup = sector.hoistPickupTruckOnPoleJackAndDrop({
    liftedMassKg: 1650,
    guerrillasCrushed: 2
  });
  assert.equal(pickup.pickupTruckDroppedOnGuerrillas, true);

  const cabin = sector.breachCommandCabinWithKnockKnockGrenadeVolley({
    grenadeRoundsFired: 6,
    intelligencePhotosCaptured: true
  });
  assert.equal(cabin.commandCabinBreachedWithGrenades, true);
  assert.equal(cabin.honorAwarded, 350);
});

test('Chantier 2 (v203): Predator 2 (1990) — Tony Pope Ejection, Jerry Lambert Subway Last Stand, Leona Ultrasound Mercy & Spine Trophy', () => {
  const sector = new Predator21990LeonaAndJerrySubwayPursuitAndTonyPopeBriefcaseSector();

  const pope = sector.ejectTabloidReporterTonyPopeFromCrimeScene({
    cameraConfiscated: true,
    perimeterResealed: true
  });
  assert.equal(pope.tonyPopeEjected, true);

  const jerry = sector.jerryLambertLastStandInStrobeSubwayCar({
    roundsFiredByJerry: 15,
    passengersEvacuatedByLeona: 18
  });
  assert.equal(jerry.jerryLastStandCompleted, true);
  assert.equal(jerry.passengersEvacuatedCount, 18);

  const leona = sector.scanLeonaCantrellWombWithBioMaskUltrasound({
    fetalHeartbeatBpm: 148,
    unarmedPregnantTargetSpared: true
  });
  assert.equal(leona.leonaSparedDueToPregnancyScan, true);

  const trophy = sector.claimJerryLambertSpineTrophyInSubwayRoof({
    skullAndSpineExtracted: true,
    harriganArrivesAtAftermath: true
  });
  assert.equal(trophy.jerryTrophyClaimedOnSubwayRoof, true);
  assert.equal(trophy.honorAwarded, 400);
});

test('Chantier 3 (v203): AVP (2004) — PS-12 Satellite Scan, 30-Degree Ice Tunnel Sled Slide, Lung Cancer X-Ray & Weyland Inhaler Torch', () => {
  const sector = new Avp2004WeylandIcebreakerSatelliteScanAndInhalerTorchSector();

  const ps12 = sector.lockPs12SatelliteOnBouvetoyaThermalBloom({
    depthMeters: 610,
    pyramidHeatSignatureConfirmed: true
  });
  assert.equal(ps12.ps12SatelliteLocked, true);

  const sled = sector.descendThirtyDegreeOrbitalIceTunnelOnSleds({
    tunnelAngleDegrees: 30,
    descentLengthMeters: 700
  });
  assert.equal(sled.thirtyDegreeIceTunnelDescended, true);

  const xray = sector.scarBioMaskXrayDetectsWeylandLungCancer({
    terminalLungTumorDetected: true,
    initialMercyGranted: true
  });
  assert.equal(xray.weylandLungCancerScannedByScar, true);

  const torch = sector.weylandIgniteMedicalInhalerFlamethrowerDefiance({
    flameTempCelsius: 820,
    forcedHonorRetaliation: true
  });
  assert.equal(torch.weylandInhalerTorchDefianceCompleted, true);
  assert.equal(torch.honorAwarded, 400);
});

test('Chantier 4 (v203): AVP: Requiem (2007) — Forest Lake Scout Wreck, Benson Treehouse Contamination, Blue Solvent & Sewer Laser Grid', () => {
  const sector = new AvpRequiem2007ForestFatherSonHuntAndWolfTreehouseAcidDissolveSector();

  const lake = sector.trackCrashedScoutShipInGunnisonForestLake({
    lakeDepthMeters: 12,
    blackboxHologramRetrieved: true
  });
  assert.equal(lake.forestLakeWreckInspected, true);

  const treehouse = sector.inspectBensonForestTreehouseContamination({
    chestbursterHusksFound: 2,
    royalFacehuggerTraceDetected: true
  });
  assert.equal(treehouse.treehouseContaminationLogged, true);

  const solvent = sector.dissolveTreehouseBiologicalEvidenceWithBlueSolvent({
    solventPhEquivalent: 14.0,
    bodiesDissolvedCount: 2
  });
  assert.equal(solvent.treehouseEvidenceDissolved, true);

  const laser = sector.sealForestSewerOutflowWithLaserContainmentGrid({
    laserNodesDeployed: 6,
    containmentActive: true
  });
  assert.equal(laser.sewerOutflowLaserGridSealed, true);
  assert.equal(laser.honorAwarded, 400);
});

test('Chantier 5 (v203): Predators (2010) & The Predator (2018) — Stans Shiv, Isabelle .50 BMG Snipe, Quinn Postal Relics & Rory Bio-Mask', () => {
  const sector = new Predators2010StansShivAndIsabelleNeurotoxinMercyShotSector();

  const stans = sector.stansLeapAndFuryStabBerserkerWithPrisonShiv({
    shivStrikesLanded: 9,
    distractionSecondsGained: 14
  });
  assert.equal(stans.stansShivDistractionCompleted, true);

  const isabelle = sector.isabelleParalyzedSnipeBerserkerWithFiftyCal({
    bulletKineticEnergyJoules: 15500,
    berserkerStaggered: true
  });
  assert.equal(isabelle.isabelleParalyzedFiftyCalShotLanded, true);

  const postal = sector.quinnMcKennaMailYautjaRelicsToGeorgiaPoBox({
    cloakingOrbSwallowed: true,
    packageDeliveredToRory: true
  });
  assert.equal(postal.quinnPostalRelicsDelivered, true);

  const rory = sector.roryActivateBioMaskShieldAgainstSuburbanBully({
    acousticWaveTriggered: true,
    neighborhoodSaved: true
  });
  assert.equal(rory.roryAcousticShieldTriggered, true);
  assert.equal(rory.honorAwarded, 450);
});

test('Chantier 6 (v203): Killer of Killers & Badlands (2025) — Ursa Fjord Ice Shield, Kiyoshi Twin Katana, Yautja Prime Crest & 9-Film Seal', () => {
  const sector = new KillerOfKillersAndBadlands2025CompleteCodexSynthesisSector();

  const ice = sector.shieldAndersBeneathVikingFjordIce({
    iceThicknessCm: 35,
    andersProtectedByUrsa: true,
    thermalSignatureMaskedByIce: true
  });
  assert.equal(ice.andersShieldedUnderFjordIce, true);

  const kiyoshi = sector.fightBackToBackWithSamuraiBrotherKiyoshi({
    katanaComboParries: 8,
    kiyoshiSacrificeHonored: true
  });
  assert.equal(kiyoshi.kiyoshiBackToBackCompleted, true);

  const crest = sector.mountWeylandYutaniAndKaliskCrestOnYautjaPrime({
    wyCrestMounted: true,
    kaliskHornMounted: true,
    kweiClaspMounted: true
  });
  assert.equal(crest.yautjaPrimeCrestMounted, true);

  const seal = sector.sealNineFilmFranchiseCanonSynthesis({
    totalCanonicalFilmsVerified: 9
  });
  assert.equal(seal.nineFilmCodexSealed, true);
  assert.equal(seal.canonicalFilms.length, 9);
  assert.equal(seal.honorAwarded, 500);
});

test('Chantier 7 (v203): Strict Rule 3 — Yautja Defeat Protocol triggers ONLY when isYautja === true, healthPoints <= 0, and configuration === PREDATOR_FRANCHISE_COMPLETE_SAGA_SANCTUM', () => {
  const sector = new PredatorFranchiseCompleteSagaYautjaDefeatProtocolSector();

  // Case 1: Human player loses in sanctum -> rejected
  const humanLoss = sector.evaluateCompleteSagaDefeatProtocol({
    isYautja: false,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_COMPLETE_SAGA_SANCTUM'
  });
  assert.equal(humanLoss.selfDestructTriggered, false);
  assert.equal(humanLoss.rejectionReason, 'PLAYER_NOT_YAUTJA');

  // Case 2: Yautja alive (HP > 0) in sanctum -> rejected
  const yautjaAlive = sector.evaluateCompleteSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 25,
    levelConfiguration: 'PREDATOR_FRANCHISE_COMPLETE_SAGA_SANCTUM'
  });
  assert.equal(yautjaAlive.selfDestructTriggered, false);
  assert.equal(yautjaAlive.rejectionReason, 'YAUTJA_STILL_ALIVE');

  // Case 3: Yautja loses (HP <= 0) in wrong configuration -> rejected
  const wrongConfig = sector.evaluateCompleteSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'STANDARD_JUNGLE_ARENA'
  });
  assert.equal(wrongConfig.selfDestructTriggered, false);
  assert.equal(wrongConfig.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');

  // Case 4: Yautja loses (HP <= 0) in PREDATOR_FRANCHISE_COMPLETE_SAGA_SANCTUM -> triggered!
  const validDefeat = sector.evaluateCompleteSagaDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_COMPLETE_SAGA_SANCTUM'
  });
  assert.equal(validDefeat.selfDestructTriggered, true);
  assert.deepEqual(validDefeat.glyphSequence, ['᚛', 'ᚃ', 'ᚒ', 'ᚙ', '᚜']);
  assert.equal(validDefeat.roarDecibels, 112);
  assert.equal(validDefeat.countdownSeconds, 15);
  assert.equal(validDefeat.blastRadiusMeters, 65);
  assert.equal(validDefeat.completeSagaSanctumVaporized, true);
  assert.equal(validDefeat.honorAwarded, 500);
});

test('Chantier 8 (v203): HumanQaPredatorFranchiseCompleteSagaHUDDirector & CSS HUD Styling', () => {
  const director = new HumanQaPredatorFranchiseCompleteSagaHUDDirector();
  assert.equal(director.qaPlaytesters.length, 5);

  const cssPath = path.resolve('src/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.predator-franchise-v203-complete-saga-hud-panel'));
  assert.ok(cssContent.includes('.predator-franchise-v203-complete-saga-row.yautja-defeat-complete-saga.armed'));
});

test('Chantier 9 (v203): AudioSynthesizer v203 Acoustic Helpers & 15 Canonical SFX Methods', () => {
  const synth = audioSynth;

  const ultrasound = synth.computeLeonaBioMaskFetalUltrasoundAcoustics({
    fetalHeartbeatBpm: 148,
    carrierUltrasonicKhz: 42
  });
  assert.equal(ultrasound.fetalHeartbeatBpm, 148);
  assert.equal(ultrasound.lifeSparedByCityHunter, true);

  const torch = synth.computeWeylandInhalerFlareTorchAcoustics({
    flameTempCelsius: 820,
    aerosolPressureBar: 6.5
  });
  assert.equal(torch.scarThermalAttentionTriggered, true);
  assert.ok(torch.roarCentroidHz > 900);

  const sfxMethods = [
    'playDutchDillonArmWrestleClaspSFX',
    'playFlamingDieselTruckWatchtowerCrashSFX',
    'playPonchoKnockKnockGrenadeVolleySFX',
    'playJerryLambertSubwayLastStandSFX',
    'playLeonaPregnancyUltrasoundScanChimeSFX',
    'playPs12SatelliteThermalLockBeepSFX',
    'playThirtyDegreeIceTunnelSledSlideSFX',
    'playWeylandInhalerFlamethrowerIgniteSFX',
    'playGunnisonForestLakeScoutCrashSFX',
    'playBensonTreehouseBlueSolventDissolveSFX',
    'playStansPrisonShivBerserkerFurySFX',
    'playIsabelleParalyzedFiftyCalSnipeSFX',
    'playRorySuburbanBioMaskAcousticWaveSFX',
    'playYautjaPrimeNineFilmTrophyWallSealSFX',
    'playPredatorFranchiseCompleteSagaNuclearPurgeSFX'
  ];

  for (const methodName of sfxMethods) {
    assert.equal(typeof synth[methodName], 'function', `Missing SFX method: ${methodName}`);
    assert.doesNotThrow(() => synth[methodName]());
  }
});

test('Chantier 10 (v203): HumanQaPredatorFranchiseCompleteSagaMasterAuditor End-to-End Verification & WebGL Draw Call Budget', () => {
  const auditor = new HumanQaPredatorFranchiseCompleteSagaMasterAuditor();
  const report = auditor.runFullCompleteSagaAudit();

  assert.equal(report.allSectorsPassed, true);
  assert.equal(report.rule3Verified, true);
  assert.equal(report.drawCallBudgetPassed, true);
  assert.ok(report.estimatedMothershipDrawCalls <= 300);
  assert.equal(report.totalHonorAwarded, 3000);
});
