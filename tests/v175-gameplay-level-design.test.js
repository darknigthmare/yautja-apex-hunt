import test from 'node:test';
import assert from 'node:assert/strict';

import { ValVerdeCircadianDayNightCycleSector } from '../src/gameplay/ValVerdeCircadianDayNightCycleSector.js';
import { ValVerdePredatorVocalMimicrySpatialSector } from '../src/gameplay/ValVerdePredatorVocalMimicrySpatialSector.js';
import { ValVerdeDiegeticLensMudSplatterSector } from '../src/gameplay/ValVerdeDiegeticLensMudSplatterSector.js';
import { ValVerdeDutchPrimitiveMedicineSector } from '../src/gameplay/ValVerdeDutchPrimitiveMedicineSector.js';
import { ValVerdeAerialVineTraverseSector } from '../src/gameplay/ValVerdeAerialVineTraverseSector.js';
import { ValVerdeReedBreathingSwampStealthSector } from '../src/gameplay/ValVerdeReedBreathingSwampStealthSector.js';
import { ValVerdeScorchedCraterFalloutSector } from '../src/gameplay/ValVerdeScorchedCraterFalloutSector.js';
import { HumanQaValVerdeCircadianVocalHUDDirector } from '../src/gameplay/HumanQaValVerdeCircadianVocalHUDDirector.js';
import { HumanQaValVerdeCircadianMimicryAuditor } from '../src/gameplay/HumanQaValVerdeCircadianMimicryAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v175 Chantier LD 1: ValVerdeCircadianDayNightCycleSector evaluates midday scorch vs deep night thermal contrast and bio-mask acquisition', () => {
  const sector = new ValVerdeCircadianDayNightCycleSector({ initialHour: 12.0 });

  // Midday evaluation (low thermal contrast against 36°C foliage)
  const midday = sector.setTimeOfDay(14.0);
  assert.equal(midday.phase, 'MIDDAY_SCORCH');
  assert.ok(midday.ambientTempC >= 34.0);
  assert.ok(midday.thermalContrastDeltaC < 5.0);

  // Deep night evaluation (high thermal contrast against 21°C ambient)
  const night = sector.setTimeOfDay(22.0);
  assert.equal(night.phase, 'DEEP_NIGHT');
  assert.ok(night.ambientTempC <= 25.0);
  assert.ok(night.thermalContrastDeltaC > 10.0);
  assert.equal(night.luminescentBloodVisualClarityPct, 100);

  // Bio-mask targeting check
  const bioMaskNight = sector.evaluateBioMaskVisibility(30.0, false);
  assert.equal(bioMaskNight.targetAcquired, true);

  const bioMaskMud = sector.evaluateBioMaskVisibility(30.0, true);
  assert.equal(bioMaskMud.targetAcquired, false);
  assert.equal(bioMaskMud.reason, 'COLD_MUD_SIGNATURE_MATCHES_COLD_FOLIAGE');
});

test('v175 Chantier LD 2: ValVerdePredatorVocalMimicrySpatialSector handles 3D canopy vocal mimicry, leaf attenuation, and human investigation', () => {
  const sector = new ValVerdePredatorVocalMimicrySpatialSector({ canopySpeakerElevationM: 18.0 });
  assert.equal(sector.recordedClips.length, 5);

  // Broadcast 'Over here' from the trees
  const broadcast = sector.broadcastMimicryVoice('MIMIC_OVER_HERE', 22.0, 45.0);
  assert.equal(broadcast.clipId, 'MIMIC_OVER_HERE');
  assert.equal(broadcast.transcript, 'Over here... over here...');
  assert.equal(broadcast.speaker, 'Sergeant Mac Eliot');
  assert.ok(broadcast.receivedSplDb >= 35.0);
  assert.equal(broadcast.elevationM, 18.0);

  // Listener investigation check
  const investigation = sector.evaluateListenerInvestigation(50);
  assert.equal(investigation.investigated, true);
  assert.equal(investigation.targetExposedFlank, true);
});

test('v175 Chantier LD 3: ValVerdeDiegeticLensMudSplatterSector tracks multi-droplet lens obstruction, drying, and river washing', () => {
  const sector = new ValVerdeDiegeticLensMudSplatterSector({ maxObstructionPct: 40.0 });
  assert.equal(sector.lensState, 'CLEAN');

  // Trigger blast splatter
  const splatter = sector.triggerMudSplatter(0.8);
  assert.equal(splatter.success, true);
  assert.ok(splatter.dropletsAdded >= 5);
  assert.ok(sector.totalObstructionPct > 0 && sector.totalObstructionPct <= 40.0);
  assert.equal(sector.lensState, 'MUD_SPLATTERED');

  // Drying over 25 seconds
  const drying = sector.updateDryingLifecycle(25.0, 32.0);
  assert.ok(drying.totalActiveDroplets > 0);

  // Wash lens clean
  const wash = sector.washLensClean();
  assert.equal(wash.success, true);
  assert.equal(wash.lensState, 'CLEAN');
  assert.equal(sector.totalObstructionPct, 0);
});

test('v175 Chantier LD 4: ValVerdeDutchPrimitiveMedicineSector heats blade, cauterizes wounds, stops thermal trail, and applies tourniquet', () => {
  const sector = new ValVerdeDutchPrimitiveMedicineSector();
  assert.equal(sector.openBleedingWoundsCount, 2);
  assert.equal(sector.bloodTrailActive, true);

  // Heat machete blade
  const heating = sector.heatMacheteBladeOverFire(8.0);
  assert.equal(heating.success, true);
  assert.ok(heating.macheteHeatedTempC >= 500);
  assert.equal(heating.readyToCauterize, true);

  // Cauterize wound
  const cauterize = sector.cauterizeWoundWithHotBlade();
  assert.equal(cauterize.success, true);
  assert.equal(cauterize.healthRestored, 25);
  assert.equal(cauterize.hemorrhageHalted, true);
  assert.equal(cauterize.suppressedPainGruntAcousticDb, 62);

  // Apply grapevine tourniquet
  const tourniquet = sector.applyGrapevineTourniquet();
  assert.equal(tourniquet.success, true);
  assert.equal(tourniquet.staminaRecoveryRestoredPct, 80);
});

test('v175 Chantier LD 5: ValVerdeAerialVineTraverseSector computes pendulum dynamics, chasm crossing, and buttress root landing', () => {
  const sector = new ValVerdeAerialVineTraverseSector({ vineLengthM: 12.0, chasmWidthM: 15.5 });

  // Compute swing dynamics
  const swing = sector.computeVineSwingDynamics(42.0, 105.0);
  assert.ok(swing.maxTangentialSpeedMps >= 6.5);
  assert.ok(swing.maxTensionLoadN >= 1300);
  assert.equal(swing.successfullyCrossed, true);

  // Resolve landing
  const cleanLanding = sector.resolveVineLanding(0.05);
  assert.equal(cleanLanding.cleanLanding, true);
  assert.equal(cleanLanding.landingTarget, 'MOSSY_KAPOK_BUTTRESS_ROOT');
  assert.equal(cleanLanding.stealthMaintained, true);

  const missedLanding = sector.resolveVineLanding(0.35);
  assert.equal(missedLanding.cleanLanding, false);
});

test('v175 Chantier LD 6: ValVerdeReedBreathingSwampStealthSector models 100% IR occlusion, oxygen endurance, and surface breach ambush', () => {
  const sector = new ValVerdeReedBreathingSwampStealthSector({ waterDepthM: 1.4, waterTempC: 18.0 });

  // Submerge with hollow reed
  const submerge = sector.submergeWithHollowReed();
  assert.equal(submerge.success, true);
  assert.equal(submerge.thermalInvisibilityScore, 100);
  assert.equal(submerge.opticalConcealmentScore, 100);
  assert.equal(submerge.maxOxygenDurationSec, 90.0);

  // Update submersion with controlled breathing
  const state = sector.updateSubmersionState(30.0, true);
  assert.equal(state.isSubmerged, true);
  assert.equal(state.surfaceRipplesGenerated, false);
  assert.equal(state.remainingOxygenSec, 60.0);

  // Surprise vertical breach ambush
  const breach = sector.breachWaterSurfaceAmbush();
  assert.equal(breach.success, true);
  assert.equal(breach.surpriseAttackMultiplier, 3.0);
  assert.equal(breach.hunterCaughtOffGuard, true);
});

test('v175 Chantier LD 7: ValVerdeScorchedCraterFalloutSector models thermal noise, bio-mask blinding, and vitrified crust traverse', () => {
  const sector = new ValVerdeScorchedCraterFalloutSector({ craterRadiusM: 35.0, epicenterTempC: 480.0 });

  // Thermal noise at 10m from ground zero
  const thermalNear = sector.evaluateCraterThermalNoise(10.0);
  assert.ok(thermalNear.localSurfaceTempC >= 180.0);
  assert.equal(thermalNear.bioMaskOverloadWhiteout, true);
  assert.equal(thermalNear.thermalTrackingImpossible, true);
  assert.equal(thermalNear.vitrifiedGlassFulguritePresent, true);

  // Traverse vitrified crust at steady speed
  const footing = sector.traverseVitrifiedCrust(2.2);
  assert.equal(footing.success, true);
  assert.equal(footing.footingStable, true);
  assert.equal(footing.brittleCrustBreakRisk, false);
});

test('v175 Chantier LD 8: HumanQaValVerdeCircadianVocalHUDDirector runs 5 QA audits, computes circadian HUD themes, and mounts widget', () => {
  const director = new HumanQaValVerdeCircadianVocalHUDDirector();

  // Evaluate 5 QA audits
  const qa = director.evaluate5CircadianMimicryAudits();
  assert.equal(qa.auditsCount, 5);
  assert.equal(qa.allPassed, true);
  assert.ok(qa.compositeUXScore >= 98.0);

  // Circadian HUD theme
  const nightTheme = director.computeCircadianHUDTheme('DEEP_NIGHT');
  assert.equal(nightTheme.highContrastMode, true);
  assert.equal(nightTheme.hudBorderColor, '#00ff88');

  // Mount HUD
  const mount = director.mountCircadianHUD();
  assert.equal(mount.mounted, true);
  assert.equal(mount.widgetClass, 'valverde-circadian-vocal-hud');
});

test('v175 Chantier LD 9: AudioSynthesizer computes circadian jungle & mimicry acoustics and exposes 15 new SFX methods', () => {
  // Test nocturnal acoustics
  const nightAcoustics = audioSynth.computeCircadianNocturnalJungleAcoustics(22.0, 90.0, 85.0);
  assert.ok(nightAcoustics.cicadaCarrierFreqHz > 5000);
  assert.ok(nightAcoustics.speedOfSoundMps >= 340);

  // Test mimicry acoustics
  const mimicAcoustics = audioSynth.computePredatorVocalMimicryAcoustics('MIMIC_OVER_HERE', 18.0, 6.5);
  assert.ok(mimicAcoustics.elevationParallaxMs > 0);
  assert.equal(mimicAcoustics.bioMaskDigitalChirpFreqHz, 3850);

  // Verify all 15 SFX methods
  const v175Sfx = [
    'playCicadasTropicalDuskChorus',
    'playPredatorMimicryOverHere',
    'playPredatorMimicryTurnAround',
    'playPredatorMimicryAnytime',
    'playMudSplatterOnLensHit',
    'playMudDryingCrustCrack',
    'playHotBladeCauterizationSizzle',
    'playDutchPainGruntSuppress',
    'playVineSwingAirWhoosh',
    'playVineReleaseBranchCatch',
    'playHollowReedSubmergedBubbles',
    'playReedSurfaceBreathingGasp',
    'playGlassifiedCraterSandCrunch',
    'playThermalHotspotRadiationHiss',
    'playNightWindCanopyChime'
  ];

  for (const sfx of v175Sfx) {
    assert.equal(typeof audioSynth[sfx], 'function', `Method ${sfx} must exist`);
    assert.doesNotThrow(() => audioSynth[sfx](), `Method ${sfx} must execute without throwing`);
  }
});

test('v175 Chantier LD 10: HumanQaValVerdeCircadianMimicryAuditor audits circadian, mimicry, lens mud splatter, and generates consolidated report', () => {
  const auditor = new HumanQaValVerdeCircadianMimicryAuditor();

  // Audit circadian thermal calibration
  const circadianAudit = auditor.auditCircadianThermalCalibration({ phase: 'DEEP_NIGHT', thermalContrastDeltaC: 16.0, bioMaskThermalAcquisitionMultiplier: 3.0 });
  assert.equal(circadianAudit.passes, true);

  // Audit vocal mimicry dispersion
  const mimicryAudit = auditor.auditVocalMimicryDispersion({ clipId: 'MIMIC_OVER_HERE', receivedSplDb: 52.0, disorientationScore: 88 });
  assert.equal(mimicryAudit.passes, true);

  // Audit lens mud splatter limits
  const splatterAudit = auditor.auditLensMudSplatterReadability({ totalObstructionPct: 25.0, lensState: 'MUD_SPLATTERED' });
  assert.equal(splatterAudit.passes, true);

  // Consolidated report
  const report = auditor.generateConsolidatedCircadianReport();
  assert.equal(report.totalAuditsExecuted, 3);
  assert.equal(report.passedCount, 3);
  assert.equal(report.compliancePct, 100);
});
