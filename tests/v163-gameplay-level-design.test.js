import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { SuperPredatorFalconerKatanaDuelClearingSector } from '../src/gameplay/SuperPredatorFalconerKatanaDuelClearingSector.js';
import { StargazerAutopsySurgicalMassacreSector } from '../src/gameplay/StargazerAutopsySurgicalMassacreSector.js';
import { GunnisonSubterraneanAqueductFloodgateTrapSector } from '../src/gameplay/GunnisonSubterraneanAqueductFloodgateTrapSector.js';
import { VoyageurCampInfernoFeralShieldSector } from '../src/gameplay/VoyageurCampInfernoFeralShieldSector.js';
import { LosAngelesSubwayStrobeNeonCarSector } from '../src/gameplay/LosAngelesSubwayStrobeNeonCarSector.js';
import { HumanQaPeripheralThreatCompassDirector } from '../src/gameplay/HumanQaPeripheralThreatCompassDirector.js';
import { HumanQaDiegeticVisorBloodSplatterAuditor } from '../src/gameplay/HumanQaDiegeticVisorBloodSplatterAuditor.js';
import { HumanQaGameplayCeilingDropCounterSlashAuditor } from '../src/gameplay/HumanQaGameplayCeilingDropCounterSlashAuditor.js';
import { HumanQaLevelDesignThermalMirageRefractionAuditor } from '../src/gameplay/HumanQaLevelDesignThermalMirageRefractionAuditor.js';

test('Chantier 1 (v163): SuperPredatorFalconerKatanaDuelClearingSector models katana parries, lethal mutual trade, and duel honor', () => {
  const sector = new SuperPredatorFalconerKatanaDuelClearingSector({
    plasmaCannonDeactivated: true,
    duelHonorable: true
  });

  const clash1 = sector.engageKatanaClash(45, 120);
  assert.equal(clash1.success, true);
  assert.equal(clash1.isPerfectParry, true);
  assert.ok(clash1.sparkLuminosityLumens > 10000);

  const trade = sector.resolveLethalStabTrade(700, 800);
  assert.equal(trade.duelConcluded, true);
  assert.equal(trade.bothFell, true);
  assert.equal(trade.winner, 'MUTUAL_LETHAL_TRADE');

  const honor = sector.evaluateDuelHonorRating();
  assert.equal(honor.honorPointsAwarded, 550);
});

test('Chantier 2 (v163): StargazerAutopsySurgicalMassacreSector breaks operating table restraints and wields ultrasonic bone saw', () => {
  const sector = new StargazerAutopsySurgicalMassacreSector({
    restraintsIntegrity: 300,
    hazmatGuardsCount: 6
  });

  const breakRestraints = sector.breakSurgicalRestraints(500);
  assert.equal(breakRestraints.success, true);
  assert.equal(breakRestraints.unbound, true);
  assert.equal(sector.restraintsBroken, true);

  const sawAttack = sector.wieldImprovisedMedicalBoneSaw(0);
  assert.equal(sawAttack.success, true);
  assert.equal(sawAttack.sawRpm, 2850);
  assert.equal(sawAttack.guardsRemaining, 5);

  const sed = sector.evaluateSedativeDisorientation(2.0);
  assert.ok(sed.sedativeLevel < 1.0);
  assert.ok(sed.motorControlRatio > 0.35);
});

test('Chantier 3 (v163): GunnisonSubterraneanAqueductFloodgateTrapSector drops 5-ton floodgate, triggers water surge, and electrocutes channel', () => {
  const sector = new GunnisonSubterraneanAqueductFloodgateTrapSector();

  const drop = sector.triggerEmergencyFloodgateDrop(5);
  assert.equal(drop.success, true);
  assert.equal(drop.floodgateDropped, true);
  assert.equal(drop.trappedXenosCount, 5);

  const surge = sector.releaseWaterSurge();
  assert.equal(surge.success, true);
  assert.equal(surge.sweptAgainstGrate, true);

  const zap = sector.electrifyFloodChannel(1500);
  assert.equal(zap.success, true);
  assert.equal(zap.waterElectrified, true);
  assert.equal(zap.xenosKilled, 5);
  assert.equal(sector.trappedXenosCount, 0);
});

test('Chantier 4 (v163): VoyageurCampInfernoFeralShieldSector deploys retractable fan shield, deflects muskets into kegs, and models fire', () => {
  const sector = new VoyageurCampInfernoFeralShieldSector({
    voyageurMusketeersCount: 5,
    gunpowderKegsCount: 3
  });

  const deploy = sector.deployRetractableFanShield();
  assert.equal(deploy.success, true);
  assert.equal(deploy.retractableShieldDeployed, true);
  assert.equal(deploy.frontalCoverageDegrees, 180);

  const deflect = sector.deflectMusketBallVolley(5);
  assert.equal(deflect.deflected, true);
  assert.ok(deflect.kegsDetonatedThisVolley > 0);
  assert.ok(deflect.musketeersRemaining < 5);

  const fire = sector.evaluateCampFireHazard(2.0);
  assert.ok(fire.ambientFlameTempCelsius > 550);
  assert.ok(fire.totalBurnDamage > 0);
});

test('Chantier 5 (v163): LosAngelesSubwayStrobeNeonCarSector cycles neon strobe pulses, syncs cloaked stalk with darkness, and triggers brakes', () => {
  const sector = new LosAngelesSubwayStrobeNeonCarSector({
    strobeFrequencyHz: 11.5
  });

  const strobe = sector.cycleStrobeNeonPulse(0.02);
  assert.ok(strobe.darknessDurationMs > 0);

  // Syncing cloak in dark phase
  sector.isLightPhase = false;
  const darkSync = sector.syncCloakWithStrobeDarkness(2.5);
  assert.equal(darkSync.synced, true);
  assert.equal(darkSync.stealthMultiplier, 1.0);

  // Syncing in light phase exposes silhouette
  sector.isLightPhase = true;
  const lightSync = sector.syncCloakWithStrobeDarkness(2.5);
  assert.equal(lightSync.synced, false);
  assert.equal(lightSync.cloakSilhouetteExposed, true);

  const brakes = sector.breakSubwayEmergencyBrakes();
  assert.equal(brakes.emergencyBrakesEngaged, true);
  assert.ok(brakes.targetsDisarmed > 0);
});

test('Chantier 6 & Audit QA #1 (v163): HumanQaPeripheralThreatCompassDirector evaluates 360-degree threat bearings and critical proximity blips', () => {
  const director = new HumanQaPeripheralThreatCompassDirector({
    compassRadiusPixels: 160,
    maxDetectionRangeMeters: 35.0
  });

  const playerPos = { x: 0, z: 0 };
  const playerLook = { x: 0, z: 1 }; // Facing north

  const threats = [
    { id: 'xeno-behind', x: 0, z: -3.5, isAggressive: true }, // 3.5m directly behind -> critical
    { id: 'sniper-right', x: 20, z: 0, isAggressive: true }   // 20m right (90 deg)
  ];

  const tracking = director.updateThreatTracking(threats, playerPos, playerLook);
  assert.equal(tracking.totalTracked, 2);
  assert.equal(tracking.criticalCount, 1);

  const behindBlip = tracking.blips.find(b => b.id === 'xeno-behind');
  assert.equal(behindBlip.isCritical, true);
  assert.equal(behindBlip.relativeAngleDeg, 180);
  assert.ok(behindBlip.cssClass.includes('critical'));

  const hud = director.getPeripheralCompassHudState();
  assert.equal(hud.active, true);
  assert.equal(hud.hasImmediateFlanker, true);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.peripheral-threat-ring'));
  assert.ok(css.includes('.threat-blip.critical'));
});

test('Chantier 7 & Audit QA #2 (v163): AudioSynthesizer computes shockwave SPL, psychoacoustic tinnitus, and implements 15 v163 procedural audio methods', () => {
  const shockwave = audioSynth.computeBlastShockwaveAcousticParameters(3.5, 2.5);
  assert.equal(shockwave.blastDistanceMeters, 3.5);
  assert.ok(shockwave.peakOverpressureKpa > 0);
  assert.ok(shockwave.soundPressureLevelDb > 120);

  const tinnitus = audioSynth.computePsychoacousticTinnitusDecay(158.0, 0.85);
  assert.equal(tinnitus.tinnitusFrequencyHz, 3850);
  assert.ok(tinnitus.durationSec >= 0.5);
  assert.ok(tinnitus.bandpassCutoffMuffleHz <= 3500);

  // Verify all 15 methods are callable without throw
  assert.doesNotThrow(() => audioSynth.playFalconerKatanaClashChime());
  assert.doesNotThrow(() => audioSynth.playHanzoKatanaSheatheClick());
  assert.doesNotThrow(() => audioSynth.playSurgicalRestraintBreakClatter());
  assert.doesNotThrow(() => audioSynth.playMedicalBoneSawHighPitchBuzz());
  assert.doesNotThrow(() => audioSynth.playAqueductFloodgateHeavyDropThud());
  assert.doesNotThrow(() => audioSynth.playSubterraneanTurbulentWaterRush());
  assert.doesNotThrow(() => audioSynth.playFeralRetractableShieldExpandSnap());
  assert.doesNotThrow(() => audioSynth.playMusketBallShieldRicochetPing());
  assert.doesNotThrow(() => audioSynth.playSubwayStrobeNeonFlickerZap());
  assert.doesNotThrow(() => audioSynth.playSubwayTrackEmergencyBrakeScreech());
  assert.doesNotThrow(() => audioSynth.playTinnitusEarRingingSine());
  assert.doesNotThrow(() => audioSynth.playShockwaveMuffledLowThump());
  assert.doesNotThrow(() => audioSynth.playVisorBloodSplatterSquelch());
  assert.doesNotThrow(() => audioSynth.playCeilingDropAssassinationSlash());
  assert.doesNotThrow(() => audioSynth.playThermalMirageWarpHum());
});

test('Chantier 8 & Audit QA #3 (v163): HumanQaDiegeticVisorBloodSplatterAuditor applies execution blood splatter and models rain wash-off', () => {
  const auditor = new HumanQaDiegeticVisorBloodSplatterAuditor();

  const splatter = auditor.applyExecutionBloodSplatter(35.0, 'HUMAN');
  assert.equal(splatter.splatterActive, true);
  assert.ok(splatter.bloodCoveragePercentage > 30);
  assert.equal(splatter.bloodColor, '#880000');

  const wash = auditor.processEnvironmentalWashing(true, 6.0, 2.0);
  assert.ok(wash.bloodCoveragePercentage < splatter.bloodCoveragePercentage);

  const wipe = auditor.wipeVisorClean();
  assert.equal(wipe.success, true);
  assert.equal(wipe.bloodCoveragePercentage, 0.0);
  assert.equal(wipe.splatterActive, false);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.visor-blood-splatter-overlay'));
  assert.ok(css.includes('.splatter-active'));
});

test('Chantier 9 & Audit QA #4 (v163): HumanQaGameplayCeilingDropCounterSlashAuditor evaluates vertical drop eligibility and executes dual-blade assassination', () => {
  const auditor = new HumanQaGameplayCeilingDropCounterSlashAuditor({
    maxAssassinationDropMeters: 12.0
  });

  const targetPos = { x: 0.5, z: 0.5 };
  const hunterPos = { x: 0, z: 0 };

  const eligibility = auditor.evaluateCeilingDropEligibility(true, 7.0, targetPos, hunterPos);
  assert.equal(eligibility.eligible, true);
  assert.equal(eligibility.targetInKillCone, true);

  const targetEnemy = { health: 250 };
  const assassination = auditor.executeCeilingDropCounterSlash(targetEnemy, 7.0);
  assert.equal(assassination.success, true);
  assert.ok(assassination.lethalDamage >= 350);
  assert.equal(targetEnemy.health, 0);
  assert.equal(assassination.landingRecoveryLagCancelled, true);
});

test('Chantier 10 & Audit QA #5 (v163): HumanQaLevelDesignThermalMirageRefractionAuditor evaluates heat shimmer delta_n and disrupts laser lock-on', () => {
  const auditor = new HumanQaLevelDesignThermalMirageRefractionAuditor({
    mirageTriggerTempCelsius: 450.0
  });

  const lowTemp = auditor.evaluateThermalMirageDistortion(250.0, 20.0, 5.0);
  assert.equal(lowTemp.heatMirageActive, false);

  const fireMirage = auditor.evaluateThermalMirageDistortion(750.0, 20.0, 6.0);
  assert.equal(fireMirage.heatMirageActive, true);
  assert.ok(fireMirage.distortionFactor > 0.5);
  assert.ok(fireMirage.refractiveIndexDelta < 0);

  const lockDisruption = auditor.disruptLaserLockThroughMirage(1.0);
  assert.equal(lockDisruption.lockDisrupted, true);
  assert.ok(lockDisruption.finalStabilityScore < 0.7);

  const hud = auditor.getMirageTelemetry();
  assert.equal(hud.heatMirageActive, true);
  assert.ok(hud.cssClass.includes('active'));

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.heat-mirage-distortion-overlay'));
});
