import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import {
  KALISK_TEXTURES,
  KaliskBoss,
} from '../src/entities/KaliskBoss.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('le Kalisk expose le contrat boss, le HUD et une silhouette procédurale de Genna', () => {
  assert.throws(() => new KaliskBoss(null), /scène THREE valide/);

  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);

  for (const field of [
    'mesh',
    'group',
    'position',
    'health',
    'maxHealth',
    'isDead',
    'isEnraged',
    'isNetted',
    'netTimer',
    'aiState',
    'attackCooldown',
    'attackImpactReady',
    'attackTelegraphAnnounced',
    'projectiles',
    'colliderRadius',
    'phase',
    'carapaceIntact',
    'carapaceIntegrity',
    'regenerationActive',
    'coreExposed',
  ]) {
    assert.ok(field in boss, `le contrat doit exposer ${field}`);
  }
  for (const method of [
    'update',
    'takeDamage',
    'applyNet',
    'consumeAttackImpact',
    'getHUDState',
    'setVisionMode',
    'dispose',
  ]) {
    assert.equal(typeof boss[method], 'function', `le contrat doit exposer ${method}()`);
  }

  assert.equal(KALISK_TEXTURES.adaptiveHide, '/assets/textures/kalisk-adaptive-hide.webp');
  assert.equal(boss.group, boss.mesh);
  assert.equal(boss.mesh.userData.silhouette, 'genna_regenerative_apex');
  assert.match(boss.mesh.userData.provenance, /Predator: Badlands/);
  assert.match(boss.mesh.userData.provenance, /original procedural/i);
  assert.ok(boss.mesh.getObjectByName('kaliskAdaptiveCarapace'));
  assert.ok(boss.mesh.getObjectByName('kaliskRegenerativeCore'));
  assert.ok(boss.mesh.getObjectByName('kaliskImpalingMandibles'));
  assert.ok(scene.children.includes(boss.mesh));

  assert.equal(boss.setVisionMode('thermal'), true);
  assert.equal(boss.setVisionMode('normal'), true);
  const mesh = boss.mesh;
  assert.equal(boss.dispose(), true);
  assert.equal(scene.children.includes(mesh), false);
  assert.equal(boss.dispose(), false, 'dispose reste idempotent');
});

test('la carapace adaptative réduit les dégâts, se brise puis expose le noyau', () => {
  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const firstHit = boss.takeDamage(400, new THREE.Vector3(4, 4, 0));
  assert.equal(firstHit.absorbed, 192);
  assert.equal(firstHit.damage, 208);
  assert.equal(boss.carapaceIntegrity, 628);
  assert.equal(boss.carapaceIntact, true);

  boss.takeDamage(1000, new THREE.Vector3(4, 4, 0));
  boss.takeDamage(300, new THREE.Vector3(4, 4, 0));
  assert.equal(boss.phase, 2);
  const breakHit = boss.takeDamage(300, new THREE.Vector3(4, 4, 0));
  assert.equal(breakHit.carapaceBroken, true);
  assert.equal(boss.carapaceIntegrity, 0);
  assert.equal(boss.carapaceIntact, false);
  assert.equal(boss.coreExposed, true);
  assert.equal(boss.coreMesh.visible, true);

  const healthBeforeCoreHit = boss.health;
  const coreHit = boss.takeDamage(100, new THREE.Vector3(0, 6.75, 0));
  assert.equal(coreHit.coreHit, true);
  assert.equal(coreHit.damage, 130);
  assert.equal(boss.health, healthBeforeCoreHit - 130);
  boss.dispose();
});

test('la régénération avance uniquement avec delta et une pression de dégâts l’interrompt', () => {
  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);
  boss.takeDamage(700, new THREE.Vector3(5, 3, 0));
  const damagedHealth = boss.health;

  assert.equal(boss.startRegeneration(), true);
  assert.equal(boss.regenerationActive, true);
  assert.equal(boss.aiState, 'regeneration');
  boss.update(0.2, new THREE.Vector3(80, 0, 0), false);
  assert.ok(boss.health > damagedHealth, 'la santé remonte selon le delta simulé');
  assert.ok(boss.regenerationTimer < 3.2);

  const lightHit = boss.takeDamage(70, new THREE.Vector3(5, 3, 0));
  assert.equal(lightHit.regenerationInterrupted, false);
  const interruptingHit = boss.takeDamage(70, new THREE.Vector3(5, 3, 0));
  assert.equal(interruptingHit.regenerationInterrupted, true);
  assert.equal(boss.regenerationActive, false);
  assert.equal(boss.aiState, 'regeneration_interrupted');
  assert.ok(boss.regenerationCooldown > 0);

  const source = readFileSync(join(ROOT, 'src/entities/KaliskBoss.js'), 'utf8');
  assert.equal(source.includes('setTimeout('), false, 'aucun temporisateur mural dans le Kalisk');
  assert.equal(source.includes('setInterval('), false, 'aucun intervalle mural dans le Kalisk');
  boss.dispose();
});

test('la charge est télégraphiée puis produit un seul impact consommable', () => {
  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  const target = new THREE.Vector3(24, 0, 0);

  assert.equal(boss.startChargeAttack(target), true);
  assert.equal(boss.aiState, 'charge_windup');
  assert.equal(boss.activeAttackType, 'kalisk_charge');
  assert.equal(boss.consumeAttackImpact(), false, 'le télégraphe laisse une fenêtre d’esquive');

  for (let index = 0; index < 4; index += 1) boss.update(0.2, target, false);
  assert.equal(boss.aiState, 'charge');
  const beforeCharge = boss.position.clone();
  for (let index = 0; index < 3; index += 1) boss.update(0.2, target, false);
  assert.ok(boss.position.distanceTo(beforeCharge) > 0, 'la charge déplace réellement le boss');
  assert.equal(boss.attackImpactReady, true);
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false, 'la même charge ne frappe jamais deux fois');
  boss.dispose();
});

test('l’empalement conserve un télégraphe distinct et un impact explicite', () => {
  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  const target = new THREE.Vector3(5, 0, 0);

  boss.update(0.016, target, false);
  assert.equal(boss.aiState, 'impale_windup');
  assert.equal(boss.activeAttackType, 'kalisk_impale');
  assert.equal(boss.consumeAttackImpact(), false);

  for (let index = 0; index < 3; index += 1) boss.update(0.2, target, false);
  assert.equal(boss.aiState, 'impale');
  boss.update(0.2, target, false);
  assert.equal(boss.attackImpactReady, true);
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false);
  boss.dispose();
});

test('filet, mort et HUD conservent des états bornés et nettoyables', () => {
  const scene = new THREE.Scene();
  const boss = new KaliskBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.startChargeAttack(new THREE.Vector3(20, 0, 0));

  assert.equal(boss.applyNet(), true);
  assert.equal(boss.aiState, 'netted');
  assert.equal(boss.activeAttackType, null);
  const frozenPosition = boss.position.clone();
  boss.update(0.5, new THREE.Vector3(4, 0, 0), false);
  assert.ok(boss.position.equals(frozenPosition));

  const outcome = boss.takeDamage(5000, boss.position);
  assert.equal(outcome.killed, true);
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.equal(boss.applyNet(), false);
  const hud = boss.getHUDState();
  assert.equal(hud.health, 0);
  assert.ok(hud.carapaceIntegrity >= 0);
  assert.ok(hud.carapaceIntegrity <= hud.maxCarapaceIntegrity);
  assert.equal(hud.regenerationActive, false);
  assert.equal(boss.dispose(), true);
  assert.equal(boss.dispose(), false);
});
