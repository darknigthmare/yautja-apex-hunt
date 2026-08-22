import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

const STILL = Object.freeze({ x: 0, z: 0, isSprinting: false });

test('les quatre classes modifient réellement les statistiques du chasseur', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  player.applyCustomization({ ...player.customization, hunterClassId: 'class_scout' });
  assert.equal(player.maxHealth, 85);
  assert.equal(player.maxEnergy, 115);
  assert.equal(player.sprintSpeed, 29);
  assert.equal(player.energyRegen, 10);

  player.applyCustomization({ ...player.customization, hunterClassId: 'class_berserker' });
  assert.equal(player.maxHealth, 130);
  assert.equal(player.meleeDamageMultiplier, 1.25);
  assert.equal(player.sprintSpeed, 23);
});

test('le bouclier coûte de l’énergie, absorbe les impacts et suit le delta', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  player.energy = 100;
  player.health = 100;
  assert.equal(player.activateWristShield(), true);
  assert.equal(player.energy, 75);
  assert.equal(player.toggleCloak(), false);
  assert.equal(player.isCloaked, false);
  assert.equal(player.wristShieldMesh.visible, true);

  const impact = player.takeDamage(50);
  assert.equal(impact.absorbed, 34);
  assert.equal(impact.damage, 16);
  assert.equal(player.health, 84);
  assert.equal(player.activateWristShield(), false);

  player.update(3.5, STILL, 0);
  assert.equal(player.wristShieldActive, false);
  assert.equal(player.wristShieldMesh.visible, false);
  assert.ok(player.wristShieldCooldown > 0);
});

test('le drone et le shuriken créent des objets 3D actifs avec leurs recharges', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  player.energy = 100;

  assert.equal(player.deployScoutDrone(), true);
  assert.ok(player.scoutDrone?.isGroup);
  assert.equal(scene.children.includes(player.scoutDrone), true);
  assert.equal(player.fireShuriken(new THREE.Vector3(0, 4, -30)), true);
  assert.equal(player.projectiles.at(-1).type, 'shuriken');
  assert.equal(player.projectiles.at(-1).damage, 62);
  assert.equal(player.fireShuriken(new THREE.Vector3(0, 4, -30)), false);

  player.update(7, STILL, 0);
  assert.equal(player.scoutDrone, null);
  assert.equal(player.shurikenCooldown, 0);
});

test('les gadgets temporaires disparaissent proprement à la fin d’une chasse', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  player.energy = 100;
  assert.equal(player.deployScoutDrone(), true);
  const drone = player.scoutDrone;
  assert.equal(player.activateWristShield(), true);

  assert.equal(player.clearTransientGadgets(), true);
  assert.equal(player.scoutDrone, null);
  assert.equal(scene.children.includes(drone), false);
  assert.equal(player.scoutDroneTimer, 0);
  assert.equal(player.wristShieldActive, false);
  assert.equal(player.wristShieldMesh.visible, false);
  assert.equal(player.clearTransientGadgets(), false, 'le nettoyage reste idempotent');
});

test('le rugissement ne recharge énergie et endurance qu’une fois par chasse', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  player.energy = 10;
  player.stamina = 10;
  assert.equal(player.triggerVictoryRoar(), true);
  assert.equal(player.energy, 32);
  assert.equal(player.stamina, 40);
  assert.equal(player.triggerVictoryRoar(), false);
  assert.equal(player.energy, 32);
  player.resetForHunt();
  assert.equal(player.roarUsed, false);
});
