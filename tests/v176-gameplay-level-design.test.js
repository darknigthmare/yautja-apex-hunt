import test from 'node:test';
import assert from 'node:assert/strict';

import { ValVerdeFlashFloodDamBreachSector } from '../src/gameplay/ValVerdeFlashFloodDamBreachSector.js';
import { ValVerdeDelayedExplosiveArrowTrapSector } from '../src/gameplay/ValVerdeDelayedExplosiveArrowTrapSector.js';
import { ValVerdeMudBrawlParryDuelSector } from '../src/gameplay/ValVerdeMudBrawlParryDuelSector.js';
import { ValVerdePhosphorusSmokeScreenSector } from '../src/gameplay/ValVerdePhosphorusSmokeScreenSector.js';
import { ValVerdeButtressRootTrenchTunnelSector } from '../src/gameplay/ValVerdeButtressRootTrenchTunnelSector.js';
import { ValVerdePrimitivePulleyHoistSector } from '../src/gameplay/ValVerdePrimitivePulleyHoistSector.js';
import { ValVerdeTriLaserAtmosphericRefractionSector } from '../src/gameplay/ValVerdeTriLaserAtmosphericRefractionSector.js';
import { HumanQaValVerdeMudBrawlHUDDirector } from '../src/gameplay/HumanQaValVerdeMudBrawlHUDDirector.js';
import { HumanQaValVerdeMudBrawlFloodAuditor } from '../src/gameplay/HumanQaValVerdeMudBrawlFloodAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v176 Chantier LD 1: ValVerdeFlashFloodDamBreachSector evaluates hydrostatic dam pressure, breach wave, and mud stripping', () => {
  const sector = new ValVerdeFlashFloodDamBreachSector({ damRetentionVolumeLiters: 120000 });
  assert.equal(sector.damIntact, true);

  // Hydrostatic pressure at 2.8m water head
  const pressure = sector.evaluateDamHydrostaticPressure(2.8);
  assert.ok(pressure.hydrostaticPressureKpa >= 24.0);
  assert.equal(pressure.willBreach, true);

  // Trigger breach wave
  const wave = sector.triggerDamBreachWave();
  assert.equal(wave.damBreached, true);
  assert.equal(wave.waterSurgeHeightM, 2.2);
  assert.equal(wave.mudCamouflageStripped, true);
  assert.ok(wave.kineticWaveForceJoules > 50000);

  // Entity flood interaction in low trench vs high ground
  const lowEntity = sector.resolveEntityFloodInteraction(0.5);
  assert.equal(lowEntity.submerged, true);
  assert.equal(lowEntity.mudCamouflageRemoved, true);

  const highEntity = sector.resolveEntityFloodInteraction(2.5);
  assert.equal(highEntity.submerged, false);
  assert.equal(highEntity.balanceMaintained, true);
});

test('v176 Chantier LD 2: ValVerdeDelayedExplosiveArrowTrapSector fires timed arrows, ticks fuse countdown, and coordinates trap synergy', () => {
  const sector = new ValVerdeDelayedExplosiveArrowTrapSector();
  assert.equal(sector.arrowsRemaining, 3);

  // Fire delayed arrow into hollow tree
  const fired = sector.fireDelayedExplosiveArrow('HOLLOW_KAPOK_TRUNK_NORTH', 35.0, 4.0);
  assert.equal(fired.success, true);
  assert.equal(sector.arrowsRemaining, 2);
  assert.equal(fired.fuseDelaySec, 4.0);

  // Update timers by 4.0s to trigger detonation
  const tick = sector.updateDelayTimers(4.0);
  assert.equal(tick.detonatedCount, 1);
  assert.equal(tick.detonatedTraps[0].acousticBlastDb, 132);

  // Resolve secondary trap synergy (Hunter investigated detonation into deadfall)
  const synergy = sector.resolveCoordinatedTrapSynergy('COUNTERWEIGHTED_DEADFALL');
  assert.equal(synergy.success, true);
  assert.equal(synergy.diversionSuccessful, true);
  assert.equal(synergy.killzoneSynergyMultiplier, 2.5);
});

test('v176 Chantier LD 3: ValVerdeMudBrawlParryDuelSector telegraphs assaults, resolves 220ms reflex parries, and counters with knee strike', () => {
  const sector = new ValVerdeMudBrawlParryDuelSector({ parryWindowMs: 220.0 });

  // Hunter telegraphs wristblade sweep
  const telegraph = sector.telegraphHunterAssault('WRISTBLADE_SWEEP');
  assert.equal(telegraph.attackType, 'WRISTBLADE_SWEEP');
  assert.equal(telegraph.parryWindowMs, 220.0);

  // Successful parry within window
  const parrySuccess = sector.attemptReflexParry(20.0);
  assert.equal(parrySuccess.success, true);
  assert.equal(parrySuccess.parrySuccessful, true);
  assert.equal(parrySuccess.branchDamageAbsorptionJoules, 750);
  assert.equal(sector.comboParriesCount, 1);

  // Execute counter knee strike
  const counter = sector.executeCounterStrike('KNEE_STRIKE');
  assert.equal(counter.success, true);
  assert.equal(counter.counterMove, 'KNEE_STRIKE');
  assert.ok(counter.damageDealt > 0);
  assert.equal(counter.readyToExecuteDeadfallBait, true);
});

test('v176 Chantier LD 4: ValVerdePhosphorusSmokeScreenSector deploys thermal smoke, saturates bio-mask with whiteout, and dissipates with wind', () => {
  const sector = new ValVerdePhosphorusSmokeScreenSector({ cloudRadiusM: 18.0, burnDurationSec: 35.0 });

  // Deploy M34 white phosphorus smoke
  const smoke = sector.deployPhosphorusSmoke('M34_WP_GRENADE');
  assert.equal(smoke.success, true);
  assert.equal(smoke.particleTempC, 1100.0);
  assert.equal(smoke.thermalBloomSaturating, true);
  assert.equal(smoke.bioMaskTargetLockBlocked, true);

  // Dissipate smoke with wind
  const windTick = sector.updateSmokeDispersion(10.0, 2.5);
  assert.equal(windTick.activeCloud, true);
  assert.ok(windTick.smokeDensityPct < 100);
});

test('v176 Chantier LD 5: ValVerdeButtressRootTrenchTunnelSector crawls through restricted 0.85m clearance with overhead plasma shielding', () => {
  const sector = new ValVerdeButtressRootTrenchTunnelSector({ ceilingClearanceM: 0.85 });

  // Enter crawlspace
  const enter = sector.enterRootTunnel();
  assert.equal(enter.success, true);
  assert.equal(enter.playerInsideTunnel, true);
  assert.equal(enter.overheadPlasmaShielded, true);
  assert.equal(enter.ceilingClearanceM, 0.85);

  // Advance to deadfall liana chamber
  const advance = sector.crawlAdvance(11.0);
  assert.equal(advance.success, true);
  assert.equal(advance.currentNode, 'DEADFALL_LIANA_CHAMBER');

  // Exit tunnel
  const exit = sector.exitTunnelIntoClearing();
  assert.equal(exit.success, true);
  assert.equal(exit.playerInsideTunnel, false);
});

test('v176 Chantier LD 6: ValVerdePrimitivePulleyHoistSector hoists 1200kg log with 3:1 mechanical advantage and trips toggle peg release', () => {
  const sector = new ValVerdePrimitivePulleyHoistSector({ logMassKg: 1200.0, mechanicalAdvantage: 3.0 });

  // Hoist deadfall log
  const hoist = sector.hoistDeadfallLog(5.5);
  assert.equal(hoist.success, true);
  assert.equal(hoist.mechanicalAdvantage, 3.0);
  assert.ok(hoist.requiredEffortForceN < 4000);
  assert.equal(hoist.togglePegSecured, true);

  // Trip toggle peg release
  const trip = sector.tripTogglePegRelease();
  assert.equal(trip.success, true);
  assert.equal(trip.togglePegEjected, true);
  assert.equal(trip.releaseLatencyMs, 45);
  assert.ok(trip.impactVelocityMps > 10.0);
});

test('v176 Chantier LD 7: ValVerdeTriLaserAtmosphericRefractionSector models volumetric beam scattering through rain and convergence lock', () => {
  const sector = new ValVerdeTriLaserAtmosphericRefractionSector({ wavelengthNm: 635.0, lockConvergenceTimeSec: 1.2 });

  // Volumetric beam scattering in tropical rain
  const scattering = sector.evaluateVolumetricBeamScattering(45.0, 25.0);
  assert.equal(scattering.wavelengthNm, 635.0);
  assert.equal(scattering.volumetricConeVisibleToHumanEye, true);
  assert.ok(scattering.beamVisibilityScore >= 40);

  // Convergence lock on target
  const lock = sector.trackTargetConvergence(1.2, false);
  assert.equal(lock.lockAcquired, true);
  assert.equal(lock.plasmaDischargeReady, true);
  assert.equal(lock.convergenceProgressPct, 100);

  // Break lock in cover
  const breakLock = sector.trackTargetConvergence(0.5, true);
  assert.equal(breakLock.lockAcquired, false);
  assert.equal(breakLock.lockBrokenReason, 'TARGET_DIVED_INTO_COVER');
});

test('v176 Chantier LD 8: HumanQaValVerdeMudBrawlHUDDirector evaluates 5 QA audits and mounts Mud Brawl HUD panel', () => {
  const director = new HumanQaValVerdeMudBrawlHUDDirector();

  // Evaluate 5 QA audits
  const qa = director.evaluate5MudBrawlFloodAudits();
  assert.equal(qa.auditsCount, 5);
  assert.equal(qa.allPassed, true);
  assert.ok(qa.parryWindowFairnessScore >= 98.0);

  // Mount HUD
  const mount = director.mountMudBrawlHUD();
  assert.equal(mount.mounted, true);
  assert.equal(mount.panelClass, 'valverde-mud-brawl-hud-panel');
});

test('v176 Chantier LD 9: AudioSynthesizer computes flood surge & tri-laser acoustics and executes 15 new SFX methods', () => {
  // Test flood acoustics
  const floodAcoustics = audioSynth.computeFlashFloodHydrodynamicWaveAcoustics(120000, 45.0, 20.0);
  assert.ok(floodAcoustics.subBassSurgeHz <= 45.0);
  assert.ok(floodAcoustics.splAtDistanceDb >= 60.0);

  // Test tri-laser acoustics
  const laserAcoustics = audioSynth.computeTriLaserVolumetricScatteringAcoustics(15.0, 45.0, 25.0);
  assert.equal(laserAcoustics.chirpStartFreqHz, 2800);
  assert.equal(laserAcoustics.chirpEndFreqHz, 3600);

  // Verify all 15 SFX methods
  const v176Sfx = [
    'playDamBreachWoodSplinterSnap',
    'playFlashFloodSurgeWaveRoar',
    'playDelayedArrowFuseHiss',
    'playDelayedArrowShapedChargeBlast',
    'playMudBrawlWristbladeParryClang',
    'playMudBrawlKneeStrikeGrunt',
    'playMudBrawlStruggleSlosh',
    'playPhosphorusSmokeBloomHiss',
    'playRootTunnelClaustrophobicCrawl',
    'playPrimitivePulleyRopeGroan',
    'playTriLaserLockAcquisitionChirp',
    'playTriLaserRainDropletSizzle',
    'playMudBrawlHeadbuttImpactCrack',
    'playWaterWaveMudWallWashaway',
    'playThunderousJungleStormRumble'
  ];

  for (const sfx of v176Sfx) {
    assert.equal(typeof audioSynth[sfx], 'function', `Method ${sfx} must exist`);
    assert.doesNotThrow(() => audioSynth[sfx](), `Method ${sfx} must execute cleanly`);
  }
});

test('v176 Chantier LD 10: HumanQaValVerdeMudBrawlFloodAuditor audits flood waves, delayed arrows, reflex parries, and generates consolidated report', () => {
  const auditor = new HumanQaValVerdeMudBrawlFloodAuditor();

  // Audit flash flood
  const floodAudit = auditor.auditFlashFloodHydrodynamics({ damBreached: true, waterSurgeHeightM: 2.2, floodSurgeSpeedMps: 8.5 });
  assert.equal(floodAudit.passes, true);

  // Audit delayed arrow
  const arrowAudit = auditor.auditDelayedArrowTrapCoordination({ diversionSuccessful: true, killzoneSynergyMultiplier: 2.5 });
  assert.equal(arrowAudit.passes, true);

  // Audit mud brawl reflex parry
  const parryAudit = auditor.auditMudBrawlReflexParryFairness({ parrySuccessful: true, branchDamageAbsorptionJoules: 750 });
  assert.equal(parryAudit.passes, true);

  // Consolidated report
  const report = auditor.generateConsolidatedMudBrawlReport();
  assert.equal(report.totalAuditsExecuted, 3);
  assert.equal(report.passedCount, 3);
  assert.equal(report.compliancePct, 100);
});
