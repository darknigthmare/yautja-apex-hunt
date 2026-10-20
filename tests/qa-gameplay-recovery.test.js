import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { SaveManager } from '../src/engine/SaveManager.js';
import { DEFAULT_SETTINGS } from '../src/data/GameConfig.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import {
  MEDBAY_ITEMS,
  applyMedbayItem,
  createMedbayInventoryState,
  prepareFieldMedbayInventory,
  refillMedbayInventory,
} from '../src/gameplay/YautjaMedbaySystem.js';

const healthyPatient = () => ({
  health: 100, maxHealth: 100,
  stamina: 100, maxStamina: 100,
  energy: 100, maxEnergy: 100,
});

test('les six composants médicaux conservent leurs charges si aucun effet n’est utile', () => {
  const inventory = createMedbayInventoryState();
  for (const item of MEDBAY_ITEMS) {
    const charges = inventory.charges[item.id];
    const result = applyMedbayItem(healthyPatient(), item.id, inventory, {});
    assert.equal(result.success, false, item.id);
    assert.equal(inventory.charges[item.id], charges);
    assert.equal(inventory.cooldowns[item.id], 0);
  }
  assert.equal(inventory.totalTreatmentsApplied, 0);
});

test('les soins de statut restent utiles à pleine santé et le stimulant restaure une seule ressource manquante', () => {
  const inventory = createMedbayInventoryState();
  const patient = { ...healthyPatient(), isBleeding: true, isAcidCorroded: true, acidTimer: 5 };
  assert.equal(applyMedbayItem(patient, 'shrapnel_extractor', inventory, {}).success, true);
  assert.equal(patient.isBleeding, false);
  assert.equal(applyMedbayItem(patient, 'acid_neutralizer_vial', inventory, {}).success, true);
  assert.equal(patient.isAcidCorroded, false);
  patient.energy = 60;
  assert.equal(applyMedbayItem(patient, 'stimulant_injector', inventory, {}).success, true);
  assert.equal(patient.energy, 95);
  assert.equal(patient.stamina, 100);
});

test('un patient mort ou engagé dans la détonation ne peut consommer un soin', () => {
  for (const state of [{ isDead: true }, { isSelfDestructing: true }, { health: 0 }]) {
    const inventory = createMedbayInventoryState();
    const patient = { ...healthyPatient(), health: 20, ...state };
    assert.equal(applyMedbayItem(patient, 'coagulant_blue_paste', inventory, {}).success, false);
    assert.equal(inventory.charges.coagulant_blue_paste, 2);
  }
});

test('les soins gratuits du laboratoire ne modifient pas les charges portables partagées', () => {
  const portable = createMedbayInventoryState();
  portable.charges.dermal_stapler = 0;
  const laboratory = { ...portable, isMothership: true };
  const patient = { ...healthyPatient(), health: 10 };
  assert.equal(applyMedbayItem(patient, 'dermal_stapler', laboratory, {}).success, true);
  assert.equal(patient.health, 45);
  assert.equal(portable.charges.dermal_stapler, 0);
  refillMedbayInventory(portable);
  assert.equal(portable.charges.dermal_stapler, 3);
  assert.equal(laboratory.charges.dermal_stapler, 3);
  assert.ok(Object.values(portable.charges).every(Number.isFinite));
});

test('le passage au terrain borne une ancienne réserve illimitée sans recharger le stock consommé', () => {
  const inventory = createMedbayInventoryState({ isMothership: true });
  inventory.charges.dermal_stapler = 1;
  inventory.charges.shrapnel_extractor = 0;
  prepareFieldMedbayInventory(inventory);
  assert.equal(inventory.isMothership, false);
  assert.equal(inventory.charges.thermal_cauterizer, 2);
  assert.equal(inventory.charges.dermal_stapler, 1);
  assert.equal(inventory.charges.shrapnel_extractor, 0);
  assert.ok(Object.values(inventory.charges).every(Number.isFinite));
  prepareFieldMedbayInventory(inventory);
  assert.equal(inventory.charges.dermal_stapler, 1);
  assert.equal(inventory.charges.shrapnel_extractor, 0);
});

test('une sauvegarde v4 aux réglages nuls conserve sa progression et restaure les options par défaut', () => {
  const manager = new SaveManager();
  const storage = globalThis.localStorage;
  const payload = JSON.stringify({ version: 4, player: { honorScore: 2450, completedHunts: ['goliath'] }, settings: null });
  globalThis.localStorage = { getItem: (key) => key === manager.STORAGE_KEY ? payload : null };
  try {
    const player = {};
    const result = manager.load(player);
    assert.equal(result.loaded, true);
    assert.equal(result.error, undefined);
    assert.equal(player.honorScore, 2450);
    assert.deepEqual(player.completedHunts, ['goliath']);
    assert.deepEqual(result.settings, DEFAULT_SETTINGS);
  } finally {
    if (storage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = storage;
  }
});

test('le redéploiement restaure un chasseur sans hémorragie ni ancien compteur d’immersion', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    player.isBleeding = true;
    player.waterDisruptionTimer = 1.9;
    player.medbayInventory.charges.dermal_stapler = Number.POSITIVE_INFINITY;
    player.medbayInventory.charges.shrapnel_extractor = 1;
    player.resetForHunt();
    assert.equal(player.isBleeding, false);
    assert.equal(player.waterDisruptionTimer, 0);
    assert.equal(player.medbayInventory.charges.dermal_stapler, 3);
    assert.equal(player.medbayInventory.charges.shrapnel_extractor, 1);
    player.update(0.1, { x: 0, z: 0 }, 0);
    assert.equal(player.health, player.maxHealth);
  } finally {
    disposeObject3D(player.mesh);
  }
});

test('le camouflage épuisé ne crée pas d’énergie négative et peut toujours être désactivé', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    player.energy = 0;
    assert.equal(player.toggleCloak(), false);
    player.energy = 1;
    assert.equal(player.toggleCloak(), true);
    player.update(0.5, { x: 0, z: 0 }, 0);
    assert.equal(player.energy, 0);
    assert.equal(player.isCloaked, false);
    player.energy = 50;
    player.toggleCloak();
    player.isAcidCorroded = true;
    assert.equal(player.toggleCloak(), false);
    assert.equal(player.isCloaked, false);
  } finally {
    disposeObject3D(player.mesh);
  }
});

test('le camouflage reste actif sur un sol sec sous zéro et ne court-circuite qu’en immersion explicite', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    player.position.y = -3;
    player.toggleCloak();
    for (let i = 0; i < 21; i++) player.update(0.1, { x: 0, z: 0 }, 0);
    assert.equal(player.isCloaked, true, 'un sol sec bas ne représente pas un volume d’eau');
    assert.equal(player.waterDisruptionTimer, 0);
    player.isSubmerged = true;
    for (let i = 0; i < 21; i++) player.update(0.1, { x: 0, z: 0 }, 0);
    assert.equal(player.isCloaked, false, 'une immersion réelle coupe le camouflage après deux secondes');
    player.resetForHunt();
    assert.equal(player.isSubmerged, false);
  } finally {
    disposeObject3D(player.mesh);
  }
});
