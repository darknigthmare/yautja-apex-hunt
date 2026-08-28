import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_LOD_PROFILES,
  HuntNPC,
} from '../src/entities/HuntNPC.js';

function collectMeshes(root) {
  const meshes = [];
  root.traverse((node) => {
    if (node.isMesh) meshes.push(node);
  });
  return meshes;
}

function collectDetailedMeshes(npc) {
  return npc.detailedVisuals.flatMap((visual) => collectMeshes(visual));
}

function collectMaterials(root) {
  const materials = new Set();
  root.traverse((node) => {
    const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
    nodeMaterials.forEach((material) => {
      if (material) materials.add(material);
    });
  });
  return materials;
}

test('les 31 archétypes disposent de deux niveaux visuels et réduisent les draws distants d’au moins 75 %', () => {
  const types = Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES);
  assert.equal(types.length, 31);
  assert.deepEqual(Object.keys(HUNT_NPC_LOD_PROFILES).sort(), [...types].sort());

  for (const type of types) {
    const npc = new HuntNPC(type);
    const detailedMeshes = collectDetailedMeshes(npc);
    const distantMeshes = collectMeshes(npc.lodGroup);
    const reduction = 1 - (distantMeshes.length / detailedMeshes.length);

    assert.equal(npc.detailedGroup, npc.mesh, `${type}: groupe détaillé racine absent`);
    assert.equal(npc.mesh.children.includes(npc.lodGroup), true, `${type}: groupe distant absent`);
    assert.ok(npc.detailedVisuals.every((visual) => visual.visible), `${type}: détail masqué au départ`);
    assert.equal(npc.lodGroup.visible, false, `${type}: silhouette visible au départ`);
    assert.ok(distantMeshes.length >= 2 && distantMeshes.length <= 4,
      `${type}: silhouette distante à ${distantMeshes.length} meshes`);
    assert.ok(reduction >= 0.75,
      `${type}: réduction ${(reduction * 100).toFixed(1)} % (${detailedMeshes.length} -> ${distantMeshes.length})`);
    assert.equal(npc.lodMetrics.detailedDrawCalls, detailedMeshes.length);
    assert.equal(npc.lodMetrics.distantDrawCalls, distantMeshes.length);
    assert.equal(npc.lodMetrics.drawCallReduction, reduction);
    assert.equal(npc.lodGroup.userData.lodFamily, HUNT_NPC_LOD_PROFILES[type].family);
    assert.ok(distantMeshes.every((mesh) => mesh.castShadow === false && mesh.receiveShadow === false),
      `${type}: le LOD distant ne doit pas produire d’ombres`);
    npc.dispose();
  }
});

test('les seuils 185–210 unités utilisent une hystérésis stable sans modifier le gameplay', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type);
    const profile = HUNT_NPC_LOD_PROFILES[type];
    const initial = {
      health: npc.health,
      damage: npc.damage,
      colliderRadius: npc.colliderRadius,
      attackRange: npc.attackRange,
      position: npc.position.clone(),
    };
    assert.ok(profile.switchDistance >= 185 && profile.switchDistance <= 210, `${type}: seuil hors plage`);
    assert.ok(profile.returnDistance < profile.switchDistance, `${type}: hystérésis absente`);

    npc.update(0, { player: { position: new THREE.Vector3(0, 0, profile.switchDistance + 1) } });
    assert.equal(npc.lodLevel, 'distant', `${type}: pas de bascule distante`);
    assert.ok(npc.detailedVisuals.every((visual) => visual.visible === false));
    assert.equal(npc.lodGroup.visible, true);

    npc.update(0, { player: { position: new THREE.Vector3(0, 0, profile.returnDistance + 1) } });
    assert.equal(npc.lodLevel, 'distant', `${type}: oscillation dans la bande d’hystérésis`);

    npc.update(0, { player: { position: new THREE.Vector3(0, 0, profile.returnDistance - 1) } });
    assert.equal(npc.lodLevel, 'detailed', `${type}: pas de retour au détail`);
    assert.ok(npc.detailedVisuals.every((visual) => visual.visible));
    assert.equal(npc.lodGroup.visible, false);
    assert.equal(npc.health, initial.health);
    assert.equal(npc.damage, initial.damage);
    assert.equal(npc.colliderRadius, initial.colliderRadius);
    assert.equal(npc.attackRange, initial.attackRange);
    assert.deepEqual(npc.position.toArray(), initial.position.toArray());
    npc.dispose();
  }
});

test('les visions thermique et technologique couvrent aussi la silhouette masquée', () => {
  const npc = new HuntNPC('gunnison_national_guard');
  npc.update(0, { player: { position: new THREE.Vector3(0, 0, 260) } });
  assert.equal(npc.lodLevel, 'distant');

  npc.setVisionMode('tech');
  assert.equal(npc.detailedGroup.userData.visionMode, 'tech');
  assert.equal(npc.lodGroup.userData.visionMode, 'tech');
  for (const material of collectMaterials(npc.mesh)) {
    assert.equal(material.color.getHex(), 0x4de8ff);
  }

  npc.setVisionMode('thermal');
  assert.equal(npc.detailedGroup.userData.visionMode, 'thermal');
  assert.equal(npc.lodGroup.userData.visionMode, 'thermal');
  assert.ok([...collectMaterials(npc.lodGroup)].every((material) => material.emissiveIntensity === 0.8));
  npc.dispose();
});

test('dispose libère les géométries et matériaux des deux groupes LOD', () => {
  const scene = new THREE.Scene();
  const npc = new HuntNPC('xeno_drone');
  scene.add(npc.mesh);
  const geometries = new Set(collectMeshes(npc.mesh).map((mesh) => mesh.geometry));
  const materials = collectMaterials(npc.mesh);
  const disposedGeometries = new Set();
  const disposedMaterials = new Set();

  for (const geometry of geometries) geometry.dispose = () => disposedGeometries.add(geometry);
  for (const material of materials) material.dispose = () => disposedMaterials.add(material);

  assert.equal(npc.dispose(), true);
  assert.equal(npc.mesh.parent, null);
  assert.equal(disposedGeometries.size, geometries.size);
  assert.equal(disposedMaterials.size, materials.size);
  assert.equal(npc.detailedGroup.userData.disposed, true);
  assert.equal(npc.lodGroup.userData.disposed, true);
  assert.equal(npc.mesh.userData.activeLod, 'disposed');
  assert.equal(npc.dispose(), false);
});
