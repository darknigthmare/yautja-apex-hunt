import test from 'node:test';
import assert from 'node:assert/strict';

import { ValVerdeHopperSkinnedPatrolClearingSector } from '../src/gameplay/ValVerdeHopperSkinnedPatrolClearingSector.js';
import { ValVerdeOldPainlessDeforestationSector } from '../src/gameplay/ValVerdeOldPainlessDeforestationSector.js';
import { ValVerdeFallenLogRavineBridgeSector } from '../src/gameplay/ValVerdeFallenLogRavineBridgeSector.js';
import { ValVerdeBillySoleMacheteStandRidgeSector } from '../src/gameplay/ValVerdeBillySoleMacheteStandRidgeSector.js';
import { ValVerdeDutchMudWallowRiverbankSector } from '../src/gameplay/ValVerdeDutchMudWallowRiverbankSector.js';
import { ValVerdeDutchTrapWorkshopClearingSector } from '../src/gameplay/ValVerdeDutchTrapWorkshopClearingSector.js';
import { ValVerdeCounterweightedDeadfallCrushSector } from '../src/gameplay/ValVerdeCounterweightedDeadfallCrushSector.js';
import { HumanQaValVerdeJungleNavigationHUDDirector } from '../src/gameplay/HumanQaValVerdeJungleNavigationHUDDirector.js';
import { HumanQaValVerdeThermalMudDeforestationAuditor } from '../src/gameplay/HumanQaValVerdeThermalMudDeforestationAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v173 Chantier LD 1: ValVerdeHopperSkinnedPatrolClearingSector evaluates skinned corpses, cooling rates, and decoy rope drops', () => {
  const sector = new ValVerdeHopperSkinnedPatrolClearingSector();
  assert.equal(sector.suspendedCorpses.length, 3);
  assert.equal(sector.suspendedCorpses[0].name, 'Major Jim Hopper');
  assert.equal(sector.suspendedCorpses[0].heightM, 8.5);

  // Evaluate thermal cooling over 4 hours (14400s)
  const thermalScan = sector.evaluateCorpseThermalSignatures(14400);
  assert.equal(thermalScan.corpsesCount, 3);
  assert.ok(thermalScan.averageCorpseTempC <= 28.0, 'Corpses should have cooled down towards ambient');
  assert.ok(thermalScan.fliesAcousticDb >= 40.0, 'Decomposition fly buzzing should be audible');

  // Cut suspended corpse rope to trigger decoy drop
  const dropResult = sector.cutSuspendedCorpseRope('corpse-hopper');
  assert.equal(dropResult.success, true);
  assert.equal(dropResult.decoyDistractionGenerated, true);
  assert.equal(dropResult.groundThumpDecibels, 68);
});

test('v173 Chantier LD 2: ValVerdeOldPainlessDeforestationSector executes 4000 rpm M134 barrage, cordite haze, and Yautja blood analysis', () => {
  const sector = new ValVerdeOldPainlessDeforestationSector();
  
  // Execute deforestation fire
  const barrage = sector.executeMinigunDeforestationBarrage(4000, 12);
  assert.equal(barrage.burstRounds, 4000);
  assert.ok(barrage.treesFelledInBarrage >= 10);
  assert.ok(barrage.corditeSmokeDensityPct >= 50);

  // Cover from felled logs
  const cover = sector.resolveFelledLogBarricadeCover();
  assert.ok(cover.absorbedEnergyJoules >= 300);
  assert.equal(cover.occupantProtected, true);

  // Inspect luminescent green blood leaf
  const blood = sector.inspectLuminescentBloodLeaf();
  assert.equal(blood.bloodColor, '#00ff33');
  assert.equal(blood.famousQuote, 'If it bleeds, we can kill it.');
  assert.ok(blood.bloodLuminescenceWavelengthNm >= 520 && blood.bloodLuminescenceWavelengthNm <= 550);
});

test('v173 Chantier LD 3: ValVerdeFallenLogRavineBridgeSector resolves mossy bridge traverse, Claymore tripwire, and canopy net trap', () => {
  const sector = new ValVerdeFallenLogRavineBridgeSector();
  assert.equal(sector.logBridgeSpanM, 18.5);
  assert.equal(sector.ravineDepthM, 15.0);

  // Careful slow crossing with low sprint speed
  const slowCross = sector.crossMossyLogBridge(1.0, false);
  assert.equal(slowCross.success, true);
  assert.equal(slowCross.balanceLost, false);

  // Fast sprint crossing on wet moss
  const fastCross = sector.crossMossyLogBridge(5.5, true);
  assert.equal(fastCross.balanceLost, true);

  // Claymore tripwire resolution
  const claymore = sector.resolveClaymoreTripwireHazard();
  assert.equal(claymore.triggered, true);
  assert.equal(claymore.steelBallBearingsCount, 700);

  // Canopy net snare
  const net = sector.triggerSuspendedNetTrap();
  assert.equal(net.sprung, true);
  assert.equal(net.targetEnsnared, true);
  assert.equal(net.hoistHeightM, 6.5);
});

test('v173 Chantier LD 4: ValVerdeBillySoleMacheteStandRidgeSector executes ridge duel ritual, machete clash, and canyon fall', () => {
  const sector = new ValVerdeBillySoleMacheteStandRidgeSector();
  assert.equal(sector.logBridgeWidthM, 1.2);
  assert.equal(sector.canyonDropHeightM, 22.0);

  // Billy prepares with ritual chest cut
  const ritual = sector.executeBillySoleDuelRitual();
  assert.equal(ritual.success, true);
  assert.equal(ritual.billyRitualCompleted, true);
  assert.equal(ritual.stoicMoraleScore, 100);

  // Machete vs wristblade clash: Yautja alloy (82 HRC) notches human steel (58 HRC)
  const clash = sector.resolveMacheteWristbladeClash(650);
  assert.equal(clash.macheteNotched, true);
  assert.equal(clash.logBridgeFootingMaintained, true);
  assert.ok(clash.metallicSparksSpall > 0);

  // Canyon plunge
  const fall = sector.resolveCanyonRapidsFall();
  assert.equal(fall.fallenIntoRapids, true);
  assert.ok(fall.impactVelocityMps > 15);
  assert.equal(fall.washedToRiverMudShelf, true);
});

test('v173 Chantier LD 5: ValVerdeDutchMudWallowRiverbankSector models 14°C mud wallow, thermal shielding, drying, and river washout', () => {
  const sector = new ValVerdeDutchMudWallowRiverbankSector();
  assert.equal(sector.mudTempC, 14.0);

  // Dutch covers himself in alluvial mud
  const wallow = sector.wallowInColdRiverbankMud(4.0);
  assert.equal(wallow.success, true);
  assert.equal(wallow.thermalMaskingPct, 100);
  assert.equal(wallow.infraredInvisibilityActive, true);

  // Drying over 120s
  const drying1 = sector.updateMudDryingLifecycle(120);
  assert.equal(drying1.mudCoatingWet, true);
  assert.ok(drying1.thermalMaskingPct > 0);

  // Buttress root hideout
  const hideout = sector.crouchUnderButtressRootOverhang();
  assert.equal(hideout.underRootOverhang, true);
  assert.equal(hideout.overheadConcealmentPct, 98);

  // River wash
  const wash = sector.washMudInRunningRiver();
  assert.equal(wash.washedClean, true);
  assert.equal(wash.thermalMaskingPct, 0);
  assert.equal(wash.bodyHeatSignatureRestored, true);
});

test('v173 Chantier LD 6: ValVerdeDutchTrapWorkshopClearingSector resolves punji stakes, explosive arrow shots, and campfire decoy', () => {
  const sector = new ValVerdeDutchTrapWorkshopClearingSector();
  assert.equal(sector.punjiPitDepthM, 2.5);

  // Punji pit fall
  const pit = sector.resolveConcealedPunjiPitFall();
  assert.equal(pit.triggered, true);
  assert.equal(pit.impalementDamage, 240);

  // Explosive tip arrow
  const arrow = sector.fireExplosiveTipArrow(28.0);
  assert.equal(arrow.success, true);
  assert.ok(arrow.shrapnelSprayCount > 0);

  // Decoy campfire lure
  const decoy = sector.activateDecoyCampfireLure();
  assert.equal(decoy.success, true);
  assert.equal(decoy.campfireLit, true);
  assert.equal(decoy.tempC, 580);
  assert.equal(decoy.thermalDecoyActive, true);
});

test('v173 Chantier LD 7: ValVerdeCounterweightedDeadfallCrushSector triggers 1200kg log crush, gauntlet laughter, and 10s countdown', () => {
  const sector = new ValVerdeCounterweightedDeadfallCrushSector();
  assert.equal(sector.deadfallLogMassKg, 1200);

  // Release deadfall log on hunter
  const deadfall = sector.releaseCounterweightedDeadfallLog();
  assert.equal(deadfall.success, true);
  assert.ok(deadfall.kineticEnergyJoules >= 60000);
  assert.equal(deadfall.targetPinnedUnderLog, true);

  // Hunter triggers self-destruct
  const countdown = sector.activateWristGauntletSelfDestruct();
  assert.equal(countdown.selfDestructActive, true);
  assert.equal(countdown.countdownDurationSec, 10);
  assert.equal(countdown.sardonicLaughterPlaying, true);

  // Update countdown to detonation
  const updateDetonation = sector.updateSelfDestructCountdown(10);
  assert.equal(updateDetonation.detonated, true);
  assert.equal(updateDetonation.mushroomCloudGenerated, true);
});

test('v173 Chantier LD 8: HumanQaValVerdeJungleNavigationHUDDirector assesses canopy density and detects tripwire traps', () => {
  const director = new HumanQaValVerdeJungleNavigationHUDDirector({ scanRadiusM: 45.0 });

  // Evaluate canopy foliage
  const canopy = director.evaluateJungleCanopyCover(95.0, 22.0);
  assert.equal(canopy.foliageDensityPct, 95.0);
  assert.equal(canopy.infraredConcealmentAgainstGround, true);
  assert.equal(canopy.sprintSpeedSafetyRating, 'OPTIMAL_BRANCH_HIGHWAY');

  // Detect tripwires
  const hazards = [
    { id: 'claymore-1', type: 'CLAYMORE', distanceM: 12.0 },
    { id: 'punji-1', type: 'PUNJI_PIT', distanceM: 6.5 }
  ];
  const scan = director.detectPerimeterTripwireHazards(hazards);
  assert.equal(scan.detectedTripwiresCount, 2);
  assert.equal(scan.hudHazardWarningActive, true);
});

test('v173 Chantier LD 9: AudioSynthesizer computes M134 minigun & self-destruct acoustics and exposes 15 Predator 1 SFX methods', () => {
  // Test minigun deforestation acoustics
  const miniAcoustics = audioSynth.computeMinigunDeforestationTreeCrackAcoustics(4000, 0.72, 15.0);
  assert.ok(miniAcoustics.fundamentalHz >= 65 && miniAcoustics.fundamentalHz <= 68);
  assert.ok(miniAcoustics.splAtDistanceDb >= 130);
  assert.ok(miniAcoustics.splinterSnapHz > 1000);

  // Test self-destruct acoustics
  const blastAcoustics = audioSynth.computeThermonuclearSelfDestructAcoustics(0.05, 5, 35.0);
  assert.ok(blastAcoustics.blastOverpressureKpa > 0);
  assert.ok(blastAcoustics.splAtDistanceDb >= 160);
  assert.equal(blastAcoustics.safeEvacuationDistanceM, 150.0);
  assert.equal(blastAcoustics.laughterHarmonicsHz.length, 4);

  // Verify all 15 SFX methods exist and execute cleanly
  const sfxMethods = [
    'playHopperSuspendedCorpsesFliesBuzz',
    'playOldPainlessMinigun4000RpmRoar',
    'playFelledTreeCrashRumble',
    'playLuminescentBloodDripSizzle',
    'playFallenLogRavineWindEcho',
    'playM26TripwireGrenadeSpoonPing',
    'playBillyMacheteBladeSharpenZing',
    'playBillyChestCutBloodDrip',
    'playRiverMudPlungeSuctionSquish',
    'playPunjiStakePitFallCrackle',
    'playExplosiveArrowLaunchWhoosh',
    'playCounterweightedLogDeadfallSmash',
    'playJungleHunterSardonicLaughterEcho',
    'playWristGauntletCountdownGlyphChirp',
    'playThermonuclearGauntletBlastWaveRoar'
  ];

  for (const method of sfxMethods) {
    assert.equal(typeof audioSynth[method], 'function', `Method ${method} must be defined`);
    assert.doesNotThrow(() => audioSynth[method](), `Method ${method} should not throw even if WebAudio is inactive`);
  }
});

test('v173 Chantier LD 10: HumanQaValVerdeThermalMudDeforestationAuditor simulates drying, washing, deforestation physics and Yautja acquisition', () => {
  const auditor = new HumanQaValVerdeThermalMudDeforestationAuditor({ ambientTempC: 32.0, mudTempC: 14.0 });

  // Apply mud
  const mudApplied = auditor.applyAlluvialMud(5.0);
  assert.equal(mudApplied.applied, true);
  assert.equal(mudApplied.thermalShieldingPct, 100.0);
  assert.equal(mudApplied.surfaceTempC, 14.0);

  // Simulate drying for 60s
  const drying = auditor.simulateMudDryingLifecycle(60, 40, 80);
  assert.equal(drying.infraredSignatureBlocked, true);
  assert.ok(drying.moisturePct < 100);

  // Update deforestation
  const deforest = auditor.updateDeforestationPhysics(200, 14, 65);
  assert.equal(deforest.debrisBarricadesActive, true);
  assert.equal(deforest.laserTargetingImpaired, true);

  // Evaluate Yautja acquisition with wet mud + cordite smoke
  const targetCheck = auditor.evaluateYautjaTargetAcquisition({
    bioMaskThermalActive: true,
    targetRangeM: 15.0,
    targetMovementSpeedMps: 0.3
  });
  assert.equal(targetCheck.targetAcquired, false);
  assert.equal(targetCheck.targetingReticuleLocked, false);
  assert.equal(targetCheck.mudCamouflageEffective, true);

  // Wash mud off in river
  const wash = auditor.simulateRiverImmersion(1.5, 3.0);
  assert.equal(wash.washedOff, true);

  // Evaluate Yautja acquisition after mud is washed away
  const exposedCheck = auditor.evaluateYautjaTargetAcquisition({
    bioMaskThermalActive: true,
    targetRangeM: 15.0,
    targetMovementSpeedMps: 0.3
  });
  assert.equal(exposedCheck.targetAcquired, true);
  assert.equal(exposedCheck.targetingReticuleLocked, true);

  // Audit report
  const report = auditor.generatePlaytesterAuditReport();
  assert.equal(report.environmentalPhysicsFidelityScore, 100);
  assert.equal(report.thermalContrastCalibration, 'CANONICAL_1_TO_1');
});
