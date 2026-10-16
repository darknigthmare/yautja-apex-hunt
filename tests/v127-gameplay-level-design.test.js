import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  FLECHETTE_CONSTANTS,
  createFlechetteCrossbowState,
  setLaserTargetPoint,
  fireGuidedFlechette,
  updateGuidedFlechettes,
} from '../src/gameplay/FeralFlechetteCrossbow.js';
import {
  AQUATIC_CONSTANTS,
  createAquaticAmbushState,
  submergeInWater,
  executeUnderwaterGrab,
  executeWaterBreachLeap,
  updateAquaticAmbush,
} from '../src/gameplay/AquaticAmbushSystem.js';
import {
  REPULSOR_CONSTANTS,
  createKineticRepulsorState,
  plantKineticRepulsor,
  updateKineticRepulsor,
} from '../src/gameplay/KineticRepulsorTrap.js';
import {
  SUBSTRATES,
  createChameleonSkinState,
  adaptSkinToSubstrate,
  updateChameleonSkin,
  getPassiveStealthMultiplier,
} from '../src/gameplay/ChameleonSkinSystem.js';
import {
  equipHoundArmor,
  processHoundDamage,
} from '../src/gameplay/HoundArmorDefenseSystem.js';
import {
  ASH_CONSTANTS,
  createAshForestSector,
  collapseCharcoalTree,
  updateAshForestSector,
} from '../src/gameplay/AshForestLevelSector.js';
import {
  BOMB_CONSTANTS,
  createSelfDestructDecoyState,
  deployDetachedBomb,
  updateDetachedBomb,
} from '../src/gameplay/SelfDestructDecoySystem.js';
import {
  RAZOR_CONSTANTS,
  createRazorWireSector,
  stringRazorWire,
  checkRazorWireBreach,
} from '../src/gameplay/RazorWireBarricadeSector.js';
import {
  computePredictiveLeadPosition,
} from '../src/gameplay/BallisticPredictionDirector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Arbalète à fléchettes guidées laser (Lore 1:1 Prey 2022 Feral)', () => {
  const crossbow = createFlechetteCrossbowState();
  assert.equal(crossbow.remainingFlechettes, 8);

  // Positionnement du point d'illumination laser
  setLaserTargetPoint(crossbow, { x: 10, y: 1.5, z: 0 });
  assert.equal(crossbow.isLaserActive, true);

  // Tir de fléchette
  const dart = fireGuidedFlechette(crossbow, { x: 0, y: 1.5, z: 0 }, audioSynth);
  assert.ok(dart);
  assert.equal(crossbow.remainingFlechettes, 7);
  assert.equal(crossbow.activeFlechettes.length, 1);

  // Déplacement et homing vers la cible
  const enemy = { x: 10, y: 1.5, z: 0, health: 150 };
  updateGuidedFlechettes(crossbow, 0.25, [enemy], audioSynth);
  assert.ok(enemy.health < 150, 'La fléchette guidée a touché et détoné sur la cible');
});

test('Chantier 2 — Embuscade aquatique & Jaillissement hors de l\'eau (Lore 1:1 Predator / Prey)', () => {
  const aquatic = createAquaticAmbushState();
  assert.equal(aquatic.isSubmerged, false);

  submergeInWater(aquatic, 2.5, audioSynth);
  assert.equal(aquatic.isSubmerged, true);

  // Entraînement de la proie sous l'eau
  const prey = { health: 100, isDraggedUnderwater: false };
  executeUnderwaterGrab(aquatic, prey, audioSynth);
  assert.equal(prey.isDraggedUnderwater, true);

  // Asphyxie subaquatique
  updateAquaticAmbush(aquatic, 1.0);
  assert.ok(prey.health < 100);

  // Jaillissement explosif hors de l'eau
  executeWaterBreachLeap(aquatic, { x: 0, y: 0, z: 0 }, audioSynth);
  assert.equal(aquatic.isSubmerged, false);
  assert.equal(aquatic.isBreaching, true);
});

test('Chantier 3 — Répulseur cinétique & Suspension antigravitationnelle (Lore 1:1 The Predator)', () => {
  const repulsorState = createKineticRepulsorState();
  const trap = plantKineticRepulsor(repulsorState, { x: 5, z: 5 });
  assert.ok(trap);
  assert.equal(repulsorState.traps.length, 1);

  // Approche d'une proie -> déclenchement de la lévitation
  const prey = { x: 5.2, z: 5.1, y: 0, health: 200, isLevitating: false };
  updateKineticRepulsor(repulsorState, 0.1, [prey], audioSynth);
  assert.equal(trap.isSuspended, true);
  assert.equal(prey.isLevitating, true);
  assert.ok(prey.y > 2.0);

  // Fin du timer de suspension -> écrasement cinétique au sol
  updateKineticRepulsor(repulsorState, 2.5, [prey], audioSynth);
  assert.equal(prey.isLevitating, false);
  assert.equal(prey.isKnockedProne, true);
  assert.equal(prey.health, 200 - REPULSOR_CONSTANTS.SLAM_DAMAGE);
});

test('Chantier 4 — Peau caméléon & Adaptation biomimétique dermique (Lore 1:1 The Predator)', () => {
  const skin = createChameleonSkinState();
  assert.equal(skin.currentSubstrate, 'JUNGLE_FOLIAGE');

  // Transition vers la roche volcanique sombre
  adaptSkinToSubstrate(skin, 'BASALT_ROCK', audioSynth);
  assert.equal(skin.isShifting, true);

  // Évolution de la transition
  updateChameleonSkin(skin, 0.85);
  assert.equal(skin.isShifting, false);
  assert.equal(skin.currentSubstrate, 'BASALT_ROCK');
  assert.equal(skin.currentDermalColor, SUBSTRATES.BASALT_ROCK.hexColor);

  const stealthBonus = getPassiveStealthMultiplier(skin);
  assert.ok(stealthBonus > 1.5);
});

test('Chantier 5 — Armure de Chien Prédateur : Plaque crânienne et collier à pointes (Lore 1:1)', () => {
  const hound = { health: 150 };
  equipHoundArmor(hound);
  assert.equal(hound.hasCranialPlate, true);
  assert.equal(hound.hasBarbedCollar, true);

  // 1. Dégâts par balle frontale réduits
  const bulletDmg = processHoundDamage(hound, 100.0, 'bullet', 20.0, null, audioSynth);
  assert.ok(bulletDmg < 40.0, 'La plaque crânienne a absorbé la majeure partie de la balle');

  // 2. Assaut de mêlée : renvoi de dégâts sur l'attaquant
  const attacker = { health: 100, isBleeding: false };
  processHoundDamage(hound, 50.0, 'melee', 0, attacker, audioSynth);
  assert.ok(attacker.health < 100, 'L attaquant a subi des dégâts de retour du collier');
  assert.equal(attacker.isBleeding, true);
});

test('Chantier 6 — Forêt de Cendres 1719 : Brouillard de cendres et troncs calcinés (Lore 1:1 Prey)', () => {
  const forest = createAshForestSector();
  assert.ok(forest.ashDensity > 0.8);
  assert.equal(forest.charcoalTrees.length, 2);

  // Effondrement d'un tronc de pin calciné sur une cible
  const target = { health: 100, isStaggered: false };
  collapseCharcoalTree(forest, 'charred_pine_1', target, audioSynth);

  assert.equal(forest.charcoalTrees[0].isCollapsed, true);
  assert.equal(target.health, 100 - ASH_CONSTANTS.CHARCOAL_TREE_COLLAPSE_DAMAGE);
  assert.equal(target.isStaggered, true);

  updateAshForestSector(forest, 1.0, audioSynth);
});

test('Chantier 7 — Bombe d\'autodestruction détachée & Leurre micro-nucléaire (Lore 1:1 Predator / AVP)', () => {
  const bombState = createSelfDestructDecoyState();
  assert.equal(bombState.isBombActive, false);

  deployDetachedBomb(bombState, { x: 0, z: 0 }, 10.0, audioSynth);
  assert.equal(bombState.isBombActive, true);
  assert.equal(bombState.plantedBomb.countdown, 10.0);

  // Écoulement du décompte jusqu'à l'explosion micro-nucléaire
  const swarm = [{ x: 5, z: 5, health: 500 }, { x: 50, z: 50, health: 500 }];
  updateDetachedBomb(bombState, 11.0, swarm, audioSynth);

  assert.equal(bombState.isBombActive, false);
  assert.equal(bombState.bombDetonated, true);
  assert.ok(swarm[0].health < 100, 'La cible dans le rayon a été anéantie');
  assert.equal(swarm[1].health, 500, 'La cible hors de portée (50m) est indemne');
});

test('Chantier 8 — Barricades de fils barbelés monofilament (Lore 1:1 Predators 2010)', () => {
  const razorSector = createRazorWireSector();
  stringRazorWire(razorSector, { x: -5, z: 0 }, { x: 5, z: 0 });
  assert.equal(razorSector.wires.length, 1);

  // Proie traversant la ligne de câble
  const runner = { health: 120, isBleeding: false, isKnockedProne: false };
  const breached = checkRazorWireBreach(razorSector, { x: 0, z: -2 }, { x: 0, z: 2 }, runner, audioSynth);

  assert.equal(breached, true);
  assert.equal(runner.health, 120 - RAZOR_CONSTANTS.WIRE_DAMAGE);
  assert.equal(runner.isBleeding, true);
  assert.equal(runner.isKnockedProne, true);
});

test('Chantier 9 — Calculateur balistique prédictif du Biomasque (Lore 1:1 Predator 1987)', () => {
  const shooter = { x: 0, y: 1.5, z: 0 };
  const movingTarget = { x: 20, y: 1.5, z: 0 };
  const targetVelocity = { x: 0, y: 0, z: 10.0 }; // Se déplace à 10 m/s vers les Z

  // Calcul du point d'impact futur
  const prediction = computePredictiveLeadPosition(shooter, movingTarget, targetVelocity, 40.0, audioSynth);
  assert.ok(prediction);
  assert.equal(prediction.timeToImpact, 0.5); // 20m / 40m/s = 0.5s
  assert.equal(prediction.x, 20);
  assert.equal(prediction.z, 5.0); // 0 + 10 * 0.5 = 5.0m
  assert.equal(prediction.isTargetMoving, true);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v127 et vérification Draw Calls Mothership', () => {
  const newAudioMethods = [
    'playFlechetteFire',
    'playFlechetteImpact',
    'playWaterEmergeSplash',
    'playUnderwaterGurgle',
    'playKineticRepulsorPulse',
    'playAntiGravHum',
    'playChameleonShift',
    'playHoundCollarClink',
    'playHoundArmorRicochet',
    'playAshWindHowl',
    'playCharcoalCrumble',
    'playDecoyBeepFast',
    'playMicroNuclearBlast',
    'playMonofilamentSlice',
    'playPredictionLockChirp',
  ];

  newAudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynth.${method} doit exister`);
  });

  // Vérification de l'invariant des Draw Calls (<= 300)
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});
