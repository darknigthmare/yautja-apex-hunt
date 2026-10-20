import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { GunnisonSubmergedAqueductWaterPumpSector } from '../src/gameplay/GunnisonSubmergedAqueductWaterPumpSector.js';
import { FugitivePodCrashBiomarkerForestSector } from '../src/gameplay/FugitivePodCrashBiomarkerForestSector.js';
import { OwlfCryoStasisChamberRuptureSector } from '../src/gameplay/OwlfCryoStasisChamberRuptureSector.js';
import { RockyRidgeMutatedGrizzlyClashSector } from '../src/gameplay/RockyRidgeMutatedGrizzlyClashSector.js';
import { ValVerdeMudCanyonResinTorchAmbushSector } from '../src/gameplay/ValVerdeMudCanyonResinTorchAmbushSector.js';
import { HumanQaTrophySatchelInventoryAndCodexFilterDirector } from '../src/gameplay/HumanQaTrophySatchelInventoryAndCodexFilterDirector.js';
import { HumanQaDiegeticCryogenicJointStiffnessAuditor } from '../src/gameplay/HumanQaDiegeticCryogenicJointStiffnessAuditor.js';
import { HumanQaGameplayWallKickVaultAndBearHugCounterAuditor } from '../src/gameplay/HumanQaGameplayWallKickVaultAndBearHugCounterAuditor.js';
import { HumanQaLevelDesignWaterNavMeshAndFlotationAuditor } from '../src/gameplay/HumanQaLevelDesignWaterNavMeshAndFlotationAuditor.js';

test('Chantier 1 (v159): GunnisonSubmergedAqueductWaterPumpSector simulates pump surges, drainage override, drag force, and electrical hazards', () => {
  const sector = new GunnisonSubmergedAqueductWaterPumpSector({
    sectorId: 'gunnison-aqueduct-01',
    waterDepthMeters: 3.8,
    flowVelocityMps: 2.4,
    drainageValveLocked: true,
    turbineOperational: true
  });

  const surge = sector.cyclePumpTurbine(75);
  assert.equal(surge.operational, true);
  assert.ok(surge.turbineRpm > 500);
  assert.equal(surge.cavitationOccurring, true);

  const drag = sector.calculateUnderwaterDrag(160, 3.0, true);
  assert.equal(drag.submerged, true);
  assert.ok(drag.dragForceNewtons > 100);
  assert.ok(drag.speedPenaltyFactor < 1.0);

  const dryDrag = sector.calculateUnderwaterDrag(160, 3.0, false);
  assert.equal(dryDrag.submerged, false);
  assert.equal(dryDrag.dragForceNewtons, 0);

  const overrideFail = sector.overrideDrainageValve('WRONG_CODE');
  assert.equal(overrideFail.success, false);

  const overrideSuccess = sector.overrideDrainageValve('OVERRIDE-AQUEDUCT-SIGMA');
  assert.equal(overrideSuccess.success, true);
  assert.equal(overrideSuccess.drainageValveLocked, false);
  assert.ok(overrideSuccess.waterDepthMeters < 3.8);

  const hazard = sector.evaluateTurbineElectricalHazard(80, true);
  assert.equal(hazard.electrified, true);
  assert.ok(hazard.shockDamagePerSec > 0);
  assert.equal(hazard.conductiveArcRisk, true);
});

test('Chantier 2 (v159): FugitivePodCrashBiomarkerForestSector handles bio-tracking beacons, cooling thrusters, hull scans, and hound pack encirclement', () => {
  const sector = new FugitivePodCrashBiomarkerForestSector({
    craterRadiusM: 16.5,
    podHullIntegrity: 0.42,
    biomarkerFrequencyKhz: 142.8,
    thrusterThermalKelvin: 1280
  });

  const signal = sector.emitBiomarkerSignal(1000);
  assert.equal(signal.beaconActive, true);
  assert.equal(signal.pulseFrequencyKhz, 142.8);
  assert.ok(signal.houndAggroRadiusM > 25.0);

  const naturalCool = sector.coolThrusterResidue(2.0, 'NATURAL_AIR');
  assert.ok(naturalCool.thrusterThermalKelvin < 1280);

  const cryoCool = sector.coolThrusterResidue(10.0, 'CRYO_BURST');
  assert.ok(cryoCool.thrusterThermalKelvin < naturalCool.thrusterThermalKelvin);

  const hullAnalysis = sector.analyzePodChitinHull('BIO_SCANNER');
  assert.equal(hullAnalysis.cacheAccessible, true);
  assert.ok(hullAnalysis.salvageAvailable.includes('FUGITIVE_GAUNTLET_BLADE'));

  const houndPositions = [
    { x: 5, y: 0 },
    { x: 0, y: 5 },
    { x: -5, y: 0 },
    { x: 0, y: -5 }
  ];
  const packFlanking = sector.calculateHoundPackFlanking(houndPositions, { x: 0, y: 0 });
  assert.equal(packFlanking.packSize, 4);
  assert.ok(packFlanking.encirclementScore > 0.6);
  assert.equal(packFlanking.pounceImminent, true);
});

test('Chantier 3 (v159): OwlfCryoStasisChamberRuptureSector manages liquid nitrogen ruptures, thermal inversion, and material embrittlement', () => {
  const sector = new OwlfCryoStasisChamberRuptureSector({
    liquidNitrogenTanks: 4,
    ambientTempCelsius: 22.0
  });

  const rupture = sector.ruptureCryoTank(0, 100);
  assert.equal(rupture.success, true);
  assert.ok(rupture.ambientTempCelsius < 22.0);
  assert.ok(rupture.cryoGasDensity > 0);

  const thermalInversion = sector.computeCryoThermalInversion(-140);
  assert.equal(thermalInversion.visionModeShiftedToUv, true);
  assert.ok(thermalInversion.thermalNoiseLevel > 0.5);

  const bladeBrittleness = sector.evaluateMaterialBrittleness('YAUTJA_BLADE', -180);
  assert.equal(bladeBrittleness.isEmbrittled, true);
  assert.ok(bladeBrittleness.impactShatterRisk > 0);

  const steelBrittleness = sector.evaluateMaterialBrittleness('STAINLESS_STEEL', -120);
  assert.equal(steelBrittleness.isEmbrittled, true);

  const vent = sector.ventCryoPlume(true, 5.0);
  assert.equal(vent.ventilationActive, true);
  assert.ok(vent.ambientTempCelsius > -196.0);
});

test('Chantier 4 (v159): RockyRidgeMutatedGrizzlyClashSector models grizzly charge momentum, bare-hand parry, clinch struggle, and overhead spine break', () => {
  const sector = new RockyRidgeMutatedGrizzlyClashSector({
    grizzlyMassKg: 780,
    grizzlyHealth: 650,
    feralStamina: 100
  });

  const charge = sector.initiateGrizzlyCharge(12.5);
  assert.equal(charge.clashState, 'CHARGING');
  assert.equal(charge.momentumKgMps, 9750);
  assert.ok(charge.kineticEnergyJoules > 60000);

  const parry = sector.executeBareHandParry(200, 180);
  assert.equal(parry.success, true);
  assert.equal(parry.quality, 'PERFECT_COUNTER');
  assert.equal(parry.clashState, 'OVERHEAD_LIFT');

  const finisher = sector.executeOverheadSpineBreak();
  assert.equal(finisher.success, true);
  assert.equal(finisher.clashState, 'DEFEATED');
  assert.equal(finisher.honorRatingEarned, 500);

  // Test clinch struggle branch
  const sector2 = new RockyRidgeMutatedGrizzlyClashSector();
  sector2.clashState = 'CLINCH';
  const clinchWin = sector2.resolveBearHugClinch(8.5, 2.0);
  assert.equal(clinchWin.resolved, true);
  assert.equal(clinchWin.winner, 'FERAL_PREDATOR');
  assert.equal(clinchWin.clashState, 'OVERHEAD_LIFT');
});

test('Chantier 5 (v159): ValVerdeMudCanyonResinTorchAmbushSector handles pine resin torches, mud ablation, deadfall traps, and mud viscosity drag', () => {
  const sector = new ValVerdeMudCanyonResinTorchAmbushSector({
    torchCount: 6,
    mudDepthMeters: 0.45
  });

  const torches = sector.lightResinTorches([0, 1, 2, 3]);
  assert.equal(torches.activeTorchesCount, 4);
  assert.equal(torches.visionDisruption, true);
  assert.ok(torches.thermalSaturationLevel >= 0.7);

  const ablation = sector.calculateMudAblation(4.0, true, 3.0);
  assert.ok(ablation.mudCamouflageLayerMm < 3.5);
  assert.ok(ablation.heatLeakPercentage > 0);

  const trap = sector.triggerDeadfallTrap(2.0);
  assert.equal(trap.success, true);
  assert.equal(trap.deadfallTriggered, true);
  assert.ok(trap.kineticImpactJoules > 40000);

  const drag = sector.computeMudViscosityDrag(6.0);
  assert.ok(drag.dragMultiplier < 1.0);
  assert.ok(drag.effectiveSpeedMps < 6.0);
});

test('Chantier 6 & Audit QA #1 (v159): HumanQaTrophySatchelInventoryAndCodexFilterDirector restricts satchel mass and filters codex taxonomy', () => {
  const director = new HumanQaTrophySatchelInventoryAndCodexFilterDirector({
    maxSatchelWeightKg: 35.0,
    activeCategoryFilter: 'ALL'
  });

  const add1 = director.addTrophyToSatchel({
    trophyId: 'warrior-skull-01',
    species: 'XENOMORPH',
    weightKg: 12.0,
    honorValue: 150
  });
  assert.equal(add1.success, true);
  assert.equal(add1.isEncumbered, false);

  const add2 = director.addTrophyToSatchel({
    trophyId: 'spec-ops-skull-01',
    species: 'HUMAN_SPEC_OPS',
    weightKg: 20.0,
    honorValue: 100
  });
  assert.equal(add2.success, true);
  assert.equal(add2.isEncumbered, true); // 32kg / 35kg = 91% > 85%

  const add3 = director.addTrophyToSatchel({
    trophyId: 'grizzly-claw-01',
    species: 'APEX_PREDATOR',
    weightKg: 8.0,
    honorValue: 250
  });
  assert.equal(add3.success, true);
  assert.equal(add3.isOverburdened, true); // 40kg / 35kg = 114% > 100%
  assert.ok(add3.speedPenaltyMultiplier < 0.85);

  const codexSample = [
    { title: 'Xenomorph Drone', speciesCategory: 'XENOMORPH', description: 'Endoskeleton with acid blood' },
    { title: 'Dutch Schaefer', speciesCategory: 'HUMAN_SPEC_OPS', description: 'Special forces commander' },
    { title: 'Apex Grizzly', speciesCategory: 'APEX_PREDATOR', description: 'Massive North American bear' }
  ];

  const xenoOnly = director.filterCodexEntries(codexSample, 'XENOMORPH');
  assert.equal(xenoOnly.length, 1);
  assert.equal(xenoOnly[0].title, 'Xenomorph Drone');

  const searchDutch = director.filterCodexEntries(codexSample, 'ALL', 'schaefer');
  assert.equal(searchDutch.length, 1);
  assert.equal(searchDutch[0].title, 'Dutch Schaefer');

  const hud = director.getSatchelHudState();
  assert.equal(hud.trophyCount, 3);
  assert.equal(hud.isOverburdened, true);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.trophy-satchel-capacity-bar'));
  assert.ok(css.includes('.codex-species-pill'));
});

test('Chantier 7 & Audit QA #2 (v159): AudioSynthesizer computes cavitation, cryo resonance, and implements 15 v159 procedural audio methods', () => {
  const cav = audioSynth.computeUnderwaterPlasmaCavitationParameters(3.5, 1200);
  assert.equal(cav.depthMeters, 3.5);
  assert.ok(cav.bubbleCollapseFrequencyHz > 200);
  assert.ok(cav.hydrostaticPressure > 101325);
  assert.ok(cav.acousticDecibels > 80);

  const cryo = audioSynth.computeCryoFreezingGasResonance(45.0, 18.5);
  assert.equal(cryo.nitrogenPressureBar, 18.5);
  assert.ok(cryo.speedOfSoundCryo > 150);
  assert.ok(cryo.expansionPlumeVelocityMs > 100);

  // Verify all 15 methods are executable without throw (even when ctx is null/mocked)
  assert.doesNotThrow(() => audioSynth.playGunnisonAqueductTurbineHum());
  assert.doesNotThrow(() => audioSynth.playSubmergedEvacuationHatchUnseal());
  assert.doesNotThrow(() => audioSynth.playFugitivePodCrashSiteSizzle());
  assert.doesNotThrow(() => audioSynth.playPredatorHoundBioTrackingHowl());
  assert.doesNotThrow(() => audioSynth.playOwlfCryoStasisGlassShatterHiss());
  assert.doesNotThrow(() => audioSynth.playLiquidNitrogenFrostSnap());
  assert.doesNotThrow(() => audioSynth.playRockyRidgeGrizzlyChargeRoar());
  assert.doesNotThrow(() => audioSynth.playFeralBareHandBearSlamThud());
  assert.doesNotThrow(() => audioSynth.playValVerdeResinTorchFlaringWhoosh());
  assert.doesNotThrow(() => audioSynth.playMudCanyonFootprintSlosh());
  assert.doesNotThrow(() => audioSynth.playTrophySatchelInventoryClick());
  assert.doesNotThrow(() => audioSynth.playUnderwaterPlasmaCavitationBoil());
  assert.doesNotThrow(() => audioSynth.playCryogenicWristJointDefrostPop());
  assert.doesNotThrow(() => audioSynth.playWallKickVaultAerobaticWhoosh());
  assert.doesNotThrow(() => audioSynth.playWaterNavMeshDepthWarningChime());
});

test('Chantier 8 & Audit QA #3 (v159): HumanQaDiegeticCryogenicJointStiffnessAuditor models sub-zero joint freeze and plasma defrost pulse', () => {
  const auditor = new HumanQaDiegeticCryogenicJointStiffnessAuditor({
    jointTempCelsius: 37.0,
    plasmaBatteryCharge: 80.0
  });

  const cooled = auditor.updateCryogenicExposure(-196.0, 3.0, true);
  assert.ok(cooled.jointTempCelsius < -20.0);
  assert.equal(cooled.isFrozen, true);
  assert.ok(cooled.wristbladeExtensionDelayMs > 200);
  assert.ok(cooled.meleeSwingSpeedMultiplier < 1.0);
  assert.equal(auditor.isWristbladeFrozen(), true);

  const defrost = auditor.triggerThermalDefrostPulse();
  assert.equal(defrost.success, true);
  assert.equal(defrost.defrostPulseActive, true);
  assert.equal(auditor.isWristbladeFrozen(), false);
  assert.equal(auditor.plasmaBatteryCharge, 65.0);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.cryo-frost-overlay'));
});

test('Chantier 9 & Audit QA #4 (v159): HumanQaGameplayWallKickVaultAndBearHugCounterAuditor enables wall rebounds and grapple reversal counters', () => {
  const auditor = new HumanQaGameplayWallKickVaultAndBearHugCounterAuditor({
    wallKickImpulse: 7.5,
    maxWallDetectionDistanceM: 1.8
  });

  const eligibility = auditor.evaluateWallKickEligibility(true, { x: 1, y: 0, z: 0 }, 1.2);
  assert.equal(eligibility.eligible, true);
  assert.equal(eligibility.vaultReady, true);

  const leap = auditor.executeWallKick({ x: 1, y: 0, z: 0 }, { x: 0, y: 1 });
  assert.equal(leap.success, true);
  assert.ok(leap.velocityVector.x > 0);
  assert.equal(leap.verticalBoostMps, 4.8);
  assert.equal(leap.airDodgeReset, true);

  // Grapple test
  auditor.startGrappleState('GRIZZLY');
  auditor.processGrappleStruggleInput(80);
  auditor.processGrappleStruggleInput(80);
  auditor.processGrappleStruggleInput(80);
  const reversal = auditor.processGrappleStruggleInput(80);

  assert.equal(reversal.counterExecuted, true);
  assert.equal(reversal.isRapidReversal, true);
  assert.equal(reversal.counterMove, 'ELBOW_CRUSH_REVERSAL');
  assert.equal(reversal.counterDamage, 75);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.wall-kick-indicator'));
});

test('Chantier 10 & Audit QA #5 (v159): HumanQaLevelDesignWaterNavMeshAndFlotationAuditor classifies water zones and audits aquatic NavMesh paths', () => {
  const auditor = new HumanQaLevelDesignWaterNavMeshAndFlotationAuditor();

  assert.equal(auditor.classifyWaterZone(0.02), 'DRY_GROUND');
  assert.equal(auditor.classifyWaterZone(0.5), 'SHALLOW_WADE');
  assert.equal(auditor.classifyWaterZone(1.2), 'DEEP_WADE');
  assert.equal(auditor.classifyWaterZone(2.5), 'SWIMMING_FLOTATION');
  assert.equal(auditor.classifyWaterZone(4.2), 'SUBMERGED_ABYSS');

  const humanCost = auditor.computeNavMeshCostModifier(2.0, 'HUMAN_SOLDIER', 0);
  assert.equal(humanCost.traversable, false);

  const xenoCost = auditor.computeNavMeshCostModifier(2.0, 'XENOMORPH_DRONE', 0);
  assert.equal(xenoCost.traversable, true);

  const yautjaCost = auditor.computeNavMeshCostModifier(1.0, 'YAUTJA_HUNTER', 1.5);
  assert.equal(yautjaCost.traversable, true);
  assert.ok(yautjaCost.finalCostMultiplier > 1.0);

  // Floatation check: Yautja mass 160kg, volume 0.12 m^3 (denser than water -> sinks)
  const flotation = auditor.evaluateFlotationState(160, 0.12, 3.0);
  assert.equal(flotation.willFloat, false);
  assert.ok(flotation.sinkRateMps > 0);

  const waypoints = [
    { x: 0, y: 0, depth: 0.3 },
    { x: 5, y: 2, depth: 0.9 },
    { x: 10, y: 4, depth: 3.2 }
  ];
  const audit = auditor.auditWaterWaypoints(waypoints, 'HUMAN_SOLDIER');
  assert.equal(audit.validCount, 2);
  assert.equal(audit.rejectedCount, 1);
});
