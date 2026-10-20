import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { GunnisonHospitalRooftopHelipadPredalienShowdownSector } from '../src/gameplay/GunnisonHospitalRooftopHelipadPredalienShowdownSector.js';
import { BoneBoneyardTrackerHellHoundFlushRavineSector } from '../src/gameplay/BoneBoneyardTrackerHellHoundFlushRavineSector.js';
import { SlaughterhouseSwingingBeefCarcassCryoRailSector } from '../src/gameplay/SlaughterhouseSwingingBeefCarcassCryoRailSector.js';
import { GreatPlainsQuicksandBogBioMaskLaserTrapSector } from '../src/gameplay/GreatPlainsQuicksandBogBioMaskLaserTrapSector.js';
import { ValVerdeScorpionLaserSightMacSilenceStandOffSector } from '../src/gameplay/ValVerdeScorpionLaserSightMacSilenceStandOffSector.js';
import { HumanQaPeripheralThreatArcAndPoiPromptDirector } from '../src/gameplay/HumanQaPeripheralThreatArcAndPoiPromptDirector.js';
import { HumanQaDiegeticWristGauntletBloodLeakAuditor } from '../src/gameplay/HumanQaDiegeticWristGauntletBloodLeakAuditor.js';
import { HumanQaGameplayMeleeMagnetismAndExecutionShieldAuditor } from '../src/gameplay/HumanQaGameplayMeleeMagnetismAndExecutionShieldAuditor.js';
import { HumanQaLevelDesignJumpArcHeadroomAndCameraAuditor } from '../src/gameplay/HumanQaLevelDesignJumpArcHeadroomAndCameraAuditor.js';

test('Chantier 1 (v156): GunnisonHospitalRooftopHelipadPredalienShowdownSector unmasks Wolf for honor brawl and resolves mutual impale', () => {
  const sector = new GunnisonHospitalRooftopHelipadPredalienShowdownSector();
  const wolf = { bioMaskEquipped: true };
  const brawl = sector.initiateUnmaskedHonorBrawl(wolf);
  assert.equal(brawl.wolfUnmasked, true);
  assert.equal(wolf.bioMaskEquipped, false);

  const predalien = { health: 250 };
  const finale = sector.executeMutualFatalGrappleAndAirStrike(predalien);
  assert.equal(finale.mutualImpaleLocked, true);
  assert.equal(finale.predalienEliminated, true);
  assert.equal(finale.rooftopVaporizedByStrike, true);
});

test('Chantier 2 (v156): BoneBoneyardTrackerHellHoundFlushRavineSector flushes prey with Hell-Hounds and fires rotary plasma salvo', () => {
  const sector = new BoneBoneyardTrackerHellHoundFlushRavineSector();
  const prey = { inCover: true, health: 180 };
  const flush = sector.commandHellHoundPackFlush(prey);
  assert.equal(flush.preyFlushedFromCover, true);
  assert.equal(prey.inCover, false);

  const salvo = sector.fireTrackerHeavyRotaryPlasmaSalvo(prey);
  assert.equal(salvo.salvoFired, true);
  assert.equal(salvo.damageDealt, 140);
  assert.equal(prey.health, 40);
});

test('Chantier 3 (v156): SlaughterhouseSwingingBeefCarcassCryoRailSector absorbs incoming fire with swinging frozen beef carcasses', () => {
  const sector = new SlaughterhouseSwingingBeefCarcassCryoRailSector();
  const res = sector.absorbIncomingFireWithFrozenCarcass({ damage: 75 });
  assert.equal(res.interceptedByCarcass, true);
  assert.equal(res.damageToHunterBehindCarcass, 0);
  assert.equal(res.blockedDamage, 75);
});

test('Chantier 4 (v156): GreatPlainsQuicksandBogBioMaskLaserTrapSector sinks heavy combatant and redirects guided bolt via decoy mask', () => {
  const sector = new GreatPlainsQuicksandBogBioMaskLaserTrapSector();
  const feral = { massKg: 220, health: 200 };
  sector.struggleInQuicksandBog(feral);
  const sink2 = sector.struggleInQuicksandBog(feral);
  assert.equal(sink2.immobilizedInBog, true);

  const strike = sector.fireGuidedBoltUnderDecoyMaskLock(feral);
  assert.equal(strike.homingRedirectedByDecoyMask, true);
  assert.equal(strike.feralDefeatedByOwnTech, true);
});

test('Chantier 5 (v156): ValVerdeScorpionLaserSightMacSilenceStandOffSector flushes squad with wild boar decoy and locks triad on forehead', () => {
  const sector = new ValVerdeScorpionLaserSightMacSilenceStandOffSector();
  const squad = [{ id: 'mac' }, { id: 'dillon' }];
  const boar = sector.triggerWildBoarBrushDecoy(squad);
  assert.equal(boar.boarFlushed, true);
  assert.equal(squad[0].revealedByPanicFire, true);

  const strike = sector.executePointBlankForeheadTriadStrike(squad[0]);
  assert.equal(strike.pointBlankPlasmaExecuted, true);
  assert.equal(squad[0].health, 0);
});

test('Chantier 6 + Audit Humain QA #1 (v156): HumanQaPeripheralThreatArcAndPoiPromptDirector computes 360 threat arc rotation and POI pill', () => {
  const director = new HumanQaPeripheralThreatArcAndPoiPromptDirector();
  const arc = director.computeThreatArcIndicator(Math.PI, 'CRITICAL');
  assert.equal(arc.rotationDeg, 180);
  assert.equal(arc.quadrant, 'REAR_BLINDSPOT');

  const pill = director.formatPoiInteractionPill('Râtelier Speargun', 1.64, 3.0);
  assert.equal(pill.withinRange, true);
  assert.ok(pill.pillText.includes('1.6m'));

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('.peripheral-threat-arc'));
  assert.ok(cssContent.includes('.poi-interaction-pill'));
});

test('Chantier 7 + Audit Humain QA #2 (v156): AudioSynthesizer computes distance attenuation, micro-pitch jitter, and exposes 15 v156 SFX', () => {
  const nearGain = audioSynth.computeDistanceAttenuationGain(0.6, 5, 5, 1.0);
  const farGain = audioSynth.computeDistanceAttenuationGain(0.6, 25, 5, 1.0);
  assert.ok(nearGain > farGain);

  const lowPitch = audioSynth.computeMicroPitchJitter(440, 0.05, 0.0);
  const highPitch = audioSynth.computeMicroPitchJitter(440, 0.05, 1.0);
  assert.notEqual(lowPitch, highPitch);

  const v156SfxMethods = [
    'playWolfRooftopUnmaskingGauntletClick',
    'playPredalienRooftopMutualImpaleRoar',
    'playGunnisonF22TacticalStrikeShockwave',
    'playTrackerBoneyardHoundWhistleCall',
    'playBoneyardRotaryPlasmaSalvoBoom',
    'playFrozenCarcassMeatHookChainSwing',
    'playQuicksandBogSuctionSinkGurgle',
    'playPreyBioMaskTriadSelfHomingBoltStrike',
    'playValVerdeNightBrushBoarDecoyRustle',
    'playPeripheralThreatArcWarningPing',
    'playMicroPitchAntiMachineGunCalibrationTick',
    'playWristGauntletLuminescentBloodLeakBeep',
    'playSoftMeleeMagnetismLungeWhoosh',
    'playTrophyExecutionHyperArmorPulse',
    'playCameraSpringArmAntiClipSlide'
  ];

  for (const methodName of v156SfxMethods) {
    assert.equal(typeof audioSynth[methodName], 'function');
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});

test('Chantier 8 + Audit Humain QA #3 (v156): HumanQaDiegeticWristGauntletBloodLeakAuditor flags luminescent blood leak until cauterized', () => {
  const auditor = new HumanQaDiegeticWristGauntletBloodLeakAuditor();
  const wounded = auditor.evaluateLuminescentBloodTrailState({ health: 42, cauterizedWithMedikit: false });
  assert.equal(wounded.bleedingLuminescentGreen, true);
  assert.equal(wounded.cloakStealthEffectiveness, 0.45);

  const cauterized = auditor.evaluateLuminescentBloodTrailState({ health: 42, cauterizedWithMedikit: true });
  assert.equal(cauterized.bleedingLuminescentGreen, false);
  assert.equal(cauterized.cloakStealthEffectiveness, 1.0);
});

test('Chantier 9 + Audit Humain QA #4 (v156): HumanQaGameplayMeleeMagnetismAndExecutionShieldAuditor assists close melee lunge and shields trophy execution', () => {
  const auditor = new HumanQaGameplayMeleeMagnetismAndExecutionShieldAuditor();
  const lunge = auditor.evaluateSoftMeleeLungeAssist({ distanceToTargetMeters: 1.8, angleOffsetDegrees: 14 });
  assert.equal(lunge.magnetismApplied, true);
  assert.equal(lunge.hitGuaranteed, true);

  const shield = auditor.mitigateDamageDuringTrophyExecution(60);
  assert.equal(shield.hyperArmorActive, true);
  assert.equal(shield.damageTaken, 9);
});

test('Chantier 10 + Audit Humain QA #5 (v156): HumanQaLevelDesignJumpArcHeadroomAndCameraAuditor prevents jump head-bonk and camera wall clipping', () => {
  const auditor = new HumanQaLevelDesignJumpArcHeadroomAndCameraAuditor();
  const arc = auditor.computeSafeJumpArcApex(5.5, 4.0);
  assert.equal(arc.headBonkPrevented, true);
  assert.equal(arc.adjustedApexHeightMeters, 3.35);

  const cam = auditor.resolveCameraWallCollision(1.9);
  assert.equal(cam.wallClippingPrevented, true);
  assert.equal(cam.clampedCameraDistanceMeters, 1.65);
});
