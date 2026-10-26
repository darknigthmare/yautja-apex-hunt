import test from 'node:test';
import assert from 'node:assert/strict';

import { Predators2010RiverbankMudCoolingSector } from '../src/gameplay/Predators2010RiverbankMudCoolingSector.js';
import { Predators2010MombasaPunjiDeadfallTrapSector } from '../src/gameplay/Predators2010MombasaPunjiDeadfallTrapSector.js';
import { Predators2010NolandSmokeChamberSector } from '../src/gameplay/Predators2010NolandSmokeChamberSector.js';
import { Predators2010BerserkerMaskRipShowdownSector } from '../src/gameplay/Predators2010BerserkerMaskRipShowdownSector.js';
import { Predators2010FalconDroneLaserRelaySector } from '../src/gameplay/Predators2010FalconDroneLaserRelaySector.js';
import { Predators2010StansShivSpineSacrificeSector } from '../src/gameplay/Predators2010StansShivSpineSacrificeSector.js';
import { Predators2010YautjaDefeatGauntletProtocolSector } from '../src/gameplay/Predators2010YautjaDefeatGauntletProtocolSector.js';
import { HumanQaPredators2010MasterHUDDirector } from '../src/gameplay/HumanQaPredators2010MasterHUDDirector.js';
import { HumanQaPredators2010MasterAuditor } from '../src/gameplay/HumanQaPredators2010MasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v184 Chantier LD 1: Predators2010RiverbankMudCoolingSector applies mud layer, achieves thermal occlusion, and simulates gradual drying', () => {
  const mudSector = new Predators2010RiverbankMudCoolingSector({ mudLayerThicknessMm: 8.5 });

  // Out of bank check
  const failApply = mudSector.applyMudCamouflage(1.0);
  assert.strictEqual(failApply.success, false);

  // Climb and apply
  mudSector.climbOntoRiverbank();
  const applyRes = mudSector.applyMudCamouflage(1.0);
  assert.strictEqual(applyRes.success, true);
  assert.strictEqual(applyRes.irInvisible, true);
  assert.ok(mudSector.thermalOcclusionPct >= 99.0);

  // Dry update
  const dryRes = mudSector.updateMudDrying(60.0);
  assert.strictEqual(dryRes.active, true);
  assert.ok(dryRes.thermalOcclusionPct > 60.0);

  // Full drying
  const driedOut = mudSector.updateMudDrying(150.0);
  assert.strictEqual(driedOut.active, false);
  assert.strictEqual(driedOut.thermalOcclusionPct, 0.0);
});

test('v184 Chantier LD 2: Predators2010MombasaPunjiDeadfallTrapSector detects punji deadfall trap or triggers pit collapse and performs emergency extraction', () => {
  const trapSector = new Predators2010MombasaPunjiDeadfallTrapSector({ pitDepthM: 4.2 });

  // Scout detection
  const scout = trapSector.scoutJunglePath(90);
  assert.strictEqual(scout.status, 'TRAP_DETECTED_PUNJI_DEADFALL_IDENTIFIED');
  assert.strictEqual(trapSector.trapDetectedByScout, true);

  // Unwary scout trigger on new instance
  const trapSector2 = new Predators2010MombasaPunjiDeadfallTrapSector({ pitDepthM: 4.2 });
  const triggerRes = trapSector2.triggerDeadfallTrap(65.0);
  assert.strictEqual(triggerRes.status, 'DEADFALL_SNAPPED_PIT_COLLAPSE');
  assert.strictEqual(trapSector2.victimTrapped, true);

  // Extraction
  const extractRes = trapSector2.performEmergencyExtraction(1800.0);
  assert.strictEqual(extractRes.success, true);
  assert.strictEqual(trapSector2.victimTrapped, false);
  assert.strictEqual(trapSector2.extractionCompleted, true);
});

test('v184 Chantier LD 3: Predators2010NolandSmokeChamberSector simulates CO toxicity rise and blasts open steel bulkhead hinges before asphyxiation', () => {
  const smokeSector = new Predators2010NolandSmokeChamberSector({ bulkheadHingeHp: 300.0 });

  // Update atmosphere
  const tox = smokeSector.updateAtmosphereToxicity(10.0);
  assert.strictEqual(tox.sealed, true);
  assert.ok(tox.coPpm > 50.0);

  // Partial blast
  const partialBlast = smokeSector.blastBulkheadHinges(150.0);
  assert.strictEqual(partialBlast.success, false);
  assert.strictEqual(smokeSector.bulkheadHingeHp, 150.0);

  // Final breach
  const breach = smokeSector.blastBulkheadHinges(150.0);
  assert.strictEqual(breach.success, true);
  assert.strictEqual(smokeSector.bulkheadSealed, false);
  assert.strictEqual(smokeSector.breachExploded, true);
});

test('v184 Chantier LD 4: Predators2010BerserkerMaskRipShowdownSector advances duel stages, crushes sternum with knee drive, and rips bio-mask', () => {
  const showdown = new Predators2010BerserkerMaskRipShowdownSector();

  // Exchange melee clashes
  showdown.exchangeMeleeClashes(75.0);
  showdown.exchangeMeleeClashes(75.0);
  showdown.exchangeMeleeClashes(75.0);
  assert.strictEqual(showdown.duelStage, 'GRAPPLE_KNEE_STRIKE');

  // Knee drive
  const knee = showdown.deliverSternumKneeDrive();
  assert.strictEqual(knee.success, true);
  assert.strictEqual(showdown.duelStage, 'MASK_RIPPED');

  // Rip bio-mask
  const rip = showdown.ripClassicBioMask();
  assert.strictEqual(rip.success, true);
  assert.strictEqual(showdown.classicMaskIntact, false);
  assert.strictEqual(showdown.duelStage, 'EXECUTION');

  // Execution
  const exec = showdown.executeClassicPredator();
  assert.strictEqual(exec.success, true);
  assert.strictEqual(showdown.classicDefeated, true);
});

test('v184 Chantier LD 5: Predators2010FalconDroneLaserRelaySector launches cybernetic drone, paints ground targets with optical laser, and handles EMP crash', () => {
  const droneSector = new Predators2010FalconDroneLaserRelaySector({ flightAltitudeM: 45.0 });

  const launch = droneSector.launchFalconDrone();
  assert.strictEqual(launch.status, 'FALCON_DRONE_AIRBORNE');
  assert.strictEqual(droneSector.droneLaunched, true);

  const paint = droneSector.paintGroundTargetWithLaser('target_royce', 65.0);
  assert.strictEqual(paint.success, true);
  assert.strictEqual(droneSector.laserPainted, true);

  const crash = droneSector.destroyOrEmpDrone(150.0);
  assert.strictEqual(crash.success, true);
  assert.strictEqual(droneSector.droneLaunched, false);
});

test('v184 Chantier LD 6: Predators2010StansShivSpineSacrificeSector mounts rear shiv ambush, lands neck strikes, and secures squad escape before trophy extraction', () => {
  const stansSector = new Predators2010StansShivSpineSacrificeSector({ distractionTimeSeconds: 8.0 });

  const mount = stansSector.mountRearShivAmbush();
  assert.strictEqual(mount.status, 'REAR_AMBUSH_MOUNTED_ON_BERSERKER');
  assert.strictEqual(stansSector.rearAmbushMounted, true);

  const strikes = stansSector.deliverNeckShivStrikes(4);
  assert.strictEqual(strikes.success, true);
  assert.strictEqual(stansSector.strikesLanded, 4);

  const tick = stansSector.updateDistraction(8.0);
  assert.strictEqual(tick.status, 'SPINE_AND_SKULL_TROPHY_EXTRACTED');
  assert.strictEqual(stansSector.stansSpineExtracted, true);
  assert.strictEqual(stansSector.squadEscapeSecured, true);
});

test('v184 Chantier LD 7: Predators2010YautjaDefeatGauntletProtocolSector enforces strict user rule (dormant for humans or living Yautja, armed strictly upon Yautja defeat)', () => {
  const protocol = new Predators2010YautjaDefeatGauntletProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain subit une défaite -> Inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_CANNOT_ARM_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja est toujours en vie (HP > 0) -> Standby
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 75, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_SURVIVING_PROTOCOL_STANDBY');

  // Condition 3: Chasseur Yautja perd (HP <= 0) dans la réserve de chasse de Predators 2010 -> Doit s'armer
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(defeatCheck.status, 'YAUTJA_GAUNTLET_SELF_DESTRUCT_INITIATED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.gauntletLidOpen, true);
  assert.strictEqual(protocol.laughterEchoing, true);

  // Tick countdown
  const tick = protocol.tickCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Micro-nuclear vaporization
  const blast = protocol.tickCountdown(10.5);
  assert.strictEqual(blast.status, 'MICRO_NUCLEAR_CLEANSING_VAPORIZATION');
  assert.strictEqual(protocol.vaporizationDetonated, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v184 Chantier LD 8: HumanQaPredators2010MasterHUDDirector mounts master HUD panel and reflects Yautja defeat gauntlet alarm', () => {
  const director = new HumanQaPredators2010MasterHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 9.8,
    activeGlyph: 'ᛟ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᛟ');
});

test('v184 Chantier LD 9: AudioSynthesizer computes riverbank mud & falcon drone acoustics and executes 15 new v184 SFX methods', () => {
  const mudAcoustics = audioSynth.computeRiverbankMudThermalAcoustics(8.5, 21.0);
  assert.ok(mudAcoustics.squelchResonanceHz > 0);
  assert.ok(mudAcoustics.thermalCoolingDissipationDb > 0);

  const droneAcoustics = audioSynth.computeFalconDroneAerodynamicAcoustics(28.0, 45.0, 160.0);
  assert.ok(droneAcoustics.droneHumAcousticHz > 160.0);
  assert.ok(droneAcoustics.groundAttenuationDb > 0);

  // Verify that all 15 SFX methods exist and execute without throw
  const sfxList = [
    'playMudSlatherCoatingSFX',
    'playPunjiBambooSnapSFX',
    'playDeadfallLogDropThudSFX',
    'playBulkheadHingeBreachBlastSFX',
    'playDieselExhaustSmokeHissSFX',
    'playFalconDronePropellerHumSFX',
    'playFalconLaserTargetPaintSFX',
    'playShivNeckStabGoreSFX',
    'playClassicMaskRipMetalClatterSFX',
    'playBerserkerHeavyKneeSternumSFX',
    'playGauntletKeypadLidSnapSFX',
    'playRedGlyphScrollPulseSFX',
    'playDutchRecordedLaughEchoSFX',
    'playCoreThermalCriticalSirenSFX',
    'playMicroNuclearCleansingDetonationSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v184 Chantier LD 10: HumanQaPredators2010MasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPredators2010MasterAuditor();
  const report = auditor.runFullMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
