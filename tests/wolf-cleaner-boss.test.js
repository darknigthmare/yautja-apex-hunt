import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import {
  WOLF_CLEANER_TEXTURES,
  WolfCleanerBoss,
} from '../src/entities/WolfCleanerBoss.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Wolf expose le contrat boss, ses sous-systèmes HUD et une silhouette procédurale', () => {
  assert.throws(() => new WolfCleanerBoss(null), /scène THREE valide/);

  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);

  for (const field of [
    'mesh',
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
    'cleanerZones',
    'colliderRadius',
    'maskIntact',
    'cleanerKitIntact',
    'maskIntegrity',
    'cleanerKitIntegrity',
  ]) {
    assert.ok(field in boss, `le contrat doit exposer ${field}`);
  }
  for (const method of [
    'update',
    'takeDamage',
    'applyNet',
    'consumeAttackImpact',
    'setVisionMode',
    'dispose',
  ]) {
    assert.equal(typeof boss[method], 'function', `le contrat doit exposer ${method}()`);
  }

  assert.equal(WOLF_CLEANER_TEXTURES.alloy, '/assets/textures/wolf-cleaner-alloy.webp');
  assert.equal(boss.mesh.userData.silhouette, 'veteran_cleaner_dual_caster');
  assert.match(boss.mesh.userData.provenance, /AVP:R/);
  assert.match(boss.mesh.userData.provenance, /original procedural/i);
  assert.ok(boss.mesh.getObjectByName('wolfBioMask'));
  assert.ok(boss.mesh.getObjectByName('wolfCasterLeft'));
  assert.ok(boss.mesh.getObjectByName('wolfCasterRight'));
  assert.ok(boss.mesh.getObjectByName('wolfSegmentedWhip'));
  assert.ok(boss.mesh.getObjectByName('wolfCleanerKit'));
  assert.ok(scene.children.includes(boss.mesh));

  assert.equal(boss.setVisionMode('thermal'), true);
  assert.equal(boss.setVisionMode('normal'), true);
  const mesh = boss.mesh;
  assert.equal(boss.dispose(), true);
  assert.equal(scene.children.includes(mesh), false);
  assert.equal(boss.dispose(), false, 'dispose reste idempotent');
});

test('les deux plasmacasters tirent deux projectiles indépendants animés par delta', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const shots = boss.fireTwinPlasma(new THREE.Vector3(60, 0, 0));
  assert.equal(shots.length, 2);
  assert.deepEqual(shots.map(({ caster }) => caster).sort(), ['left', 'right']);
  assert.ok(shots.every(({ type }) => type === 'wolf_twin_plasma'));
  assert.ok(shots.every(({ damage }) => damage === 35));
  assert.ok(shots.every(({ mesh }) => mesh.parent === scene));
  assert.notDeepEqual(shots[0].mesh.position.toArray(), shots[1].mesh.position.toArray());

  const starts = shots.map(({ mesh }) => mesh.position.clone());
  boss.update(0.1, new THREE.Vector3(160, 0, 0), false);
  shots.forEach(({ mesh }, index) => {
    assert.ok(mesh.position.distanceTo(starts[index]) > 0, 'chaque plasma avance avec le delta');
  });

  const source = readFileSync(join(ROOT, 'src/entities/WolfCleanerBoss.js'), 'utf8');
  assert.equal(source.includes('setTimeout('), false, 'aucun temporisateur mural dans Wolf');
  assert.equal(source.includes('setInterval('), false, 'aucun intervalle mural dans Wolf');
  boss.dispose();
});

test('le fouet possède un télégraphe esquivable puis un unique impact consommable', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  const playerPosition = new THREE.Vector3(8, 0, 0);

  boss.update(0.016, playerPosition, false);
  assert.equal(boss.aiState, 'whip_windup');
  assert.equal(boss.activeAttackType, 'whip_sweep');
  assert.ok(boss.whipWindupTimer > 0);
  assert.equal(boss.consumeAttackImpact(), false, 'le télégraphe ne blesse pas immédiatement');

  boss.update(0.2, playerPosition, false);
  boss.update(0.2, playerPosition, false);
  assert.equal(boss.consumeAttackImpact(), false);
  boss.update(0.2, playerPosition, false);
  assert.equal(boss.aiState, 'whip');
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false, 'un balayage ne frappe jamais deux fois');
  boss.dispose();
});

test('le kit déploie liquide dissolvant et mine, armés et expirés uniquement par delta', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  const target = new THREE.Vector3(6, 0, 4);

  const fluid = boss.deployDissolvingFluid(target);
  const mine = boss.deployCleanerMine(target.clone().add(new THREE.Vector3(4, 0, 0)));
  assert.equal(fluid.type, 'dissolving_fluid');
  assert.equal(fluid.radius, 5.8);
  assert.equal(fluid.tickCooldown, 0);
  assert.equal(mine.type, 'proximity_mine');
  assert.equal(mine.armed, false);
  assert.equal(boss.cleanerZones.length, 2);
  assert.strictEqual(boss.hazards, boss.cleanerZones);

  boss.update(0.2, new THREE.Vector3(500, 0, 0), false);
  boss.update(0.2, new THREE.Vector3(500, 0, 0), false);
  boss.update(0.2, new THREE.Vector3(500, 0, 0), false);
  boss.update(0.2, new THREE.Vector3(500, 0, 0), false);
  assert.equal(mine.armed, true, 'la mine est armée après 0,65 s simulée');
  assert.ok(fluid.lifetime < 8);

  assert.equal(boss.removeCleanerZone(mine), true);
  assert.equal(mine.mesh.userData.disposeComplete, true);
  boss.breakCleanerKit();
  assert.equal(boss.cleanerKitIntact, false);
  assert.equal(boss.cleanerKitIntegrity, 0);
  assert.equal(boss.deployCleanerMine(target), null, 'un kit détruit ne pose plus de mine');
  assert.equal(boss.deployDissolvingFluid(target), null, 'un kit détruit ne répand plus de fluide');
  boss.dispose();
});

test('les impacts localisés brisent le masque et le kit sans valeurs HUD négatives', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const maskOutcome = boss.takeDamage(250, new THREE.Vector3(0, 9.55, 0.92));
  assert.equal(maskOutcome.maskHit, true);
  assert.equal(maskOutcome.maskBroken, true);
  assert.equal(boss.maskIntegrity, 0);
  assert.equal(boss.maskIntact, false);
  assert.equal(boss.maskMesh.visible, false);

  const kitOutcome = boss.takeDamage(250, new THREE.Vector3(1.85, 5.8, -1.15));
  assert.equal(kitOutcome.cleanerKitHit, true);
  assert.equal(kitOutcome.cleanerKitBroken, true);
  assert.equal(boss.cleanerKitIntegrity, 0);
  assert.equal(boss.cleanerKitIntact, false);
  assert.equal(boss.cleanerKitMesh.visible, false);
  assert.ok(boss.trophyIntegrity >= 0);
  boss.dispose();
});

test('filet, mort et dispose annulent les attaques et nettoient chaque danger', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.fireTwinPlasma(new THREE.Vector3(60, 0, 0));
  boss.deployCleanerMine(new THREE.Vector3(5, 0, 0));
  boss.startWhipAttack();

  assert.equal(boss.applyNet(), true);
  assert.equal(boss.aiState, 'netted');
  assert.equal(boss.whipRecoveryTimer, 0);
  const frozenPosition = boss.position.clone();
  boss.update(0.5, new THREE.Vector3(5, 0, 0), false);
  assert.ok(boss.position.equals(frozenPosition));

  const outcome = boss.takeDamage(5000, boss.position);
  assert.equal(outcome.killed, true);
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.deepEqual(boss.projectiles, []);
  assert.deepEqual(boss.cleanerZones, []);
  assert.strictEqual(boss.hazards, boss.cleanerZones);
  assert.equal(boss.applyNet(), false);
  assert.equal(boss.dispose(), true);
  assert.equal(boss.dispose(), false);
});
