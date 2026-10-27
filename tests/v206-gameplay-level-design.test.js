import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Predator1987OldPainlessMinigunContactVolleySector } from '../src/gameplay/Predator1987OldPainlessMinigunContactVolleySector.js';
import { Predator21990MeatLockerIthacaShotgunAndRooftopNetCutSector } from '../src/gameplay/Predator21990MeatLockerIthacaShotgunAndRooftopNetCutSector.js';
import { Avp2004LexScarDualShieldSpearAndPredalienAltarSector } from '../src/gameplay/Avp2004LexScarDualShieldSpearAndPredalienAltarSector.js';
import { AvpRequiem2007WolfDualPlasmaPistolAndSewerLaserGridSector } from '../src/gameplay/AvpRequiem2007WolfDualPlasmaPistolAndSewerLaserGridSector.js';
import { Predators2010NikolaiClaymoreStandAndHybridDnaCodexSector } from '../src/gameplay/Predators2010NikolaiClaymoreStandAndHybridDnaCodexSector.js';
import { Prey2022TomahawkCordKineticDropAndDekThiaBudSynergySector } from '../src/gameplay/Prey2022TomahawkCordKineticDropAndDekThiaBudSynergySector.js';
import { PredatorFranchiseSovereignApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseSovereignApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseSovereignApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseSovereignApexHUDDirector.js';
import { HumanQaPredatorFranchiseSovereignApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseSovereignApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v206): Predator (1987) — Old Painless 3,000 RPM Defoliation, Mac Contact! Volley & Extraction Regroup', () => {
  const sector = new Predator1987OldPainlessMinigunContactVolleySector();

  const minigun = sector.spinUpOldPainlessMinigunAndDefoliateCanopy({
    rpmRate: 3000,
    roundsFired: 1200
  });
  assert.equal(minigun.oldPainlessSpunUpAndDefoliated, true);
  assert.equal(minigun.rpmRate, 3000);

  const contact = sector.executeMacContactJungleWallOfLeadVolley({
    squadRoundsExpended: 8500,
    jungleAcreMowedPercent: 95
  });
  assert.equal(contact.macContactVolleyExecuted, true);
  assert.equal(contact.squadRoundsExpended, 8500);

  const wound = sector.inspectBlainPlasmaChestCavityWound({
    plasmaBurnRadiusCm: 18,
    cauterizedWoundVerified: true
  });
  assert.equal(wound.blainPlasmaWoundInspected, true);

  const regroup = sector.regroupSquadAtRiverbankExtractionPerimeter({
    survivorsRegrouped: 5,
    perimeterSecured: true
  });
  assert.equal(regroup.squadRegroupedAtPerimeter, true);
  assert.equal(regroup.honorAwarded, 350);
});

test('Chantier 2 (v206): Predator 2 (1990) — Ithaca Shotgun Carcass Blast, Forearm Sever & Rooftop Smart Disc Net Cut', () => {
  const sector = new Predator21990MeatLockerIthacaShotgunAndRooftopNetCutSector();

  const shotgun = sector.dischargeIthacaShotgunThroughBeefCarcasses({
    roundsFired: 8,
    leadBuckshotForceJoules: 3800
  });
  assert.equal(shotgun.ithacaShotgunDischargedThroughBeef, true);

  const sever = sector.severCityHunterLeftForearmWithSmartDisc({
    armCutClean: true,
    discReturnTrappedInLedge: true
  });
  assert.equal(sever.cityHunterForearmSevered, true);

  const net = sector.sliceWireNetMeshWithSmartDiscOnRainyRooftop({
    netCablesSevered: 16,
    harriganFreeFromNet: true
  });
  assert.equal(net.wireNetCablesSlicedWithDisc, true);

  const drop = sector.pursueCityHunterDownWaterTowerLedge({
    ledgeDropMeters: 45,
    bathroomEntryWitnessed: true
  });
  assert.equal(drop.cityHunterLedgeDropPursued, true);
  assert.equal(drop.honorAwarded, 400);
});

test('Chantier 3 (v206): AVP (2004) — Lex Alien Dome Shield Acid Deflection, Tail Spear Thrust & Predalien Altar Eruption', () => {
  const sector = new Avp2004LexScarDualShieldSpearAndPredalienAltarSector();

  const shield = sector.deployLexAlienDomeShieldAgainstAcidSpray({
    shieldDeflectionAngleDegrees: 45,
    acidRepelled: true
  });
  assert.equal(shield.domeShieldAcidDeflected, true);

  const spear = sector.executeScarTailSpearSynchronizedThrust({
    spearThrustForceNewtons: 4200,
    dronesDecapitated: 3
  });
  assert.equal(spear.tailSpearDroneDecapitated, true);

  const altar = sector.layScarBodyOnCeremonialMothershipAltar({
    elderSaluteCompleted: true,
    combiSpearHonored: true
  });
  assert.equal(altar.scarLaidOnCeremonialAltar, true);

  const predalien = sector.witnessPredalienChestbursterEmergenceOnAltar({
    chestbursterErupted: true,
    mandiblesIdentified: true
  });
  assert.equal(predalien.predalienChestbursterEmerged, true);
  assert.equal(predalien.honorAwarded, 400);
});

test('Chantier 4 (v206): AVP: Requiem (2007) — Wolf Plasma Pistol Conversion, Sewer Laser Grid & Airborne Facehuggers', () => {
  const sector = new AvpRequiem2007WolfDualPlasmaPistolAndSewerLaserGridSector();

  const pistol = sector.convertDamagedCasterIntoHandheldPlasmaPistol({
    plasmaChargeJoules: 9200,
    conversionSuccessful: true
  });
  assert.equal(pistol.plasmaPistolConverted, true);

  const grid = sector.deployThreePointProximityLaserMeshInSewer({
    laserNodesCount: 3,
    sewerTunnelSealed: true
  });
  assert.equal(grid.sewerLaserGridDeployed, true);

  const facehuggers = sector.sliceAirborneFacehuggersWithLaserGrid({
    facehuggersBisectedCount: 6,
    containmentMaintained: true
  });
  assert.equal(facehuggers.airborneFacehuggersBisected, true);

  const collapse = sector.dischargeChargedPlasmaPistolIntoSportsBarClimbers({
    plasmaBoltsFired: 4,
    structuralCollapseTriggered: true
  });
  assert.equal(collapse.chargedPlasmaBoltsDischarged, true);
  assert.equal(collapse.honorAwarded, 400);
});

test('Chantier 5 (v206): Predators (2010) & The Predator (2018) — Nikolai Dual Claymore Rig & Hybrid DNA Decryption', () => {
  const sector = new Predators2010NikolaiClaymoreStandAndHybridDnaCodexSector();

  const claymores = sector.primeDualChestMountedClaymoresForTracker({
    pinsPulled: 2,
    steelBallBearingsCount: 1400
  });
  assert.equal(claymores.dualClaymoresPrimed, true);

  const blast = sector.detonateNikolaiChestRigToObliterateTracker({
    pointBlankBlastJoules: 24000,
    trackerObliterated: true
  });
  assert.equal(blast.trackerObliteratedInChestBlast, true);

  const dna = sector.decodeFugitivePredatorHumanHybridDnaSequences({
    hybridBasePairsDecoded: 46000,
    geneticSpinalTrophyVerified: true
  });
  assert.equal(dna.hybridDnaSequencesDecoded, true);

  const casket = sector.securePredatorKillerExosuitTransportCasket({
    bioArmorTransportLocked: true,
    zeroGThrustersSecured: true
  });
  assert.equal(casket.predatorKillerCasketSecured, true);
  assert.equal(casket.honorAwarded, 450);
});

test('Chantier 6 (v206): Prey (2022) & Badlands (2025) — Naru Tomahawk Cord Recoil Drop & Dek/Thia/Bud Sovereign Apex', () => {
  const sector = new Prey2022TomahawkCordKineticDropAndDekThiaBudSynergySector();

  const cord = sector.bindRawhideCordToBoneTomahawk({
    cordTensileStrengthNewtons: 2200,
    cordLengthMeters: 8.5
  });
  assert.equal(cord.rawhideCordBoundToTomahawk, true);

  const drop = sector.executeKineticTomahawkRecoilStrikeAndCanopyDrop({
    tomahawkThrowDistanceMeters: 7.8,
    kineticRecoilRetrieved: true
  });
  assert.equal(drop.kineticTomahawkRecoilDropLanded, true);

  const synergy = sector.coordinateThiaPredictiveOpticsWithBudUltrasoundClicks({
    ultrasoundStunKhz: 48,
    predictiveInterceptMs: 14
  });
  assert.equal(synergy.thiaBudPredictiveSynergyLocked, true);

  const apex = sector.igniteDekDualGlaiveInSovereignApexAscension({
    highCouncilArenaSealed: true,
    sovereignApexStatusAchieved: true
  });
  assert.equal(apex.sovereignApexStatusAchieved, true);
  assert.equal(apex.honorAwarded, 500);
});

test('Chantier 7 (v206): Strict Rule 3 — Yautja Defeat Protocol triggers ONLY when isYautja === true, healthPoints <= 0, and configuration === PREDATOR_FRANCHISE_SOVEREIGN_APEX_SANCTUM', () => {
  const sector = new PredatorFranchiseSovereignApexYautjaDefeatProtocolSector();

  // Case 1: Human player loses in sanctum -> rejected
  const humanLoss = sector.evaluateSovereignApexDefeatProtocol({
    isYautja: false,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_SOVEREIGN_APEX_SANCTUM'
  });
  assert.equal(humanLoss.selfDestructTriggered, false);
  assert.equal(humanLoss.rejectionReason, 'PLAYER_NOT_YAUTJA');

  // Case 2: Yautja alive (HP > 0) in sanctum -> rejected
  const yautjaAlive = sector.evaluateSovereignApexDefeatProtocol({
    isYautja: true,
    healthPoints: 35,
    levelConfiguration: 'PREDATOR_FRANCHISE_SOVEREIGN_APEX_SANCTUM'
  });
  assert.equal(yautjaAlive.selfDestructTriggered, false);
  assert.equal(yautjaAlive.rejectionReason, 'YAUTJA_STILL_ALIVE');

  // Case 3: Yautja loses (HP <= 0) in wrong configuration -> rejected
  const wrongConfig = sector.evaluateSovereignApexDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'STANDARD_JUNGLE_ARENA'
  });
  assert.equal(wrongConfig.selfDestructTriggered, false);
  assert.equal(wrongConfig.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');

  // Case 4: Yautja loses (HP <= 0) in PREDATOR_FRANCHISE_SOVEREIGN_APEX_SANCTUM -> triggered!
  const validDefeat = sector.evaluateSovereignApexDefeatProtocol({
    isYautja: true,
    healthPoints: 0,
    levelConfiguration: 'PREDATOR_FRANCHISE_SOVEREIGN_APEX_SANCTUM'
  });
  assert.equal(validDefeat.selfDestructTriggered, true);
  assert.deepEqual(validDefeat.glyphSequence, ['᚛', 'ᚉ', 'ᚒ', 'ᚚ', '᚜']);
  assert.equal(validDefeat.roarDecibels, 116);
  assert.equal(validDefeat.countdownSeconds, 15);
  assert.equal(validDefeat.blastRadiusMeters, 65);
  assert.equal(validDefeat.sovereignApexSanctumVaporized, true);
  assert.equal(validDefeat.honorAwarded, 500);
});

test('Chantier 8 (v206): HumanQaPredatorFranchiseSovereignApexHUDDirector & CSS HUD Styling', () => {
  const director = new HumanQaPredatorFranchiseSovereignApexHUDDirector();
  assert.equal(director.qaPlaytesters.length, 5);

  const cssPath = path.resolve('src/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.predator-franchise-v206-sovereign-apex-hud-panel'));
  assert.ok(cssContent.includes('.predator-franchise-v206-sovereign-apex-row.yautja-defeat-sovereign-apex.armed'));
});

test('Chantier 9 (v206): AudioSynthesizer v206 Acoustic Models & 15 Canonical SFX Triggers', () => {
  const synth = audioSynth;

  const minigun = synth.computeOldPainlessMinigunRoarAcoustics({
    rpmRate: 3000,
    barrelCount: 6
  });
  assert.equal(minigun.rpmRate, 3000);
  assert.equal(minigun.canopyMowedConfirmed, true);

  const whistle = synth.computeNaruTomahawkRawhideWhistleAcoustics({
    cordLengthMeters: 8.5,
    whipSpeedMps: 24
  });
  assert.equal(whistle.instantRetrievalArmed, true);
  assert.ok(whistle.kineticRecoilJoules > 200);

  const sfxMethods = [
    'playOldPainlessMinigunMotorSpinSFX',
    'playContactRainforestTreeMowingSFX',
    'playIthacaMeatLockerDrumShotgunSFX',
    'playSmartDiscRooftopNetCutSFX',
    'playLexAlienDomeShieldAcidDeflectSFX',
    'playPredalienChestbursterAltarHissSFX',
    'playWolfHandheldPlasmaPistolShotSFX',
    'playSewerThreePointLaserGridHumSFX',
    'playNikolaiDualClaymoreDetonationSFX',
    'playHybridYautjaDnaSequencerBeepSFX',
    'playNaruTomahawkRawhideRecoilWhistleSFX',
    'playThiaBudPredictiveUltrasoundChimeSFX',
    'playDekDualGlaiveSovereignIgniteSFX',
    'playHighCouncilSovereignArenaGongSFX',
    'playPredatorFranchiseSovereignApexNuclearPurgeSFX'
  ];

  for (const methodName of sfxMethods) {
    assert.equal(typeof synth[methodName], 'function', `Missing SFX method: ${methodName}`);
    assert.doesNotThrow(() => synth[methodName]());
  }
});

test('Chantier 10 (v206): HumanQaPredatorFranchiseSovereignApexMasterAuditor End-to-End Verification & WebGL Draw Call Budget', () => {
  const auditor = new HumanQaPredatorFranchiseSovereignApexMasterAuditor();
  const report = auditor.runFullSovereignApexAudit();

  assert.equal(report.allSectorsPassed, true);
  assert.equal(report.rule3Verified, true);
  assert.equal(report.drawCallBudgetPassed, true);
  assert.ok(report.estimatedMothershipDrawCalls <= 300);
  assert.equal(report.totalHonorAwarded, 3000);
});
