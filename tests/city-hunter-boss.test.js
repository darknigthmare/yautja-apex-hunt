import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  CITY_HUNTER_TEXTURES,
  CityHunterBoss,
} from '../src/entities/CityHunterBoss.js';

function countMeshes(root) {
  let count = 0;
  root.traverse((object) => {
    if (object.isMesh) count += 1;
  });
  return count;
}

function fireSweptShot(boss, origin, damage = 250, stepLength = 12) {
  const direction = boss.getAimPoint().sub(origin).normalize();
  let previousPosition = origin.clone();

  for (let step = 0; step < 32; step += 1) {
    const projectilePosition = previousPosition.clone().addScaledVector(direction, stepLength);
    const impact = boss.resolveProjectileImpact(projectilePosition, 1, previousPosition);
    if (impact) return { impact, outcome: boss.takeDamage(damage, impact) };
    previousPosition = projectilePosition;
  }

  return null;
}

test('City Hunter expose le contrat boss et une silhouette urbaine procédurale riche', () => {
  assert.throws(() => new CityHunterBoss(null), /scène THREE valide/);

  const scene = new THREE.Scene();
  const boss = new CityHunterBoss(scene);
  for (const field of [
    'mesh',
    'position',
    'maxHealth',
    'health',
    'isDead',
    'isEnraged',
    'isNetted',
    'netTimer',
    'attackCooldown',
    'projectiles',
    'colliderRadius',
    'medicompAvailable',
  ]) {
    assert.ok(field in boss, `le contrat doit exposer ${field}`);
  }
  for (const method of [
    'update',
    'takeDamage',
    'applyNet',
    'setVisionMode',
    'getAimPoint',
    'resolveProjectileImpact',
    'consumeAttackImpact',
    'dispose',
  ]) {
    assert.equal(typeof boss[method], 'function', `le contrat doit exposer ${method}()`);
  }

  assert.equal(CITY_HUNTER_TEXTURES.urbanHeatwave, '/assets/textures/los-angeles-heatwave-urban.webp');
  assert.equal(boss.mesh.userData.silhouette, 'urban_disc_hunter');
  assert.equal(boss.mesh.userData.combatIdentity, 'returning_disc_netgun_medicomp');
  assert.deepEqual(boss.mesh.userData.runtimeTexturePaths, Object.values(CITY_HUNTER_TEXTURES));
  for (const name of [
    'cityHunterAngularMask',
    'cityHunterRebreather',
    'cityHunterSmartDiscHolster',
    'cityHunterNetgun',
    'cityHunterMedicomp',
    'cityHunterCombistick',
    'cityHunterTrophyRack',
  ]) {
    assert.ok(boss.mesh.getObjectByName(name), `${name} doit être visible sur le modèle`);
  }
  assert.ok(countMeshes(boss.mesh) >= 80, 'le rival conserve une silhouette détaillée, pas un placeholder');
  assert.ok(scene.children.includes(boss.mesh));

  assert.equal(boss.setVisionMode('thermal'), true);
  assert.equal(boss.setVisionMode('normal'), true);
  const mesh = boss.mesh;
  assert.equal(boss.dispose(), true);
  assert.equal(scene.children.includes(mesh), false);
  assert.equal(boss.dispose(), false, 'dispose est idempotent');
});

test('le smart disc ricoche, revient vers son propriétaire puis rejoint son holster', () => {
  const scene = new THREE.Scene();
  const boss = new CityHunterBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.arenaBoundary = 40;

  const disc = boss.fireSmartDisc(new THREE.Vector3(80, 0, 0));
  assert.equal(disc.type, 'smart_disc');
  assert.equal(disc.signal, 'city_hunter_smart_disc');
  assert.equal(disc.mesh.name, 'cityHunterSmartDiscProjectile');
  assert.equal(disc.mesh.userData.projectileSignal, disc.signal);
  assert.equal(boss.discHolsterMesh.visible, false);
  assert.ok(disc.mesh.parent === scene);

  disc.mesh.position.set(38.9, 4, 0);
  disc.dir.set(1, 0, 0);
  boss.tickTransientState(0.1);
  assert.equal(disc.ricochetCount, 1);
  assert.ok(disc.dir.x < 0, 'la normale de bord renvoie réellement le disque');

  disc.outboundTimer = 0;
  boss.tickTransientState(0.1);
  assert.equal(disc.phase, 'returning');
  const distanceBeforeReturn = disc.mesh.position.distanceTo(new THREE.Vector3(2.1, 4.35, 0));
  boss.tickTransientState(0.2);
  assert.ok(
    disc.mesh.position.distanceTo(new THREE.Vector3(2.1, 4.35, 0)) < distanceBeforeReturn,
    'la phase de retour se dirige vers le propriétaire',
  );

  disc.mesh.position.set(2.1, 4.35, 0.1);
  boss.tickTransientState(0.016);
  assert.equal(boss.projectiles.includes(disc), false);
  assert.equal(boss.discHolsterMesh.visible, true);
  boss.dispose();
});

test('le lance-filet émet un projectile identifiable et porteur de son effet gameplay', () => {
  const scene = new THREE.Scene();
  const boss = new CityHunterBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const net = boss.fireNetgun(new THREE.Vector3(40, 0, 0));
  assert.equal(net.type, 'netgun');
  assert.equal(net.signal, 'city_hunter_net');
  assert.equal(net.statusEffect, 'netted');
  assert.ok(net.statusDuration >= 2.8);
  assert.equal(net.mesh.name, 'cityHunterNetProjectile');
  assert.equal(net.mesh.userData.projectileSignal, 'city_hunter_net');
  assert.ok(net.mesh.getObjectByName('cityHunterNetSignal'));

  const start = net.mesh.position.clone();
  boss.tickTransientState(0.2);
  assert.ok(net.mesh.position.distanceTo(start) > 0, 'le filet avance avec le tick borné');
  boss.dispose();
  assert.deepEqual(boss.projectiles, []);
});

test('le Medicomp soigne une seule fois, dans le temps, et un impact interrompt la phase', () => {
  const boss = new CityHunterBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  assert.equal(boss.medicompAvailable, true, 'le HUD doit annoncer la réserve avant sa consommation');
  boss.takeDamage(1100, boss.position);
  const woundedHealth = boss.health;

  boss.update(0.016, new THREE.Vector3(60, 0, 0), false);
  assert.equal(boss.aiState, 'medicomp');
  assert.equal(boss.medicompUsed, true);
  assert.equal(boss.medicompAvailable, false, 'la réserve devient indisponible dès le début du soin');
  assert.equal(boss.medicompActive, true);
  assert.equal(boss.medicompMesh.visible, true);

  for (let index = 0; index < 5; index += 1) boss.tickTransientState(0.2);
  assert.ok(boss.health > woundedHealth, 'le soin est appliqué progressivement après son télégraphe');
  assert.ok(boss.medicompHealed > 0);
  const healthBeforeImpact = boss.health;
  const result = boss.takeDamage(35, boss.position);
  assert.equal(result.medicompInterrupted, true);
  assert.equal(boss.medicompActive, false);
  assert.equal(boss.medicompInterrupted, true);
  assert.equal(boss.medicompMesh.visible, false);
  assert.equal(boss.health, healthBeforeImpact - 35);
  assert.equal(boss.beginMedicomp(), false, 'la réserve utilisée ne revient pas après interruption');
  boss.dispose();
});

test('le pipeline de visée et de collision balayant atteint réellement le masque urbain', () => {
  const boss = new CityHunterBoss(new THREE.Scene());
  boss.position.set(7, 0, -18);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = Math.PI / 2;
  const origin = new THREE.Vector3(7, 4.25, 38);

  assert.ok(
    boss.getAimPoint().distanceTo(boss.getMaskWorldPosition()) < 1e-8,
    'le ciblage automatique doit privilégier le masque intact',
  );
  const maskShot = fireSweptShot(boss, origin);
  assert.ok(maskShot, 'un tir balayant doit rencontrer le volume du masque malgré un grand pas');
  assert.ok(maskShot.impact.distanceTo(boss.getMaskWorldPosition()) < 1e-8);
  assert.equal(maskShot.outcome.maskHit, true);
  assert.equal(maskShot.outcome.maskBroken, true);
  assert.equal(boss.maskIntact, false);
  assert.ok(
    boss.getAimPoint().distanceTo(boss.getMaskWorldPosition()) > 1,
    'après rupture, la visée doit revenir vers le corps',
  );
  boss.dispose();
});

test('le masque multispectral suit le camouflage et sa destruction réduit cette portée', () => {
  const boss = new CityHunterBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.attackCooldown = 10;
  const cloakedTarget = new THREE.Vector3(60, 0, 0);

  boss.update(0.1, cloakedTarget, true);
  assert.equal(boss.multispectralLock, true);
  assert.equal(boss.aiState, 'spectral_track');
  assert.ok(boss.cloakTrackingConfidence > 0);

  assert.equal(boss.breakMask(), true);
  boss.update(0.1, cloakedTarget, true);
  assert.equal(boss.multispectralLock, false);
  assert.equal(boss.aiState, 'stalk');
  assert.equal(boss.maskMesh.visible, false);
  assert.equal(boss.breakMask(), false);
  boss.dispose();
});

test('filet, mêlée, mort et dispose ferment proprement tous les états offensifs', () => {
  const scene = new THREE.Scene();
  const boss = new CityHunterBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, new THREE.Vector3(5, 0, 0), false);
  assert.equal(boss.aiState, 'combistick_windup');
  assert.equal(boss.consumeAttackImpact(), false, 'le télégraphe ne frappe pas immédiatement');
  boss.update(0.2, new THREE.Vector3(5, 0, 0), false);
  boss.update(0.2, new THREE.Vector3(5, 0, 0), false);
  assert.equal(boss.aiState, 'combistick');
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false, 'un balayage ne produit qu’un impact');

  boss.fireNetgun(new THREE.Vector3(50, 0, 0));
  assert.equal(boss.applyNet(), true);
  assert.equal(boss.aiState, 'netted');
  const frozenPosition = boss.position.clone();
  boss.update(0.2, new THREE.Vector3(50, 0, 0), false);
  assert.ok(boss.position.equals(frozenPosition));

  boss.takeDamage(10_000, boss.position);
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.deepEqual(boss.projectiles, []);
  assert.equal(boss.applyNet(), false);
  assert.equal(boss.setVisionMode('thermal'), true);

  const mesh = boss.mesh;
  assert.equal(boss.dispose(), true);
  assert.equal(scene.children.includes(mesh), false);
  assert.equal(boss.setVisionMode('normal'), false);
});
