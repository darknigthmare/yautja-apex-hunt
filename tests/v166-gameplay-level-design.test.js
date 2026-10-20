import test from 'node:test';
import assert from 'node:assert/strict';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { LosAngelesSlaughterhouseColdStorageSector } from '../src/gameplay/LosAngelesSlaughterhouseColdStorageSector.js';
import { BouvetoyaPyramidInitiationAltarSector } from '../src/gameplay/BouvetoyaPyramidInitiationAltarSector.js';
import { BisonPlainsBarbedArrowFeralShieldSector } from '../src/gameplay/BisonPlainsBarbedArrowFeralShieldSector.js';
import { MothershipOrbitalExfiltrationCargoRampSector } from '../src/gameplay/MothershipOrbitalExfiltrationCargoRampSector.js';
import { ValVerdeLogDeadfallCounterweightSector } from '../src/gameplay/ValVerdeLogDeadfallCounterweightSector.js';
import { HumanQaPredictiveSmartDiscTrajectoryDirector } from '../src/gameplay/HumanQaPredictiveSmartDiscTrajectoryDirector.js';
import { HumanQaDiegeticMedicompCauterizationAuditor } from '../src/gameplay/HumanQaDiegeticMedicompCauterizationAuditor.js';
import { HumanQaGameplayGuardBreakingSpinKickAuditor } from '../src/gameplay/HumanQaGameplayGuardBreakingSpinKickAuditor.js';
import { HumanQaLevelDesignSlaughterhouseOcclusionAuditor } from '../src/gameplay/HumanQaLevelDesignSlaughterhouseOcclusionAuditor.js';

test('Chantier 1 (v166): LosAngelesSlaughterhouseColdStorageSector models nitrogen/powder spray cloak exposure, vision spectrum cycling, and beef carcass ballistic cover', () => {
  const sector = new LosAngelesSlaughterhouseColdStorageSector({
    roomTempC: 1.5,
    carcassCount: 42
  });

  // Keyes' team sprays powder
  const spray = sector.deployNitrogenAndPowderSpray(3.5, 10.0);
  assert.equal(spray.nitrogenLancesFiring, true);
  assert.equal(spray.cloakExposedByPowder, true);
  assert.ok(spray.dustSilhouetteCoverageRatio > 0.8);

  // City Hunter cycles to Ultraviolet to detect insulated soldiers
  const uvCycle = sector.cycleBioMaskVisionMode('ULTRAVIOLET');
  assert.equal(uvCycle.success, true);
  assert.equal(uvCycle.activeVisionMode, 'ULTRAVIOLET');
  assert.equal(uvCycle.detectsInsulatedSoldiers, true);
  assert.equal(uvCycle.owlfAmbushTeamDetected, true);

  // Beef carcass ballistic cover
  const cover = sector.resolveCarcassBallisticCover(1600);
  assert.equal(cover.roundPiercedThrough, false);
  assert.equal(cover.absorbedEnergyJoules, 1600);
  assert.equal(cover.retainedEnergyJoules, 0);
});

test('Chantier 2 (v166): BouvetoyaPyramidInitiationAltarSector solves concentric runic glyph puzzle, claims plasma caster, and applies Xenomorph acid ritual brand', () => {
  const sector = new BouvetoyaPyramidInitiationAltarSector({
    plasmaCastersContained: 3
  });

  // Wrong puzzle combination
  const wrongAttempt = sector.solveRunicSarcophagusLock([1, 1, 1]);
  assert.equal(wrongAttempt.isUnlocked, false);
  assert.equal(sector.sarcophagusSealed, true);

  // Correct combination [3, 7, 2]
  const solve = sector.solveRunicSarcophagusLock([3, 7, 2]);
  assert.equal(solve.isUnlocked, true);
  assert.equal(sector.sarcophagusSealed, false);
  assert.equal(solve.plasmaCastersAvailable, 3);

  // Claim Plasma Caster
  const claim = sector.claimInitiationPlasmaCaster();
  assert.equal(claim.success, true);
  assert.equal(claim.plasmaCastersContainedRemaining, 2);

  // Perform ritual branding with Xenomorph acid blood
  const brand = sector.performAcidBloodHonorBranding();
  assert.equal(brand.success, true);
  assert.equal(brand.warriorRank, 'BLOODED_WARRIOR');
  assert.equal(brand.ritualBrandAcquired, true);
  assert.equal(brand.honorPointsAwarded, 500);
});

test('Chantier 3 (v166): BisonPlainsBarbedArrowFeralShieldSector triggers bison stampede ground tremors, expands fan shield, and deflects barbed arrows/charging bulls', () => {
  const sector = new BisonPlainsBarbedArrowFeralShieldSector({
    tallGrassHeightM: 1.6,
    bisonHerdCount: 30
  });

  const stampede = sector.triggerBisonStampede(0.9);
  assert.equal(stampede.stampedeActive, true);
  assert.ok(stampede.herdVelocityMps > 14.0);
  assert.ok(stampede.seismicTremorAmplitude > 2.0);

  // Fan shield deployment
  const shield = sector.toggleFeralFanShield(true);
  assert.equal(shield.feralFanShieldExpanded, true);
  assert.equal(shield.coverageArcDeg, 180);

  // Deflect Comanche triple-barbed arrow
  const arrowDeflect = sector.resolveShieldDeflection('TRIPLE_BARBED_ARROW', 420);
  assert.equal(arrowDeflect.deflected, true);
  assert.equal(arrowDeflect.damageTaken, 0);

  // Deflect charging 900kg bull bison
  const bisonDeflect = sector.resolveShieldDeflection('CHARGING_BULL_BISON', 12000);
  assert.equal(bisonDeflect.deflected, true);
  assert.equal(bisonDeflect.damageTaken, 0);
  assert.ok(bisonDeflect.recoilPushbackM > 1.0);

  // Crouch grass concealment
  const grass = sector.evaluateGrassConcealment(true);
  assert.ok(grass.concealmentRatio > 0.8);
});

test('Chantier 4 (v166): MothershipOrbitalExfiltrationCargoRampSector computes stratospheric slipstream dynamic pressure, modulates artificial gravity, and ejects orbital drop pods', () => {
  const sector = new MothershipOrbitalExfiltrationCargoRampSector({
    altitudeMeters: 14500.0,
    machSpeed: 1.4,
    forcefieldCurtainActive: false
  });

  const slipstream = sector.computeSlipstreamSuctionForces();
  assert.equal(slipstream.machSpeed, 1.4);
  assert.ok(slipstream.dynamicPressurePascals > 1000);
  assert.equal(slipstream.footingGripHazard, true);

  // Gravity dip during ascent pulse
  const gravity = sector.modulateArtificialGravity(0.8);
  assert.ok(gravity.artificialGravityG < 0.5);
  assert.ok(gravity.jumpHeightMultiplier > 2.0);

  // Forcefield activation seals bay
  const forcefield = sector.setForcefieldCurtain(true);
  assert.equal(forcefield.forcefieldCurtainActive, true);
  assert.equal(forcefield.cabinPressurizationPsi, 14.7);

  // Eject drop pod
  const pod = sector.ejectOrbitalDropPod();
  assert.equal(pod.success, true);
  assert.equal(pod.dropPodsRemaining, 1);
});

test('Chantier 5 (v166): ValVerdeLogDeadfallCounterweightSector baits hunter, triggers 850kg tree trunk deadfall (50,000 J), and activates wrist gauntlet self-destruct countdown', () => {
  const sector = new ValVerdeLogDeadfallCounterweightSector({
    logMassKg: 850.0,
    suspensionHeightM: 6.0
  });

  const bait = sector.baitHunterIntoKillzone(true, true);
  assert.equal(bait.baitSuccess, true);
  assert.equal(bait.hunterDrawnUnderDeadfall, true);

  const deadfall = sector.triggerLogDeadfallDrop();
  assert.equal(deadfall.triggered, true);
  assert.ok(deadfall.impactKineticEnergyJoules >= 49000);
  assert.equal(deadfall.targetCrushed, true);
  assert.equal(deadfall.crushingBluntDamage, 1200);

  const selfDestruct = sector.initiateGauntletSelfDestruct();
  assert.equal(selfDestruct.selfDestructActive, true);
  assert.equal(selfDestruct.countdownSec, 30.0);
  assert.equal(selfDestruct.audioMimicryPlaying, "Billy's Laughter (Echoing)");
});

test('Chantier 6 & Audit QA #1 (v166): HumanQaPredictiveSmartDiscTrajectoryDirector computes multi-bounce ricochet flight path, return catch window, and mounts HUD elements', () => {
  const director = new HumanQaPredictiveSmartDiscTrajectoryDirector({
    discVelocityMps: 42.0,
    maxBounces: 3
  });

  const obstacles = [{ normal: { x: 0, y: 0, z: -1 } }, { normal: { x: -1, y: 0, z: 0 } }];
  const path = director.computePredictiveFlightPath({ x: 0, y: 1.5, z: 0 }, { x: 0, y: 0, z: 1 }, obstacles);

  assert.ok(path.waypointsCount >= 3);
  assert.ok(path.estimatedFlightDurationSec > 0.5);
  assert.equal(path.safeCatchZoneRadiusM, 0.85);

  const hud = director.updateHudTrajectoryView(null);
  assert.equal(typeof hud.rendered, 'boolean');
});

test('Chantier 7 & Audit QA #2 (v166): AudioSynthesizer computes acid blood corrosion acoustics, log pendulum kinetic acoustics, and exposes 15 v166 procedural audio methods', () => {
  assert.ok(typeof audioSynth.computeAcidBloodCorrosionCavitationAcoustics === 'function');
  assert.ok(typeof audioSynth.computeLogPendulumKineticImpactAcoustics === 'function');

  const acidAcoustics = audioSynth.computeAcidBloodCorrosionCavitationAcoustics(50, 'STEEL');
  assert.equal(acidAcoustics.surfaceMaterial, 'STEEL');
  assert.ok(acidAcoustics.exothermicTempC >= 550);
  assert.ok(acidAcoustics.effervescencePeakHz > 5000);
  assert.equal(acidAcoustics.structuralBreachHazard, true);

  const logAcoustics = audioSynth.computeLogPendulumKineticImpactAcoustics(850, 6.0);
  assert.equal(logAcoustics.logMassKg, 850);
  assert.ok(logAcoustics.impactVelocityMps > 10.0);
  assert.ok(logAcoustics.groundThudDecibels > 95);

  const v166AudioMethods = [
    'playSlaughterhouseMeatCarcassSlap',
    'playNitrogenSprayerFrostHiss',
    'playBioMaskSpectrumCycleClick',
    'playPyramidRunicSarcophagusUnlock',
    'playAcidBloodRitualBrandSizzle',
    'playBisonStampedeTremorRumble',
    'playTripleBarbedArrowWhoosh',
    'playOrbitalCargoBayDecompressionRoar',
    'playSupersonicSlipstreamBuffet',
    'playHeavyLogDeadfallDropWhoosh',
    'playTimberLogCrushingImpactThud',
    'playSmartDiscPredictiveArcBeep',
    'playMedicompCauterizationSizzle',
    'playGuardBreakRoundhouseKickWhoosh',
    'playAcidDissolutionEffervescence'
  ];

  for (const method of v166AudioMethods) {
    assert.ok(typeof audioSynth[method] === 'function', `Method ${method} must exist on audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 & Audit QA #3 (v166): HumanQaDiegeticMedicompCauterizationAuditor progresses through 3-stage surgery (extraction, blue paste, thermal cauterization) and generates smoke overlay', () => {
  const auditor = new HumanQaDiegeticMedicompCauterizationAuditor({
    cauterizationTempC: 480.0,
    baseHealAmount: 120.0
  });

  const step1 = auditor.performFragmentExtraction('9mm Bullet');
  assert.equal(step1.success, true);
  assert.equal(step1.stage, 'EXTRACTION');
  assert.equal(step1.shrapnelRemoved, true);

  const step2 = auditor.applyBlueMedicinalCoagulantPaste(15.0);
  assert.equal(step2.success, true);
  assert.equal(step2.stage, 'COAGULANT_PASTE');
  assert.equal(step2.bleedingStopped, true);
  assert.equal(step2.initialHealthRestored, 48);

  const step3 = auditor.executeThermalCauterizationBurn();
  assert.equal(step3.success, true);
  assert.equal(step3.stage, 'COMPLETED');
  assert.equal(step3.woundHermeticallySealed, true);
  assert.equal(step3.totalHealthRestored, 120.0);
  assert.equal(step3.yautjaAgonyRoarTriggered, true);

  const styles = auditor.applyDiegeticSmokeOverlay(null);
  assert.equal(styles.stage, 'COMPLETED');
  assert.equal(styles.bleedingStatusRemoved, true);
});

test('Chantier 9 & Audit QA #4 (v166): HumanQaGameplayGuardBreakingSpinKickAuditor executes heavy spinning kick, shatters enemy block stance, and applies 2.2s vulnerability stagger', () => {
  const auditor = new HumanQaGameplayGuardBreakingSpinKickAuditor({
    kickDamage: 140.0,
    startupDurationMs: 420.0,
    staminaCost: 35.0
  });

  const windup = auditor.initiateKickWindup(100.0);
  assert.equal(windup.success, true);
  assert.equal(windup.remainingStamina, 65.0);

  const riotShieldGuard = { id: 'stargazer-riot-guard', isBlocking: true, shieldIntegrity: 100, health: 220 };
  const impact = auditor.resolveKickImpact(riotShieldGuard);

  assert.equal(impact.success, true);
  assert.equal(impact.wasBlocking, true);
  assert.equal(impact.guardShattered, true);
  assert.equal(riotShieldGuard.isBlocking, false);
  assert.equal(riotShieldGuard.shieldIntegrity, 0);
  assert.equal(impact.staggerDurationSec, 2.2);
  assert.equal(riotShieldGuard.health, 80); // 220 - 140
});

test('Chantier 10 & Audit QA #5 (v166): HumanQaLevelDesignSlaughterhouseOcclusionAuditor calculates carcass pendulum oscillation, harmonic damping, and cold thermal masking silhouette', () => {
  const auditor = new HumanQaLevelDesignSlaughterhouseOcclusionAuditor({
    carcassMassKg: 320.0,
    railHeightM: 3.2,
    carcassTempC: 2.0
  });

  const swing = auditor.applyPendulumImpulse(180.0, 1.5);
  assert.ok(Math.abs(swing.initialAngleDeg) > 0);
  assert.ok(swing.periodSec > 2.0);

  const tick = auditor.tickOscillation(0.016);
  assert.equal(tick.inMotion, true);

  const occlusion = auditor.evaluateSightlineAndThermalShadow({ x: 0, y: 0 }, { x: 0, y: 8 });
  assert.equal(occlusion.carcassTempC, 2.0);
  assert.equal(occlusion.thermalContrastDeltaT, 35.0); // 37 - 2
  assert.equal(occlusion.thermalShadowMaskingActive, true);
  assert.ok(occlusion.sightlineCoverRatio > 0.8);
});
