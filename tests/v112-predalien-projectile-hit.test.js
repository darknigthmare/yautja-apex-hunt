import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { PredalienBoss } from '../src/entities/PredalienBoss.js';

function expectNear(actual, expected, epsilon = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `attendu ${expected} ± ${epsilon}, reçu ${actual}`,
  );
}

test('les tirs balayés atteignent les weakpoints monde d’un Predalien tourné', () => {
  const boss = new PredalienBoss(new THREE.Scene());
  boss.position.set(11, 0, -7);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = Math.PI / 2;
  boss.mesh.updateWorldMatrix(true, true);

  const forward = new THREE.Vector3(0, 0, 1)
    .applyQuaternion(boss.mesh.getWorldQuaternion(new THREE.Quaternion()))
    .normalize();
  const projectileRadius = 0.85;
  const headPosition = boss.getHeadWorldPosition();
  const headStart = headPosition.clone().addScaledVector(forward, 20);
  const headEnd = headPosition.clone().addScaledVector(forward, -40);
  const headImpact = boss.resolveProjectileImpact(headEnd, projectileRadius, headStart);

  assert.ok(headImpact, 'la trajectoire doit toucher la tête tournée');
  expectNear(headImpact.distanceTo(headPosition), 5 + projectileRadius);
  assert.ok(
    headImpact.distanceTo(boss.getBodyWorldPosition()) > boss.colliderRadius + projectileRadius,
    'la tête doit être résolue avant le volume central',
  );
  boss.takeDamage(360, headImpact);
  assert.equal(boss.headIntact, false);
  assert.equal(boss.headMesh.visible, false);
  assert.ok(boss.getAimPoint().distanceTo(boss.getBodyWorldPosition()) < 1e-8);

  const tailPosition = boss.getTailWorldPosition();
  const backward = forward.clone().negate();
  const tailStart = tailPosition.clone().addScaledVector(backward, 20);
  const tailEnd = tailPosition.clone().addScaledVector(backward, -40);
  const tailImpact = boss.resolveProjectileImpact(tailEnd, projectileRadius, tailStart);

  assert.ok(tailImpact, 'la trajectoire doit toucher la pointe de queue animée');
  expectNear(tailImpact.distanceTo(tailPosition), 6 + projectileRadius);
  assert.ok(
    tailImpact.distanceTo(boss.getBodyWorldPosition()) > boss.colliderRadius + projectileRadius,
    'la queue doit être résolue avant le volume central depuis l’arrière',
  );
  boss.takeDamage(410, tailImpact);
  assert.equal(boss.tailIntact, false);
  assert.equal(boss.tailMesh.visible, false);
  boss.dispose();
});

test('le volume rencontré en premier gagne quand plusieurs sphères sont traversées', () => {
  const boss = new PredalienBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.mesh.updateWorldMatrix(true, true);

  const bodyPosition = boss.getBodyWorldPosition();
  const start = new THREE.Vector3(bodyPosition.x, -20, bodyPosition.z + 1.5);
  const end = new THREE.Vector3(bodyPosition.x, 30, bodyPosition.z + 1.5);
  const impact = boss.resolveProjectileImpact(end, 0.42, start);

  assert.ok(impact, 'la trajectoire verticale doit rencontrer le Predalien');
  const headHealthBefore = boss.headHealth;
  boss.takeDamage(25, impact);
  assert.equal(
    boss.headHealth,
    headHealthBefore,
    'l’entrée dans le corps ne doit pas être reclassée comme weakpoint tête',
  );
  assert.equal(boss.health, boss.maxHealth - 25);
  boss.dispose();
});
