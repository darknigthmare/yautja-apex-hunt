import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { PyramidSacrificialChamberAltarShackleSector } from '../src/gameplay/PyramidSacrificialChamberAltarShackleSector.js';
import { KeyesOwlfRefrigeratedSurveillanceTruckSector } from '../src/gameplay/KeyesOwlfRefrigeratedSurveillanceTruckSector.js';
import { ValVerdeCounterweightLogPendulumTrapSector } from '../src/gameplay/ValVerdeCounterweightLogPendulumTrapSector.js';
import { ComancheCampLuminescentBloodTrailTracker } from '../src/gameplay/ComancheCampLuminescentBloodTrailTracker.js';
import { GunnisonMaternityWardXenomorphInfestationSector } from '../src/gameplay/GunnisonMaternityWardXenomorphInfestationSector.js';
import { HumanQaColorblindHudContrastAuditDirector } from '../src/gameplay/HumanQaColorblindHudContrastAuditDirector.js';
import { HumanQaDiegeticSensorGlitchAndMimicryAuditor } from '../src/gameplay/HumanQaDiegeticSensorGlitchAndMimicryAuditor.js';
import { HumanQaGameplayInputBufferAndCoyoteTimeAuditor } from '../src/gameplay/HumanQaGameplayInputBufferAndCoyoteTimeAuditor.js';
import { HumanQaLevelDesignSightlineAndDeadEndAuditor } from '../src/gameplay/HumanQaLevelDesignSightlineAndDeadEndAuditor.js';

test('Chantier 1 (v154): PyramidSacrificialChamberAltarShackleSector locks sacrificial shackles, raises ovomorphs, and allows shackle severing', () => {
  const sector = new PyramidSacrificialChamberAltarShackleSector({ altarCount: 4 });
  const locked = sector.engageSacrificialAltarShackles();
  assert.equal(locked.engaged, true);
  assert.equal(locked.lockedCount, 4);

  const conveyor = sector.ascendOvomorphConveyorRails();
  assert.equal(conveyor.conveyorActive, true);
  assert.equal(conveyor.risenCount, 4);

  const severed = sector.severAltarShackleMechanism('sacrificial_altar_1', 'smart_disc');
  assert.equal(severed.freed, true);
  assert.equal(severed.remainingLockedAltars, 3);
});

test('Chantier 2 (v154): KeyesOwlfRefrigeratedSurveillanceTruckSector broadcasts OWLF telemetry and blinds squad when sabotaged', () => {
  const truck = new KeyesOwlfRefrigeratedSurveillanceTruckSector();
  const sweep = truck.broadcastOwlfTacticalSweep({ visionMode: 'ELECTROMAGNETIC_TECH' });
  assert.equal(sweep.sweepActive, true);
  assert.equal(sweep.truckBeamRevealedToHunter, true);

  const sab = truck.sabotageSurveillanceRelay('plasmacaster_dish_strike');
  assert.equal(sab.sabotaged, true);
  assert.equal(sab.owlfSquadBlinded, true);
  assert.equal(truck.broadcastOwlfTacticalSweep().sweepActive, false);
});

test('Chantier 3 (v154): ValVerdeCounterweightLogPendulumTrapSector detects vine tension and crushes target under counterweight', () => {
  const trap = new ValVerdeCounterweightLogPendulumTrapSector();
  const scan = trap.inspectVineTension({ visionMode: 'ELECTROMAGNETIC_TECH', distanceMeters: 12 });
  assert.equal(scan.trapDetected, true);

  const target = { health: 300, standingUnderCounterweight: true };
  const release = trap.triggerPendulumRelease(target);
  assert.equal(release.triggered, true);
  assert.equal(release.hitType, 'counterweight_vertical_crush');
  assert.equal(target.crushedByCounterweightLog, true);
  assert.equal(target.health, 60);
});

test('Chantier 4 (v154): ComancheCampLuminescentBloodTrailTracker locks luminescent blood trail and cools body temp with Orange Totsiyaa', () => {
  const tracker = new ComancheCampLuminescentBloodTrailTracker();
  tracker.inspectLuminescentBloodNode('blood_drop_creek');
  const second = tracker.inspectLuminescentBloodNode('blood_drop_birch');
  assert.equal(second.trailLocked, true);

  const hunterPrey = { name: 'Naru', bodyTemperatureCelsius: 37.0 };
  const cooled = tracker.applyOrangeTotsiyaaHerbEffect(hunterPrey);
  assert.equal(cooled.applied, true);
  assert.equal(cooled.bodyTemperatureCelsius, 21.0);
  assert.equal(cooled.invisibleToThermalVision, true);
});

test('Chantier 5 (v154): GunnisonMaternityWardXenomorphInfestationSector pulses emergency lights and dissolves evidence with blue vial', () => {
  const ward = new GunnisonMaternityWardXenomorphInfestationSector();
  const light = ward.pulseEmergencyCorridorLighting();
  assert.equal(light.blackoutActive, true);

  ward.dissolveBiologicalEvidenceWithBlueVial('bio_residue_corridor_a');
  ward.dissolveBiologicalEvidenceWithBlueVial('bio_residue_nursery');
  const last = ward.dissolveBiologicalEvidenceWithBlueVial('bio_residue_stairwell');
  assert.equal(last.remainingEvidence, 0);
  assert.equal(last.predalienCorneredInShaft, true);
});

test('Chantier 6 + Audit Humain QA #1 (v154): HumanQaColorblindHudContrastAuditDirector applies colorblind palettes, shape glyphs, and CSS rules', () => {
  const cbDirector = new HumanQaColorblindHudContrastAuditDirector();
  const applied = cbDirector.setColorblindProfile('deuteranopia');
  assert.equal(applied.profileApplied, 'deuteranopia');
  assert.equal(applied.meetsWcagAA, true);

  const marker = cbDirector.formatAccessibleThreatMarker('ACID_HAZARD', 'POOL');
  assert.equal(marker.glyph, '◆');
  assert.equal(marker.nonColorRedundancyGuaranteed, true);

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('.cb-deuteranopia'));
  assert.ok(cssContent.includes('.hud-threat-glyph'));
});

test('Chantier 7 + Audit Humain QA #2 (v154): AudioSynthesizer provides stereo panning, critical audio ducking, and 15 v154 procedural SFX', () => {
  assert.equal(typeof audioSynth.computeStereoPanFromAngle, 'function');
  assert.equal(typeof audioSynth.triggerCriticalAudioDucking, 'function');

  assert.equal(audioSynth.computeStereoPanFromAngle(Math.PI / 2), 1);
  assert.equal(audioSynth.computeStereoPanFromAngle(-Math.PI / 2), -1);

  const duck = audioSynth.triggerCriticalAudioDucking(900, 0.25);
  assert.equal(duck.active, true);
  assert.equal(duck.duckRatio, 0.25);

  const v154SfxMethods = [
    'playSacrificialAltarShackleClampLock',
    'playOvomorphConveyorAscentRattle',
    'playKeyesSurveillanceTruckTelemetrySweep',
    'playOwlfMobileCommandFeedStaticShort',
    'playValVerdeLogPendulumWhoosh',
    'playCounterweightLogBoneCrushThud',
    'playLuminescentBloodTrailPulseShimmer',
    'playOrangeTotsiyaaHypothermicCoolChime',
    'playGunnisonWardEmergencyLampFlickerBuzz',
    'playWolfDissolvingVialCorrosiveHiss',
    'playColorblindContrastProfileLockTone',
    'playCriticalAudioDuckingSidechainPulse',
    'playCrackedMaskMimicryGlitchWarble',
    'playInputBufferQueuedActionSnap',
    'playStoneBulkheadAntiCrushWarningRumble'
  ];

  for (const methodName of v154SfxMethods) {
    assert.equal(typeof audioSynth[methodName], 'function');
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});

test('Chantier 8 + Audit Humain QA #3 (v154): HumanQaDiegeticSensorGlitchAndMimicryAuditor detects ambient thermal whiteout and cracked mask mimicry glitch', () => {
  const auditor = new HumanQaDiegeticSensorGlitchAndMimicryAuditor();
  const whiteout = auditor.evaluateThermalVisionSaturation({
    ambientTemperatureCelsius: 37.5,
    visionMode: 'THERMAL_INFRA'
  });
  assert.equal(whiteout.thermalWhiteoutActive, true);
  assert.equal(whiteout.recommendedFallbackMode, 'ELECTROMAGNETIC_TECH');

  const mimicry = auditor.evaluateVocalMimicryFidelity({
    maskIntegrity: 22,
    phrase: 'anytime'
  });
  assert.equal(mimicry.glitched, true);
  assert.equal(mimicry.veteranEnemiesSuspicious, true);
});

test('Chantier 9 + Audit Humain QA #4 (v154): HumanQaGameplayInputBufferAndCoyoteTimeAuditor buffers recovery inputs, grants coyote jump, and ignores micro-jitter during heal', () => {
  const auditor = new HumanQaGameplayInputBufferAndCoyoteTimeAuditor();
  const queued = auditor.queueActionInput('dodge_roll', 0.09);
  assert.equal(queued.buffered, true);

  const consumed = auditor.consumeBufferedActionOnRecoveryEnd();
  assert.equal(consumed.consumed, true);
  assert.equal(consumed.actionName, 'dodge_roll');

  const coyote = auditor.canExecuteCanopyJump({ onBranchOrLedge: false, timeSinceLeftLedgeSec: 0.08 });
  assert.equal(coyote.jumpAllowed, true);
  assert.equal(coyote.viaCoyoteTime, true);

  const healCheck = auditor.shouldCancelMedikitChannel({ tookDirectDamage: false, displacementMeters: 0.09 });
  assert.equal(healCheck.cancelled, false);
  assert.equal(healCheck.preservedAgainstMicroJitter, true);
});

test('Chantier 10 + Audit Humain QA #5 (v154): HumanQaLevelDesignSightlineAndDeadEndAuditor pops emergency vent on dead-end and ejects actor from closing stone bulkhead', () => {
  const auditor = new HumanQaLevelDesignSightlineAndDeadEndAuditor();
  const room = auditor.auditRoomExitTopology({ openMainDoorsCount: 0, openCeilingVentsCount: 0 });
  assert.equal(room.deadEndPrevented, true);
  assert.equal(room.emergencyVentPopped, true);
  assert.equal(room.totalAvailableExits, 1);

  const bulkhead = auditor.evaluateClosingStoneBulkhead({ standingUnderDoorThreshold: true });
  assert.equal(bulkhead.instantCrushPrevented, true);
  assert.equal(bulkhead.ejectedToSafeSide, true);
});
