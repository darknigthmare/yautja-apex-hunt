import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { SuperPredatorCampClassicConfinementCageSector } from '../src/gameplay/SuperPredatorCampClassicConfinementCageSector.js';
import { BouvetoyaMiningShaftVerticalWinchElevatorSector } from '../src/gameplay/BouvetoyaMiningShaftVerticalWinchElevatorSector.js';
import { LosAngelesAlleyLapdHelicopterSearchlightSector } from '../src/gameplay/LosAngelesAlleyLapdHelicopterSearchlightSector.js';
import { GlacialRiverDriftwoodLogAmbushSector } from '../src/gameplay/GlacialRiverDriftwoodLogAmbushSector.js';
import { StargazerCortexCargoUpgradeTransportCrateSector } from '../src/gameplay/StargazerCortexCargoUpgradeTransportCrateSector.js';
import { HumanQaAdaptiveThermalGlareSuppressionDirector } from '../src/gameplay/HumanQaAdaptiveThermalGlareSuppressionDirector.js';
import { HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor } from '../src/gameplay/HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor.js';
import { HumanQaGameplaySlideSweeperStrikeAuditor } from '../src/gameplay/HumanQaGameplaySlideSweeperStrikeAuditor.js';
import { HumanQaLevelDesignVolumetricReverbZoneAuditor } from '../src/gameplay/HumanQaLevelDesignVolumetricReverbZoneAuditor.js';

test('Chantier 1 (v162): SuperPredatorCampClassicConfinementCageSector severs conduits, picks locks, and unshackles Classic Predator ally', () => {
  const sector = new SuperPredatorCampClassicConfinementCageSector({
    shackleLockIntegrity: 250,
    shackleElectrified: true
  });

  // Attempting to pick electrified shackle fails and shocks
  const pickFail = sector.pickShackleLockWithWristblades(1.0, 1.0);
  assert.equal(pickFail.success, false);
  assert.equal(pickFail.reason, 'SHACKLES_ELECTRIFIED_HAZARD');

  // Sever power conduits
  const cut = sector.severPowerConduits(150);
  assert.equal(cut.success, true);
  assert.equal(cut.conduitSevered, true);
  assert.equal(sector.shackleElectrified, false);

  // Pick lock safely
  sector.pickShackleLockWithWristblades(1.0, 2.0);
  const freed = sector.pickShackleLockWithWristblades(1.0, 2.0);
  assert.equal(freed.success, true);
  assert.equal(freed.classicFreed, true);
  assert.equal(freed.alliedAiActive, true);
  assert.equal(freed.unshackledRoarTriggered, true);
});

test('Chantier 2 (v162): BouvetoyaMiningShaftVerticalWinchElevatorSector manages 600m ascent, motor cooling, and roof mesh climbers', () => {
  const sector = new BouvetoyaMiningShaftVerticalWinchElevatorSector({
    depthMeters: 600.0,
    climbingXenosCount: 4
  });

  const ascent = sector.ascendMiningShaft(1.2, 5.0);
  assert.ok(ascent.currentAscentMeters > 40);
  assert.ok(ascent.winchMotorTempCelsius > 45.0);
  assert.equal(ascent.surfaceReached, false);

  const cool = sector.coolWinchMotor(true, 2.0);
  assert.ok(cool.winchMotorTempCelsius < ascent.winchMotorTempCelsius);

  const repel = sector.repelMeshRoofClimber(0, 100);
  assert.equal(repel.success, true);
  assert.equal(repel.climbersRemaining, 3);
});

test('Chantier 3 (v162): LosAngelesAlleyLapdHelicopterSearchlightSector handles searchlight exposure, fire escape climbs, and shadow decapitations', () => {
  const sector = new LosAngelesAlleyLapdHelicopterSearchlightSector({
    smokeCoverDensity: 0.65,
    shadowZonesCount: 5
  });

  // In direct spotlight
  const exposed = sector.evaluateSearchlightExposure({ x: 0, y: 0, z: 0 }, false);
  assert.equal(exposed.exposed, true);
  assert.ok(exposed.incidentLux > 10000);

  // In shadow
  const shadow = sector.evaluateSearchlightExposure({ x: 5, y: 0, z: 0 }, true);
  assert.equal(shadow.exposed, false);
  assert.equal(shadow.cloakDisrupted, false);

  const climb = sector.climbFireEscapeLadders(8.0);
  assert.equal(climb.climbed, true);
  assert.equal(climb.outOfStreetSearchlightBeam, true);

  const decap = sector.executeRitualDecapitationInShadow({ health: 0 }, true);
  assert.equal(decap.success, true);
  assert.equal(decap.trophyId, 'EL_SCORPIO_GOLD_TOOTH_SKULL');
});

test('Chantier 4 (v162): GlacialRiverDriftwoodLogAmbushSector models sub-surface log concealment, leap ambush, and hypothermia limits', () => {
  const sector = new GlacialRiverDriftwoodLogAmbushSector({
    waterTempCelsius: 2.0,
    driftwoodLogsCount: 6,
    trappersOnBank: 4
  });

  const submerge = sector.submergeUnderDriftwood(2);
  assert.equal(submerge.success, true);
  assert.equal(submerge.thermalSignatureInvisible, true);
  assert.equal(sector.submergedUnderLog, true);

  const ambush = sector.executeAquaticLeapAmbush(0);
  assert.equal(ambush.success, true);
  assert.equal(ambush.surpriseKillExecuted, true);
  assert.equal(sector.trappersOnBank, 3);

  const hypoSafe = sector.calculateHypothermiaTolerance(60);
  assert.equal(hypoSafe.hypothermiaActive, false);

  const hypoDanger = sector.calculateHypothermiaTolerance(150);
  assert.equal(hypoDanger.hypothermiaActive, true);
  assert.ok(hypoDanger.jointStiffnessPenalty > 0);
});

test('Chantier 5 (v162): StargazerCortexCargoUpgradeTransportCrateSector hacks triple iris locks, disengages magnetic clamps, and loots Upgrade cortex suit', () => {
  const sector = new StargazerCortexCargoUpgradeTransportCrateSector();

  // Hack 3 iris locks
  sector.hackIrisBiometricLock(420.5);
  sector.hackIrisBiometricLock(420.5);
  const hack3 = sector.hackIrisBiometricLock(420.5);
  assert.equal(hack3.hackedIrisCount, 3);
  assert.equal(hack3.tripleIrisLocked, false);

  // Disengage magnetic clamps
  const mag = sector.disengageMagneticClamps(5000);
  assert.equal(mag.success, true);
  assert.equal(mag.clampsDisengaged, true);
  assert.equal(sector.magneticClampActive, false);

  // Harvest suit
  const loot = sector.harvestUpgradeCortexSuit();
  assert.equal(loot.success, true);
  assert.equal(loot.salvagedItem.id, 'UPGRADE_BIO_CORTEX_SUIT');
  assert.equal(loot.trophyHonorBonus, 600);
});

test('Chantier 6 & Audit QA #1 (v162): HumanQaAdaptiveThermalGlareSuppressionDirector suppresses glare blowouts and adapts gain control', () => {
  const director = new HumanQaAdaptiveThermalGlareSuppressionDirector({
    glareSaturationThresholdLux: 25000
  });

  const lowGlare = director.evaluateLuminanceGlare(500);
  assert.equal(lowGlare.glareDampingActive, false);

  const highGlare = director.evaluateLuminanceGlare(85000);
  assert.equal(highGlare.glareDampingActive, true);
  assert.ok(highGlare.dampingRatio > 0.5);

  const tick = director.processGainControlTick(0.1);
  assert.equal(tick.glareDampingActive, true);
  assert.ok(tick.currentSensorGain < 1.0);

  const filter = director.getThermalViewFilterState();
  assert.equal(filter.glareDampingActive, true);
  assert.ok(filter.cssClass.includes('auto-gain-active'));

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.thermal-glare-damping-filter'));
  assert.ok(css.includes('.auto-gain-active'));
});

test('Chantier 7 & Audit QA #2 (v162): AudioSynthesizer computes surface rain acoustic impacts, ceiling reverb, and implements 15 v162 procedural audio methods', () => {
  const rainArmor = audioSynth.computeSurfaceRainImpactAcoustics('YAUTJA_ARMOR_PLATE', 45.0);
  assert.equal(rainArmor.surfaceMaterialType, 'YAUTJA_ARMOR_PLATE');
  assert.equal(rainArmor.resonancePeakHz, 2850);
  assert.ok(rainArmor.acousticIntensityDb > 40);

  const rainTarp = audioSynth.computeSurfaceRainImpactAcoustics('PLASTIC_TARP', 45.0);
  assert.equal(rainTarp.resonancePeakHz, 420);

  const ceilingReverb = audioSynth.computeVolumetricCeilingReverbParameters(12.0, 240.0);
  assert.equal(ceilingReverb.ceilingHeightMeters, 12.0);
  assert.ok(ceilingReverb.volumeM3 > 2000);
  assert.ok(ceilingReverb.decayTimeSec > 1.0);

  // Verify all 15 methods are callable without throw
  assert.doesNotThrow(() => audioSynth.playSuperPredatorTotemShackleSeverClang());
  assert.doesNotThrow(() => audioSynth.playClassicPredatorRoarUnshackled());
  assert.doesNotThrow(() => audioSynth.playMiningShaftWinchMotorGrind());
  assert.doesNotThrow(() => audioSynth.playElevatorMeshXenoDropImpact());
  assert.doesNotThrow(() => audioSynth.playLapdSearchlightHumGlare());
  assert.doesNotThrow(() => audioSynth.playAlleyFireEscapeRattleClimb());
  assert.doesNotThrow(() => audioSynth.playGlacialWaterPlungeSubmerge());
  assert.doesNotThrow(() => audioSynth.playDriftwoodLogTimberBreak());
  assert.doesNotThrow(() => audioSynth.playStargazerCargoMagneticLockDisengage());
  assert.doesNotThrow(() => audioSynth.playUpgradeArmorPneumaticExhaustHiss());
  assert.doesNotThrow(() => audioSynth.playThermalGlareDampingPop());
  assert.doesNotThrow(() => audioSynth.playRainOnMetalCuirassPatter());
  assert.doesNotThrow(() => audioSynth.playPlasmaCoilResidualArcSputter());
  assert.doesNotThrow(() => audioSynth.playCombistickSlideSweepWhoosh());
  assert.doesNotThrow(() => audioSynth.playCavernousVaultDeepReverbTail());
});

test('Chantier 8 & Audit QA #3 (v162): HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor accumulates residual coil energy and triggers sparks', () => {
  const auditor = new HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor({
    maxCapacitanceJoules: 2500,
    breakdownThresholdJoules: 650
  });

  assert.equal(auditor.isArcingActive(), false);

  // Fire heavy shots
  auditor.registerPlasmaShotFired(1500);
  const shot2 = auditor.registerPlasmaShotFired(1800);
  assert.ok(shot2.residualChargeJoules >= 650);
  assert.equal(shot2.sparkingActive, true);
  assert.equal(auditor.isArcingActive(), true);

  const diag = auditor.getArcDiagnostics();
  assert.ok(diag.cssClass.includes('spark-active'));

  // Cool down
  auditor.processCoolingTick(5.0);
  assert.ok(auditor.residualChargeJoules < shot2.residualChargeJoules);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.plasma-coil-spark-overlay'));
  assert.ok(css.includes('.spark-active'));
});

test('Chantier 9 & Audit QA #4 (v162): HumanQaGameplaySlideSweeperStrikeAuditor executes ground slide and sweeps target legs with Combistick', () => {
  const auditor = new HumanQaGameplaySlideSweeperStrikeAuditor({
    sweeperReachMeters: 2.6
  });

  const slide = auditor.initiateGroundSlide(8.5);
  assert.equal(slide.sliding, true);
  assert.equal(slide.sweepWindowOpen, true);

  const sweep = auditor.executeSlideSweeperStrike({ distanceM: 1.8, massKg: 85 });
  assert.equal(sweep.success, true);
  assert.equal(sweep.targetTripped, true);
  assert.ok(sweep.totalDamage > 65);
  assert.equal(sweep.followUpFinisherWindowOpen, true);
  assert.equal(auditor.totalTrippedEnemies, 1);

  const hud = auditor.getSlideCombatState();
  assert.equal(hud.sweeperExecuted, true);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.slide-sweeper-indicator'));
  assert.ok(css.includes('.trip-ready'));
});

test('Chantier 10 & Audit QA #5 (v162): HumanQaLevelDesignVolumetricReverbZoneAuditor evaluates vertical ceiling raycasts and modulates decay times', () => {
  const auditor = new HumanQaLevelDesignVolumetricReverbZoneAuditor({
    baseDecaySec: 0.4,
    maxDecaySec: 3.2
  });

  // Low 2.5m ceiling
  const lowCeiling = auditor.evaluateCeilingClearance(2.5, 50.0);
  assert.equal(lowCeiling.isCavernous, false);
  assert.ok(lowCeiling.decayTimeSec < 0.8);
  assert.equal(lowCeiling.acousticArchetype, 'CONFINED_CORRIDOR');

  // Cavernous 25m ceiling
  const highCeiling = auditor.evaluateCeilingClearance(25.0, 200.0);
  assert.equal(highCeiling.isCavernous, true);
  assert.ok(highCeiling.decayTimeSec > 2.0);
  assert.equal(highCeiling.acousticArchetype, 'GRAND_CAVERNOUS_VAULT');

  const profile = auditor.getAcousticReverbProfile();
  assert.equal(profile.ceilingHeightMeters, 25.0);
  assert.ok(profile.earlyReflectionMs > 50);

  const zones = [
    { id: 'TIGHT_VENT', heightM: 2.0, areaM2: 15.0 },
    { id: 'PYRAMID_SACRIFICE_HALL', heightM: 30.0, areaM2: 450.0 }
  ];
  const audit = auditor.auditMapReverbZones(zones);
  assert.equal(audit.totalAudited, 2);
  assert.equal(audit.auditedZones[0].acousticArchetype, 'CONFINED_CORRIDOR');
  assert.equal(audit.auditedZones[1].acousticArchetype, 'GRAND_CAVERNOUS_VAULT');
});
