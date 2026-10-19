import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { MothershipOrbitalThermalIceBoreBeamSector } from '../src/gameplay/MothershipOrbitalThermalIceBoreBeamSector.js';
import { XenomorphChitinSpearAndHeadShieldCraftSystem } from '../src/gameplay/XenomorphChitinSpearAndHeadShieldCraftSystem.js';
import { GamePreserveOrbitalParachuteDropPodSector } from '../src/gameplay/GamePreserveOrbitalParachuteDropPodSector.js';
import { GunnisonMunicipalPoolAquaticXenomorphAmbushSector } from '../src/gameplay/GunnisonMunicipalPoolAquaticXenomorphAmbushSector.js';
import { CelticReversibleBladeNetLauncherGrappleSystem } from '../src/gameplay/CelticReversibleBladeNetLauncherGrappleSystem.js';
import { BioMaskDiegeticHudQaSanitizer } from '../src/gameplay/BioMaskDiegeticHudQaSanitizer.js';
import { LevelDesignSpatialColliderQaAuditor } from '../src/gameplay/LevelDesignSpatialColliderQaAuditor.js';
import { KingWillieVoodooAlleyPentagramStandOffSector } from '../src/gameplay/KingWillieVoodooAlleyPentagramStandOffSector.js';
import { StargazerCryoPodFugitiveBreakoutLabSector } from '../src/gameplay/StargazerCryoPodFugitiveBreakoutLabSector.js';
import { createAcidTailWhipState, executeTailWhipSlash, updateAcidTailSystem } from '../src/gameplay/AcidTailWhipDecapitation.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v152): MothershipOrbitalThermalIceBoreBeamSector bores 600m ice shaft at 30° and enables rapid slide', () => {
  const bore = new MothershipOrbitalThermalIceBoreBeamSector();
  const obstacle = { id: 'ice_tract_rig', x: 1.0, z: 1.0, health: 200 };

  const fired = bore.fireOrbitalThermalBoreBeam([obstacle], audioSynth);
  assert.equal(fired.fired, true);
  assert.equal(fired.boredDepthMeters, 600);
  assert.equal(fired.boreAngleDegrees, 30);
  assert.equal(obstacle.health, 0);

  const hunter = { id: 'scar' };
  const slide = bore.executeRapidIceShaftSlide(hunter);
  assert.equal(slide.descended, true);
  assert.equal(hunter.reachedPyramidCourtyard, true);
});

test('Chantier 2 (v152): XenomorphChitinSpearAndHeadShieldCraftSystem crafts acid-immune spear and shield for Lex Woods', () => {
  const craft = new XenomorphChitinSpearAndHeadShieldCraftSystem();
  const lex = { id: 'lex_woods' };

  const crafted = craft.craftChitinWeaponsFromDroneCorpse({ isXenomorph: true, tailIntact: true }, lex, audioSynth);
  assert.equal(crafted.crafted, true);
  assert.equal(lex.acidCorrosionImmunity, 1.0);

  const xeno = { id: 'attacking_xeno', health: 110 };
  const counter = craft.blockAcidSprayAndCounterThrust(lex, xeno, audioSynth);
  assert.equal(counter.blocked, true);
  assert.equal(counter.acidDamageTaken, 0);
  assert.equal(counter.xenoImpaled, true);
});

test('Chantier 3 (v152): GamePreserveOrbitalParachuteDropPodSector deploys barometric parachute at 85m altitude', () => {
  const drop = new GamePreserveOrbitalParachuteDropPodSector();
  const res = drop.executeOrbitalParachuteDrop({ id: 'royce_pod', catchInBranches: true }, audioSynth);
  assert.equal(res.dropped, true);
  assert.equal(res.podRecord.openedAtAltitudeMeters, 85);
  assert.equal(drop.getStatus().deployedCanopyHangarsCount, 1);
});

test('Chantier 4 (v152): GunnisonMunicipalPoolAquaticXenomorphAmbushSector refracts underwater lasers and counters breach', () => {
  const pool = new GunnisonMunicipalPoolAquaticXenomorphAmbushSector();
  const shot = pool.evaluateSubmergedTargetShot(140, true, audioSynth);
  assert.equal(shot.laserRefracted, true);
  assert.ok(shot.effectiveDamage < 80);

  const breach = pool.triggerAquaticXenoBreachAndCounter('xeno_swimmer_1', true, audioSynth);
  assert.equal(breach.counteredInMidAir, true);
  assert.equal(pool.getStatus().submergedXenomorphCount, 1);
});

test('Chantier 5 (v152): CelticReversibleBladeNetLauncherGrappleSystem flips wristblades and smashes target through stone pillar', () => {
  const celtic = new CelticReversibleBladeNetLauncherGrappleSystem();
  const flip = celtic.flipReversibleWristblades(audioSynth);
  assert.equal(flip.flipped, true);
  assert.equal(flip.bladesReversed, true);

  const gridAlien = { id: 'grid_alien', health: 220 };
  const pillar = { intact: true };
  const slam = celtic.executePillarChokeslamThrow(gridAlien, pillar, audioSynth);
  assert.equal(slam.executed, true);
  assert.equal(pillar.intact, false);
  assert.equal(gridAlien.health, 80);
});

test('Chantier 6 + Audit QA #4 (v152): BioMaskDiegeticHudQaSanitizer clamps NaN/negative values, handles 150% overcharge, and disables reticle when unmasked', () => {
  const sanitizer = new BioMaskDiegeticHudQaSanitizer();
  const telemetry = sanitizer.sanitizeHudTelemetryPayload(
    {
      health: -45,
      maxHealth: 200,
      energy: 150,
      maxEnergy: 100,
      stamina: NaN,
      maxStamina: 100,
      maskIntegrity: 0,
      visionMode: 'THERMAL_IR',
      honorScore: 1715
    },
    audioSynth
  );

  assert.equal(telemetry.health, 0);
  assert.equal(telemetry.isOvercharged, true);
  assert.equal(telemetry.energyBarWidthPercent, 100);
  assert.equal(telemetry.stamina, 100);
  assert.equal(telemetry.bioMaskIntact, false);
  assert.equal(telemetry.triLaserReticleVisible, false);
  assert.equal(telemetry.activeVisionMode, 'UNMASKED_NAKED_EYE');
  assert.ok(telemetry.diegeticHonorGlyphs.length > 0);
});

test('Chantier 7 + Audit QA #5 (v152): LevelDesignSpatialColliderQaAuditor relocates spawns out of hazards and verifies WebGL budget <= 300', () => {
  const auditor = new LevelDesignSpatialColliderQaAuditor();
  const spawns = [{ id: 'spawn_1', x: 5.0, z: 5.0 }];
  const hazards = [{ id: 'acid_pit', x: 5.0, z: 5.0, radius: 2.5 }];

  const sanitized = auditor.sanitizeSpawnPointsAgainstHazards(spawns, hazards, audioSynth);
  assert.equal(sanitized.relocatedCount, 1);
  const movedDist = Math.hypot(sanitized.sanitizedSpawns[0].x - 5.0, sanitized.sanitizedSpawns[0].z - 5.0);
  assert.ok(movedDist >= 5.9);

  const budget = auditor.auditPerchGraphAndRenderBudget(
    [{ x: 0, z: 0 }, { x: 10, z: 8 }],
    299
  );
  assert.equal(budget.perchGraphConnected, true);
  assert.equal(budget.drawCallBudgetCompliant, true);
});

test('Chantier 8 (v152): KingWillieVoodooAlleyPentagramStandOffSector unsheathes sword-cane and awards honor skull trophy', () => {
  const alley = new KingWillieVoodooAlleyPentagramStandOffSector();
  const standOff = alley.initiateSwordCaneStandOff(audioSynth);
  assert.equal(standOff.standOffStarted, true);

  const duel = alley.resolveAlleyMeleeDuelAndClaimSkull(true);
  assert.equal(duel.skullTrophyClaimed, true);
  assert.equal(duel.trophyId, 'king_willie_bleached_skull_trophy');
});

test('Chantier 9 (v152): StargazerCryoPodFugitiveBreakoutLabSector shatters restraints and triggers lab klaxon', () => {
  const lab = new StargazerCryoPodFugitiveBreakoutLabSector();
  const guard = { id: 'stargazer_guard_1', health: 100 };

  const breakout = lab.shatterCryoRestraintsAndBreakOut([guard], audioSynth);
  assert.equal(breakout.brokeOut, true);
  assert.equal(breakout.wristGauntletRecovered, true);
  assert.equal(guard.health, 0);
});

test('Chantier 10 + Audits QA #1, #2 & #3 (v152): deterministic acid splash, Web Audio sanitizer, CSS rules, and 15 v152 audio methods', () => {
  // Audit QA #1: 50 consecutive iterations of AcidTailWhipDecapitation must deterministically corrode armor
  for (let i = 0; i < 50; i++) {
    const state = createAcidTailWhipState();
    const target = { id: 'celtic', x: 0, y: 1.5, z: 2.5, health: 60, armorIntegrity: 100 };
    executeTailWhipSlash(state, { x: 0, y: 1.5, z: 0 }, { x: 0, y: 0, z: 1 }, [target], audioSynth);
    updateAcidTailSystem(state, 1.0, [target]);
    assert.ok(target.armorIntegrity < 100, `Iteration ${i} failed deterministic acid splash`);
  }

  // Audit QA #2: Web Audio parameter sanitizer and idempotent ambient jungle stop/start
  assert.equal(audioSynth.sanitizeAudioParam(NaN, 20, 20000, 440), 440);
  assert.equal(audioSynth.sanitizeAudioParam(-50, 20, 20000, 440), 20);
  assert.doesNotThrow(() => {
    audioSynth.startAmbientJungle();
    audioSynth.startAmbientJungle();
    audioSynth.stopAmbientJungle();
  });

  // Audit QA #3: Verify CSS focus-visible and overcharged rules exist in style.css
  const cssContent = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.ok(cssContent.includes('.weapon-slot:focus-visible'));
  assert.ok(cssContent.includes('.stat-bar-fill.overcharged'));
  assert.ok(cssContent.includes('#vision-overlay.vision-acoustic'));

  // 15 v152 Web Audio methods
  const methods = [
    'playMothershipOrbitalIceBoreBeamRoar',
    'playIceTunnelThermalSteamVentHiss',
    'playXenomorphChitinSpearCraftSlash',
    'playXenoHeadShieldAcidDeflectSizzle',
    'playOrbitalDropPodAtmosphericWhistle',
    'playDropPodParachuteCanopyDeploySnap',
    'playMunicipalPoolUnderwaterLaserRefractHum',
    'playAquaticXenomorphPoolBreachSplash',
    'playCelticReversibleWristbladeFlipClick',
    'playCelticPillarChokeslamStoneSmash',
    'playBioMaskDiegeticGlyphCalibrationBeep',
    'playSpatialQaColliderWarningChime',
    'playKingWillieSwordCaneUnsheatheShink',
    'playStargazerCryoPodRestraintShatter',
    'playLabContainmentBreachKlaxonSiren'
  ];

  for (const methodName of methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `Missing AudioSynthesizer.${methodName}`);
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});
