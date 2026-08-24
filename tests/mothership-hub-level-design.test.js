import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('le hub expose quatre silhouettes spatiales et une allée centrale praticable', () => {
  const hub = new MothershipHub(new THREE.Scene());

  assert.deepEqual(
    [...hub.landmarks.keys()].sort(),
    ['armory-forge', 'mission-nexus', 'trophy-vault', 'vehicle-hangar'],
  );
  assert.equal(hub.landmarks.get('armory-forge').position.x, 22);
  assert.equal(hub.landmarks.get('vehicle-hangar').position.x, -21);

  const missionStations = [];
  hub.landmarks.get('mission-nexus').traverse((object) => {
    if (object.name.startsWith('mission-station-')) missionStations.push(object);
  });
  assert.equal(missionStations.length, 8);
  assert.ok(
    missionStations.every(({ position }) => Math.abs(position.x) >= 5),
    'les socles holographiques doivent laisser un couloir central d’au moins quatre mètres',
  );

  const beacons = hub.propRegistry.filter(({ userData }) => userData.role === 'navigation-beacon');
  assert.equal(beacons.length, 4);
  assert.ok(beacons.every(({ position }) => Math.abs(position.x) >= 29));

  hub.dispose();
});

test('le vaisseau-mère possède un éclairage global de lecture et des accents de zone', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const lights = [];
  hub.group.traverse((object) => {
    if (object.isLight) lights.push(object);
  });

  assert.ok(lights.some(({ name, isHemisphereLight }) => (
    name === 'hub-ambient-fill-light' && isHemisphereLight
  )));
  assert.ok(lights.some(({ name, isAmbientLight }) => name === 'hub-readability-ambient-light' && isAmbientLight));
  for (const lightName of [
    'hub-warm-key-light',
    'hangar-cool-fill-light',
    'trophy-vault-fill-light',
    'forge-local-light',
  ]) {
    assert.ok(lights.some(({ name }) => name === lightName), `${lightName} manquante`);
  }

  hub.dispose();
});

test('la forge, le hangar et les trophées possèdent des props identifiables', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const roles = new Set(hub.propRegistry.map(({ userData }) => userData.role));

  for (const role of [
    'weapon-display',
    'interactive-console',
    'cargo-container',
    'vehicle-display',
    'utility-network',
    'navigation-markings',
    'hunt-trophy',
  ]) {
    assert.ok(roles.has(role), `prop manquant: ${role}`);
  }

  const weaponRack = hub.group.getObjectByName('forge-weapon-rack');
  assert.deepEqual(
    weaponRack.userData.weaponSilhouettes,
    ['combistick', 'smart-disc', 'plasma-caster', 'wrist-blades'],
  );
  assert.ok(hub.group.getObjectByName('hangar-scout'));
  assert.ok(hub.group.getObjectByName('hangar-shuttle'));
  assert.ok(hub.group.getObjectByName('hangar-pod'));

  assert.equal(new Set([...hub.trophyDisplays.values()].map(({ userData }) => userData.silhouetteVariant)).size, 8);
  hub.setTrophyState(['wolf_cleaner']);
  const wolf = hub.trophyDisplays.get('wolf_cleaner');
  assert.equal(wolf.userData.unlocked, true);
  assert.ok(wolf.children.length >= 3);
  assert.ok(wolf.children.every(({ material }) => material === wolf.material));

  hub.dispose();
});


test('les répétitions statiques sont instanciées et restent sous le budget de rendu du hub', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const expectedBatches = new Map([
    ['floor-navigation-routes', 1],
    ['ceiling-light-spines', 1],
    ['structural-hull-ribs', 4],
    ['utility-pipes-and-ducts', 5],
  ]);

  expectedBatches.forEach((expectedCount, blockName) => {
    const block = hub.group.getObjectByName(blockName);
    assert.ok(block, 'bloc de décor manquant: ' + blockName);
    const batches = [];
    block.traverse((object) => {
      if (object.isInstancedMesh) batches.push(object);
    });
    assert.equal(batches.length, expectedCount, 'lots instanciés inattendus dans ' + blockName);
    assert.ok(batches.every(({ count }) => count > 0), 'lot vide dans ' + blockName);
  });

  const snapshot = hub.getPerformanceSnapshot();
  assert.ok(snapshot.meshCount > 0);
  assert.ok(snapshot.drawCallEstimate <= 290, 'budget dépassé: ' + snapshot.drawCallEstimate + ' draw calls');
  assert.ok(snapshot.triangleEstimate > 0);
  assert.ok(snapshot.uniqueGeometryCount > 0);
  assert.ok(snapshot.uniqueMaterialCount > 0);
  assert.deepEqual(hub.getPerformanceSnapshot(), snapshot, 'les métriques doivent rester déterministes');

  assert.ok([...hub.trophyDisplays.values()].every((mesh) => !mesh.isInstancedMesh));
  assert.ok(hub.vehicleDisplays.every((vehicle) => !vehicle.isInstancedMesh));
  assert.ok(hub.animatedProps.every(({ mesh }) => !mesh.isInstancedMesh));

  hub.dispose();
});

test('dispose libère une seule fois les ressources et détache le hub de la scène', () => {
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  const deck = hub.group.getObjectByName('segmented-deck-plates');
  let geometryDisposeCount = 0;
  deck.geometry.dispose = () => { geometryDisposeCount += 1; };

  assert.ok(scene.children.includes(hub.group));
  hub.dispose();
  hub.dispose();

  assert.equal(geometryDisposeCount, 1);
  assert.ok(!scene.children.includes(hub.group));
  assert.equal(hub.group.children.length, 0);
  assert.equal(hub.trophyDisplays.size, 0);
  assert.equal(hub.landmarks.size, 0);
  assert.equal(hub.propRegistry.length, 0);
  assert.equal(hub.vehicleDisplays.length, 0);
});
