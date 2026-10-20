import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { ObservatoryTransmissionDishFugitiveBeaconSector } from '../src/gameplay/ObservatoryTransmissionDishFugitiveBeaconSector.js';
import { PyramidPneumaticCompressingSpikeCorridorSector } from '../src/gameplay/PyramidPneumaticCompressingSpikeCorridorSector.js';
import { ElScorpioPenthouseZipWireEscapeSector } from '../src/gameplay/ElScorpioPenthouseZipWireEscapeSector.js';
import { FrenchVoyageurCampfireBearTrapBaitSector } from '../src/gameplay/FrenchVoyageurCampfireBearTrapBaitSector.js';
import { SuperPredatorCampClassicTiedTotemDuelSector } from '../src/gameplay/SuperPredatorCampClassicTiedTotemDuelSector.js';
import { HumanQaRadialWeaponWheelTacticalSlowdownDirector } from '../src/gameplay/HumanQaRadialWeaponWheelTacticalSlowdownDirector.js';
import { HumanQaDiegeticElectrostaticDischargeAndCoilSmokeAuditor } from '../src/gameplay/HumanQaDiegeticElectrostaticDischargeAndCoilSmokeAuditor.js';
import { HumanQaGameplayLedgeHangCancelAndTailParryAuditor } from '../src/gameplay/HumanQaGameplayLedgeHangCancelAndTailParryAuditor.js';
import { HumanQaLevelDesignCoverPillarSpacingAndDihedralAngleAuditor } from '../src/gameplay/HumanQaLevelDesignCoverPillarSpacingAndDihedralAngleAuditor.js';

test('Chantier 1 (v158): ObservatoryTransmissionDishFugitiveBeaconSector aligns dish azimuth and transmits recall beacon laser', () => {
  const sector = new ObservatoryTransmissionDishFugitiveBeaconSector({ dishAzimuthDeg: 90 });
  assert.equal(sector.transmitFugitiveRecallBeaconLaser().transmitted, false);

  const calib = sector.calibrateTransmissionDishAzimuth(90);
  assert.equal(calib.dishAligned, true);

  const beacon = sector.transmitFugitiveRecallBeaconLaser(true);
  assert.equal(beacon.transmitted, true);
  assert.equal(beacon.orbitalDropTriggered, true);
  assert.equal(beacon.predatorKillerCargoDecoded, true);
});

test('Chantier 2 (v158): PyramidPneumaticCompressingSpikeCorridorSector compresses granite walls and impales or allows upper ledge evasion', () => {
  const sector = new PyramidPneumaticCompressingSpikeCorridorSector();
  sector.triggerPneumaticWallCompression(1.5);
  const comp = sector.triggerPneumaticWallCompression(2.2);
  assert.equal(comp.requiresVerticalClimb, true);

  const groundWalker = { health: 120, perchedOnUpperLedge: false };
  const hit = sector.stepOnPressurePlateFloorTrap(groundWalker);
  assert.equal(hit.triggered, true);
  assert.equal(hit.evadedViaUpperLedge, false);
  assert.equal(groundWalker.health, 55);

  const upperLedgeClimber = { health: 120, perchedOnUpperLedge: true };
  const safe = sector.stepOnPressurePlateFloorTrap(upperLedgeClimber);
  assert.equal(safe.evadedViaUpperLedge, true);
  assert.equal(safe.damageDealt, 0);
});

test('Chantier 3 (v158): ElScorpioPenthouseZipWireEscapeSector slides along zip wire and cuts cable with Smart Disc', () => {
  const sector = new ElScorpioPenthouseZipWireEscapeSector();
  const elScorpio = { health: 100 };
  const slide = sector.initiateElScorpioZipWireSlide(elScorpio);
  assert.equal(slide.sliding, true);
  assert.equal(elScorpio.onZipWire, true);

  const cut = sector.severZipWireWithSmartDisc(elScorpio);
  assert.equal(cut.severed, true);
  assert.equal(cut.scorpioPlunged, true);
  assert.equal(elScorpio.health, 0);
});

test('Chantier 4 (v158): FrenchVoyageurCampfireBearTrapBaitSector investigates thermal bait, snaps steel jaws and forces them open with brute strength', () => {
  const sector = new FrenchVoyageurCampfireBearTrapBaitSector();
  const bait = sector.approachCampfireThermalBait();
  assert.equal(bait.campfireActive, true);

  const feral = { health: 220 };
  const step = sector.triggerBearTrapStep(feral);
  assert.equal(step.triggered, true);
  assert.equal(feral.snaredInBearTrap, true);
  assert.equal(feral.health, 165);

  const pry = sector.pryOpenSteelJawsWithBruteStrength(feral);
  assert.equal(pry.freed, true);
  assert.equal(feral.snaredInBearTrap, false);
});

test('Chantier 5 (v158): SuperPredatorCampClassicTiedTotemDuelSector severs electrified cables to liberate Classic Predator for titan duel', () => {
  const sector = new SuperPredatorCampClassicTiedTotemDuelSector();
  const classic = { health: 240 };
  const berserker = { health: 320 };

  const lib = sector.severElectrifiedTotemCables(classic);
  assert.equal(lib.classicLiberated, true);
  assert.equal(classic.wristbladesExtended, true);

  const duel = sector.engageBerserkerTitanDuel(classic, berserker);
  assert.equal(duel.duelInProgress, true);
  assert.equal(duel.duelRound, 1);
  assert.ok(classic.health < 240);
  assert.ok(berserker.health < 320);
});

test('Chantier 6 + Audit Humain QA #1 (v158): HumanQaRadialWeaponWheelTacticalSlowdownDirector applies bullet-time slowdown and 8-slot angular selection', () => {
  const director = new HumanQaRadialWeaponWheelTacticalSlowdownDirector();
  const open = director.openWeaponWheel();
  assert.equal(open.wheelOpen, true);
  assert.equal(open.timeScale, 0.2);

  // 90 deg -> slot 2 (smart_disc)
  const aim = director.pointSelectorVector(90);
  assert.equal(aim.slotIndex, 2);
  assert.equal(aim.selectedWeapon, 'smart_disc');

  const close = director.confirmWeaponSelection();
  assert.equal(close.wheelOpen, false);
  assert.equal(close.timeScale, 1.0);
  assert.equal(close.equippedWeapon, 'smart_disc');

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('.weapon-wheel-modal'));
  assert.ok(cssContent.includes('.weapon-wheel-segment'));
});

test('Chantier 7 + Audit Humain QA #2 (v158): AudioSynthesizer computes granular foliage rustle and plasma overdrive harmonic distortion with 15 v158 SFX', () => {
  const foliage = audioSynth.computeGranularFoliageRustleParameters(6.0, 0.9);
  assert.ok(foliage.grainDensityPerSec > 50);
  assert.ok(foliage.foliageFilterCutoffHz > 2500);

  const overdrive = audioSynth.computePlasmaOverdriveHarmonicDistortion(1.2, 0.8);
  assert.equal(overdrive.overdriveActive, true);
  assert.ok(overdrive.harmonicWarmthGain > 0.3);

  const v158SfxMethods = [
    'playObservatoryDishAlignmentBeep',
    'playFugitiveRecallBeaconLaserHum',
    'playPneumaticPistonWallSqueezeRumble',
    'playStoneSpikeFloorThrustClack',
    'playElScorpioPenthouseZipWireZing',
    'playRooftopEmergencyStairGrateThud',
    'playBearTrapSteelJawSnappingCrash',
    'playVoyageurCampfireEmbersCrackle',
    'playClassicTotemElectrifiedCableSnap',
    'playBerserkerVsClassicClawDuelRoar',
    'playWeaponWheelRadialSlotTick',
    'playWeaponWheelBulletTimeWhoosh',
    'playElectrostaticIonDischargeSizzle',
    'playCrossBladesGuardBreakDeflectRing',
    'playDihedralCornerAntiJamNudgeHum'
  ];

  for (const method of v158SfxMethods) {
    assert.equal(typeof audioSynth[method], 'function');
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 + Audit Humain QA #3 (v158): HumanQaDiegeticElectrostaticDischargeAndCoilSmokeAuditor calculates coil smoke and ion field cloak disruption', () => {
  const auditor = new HumanQaDiegeticElectrostaticDischargeAndCoilSmokeAuditor();
  const smoke = auditor.evaluatePlasmacasterCoilSmoke(4, 0.1);
  assert.equal(smoke.coilSmoking, true);
  assert.ok(smoke.stealthPenalty > 0.1);

  const ion = auditor.evaluateElectrostaticIonField(0.75, { cloakActive: true });
  assert.equal(ion.ionSparksActive, true);
  assert.equal(ion.cloakDisrupted, true);
  assert.equal(ion.stealthCompromised, true);
});

test('Chantier 9 + Audit Humain QA #4 (v158): HumanQaGameplayLedgeHangCancelAndTailParryAuditor handles ledge drop-hang and cross-blades guard-break tail parry', () => {
  const auditor = new HumanQaGameplayLedgeHangCancelAndTailParryAuditor();
  const hunter = {};
  const drop = auditor.initiateLedgeHangDropDown(hunter, 7.5);
  assert.equal(drop.hangingFromLedge, true);
  assert.equal(drop.effectiveDropHeightMeters, 5.1);
  assert.equal(drop.fallDamageAvoided, true);

  const parrySuccess = auditor.evaluateXenomorphTailWhipParry({ damage: 60 }, 0.08);
  assert.equal(parrySuccess.crossParrySuccessful, true);
  assert.equal(parrySuccess.guardBreakApplied, true);
  assert.equal(parrySuccess.acidSplashPrevented, true);
  assert.equal(parrySuccess.damageTaken, 0);

  const parryFail = auditor.evaluateXenomorphTailWhipParry({ damage: 60 }, 0.35);
  assert.equal(parryFail.crossParrySuccessful, false);
  assert.equal(parryFail.damageTaken, 60);
});

test('Chantier 10 + Audit Humain QA #5 (v158): HumanQaLevelDesignCoverPillarSpacingAndDihedralAngleAuditor checks pillar spacing and nudges out of acute dihedral corners', () => {
  const auditor = new HumanQaLevelDesignCoverPillarSpacingAndDihedralAngleAuditor();
  const pillars = [
    { id: 'p1', x: 0, z: 0 },
    { id: 'p2', x: 0.8, z: 0.2 }, // Spacing 0.82 < 1.3
    { id: 'p3', x: 4.0, z: 4.0 }
  ];
  const audit = auditor.auditPillarsClearanceAndSpacing(pillars);
  assert.equal(audit.navigableCorridorsValid, false);
  assert.equal(audit.spacingViolationsCount, 1);

  const acuteCorner = auditor.resolveDihedralCornerNudge({ x: 2.0, z: 2.0 }, { interiorAngleDeg: 45, outwardNormalX: 1, outwardNormalZ: 1 });
  assert.equal(acuteCorner.trappedInAcuteCorner, true);
  assert.equal(acuteCorner.nudgeApplied, true);
  assert.ok(acuteCorner.nudgedPosition.x > 2.0);
});
