import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { BouvetoyaPyramidSelfDestructSequenceSector } from '../src/gameplay/BouvetoyaPyramidSelfDestructSequenceSector.js';
import { MeatLockerBeefCarcassConcealmentSector } from '../src/gameplay/MeatLockerBeefCarcassConcealmentSector.js';
import { GunnisonHospitalQueenHiveBioluminescenceSector } from '../src/gameplay/GunnisonHospitalQueenHiveBioluminescenceSector.js';
import { ComancheHighGrassLuminescentBloodTrackingSector } from '../src/gameplay/ComancheHighGrassLuminescentBloodTrackingSector.js';
import { StargazerGeneticHybridationPodSector } from '../src/gameplay/StargazerGeneticHybridationPodSector.js';
import { HumanQaYautjaVocalizationAndEmoteWheelDirector } from '../src/gameplay/HumanQaYautjaVocalizationAndEmoteWheelDirector.js';
import { HumanQaDiegeticMedicompCauterizationTremorAuditor } from '../src/gameplay/HumanQaDiegeticMedicompCauterizationTremorAuditor.js';
import { HumanQaGameplaySmartDiscProjectileInterceptionAuditor } from '../src/gameplay/HumanQaGameplaySmartDiscProjectileInterceptionAuditor.js';
import { HumanQaLevelDesignAtmosphericWindVectorAuditor } from '../src/gameplay/HumanQaLevelDesignAtmosphericWindVectorAuditor.js';

test('Chantier 1 (v161): BouvetoyaPyramidSelfDestructSequenceSector arms core, ticks fusion ramp, and manages escape sprint', () => {
  const sector = new BouvetoyaPyramidSelfDestructSequenceSector({
    countdownSeconds: 60.0,
    tunnelLengthMeters: 180.0
  });

  const arm = sector.armThermonuclearCore('YAUTJA-HONOR-COUNTDOWN-DELTA');
  assert.equal(arm.success, true);
  assert.equal(sector.isArmed, true);

  const tick = sector.tickCountdown(15.0);
  assert.equal(tick.countdownSeconds, 45.0);
  assert.ok(tick.microFusionCoreKelvin > 3500);
  assert.ok(tick.seismicTremorIntensity > 0);

  const sprint = sector.calculateEscapeSprintProgress(8.0, 10.0, 1);
  assert.ok(sprint.distanceEscapedMeters > 50);
  assert.equal(sprint.reachedSurfaceElevator, false);

  // Complete escape sprint to surface
  sector.calculateEscapeSprintProgress(15.0, 10.0, 0);
  const det = sector.triggerFinalThermonuclearDetonation();
  assert.equal(det.detonated, true);
  assert.equal(det.escapedAlive, true);
  assert.equal(det.blastYieldKilotons, 300);
});

test('Chantier 2 (v161): MeatLockerBeefCarcassConcealmentSector handles carcass swaying misdirection, thermal cover, and conveyor rails', () => {
  const sector = new MeatLockerBeefCarcassConcealmentSector({
    carcassCount: 28,
    refrigerationTempCelsius: -15.0
  });

  const bump = sector.bumpFrozenCarcass(3, 300);
  assert.equal(bump.success, true);
  assert.ok(bump.swayAngleDeg > 15);
  assert.ok(bump.soundDb > 60);
  assert.ok(bump.aiDistractionRadiusMeters > 15);

  const cover = sector.takeConcealmentBehindCarcass(3, 310.15);
  assert.equal(cover.concealed, true);
  assert.ok(cover.apparentThermalSignatureKelvin < 275.0);
  assert.equal(cover.owlFScannerThermalBypass, true);

  const conveyor = sector.toggleConveyorRail(true, 1.2);
  assert.equal(conveyor.conveyorRailActive, true);
  assert.equal(conveyor.conveyorSpeedMps, 1.2);
});

test('Chantier 3 (v161): GunnisonHospitalQueenHiveBioluminescenceSector triggers ovimorph egg hatching and dissolves resin walls', () => {
  const sector = new GunnisonHospitalQueenHiveBioluminescenceSector({
    ovimorphEggCount: 12,
    resinWallIntegrity: 1.0
  });

  // Egg out of range
  const far = sector.approachOvimorphEgg(0, 4.0);
  assert.equal(far.triggered, false);

  // Close approach triggers split
  const close = sector.approachOvimorphEgg(0, 1.8);
  assert.equal(close.triggered, true);
  assert.equal(close.petalsOpened, true);
  assert.equal(close.facehuggerEjected, true);

  // Dissolve resin wall with solvent
  const dissolve = sector.dissolveResinWall(60.0);
  assert.equal(dissolve.dissolved, true);
  assert.equal(dissolve.breached, true);
  assert.equal(sector.resinDissolved, true);

  // Spore hazard check
  const spore = sector.evaluateSporeHazard(3.0, false);
  assert.equal(spore.hazardActive, true);
  assert.ok(spore.toxicDamage > 0);
  assert.equal(spore.sporeInhalationRisk, true);
});

test('Chantier 4 (v161): ComancheHighGrassLuminescentBloodTrackingSector scans UV blood trails, evaluates crouching stealth, and grass fire', () => {
  const sector = new ComancheHighGrassLuminescentBloodTrackingSector({
    grassHeightM: 1.6,
    windSpeedMps: 6.5
  });

  const opticalScan = sector.scanEmeraldBloodTrails('OPTICAL');
  assert.equal(opticalScan.bloodTrailDiscovered, false);

  const uvScan = sector.scanEmeraldBloodTrails('ULTRAVIOLET');
  assert.equal(uvScan.bloodTrailDiscovered, true);
  assert.equal(uvScan.glowColorHex, '#00ff66');
  assert.ok(uvScan.stainsCount > 0);

  const stalk = sector.stalkInHighGrass(true, 1.5);
  assert.equal(stalk.concealed, true);
  assert.ok(stalk.stealthBonus > 0.8);
  assert.equal(stalk.canPounceAmbush, true);

  const fire = sector.igniteGrassFire(0, { x: 2, z: 0 }, 4.0);
  assert.equal(fire.grassFireActive, true);
  assert.ok(fire.burntAreaM2 > 50);
});

test('Chantier 5 (v161): StargazerGeneticHybridationPodSector drains cryo fluid, splices transgenic mutagen, and extracts upgrade canister', () => {
  const sector = new StargazerGeneticHybridationPodSector({
    cryoFluidFilled: true,
    sampleIntegrity: 0.95
  });

  const drain = sector.drainCryoFluidVessel(80.0, 6.0);
  assert.equal(drain.drained, true);
  assert.equal(drain.podHatchUnlocked, true);
  assert.equal(sector.cryoFluidFilled, false);

  const splice = sector.synthesizeTransgenicMutagen('YAUTJA_PRIME', 'XENOMORPH_XX121');
  assert.equal(splice.success, true);
  assert.equal(splice.canisterSynthesized, true);
  assert.ok(splice.splicingCompatibilityScore > 0.8);

  const extract = sector.extractMutagenCanister();
  assert.equal(extract.success, true);
  assert.equal(extract.inventoryCategory, 'TRANSGENIC_UPGRADE_SERUM');
  assert.equal(extract.harvestedItem.chitinExoskeletonBoostPercentage, 45);
});

test('Chantier 6 & Audit QA #1 (v161): HumanQaYautjaVocalizationAndEmoteWheelDirector opens radial wheel and triggers vocalisations', () => {
  const director = new HumanQaYautjaVocalizationAndEmoteWheelDirector();

  const open = director.openEmoteWheel();
  assert.equal(open.isOpen, true);
  assert.equal(open.timeScale, 0.25);

  // Angle 60 deg -> VICTORY_ROAR (30 to 90)
  const selectRoar = director.selectEmoteSlice(60);
  assert.equal(selectRoar.selectedEmote.id, 'VICTORY_ROAR');

  const trigger = director.triggerVocalization();
  assert.equal(trigger.success, true);
  assert.equal(trigger.emoteId, 'VICTORY_ROAR');
  assert.equal(director.isOpen, false);

  // Mandible chatter check
  const mandible = director.triggerVocalization('MANDIBLE_CLICK_CHATTER');
  assert.equal(mandible.success, true);
  assert.equal(mandible.audioMethodName, 'playYautjaMandibleClickingChatter');

  const hud = director.getEmoteWheelHudState();
  assert.equal(hud.emotes.length, 6);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.yautja-emote-wheel-container'));
  assert.ok(css.includes('.emote-slice'));
});

test('Chantier 7 & Audit QA #2 (v161): AudioSynthesizer computes Doppler acoustic shifts, enclosed space reverb, and implements 15 v161 procedural audio methods', () => {
  const doppler = audioSynth.computeDopplerShiftAcousticParameters(45.0, 0.0, 480);
  assert.equal(doppler.baseFrequencyHz, 480);
  assert.ok(doppler.approachingFrequencyHz > doppler.baseFrequencyHz);
  assert.ok(doppler.recedingFrequencyHz < doppler.baseFrequencyHz);
  assert.ok(doppler.pitchShiftFactor > 1.2);

  const reverb = audioSynth.computeEnclosedSpacePlasmaReverb(650.0, 0.85);
  assert.equal(reverb.roomVolumeM3, 650.0);
  assert.ok(reverb.sabineReverbTimeSec > 1.0);
  assert.ok(reverb.earlyReflectionDelayMs > 20);

  // Verify all 15 methods are callable without throw
  assert.doesNotThrow(() => audioSynth.playYautjaSelfDestructCountdownChime());
  assert.doesNotThrow(() => audioSynth.playThermonuclearMicroFusionCoreRamp());
  assert.doesNotThrow(() => audioSynth.playMeatLockerCarcassImpactThud());
  assert.doesNotThrow(() => audioSynth.playColdStorageHookRattleGlide());
  assert.doesNotThrow(() => audioSynth.playQueenHiveResinPulsationHum());
  assert.doesNotThrow(() => audioSynth.playOvimorphEggSacSplitHiss());
  assert.doesNotThrow(() => audioSynth.playTallGrassWindSwayRustle());
  assert.doesNotThrow(() => audioSynth.playLuminescentBloodVisorShimmer());
  assert.doesNotThrow(() => audioSynth.playGeneticCleanroomHybridationWhir());
  assert.doesNotThrow(() => audioSynth.playCryoFluidPodDrainGush());
  assert.doesNotThrow(() => audioSynth.playYautjaMandibleClickingChatter());
  assert.doesNotThrow(() => audioSynth.playMedicompCauterizationSizzleSnap());
  assert.doesNotThrow(() => audioSynth.playMedicompAgonyGroanResonance());
  assert.doesNotThrow(() => audioSynth.playSmartDiscDeflectionClang());
  assert.doesNotThrow(() => audioSynth.playAtmosphericWindShearHowl());
});

test('Chantier 8 & Audit QA #3 (v161): HumanQaDiegeticMedicompCauterizationTremorAuditor models surgical cauterization, hand tremors, and agony vignette', () => {
  const auditor = new HumanQaDiegeticMedicompCauterizationTremorAuditor({
    cauterizerBurnerCelsius: 650.0,
    agonyDurationSec: 2.2
  });

  const surgery = auditor.initiateMedicompSelfSurgery(2);
  assert.equal(surgery.inSurgery, true);
  assert.equal(surgery.agonyVignetteActive, true);
  assert.ok(auditor.getAimTremorOffsetDeg() > 0);

  const tick1 = auditor.processCauterizationTick(1.0);
  assert.equal(tick1.inSurgery, true);
  assert.ok(tick1.healthRecoveredTotal > 0);

  // Complete surgery
  const tick2 = auditor.processCauterizationTick(4.0);
  assert.equal(tick2.completed, true);
  assert.equal(tick2.inSurgery, false);
  assert.equal(auditor.getAimTremorOffsetDeg(), 0.0);

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.medicomp-agony-vignette'));
  assert.ok(css.includes('medicomp-pain-pulse'));
});

test('Chantier 9 & Audit QA #4 (v161): HumanQaGameplaySmartDiscProjectileInterceptionAuditor evaluates CPA trajectories and deflects rockets in flight', () => {
  const auditor = new HumanQaGameplaySmartDiscProjectileInterceptionAuditor({
    interceptionRadiusMeters: 1.2
  });

  const discPos = { x: 10, y: 5, z: 20 };
  const discVel = { x: 0, y: 0, z: -30 }; // Flying towards -Z
  const projPos = { x: 10.5, y: 5, z: 0 };
  const projVel = { x: 0, y: 0, z: 40 }; // Flying towards +Z

  const interception = auditor.evaluateProjectileInterception(discPos, discVel, projPos, projVel);
  assert.equal(interception.willIntercept, true);
  assert.ok(interception.closestDistanceMeters <= 1.2);

  const deflection = auditor.executeMidAirDeflection('rpg-rocket-01', 'RPG_ROCKET');
  assert.equal(deflection.success, true);
  assert.equal(deflection.detonationOccurred, true);
  assert.equal(deflection.deflectionAction, 'PREMATURE_AIRBURST_DETONATION');
  assert.equal(auditor.successfulDeflections, 1);
});

test('Chantier 10 & Audit QA #5 (v161): HumanQaLevelDesignAtmosphericWindVectorAuditor computes crosswind ballistic drift and smoke advection', () => {
  const auditor = new HumanQaLevelDesignAtmosphericWindVectorAuditor({
    windSpeedMps: 8.5,
    windHeadingDeg: 90.0 // Pure eastward wind (+X)
  });

  assert.equal(auditor.windVector.x, 8.5);
  assert.equal(auditor.windVector.z, 0.0);

  // Arrow mass 0.08kg flying for 0.8s
  const drift = auditor.computeBallisticWindDrift(0.08, 0.002, { x: 0, y: 0, z: 50 }, 0.8);
  assert.ok(drift.driftDisplacement.x > 0);
  assert.equal(drift.driftDisplacement.z, 0);
  assert.ok(drift.totalDriftMagnitudeMeters > 0);

  // Smoke plume dispersal
  const smoke = auditor.computeSmokeCloudDispersal({ x: 0, y: 0, z: 0 }, 3.0);
  assert.ok(smoke.plumeCentroid.x > 0);
  assert.ok(smoke.dispersionRadiusMeters > 2.5);

  const hud = auditor.getWindHudTelemetry();
  assert.equal(hud.windSpeedMps, 8.5);
  assert.ok(hud.arrowTransformCss.includes('90deg'));

  const css = fs.readFileSync('src/style.css', 'utf-8');
  assert.ok(css.includes('.wind-vector-hud-indicator'));
});
