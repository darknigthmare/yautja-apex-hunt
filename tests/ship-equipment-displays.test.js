import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { PLAYABLE_WEAPONS, ARMOR_PRESET_WEAPON_VARIANTS } from '../src/data/RuntimeEquipment.js';
import { attachShipEquipmentDisplays, SHIP_EQUIPMENT_DISPLAY_ITEMS } from '../src/world/ShipEquipmentDisplays.js';
import { createShipTrophyGeometry } from '../src/world/ShipTrophyGeometry.js';

test('the armory shows six real runtime equipment references with their playable/source identities', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const registry = attachShipEquipmentDisplays(hub);
    assert.equal(new Set(registry.entries.map(entry => entry.id)).size, registry.entries.length);
    assert.equal(attachShipEquipmentDisplays(hub), registry, 'reattaching must not duplicate exhibits');
    const equipment = registry.entries.filter(entry => entry.inspectionType === 'equipment');
    assert.equal(equipment.length, 6);
    for (const entry of equipment) {
      const definition = SHIP_EQUIPMENT_DISPLAY_ITEMS.find(item => item.itemId === entry.itemId);
      const reference = PLAYABLE_WEAPONS.find(item => item.id === entry.itemId);
      assert.ok(definition);
      if (reference) assert.deepEqual(entry.sources, reference.sources);
      else assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some(item => item.id === entry.variantId));
      assert.equal(entry.fidelityVerified, false);
      assert.ok(entry.object.parent && entry.source.length > 0);
      assert.equal(entry.object.userData.modelStatus, definition.modelBuilder ? 'runtime_weapon_geometry' : 'existing_equipment_display_geometry');
    }
    const features = itemId => equipment.find(entry => entry.itemId === itemId).object.userData.runtimeGeometryFeatures;
    assert.ok(features('combi_stick').includes('weapon_combistick_segmented_shaft'));
    assert.ok(features('smart_disc').includes('weapon_smart_disc_serrated_blade'));
    assert.ok(features('netgun').includes('weapon_netgun_woven_cable'));
    assert.ok(features('wristblades').includes('equipment_wristblade_tapered_blade'));
  } finally { hub.dispose(); }
});

test('equipment retains playable world scale and has distinct mounted positions inside the armory', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const registry = attachShipEquipmentDisplays(hub);
    hub.group.updateMatrixWorld(true);
    const boxes = [];
    for (const entry of registry.entries.filter(entry => entry.inspectionType === 'equipment')) {
      const bounds = new THREE.Box3().setFromObject(entry.object), size = bounds.getSize(new THREE.Vector3());
      assert.ok(size.toArray().every(value => Number.isFinite(value) && value > 0));
      assert.deepEqual(entry.object.scale.toArray(), [1, 1, 1], `${entry.itemId}: display silently changed runtime scale`);
      assert.ok(bounds.min.y > 0.3 && bounds.max.y < 9.4, `${entry.itemId}: model clips the floor/cabinet`);
      assert.ok(bounds.min.x > 36 && bounds.max.x < 64 && bounds.min.z > -4 && bounds.max.z < 30,
        `${entry.itemId}: display left the armory compartment`);
      if (entry.itemId === 'combi_stick') assert.ok(size.y > 5.8 && size.y < 6.3, 'a full runtime staff must remain about two metres long');
      if (entry.itemId === 'netgun') assert.ok(size.y > 3.7 && size.y < 4.2, 'the displayed net must retain its actual deployed diameter');
      boxes.push({ id: entry.itemId, bounds });
    }
    for (let left = 0; left < boxes.length; left++) for (let right = left + 1; right < boxes.length; right++) {
      const a = boxes[left].bounds, b = boxes[right].bounds;
      assert.equal(a.min.y < b.max.y && a.max.y > b.min.y && a.min.z < b.max.z && a.max.z > b.min.z, false,
        `${boxes[left].id} overlaps ${boxes[right].id} on the display wall`);
    }
  } finally { hub.dispose(); }
});

test('fifteen source-aware cranial/carapace studies replace abstract trophy and contract primitives', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const registry = attachShipEquipmentDisplays(hub);
    assert.equal(registry.entries.filter(entry => entry.inspectionType === 'trophy').length, 15);
    assert.equal(registry.entries.filter(entry => entry.inspectionType === 'contract_projection').length, 15);
    for (const definition of Object.values(HUNT_DEFINITIONS)) {
      const trophy = hub.trophyDisplays.get(definition.id), projection = hub.group.getObjectByName(`hologram-${definition.id}`);
      assert.equal(trophy.userData.sourceBossType, definition.bossType);
      assert.equal(trophy.geometry.userData.sourceBossType, definition.bossType);
      assert.equal(trophy.geometry, projection.geometry, 'archive and projection should share their owned cranial geometry');
      assert.equal(trophy.geometry.groups.length, 0);
      assert.equal(trophy.material.vertexColors, true);
      assert.ok(trophy.geometry.attributes.position.count / 3 < 1600);
      assert.ok(trophy.geometry.userData.features.includes(definition.bossType === 'kalisk' ? 'adaptive-carapace-fragment' :
        ['xenoQueen', 'gridAlien', 'predalien', 'xenoKing'].includes(definition.bossType) ? 'eyeless-elongated-cranium' : 'orbital-cavity'));
      assert.equal(trophy.userData.fidelityVerified, false);
    }
    hub.setTrophyState(['wolf_cleaner']);
    assert.equal(hub.trophyDisplays.get('wolf_cleaner').material.opacity, 1);
    assert.equal(hub.trophyDisplays.get('wolf_cleaner').material.wireframe, false);
    assert.equal(hub.trophyDisplays.get('goliath').material.opacity, 0.28);
    assert.equal(hub.trophyDisplays.get('goliath').material.wireframe, true);
    assert.equal(registry.entries.find(entry => entry.id === 'trophy:wolf_cleaner').unlocked, true);
    assert.equal(registry.entries.find(entry => entry.id === 'trophy:goliath').unlocked, false);
    assert.ok(registry.entries.filter(entry => entry.inspectionType === 'contract_projection').every(entry => entry.zone === 'mission-nexus'));
    assert.deepEqual(hub.trophyDisplays.get('wolf_cleaner').scale.toArray(), [1, 1, 1]);
    assert.deepEqual(hub.trophyDisplays.get('goliath').scale.toArray(), [0.78, 0.78, 0.78]);
  } finally { hub.dispose(); }
});

test('skull geometry has finite coordinates, recessed dark cavities and bounded display proportions', () => {
  for (const { bossType } of Object.values(HUNT_DEFINITIONS)) {
    const geometry = createShipTrophyGeometry(bossType);
    try {
      assert.ok(Array.from(geometry.attributes.position.array).every(Number.isFinite));
      assert.ok(Array.from(geometry.attributes.normal.array).every(Number.isFinite));
      assert.ok(Array.from(geometry.attributes.color.array).some(value => value < 0.1), `${bossType}: no recessed oral/orbital cavity`);
      const size = geometry.boundingBox.getSize(new THREE.Vector3());
      assert.ok(size.x <= 2.65001 && size.y <= 2.80001 && size.z <= 2.75001);
      assert.equal(geometry.userData.displayScale, 'normalized_study');
    } finally { geometry.dispose(); }
  }
  assert.throws(() => createShipTrophyGeometry('invented_unnamed_species'), RangeError);
});

test('shared archive geometry is disposed once and the whole display stays within the ship budget', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const registry = attachShipEquipmentDisplays(hub);
  const archive = hub.trophyDisplays.get('wolf_cleaner').geometry;
  let archiveDisposals = 0;
  archive.addEventListener('dispose', () => { archiveDisposals++; });
  const stats = hub.getPerformanceSnapshot();
  assert.ok(stats.drawCallEstimate <= 300);
  assert.ok(stats.triangleEstimate <= 500_000);
  const weaponGeometry = registry.entries.find(entry => entry.itemId === 'combi_stick').object.children[0].geometry;
  let weaponDisposals = 0;
  weaponGeometry.addEventListener('dispose', () => { weaponDisposals++; });
  hub.dispose(); hub.dispose();
  assert.equal(archiveDisposals, 1);
  assert.equal(weaponDisposals, 1);
  assert.equal(hub.group.children.length, 0);
  assert.equal(registry.entries.length, 0, 'disposed hub must release the inspection registry references');
});
