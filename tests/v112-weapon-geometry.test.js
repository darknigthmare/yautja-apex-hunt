import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

const TARGET = new THREE.Vector3(0, 4, -40);

function makePlayer() {
  return new YautjaPlayer(new THREE.Scene());
}

function meshParts(root) {
  const meshes = [];
  root.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

function partsWithRole(root, role) {
  return meshParts(root).filter((part) => part.userData.detailRole === role);
}

function triangleCount(root) {
  return meshParts(root).reduce((total, part) => {
    const geometryTriangles = part.geometry.index
      ? part.geometry.index.count / 3
      : (part.geometry.attributes?.position?.count ?? 0) / 3;
    return total + geometryTriangles * (part.isInstancedMesh ? part.count : 1);
  }, 0);
}

function assertDetailedAssembly(root, equipmentRole, minimumMeshes, triangleBudget) {
  const parts = meshParts(root);
  assert.equal(root.isGroup, true);
  assert.equal(root.userData.equipmentRole, equipmentRole);
  assert.equal(root.userData.isPlaceholder, false);
  assert.equal(root.userData.visualTier, 'detailed_procedural_weapon');
  assert.equal(root.userData.provenance, 'original_fan_made_procedural');
  assert.ok(parts.length >= minimumMeshes, `${equipmentRole}: seulement ${parts.length} sous-meshes`);
  assert.ok(triangleCount(root) <= triangleBudget, `${equipmentRole}: budget de ${triangleBudget} triangles dépassé`);
  parts.forEach((part) => assert.equal(part.userData.isPlaceholder, false, `${part.name} reste marqué placeholder`));
}

test('le combistick est un assemblage segmenté à double lame sans modifier son projectile', () => {
  const player = makePlayer();
  player.energy = 100;
  player.selectedWeapon = 3;
  player.attack(TARGET);

  const projectile = player.projectiles.at(-1);
  assert.deepEqual(
    { type: projectile.type, speed: projectile.speed, damage: projectile.damage, lifetime: projectile.lifetime },
    { type: 'spear', speed: 80, damage: 65, lifetime: 2.5 },
  );
  assert.equal(player.energy, 100);
  assertDetailedAssembly(projectile.mesh, 'combistick', 16, 3_000);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_combistick_segmented_shaft').length, 5);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_combistick_locking_collar').length, 4);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_combistick_tip_blade').length, 2);
});

test('le smart disc possède corps, guidage et huit lames dentées au lieu d’un torus unique', () => {
  const player = makePlayer();
  player.energy = 100;
  player.selectedWeapon = 4;
  player.attack(TARGET);

  const projectile = player.projectiles.at(-1);
  assert.deepEqual(
    { type: projectile.type, speed: projectile.speed, damage: projectile.damage, lifetime: projectile.lifetime },
    { type: 'disc', speed: 55, damage: 50, lifetime: 3.5 },
  );
  assert.equal(player.energy, 100);
  assertDetailedAssembly(projectile.mesh, 'smart_disc', 21, 4_000);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_smart_disc_armored_body').length, 2);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_smart_disc_guidance_core').length, 1);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_smart_disc_serrated_blade').length, 8);
  assert.ok(partsWithRole(projectile.mesh, 'weapon_smart_disc_serrated_blade').every((blade) => blade.geometry.type === 'ExtrudeGeometry'));
  assert.equal(meshParts(projectile.mesh).some((part) => part.geometry.type === 'RingGeometry'), false);
});

test('le projectile du netgun est un vrai filet tissé lesté et conserve son effet de capture', () => {
  const player = makePlayer();
  player.energy = 100;
  player.selectedWeapon = 5;
  player.attack(TARGET);

  const projectile = player.projectiles.at(-1);
  assert.deepEqual(
    {
      type: projectile.type,
      speed: projectile.speed,
      damage: projectile.damage,
      isNet: projectile.isNet,
      lifetime: projectile.lifetime,
    },
    { type: 'net', speed: 45, damage: 15, isNet: true, lifetime: 3 },
  );
  assert.equal(player.energy, 85);
  assertDetailedAssembly(projectile.mesh, 'netgun_capture_net', 24, 7_000);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_netgun_woven_cable').length, 14);
  assert.equal(partsWithRole(projectile.mesh, 'weapon_netgun_weighted_anchor').length, 8);
  assert.ok(partsWithRole(projectile.mesh, 'weapon_netgun_energy_knot')[0].userData.instanceDetailCount >= 25);
  assert.equal(meshParts(projectile.mesh).some((part) => part.geometry.type === 'RingGeometry'), false);
});

test('la mine plasma déploie un corps blindé, quatre pieds et un noyau émissif sans changer dégâts ni coût', () => {
  const player = makePlayer();
  player.energy = 100;
  player.selectedWeapon = 7;
  player.attack(TARGET);

  const mine = player.mines.at(-1);
  assert.equal(player.energy, 80);
  assert.equal(mine.damage, 120);
  assertDetailedAssembly(mine.mesh, 'plasma_proximity_mine', 16, 3_000);
  assert.equal(partsWithRole(mine.mesh, 'weapon_plasma_mine_deployment_leg').length, 4);
  assert.equal(partsWithRole(mine.mesh, 'weapon_plasma_mine_stabilizer_foot').length, 4);
  assert.equal(partsWithRole(mine.mesh, 'weapon_plasma_mine_proximity_sensor').length, 4);
  assert.equal(partsWithRole(mine.mesh, 'weapon_plasma_mine_emissive_core').length, 1);
});

test('shuriken et fusée de poignet disposent aussi de silhouettes multi-pièces tout en gardant leurs contrats', () => {
  const shurikenPlayer = makePlayer();
  shurikenPlayer.energy = 100;
  assert.equal(shurikenPlayer.fireShuriken(TARGET), true);
  const shuriken = shurikenPlayer.projectiles.at(-1);
  assert.deepEqual(
    { type: shuriken.type, speed: shuriken.speed, damage: shuriken.damage, lifetime: shuriken.lifetime },
    { type: 'shuriken', speed: 92, damage: 62, lifetime: 3 },
  );
  assert.equal(shurikenPlayer.energy, 88);
  assert.equal(shurikenPlayer.shurikenCooldown, 2.4);
  assertDetailedAssembly(shuriken.mesh, 'collapsible_shuriken', 16, 3_000);
  assert.equal(partsWithRole(shuriken.mesh, 'weapon_shuriken_serrated_blade').length, 6);

  const rocketPlayer = makePlayer();
  rocketPlayer.energy = 100;
  rocketPlayer.selectedWeapon = 14;
  rocketPlayer.attack(TARGET);
  const rocket = rocketPlayer.projectiles.at(-1);
  assert.deepEqual(
    {
      type: rocket.type,
      speed: rocket.speed,
      damage: rocket.damage,
      blastRadius: rocket.blastRadius,
      lifetime: rocket.lifetime,
    },
    { type: 'wrist_rocket', speed: 104, damage: 96, blastRadius: 7.5, lifetime: 2.8 },
  );
  assert.equal(rocketPlayer.energy, 72);
  assertDetailedAssembly(rocket.mesh, 'wrist_rocket', 11, 2_000);
  assert.equal(partsWithRole(rocket.mesh, 'weapon_wrist_rocket_guidance_fin').length, 4);
  assert.equal(partsWithRole(rocket.mesh, 'weapon_wrist_rocket_warhead').length, 1);
});
