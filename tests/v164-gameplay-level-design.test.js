import test from 'node:test';
import assert from 'node:assert/strict';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { ValVerdeWaterfallCliffPlungeSector } from '../src/gameplay/ValVerdeWaterfallCliffPlungeSector.js';
import { AncientShipTrophyCryptSanctuarySector } from '../src/gameplay/AncientShipTrophyCryptSanctuarySector.js';
import { GamePreserveTrackerHoundMistSector } from '../src/gameplay/GamePreserveTrackerHoundMistSector.js';
import { ComancheSpringTrapAmbushSector } from '../src/gameplay/ComancheSpringTrapAmbushSector.js';
import { StargazerHelipadFugitiveShipPursuitSector } from '../src/gameplay/StargazerHelipadFugitiveShipPursuitSector.js';
import { HumanQaDynamicTelemetricBallisticElevationCrosshairDirector } from '../src/gameplay/HumanQaDynamicTelemetricBallisticElevationCrosshairDirector.js';
import { HumanQaDiegeticPlasmaBatteryBrownoutAuditor } from '../src/gameplay/HumanQaDiegeticPlasmaBatteryBrownoutAuditor.js';
import { HumanQaGameplayGroundTechKickFlipAuditor } from '../src/gameplay/HumanQaGameplayGroundTechKickFlipAuditor.js';
import { HumanQaLevelDesignVentilationShaftResonanceAuditor } from '../src/gameplay/HumanQaLevelDesignVentilationShaftResonanceAuditor.js';

test('Chantier 1 (v164): ValVerdeWaterfallCliffPlungeSector models freefall, water deceleration, survival threshold, and cloak electrical short-circuit', () => {
  const sector = new ValVerdeWaterfallCliffPlungeSector({
    cliffElevationM: 40.0,
    lagoonDepthM: 9.0,
    waterDecelerationMps2: 54.0
  });

  const trajectory = sector.computeFreefallTrajectory(3.5);
  assert.ok(trajectory.fallDurationSec >= 2.8);
  assert.ok(trajectory.verticalImpactVelocityMps >= 27.5);
  assert.ok(trajectory.totalImpactVelocityMps >= 27.5);

  const pencilDive = sector.resolveWaterImpact(trajectory.verticalImpactVelocityMps, 85.0);
  assert.equal(pencilDive.survived, true);
  assert.equal(pencilDive.isPencilDive, true);
  assert.equal(pencilDive.seabedImpact, false);
  assert.ok(pencilDive.penetrationDepthM < sector.lagoonDepthM);

  const cloakImmersion = sector.evaluateHunterCloakImmersion(1.5, true);
  assert.equal(cloakImmersion.cloakOperational, false);
  assert.equal(cloakImmersion.hunterCloakShortCircuited, true);
  assert.equal(cloakImmersion.electricalDischargeActive, true);
  assert.ok(cloakImmersion.sizzlingSteamBubbles > 200);

  const plasmaDet = sector.triggerCliffEdgePlasmaBlast(900);
  assert.equal(plasmaDet.plasmaBlastDetonated, true);
  assert.ok(plasmaDet.splashWaveHeightM >= 2.0);
});

test('Chantier 2 (v164): AncientShipTrophyCryptSanctuarySector manages Lost Tribe honor guard, trophy displays, and Raphael Adolini 1715 flintlock presentation', () => {
  const sanctuary = new AncientShipTrophyCryptSanctuarySector();

  assert.equal(sanctuary.lostTribeMembers.length, 9);
  const greyback = sanctuary.lostTribeMembers.find(m => m.name === 'Greyback Elder');
  assert.ok(greyback);
  assert.equal(greyback.cloaked, false);

  const trial = sanctuary.evaluateHonorCodeTrial(true, true);
  assert.equal(trial.isHonoredVictor, true);
  assert.equal(trial.verdict, 'HONORED_WARRIOR_SPARE');

  const gift = sanctuary.conferRaphaelAdoliniFlintlockPistol('Mike Harrigan');
  assert.equal(gift.success, true);
  assert.equal(gift.engravingInscription, 'Raphael Adolini 1715');
  assert.equal(gift.conferredBy, 'Elder Greyback');
  assert.equal(gift.dialogueSpoken, 'Take it.');

  const xenoTrophy = sanctuary.inspectTrophy('xeno-skull-01');
  assert.ok(xenoTrophy);
  assert.equal(xenoTrophy.species, 'Xenomorph XX121');

  const recovery = sanctuary.recoverFallenHunterAndDepart();
  assert.equal(recovery.recovered, true);
  assert.equal(recovery.corpseSubject, 'City Hunter (Predator 2)');
  assert.equal(recovery.safePassageGrantedToHuman, true);
});

test('Chantier 3 (v164): GamePreserveTrackerHoundMistSector computes mist optical attenuation, ultrasonic command whistle, and Hell-Hound charge tackle', () => {
  const sector = new GamePreserveTrackerHoundMistSector({
    mistDensity: 0.85,
    houndCount: 4,
    ultrasonicWhistleKhz: 24.5
  });

  const optics = sector.computeMistOpticalAttenuation(15.0);
  assert.ok(optics.opticalTransmissionRatio < 0.2);
  assert.equal(optics.laserBeamScattered, true);
  assert.ok(optics.triLaserDefocusAngleDeg > 1.0);

  const whistle = sector.blowUltrasonicHoundWhistle(1.0);
  assert.equal(whistle.success, true);
  assert.equal(whistle.humanAudible, false); // Inaudible to humans (> 20 kHz)
  assert.equal(whistle.houndsAlerted, 4);
  assert.equal(whistle.houndTacticalFormation, 'PINCER_ENVELOPMENT');

  const charge = sector.executeHoundCharge('hell-hound-1', 10.0);
  assert.ok(charge.kineticEnergyJoules > 10000);
  assert.ok(charge.tackleKnockdownProbability >= 0.8);

  const thornTrap = sector.checkThornWireTrapCollision(6.5, true);
  assert.equal(thornTrap.triggered, true);
  assert.equal(thornTrap.bleedingApplied, true);
});

test('Chantier 4 (v164): ComancheSpringTrapAmbushSector springs bent sapling deadfall, reels obsidian tomahawk, and redirects Feral bio-mask laser homing back to skull', () => {
  const sector = new ComancheSpringTrapAmbushSector({
    bentSaplingTensionNm: 500.0
  });

  const sapling = sector.triggerSaplingSpringDeadfall(1.2);
  assert.equal(sapling.triggered, true);
  assert.ok(sapling.impactKineticEnergyJoules > 300);
  assert.ok(sapling.tipVelocityMps > 10.0);

  const tomahawk = sector.throwAndReelTomahawk(8.0);
  assert.equal(tomahawk.success, true);
  assert.equal(tomahawk.totalComboDamage, 130);
  assert.ok(tomahawk.throwFlightTimeSec > 0);

  // Climax mechanic: baiting laser guidance towards detached mask facing Feral
  const guidance = sector.redirectBioMaskGuidance({ x: 0, y: 1.8, z: 5.0 }, { x: 0, y: 1.8, z: 5.2 });
  assert.equal(guidance.bioMaskDetached, true);
  assert.equal(guidance.isSelfInflictedLock, true);
  assert.equal(guidance.boltCurvatureArcDeg, 180);
  assert.equal(guidance.lethalSelfHeadshotGuaranteed, true);
  assert.equal(guidance.lethalDamage, 999);
});

test('Chantier 5 (v164): StargazerHelipadFugitiveShipPursuitSector calculates helicopter rotor downwash turbulence, grapple cable tensile loading, and slipstream breach', () => {
  const sector = new StargazerHelipadFugitiveShipPursuitSector({
    helicopterRotorDownwashMps: 24.0,
    shipAscentSpeedMps: 20.0
  });

  const downwash = sector.computeRotorDownwashTurbulence(5.0);
  assert.ok(downwash.effectiveDownwashSpeedMps >= 18.0);
  assert.ok(downwash.dynamicPressurePascals > 150);
  assert.ok(downwash.audioRumbleDecibels >= 90);

  const grapple = sector.launchBoardingGrappleCable(140, 18.0);
  assert.equal(grapple.success, true);
  assert.equal(grapple.cableSnapped, false);
  assert.ok(grapple.cableTensionN < grapple.cableTensileLimitN);
  assert.equal(grapple.grappleHookAttached, true);

  const breach = sector.breachForcefieldSlipstream(1350);
  assert.equal(breach.punctured, true);
  assert.ok(breach.slipstreamOpeningSec > 3.0);
});

test('Chantier 6 & Audit QA #1 (v164): HumanQaDynamicTelemetricBallisticElevationCrosshairDirector computes ballistic drop chevrons, wind deflection, and renders HUD elements', () => {
  const director = new HumanQaDynamicTelemetricBallisticElevationCrosshairDirector({
    muzzleVelocityMps: 180.0,
    crosswindSpeedMps: 5.0
  });

  const aim60m = director.computeBallisticAimCorrection(60.0);
  assert.equal(aim60m.targetRangeMeters, 60.0);
  assert.ok(aim60m.dropMeters > 0.4);
  assert.ok(aim60m.dropPixels > 40);
  assert.equal(aim60m.chevrons.length, 4);

  const view = director.updateHudReticleView(null);
  assert.equal(view.rangeM, 60.0);
  assert.equal(view.elevationDropPixels, aim60m.dropPixels);
});

test('Chantier 7 & Audit QA #2 (v164): AudioSynthesizer computes underwater cavitation, duct resonance, and exposes 15 v164 procedural audio methods', () => {
  assert.ok(typeof audioSynth.computeUnderwaterBulletCavitation === 'function');
  assert.ok(typeof audioSynth.computeNarrowVentilationLowFreqResonance === 'function');

  const cavitation = audioSynth.computeUnderwaterBulletCavitation(12.7, 850);
  assert.equal(cavitation.bulletCaliberMm, 12.7);
  assert.ok(cavitation.cavitationBubbleRadiusMm > 15.0);
  assert.ok(cavitation.bubbleCollapseFrequencyHz > 1000);
  assert.equal(cavitation.waterSpeedOfSoundMps, 1480.0);

  const resonance = audioSynth.computeNarrowVentilationLowFreqResonance(12.0, 0.64);
  assert.equal(resonance.ductLengthM, 12.0);
  assert.ok(resonance.fundamentalStandingWaveHz >= 14.0);
  assert.ok(resonance.qFactor > 2.0);

  const v164AudioMethods = [
    'playLagoonCliffPlungeSplash',
    'playWaterSubmersionCloakShortCircuit',
    'playRaphaelAdoliniFlintlockCock',
    'playRaphaelAdoliniFlintlockFire',
    'playXenomorphSkullBoneTap',
    'playTrackerUltrasonicWhistleBlast',
    'playTrackerHellHoundChargeSnarl',
    'playComancheSpringTrapSnap',
    'playObsidianTomahawkSinewReel',
    'playFeralBioMaskLaserReflectBeep',
    'playHelicopterRotorDownwashRumble',
    'playFugitiveShipForcefieldRepulsionZap',
    'playPlasmaBatteryBrownoutMicroCut',
    'playGroundTechKickFlipWhoosh',
    'playVentilationShaftDuctEchoResonance'
  ];

  for (const method of v164AudioMethods) {
    assert.ok(typeof audioSynth[method] === 'function', `Method ${method} must exist on audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 & Audit QA #3 (v164): HumanQaDiegeticPlasmaBatteryBrownoutAuditor monitors power grid drop, triggers micro-cuts, and applies CSS classes', () => {
  const auditor = new HumanQaDiegeticPlasmaBatteryBrownoutAuditor({
    batteryPercent: 100.0,
    brownoutThresholdPercent: 20.0
  });

  const nominal = auditor.updateBatteryLevel(85.0);
  assert.equal(nominal.inBrownoutState, false);
  assert.equal(nominal.laserGalvanoJitterDeg, 0.0);

  const brownout = auditor.updateBatteryLevel(12.0);
  assert.equal(brownout.inBrownoutState, true);
  assert.ok(brownout.laserGalvanoJitterDeg > 0.5);
  assert.ok(brownout.effectiveVoltageV < 24.0);

  const microCut = auditor.pollBrownoutMicroCutEvent(0.016);
  assert.ok(typeof microCut.microCutTriggered === 'boolean');

  const styles = auditor.applyDiegeticOverlayStyles(null);
  assert.equal(styles.inBrownoutState, true);
});

test('Chantier 9 & Audit QA #4 (v164): HumanQaGameplayGroundTechKickFlipAuditor enforces 180ms recovery timing window, grants i-frames, and executes heel-kick counter', () => {
  const auditor = new HumanQaGameplayGroundTechKickFlipAuditor({
    techWindowMs: 180.0,
    kickCounterRadiusM: 1.6,
    kickCounterDamage: 180.0
  });

  const kd = auditor.triggerKnockdown('EXPLOSION', 1000);
  assert.equal(kd.isKnockedDown, true);
  assert.equal(kd.techWindowMs, 180.0);

  // Late tech attempt (missed window)
  const missedAttempt = auditor.attemptGroundTechKickFlip(1250, []);
  assert.equal(missedAttempt.success, false);
  assert.equal(missedAttempt.reason, 'WINDOW_MISSED_TOO_LATE');
  assert.equal(missedAttempt.stuckInProne, true);

  // Reset and try perfect tech within window
  auditor.triggerKnockdown('HELL_HOUND_TACKLE', 2000);
  const enemies = [
    { id: 'hound-alpha', distanceM: 1.2, health: 220 },
    { id: 'distant-guard', distanceM: 4.5, health: 100 }
  ];
  const perfectTech = auditor.attemptGroundTechKickFlip(2120, enemies);
  assert.equal(perfectTech.success, true);
  assert.equal(perfectTech.techExecutedSuccessfully, true);
  assert.equal(perfectTech.proneRecoveryCancelled, true);
  assert.equal(perfectTech.enemiesStruckCount, 1);
  assert.equal(enemies[0].health, 40); // 220 - 180
  assert.equal(enemies[0].staggered, true);
});

test('Chantier 10 & Audit QA #5 (v164): HumanQaLevelDesignVentilationShaftResonanceAuditor evaluates sheet-metal standing waves, amplification vs crawl dampening, and guard alerts', () => {
  const auditor = new HumanQaLevelDesignVentilationShaftResonanceAuditor({
    ductLengthM: 15.0,
    crossSectionAreaM2: 0.64,
    wallMaterial: 'SHEET_GALVANIZED_STEEL'
  });

  const acoustics = auditor.computeDuctResonanceParameters();
  assert.equal(acoustics.ductLengthM, 15.0);
  assert.ok(acoustics.fundamentalResonanceHz > 10.0 && acoustics.fundamentalResonanceHz < 15.0);
  assert.equal(acoustics.harmonicFrequenciesHz.length, 3);
  assert.ok(acoustics.wallReflectionFactor > 0.9);

  // Sprinting inside duct creates high resonance and alerts guards
  const loudSprint = auditor.evaluateDuctLocomotionAcoustics(4.2, false);
  assert.ok(loudSprint.effectiveDecibels > 70.0);
  assert.equal(loudSprint.alertsPrey, true);
  assert.equal(loudSprint.guardAlertTriggered, true);
  assert.equal(loudSprint.stealthGrade, 'HIGH_EXPOSURE_COMPROMISED');

  // Slow stealth crawl dampens noise below detection threshold
  const stealthCrawl = auditor.evaluateDuctLocomotionAcoustics(0.9, true);
  assert.ok(stealthCrawl.effectiveDecibels < 35.0);
  assert.equal(stealthCrawl.alertsPrey, false);
  assert.equal(stealthCrawl.guardAlertTriggered, false);
  assert.equal(stealthCrawl.stealthGrade, 'GHOST_SILENT');
});
