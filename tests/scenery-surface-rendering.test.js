import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BIOME_HUNT_LAYOUTS, getBiomeHuntLayout } from '../src/data/BiomeHuntLayout.js';
import { buildHuntRouteNetwork } from '../src/world/HuntRouteBuilder.js';
import { createBeveledSceneryBox, createSceneryCoverGeometry } from '../src/world/SceneryGeometry.js';

test('les voies utilisent une matière de sol non émissive, des UV continus et une lisière fondue dans le terrain', () => {
  for (const biomeId of Object.keys(BIOME_HUNT_LAYOUTS)) {
    const layout = getBiomeHuntLayout(biomeId);
    const root = buildHuntRouteNetwork(layout);
    const masts = root.getObjectByName('hunt-sector-navigation-beacons');
    const transform = new THREE.Matrix4();
    const mastPosition = new THREE.Vector3();
    for (let index = 0; index < masts.count; index += 1) {
      masts.getMatrixAt(index, transform);
      mastPosition.setFromMatrixPosition(transform);
      const [x, , z] = layout.sectors[index].center;
      assert.ok(Math.hypot(mastPosition.x - x, mastPosition.z - z) >= 15.9, `${biomeId}: le repère de secteur ne doit pas traverser l'acteur au centre du carrefour`);
    }
    for (const mesh of root.children.filter(({ userData }) => userData.huntRoute)) {
      const material = mesh.material;
      assert.equal(material.emissiveIntensity, 0, `${biomeId}: une route ne doit pas émettre de lumière`);
      assert.ok(material.normalMap?.isDataTexture && material.roughnessMap?.isDataTexture);
      assert.equal(material.depthWrite, false, 'décalque de sol sans masquer le relief');
      const alpha = material.alphaMap.image.data;
      assert.equal(alpha[1], 0);
      assert.equal(alpha[alpha.length - 3], 0);
      assert.equal(alpha[Math.floor(material.alphaMap.image.width / 2) * 4 + 1], 255);
      const uv = mesh.geometry.getAttribute('uv');
      const positions = mesh.geometry.getAttribute('position');
      assert.equal(uv.count, positions.count);
      let previousV = -Infinity;
      const widths = [];
      for (let index = 0; index < uv.count; index += 2) {
        assert.ok(uv.getY(index) >= previousV, 'pas de saut ou inversion de la texture le long du chemin');
        previousV = uv.getY(index);
        widths.push(Math.hypot(positions.getX(index) - positions.getX(index + 1), positions.getZ(index) - positions.getZ(index + 1)));
      }
      const definition = getBiomeHuntLayout(biomeId).routes.find(({ id }) => id === mesh.userData.routeId);
      assert.ok(Math.max(...widths) <= definition.width + 0.0001, 'les rives érodées doivent rester dans le gabarit navigable');
      assert.ok(Math.max(...widths) - Math.min(...widths) > definition.width * 0.04, 'les deux rives ne doivent pas former un ruban uniforme');
    }
  }
});

test('les biseaux préservent les empreintes physiques et les silhouettes fusionnées possèdent des attributs complets', () => {
  const box = createBeveledSceneryBox(8, 12, 6);
  box.computeBoundingBox();
  const size = box.boundingBox.getSize(new THREE.Vector3());
  for (const [actual, expected] of [[size.x, 8], [size.y, 12], [size.z, 6]]) assert.ok(Math.abs(actual - expected) < 0.00001);
  const normals = box.getAttribute('normal');
  let cornerNormals = 0;
  for (let index = 0; index < normals.count; index += 1) {
    const components = [normals.getX(index), normals.getY(index), normals.getZ(index)];
    if (components.filter((value) => Math.abs(value) > 0.1).length > 1) cornerNormals += 1;
  }
  assert.ok(cornerNormals > 0, 'un biseau doit réfléchir la lumière entre les normales des faces');
  for (const biomeId of Object.keys(BIOME_HUNT_LAYOUTS)) {
    const { body, accent } = createSceneryCoverGeometry(biomeId);
    for (const geometry of [body, accent]) {
      const positions = geometry.getAttribute('position');
      for (const name of ['normal', 'uv', 'color']) assert.equal(geometry.getAttribute(name).count, positions.count, `${biomeId}: attribut ${name} incompatible avec le rendu instancié`);
      assert.ok([...positions.array].every(Number.isFinite), `${biomeId}: coordonnées non finies`);
      geometry.dispose();
    }
  }
  box.dispose();
});
