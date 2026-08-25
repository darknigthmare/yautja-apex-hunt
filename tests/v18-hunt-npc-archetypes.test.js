import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_TEXTURES,
  HUNT_NPC_TYPE_ALIASES,
  HuntNPC,
  V18_HUNT_NPC_ARCHETYPES,
  resolveHuntNpcType,
} from '../src/entities/HuntNPC.js';

const V18_TYPES = [
  'jungle_scout',
  'jungle_gunner',
  'jungle_trapper',
  'era_viking_raider',
  'era_feudal_duelist',
  'era_wartime_pilot',
  'genna_sporeback',
];

test('the v1.8 registry exposes seven tactically distinct canonical archetypes', () => {
  assert.deepEqual(Object.keys(V18_HUNT_NPC_ARCHETYPES), V18_TYPES);
  const tacticalProfiles = new Set();
  const expectedAttackKinds = {
    jungle_scout: 'projectile',
    jungle_gunner: 'projectile',
    jungle_trapper: 'projectile',
    era_viking_raider: 'charge',
    era_feudal_duelist: 'melee',
    era_wartime_pilot: 'projectile',
    genna_sporeback: 'charge',
  };

  for (const type of V18_TYPES) {
    const archetype = V18_HUNT_NPC_ARCHETYPES[type];
    assert.equal(AVAILABLE_HUNT_NPC_ARCHETYPES[type], archetype);
    assert.equal(archetype.type, type);
    assert.equal(archetype.attackKind, expectedAttackKinds[type]);
    assert.ok(archetype.health > 0);
    assert.ok(archetype.damage > 0);
    assert.ok(archetype.speed > 0);
    assert.ok(archetype.colliderRadius > 0);
    assert.ok(HUNT_NPC_TEXTURES[type]?.startsWith('/assets/textures/'));
    tacticalProfiles.add([
      archetype.attackKind,
      archetype.health,
      archetype.damage,
      archetype.speed,
      archetype.attackRange,
      archetype.attackInterval,
    ].join(':'));
  }

  assert.equal(tacticalProfiles.size, V18_TYPES.length);
  assert.equal(HUNT_NPC_TEXTURES.genna_sporeback, '/assets/textures/genna-sporeback-carapace.webp');
});

test('all v1.8 factories instantiate readable silhouettes with the shared collider contract', () => {
  const combatReads = new Set();
  const silhouettes = new Set();

  for (const type of V18_TYPES) {
    const npc = new HuntNPC(type, { id: `v18-shape-${type}`, position: [3, 0, -2] });
    assert.equal(npc.type, type);
    assert.ok(npc.mesh.isGroup);
    assert.ok(npc.mesh.children.length >= 10, `${type}: silhouette insuffisamment détaillée`);
    assert.equal(npc.mesh.userData.silhouette, type);
    assert.equal(npc.mesh.userData.npcType, type);
    assert.equal(npc.mesh.userData.colliderRadius, npc.colliderRadius);
    assert.equal(npc.position, npc.mesh.position);
    assert.deepEqual(npc.position.toArray(), [3, 0, -2]);
    assert.equal(typeof npc.mesh.userData.combatRead, 'string');
    assert.ok(npc.mesh.userData.combatRead.length > 0);
    silhouettes.add(npc.mesh.userData.silhouette);
    combatReads.add(npc.mesh.userData.combatRead);
    assert.equal(npc.dispose(), true);
    assert.equal(npc.dispose(), false);
  }

  assert.equal(silhouettes.size, V18_TYPES.length);
  assert.equal(combatReads.size, V18_TYPES.length);
});

test('canonical aliases resolve explicitly while unknown values never fall back', () => {
  const expectedAliases = {
    scout: 'jungle_scout',
    gunner: 'jungle_gunner',
    trapper: 'jungle_trapper',
    viking: 'era_viking_raider',
    feudal: 'era_feudal_duelist',
    wartime: 'era_wartime_pilot',
    sporeback: 'genna_sporeback',
    xeno: 'xeno_drone',
  };

  for (const [alias, canonical] of Object.entries(expectedAliases)) {
    assert.equal(HUNT_NPC_TYPE_ALIASES[alias], canonical);
    assert.equal(resolveHuntNpcType(alias), canonical);
    const npc = new HuntNPC(alias);
    assert.equal(npc.type, canonical);
    npc.dispose();
  }

  assert.equal(resolveHuntNpcType('  JUNGLE_SCOUT  '), 'jungle_scout');
  assert.equal(resolveHuntNpcType('unknown_hunt_target'), null);
  assert.equal(resolveHuntNpcType(''), null);
  assert.equal(resolveHuntNpcType(null), null);
  assert.equal(resolveHuntNpcType(42), null);
  assert.throws(() => new HuntNPC('unknown_hunt_target'), /Unknown hunt NPC archetype/);
});

test('v1.8 silhouettes support thermal and tech vision then release runtime resources', () => {
  for (const type of V18_TYPES) {
    const npc = new HuntNPC(type);
    const scene = new THREE.Scene();
    scene.add(npc.mesh);
    const materials = [];
    npc.mesh.traverse((node) => {
      if (node.material?.color) materials.push(node.material);
    });
    assert.ok(materials.length > 0);
    const normalColors = materials.map((material) => material.color.getHex());

    assert.equal(npc.setVisionMode('thermal'), true);
    assert.equal(npc.mesh.userData.visionMode, 'thermal');
    assert.ok(materials.some((material, index) => material.color.getHex() !== normalColors[index]));

    assert.equal(npc.setVisionMode('tech'), true);
    assert.equal(npc.mesh.userData.visionMode, 'tech');
    assert.ok(materials.every((material) => material.color.getHex() === 0x4de8ff));

    assert.equal(npc.setVisionMode('normal'), true);
    assert.equal(npc.mesh.userData.visionMode, 'normal');
    assert.deepEqual(materials.map((material) => material.color.getHex()), normalColors);

    let projectileDisposals = 0;
    const projectileMesh = new THREE.Group();
    scene.add(projectileMesh);
    npc.projectiles.push({
      mesh: projectileMesh,
      dispose() { projectileDisposals += 1; },
    });

    assert.equal(npc.dispose(), true);
    assert.equal(projectileDisposals, 1);
    assert.equal(npc.mesh.parent, null);
    assert.equal(projectileMesh.parent, null);
    assert.equal(npc.projectiles.length, 0);
    assert.equal(npc.setVisionMode('thermal'), false);
    assert.equal(npc.dispose(), false);
  }
});
