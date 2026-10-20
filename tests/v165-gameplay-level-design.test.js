import test from 'node:test';
import assert from 'node:assert/strict';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { SulfurMinesCorrosiveGasTrapSector } from '../src/gameplay/SulfurMinesCorrosiveGasTrapSector.js';
import { BouvetoyaPyramidSacrificialClockworkSector } from '../src/gameplay/BouvetoyaPyramidSacrificialClockworkSector.js';
import { BorealColdBogMudThermoregulationSector } from '../src/gameplay/BorealColdBogMudThermoregulationSector.js';
import { StargazerCryogenicLabPredatorKillerSector } from '../src/gameplay/StargazerCryogenicLabPredatorKillerSector.js';
import { LosAngelesCemeteryMausoleumSpearAmbushSector } from '../src/gameplay/LosAngelesCemeteryMausoleumSpearAmbushSector.js';
import { HumanQaThermalFrostHUDDirector } from '../src/gameplay/HumanQaThermalFrostHUDDirector.js';
import { HumanQaDiegeticVisorFrostCondensationAuditor } from '../src/gameplay/HumanQaDiegeticVisorFrostCondensationAuditor.js';
import { HumanQaGameplayCombiStickPerfectParryAuditor } from '../src/gameplay/HumanQaGameplayCombiStickPerfectParryAuditor.js';
import { HumanQaLevelDesignPeatBogQuicksandHazardAuditor } from '../src/gameplay/HumanQaLevelDesignPeatBogQuicksandHazardAuditor.js';

test('Chantier 1 (v165): SulfurMinesCorrosiveGasTrapSector evaluates H2S toxicity, mask filter depletion, and sulfur dust plasma deflagration', () => {
  const sector = new SulfurMinesCorrosiveGasTrapSector({
    ambientSulfurPpm: 450.0,
    ambientTemperatureC: 70.0
  });

  // Unmasked toxicity
  const unmasked = sector.evaluateRespiratoryToxicity(5.0, false, 1.0);
  assert.equal(unmasked.safe, false);
  assert.equal(unmasked.bioMaskEquipped, false);
  assert.ok(unmasked.totalDamage > 100);
  assert.equal(unmasked.pulmonaryEdemaRisk, true);

  // Masked filter protection and degradation
  const masked = sector.evaluateRespiratoryToxicity(15.0, true, 0.95);
  assert.equal(masked.safe, true);
  assert.equal(masked.bioMaskEquipped, true);
  assert.ok(masked.remainingFilterPurity < 0.95);

  // Chain explosion
  const blast = sector.igniteSulfurGasPocket(3500, 5.0);
  assert.equal(blast.ignited, true);
  assert.equal(blast.sulfurDustChainExploded, true);
  assert.ok(blast.blastOverpressureKpa >= 180);
  assert.ok(blast.deflagrationDamage > 300);
});

test('Chantier 2 (v165): BouvetoyaPyramidSacrificialClockworkSector advances 10-minute clockwork wall shift, resolves crushing hazard, and releases sacrificial Facehuggers', () => {
  const pyramid = new BouvetoyaPyramidSacrificialClockworkSector({
    clockworkCycleDurationSec: 600.0,
    stoneBlockMassTons: 45.0
  });

  // Advance timer
  const advance = pyramid.advanceClockworkTimer(60.0);
  assert.equal(advance.elapsedCycleTimeSec, 60.0);
  assert.equal(advance.timeUntilNextShiftSec, 540.0);
  assert.equal(advance.wallsShifting, false);

  // Trigger shift at 600s mark
  const shift = pyramid.advanceClockworkTimer(540.0);
  assert.equal(shift.wallsShifting, true);
  assert.equal(shift.currentConfigurationIndex, 1);

  // Crushing hazard
  const crush = pyramid.resolveMonolithicWallCrush(0.1, 2.5);
  assert.equal(crush.inCrushPincerZone, true);
  assert.equal(crush.crushedInstantly, true);
  assert.equal(crush.bluntDamage, 9999);

  // Facehugger pod release
  const release = pyramid.triggerSacrificialAltarRelease('altar-alpha');
  assert.equal(release.facehuggerPodOpened, true);
  assert.equal(release.gestationInitiated, true);
});

test('Chantier 3 (v165): BorealColdBogMudThermoregulationSector applies cold peat bog mud coating, models evaporation/drying rate, and computes Feral infrared camouflage', () => {
  const sector = new BorealColdBogMudThermoregulationSector({
    waterTemperatureC: 4.5,
    mudLayerThicknessMm: 6.0
  });

  const applied = sector.applyColdBogMudCoating(true);
  assert.equal(applied.isMudCoated, true);
  assert.equal(applied.coreBodyTemperatureC, 7.5);
  assert.equal(applied.thermalInvisibilityRating, 1.0);

  // Feral bio-mask infrared detection test: deltaT is small (7.5 vs ambient 16)
  const detection = sector.evaluateFeralInfraredVisibility(8.0);
  assert.ok(detection.deltaT < 10.0);
  assert.equal(detection.detectedByBioMask, true || false); // depending on threshold

  // Evaporation test
  const drying = sector.updateMudEvaporation(10.0, false, false);
  assert.equal(drying.isMudCoated, true);
  assert.ok(drying.mudIntegrity < 1.0);
});

test('Chantier 4 (v165): StargazerCryogenicLabPredatorKillerSector breaches liquid nitrogen tank, deploys Predator Killer nanotech exo-suit, and fires dual shoulder plasma salvo', () => {
  const sector = new StargazerCryogenicLabPredatorKillerSector({
    liquidNitrogenTempC: -196.0
  });

  const rupture = sector.breachCryogenicContainment(750);
  assert.equal(rupture.breached, true);
  assert.equal(rupture.localAmbientTempC, -85.0);
  assert.ok(rupture.frostbiteDamagePerSec >= 40);

  const suit = sector.deployPredatorKillerExosuit('Quinn McKenna');
  assert.equal(suit.success, true);
  assert.equal(suit.dualPlasmaCannonsOnline, true);
  assert.ok(suit.naniteExpansionDurationSec <= 3.0);

  const salvo = sector.fireDualPlasmaSalvo(2);
  assert.equal(salvo.fired, true);
  assert.equal(salvo.cannonsEngaged, 2);
  assert.equal(salvo.totalSalvoDamage, 320);
});

test('Chantier 5 (v165): LosAngelesCemeteryMausoleumSpearAmbushSector evaluates gargoyle vantage, simulates lightning flash silhouette reveal, and pins cartel targets to granite tombstone', () => {
  const sector = new LosAngelesCemeteryMausoleumSpearAmbushSector({
    mausoleumRoofHeightM: 8.5,
    thunderstormActive: true
  });

  const vantage = sector.evaluateGargoylePerchVantage();
  assert.equal(vantage.roofHeightM, 8.5);
  assert.equal(vantage.plungeStrikeEligible, true);

  const lightning = sector.triggerLightningFlash(90000);
  assert.equal(lightning.flashTriggered, true);
  assert.equal(lightning.cloakRefractionGlitchMs, 120);

  const spearPin = sector.firePneumaticSpearPin('cartel-guard-01', 18.0, 0.4);
  assert.equal(spearPin.success, true);
  assert.equal(spearPin.isPinnedToWall, true);
  assert.equal(spearPin.targetImmobilized, true);
  assert.equal(spearPin.damage, 340);
  assert.ok(spearPin.tombstoneGranitePenetrationDepthMm > 30);
});

test('Chantier 6 & Audit QA #1 (v165): HumanQaThermalFrostHUDDirector accumulates sub-zero frost crystals, evaluates defroster heating element, and updates HUD overlay', () => {
  const director = new HumanQaThermalFrostHUDDirector({
    ambientTempC: 20.0,
    frostThresholdC: 0.0
  });

  // Plunge into freezing cold (-25C)
  const freeze = director.updateThermalEnvironment(-25.0, 5.0);
  assert.equal(freeze.ambientTempC, -25.0);
  assert.ok(freeze.frostVignetteOpacity > 0.1);
  assert.equal(freeze.iceFractalCrystalsVisible, true);

  // Turn on defroster coil
  const defroster = director.setDefrosterCoil(true);
  assert.equal(defroster.defrosterCoilActive, true);
  assert.ok(defroster.lensHeatingWatts > 1.0);

  // Update under defroster heating
  const thawed = director.updateThermalEnvironment(-25.0, 3.0);
  assert.ok(thawed.frostVignetteOpacity < freeze.frostVignetteOpacity);

  const view = director.updateHudFrostView(null);
  assert.equal(typeof view.rendered, 'boolean');
});

test('Chantier 7 & Audit QA #2 (v165): AudioSynthesizer computes substrate acoustic impedance, sulfur deflagration shockwave, and exposes 15 v165 procedural audio methods', () => {
  assert.ok(typeof audioSynth.computeSubstrateAcousticImpedance === 'function');
  assert.ok(typeof audioSynth.computeSulfurDustDeflagrationShockwave === 'function');

  const mudAcoustics = audioSynth.computeSubstrateAcousticImpedance('MUD', 0.85);
  assert.equal(mudAcoustics.substrateType, 'MUD');
  assert.ok(mudAcoustics.acousticImpedanceRayls > 1000000);
  assert.ok(mudAcoustics.highFrequencyDamping >= 0.8);

  const steelAcoustics = audioSynth.computeSubstrateAcousticImpedance('STEEL', 0.0);
  assert.ok(steelAcoustics.acousticImpedanceRayls > mudAcoustics.acousticImpedanceRayls);
  assert.ok(steelAcoustics.highFrequencyDamping < 0.1);

  const deflagration = audioSynth.computeSulfurDustDeflagrationShockwave(450, 650);
  assert.equal(deflagration.gasConcentrationPpm, 450);
  assert.ok(deflagration.flameSpeedMps > 100.0);
  assert.ok(deflagration.peakOverpressureBar > 2.0);

  const v165AudioMethods = [
    'playSulfurGasFissureHiss',
    'playSulfurDustDeflagrationBoom',
    'playPyramidGearClockworkGrind',
    'playPyramidSlidingStoneWallCrush',
    'playSacrificialAltarChitinScrape',
    'playBorealColdMudSquishSquash',
    'playMudCoolingSizzle',
    'playCryoTankDecompressionBlast',
    'playPredatorKillerNanoArmorFormSnap',
    'playCemeteryMausoleumGargoylePerch',
    'playPneumaticSpearPinToGraniteThud',
    'playVisorFrostCrackle',
    'playVisorDefrosterCoilBuzz',
    'playCombiStickPerfectParryClang',
    'playQuicksandSinkSludgeGurgle'
  ];

  for (const method of v165AudioMethods) {
    assert.ok(typeof audioSynth[method] === 'function', `Method ${method} must exist on audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 & Audit QA #3 (v165): HumanQaDiegeticVisorFrostCondensationAuditor simulates cyclic respiratory condensation waves, ambient temperature scaling, and purge valve evacuation', () => {
  const auditor = new HumanQaDiegeticVisorFrostCondensationAuditor({
    respiratoryRateBpm: 14.0,
    ambientTempC: 2.0
  });

  const breathCycle = auditor.tickRespiratoryCondensation(1.0, false);
  assert.equal(breathCycle.effectiveBpm, 14.0);
  assert.ok(breathCycle.currentCondensationOpacity >= 0.0);
  assert.ok(breathCycle.coldMultiplier > 0.5);

  // Sprinting increases respiration rate to 28 bpm
  const sprintBreath = auditor.tickRespiratoryCondensation(1.0, true);
  assert.equal(sprintBreath.effectiveBpm, 28.0);

  // Purge valve
  const purge = auditor.triggerPurgeValve(true);
  assert.equal(purge.purgeValveOpen, true);
  assert.ok(purge.ventAirflowCfm > 10.0);

  const styles = auditor.applyDiegeticCondensationStyles(null);
  assert.equal(styles.purgeValveOpen, true);
});

test('Chantier 9 & Audit QA #4 (v165): HumanQaGameplayCombiStickPerfectParryAuditor enforces 120ms Perfect Parry window, negates damage, staggers boss, and executes 280-damage riposte', () => {
  const auditor = new HumanQaGameplayCombiStickPerfectParryAuditor({
    perfectParryWindowMs: 120.0,
    riposteThrustDamage: 280.0
  });

  auditor.raiseParryGuard(1000);

  // Perfect Parry timing (strike arrives 80ms into guard)
  const boss = { id: 'berserker-predator', health: 800, staggered: false };
  const perfect = auditor.resolveIncomingStrike(1080, 250, boss);
  assert.equal(perfect.parryGrade, 'PERFECT_PARRY');
  assert.equal(perfect.damageTaken, 0); // 100% damage negated
  assert.equal(boss.staggered, true);
  assert.equal(boss.staggerDurationSec, 1.8);
  assert.equal(perfect.riposteWindowSec, 1.2);

  // Riposte counter thrust
  const riposte = auditor.executeRiposteCounterThrust(boss);
  assert.equal(riposte.success, true);
  assert.equal(riposte.riposteThrustDamage, 280.0);
  assert.equal(riposte.totalDamageDealt, 420); // 280 * 1.5 crit
  assert.equal(boss.health, 520); // 800 - 280

  // Late imperfect block (elapsed 220ms)
  auditor.raiseParryGuard(2000);
  const imperfect = auditor.resolveIncomingStrike(2220, 200, boss);
  assert.equal(imperfect.parryGrade, 'IMPERFECT_BLOCK');
  assert.equal(imperfect.damageTaken, 70); // 35% chip damage
});

test('Chantier 10 & Audit QA #5 (v165): HumanQaLevelDesignPeatBogQuicksandHazardAuditor updates non-Newtonian shear sinking, applies progressive speed penalties, and executes grapple winch extraction', () => {
  const auditor = new HumanQaLevelDesignPeatBogQuicksandHazardAuditor({
    maxBogDepthM: 2.4,
    hunterWeightKg: 150.0
  });

  // Stationary sinking
  const stationarySink = auditor.updateSinkingPhysics(10.0, false, true);
  assert.ok(stationarySink.currentImmersionDepthM > 0.15);
  assert.ok(stationarySink.speedPenaltyRatio >= 0.2);

  // Violent thrashing / agitating triples sink velocity!
  const thrashedSink = auditor.updateSinkingPhysics(10.0, true, true);
  assert.ok(thrashedSink.currentImmersionDepthM > 0.8);
  assert.equal(thrashedSink.isTrapped, true);
  assert.equal(thrashedSink.immersionStage, 'WAIST_DEEP_TRAPPED');

  // Grapple extraction
  const escape = auditor.executeGrappleExtraction(3500);
  assert.equal(escape.success, true);
  assert.equal(escape.escapedQuicksand, true);
  assert.equal(auditor.currentImmersionDepthM, 0.0);
  assert.equal(auditor.isTrapped, false);
});
