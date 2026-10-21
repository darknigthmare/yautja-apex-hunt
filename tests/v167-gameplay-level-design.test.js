import test from 'node:test';
import assert from 'node:assert/strict';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { LosAngelesSubwayThirdRailElectrocutionSector } from '../src/gameplay/LosAngelesSubwayThirdRailElectrocutionSector.js';
import { BouvetoyaPyramidQueenEggSacChamberSector } from '../src/gameplay/BouvetoyaPyramidQueenEggSacChamberSector.js';
import { BeaverDamRazorWireTrapSector } from '../src/gameplay/BeaverDamRazorWireTrapSector.js';
import { StargazerGeneticHybridLabContainmentSector } from '../src/gameplay/StargazerGeneticHybridLabContainmentSector.js';
import { ValVerdePikeAmbushGraniteRidgeSector } from '../src/gameplay/ValVerdePikeAmbushGraniteRidgeSector.js';
import { HumanQaGrappleCableTensionHUDDirector } from '../src/gameplay/HumanQaGrappleCableTensionHUDDirector.js';
import { HumanQaDiegeticPlasmaThermalDistortionAuditor } from '../src/gameplay/HumanQaDiegeticPlasmaThermalDistortionAuditor.js';
import { HumanQaGameplayShadowSlipDashAuditor } from '../src/gameplay/HumanQaGameplayShadowSlipDashAuditor.js';
import { HumanQaLevelDesignXenomorphResinFloorAuditor } from '../src/gameplay/HumanQaLevelDesignXenomorphResinFloorAuditor.js';

test('Chantier 1 (v167): LosAngelesSubwayThirdRailElectrocutionSector resolves 750V third rail contact, water conduction, and hydraulic door release', () => {
  const sector = new LosAngelesSubwayThirdRailElectrocutionSector({
    thirdRailVoltageV: 750.0,
    circuitCurrentAmps: 1200.0,
    standingWaterPresent: true
  });

  // Contact with metal Combi-stick
  const contact = sector.resolveThirdRailContact('COMBI_STICK', 0.5);
  assert.equal(contact.electrocuted, true);
  assert.equal(contact.arcPowerKw, 900); // 750 * 1200 / 1000
  assert.ok(contact.shockDamage > 300);
  assert.ok(contact.arcTemperatureC > 4000);

  // Standing water conduction
  const waterShock = sector.evaluateStandingWaterConduction(2.0);
  assert.equal(waterShock.conductiveShockHazard, true);
  assert.ok(waterShock.effectiveVoltageV > 400.0);
  assert.ok(waterShock.shockDamage > 100);

  // Hydraulic door release
  const doors = sector.triggerEmergencyDoorRelease();
  assert.equal(doors.success, true);
  assert.equal(doors.trainDoorsHydraulicallyReleased, true);
});

test('Chantier 2 (v167): BouvetoyaPyramidQueenEggSacChamberSector models Facehugger egg proximity hatching, plasma blast egg sac incineration, and sticky resin drag', () => {
  const chamber = new BouvetoyaPyramidQueenEggSacChamberSector({
    eggClusterCount: 18,
    eggSacHealth: 1500.0,
    resinStickinessRatio: 0.65
  });

  // Egg proximity hatching
  const hatching = chamber.evaluateEggProximityHatching(1.8);
  assert.equal(hatching.triggerBloom, true);
  assert.equal(hatching.facehuggerEmerged, true);
  assert.equal(hatching.remainingUnhatchedEggs, 17);

  // Plasma caster incineration of ovipositor
  const burn = chamber.incinerateEggSacAndClusters(1500, 4.0);
  assert.equal(burn.success, true);
  assert.equal(burn.ovipositorSevered, true);
  assert.equal(burn.queenRageEnraged, true);
  assert.equal(burn.remainingEggSacHealth, 0);

  // Locomotion on sticky resin floor
  const drag = chamber.evaluateResinFloorLocomotion(7.0);
  assert.equal(drag.resinStickinessRatio, 0.65);
  assert.ok(drag.effectiveSprintSpeedMps < 3.0);
  assert.equal(drag.jumpHeightPenaltyRatio, 0.60);
});

test('Chantier 3 (v167): BeaverDamRazorWireTrapSector triggers 1800N forged-steel beaver trap, tests prying escape, and razor wire trip collision', () => {
  const sector = new BeaverDamRazorWireTrapSector({
    steelBeaverTrapsCount: 6,
    razorWireLinesCount: 4
  });

  // Leg trap snaps shut
  const trap = sector.triggerSteelBeaverTrap('feral-predator-foot', true);
  assert.equal(trap.triggered, true);
  assert.equal(trap.clampingForceN, 1800);
  assert.equal(trap.legImmobilized, true);
  assert.equal(trap.boneFractureSeverity, 'HEAVY');

  // Prying open with strength
  const pry = sector.pryOpenSteelTrap('feral-predator-foot', 2400);
  assert.equal(pry.success, true);
  assert.equal(pry.escaped, true);

  // Razor wire trip collision
  const wire = sector.checkRazorWireCollision(6.0);
  assert.equal(wire.struckWire, true);
  assert.equal(wire.wireSnapped, true);
  assert.ok(wire.lacerationDamage > 100);
  assert.equal(wire.bleedingApplied, true);
});

test('Chantier 4 (v167): StargazerGeneticHybridLabContainmentSector deploys sonic pulse disruptor, shatters laminated glass incubation tanks, and harvests transgenic DNA vials', () => {
  const sector = new StargazerGeneticHybridLabContainmentSector({
    incubationTanksCount: 6,
    glassPlexiThicknessMm: 30.0
  });

  // Sonic pulse disruptor
  const sonic = sector.deploySonicDisruptorPulse(1.5, 125.0);
  assert.equal(sonic.success, true);
  assert.equal(sonic.neuralDisruptionActive, true);
  assert.equal(sonic.cloakDisrupted, true);
  assert.ok(sonic.motorControlReductionRatio > 0.5);

  // Shatter incubation tank (impact >= 400 J)
  const shatter = sector.shatterIncubationContainmentTank(650);
  assert.equal(shatter.shattered, true);
  assert.equal(shatter.shatteredTanksCount, 1);
  assert.equal(shatter.tanksRemaining, 5);
  assert.ok(shatter.floodFluidLiters > 400);

  // Harvest DNA sample
  const harvest = sector.harvestTransgenicDnaSample('Upgraded Muscular Spinal Hybrid');
  assert.equal(harvest.success, true);
  assert.equal(harvest.totalVialsHarvested, 1);
  assert.equal(harvest.upgradeBiotechEligible, true);
});

test('Chantier 5 (v167): ValVerdePikeAmbushGraniteRidgeSector checks punji stake puncture hazard, detonates M203 40mm crater blasts, and models canopy rifle suppression sweeps', () => {
  const sector = new ValVerdePikeAmbushGraniteRidgeSector({
    ridgeElevationM: 18.0,
    punjiStakesCount: 12,
    m203GrenadesRemaining: 3
  });

  // Punji stake collision
  const punji = sector.checkPunjiStakeCollision(5.0);
  assert.equal(punji.impaled, true);
  assert.ok(punji.punctureDamage > 75);
  assert.ok(punji.movementSlowdownRatio > 0.3);

  // M203 grenade crater explosion
  const grenade = sector.detonateM203GraniteCraterBlast(24.0);
  assert.equal(grenade.detonated, true);
  assert.equal(grenade.blastOverpressureKpa, 240);
  assert.ok(grenade.concussiveDamage > 180);
  assert.equal(grenade.m203GrenadesRemaining, 2);

  // Blind-fire canopy suppression sweep
  const sweep = sector.executeCanopySuppressionSweep(5.0);
  assert.equal(sweep.canopySuppressionSweepsActive, true);
  assert.equal(sweep.hunterForcedToDropPerch, true);
  assert.ok(sweep.bulletsFired > 150);
});

test('Chantier 6 & Audit QA #1 (v167): HumanQaGrappleCableTensionHUDDirector updates tensile load, triggers clutch slip relief, and mounts HUD tension gauge', () => {
  const director = new HumanQaGrappleCableTensionHUDDirector({
    cableBreakingLimitN: 12000.0,
    highLoadThresholdRatio: 0.65,
    criticalSnapThresholdRatio: 0.85
  });

  // Nominal load
  const nominal = director.updateTensileLoad(4000);
  assert.equal(nominal.stressTier, 'NOMINAL');
  assert.equal(nominal.cableSnapped, false);

  // Critical load (> 85%)
  const critical = director.updateTensileLoad(10800);
  assert.equal(critical.stressTier, 'CRITICAL_SNAP_RISK');
  assert.equal(critical.cableSnapped, false);

  // Emergency clutch slip relieves tension
  const slip = director.engageEmergencyClutchSlip(1.5);
  assert.equal(slip.success, true);
  assert.equal(slip.clutchSlipped, true);
  assert.ok(slip.relievedTensionN < 10800);

  const hud = director.updateHudGaugeView(null);
  assert.equal(typeof hud.rendered, 'boolean');
});

test('Chantier 7 & Audit QA #2 (v167): AudioSynthesizer computes high-voltage plasma arc power, cable tensile snap whipcrack, and exposes 15 v167 procedural audio methods', () => {
  assert.ok(typeof audioSynth.computeHighVoltageThirdRailArcAcoustics === 'function');
  assert.ok(typeof audioSynth.computeCableTensileSnapAcousticImpulse === 'function');

  const arc = audioSynth.computeHighVoltageThirdRailArcAcoustics(750, 1200);
  assert.equal(arc.arcPowerKw, 900);
  assert.equal(arc.plasmaChannelTempC, 4200);
  assert.ok(arc.arcExplosionDecibels > 90);

  const snap = audioSynth.computeCableTensileSnapAcousticImpulse(11500, 18.0);
  assert.equal(snap.cableTensionN, 11500);
  assert.equal(snap.supersonicShockProduced, true);
  assert.ok(snap.transverseWaveSpeedMps > 343.0);
  assert.ok(snap.whipcrackDecibels > 100);

  const v167AudioMethods = [
    'playThirdRailHighVoltageElectricalArc',
    'playSubwayHydraulicDoorHiss',
    'playXenoQueenEggSacPulsingSquelch',
    'playResinFloorStickyFootstepPull',
    'playFacehuggerEggBloomHiss',
    'playSteelBeaverTrapSnapShut',
    'playRazorWireSlicingTwang',
    'playGeneticIncubationTankGlassShatter',
    'playSonicPulseDisruptorBlast',
    'playPunjiStakeImpaleThud',
    'playM203GraniteCraterBoom',
    'playGrappleCableHighTensionCreak',
    'playGrappleCableSnapWhipcrack',
    'playShadowSlipDashWhoosh',
    'playVisorThermalLensOverheatSizzle'
  ];

  for (const method of v167AudioMethods) {
    assert.ok(typeof audioSynth[method] === 'function', `Method ${method} must exist on audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 & Audit QA #3 (v167): HumanQaDiegeticPlasmaThermalDistortionAuditor registers heat buildup from plasma shots, simulates cooling dissipation, and triggers emergency steam purge', () => {
  const auditor = new HumanQaDiegeticPlasmaThermalDistortionAuditor({
    coolingRatePerSec: 0.18,
    overheatThresholdPercent: 75.0
  });

  // Rapid fire 4 shots
  auditor.registerPlasmaShot(450);
  auditor.registerPlasmaShot(450);
  auditor.registerPlasmaShot(450);
  const shot4 = auditor.registerPlasmaShot(450);

  assert.equal(shot4.isOverheated, true);
  assert.equal(shot4.currentHeatPercent, 100.0);
  assert.ok(shot4.laserWobbleDeg > 2.0);

  // Emergency steam purge
  const purge = auditor.triggerEmergencySteamPurge();
  assert.equal(purge.success, true);
  assert.equal(purge.steamPurgeActive, true);
  assert.ok(purge.heatDumped >= 35.0);
  assert.ok(purge.remainingHeatPercent <= 65.0);

  const styles = auditor.applyDiegeticThermalBloomStyles(null);
  assert.equal(typeof styles.stylesApplied, 'boolean');
});

test('Chantier 9 & Audit QA #4 (v167): HumanQaGameplayShadowSlipDashAuditor cancels attack animation mid-swing, executes 4.5m lateral dash, and verifies 140ms i-frames', () => {
  const auditor = new HumanQaGameplayShadowSlipDashAuditor({
    dashDistanceM: 4.5,
    dashDurationMs: 140.0,
    staminaCost: 25.0
  });

  // Cancel attack animation into dash
  const dash = auditor.executeShadowSlipDash(1000, 100.0, true);
  assert.equal(dash.success, true);
  assert.equal(dash.animationCancelled, true);
  assert.equal(dash.dashDistanceM, 4.5);
  assert.ok(dash.dashVelocityMps > 30.0);
  assert.equal(dash.remainingStamina, 75.0);

  // Check i-frames active during dash window (elapsed 60ms)
  assert.equal(auditor.isInvulnerable(1060), true);

  // Check i-frames expired after dash window (elapsed 150ms)
  assert.equal(auditor.isInvulnerable(1150), false);
});

test('Chantier 10 & Audit QA #5 (v167): HumanQaLevelDesignXenomorphResinFloorAuditor evaluates adhesive locomotion penalties (-45% sprint, -60% jump), grants Xenomorph native immunity, and clears resin via thermal blast', () => {
  const auditor = new HumanQaLevelDesignXenomorphResinFloorAuditor({
    resinLayerThicknessMm: 18.0,
    resinAdhesionIndex: 0.45
  });

  // Hunter locomotion on resin
  const hunterDrag = auditor.evaluateResinFloorImpedance(7.2, false);
  assert.equal(hunterDrag.isXenomorphSpecies, false);
  assert.ok(hunterDrag.effectiveVelocityMps < 4.5);
  assert.equal(hunterDrag.jumpHeightPenaltyRatio, 0.60);
  assert.ok(hunterDrag.stickyPeelDecibels > 60);

  // Xenomorph native immunity on resin
  const xenoMotion = auditor.evaluateResinFloorImpedance(7.2, true);
  assert.equal(xenoMotion.isXenomorphSpecies, true);
  assert.ok(xenoMotion.effectiveVelocityMps > 7.2);
  assert.equal(xenoMotion.jumpHeightPenaltyRatio, 0.0);

  // Thermal plasma incineration clears patch
  const burn = auditor.clearResinByIncineration(3.5);
  assert.equal(burn.success, true);
  assert.ok(burn.areaClearedM2 > 35.0);
  assert.equal(burn.tractionRestored, true);
});
