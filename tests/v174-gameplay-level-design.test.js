import test from 'node:test';
import assert from 'node:assert/strict';

import { ValVerdeDutchBallisticSpearTrajectorySector } from '../src/gameplay/ValVerdeDutchBallisticSpearTrajectorySector.js';
import { ValVerdeQuicksandMangroveSinkingSector } from '../src/gameplay/ValVerdeQuicksandMangroveSinkingSector.js';
import { ValVerdeWaterShortCircuitCloakSector } from '../src/gameplay/ValVerdeWaterShortCircuitCloakSector.js';
import { ValVerdeWaterfallCaveAmbushSector } from '../src/gameplay/ValVerdeWaterfallCaveAmbushSector.js';
import { ValVerdeDutchGuerrillaTripwireNetworkSector } from '../src/gameplay/ValVerdeDutchGuerrillaTripwireNetworkSector.js';
import { ValVerdeFinalUndergrowthBrawlSector } from '../src/gameplay/ValVerdeFinalUndergrowthBrawlSector.js';
import { ValVerdeExtractionLZChopperSector } from '../src/gameplay/ValVerdeExtractionLZChopperSector.js';
import { HumanQaValVerdeTacticalHUDDirector } from '../src/gameplay/HumanQaValVerdeTacticalHUDDirector.js';
import { HumanQaValVerdePhysicsShortCircuitAuditor } from '../src/gameplay/HumanQaValVerdePhysicsShortCircuitAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v174 Chantier LD 1: ValVerdeDutchBallisticSpearTrajectorySector computes parabolic arcs, foliage deflection, and shaped-charge detonation', () => {
  const sector = new ValVerdeDutchBallisticSpearTrajectorySector();
  assert.equal(sector.spearMassKg, 1.65);
  assert.equal(sector.grenadeFuseActive, true);

  // Parabolic trajectory computation
  const traj = sector.computeSpearTrajectory(24.0, 15.0, 25.0);
  assert.equal(traj.launchSpeedMps, 24.0);
  assert.ok(traj.apexHeightM > 0);
  assert.ok(traj.timeOfFlightSec > 0.5);
  assert.ok(traj.kineticEnergyJoules >= 300);

  // Foliage penetration and deflection
  const foliage = sector.resolveFoliagePenetrationDeflection(75.0, 3);
  assert.ok(foliage.velocityDampingFactor < 1.0 && foliage.velocityDampingFactor > 0.4);
  assert.ok(foliage.deflectionAngleDeg > 0);
  assert.equal(foliage.retainsExplosiveArming, true);

  // Explosive impact detonation
  const detonation = sector.resolveExplosiveSpearDetonation('HARDWOOD_TRUNK', 22.0);
  assert.equal(detonation.detonationSuccess, true);
  assert.ok(detonation.blastYieldJoules >= 30000);
  assert.ok(detonation.shrapnelCount > 100);
  assert.equal(detonation.acousticDetonationDb, 136);
});

test('v174 Chantier LD 2: ValVerdeQuicksandMangroveSinkingSector models non-Newtonian yield stress, panic thrashing, and vine extrication', () => {
  const sector = new ValVerdeQuicksandMangroveSinkingSector({ pitDepthM: 1.8 });
  assert.equal(sector.mudYieldStressPa, 1200);

  // Normal calm advance
  const calm = sector.updateSinkingState(5.0, false);
  assert.ok(calm.sinkDepthM > 0);
  assert.ok(calm.suctionForceN > 1000);

  // Panicked thrashing accelerates sinking rate
  const panic = sector.updateSinkingState(5.0, true);
  assert.ok(panic.sinkDepthM > calm.sinkDepthM);
  assert.equal(panic.isStrugglingPanicked, true);

  // Extrication via overhead vine leverage
  const pullout = sector.attemptQuicksandExtraction(true, 4.0);
  assert.equal(pullout.success, true);
  assert.equal(pullout.method, 'OVERHEAD_VINE_LEVERAGE');
  assert.ok(pullout.elevationGainM > 0);
});

test('v174 Chantier LD 3: ValVerdeWaterShortCircuitCloakSector triggers dielectric breakdown, plasma sparks, and cloak reboot', () => {
  const sector = new ValVerdeWaterShortCircuitCloakSector({ arcVoltageKv: 15.0 });
  assert.equal(sector.cloakState, 'OPTICAL_BENDING_ACTIVE');

  // Step into river water (0.4m depth, 18 L/s splash)
  const shortCircuit = sector.triggerWaterShortCircuit(0.4, 18.0);
  assert.equal(shortCircuit.shortCircuitTriggered, true);
  assert.ok(shortCircuit.sparkArcsCount >= 10);
  assert.equal(shortCircuit.sparkColor, '#00d4ff');
  assert.equal(shortCircuit.visibleToHumanNakedEye, true);
  assert.equal(shortCircuit.forcedOffline, true);
  assert.equal(sector.cloakState, 'FULL_PHYSICAL_REVEAL');

  // Cooldown / drying update
  const rebooting = sector.updateCloakRebootCycle(5.0);
  assert.equal(rebooting.rebootComplete, false);
  assert.equal(rebooting.readyToEngage, false);

  // Complete reboot
  const rearmed = sector.updateCloakRebootCycle(15.0);
  assert.equal(rearmed.rebootComplete, true);
  assert.equal(rearmed.cloakState, 'OPTICAL_BENDING_ACTIVE');
});

test('v174 Chantier LD 4: ValVerdeWaterfallCaveAmbushSector provides 88 dB acoustic masking, cave alcove, and mist dispersion', () => {
  const sector = new ValVerdeWaterfallCaveAmbushSector({ waterfallHeightM: 28.0 });
  assert.equal(sector.waterfallAcousticRoarDb, 88.0);

  // Enter hidden cave behind waterfall
  const cave = sector.enterWaterfallCaveAlcove(false);
  assert.equal(cave.success, true);
  assert.equal(cave.thermalOcclusionScore, 100);
  assert.equal(cave.laserTargetingBlocked, true);
  assert.equal(cave.safeFromPlasmaDirectFire, true);

  // Evaluate mist dispersion on targeting
  const mist = sector.evaluateMistDropletRefraction(12.0);
  assert.equal(mist.triLaserTargetLockPossible, false);
  assert.equal(mist.thermalSignatureBlurred, true);
  assert.ok(mist.laserBeamScatteringSpreadMm > 0);

  // Slick boulder balance check
  const footingSprint = sector.resolveSlickBoulderFooting(3.5, true);
  assert.equal(footingSprint.slipped, true);
  const footingSlow = sector.resolveSlickBoulderFooting(1.2, false);
  assert.equal(footingSlow.slipped, false);
});

test('v174 Chantier LD 5: ValVerdeDutchGuerrillaTripwireNetworkSector handles brass cartridge chimes, punji lash whips, and grenade clusters', () => {
  const sector = new ValVerdeDutchGuerrillaTripwireNetworkSector({ perimeterSpanM: 60.0 });
  assert.equal(sector.nodes.length, 6);

  // Trigger brass casing chime
  const chime = sector.triggerPerimeterNode('node-brass-chime-north');
  assert.equal(chime.success, true);
  assert.equal(chime.nodeType, 'BRASS_CASING_CHIME');
  assert.equal(chime.acousticDb, 58);

  // Trigger M26 grenade cluster
  const grenade = sector.triggerPerimeterNode('node-m26-grenade-south');
  assert.equal(grenade.success, true);
  assert.equal(grenade.nodeType, 'M26_GRENADE_CLUSTER');
  assert.ok(grenade.shrapnelYield >= 400);

  // Perimeter status
  const status = sector.getPerimeterStatus();
  assert.equal(status.trippedCount, 2);
  assert.equal(status.intactCount, 4);
});

test('v174 Chantier LD 6: ValVerdeFinalUndergrowthBrawlSector resolves unmasked ritual duel, blunt strikes, and baiting under deadfall', () => {
  const sector = new ValVerdeFinalUndergrowthBrawlSector();
  assert.equal(sector.hunterMassKg, 195.0);

  // Hunter unmasks
  const unmasked = sector.initiateUnmaskedHonorableDuel();
  assert.equal(unmasked.success, true);
  assert.equal(unmasked.hunterMaskRemoved, true);
  assert.equal(unmasked.plasmaCasterDiscarded, true);
  assert.equal(unmasked.famousQuote, 'You are one ugly mother...');

  // Dutch fist punch absorbed by dense alien muscle
  const fist = sector.resolveDutchMeleeStrike('BARE_FIST');
  assert.equal(fist.damageDealt, 4);
  assert.equal(fist.hunterFlinch, false);

  // Dutch club swing flinches hunter
  const club = sector.resolveDutchMeleeStrike('HEAVY_TREE_BRANCH_CLUB');
  assert.equal(club.damageDealt, 14);
  assert.equal(club.hunterFlinch, true);

  // Hunter counter-attack
  const counter = sector.resolveHunterCounterAttack('BACKHAND_SLAP');
  assert.ok(counter.damageDealt >= 25);
  assert.equal(counter.dutchSlammedIntoMud, true);

  // Bait hunter under deadfall
  const bait = sector.baitHunterUnderDeadfallTrench();
  assert.equal(bait.success, true);
  assert.equal(bait.hunterBaitPositionedUnderDeadfall, true);
  assert.equal(bait.readyToDropDeadfall, true);
});

test('v174 Chantier LD 7: ValVerdeExtractionLZChopperSector manages red signal smoke, UH-1 Huey landing, and final extraction', () => {
  const sector = new ValVerdeExtractionLZChopperSector();
  assert.equal(sector.rotorDowndraftMps, 24.0);

  // Deploy red M18 signal flare
  const flare = sector.deployExtractionSignalSmoke('RED');
  assert.equal(flare.success, true);
  assert.equal(flare.smokeColor, 'RED');
  assert.ok(flare.signalVisibilityRangeKm >= 8.0);

  // Rescue chopper descends
  const landing = sector.descendRescueChopper(0.0);
  assert.equal(landing.success, true);
  assert.equal(landing.chopperLanded, true);
  assert.equal(landing.generalPhillipsOnboard, true);

  // Dutch boards and evacuates
  const evac = sector.executeFinalEvacuation();
  assert.equal(evac.success, true);
  assert.equal(evac.campaignCompleted, true);
  assert.equal(evac.mushroomCloudVisibleInDistance, true);
});

test('v174 Chantier LD 8: HumanQaValVerdeTacticalHUDDirector evaluates 5 human QA audits, trajectory reticule, and HUD mounting', () => {
  const director = new HumanQaValVerdeTacticalHUDDirector();

  // Evaluate 5 QA tester audits
  const qaReport = director.evaluate5HumanQaAudits();
  assert.equal(qaReport.auditsCount, 5);
  assert.equal(qaReport.allAuditsPassed, true);
  assert.equal(qaReport.diegeticFidelityScore, 100);

  // Trajectory reticule calculation
  const reticule = director.computeTrajectoryReticuleData(24.0, 15.0);
  assert.ok(reticule.arcPointsCount > 5);
  assert.equal(reticule.impactTargetMarkerActive, true);

  // Mount tactical HUD
  const mount = director.mountTacticalHUD();
  assert.equal(mount.mounted, true);
  assert.equal(mount.containerClass, 'valverde-tactical-hud-panel');
});

test('v174 Chantier LD 9: AudioSynthesizer computes water short-circuit & quicksand suction acoustics and provides 15 new SFX methods', () => {
  // Test cloak water short-circuit acoustics
  const cloakAcoustics = audioSynth.computeWaterShortCircuitCloakSparksAcoustics(15.0, 18.0, 10.0);
  assert.ok(cloakAcoustics.fundamentalSparkHz > 2500);
  assert.ok(cloakAcoustics.splAtDistanceDb >= 60.0);
  assert.equal(cloakAcoustics.acousticSignature, 'CYAN_PLASMA_DIELECTRIC_CRACKLE');

  // Test quicksand viscous suction acoustics
  const suctionAcoustics = audioSynth.computeQuicksandViscousSuctionAcoustics(140.0, 3500.0, 0.5);
  assert.ok(suctionAcoustics.cavitationBubbleFreqHz > 0);
  assert.ok(suctionAcoustics.suctionReleasePopDb >= 70);

  // Verify all 15 SFX methods
  const v174Sfx = [
    'playSpearAerodynamicWhoosh',
    'playFoliageBranchDeflectionCrack',
    'playSpearExplosiveGrenadeDetonation',
    'playQuicksandViscousSuctionGurgle',
    'playQuicksandStruggleSplash',
    'playVineTetherStrainCreak',
    'playCloakWaterShortCircuitSparks',
    'playCloakDielectricFailureBuzz',
    'playWaterfallThunderousRoar',
    'playBehindWaterfallCaveEcho',
    'playShellCasingTripwireChime',
    'playJungleHunterUnmaskedRoar',
    'playYautjaFistSlamMudThud',
    'playHueyHelicopterRotorThump',
    'playNuclearFalloutAshWindHiss'
  ];

  for (const sfx of v174Sfx) {
    assert.equal(typeof audioSynth[sfx], 'function', `Method ${sfx} must exist`);
    assert.doesNotThrow(() => audioSynth[sfx](), `Method ${sfx} should execute safely`);
  }
});

test('v174 Chantier LD 10: HumanQaValVerdePhysicsShortCircuitAuditor audits spears, quicksand, cloak short-circuits and generates consolidated report', () => {
  const auditor = new HumanQaValVerdePhysicsShortCircuitAuditor();

  // Audit spear ballistics
  const spearAudit = auditor.auditSpearBallistics({ launchSpeedMps: 24.0, terminalSpeedMps: 23.5, kineticEnergyJoules: 450 });
  assert.equal(spearAudit.passes, true);

  // Audit quicksand physics
  const quicksandAudit = auditor.auditQuicksandPhysics({ sinkDepthM: 0.5, suctionForceN: 3500, overheadVineAvailable: true });
  assert.equal(quicksandAudit.passes, true);

  // Audit cloak water short-circuit
  const cloakAudit = auditor.auditCloakWaterShortCircuit({ shortCircuitTriggered: true, sparkArcsCount: 35, visibleToHumanNakedEye: true });
  assert.equal(cloakAudit.passes, true);

  // Consolidated audit report
  const report = auditor.generateConsolidatedValVerdeAuditReport();
  assert.equal(report.totalAuditsExecuted, 3);
  assert.equal(report.passedAuditsCount, 3);
  assert.equal(report.compliancePct, 100);
});
