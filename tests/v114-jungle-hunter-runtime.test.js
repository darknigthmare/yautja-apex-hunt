import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { getMediaCoverageById } from '../src/data/MediaCoverageCatalog.js';

test('JungleHunterBoss respecte le contrat de boss, de silhouette 1:1 et de sous-systèmes 1987', () => {
  const definition = HUNT_DEFINITIONS.jungle_hunter_1987;
  assert.ok(definition, 'La définition de chasse jungle_hunter_1987 doit exister');
  assert.equal(definition.bossType, 'jungleHunter');
  assert.equal(definition.reward, 2800);
  assert.equal(definition.recommendedBiome, 'jungle');

  const scene = new THREE.Scene();
  const boss = createBoss(scene, definition);

  assert.equal(boss.nativeHighDetail, true);
  assert.ok(boss.visualDetail);
  assert.ok(scene.children.includes(boss.mesh));
  assert.equal(boss.maskIntact, true);
  assert.equal(boss.selfDestructTriggered, false);
  assert.equal(boss.selfDestructDetonated, false);

  // Vérification de la présence des éléments signatures 1:1 Stan Winston 1987
  const maskMesh = boss.mesh.getObjectByName('jungleHunterClassicMask');
  const revealedFace = boss.mesh.getObjectByName('jungleHunterRevealedFace');
  const plasmacaster = boss.mesh.getObjectByName('jungleHunterSinglePlasmacaster');
  const wristblades = boss.mesh.getObjectByName('jungleHunterWristblades');
  const spineTrophy = boss.mesh.getObjectByName('jungleHunterSpineTrophy');
  const wristComputer = boss.mesh.getObjectByName('jungleHunterWristComputer');
  const triLaser = boss.mesh.getObjectByName('jungleHunterTriLaserEmitter');
  const medicomp = boss.mesh.getObjectByName('jungleHunterMedicomp');
  const targetingBeams = boss.mesh.getObjectByName('jungleHunterTargetingBeams');

  assert.ok(maskMesh, 'Le bio-masque classique 1987 doit exister');
  assert.ok(revealedFace, 'Le visage mandibulaire sous le masque doit exister');
  assert.ok(plasmacaster, 'Le canon à plasma d’épaule unique doit exister');
  assert.ok(wristblades, 'Les doubles lames de poignet allongées doivent exister');
  assert.ok(spineTrophy, 'La bandoulière de trophées avec colonne vertébrale doit exister');
  assert.ok(wristComputer, 'L’ordinateur de poignet avec compte à rebours doit exister');
  assert.ok(triLaser, 'L’émetteur tri-laser triangulaire doit exister');
  assert.ok(medicomp, 'Le kit d’urgence medicomp doit exister');
  assert.ok(targetingBeams, 'Les faisceaux de ciblage tri-laser doivent exister');

  // Test du camouflage optique actif et vision modes
  assert.equal(boss.isCloaked, false);
  assert.equal(boss.cloak(), true);
  assert.equal(boss.isCloaked, true);
  assert.equal(boss.setVisionMode('thermal'), true);
  assert.equal(boss.setVisionMode('normal'), true);
  assert.equal(boss.decloak(), true);
  assert.equal(boss.isCloaked, false);

  // Test des soins d'urgence Medicomp 1987
  boss.health = 1600;
  assert.equal(boss.beginMedicomp(), true);
  assert.equal(boss.medicompActive, true);
  assert.equal(boss.aiState, 'medicomp');
  assert.equal(boss.interruptMedicomp('impact'), true);
  assert.equal(boss.medicompActive, false);

  // Test de rupture du masque
  boss.breakMask();
  assert.equal(boss.maskIntact, false);
  assert.equal(maskMesh.visible, false);
  assert.equal(targetingBeams.visible, false);

  // Test du compte à rebours d'autodestruction et déclenchement du rire de Billy
  boss.takeDamage(boss.maxHealth * 2);
  assert.equal(boss.health, 0);
  assert.equal(boss.selfDestructTriggered, true);
  assert.equal(boss.laughMimicPlayed, true);
  assert.equal(boss.aiState, 'self_destruct_countdown');

  // Avance temporelle du compte à rebours
  boss.update(boss.selfDestructCountdown + 0.1, new THREE.Vector3(0, 0, 0), false);
  assert.equal(boss.selfDestructDetonated, true);
  assert.equal(boss.isDead, true);

  boss.dispose();
  assert.equal(boss.setVisionMode('thermal'), false);
});

test('film_predator_1987 est passé à playable avec couverture complète de la chasse', () => {
  const film = getMediaCoverageById('film_predator_1987');
  assert.ok(film);
  assert.equal(film.gameCoverage.runtimeStatus, 'playable');
  assert.ok(film.coverageTargets.some((target) => target.id === 'jungle_hunter_1987'));
});

test('AudioSynthesizer expose les méthodes audio 1987 authentiques', () => {
  assert.equal(typeof audioSynth.playBillyLaughMimic, 'function');
  assert.equal(typeof audioSynth.playTriLaserLock, 'function');
  assert.equal(typeof audioSynth.playPlasmacasterCharge, 'function');
  assert.equal(typeof audioSynth.playMedicompUse, 'function');
  assert.equal(typeof audioSynth.playCloakDistortion, 'function');
  assert.doesNotThrow(() => audioSynth.playMimicryLure('turn_around'));
});
