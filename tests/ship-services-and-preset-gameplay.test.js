import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { ShipServiceRuntime } from '../src/gameplay/ShipServiceRuntime.js';
import { SaveManager } from '../src/engine/SaveManager.js';
import { applyCraftedEquipmentToPlayer } from '../src/gameplay/CraftedEquipmentRuntime.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import { MedbayInventoryOverlay } from '../src/ui/MedbayInventoryOverlay.js';

const target = new THREE.Vector3(0, 4, -30);
const idle = { x: 0, z: 0 };
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);
function playerTest(action) {
  const player = new YautjaPlayer(new THREE.Scene());
  try { return action(player); } finally { player.resetForHunt(); disposeObject3D(player.mesh); }
}

test('living return and deployment preserve wounds, reserves and broken shield without carrying combat into the ship', () => playerTest(player => {
  player.health = 28; player.energy = 12; player.stamina = 23;
  player.isAcidCorroded = true; player.acidTimer = 4; player.isBleeding = true;
  player.wristShieldIntegrity = 7; player.medbayInventory.charges.dermal_stapler = 0;
  player.selectedWeapon = 2; player.attack(target); // Insufficient energy must not create a projectile.
  player.inQTE = true; player.combatStatusTimers.snare = 4; player.activeVisionMode = 'thermal';
  const arrival = player.resetForHub(new THREE.Vector3(10, 0, 10));
  assert.equal(arrival.wasIncapacitated, false);
  assert.equal(arrival.requiresMedicalRecovery, false);
  assert.equal(arrival.hasUntreatedWounds, true);
  assert.deepEqual([player.health, player.energy, player.stamina, player.wristShieldIntegrity], [28, 12, 23, 7]);
  assert.equal(player.inQTE, false); assert.equal(player.combatStatusTimers.snare, 0);
  assert.equal(player.activeVisionMode, 'normal'); assert.equal(player.isAcidCorroded, true);
  player.update(0.5, idle, 0);
  assert.equal(player.health, 28); assert.equal(player.acidTimer, 4, 'ship safety must not silently cure the contamination');
  const before = player.getRecoverySnapshot();
  player.resetForDeployment(new THREE.Vector3(0, 0, 60));
  assert.deepEqual(player.getRecoverySnapshot(), before);
  assert.equal(player.medbayInventory.charges.dermal_stapler, 0);
  player.update(0.1, idle, 0);
  assert.ok(player.health < 28); assert.ok(player.acidTimer < 4);
}));

test('defeated hunters arrive alive but critically injured, with treatment rather than a silent full heal', () => playerTest(player => {
  player.health = 0; player.isDead = true; player.selfDestructComplete = true;
  const arrival = player.resetForHub();
  assert.deepEqual(arrival, { wasIncapacitated: true, requiresMedicalRecovery: true, hasUntreatedWounds: true });
  assert.equal(player.health, 1); assert.equal(player.isDead, false); assert.equal(player.isSelfDestructing, false);
  player.update(0.1, { x: 1, z: 0 }, 0);
  assert.ok(player.position.x > 0, 'emergency recovery must not strand a paralysed player');
  const services = new ShipServiceRuntime(player);
  assert.equal(player.resetForDeployment(target).reason, 'emergency_medical_required');
  services.perform('restore_vitals', { gameState: 'HUB', station: { interactionType: 'cryo' } });
  assert.equal(player.resetForDeployment(target).success, false, 'cryostase must not bypass required emergency treatment');
  const result = services.perform('medical', { gameState: 'HUB', station: { interactionType: 'cleaner_lab' } });
  assert.equal(result.success, true); assert.equal(player.health, player.maxHealth);
  assert.equal(player.requiresMedicalRecovery, false);
  assert.equal(player.resetForDeployment(target).success, true);
}));

test('three stations apply distinct real services, are idempotent and cannot mint rewards or operate during a hunt', () => playerTest(player => {
  player.resetForHub(); player.health = 20; player.stamina = 15; player.energy = 9;
  player.isAcidCorroded = true; player.acidTimer = 4; player.isBleeding = true;
  player.medbayInventory.charges.dermal_stapler = 0; player.wristShieldIntegrity = 5;
  player.honorScore = 4321; player.lifetimeHonor = 4321;
  let saves = 0;
  const services = new ShipServiceRuntime(player, { onChange: () => saves++ });
  const service = (id, type, gameState = 'HUB') => services.perform(id, { gameState, station: { interactionType: type } });
  assert.equal(service('medical', 'cleaner_lab', 'HUNT').success, false);
  assert.equal(service('medical', 'core').success, false);
  assert.equal(service('restore_vitals', 'cryo').changed, true);
  assert.deepEqual([player.health, player.stamina, player.energy], [100, 100, 9]);
  assert.equal(player.isAcidCorroded, true); assert.equal(player.medbayInventory.charges.dermal_stapler, 0);
  assert.equal(service('restore_vitals', 'cryo').changed, false);
  assert.equal(service('medical', 'cleaner_lab').changed, true);
  assert.equal(player.isAcidCorroded, false); assert.equal(player.isBleeding, false);
  assert.equal(player.medbayInventory.charges.dermal_stapler, 3); assert.equal(player.energy, 9);
  assert.equal(service('medical', 'cleaner_lab').changed, false);
  assert.equal(service('recharge', 'core').changed, true);
  assert.equal(player.energy, 100); assert.equal(player.wristShieldIntegrity, 100);
  assert.equal(service('recharge', 'core').changed, false);
  assert.equal(saves, 3); assert.equal(player.honorScore, 4321); assert.equal(player.lifetimeHonor, 4321);
}));

test('save/reload retains transport, consumed medical stock and class/crafted health ratios instead of granting a free service', () => {
  const old = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key),
  } });
  try {
    playerTest(player => playerTest(restored => {
      player.applyCustomization({ hunterClassId: 'class_berserker' });
      applyCraftedEquipmentToPlayer(player, { bonusHealth: 250 });
      player.health = 190; player.energy = 17; player.stamina = 45;
      player.isBleeding = true; player.isAcidCorroded = true; player.acidTimer = 3;
      player.requiresMedicalRecovery = true;
      player.medbayInventory.charges.dermal_stapler = 0; player.wristShieldIntegrity = 4;
      player.medbayInventory.totalTreatmentsApplied = 5; player.medbayInventory.lastUsedItemId = 'dermal_stapler';
      const services = new ShipServiceRuntime(player);
      assert.equal(services.selectTransport('pod', { gameState: 'HUNT' }).success, false);
      assert.equal(services.selectTransport('pod', { gameState: 'HUB' }).success, true);
      const manager = new SaveManager(); assert.equal(manager.save(player), true);
      assert.equal(manager.load(restored).loaded, true);
      restored.applyCustomization(restored.customization);
      applyCraftedEquipmentToPlayer(restored, { bonusHealth: 250 });
      assert.equal(restored.restoreSavedRecovery(), true);
      restored.resetForHub();
      near(restored.health, 190); near(restored.energy, 17); near(restored.stamina, 45);
      assert.equal(restored.wristShieldIntegrity, 4); assert.equal(restored.isBleeding, true);
      assert.equal(restored.acidTimer, 3); assert.equal(restored.medbayInventory.charges.dermal_stapler, 0);
      assert.equal(restored.medbayInventory.totalTreatmentsApplied, 5);
      assert.equal(restored.medbayInventory.lastUsedItemId, 'dermal_stapler');
      assert.equal(restored.requiresMedicalRecovery, true);
      assert.equal(restored.resetForDeployment(target).reason, 'emergency_medical_required');
      assert.equal(new ShipServiceRuntime(restored).getDeploymentTransport().kind, 'pod');
    }));
  } finally {
    if (old) Object.defineProperty(globalThis, 'localStorage', old); else delete globalThis.localStorage;
  }
});

test('Berserker caster produces its actual powered burst, pays its cost and revokes it with the preset', () => playerTest(player => {
  player.setSkin('berserker_2010'); player.selectedWeapon = 2;
  player.attack(target);
  assert.equal(player.projectiles.length, 3); near(player.energy, 71.25); near(player.attackTimer, 0.732);
  for (const shot of player.projectiles) { near(shot.damage, 59.4); near(shot.speed, 76.7); }
  player.resetForHunt(); player.hasTriBeam = true; player.selectedWeapon = 2; player.attack(target);
  assert.equal(player.projectiles.length, 3, 'two three-shot profiles must not multiply into nine free projectiles');
  player.resetForHunt(); player.hasTriBeam = false; player.setSkin('jungle_1987'); player.selectedWeapon = 2; player.attack(target);
  assert.equal(player.projectiles.length, 1); assert.equal(player.projectiles[0].damage, 45);
}));

test('City darts and Celtic nets apply their declared speed, cost, range and duration modifiers to real shots', () => playerTest(player => {
  player.setSkin('city_1990'); player.selectedWeapon = 0; player.attack(target);
  near(player.projectiles[0].damage, 110); near(player.projectiles[0].speed, 153.4);
  near(player.energy, 91); near(player.attackTimer, 0.3325);
  player.resetForHunt(); player.setSkin('celtic_avp'); player.selectedWeapon = 5; player.attack(target);
  const net = player.projectiles[0];
  near(net.damage, 18); near(net.lifetime, 3.45); near(net.netDurationMultiplier, 1.25);
  near(player.energy, 84.25); near(player.attackTimer, 0.55);
}));

test('Wolf whip has real damage/cadence modifiers and Cleaner treatment purges acid with a bounded immunity', () => playerTest(player => {
  player.setSkin('wolf_avpr'); player.selectedWeapon = 8;
  assert.equal(player.attack(target), 'whip_slash'); near(player.meleeDamageMultiplier, 1.26); near(player.attackTimer, 0.38);
  player.resetForHunt(); player.selectedWeapon = 6; player.isAcidCorroded = true; player.acidTimer = 5; player.health = 50;
  assert.equal(player.attack(target), 'medicomp'); near(player.energy, 100); assert.equal(player.health, 50);
  const overlay = new MedbayInventoryOverlay({ player, inventoryState: player.medbayInventory });
  const treatment = overlay.executeItemAction('acid_neutralizer_vial');
  assert.equal(treatment.success, true); near(treatment.healthRestored, 30); near(player.health, 80);
  assert.equal(player.medbayInventory.charges.acid_neutralizer_vial, 1);
  assert.equal(player.isAcidCorroded, false); assert.equal(player.acidTimer, 0);
  near(player.medicalAcidImmunityTimer, 4);
  assert.equal(player.applyAcidCorrosion(), false);
  assert.equal(player.takeDamage(10, { type: 'acid' }).damage, 0);
  assert.equal(player.takeDamage(10, 'acid').damage, 0);
  player.update(4.01, idle, 0); assert.equal(player.applyAcidCorrosion(), true);
}));

test('City surgery uses the same component as the overlay, while its animation never delivers a second free heal', () => playerTest(player => {
  player.setSkin('city_1990'); player.selectedWeapon = 6; player.health = 10;
  assert.equal(player.attack(target), 'medicomp'); near(player.energy, 100); near(player.health, 10);
  const overlay = new MedbayInventoryOverlay({ player, inventoryState: player.medbayInventory });
  assert.equal(overlay.executeItemAction('dermal_stapler').success, true);
  near(player.health, 53.75); near(player.energy, 100); near(player.healTimer, 1.2 / 1.3);
  near(player.medbayInventory.cooldowns.dermal_stapler, 1.5 / 1.3);
  assert.equal(player.medbayInventory.charges.dermal_stapler, 2);
  assert.equal(overlay.executeItemAction('dermal_stapler').success, false);
  player.setSkin('jungle_1987'); player.update(1.3, idle, 0); near(player.health, 53.75);
  player.resetForHunt(); player.selectedWeapon = 6; player.health = 10;
  assert.equal(player.applyMedicalTreatment('dermal_stapler').success, true);
  player.takeDamage(100); player.update(1.3, idle, 0);
  assert.equal(player.health, 0); assert.equal(player.isHealing, false);
}));

test('an exhausted kit cannot be bypassed by attacking with the Medicomp or opening the overlay', () => playerTest(player => {
  player.health = 1; player.requiresMedicalRecovery = true; player.selectedWeapon = 6;
  for (const id of Object.keys(player.medbayInventory.charges)) player.medbayInventory.charges[id] = 0;
  const overlay = new MedbayInventoryOverlay({ player, inventoryState: player.medbayInventory });
  assert.equal(player.attack(target), 'medicomp');
  assert.equal(overlay.executeItemAction('coagulant_blue_paste').success, false);
  assert.equal(player.applyMedicalTreatment('dermal_stapler').success, false);
  assert.equal(player.health, 1); assert.equal(player.energy, 100);
  player.medbayInventory.charges.dermal_stapler = 1;
  assert.equal(overlay.executeItemAction('dermal_stapler').success, true);
  assert.equal(player.requiresMedicalRecovery, true, 'a portable component must not clear emergency medical discharge');
  assert.equal(player.resetForDeployment(target).success, false);
}));
