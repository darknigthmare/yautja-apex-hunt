import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { BouvetoyaOilDrillingRigInfernoSector } from '../src/gameplay/BouvetoyaOilDrillingRigInfernoSector.js';
import { LosAngelesStormRooftopLightningCombistickSector } from '../src/gameplay/LosAngelesStormRooftopLightningCombistickSector.js';
import { BerserkerShipwreckPlasmaBarrierSector } from '../src/gameplay/BerserkerShipwreckPlasmaBarrierSector.js';
import { ComancheBogQuicksandEscapeSector } from '../src/gameplay/ComancheBogQuicksandEscapeSector.js';
import { StargazerDecontaminationAirlockSector } from '../src/gameplay/StargazerDecontaminationAirlockSector.js';
import { HumanQaAdaptivePlasmaLeadCrosshairDirector } from '../src/gameplay/HumanQaAdaptivePlasmaLeadCrosshairDirector.js';
import { HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor } from '../src/gameplay/HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor.js';
import { HumanQaGameplayGroundTechRecoveryRollAuditor } from '../src/gameplay/HumanQaGameplayGroundTechRecoveryRollAuditor.js';
import { HumanQaLevelDesignPotentiallyVisibleSetAuditor } from '../src/gameplay/HumanQaLevelDesignPotentiallyVisibleSetAuditor.js';

test('Chantier 1 (v160): BouvetoyaOilDrillingRigInfernoSector manages crude oil slicks, pressure bleed, BLEVE blowout and catwalk collapse', () => {
  const sector = new BouvetoyaOilDrillingRigInfernoSector({
    crudeOilSlickAreas: 3,
    ambientTempCelsius: -28.0,
    tankPressureBar: 68.0
  });

  const ignite = sector.igniteOilSlick(0);
  assert.equal(ignite.success, true);
  assert.ok(ignite.ambientTempCelsius > -28.0);
  assert.ok(ignite.smokeOcclusionLevel > 0);

  const bleed = sector.bleedTankPressure(0.5);
  assert.equal(bleed.success, true);
  assert.ok(bleed.currentPressureBar < ignite.tankPressureBar);

  const slip = sector.calculateSlickSlipHazard(5.5);
  assert.equal(slip.requiresBalanceCheck, true);
  assert.ok(slip.slipProbability > 0.5);

  const explosion = sector.evaluateBlowoutExplosion(150);
  assert.equal(explosion.occurred, true);
  assert.equal(explosion.catwalkCollapsed, true);
  assert.ok(explosion.peakOverpressureKpa > 150);
});

test('Chantier 2 (v160): LosAngelesStormRooftopLightningCombistickSector triggers gargoyle strikes, Combistick lightning charging, and rain cloak flicker', () => {
  const sector = new LosAngelesStormRooftopLightningCombistickSector({
    stormIntensity: 0.85,
    lightningRodGargoyles: 4
  });

  const strike = sector.triggerAtmosphericLightningStrike(1);
  assert.equal(strike.success, true);
  assert.ok(strike.voltageMegavolts > 100);
  assert.ok(strike.peakCurrentKiloAmps > 20);

  const charge = sector.raiseCombistickToSky(true, 2.5);
  assert.equal(charge.charged, true);
  assert.equal(charge.electrifiedAttacksUnlocked, true);
  assert.ok(charge.plasmaOverchargeJoules > 4000);

  const rainFlicker = sector.evaluateRainCamouflageFlicker(75);
  assert.equal(rainFlicker.waterDropletOutlineVisible, true);
  assert.ok(rainFlicker.cloakRefractionInterference > 0.5);
});

test('Chantier 3 (v160): BerserkerShipwreckPlasmaBarrierSector blocks biological passage, allows optical hacking, and capacitor Smart Disc destruction', () => {
  const sector = new BerserkerShipwreckPlasmaBarrierSector({
    barrierActive: true,
    generatorCapacitorHealth: 300
  });

  const entity = { health: 100 };
  const passageBlocked = sector.evaluateBarrierPassage(entity);
  assert.equal(passageBlocked.passed, false);
  assert.equal(passageBlocked.disintegrated, true);
  assert.equal(entity.health, 0);

  const discStrike = sector.strikeGeneratorCapacitor('SMART_DISC', 100);
  assert.equal(discStrike.destroyed, false);
  assert.ok(discStrike.generatorCapacitorHealth < 300);

  // Optical visor hack completion
  sector.attemptOpticalFrequencyHack('TECH_SCANNER', 2.0);
  const hackFinal = sector.attemptOpticalFrequencyHack('TECH_SCANNER', 2.0);
  assert.equal(hackFinal.hacked, true);
  assert.equal(hackFinal.barrierActive, false);

  const entity2 = { health: 100 };
  const safePassage = sector.evaluateBarrierPassage(entity2);
  assert.equal(safePassage.passed, true);
  assert.equal(safePassage.damageTaken, 0);
  assert.equal(entity2.health, 100);
});

test('Chantier 4 (v160): ComancheBogQuicksandEscapeSector simulates non-Newtonian quicksand sinking, harpoon tether winch, and mud thermal insulation', () => {
  const sector = new ComancheBogQuicksandEscapeSector({
    quicksandDepthM: 2.4,
    hunterSinkDepthM: 0.0
  });

  const sink = sector.updateQuicksandSinking(160, 0.8, 3.0);
  assert.ok(sink.hunterSinkDepthM > 0.1);
  assert.ok(sink.mobilityPenalty > 0);

  const tether = sector.fireWinchHarpoon(0);
  assert.equal(tether.success, true);
  assert.equal(tether.winchReady, true);

  const winch = sector.engageWinchTether(8000, 2.0);
  assert.equal(winch.success, true);
  assert.ok(winch.extractedDistanceM > 0);

  // Deep sink mud insulation check
  sector.hunterSinkDepthM = 1.0;
  const mudBenefit = sector.evaluateMudAblationBenefit();
  assert.equal(mudBenefit.mudCoatingActive, true);
  assert.equal(mudBenefit.infraredSignatureInvisible, true);
  assert.ok(mudBenefit.thermalEmissivityReduction > 0.8);
});

test('Chantier 5 (v160): StargazerDecontaminationAirlockSector handles sterilizing neurotoxin cycles, door hacking, turret destruction, and mask filtering', () => {
  const sector = new StargazerDecontaminationAirlockSector({
    blastDoorSealed: true,
    gasVaporActive: false
  });

  const decon = sector.cycleDecontaminationProtocol('NEUROTOXIN_AEROSOL_ST-4', 2.0);
  assert.equal(decon.gasVaporActive, true);
  assert.ok(decon.gasConcentrationPpm > 100);

  // Mask filters gas completely
  const maskedToxin = sector.evaluateToxinExposure(2.0, true);
  assert.equal(maskedToxin.affected, false);
  assert.equal(maskedToxin.maskFiltrationActive, true);

  // Unmasked exposure takes damage
  const unmaskedToxin = sector.evaluateToxinExposure(2.0, false);
  assert.equal(unmaskedToxin.affected, true);
  assert.ok(unmaskedToxin.totalDamage > 0);

  const turretKill = sector.neutralizeCeilingTurret(160);
  assert.equal(turretKill.destroyed, true);
  assert.equal(turretKill.turretOnline, false);

  const breach = sector.hackBlastDoorOverride('STARGAZER-DOOR-BREACH-01');
  assert.equal(breach.success, true);
  assert.equal(breach.blastDoorSealed, false);
});

test('Chantier 6 & Audit QA #1 (v160): HumanQaAdaptivePlasmaLeadCrosshairDirector computes dynamic ballistic lead and locks target', () => {
  const director = new HumanQaAdaptivePlasmaLeadCrosshairDirector({
    plasmaProjectileSpeedMps: 65.0,
    angularLockThresholdDeg: 4.0
  });

  const hunterPos = { x: 0, y: 0, z: 0 };
  const targetPos = { x: 30, y: 0, z: 40 }; // 50m away
  const targetVel = { x: 12, y: 0, z: 0 }; // Moving right at 12 m/s

  const lead = director.computeLeadPoint(targetPos, targetVel, hunterPos);
  assert.ok(lead.flightTimeSeconds > 0.7);
  assert.ok(lead.leadPoint.x > targetPos.x); // Aimed ahead of moving target

  // Aiming directly at the lead point unlocks lead lock
  const aimVector = {
    x: lead.leadPoint.x - hunterPos.x,
    y: lead.leadPoint.y - hunterPos.y,
    z: lead.leadPoint.z - hunterPos.z
  };
  const tracking = director.updateTargetTracking('hound-alpha-01', targetPos, targetVel, hunterPos, aimVector);
  assert.equal(tracking.isLeadLocked, true);
  assert.ok(tracking.angularDeviationDeg <= 4.0);

  const hud = director.getCrosshairHudPayload();
  assert.equal(hud.isLeadLocked, true);
  assert.ok(hud.cssClass.includes('lead-locked'));

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.plasma-lead-crosshair'));
  assert.ok(css.includes('.lead-locked'));
});

test('Chantier 7 & Audit QA #2 (v160): AudioSynthesizer computes canyon flutter echo, acoustic occlusion, and implements 15 v160 procedural audio methods', () => {
  const echo = audioSynth.computeCanyonAcousticEchoDelayParameters(85.0, 0.12);
  assert.equal(echo.canyonWidthMeters, 85.0);
  assert.ok(echo.firstEchoDelayMs > 450);
  assert.ok(echo.echoReflectivity > 0.8);

  const occlusion = audioSynth.computeObstacleAcousticOcclusion(1.2, 2400.0);
  assert.equal(occlusion.obstacleThicknessMeters, 1.2);
  assert.ok(occlusion.acousticMassLawAttenuationDb > 30);
  assert.ok(occlusion.lowpassCutoffFrequencyHz < 1500);

  // Verify all 15 methods are callable without throw
  assert.doesNotThrow(() => audioSynth.playOilRigInfernoRumble());
  assert.doesNotThrow(() => audioSynth.playHydrocarbonTankPressureBleedHiss());
  assert.doesNotThrow(() => audioSynth.playLosAngelesLightningThunderCrack());
  assert.doesNotThrow(() => audioSynth.playCombistickLightningChargeHum());
  assert.doesNotThrow(() => audioSynth.playBerserkerShipIonBarrierHum());
  assert.doesNotThrow(() => audioSynth.playPlasmaBarrierDisruptionPop());
  assert.doesNotThrow(() => audioSynth.playComancheQuicksandSuctionGurgle());
  assert.doesNotThrow(() => audioSynth.playHarpoonTetherWinchZip());
  assert.doesNotThrow(() => audioSynth.playStargazerDeconGasSprayHiss());
  assert.doesNotThrow(() => audioSynth.playAirlockPressureSealClampClang());
  assert.doesNotThrow(() => audioSynth.playPlasmaLeadLockAcquiredBeep());
  assert.doesNotThrow(() => audioSynth.playCanyonFlutterEchoReverb());
  assert.doesNotThrow(() => audioSynth.playBioMaskLensCrackingSnap());
  assert.doesNotThrow(() => audioSynth.playAcidEtchVisorSizzle());
  assert.doesNotThrow(() => audioSynth.playGroundTechRollWhoosh());
});

test('Chantier 8 & Audit QA #3 (v160): HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor handles acid etching, kinetic fractures, and visor wipes', () => {
  const auditor = new HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor({
    lensIntegrityPercentage: 100.0,
    acidEtchPercentage: 0.0
  });

  const acid = auditor.applyAcidSplash(30.0, -12.0);
  assert.equal(acid.acidBurningActive, true);
  assert.ok(acid.acidEtchPercentage > 15.0);
  assert.ok(auditor.getHudDisruptionLevel() > 0);

  const impact = auditor.applyKineticImpact(500);
  assert.equal(impact.fractureCount, 1);
  assert.ok(impact.lensIntegrityPercentage < 100.0);

  const wipe = auditor.wipeVisorLens(true);
  assert.equal(wipe.wiped, true);
  assert.equal(wipe.acidBurningActive, false);
  assert.ok(wipe.acidEtchPercentage < acid.acidEtchPercentage);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.mask-lens-crack-overlay'));
  assert.ok(css.includes('.acid-etch-corrosion'));
});

test('Chantier 9 & Audit QA #4 (v160): HumanQaGameplayGroundTechRecoveryRollAuditor executes Ground Tech timing window with i-frames and evasive vector', () => {
  const auditor = new HumanQaGameplayGroundTechRecoveryRollAuditor({
    techWindowMs: 300,
    invulnerabilityDurationMs: 250
  });

  const now = Date.now();
  const kd = auditor.startKnockdownState(4500, 400);
  assert.equal(kd.isKnockedDown, true);

  // Timing: 50ms after floor contact
  const roll = auditor.attemptTechRecoveryRoll(kd.groundTouchTimestampMs + 50, { x: 1, z: 0 });
  assert.equal(roll.success, true);
  assert.equal(roll.quality, 'PERFECT_TECH');
  assert.equal(roll.riposteWindowOpen, true);
  assert.ok(roll.trajectory.x > 0);

  assert.equal(auditor.isInvulnerable(kd.groundTouchTimestampMs + 100), true);
  assert.equal(auditor.isInvulnerable(kd.groundTouchTimestampMs + 600), false);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.ground-tech-recovery-indicator'));
});

test('Chantier 10 & Audit QA #5 (v160): HumanQaLevelDesignPotentiallyVisibleSetAuditor registers spatial cells, culls portals, and respects draw call budget', () => {
  const auditor = new HumanQaLevelDesignPotentiallyVisibleSetAuditor({
    maxDrawCallBudget: 300
  });

  auditor.registerCell('JUNGLE_SURFACE', null, [
    { targetCellId: 'PYRAMID_ENTRANCE', portalOpen: true, portalNormal: { x: 0, y: 0, z: 1 } }
  ], 50);

  auditor.registerCell('PYRAMID_ENTRANCE', null, [
    { targetCellId: 'JUNGLE_SURFACE', portalOpen: true, portalNormal: { x: 0, y: 0, z: -1 } },
    { targetCellId: 'SACRIFICIAL_CHAMBER', portalOpen: true, portalNormal: { x: 0, y: 0, z: 1 } },
    { targetCellId: 'HIDDEN_SARCOPHAGUS', portalOpen: false, portalNormal: { x: 1, y: 0, z: 0 } } // Closed portal
  ], 60);

  auditor.registerCell('SACRIFICIAL_CHAMBER', null, [], 75);
  auditor.registerCell('HIDDEN_SARCOPHAGUS', null, [], 40);
  auditor.registerCell('DEEP_HIVE_QUEEN_ROOM', null, [], 90); // Unlinked deep room

  const pvs = auditor.computePotentiallyVisibleSet('JUNGLE_SURFACE', { x: 0, y: 0, z: 1 });
  assert.equal(pvs.success, true);
  assert.equal(pvs.visibleCells.includes('JUNGLE_SURFACE'), true);
  assert.equal(pvs.visibleCells.includes('PYRAMID_ENTRANCE'), true);
  assert.equal(pvs.visibleCells.includes('SACRIFICIAL_CHAMBER'), true);
  assert.equal(pvs.visibleCells.includes('HIDDEN_SARCOPHAGUS'), false); // Portal closed
  assert.equal(pvs.visibleCells.includes('DEEP_HIVE_QUEEN_ROOM'), false); // Completely unlinked

  assert.equal(pvs.withinBudget, true);
  assert.ok(pvs.totalDrawCallsEstimated <= 300);
  assert.equal(pvs.culledCellCount, 2);
});
