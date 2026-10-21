import test from 'node:test';
import assert from 'node:assert/strict';

import { Predators2010RiverGhostWaterfallSector } from '../src/gameplay/Predators2010RiverGhostWaterfallSector.js';
import { Predators2010NikolaiClaymoreSacrificeSector } from '../src/gameplay/Predators2010NikolaiClaymoreSacrificeSector.js';
import { Predators2010SpaceshipSabotageExplosionSector } from '../src/gameplay/Predators2010SpaceshipSabotageExplosionSector.js';
import { Predators2010FireTrenchDecoyDuelSector } from '../src/gameplay/Predators2010FireTrenchDecoyDuelSector.js';
import { Predators2010IsabelleBarrettSniperSector } from '../src/gameplay/Predators2010IsabelleBarrettSniperSector.js';
import { Predators2010EdwinNeurotoxinTrapSector } from '../src/gameplay/Predators2010EdwinNeurotoxinTrapSector.js';
import { Predators2010RoyceAxeDecapitationSector } from '../src/gameplay/Predators2010RoyceAxeDecapitationSector.js';
import { HumanQaPredators2010ClimaxHUDDirector } from '../src/gameplay/HumanQaPredators2010ClimaxHUDDirector.js';
import { HumanQaPredators2010ClimaxAuditor } from '../src/gameplay/HumanQaPredators2010ClimaxAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v181 Chantier LD 1: Predators2010RiverGhostWaterfallSector tracks River Ghost, triggers triple-plasmacaster ambush, and executes 60m waterfall canyon leap', () => {
  const sector = new Predators2010RiverGhostWaterfallSector({ waterfallDropM: 60.0 });

  // Track River Ghost
  const track = sector.trackRiverGhostPrey();
  assert.strictEqual(track.success, true);
  assert.strictEqual(track.riverGhostTracked, true);
  assert.strictEqual(track.bloodColor, 'FLUORESCENT_PALE_GREEN');

  // Trigger triple-plasmacaster ambush
  const ambush = sector.triggerTriplePlasmacasterAmbush(3);
  assert.strictEqual(ambush.success, true);
  assert.strictEqual(ambush.triLaserAmbushActive, true);
  assert.strictEqual(ambush.laserDotTriadsConverged, 3);

  // Leap off 60m waterfall
  const leap = sector.executeSixtyMeterWaterfallLeap();
  assert.strictEqual(leap.success, true);
  assert.strictEqual(leap.waterfallLeapExecuted, true);
  assert.strictEqual(leap.dropHeightM, 60.0);
  assert.strictEqual(leap.thermalSightlineBroken, true);
});

test('v181 Chantier LD 2: Predators2010NikolaiClaymoreSacrificeSector resolves tracker impalement, pulls chest Claymore pins, and detonates point-blank blast', () => {
  const sector = new Predators2010NikolaiClaymoreSacrificeSector();

  // Nikolai impaled
  const impale = sector.resolveTrackerImpalement();
  assert.strictEqual(impale.success, true);
  assert.strictEqual(impale.nikolaiImpaled, true);
  assert.strictEqual(impale.trackerPredatorProximityM, 0.4);

  // Pull Claymore detonator pins
  const pins = sector.pullChestClaymoreDetonatorPins();
  assert.strictEqual(pins.success, true);
  assert.strictEqual(pins.claymorePinsPulled, true);
  assert.strictEqual(pins.minesMountedCount, 2);
  assert.strictEqual(pins.totalSteelBallBearings, 1400);

  // Detonate point-blank blast
  const blast = sector.executeHeroicClaymoreDetonation();
  assert.strictEqual(blast.success, true);
  assert.strictEqual(blast.heroicDetonationExecuted, true);
  assert.strictEqual(blast.trackerObliterated, true);
  assert.strictEqual(blast.blastShockwaveAcousticDb, 146);
});

test('v181 Chantier LD 3: Predators2010SpaceshipSabotageExplosionSector launches Classic scout ship, triggers Berserker remote detonator, and resolves mid-air fireball', () => {
  const sector = new Predators2010SpaceshipSabotageExplosionSector();

  // Liftoff
  const liftoff = sector.initiateScoutShipLiftoff();
  assert.strictEqual(liftoff.success, true);
  assert.strictEqual(liftoff.preflightInitiated, true);
  assert.strictEqual(liftoff.takeoffElevationM, 40.0);
  assert.strictEqual(liftoff.destinationCoordinates, 'EARTH_SOLAR_SYSTEM');

  // Berserker remote detonator
  const remote = sector.triggerBerserkerRemoteDetonator();
  assert.strictEqual(remote.success, true);
  assert.strictEqual(remote.remoteDetonatorArmed, true);

  // Mid-air explosion
  const explosion = sector.resolveScoutShipDestruction();
  assert.strictEqual(explosion.success, true);
  assert.strictEqual(explosion.shipExploded, true);
  assert.strictEqual(explosion.fireballDiameterM, 55.0);
  assert.strictEqual(explosion.earthEscapeBlocked, true);
});

test('v181 Chantier LD 4: Predators2010FireTrenchDecoyDuelSector ignites 800°C fuel fire trench, strikes acoustic drum decoys, and achieves thermal invisibility', () => {
  const sector = new Predators2010FireTrenchDecoyDuelSector({ trenchRadiusM: 18.0 });

  // Ignite fire trench
  const fire = sector.igniteAviationFuelFireTrench();
  assert.strictEqual(fire.success, true);
  assert.strictEqual(fire.fireTrenchIgnited, true);
  assert.strictEqual(fire.flameTemperatureC, 800.0);
  assert.strictEqual(fire.infraredWhiteoutCoveragePct, 100.0);

  // Strike drum decoys
  const drums = sector.strikePrimitiveAcousticDrumDecoys(95);
  assert.strictEqual(drums.success, true);
  assert.strictEqual(drums.drumDecoyActive, true);
  assert.strictEqual(drums.berserkerAuditoryTrackingDisoriented, true);

  // Mud thermal cloak
  const mud = sector.applyRoyceMudThermalCloak();
  assert.strictEqual(mud.success, true);
  assert.strictEqual(mud.royceMudCloaked, true);
  assert.strictEqual(mud.berserkerDetectionProbabilityPct, 0.0);
});

test('v181 Chantier LD 5: Predators2010IsabelleBarrettSniperSector acquires Berserker through mirage and fires .50 BMG round staggering the Super Predator', () => {
  const sector = new Predators2010IsabelleBarrettSniperSector({ sniperDistanceM: 120.0 });

  // Acquire target
  const lock = sector.acquireBerserkerTarget();
  assert.strictEqual(lock.success, true);
  assert.strictEqual(lock.targetLocked, true);
  assert.strictEqual(lock.targetArmorWeaknessIdentified, 'LEFT_CLAVICLE_SHOULDER_JOINT');

  // Fire .50 BMG round
  const shot = sector.fireFiftyCaliberSniperRound();
  assert.strictEqual(shot.success, true);
  assert.strictEqual(shot.sniperShotFired, true);
  assert.strictEqual(shot.berserkerStaggered, true);
  assert.strictEqual(shot.kineticYieldJoules, 18000);
  assert.strictEqual(shot.openingCreatedForRoyce, true);
});

test('v181 Chantier LD 6: Predators2010EdwinNeurotoxinTrapSector harvests orchid neurotoxin, rigs Edwin grenade decoy, and resolves bait explosion', () => {
  const sector = new Predators2010EdwinNeurotoxinTrapSector();

  // Harvest neurotoxin
  const toxin = sector.harvestAlienOrchidNeurotoxin();
  assert.strictEqual(toxin.success, true);
  assert.strictEqual(toxin.neurotoxinHarvested, true);
  assert.strictEqual(toxin.toxinType, 'PARALYTIC_NEUROTOXIN');

  // Rig Edwin booby-trap
  const trap = sector.rigEdwinDecoyGrenadeTrap();
  assert.strictEqual(trap.success, true);
  assert.strictEqual(trap.edwinParalyzed, true);
  assert.strictEqual(trap.decoyExplosiveRigged, true);
  assert.strictEqual(trap.grenadesRiggedCount, 4);

  // Detonate bait trap
  const boom = sector.resolveDecoyBaitExplosion();
  assert.strictEqual(boom.success, true);
  assert.strictEqual(boom.baitDetonationExecuted, true);
  assert.strictEqual(boom.berserkerRemainingArmorStripped, true);
});

test('v181 Chantier LD 7: Predators2010RoyceAxeDecapitationSector ambushes from fire curtain, severs Berserker forearm, lands axe flurry, and executes final decapitation', () => {
  const sector = new Predators2010RoyceAxeDecapitationSector();

  // Ambush from fire curtain
  const ambush = sector.launchAmbushFromFireCurtain();
  assert.strictEqual(ambush.success, true);
  assert.strictEqual(ambush.ambushLaunched, true);
  assert.strictEqual(ambush.axeWeaponModel, 'IRONWOOD_HAFTED_STEEL_BATTLEAXE');

  // Sever forearm
  const chop1 = sector.severBerserkerForearmWithAxe();
  assert.strictEqual(chop1.success, true);
  assert.strictEqual(chop1.berserkerArmSevered, true);
  assert.strictEqual(chop1.berserkerDisarmedPermanently, true);

  // Flurry of strikes
  const flurry = sector.executeRepeatedAxeChops(5);
  assert.strictEqual(flurry.success, true);
  assert.strictEqual(flurry.totalAxeChopsCount, 6);
  assert.strictEqual(flurry.berserkerPinnedToGround, true);

  // Decapitation final stroke
  const finalCut = sector.executeFinalDecapitationStrike();
  assert.strictEqual(finalCut.success, true);
  assert.strictEqual(finalCut.berserkerDecapitated, true);
  assert.strictEqual(finalCut.berserkerSuperPredatorDefeated, true);
  assert.strictEqual(finalCut.dawnTwinSunsRising, true);
  assert.strictEqual(finalCut.newPreyParachutesDescendingCount, 14);
});

test('v181 Chantier LD 8: HumanQaPredators2010ClimaxHUDDirector evaluates 5 climax QA audits and mounts climax HUD panel', () => {
  const director = new HumanQaPredators2010ClimaxHUDDirector();

  const auditTelemetry = director.evaluate5ClimaxAudits();
  assert.strictEqual(auditTelemetry.auditsCount, 5);
  assert.strictEqual(auditTelemetry.allPassed, true);
  assert.strictEqual(auditTelemetry.compositeUXScore, 99.8);

  const mountResult = director.mountClimaxHUD();
  assert.strictEqual(mountResult.mounted, true);
  assert.strictEqual(mountResult.panelClass, 'predators2010-climax-hud-panel');
  assert.ok(mountResult.subWidgets.includes('waterfall-altitude-dive-gauge'));
  assert.ok(mountResult.subWidgets.includes('claymore-detonator-safety-pin-status'));
  assert.ok(mountResult.subWidgets.includes('fire-trench-thermal-whiteout-meter'));
});

test('v181 Chantier LD 9: AudioSynthesizer computes waterfall cavitation & Claymore shockwave acoustics and executes 15 new climax SFX methods', () => {
  // Test mathematical acoustics
  const waterfallAcoustics = audioSynth.computeWaterfallPlungeCavitationAcoustics(60.0, 85.0, 45.0);
  assert.strictEqual(waterfallAcoustics.dropHeightM, 60.0);
  assert.strictEqual(waterfallAcoustics.cavitationFundamentalHz, 90);
  assert.strictEqual(waterfallAcoustics.waterFallCoverEffective, true);

  const claymoreAcoustics = audioSynth.computeClaymoreDualBlastShockwaveAcoustics(3.0, 1400, 0.8);
  assert.strictEqual(claymoreAcoustics.c4MassKg, 3.0);
  assert.strictEqual(claymoreAcoustics.shockwavePeakSplDb, 146);
  assert.strictEqual(claymoreAcoustics.lethalRadiusEffective, true);

  // Test 15 procedural audio methods exist and don't throw
  const audioMethods = [
    'playWaterfallRoarPlungeBoom',
    'playRiverGhostScreechPanic',
    'playTriLaserTripleDotLockWarning',
    'playClaymorePinPullSqueeze',
    'playClaymoreDoubleDetonationBlast',
    'playScoutShipAntigravIgnitionHum',
    'playScoutShipRemoteDetonationFireball',
    'playFireTrenchFuelIgnitionWhoosh',
    'playPrimitiveDrumDecoyEchoCadence',
    'playBarrettFiftyCalSniperShot',
    'playSniperArmorPenetrationClang',
    'playAlienOrchidNeurotoxinSizzle',
    'playHeavyAxeFleshChopImpact',
    'playBerserkerFinalDecapitationSever',
    'playNewPreyParachutesDescendingWind'
  ];

  audioMethods.forEach((method) => {
    assert.strictEqual(typeof audioSynth[method], 'function', `${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method]());
  });
});

test('v181 Chantier LD 10: HumanQaPredators2010ClimaxAuditor audits all 7 climax sectors and generates consolidated climax report', () => {
  const auditor = new HumanQaPredators2010ClimaxAuditor();

  const a1 = auditor.auditRiverGhostWaterfall({ riverGhostTracked: true, triLaserAmbushActive: true, waterfallLeapExecuted: true });
  assert.strictEqual(a1.passes, true);

  const a2 = auditor.auditNikolaiClaymoreSacrifice({ nikolaiImpaled: true, claymorePinsPulled: true, trackerObliterated: true });
  assert.strictEqual(a2.passes, true);

  const a3 = auditor.auditSpaceshipSabotage({ preflightInitiated: true, remoteDetonatorArmed: true, shipExploded: true });
  assert.strictEqual(a3.passes, true);

  const a4 = auditor.auditFireTrenchDecoys({ fireTrenchIgnited: true, drumDecoyActive: true, royceMudCloaked: true });
  assert.strictEqual(a4.passes, true);

  const a5 = auditor.auditIsabelleBarrettSniper({ targetLocked: true, sniperShotFired: true, berserkerStaggered: true });
  assert.strictEqual(a5.passes, true);

  const a6 = auditor.auditEdwinNeurotoxinTrap({ neurotoxinHarvested: true, edwinParalyzed: true, baitDetonationExecuted: true });
  assert.strictEqual(a6.passes, true);

  const a7 = auditor.auditRoyceAxeDecapitation({ ambushLaunched: true, berserkerArmSevered: true, berserkerDecapitated: true });
  assert.strictEqual(a7.passes, true);

  const report = auditor.generateConsolidatedClimaxReport();
  assert.strictEqual(report.version, 'v181');
  assert.strictEqual(report.totalAuditsExecuted, 7);
  assert.strictEqual(report.passedCount, 7);
  assert.strictEqual(report.compliancePct, 100);
  assert.ok(report.drawCallsInvariant.includes('<= 300'));
});
