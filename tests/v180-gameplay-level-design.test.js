import test from 'node:test';
import assert from 'node:assert/strict';

import { Predators2010SkyfallCanopyBreachSector } from '../src/gameplay/Predators2010SkyfallCanopyBreachSector.js';
import { Predators2010CelestialVistaRidgeSector } from '../src/gameplay/Predators2010CelestialVistaRidgeSector.js';
import { Predators2010NolanTrapForestSector } from '../src/gameplay/Predators2010NolanTrapForestSector.js';
import { Predators2010HellHoundPackFlushSector } from '../src/gameplay/Predators2010HellHoundPackFlushSector.js';
import { Predators2010FalconDroneReconSector } from '../src/gameplay/Predators2010FalconDroneReconSector.js';
import { Predators2010DrillingShipWreckSector } from '../src/gameplay/Predators2010DrillingShipWreckSector.js';
import { Predators2010ClassicVsBerserkerClimaxSector } from '../src/gameplay/Predators2010ClassicVsBerserkerClimaxSector.js';
import { HumanQaPredators2010GamePreserveHUDDirector } from '../src/gameplay/HumanQaPredators2010GamePreserveHUDDirector.js';
import { HumanQaPredators2010GamePreserveAuditor } from '../src/gameplay/HumanQaPredators2010GamePreserveAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v180 Chantier LD 1: Predators2010SkyfallCanopyBreachSector simulates 3000m freefall, deploys emergency parachute, and resolves canopy crash', () => {
  const sector = new Predators2010SkyfallCanopyBreachSector({ dropAltitudeM: 3000.0, terminalVelocityMps: 54.0 });

  // Freefall simulation down to 150m
  const fall = sector.simulateFreefallDescent(53.0);
  assert.strictEqual(fall.success, true);
  assert.strictEqual(fall.terminalVelocityMps, 54.0);
  assert.strictEqual(fall.readyForDeploy, true);

  // Cannot land before deploying parachute
  const premature = sector.resolveCanopyCrashAndTouchdown();
  assert.strictEqual(premature.success, false);

  // Deploy parachute
  const chute = sector.deployEmergencyParachute(150.0);
  assert.strictEqual(chute.success, true);
  assert.strictEqual(chute.parachuteDeployed, true);
  assert.strictEqual(chute.decelerationGForce, 4.2);

  // Crash through canopy
  const crash = sector.resolveCanopyCrashAndTouchdown();
  assert.strictEqual(crash.success, true);
  assert.strictEqual(crash.canopyBreached, true);
  assert.strictEqual(crash.groundLanded, true);
  assert.strictEqual(crash.brokenBranchesCount, 8);
});

test('v180 Chantier LD 2: Predators2010CelestialVistaRidgeSector scales basalt ridge, reveals 4 celestial bodies, and triggers game preserve realization', () => {
  const sector = new Predators2010CelestialVistaRidgeSector({ ridgeElevationM: 420.0 });

  // Scale basalt ridge
  const scale = sector.scaleBasaltRidge(2.8);
  assert.strictEqual(scale.success, true);
  assert.strictEqual(scale.ridgeCrested, true);
  assert.strictEqual(scale.ridgeElevationM, 420.0);

  // Observe alien sky
  const sky = sector.observeAlienCelestialHorizon();
  assert.strictEqual(sky.success, true);
  assert.strictEqual(sky.celestialSkyObserved, true);
  assert.strictEqual(sky.visibleAstronomicalBodies.length, 4);
  assert.strictEqual(sky.notOnEarthConfirmed, true);

  // Realization
  const diagnosis = sector.concludeGamePreserveDiagnosis();
  assert.strictEqual(diagnosis.success, true);
  assert.strictEqual(diagnosis.gamePreserveRealized, true);
  assert.ok(diagnosis.royceFamousDiagnosis.includes('game preserve'));
});

test('v180 Chantier LD 3: Predators2010NolanTrapForestSector detects tripwire, disarms 150kg counterweight spike pendulum, and jumps punji pit', () => {
  const sector = new Predators2010NolanTrapForestSector();

  // Detect tripwire
  const detect = sector.detectCamouflagedTripwire(85.0);
  assert.strictEqual(detect.success, true);
  assert.strictEqual(detect.tripwireSpotted, true);
  assert.strictEqual(detect.tripwireHeightCm, 15.0);

  // Disarm spike pendulum
  const disarm = sector.disarmSpikePendulumTrap();
  assert.strictEqual(disarm.success, true);
  assert.strictEqual(disarm.spikePendulumDisarmed, true);
  assert.strictEqual(disarm.logMassKg, 150.0);
  assert.strictEqual(disarm.salvagedParacordMeters, 12);

  // Navigate punji pit
  const jump = sector.navigateConcealedPunjiPit(2.5);
  assert.strictEqual(jump.success, true);
  assert.strictEqual(jump.pitEvadedSafely, true);
  assert.strictEqual(jump.pitDepthM, 2.2);
});

test('v180 Chantier LD 4: Predators2010HellHoundPackFlushSector releases spiny hell-hound pack, deflects rifle fire off osteoderms, and blows recall whistle', () => {
  const sector = new Predators2010HellHoundPackFlushSector({ packSize: 6 });

  // Release pack
  const release = sector.releaseHellHoundPack();
  assert.strictEqual(release.success, true);
  assert.strictEqual(release.packReleased, true);
  assert.strictEqual(release.packSize, 6);
  assert.strictEqual(release.sprintVelocityMps, 16.0);

  // Ballistic impact deflection
  const bullets = sector.resolveBallisticArmorImpact(10, '7.62X39MM_SOVIET');
  assert.strictEqual(bullets.success, true);
  assert.strictEqual(bullets.roundsDeflected, 7);
  assert.strictEqual(bullets.penetratingHits, 3);

  // Heavy firepower neutralization
  const heavy = sector.neutralizeHellHoundsWithHeavyFire(4200);
  assert.strictEqual(heavy.success, true);
  assert.strictEqual(heavy.neutralizedCount, 2);

  // Tracker whistle recall
  const whistle = sector.blowTrackerRecallWhistle();
  assert.strictEqual(whistle.success, true);
  assert.strictEqual(whistle.trackerWhistleBlown, true);
  assert.strictEqual(whistle.whistleFrequencyHz, 28000);
});

test('v180 Chantier LD 5: Predators2010FalconDroneReconSector launches avian drone, streams thermal telemetry, and designates indirect artillery coordinates', () => {
  const sector = new Predators2010FalconDroneReconSector({ cruisingAltitudeM: 250.0 });

  // Launch falcon drone
  const launch = sector.launchFalconDrone();
  assert.strictEqual(launch.success, true);
  assert.strictEqual(launch.droneAirborne, true);
  assert.strictEqual(launch.cruisingAltitudeM, 250.0);

  // Stream thermal telemetry
  const stream = sector.streamThermalTelemetry(7);
  assert.strictEqual(stream.success, true);
  assert.strictEqual(stream.thermalFeedActive, true);
  assert.strictEqual(stream.targetsAcquiredCount, 7);
  assert.ok(stream.humanBiomarkersLocked.includes('ROYCE'));

  // Designate target for plasmacaster
  const paint = sector.designateTargetForPlasmacaster('NIKOLAI');
  assert.strictEqual(paint.success, true);
  assert.strictEqual(paint.laserDesignationActive, true);
  assert.strictEqual(paint.artilleryStrikeReady, true);

  // Recall and dock
  const dock = sector.recallAndDockFalconDrone();
  assert.strictEqual(dock.success, true);
  assert.strictEqual(dock.dockedOnShoulderMount, true);
  assert.strictEqual(dock.droneAirborne, false);
});

test('v180 Chantier LD 6: Predators2010DrillingShipWreckSector enters derelict titanium excavator, encounters Noland, and breaches toxic CO smoke trap', () => {
  const sector = new Predators2010DrillingShipWreckSector({ hullLengthM: 180.0 });

  // Enter hull
  const enter = sector.enterDerelictDrillingHull();
  assert.strictEqual(enter.success, true);
  assert.strictEqual(enter.shipEntered, true);
  assert.strictEqual(enter.hullLengthM, 180.0);

  // Discover Noland
  const noland = sector.discoverNolandOutpost();
  assert.strictEqual(noland.success, true);
  assert.strictEqual(noland.nolandEncountered, true);
  assert.strictEqual(noland.survivalDurationHuntingSeasons, 10);

  // Smoke trap
  const smoke = sector.triggerCarbonMonoxideSmokeTrap(800.0);
  assert.strictEqual(smoke.success, true);
  assert.strictEqual(smoke.smokeTrapTriggered, true);
  assert.strictEqual(smoke.gasConcentrationPpm, 800.0);

  // Breach airlock hatch
  const breach = sector.breachLockedAirlockHatch();
  assert.strictEqual(breach.success, true);
  assert.strictEqual(breach.airlockBreached, true);
  assert.strictEqual(breach.freshAirRestored, true);
});

test('v180 Chantier LD 7: Predators2010ClassicVsBerserkerClimaxSector brawls in burning camp, shatters mask, and resolves Berserker spine rip execution', () => {
  const sector = new Predators2010ClassicVsBerserkerClimaxSector();

  // Initiate duel
  const duel = sector.initiateClassicBerserkerDuel();
  assert.strictEqual(duel.success, true);
  assert.strictEqual(duel.duelInitiated, true);
  assert.strictEqual(duel.berserkerMassKg, 240.0);

  // Classic strikes
  const strikes = sector.executeClassicDualWristbladeStrikes(3);
  assert.strictEqual(strikes.success, true);
  assert.strictEqual(strikes.strikesCount, 3);
  assert.strictEqual(strikes.berserkerChestArmorGashed, true);

  // Berserker overpowers
  const overpower = sector.berserkerOverpowersClassicHunter();
  assert.strictEqual(overpower.success, true);
  assert.strictEqual(overpower.berserkerOverpoweredClassic, true);
  assert.strictEqual(overpower.classicMaskShattered, true);

  // Decapitation and spine rip
  const execution = sector.resolveClassicDecapitationAndSpineRip();
  assert.strictEqual(execution.success, true);
  assert.strictEqual(execution.classicDecapitated, true);
  assert.strictEqual(execution.spinalCordTornFree, true);
  assert.strictEqual(execution.berserkerVictoryRoarEmitted, true);
  assert.strictEqual(execution.trophyType, 'CLASSIC_JUNGLE_HUNTER_SKULL_AND_SPINE');
});

test('v180 Chantier LD 8: HumanQaPredators2010GamePreserveHUDDirector evaluates 5 Game Preserve QA audits and mounts HUD panel', () => {
  const director = new HumanQaPredators2010GamePreserveHUDDirector();

  const auditTelemetry = director.evaluate5GamePreserveAudits();
  assert.strictEqual(auditTelemetry.auditsCount, 5);
  assert.strictEqual(auditTelemetry.allPassed, true);
  assert.strictEqual(auditTelemetry.compositeUXScore, 99.8);

  const mountResult = director.mountGamePreserveHUD();
  assert.strictEqual(mountResult.mounted, true);
  assert.strictEqual(mountResult.panelClass, 'predators2010-game-preserve-hud-panel');
  assert.ok(mountResult.subWidgets.includes('skyfall-altimeter-gauge'));
  assert.ok(mountResult.subWidgets.includes('celestial-moons-radar'));
  assert.ok(mountResult.subWidgets.includes('hellhound-pack-threat-meter'));
});

test('v180 Chantier LD 9: AudioSynthesizer computes skyfall parachute & hell-hound charge acoustics and executes 15 new Game Preserve SFX methods', () => {
  // Test mathematical acoustics
  const parachuteAcoustics = audioSynth.computeSkyfallParachuteDecelerationAcoustics(54.0, 42.0, 1.18);
  assert.strictEqual(parachuteAcoustics.terminalVelocityMps, 54.0);
  assert.ok(parachuteAcoustics.canopySnapTensionN > 50000);

  const houndAcoustics = audioSynth.computeHellHoundPackChargeAcoustics(6, 16.0, 0.85);
  assert.strictEqual(houndAcoustics.packSize, 6);
  assert.strictEqual(houndAcoustics.flankEncirclementDetected, true);

  // Test 15 procedural audio methods exist and don't throw
  const audioMethods = [
    'playSkyfallWindRushRoar',
    'playParachuteCanopyDeploySnap',
    'playCanopyTreeCrashBranchesCrack',
    'playCelestialMoonsAlienAmbience',
    'playPunjiStickTrapTripwireTwang',
    'playHellHoundHuntingBarkRoar',
    'playHellHoundOsteodermBulletDeflect',
    'playTrackerWhistleUltrasonicFlute',
    'playFalconDroneLaunchWhir',
    'playFalconDroneLaserScanBeep',
    'playDrillingShipRustedBulkheadCreak',
    'playNolandToxicSmokeVentHiss',
    'playClassicVsBerserkerWristbladeClash',
    'playBerserkerSpineRipDecapitationCrunch',
    'playBerserkerPrimalVictoryRoar'
  ];

  audioMethods.forEach((method) => {
    assert.strictEqual(typeof audioSynth[method], 'function', `${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method]());
  });
});

test('v180 Chantier LD 10: HumanQaPredators2010GamePreserveAuditor audits all 7 planetary sectors and generates consolidated Game Preserve report', () => {
  const auditor = new HumanQaPredators2010GamePreserveAuditor();

  const a1 = auditor.auditSkyfallCanopyBreach({ parachuteDeployed: true, canopyBreached: true, groundLanded: true });
  assert.strictEqual(a1.passes, true);

  const a2 = auditor.auditCelestialVistaRidge({ ridgeCrested: true, celestialSkyObserved: true, gamePreserveRealized: true });
  assert.strictEqual(a2.passes, true);

  const a3 = auditor.auditNolanTrapForest({ tripwireSpotted: true, spikePendulumDisarmed: true, punjiPitNavigated: true });
  assert.strictEqual(a3.passes, true);

  const a4 = auditor.auditHellHoundPackFlush({ packReleased: true, roundsDeflected: 7, trackerWhistleBlown: true });
  assert.strictEqual(a4.passes, true);

  const a5 = auditor.auditFalconDroneRecon({ droneAirborne: true, thermalFeedActive: true, laserDesignationActive: true });
  assert.strictEqual(a5.passes, true);

  const a6 = auditor.auditDrillingShipWreck({ shipEntered: true, nolandEncountered: true, airlockBreached: true });
  assert.strictEqual(a6.passes, true);

  const a7 = auditor.auditClassicVsBerserkerClimax({ duelInitiated: true, classicDecapitated: true, berserkerVictoryRoarEmitted: true });
  assert.strictEqual(a7.passes, true);

  const report = auditor.generateConsolidatedGamePreserveReport();
  assert.strictEqual(report.version, 'v180');
  assert.strictEqual(report.totalAuditsExecuted, 7);
  assert.strictEqual(report.passedCount, 7);
  assert.strictEqual(report.compliancePct, 100);
  assert.ok(report.drawCallsInvariant.includes('<= 300'));
});
