import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { GorgeSuspensionBridgeUpgradePredatorAmbushSector } from '../src/gameplay/GorgeSuspensionBridgeUpgradePredatorAmbushSector.js';
import { PyramidAztecCalendarWheelSarcophagusSector } from '../src/gameplay/PyramidAztecCalendarWheelSarcophagusSector.js';
import { BlueLineSubwayCarStrobeAmbushSector } from '../src/gameplay/BlueLineSubwayCarStrobeAmbushSector.js';
import { DeadTreeCanyonTaabeNooseAmbushSector } from '../src/gameplay/DeadTreeCanyonTaabeNooseAmbushSector.js';
import { ValVerdeColdClayMudCamouflageSector } from '../src/gameplay/ValVerdeColdClayMudCamouflageSector.js';
import { HumanQaDynamicPlasmaReticleAndCapacitorHudDirector } from '../src/gameplay/HumanQaDynamicPlasmaReticleAndCapacitorHudDirector.js';
import { HumanQaDiegeticPhosphorFlareBlindnessAuditor } from '../src/gameplay/HumanQaDiegeticPhosphorFlareBlindnessAuditor.js';
import { HumanQaGameplayBackstabParryAndSlopeTractionAuditor } from '../src/gameplay/HumanQaGameplayBackstabParryAndSlopeTractionAuditor.js';
import { HumanQaLevelDesignCanopyBranchStabilityAndPatrolLoopAuditor } from '../src/gameplay/HumanQaLevelDesignCanopyBranchStabilityAndPatrolLoopAuditor.js';

test('Chantier 1 (v157): GorgeSuspensionBridgeUpgradePredatorAmbushSector handles Upgrade charge, dermal armor deflection and cable severing', () => {
  const sector = new GorgeSuspensionBridgeUpgradePredatorAmbushSector();
  const upgrade = {};
  const charge = sector.spawnUpgradePredatorCharge(upgrade);
  assert.equal(charge.chargeInitiated, true);
  assert.equal(upgrade.dermalArmorActive, true);

  const deflect = sector.deflectBallisticFireOnDermalArmor({ damage: 60 });
  assert.equal(deflect.deflected, true);
  assert.equal(deflect.absorbedDamage, 54);
  assert.equal(deflect.penetrationDamage, 6);

  sector.severSuspensionCable('left', 'smart_disc');
  sector.severSuspensionCable('left', 'smart_disc');
  const collapse = sector.severSuspensionCable('right', 'smart_disc');
  assert.equal(collapse.bridgeCollapsed, true);
  assert.equal(collapse.upgradePredatorPlungedIntoGorge, true);
});

test('Chantier 2 (v157): PyramidAztecCalendarWheelSarcophagusSector aligns concentric rings, slides tomb slab, and recovers ritual plasmacasters', () => {
  const sector = new PyramidAztecCalendarWheelSarcophagusSector({
    innerRingAngleDeg: 0,
    middleRingAngleDeg: 270,
    outerRingAngleDeg: 180
  });

  sector.rotateCalendarRing('middle', 90);
  const outerRotate = sector.rotateCalendarRing('outer', 180);
  assert.equal(outerRotate.aligned, true);
  assert.equal(outerRotate.sarcophagusUnlocked, true);

  const recovery = sector.retrieveRitualPlasmacastersFromSarcophagus();
  assert.equal(recovery.retrieved, true);
  assert.equal(recovery.plasmacastersRecovered, 3);
  assert.equal(recovery.pyramidShiftTriggered, true);
});

test('Chantier 3 (v157): BlueLineSubwayCarStrobeAmbushSector pries hydraulic doors, identifies targets in strobe smoke, and spares pregnant passenger', () => {
  const sector = new BlueLineSubwayCarStrobeAmbushSector();
  const door = sector.prySubwayCarDoorOpen();
  assert.equal(door.doorsPriedOpen, true);

  const passengers = [
    { id: 'gang_leader', weaponDrawn: true },
    { id: 'leona_cantrell', weaponDrawn: true, pregnant: true },
    { id: 'civilian_unarmed', weaponDrawn: false }
  ];

  const scan = sector.pulseGunfireStrobeLighting(passengers);
  assert.equal(scan.strobeActive, true);
  assert.equal(scan.armedThreats, 1);
  assert.equal(scan.pregnantOrUnarmedProtected, 2);

  const kill = sector.neutralizeHostileInStrobeSmoke(passengers[0]);
  assert.equal(kill.eliminated, true);

  const spared = sector.neutralizeHostileInStrobeSmoke(passengers[1]);
  assert.equal(spared.eliminated, false);
  assert.equal(spared.sparedByHonorCode, true);
});

test('Chantier 4 (v157): DeadTreeCanyonTaabeNooseAmbushSector casts equestrian snare, debuffs Feral speed, and allows expanding shield counter', () => {
  const sector = new DeadTreeCanyonTaabeNooseAmbushSector();
  const feral = { health: 200 };
  const snare = sector.castEquestrianLassoSnare(feral);
  assert.equal(snare.snared, true);
  assert.equal(feral.snaredInNoose, true);
  assert.equal(feral.movementSpeedMultiplier, 0.3);

  const shot = sector.registerFlankingBowShot(feral);
  assert.equal(shot.arrowLanded, true);
  assert.equal(shot.damageDealt, 38);

  const cut = sector.severNooseWithExpandingShield(feral);
  assert.equal(cut.severed, true);
  assert.equal(feral.snaredInNoose, false);
  assert.equal(feral.movementSpeedMultiplier, 1.0);
});

test('Chantier 5 (v157): ValVerdeColdClayMudCamouflageSector slathers cold clay to conceal thermal signature and dries over time', () => {
  const sector = new ValVerdeColdClayMudCamouflageSector();
  const dutch = {};
  const slather = sector.slatherBodyWithColdClayDeposit(dutch);
  assert.equal(slather.slathered, true);
  assert.equal(dutch.surfaceTemperatureCelsius, 18.0);
  assert.equal(dutch.invisibleToThermalInfrared, true);

  sector.updateMudDrying(20, false, dutch);
  const dried = sector.updateMudDrying(30, true, dutch);
  assert.equal(dried.mudActive, false);
  assert.equal(dutch.invisibleToThermalInfrared, false);
  assert.equal(dutch.surfaceTemperatureCelsius, 37.0);
});

test('Chantier 6 + Audit Humain QA #1 (v157): HumanQaDynamicPlasmaReticleAndCapacitorHudDirector widens reticle spread and tracks capacitor segments', () => {
  const hud = new HumanQaDynamicPlasmaReticleAndCapacitorHudDirector();
  const first = hud.recordPlasmaDischarge('standard');
  assert.ok(first.currentSpreadPx > 36);
  assert.equal(first.activeSegmentsCount, 4);

  hud.recordPlasmaDischarge('overcharged');
  const heavy = hud.recordPlasmaDischarge('overcharged');
  assert.equal(heavy.overheated, true);

  const cool = hud.updateCooling(2.5);
  assert.equal(cool.overheated, false);
  assert.ok(cool.cssVariableStyle.includes('--reticle-spread:'));

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('.plasma-reticle-circle'));
  assert.ok(cssContent.includes('.capacitor-charge-bar'));
});

test('Chantier 7 + Audit Humain QA #2 (v157): AudioSynthesizer computes environmental reverb and Doppler proximity shift, with 15 v157 procedural SFX', () => {
  const templeReverb = audioSynth.computeEnvironmentalReverbParameters('temple_stone', 1200);
  assert.ok(templeReverb.decayTimeSec > 2.0);
  assert.equal(templeReverb.wetMixRatio, 0.45);

  const gorgeReverb = audioSynth.computeEnvironmentalReverbParameters('gorge_open_air');
  assert.ok(gorgeReverb.decayTimeSec < 1.0);

  const doppler = audioSynth.computeDopplerProximityShift(220, 2.0);
  assert.ok(doppler.approachPitchShiftMultiplier > 1.0);
  assert.ok(doppler.recedePitchShiftMultiplier < 1.0);

  const v157SfxMethods = [
    'playGorgeSuspensionBridgeCableSnap',
    'playUpgradePredatorDermalArmorDeflect',
    'playAztecCalendarRingGearRotation',
    'playPyramidSarcophagusStoneSlabSlide',
    'playBlueLineSubwayStrobeGunfireSparks',
    'playSubwayCarDoorHydraulicPry',
    'playTaabeEquestrianNooseWhistle',
    'playDeadTreeCanyonLassoSnareSnap',
    'playMudCamouflageClaySlatherSquish',
    'playDutchColdClayThermalConcealHum',
    'playPlasmaReticleThermalSpreadClick',
    'playTempleChamberAcousticReverbTail',
    'playMagnesiumPhosphorFlareWhiteoutHiss',
    'playRearAmbushParryTalonClang',
    'playCanopyBoughStressCrackWarning'
  ];

  for (const method of v157SfxMethods) {
    assert.equal(typeof audioSynth[method], 'function');
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 + Audit Humain QA #3 (v157): HumanQaDiegeticPhosphorFlareBlindnessAuditor triggers whiteout blindness from magnesium flare in THERMAL_INFRA', () => {
  const auditor = new HumanQaDiegeticPhosphorFlareBlindnessAuditor();
  const exposure = auditor.evaluatePhosphorFlareExposure(
    { distanceMeters: 4.5, inFieldOfView: true },
    { visionMode: 'THERMAL_INFRA' }
  );
  assert.equal(exposure.whiteoutTriggered, true);
  assert.equal(exposure.triLaserDisabled, true);
  assert.equal(exposure.recommendedVisionMode, 'ELECTROMAGNETIC_TECH');

  const recoveryMid = auditor.updateBlindnessRecovery(1.1);
  assert.equal(recoveryMid.active, true);
  assert.equal(recoveryMid.whiteoutIntensity, 0.5);

  const recoveryDone = auditor.updateBlindnessRecovery(1.2);
  assert.equal(recoveryDone.active, false);
  assert.equal(recoveryDone.whiteoutIntensity, 0);
});

test('Chantier 9 + Audit Humain QA #4 (v157): HumanQaGameplayBackstabParryAndSlopeTractionAuditor counters rear ambush within reflex window and anchors talons on slopes', () => {
  const auditor = new HumanQaGameplayBackstabParryAndSlopeTractionAuditor();
  const parry = auditor.evaluateRearAmbushParry({ angleFromHunterDeg: 180, damage: 50 }, 0.14);
  assert.equal(parry.parried, true);
  assert.equal(parry.attackerStaggered, true);
  assert.equal(parry.rearDamageNegated, true);

  const missed = auditor.evaluateRearAmbushParry({ angleFromHunterDeg: 180, damage: 50 }, 0.35);
  assert.equal(missed.parried, false);
  assert.equal(missed.rearDamageTaken, 50);

  const steepSlope = auditor.evaluateSlopeGripAndTalonTraction(52.0, true);
  assert.equal(steepSlope.slipping, false);
  assert.equal(steepSlope.talonAnchored, true);

  const looseSlope = auditor.evaluateSlopeGripAndTalonTraction(52.0, false);
  assert.equal(looseSlope.slipping, true);
});

test('Chantier 10 + Audit Humain QA #5 (v157): HumanQaLevelDesignCanopyBranchStabilityAndPatrolLoopAuditor emits wood crack warning and smooths patrol waypoint reversals', () => {
  const auditor = new HumanQaLevelDesignCanopyBranchStabilityAndPatrolLoopAuditor();
  const rottenBranch = auditor.evaluateCanopyBranchWeightCapacity(
    { maxWeightCapacityKg: 200, dryRottenWood: true },
    190
  );
  assert.equal(rottenBranch.safe, false);
  assert.equal(rottenBranch.warningEmitted, true);
  assert.equal(rottenBranch.reactionGraceWindowSec, 0.8);

  const rawWaypoints = [
    { id: 'wp1', x: 0, z: 0 },
    { id: 'wp2', x: 10, z: 0 },
    { id: 'wp3', x: 0, z: 0 }
  ];
  const smoothed = auditor.auditAndSmoothPatrolWaypoints(rawWaypoints);
  assert.equal(smoothed.isLoopClosed, true);
  assert.ok(smoothed.sharpReversalsCorrected > 0);
  assert.ok(smoothed.smoothedCount > rawWaypoints.length);
});
