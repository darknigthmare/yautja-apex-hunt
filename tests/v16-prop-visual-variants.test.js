import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  BIOME_PROP_CATALOG,
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../src/data/BiomePropCatalog.js';
import { BiomePropBuilder } from '../src/world/BiomePropBuilder.js';

const TEXTURE = '/assets/textures/ryushi-frontier-panels.webp';

function makeBuilder(onMaterial = () => {}) {
  return new BiomePropBuilder({
    createTexturedMaterial(options) {
      onMaterial(options);
      return new THREE.MeshStandardMaterial({
        color: options.color,
        roughness: options.roughness,
        metalness: options.metalness,
      });
    },
  });
}

function makeSpec(type, index = 0) {
  return {
    id: `visual-${type}-${index}`,
    type,
    texture: TEXTURE,
    position: [index * 4, 0, -index * 3],
    rotation: 0,
    scale: 1,
    instances: 5,
  };
}

function meshSignature(root) {
  const signature = [];
  root.traverse((object) => {
    if (!object.isMesh) return;
    const parameters = object.geometry?.parameters ?? {};
    const dimensions = [
      parameters.width,
      parameters.height,
      parameters.depth,
      parameters.radius,
      parameters.radiusTop,
      parameters.radiusBottom,
      parameters.tube,
      parameters.detail,
    ].map((value) => Number.isFinite(value) ? Number(value.toFixed(3)) : '-');
    signature.push([
      object.geometry?.type,
      object.isInstancedMesh ? object.count : 1,
      dimensions.join(','),
      object.position.toArray().map((value) => Number(value.toFixed(2))).join(','),
      [object.rotation.x, object.rotation.y, object.rotation.z].map((value) => Number(value.toFixed(2))).join(','),
    ].join('|'));
  });
  return signature.sort().join('::');
}

test('les matières biome spécialisées restent réellement paresseuses et partagées', () => {
  const requests = [];
  const builder = makeBuilder((options) => requests.push(options.path));
  const materials = builder.createMaterials({ biomeId: 'jungle' });

  assert.deepEqual(requests, []);
  assert.equal(materials.isLoaded('bone'), false);
  const firstBone = materials.bone;
  assert.deepEqual(requests, ['/assets/textures/trophy-bone.webp']);
  assert.equal(materials.bone, firstBone, 'le getter doit réutiliser le matériau partagé');
  assert.equal(requests.length, 1);
  assert.equal(materials.isLoaded('membrane'), false);
  void materials.membrane;
  assert.equal(requests.at(-1), '/assets/textures/hive-biomechanical-membrane.webp');
  assert.equal(materials.isLoaded('spore'), false);
  void materials.spore;
  assert.equal(requests.at(-1), '/assets/textures/genna-spore-pod-hide.webp');
});

test('les facilities ont cinq silhouettes runtime distinctes et une variante explicite', () => {
  const types = ['field_camp', 'frontier_homestead', 'wreckage', 'expedition_wreck', 'signal_array'];
  const builder = makeBuilder();
  const materials = builder.createMaterials({ biomeId: 'jungle' });
  const props = types.map((type, index) => builder.createProp(makeSpec(type, index), materials));

  assert.deepEqual(props.map(({ userData }) => userData.visualVariant), types);
  assert.equal(new Set(props.map(({ userData }) => userData.visualSignature)).size, types.length);
  assert.equal(new Set(props.map(meshSignature)).size, types.length, 'les noms seuls ne doivent pas distinguer les facilities');
});

test('chaque sanctuaire possède une composition et une signature reconnaissables', () => {
  const types = ['trophy_tree', 'royal_dais', 'blooding_dais', 'weapon_shrine', 'trophy_gallery', 'kalisk_nest'];
  const builder = makeBuilder();
  const materials = builder.createMaterials({ biomeId: 'yautja_prime' });
  const props = types.map((type, index) => builder.createProp(makeSpec(type, index), materials));

  assert.deepEqual(props.map(({ userData }) => userData.visualVariant), types);
  assert.equal(new Set(props.map(({ userData }) => userData.visualSignature)).size, types.length);
  assert.equal(new Set(props.map(meshSignature)).size, types.length);
  assert.ok(props.every((prop) => prop.children.length >= 4));
});

test('canisters, coupe-vent, couverture et nœuds de régénération gardent l instancing mais pas le cube générique', () => {
  const types = ['cleaner_canisters', 'windbreak', 'cover_cluster', 'regen_node_line'];
  const builder = makeBuilder();
  const materials = builder.createMaterials({ biomeId: 'genna_deathworld' });
  const props = types.map((type, index) => builder.createProp(makeSpec(type, index), materials));

  props.forEach((prop, index) => {
    assert.equal(prop.userData.visualVariant, types[index]);
    assert.ok(prop.children.some(({ isInstancedMesh }) => isInstancedMesh), `${types[index]} doit rester instancié`);
    assert.ok(prop.children.length >= 2, `${types[index]} doit combiner plusieurs volumes`);
  });
  assert.equal(new Set(props.map(meshSignature)).size, types.length);
});

test('tous les POI de chaque biome ont des signatures visuelles runtime distinctes', () => {
  for (const biomeId of Object.keys(BIOME_PROP_CATALOG)) {
    const builder = makeBuilder();
    const build = builder.build(getBiomePropPlan(biomeId));
    const variants = build.pointsOfInterest.map(({ visualVariant, mesh }) => {
      assert.equal(visualVariant, mesh.userData.visualVariant);
      assert.ok(visualVariant.startsWith('poi-'));
      assert.ok(mesh.userData.visualSignature.length > 5);
      return visualVariant;
    });
    assert.equal(new Set(variants).size, variants.length, `${biomeId}: signatures POI confondues`);
    assert.equal(new Set(build.pointsOfInterest.map(({ mesh }) => meshSignature(mesh))).size, build.pointsOfInterest.length);
    assert.ok(build.props.every(({ visualVariant, mesh }) => visualVariant === mesh.userData.visualVariant));
    assert.ok(build.metrics.drawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls, `${biomeId}: draw calls`);
    assert.ok(build.metrics.triangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles, `${biomeId}: triangles`);
  }
});

test('les dangers non acides séparent le pulse décoratif de la frontière gameplay exacte', () => {
  const specs = Object.values(BIOME_PROP_CATALOG)
    .flatMap(({ hazardZones }) => hazardZones)
    .filter(({ type }) => type !== 'acid_pool');

  specs.forEach((spec) => {
    const builder = makeBuilder();
    const materials = builder.createMaterials({ biomeId: 'genna_deathworld' });
    const hazard = builder.createHazard(spec, materials);
    assert.equal(hazard.visualVariant, `hazard-${spec.type}`);
    assert.equal(hazard.boundaryRing.parent, hazard.mesh);
    assert.equal(hazard.pulseRoot.parent, hazard.mesh);
    assert.notEqual(hazard.boundaryRing.parent, hazard.pulseRoot);
    assert.equal(hazard.boundaryRing.userData.gameplayRadius, spec.radius);
    assert.equal(hazard.boundaryRing.userData.baseGeometryRadius, 1);
    assert.equal(hazard.boundaryRing.geometry.parameters.radius * hazard.boundaryRing.scale.x, spec.radius);
    assert.equal(hazard.boundaryRing.userData.decorativePulse, false);
    const boundaryScale = hazard.boundaryRing.scale.clone();
    hazard.pulseRoot.scale.setScalar(1.08);
    assert.ok(hazard.boundaryRing.scale.equals(boundaryScale), 'la bordure ne doit pas pulser avec le décor');
  });
});
