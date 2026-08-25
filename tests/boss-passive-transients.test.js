import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { BadBloodRival } from '../src/entities/BadBloodRival.js';
import { WolfCleanerBoss } from '../src/entities/WolfCleanerBoss.js';

const EPSILON = 1e-6;

test('Wolf fait vivre projectiles et zones pendant une migration sans déplacer ni attaquer', () => {
  const scene = new THREE.Scene();
  const boss = new WolfCleanerBoss(scene);
  boss.position.set(14, 3, -22);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = 0.73;
  boss.aiState = 'migration';
  boss.attackCooldown = 2.4;

  const [projectile] = boss.fireTwinPlasma(new THREE.Vector3(90, 3, -22));
  const fluid = boss.deployDissolvingFluid(new THREE.Vector3(20, 0, -18));
  const mine = boss.deployCleanerMine(new THREE.Vector3(24, 0, -16));
  const projectileStart = projectile.mesh.position.clone();
  const projectileLifetime = projectile.lifetime;
  const bossStart = boss.position.clone();
  const rotationStart = boss.mesh.rotation.y;

  assert.equal(boss.tickTransientState(5), true);
  assert.ok(
    Math.abs(projectile.mesh.position.distanceTo(projectileStart) - projectile.speed * 0.2) < EPSILON,
    'le delta passif est borné à 0,2 s pour le plasma',
  );
  assert.ok(Math.abs(projectile.lifetime - (projectileLifetime - 0.2)) < EPSILON);
  assert.ok(Math.abs(fluid.lifetime - 7.8) < EPSILON);
  assert.ok(Math.abs(mine.armTimer - 0.45) < EPSILON);
  assert.equal(mine.armed, false);
  assert.ok(boss.position.equals(bossStart), 'le tick passif ne déplace pas Wolf');
  assert.equal(boss.mesh.rotation.y, rotationStart);
  assert.equal(boss.aiState, 'migration');
  assert.equal(boss.attackCooldown, 2.4, 'le tick passif ne pilote pas les attaques');

  const frozenProjectile = projectile.mesh.position.clone();
  const frozenLifetime = projectile.lifetime;
  boss.tickTransientState(-10);
  assert.ok(projectile.mesh.position.equals(frozenProjectile), 'un delta négatif est ramené à zéro');
  assert.equal(projectile.lifetime, frozenLifetime);

  let transientTicks = 0;
  const tickTransientState = boss.tickTransientState.bind(boss);
  boss.tickTransientState = (delta) => {
    transientTicks += 1;
    return tickTransientState(delta);
  };
  boss.update(0.1, new THREE.Vector3(900, 3, -22), false);
  assert.equal(transientTicks, 1, 'update appelle le contrat transitoire exactement une fois');
  boss.dispose();
});

test('Bad Blood borne son plasma passif et update ne double jamais le tick', () => {
  const scene = new THREE.Scene();
  const boss = new BadBloodRival(scene);
  boss.position.set(-30, 2, -30);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = -0.42;
  boss.aiState = 'migration';
  boss.attackCooldown = 9;
  boss.firePlasma(new THREE.Vector3(80, 2, -30));

  const projectile = boss.projectiles[0];
  const projectileStart = projectile.mesh.position.clone();
  const bossStart = boss.position.clone();
  const rotationStart = boss.mesh.rotation.y;

  assert.equal(boss.tickTransientState(Number.POSITIVE_INFINITY), true);
  assert.ok(
    Math.abs(projectile.mesh.position.distanceTo(projectileStart) - projectile.speed * 0.2) < EPSILON,
    'le plasma Bad Blood ne consomme jamais plus de 0,2 s par tick',
  );
  assert.ok(Math.abs(projectile.lifetime - 2.8) < EPSILON);
  assert.ok(boss.position.equals(bossStart), 'le tick passif ne déplace pas le rival');
  assert.equal(boss.mesh.rotation.y, rotationStart);
  assert.equal(boss.aiState, 'migration');
  assert.equal(boss.attackCooldown, 9);

  let transientTicks = 0;
  const tickTransientState = boss.tickTransientState.bind(boss);
  boss.tickTransientState = (delta) => {
    transientTicks += 1;
    return tickTransientState(delta);
  };
  boss.update(0.1, new THREE.Vector3(300, 2, -30));
  assert.equal(transientTicks, 1, 'update appelle le contrat transitoire exactement une fois');
  boss.dispose();
});
