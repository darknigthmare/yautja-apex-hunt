import test from 'node:test';
import assert from 'node:assert/strict';

import { SuperPredatorCampTrophyCagesSector } from '../src/gameplay/SuperPredatorCampTrophyCagesSector.js';
import { GunnisonHospitalMaternityInfestationSector } from '../src/gameplay/GunnisonHospitalMaternityInfestationSector.js';
import { QuicksandBogGrizzlyAmbushSector } from '../src/gameplay/QuicksandBogGrizzlyAmbushSector.js';
import { StargazerSchoolBusRoadblockSector } from '../src/gameplay/StargazerSchoolBusRoadblockSector.js';
import { ValVerdeWaterfallCaveShelterSector } from '../src/gameplay/ValVerdeWaterfallCaveShelterSector.js';
import { HumanQaPredictiveDiscTrajectoryHUDDirector } from '../src/gameplay/HumanQaPredictiveDiscTrajectoryHUDDirector.js';
import { HumanQaDiegeticAcidEtchingVisorAuditor } from '../src/gameplay/HumanQaDiegeticAcidEtchingVisorAuditor.js';
import { HumanQaGameplayMudShieldVaultAuditor } from '../src/gameplay/HumanQaGameplayMudShieldVaultAuditor.js';
import { HumanQaLevelDesignWaterfallHydroScreenAuditor } from '../src/gameplay/HumanQaLevelDesignWaterfallHydroScreenAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v169 Chantier 1: SuperPredatorCampTrophyCagesSector handles suspended cage severance, guillotine trap and plasma claymores', () => {
  const camp = new SuperPredatorCampTrophyCagesSector();
  assert.equal(camp.campId, 'super-pred-camp-01');
  assert.equal(camp.cages.length, 4);

  // Sever cage cable
  const dropResult = camp.triggerCageDropOrRelease('cage-bone-01', true);
  assert.equal(dropResult.success, true);
  assert.equal(dropResult.action, 'CAGE_CABLE_SEVERED');
  assert.ok(dropResult.impactVelocityMps > 10.0);
  assert.ok(dropResult.groundCrushDamage > 150);

  // Guillotine wire trap
  const guillotineResult = camp.triggerGuillotineRazorTrap(45.0);
  assert.equal(guillotineResult.triggered, true);
  assert.equal(guillotineResult.effectiveSeveranceForceN, 3200.0);
  assert.equal(guillotineResult.decapitationDamage, 185);

  // Berserker claymore
  const claymoreResult = camp.resolveBerserkerPlasmaClaymore(3.0);
  assert.equal(claymoreResult.detonated, true);
  assert.ok(claymoreResult.plasmaConcussionDamage > 100);
  assert.equal(claymoreResult.thermalDegreesC, 2800);
});

test('v169 Chantier 2: GunnisonHospitalMaternityInfestationSector resolves Predalien acid vomit, Wolf solvent canister and strobe distortion', () => {
  const hospital = new GunnisonHospitalMaternityInfestationSector();
  assert.equal(hospital.sectorId, 'gunnison-hosp-maternity-01');

  // Predalien acid vomit
  const acidVomit = hospital.resolvePredalienAcidVomit(3.8, false);
  assert.equal(acidVomit.attackSuccess, true);
  assert.equal(acidVomit.acidPh, 0.4);
  assert.equal(acidVomit.corrosiveDps, 45);
  assert.ok(acidVomit.visorEtchDepthMicrons > 10.0);

  // Wolf dissolving solvent
  const solventResult = hospital.deployWolfDissolvingSolventCanister(3.5);
  assert.equal(solventResult.success, true);
  assert.equal(solventResult.exothermicTemperatureC, 950.0);
  assert.equal(solventResult.cellularDissolutionRatePct, 99.8);
  assert.equal(solventResult.dnaTraceErased, true);

  // Emergency strobe lighting distortion
  const strobe = hospital.computeEmergencyStrobeDistortion();
  assert.equal(strobe.emergencyStrobeHz, 0.8);
  assert.equal(strobe.flashIntervalMs, 1250);
  assert.ok(strobe.thermalShadowingNoisePct > 20.0);
});

test('v169 Chantier 3: QuicksandBogGrizzlyAmbushSector evaluates non-Newtonian sinking, shield flotation extrication and Grizzly attacks', () => {
  const bog = new QuicksandBogGrizzlyAmbushSector();
  assert.equal(bog.bogDepthM, 2.0);

  // Stationary sinking
  const sink1 = bog.updateQuicksandSinking(3.0, false);
  assert.ok(sink1.submersionDepthM > 0.0);
  assert.ok(sink1.suctionForceN > 0);
  assert.ok(sink1.speedMultiplier < 1.0);

  // Shield flotation extrication
  const extricate = bog.deployShieldFlotationExtrication(1.6);
  assert.equal(extricate.success, true);
  assert.ok(extricate.buoyancyForceN >= 3840.0);
  assert.equal(extricate.staminaCost, 30);

  // Grizzly attack
  const grizzlyAttack = bog.resolveGrizzlyChargeAttack(1.8);
  assert.equal(grizzlyAttack.chargeSuccess, true);
  assert.equal(grizzlyAttack.grizzlyMassKg, 520.0);
  assert.equal(grizzlyAttack.jawPressurePsi, 1200.0);
  assert.ok(grizzlyAttack.swipeDamage >= 135);
});

test('v169 Chantier 4: StargazerSchoolBusRoadblockSector simulates .50 BMG turret bursts, fuel tank rupture and EMP disabling', () => {
  const roadblock = new StargazerSchoolBusRoadblockSector();
  assert.equal(roadblock.turretM2CaliberMm, 12.7);

  // Roof turret burst
  const burst = roadblock.fireRoofTurret50BmgBurst(10, 25.0);
  assert.equal(burst.success, true);
  assert.equal(burst.burstRounds, 10);
  assert.ok(burst.landedShots >= 5);
  assert.equal(burst.armorPenetrationMmSteel, 22.0);

  // EMP Disruption
  const emp = roadblock.applyEmpDisruption(5.0);
  assert.equal(emp.turretOperational, false);
  assert.equal(emp.fireControlSystemOffline, true);

  // Fuel tank rupture
  const explosion = roadblock.ruptureFuelTanks(true);
  assert.equal(explosion.success, true);
  assert.equal(explosion.totalBlastDamage, 850);
  assert.equal(explosion.blastRadiusM, 11.5);
  assert.equal(explosion.fireballTemperatureC, 850.0);
});

test('v169 Chantier 5: ValVerdeWaterfallCaveShelterSector calculates waterfall thermal masking, swinging log trap and resin torches', () => {
  const cave = new ValVerdeWaterfallCaveShelterSector();
  assert.equal(cave.waterfallHeightM, 40.0);

  // Waterfall shielding
  const shield = cave.computeWaterfallCurtainShielding(11.5);
  assert.equal(shield.thermalTransmissionPct, 1.2);
  assert.equal(shield.thermalInfraredMasked, true);
  assert.ok(shield.acousticMaskingDecibels > 85.0);
  assert.equal(shield.footstepAcousticsDrownedOut, true);

  // Swinging log deadfall trap
  const logTrap = cave.releaseCounterweightedLogTrap(6.5);
  assert.equal(logTrap.success, true);
  assert.equal(logTrap.suspendedLogMassKg, 800.0);
  assert.equal(logTrap.bluntCrushDamage, 280);
  assert.ok(logTrap.kineticEnergyJoules > 40000);

  // Torch
  const torch = cave.lightResinTorch();
  assert.equal(torch.success, true);
  assert.equal(torch.lumenOutput, 450);
});

test('v169 Chantier 6 & Audit QA #1 (UI/UX): HumanQaPredictiveDiscTrajectoryHUDDirector computes ricochet trajectory, apex, and critical nodes', () => {
  const director = new HumanQaPredictiveDiscTrajectoryHUDDirector();
  assert.equal(director.discVelocityMps, 38.0);

  const trajectory = director.computePredictiveTrajectory(
    { x: 0, y: 1.5, z: 0 },
    { x: 0, y: 0, z: -1 },
    [
      { distanceM: 10.0, normal: { x: 0.707, y: 0, z: 0.707 }, targetNear: false },
      { distanceM: 15.0, normal: { x: -0.707, y: 0, z: 0.707 }, targetNear: true }
    ]
  );

  assert.equal(trajectory.hudActive, true);
  assert.equal(trajectory.bounceNodesCount, 2);
  assert.ok(trajectory.nodes[0].criticalHitProbPct > 0);
  assert.ok(typeof trajectory.nodes[0].statusColor, 'string');
  assert.ok(trajectory.returnVectorToGauntlet !== undefined);
});

test('v169 Chantier 7 & Audit QA #2 (SFX): AudioSynthesizer computes heavy caliber BMG acoustics, suspended log seismic impact and 15 procedural SFX', () => {
  assert.equal(typeof audioSynth.computeHeavyCaliberBmgShockwaveAcoustics, 'function');
  assert.equal(typeof audioSynth.computeSuspendedLogImpactSeismicAcoustics, 'function');

  // Math Acoustics 1: BMG Shockwave
  const bmg = audioSynth.computeHeavyCaliberBmgShockwaveAcoustics(25.0, 12.7, 890.0);
  assert.ok(bmg.machNumber >= 2.5);
  assert.ok(bmg.supersonicConeAngleDeg > 0);
  assert.ok(bmg.muzzleBlastDecibels > 120);

  // Math Acoustics 2: Suspended Log Impact
  const logAcoustics = audioSynth.computeSuspendedLogImpactSeismicAcoustics(800.0, 11.3, 'GRANITE_CAVE_FLOOR');
  assert.ok(logAcoustics.kineticEnergyJoules > 45000);
  assert.ok(logAcoustics.seismicRumbleHz > 40);
  assert.ok(logAcoustics.impactDecibels > 90);

  // 15 Procedural SFX existence and execution without throws
  const sfxMethods = [
    'playHeavyCaliber50BmgMuzzleBlast',
    'playBmgBulletMetalRicochetSnap',
    'playSuspendedTreeTrunkSwingWhoosh',
    'playTreeTrunkCrushingImpactSmash',
    'playQuicksandViscousMudSuctionGurgle',
    'playGrizzlyBearFuriousRoar',
    'playPredalienAcidSalivaDripSizzle',
    'playHospitalNeonatalIncubatorAlarm',
    'playSuperPredatorBoneCageRattle',
    'playWaterfallGraniteCaveWaterRoar',
    'playPredictiveTrajectoryLockTone',
    'playDiegeticCorrosiveDropletSizzleVisor',
    'playMudFlotationShieldDeployClack',
    'playSchoolBusFuelTankRuptureBlast',
    'playResinTorchIgnitionFwhoosh'
  ];

  for (const method of sfxMethods) {
    assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method](), `Calling ${method} should not throw`);
  }
});

test('v169 Chantier 8 & Audit QA #3 (Diégétique): HumanQaDiegeticAcidEtchingVisorAuditor tracks acid craters, optical transmission loss and alkaline wash', () => {
  const auditor = new HumanQaDiegeticAcidEtchingVisorAuditor();
  assert.equal(auditor.opticalClarityPct, 100.0);

  // Register acid impact
  const impact = auditor.registerAcidImpact(4, 0.4);
  assert.equal(impact.impactRegistered, true);
  assert.ok(impact.currentEtchingDepthMicrons > 5.0);
  assert.ok(impact.opticalClarityPct < 100.0);
  assert.equal(impact.diegeticWarningActive, true);
  assert.equal(impact.vocalAlarm, 'CAUSTIC_PENETRATION_WARNING');

  // Neutralizing alkaline wash
  const wash = auditor.applyAlkalineNeutralizingWash(25.0);
  assert.equal(wash.success, true);
  assert.ok(wash.depthNeutralized > 0);
  assert.ok(wash.opticalClarityPct > impact.opticalClarityPct);
});

test('v169 Chantier 9 & Audit QA #4 (Gameplay): HumanQaGameplayMudShieldVaultAuditor executes mud shield vault, i-frames, and beast stun shockwave', () => {
  const auditor = new HumanQaGameplayMudShieldVaultAuditor();
  assert.equal(auditor.shieldSurfaceAreaM2, 1.8);

  // Insufficient stamina check
  const fail = auditor.executeMudShieldVault(1.2, 15.0);
  assert.equal(fail.success, false);
  assert.equal(fail.reason, 'INSUFFICIENT_STAMINA');

  // Successful vault
  const vault = auditor.executeMudShieldVault(1.2, 60.0);
  assert.equal(vault.success, true);
  assert.equal(vault.action, 'MUD_SHIELD_VAULT_EXECUTED');
  assert.equal(vault.vaultDistanceM, 6.5);
  assert.equal(vault.invulnerabilityDurationMs, 160);
  assert.equal(vault.beastStunDurationSec, 2.2);
  assert.equal(vault.staminaConsumed, 30.0);

  // Cooldown active check
  const cdFail = auditor.executeMudShieldVault(1.2, 60.0);
  assert.equal(cdFail.success, false);
  assert.equal(cdFail.reason, 'COOLDOWN_ACTIVE');
});

test('v169 Chantier 10 & Audit QA #5 (Level Design): HumanQaLevelDesignWaterfallHydroScreenAuditor evaluates IR occlusion, cooling and ballistics traverse', () => {
  const auditor = new HumanQaLevelDesignWaterfallHydroScreenAuditor();
  assert.equal(auditor.waterfallFlowRateLpm, 120000.0);

  // Behind curtain evaluation
  const occlusion = auditor.evaluateWaterfallTacticalOcclusion(true, 320.0);
  assert.equal(occlusion.behindWaterCurtain, true);
  assert.equal(occlusion.thermalCloaked, true);
  assert.equal(occlusion.thermalTransmissionPct, 1.2);
  assert.equal(occlusion.audibleFootstepRadiusM, 0.0);
  assert.equal(occlusion.enemySniperLockBroken, true);
  assert.equal(occlusion.quenchedPlasmacasterTempC, 255.0);

  // Projectile traversals
  const plasmaTraverse = auditor.resolveProjectileHydroCurtainTraverse('PLASMA_BOLT');
  assert.equal(plasmaTraverse.penetrated, true);
  assert.equal(plasmaTraverse.plasmaEnergyAttenuationPct, 45.0);

  const arrowTraverse = auditor.resolveProjectileHydroCurtainTraverse('ARROW');
  assert.equal(arrowTraverse.penetrated, false);
  assert.equal(arrowTraverse.arrowSweptDownstream, true);
});
