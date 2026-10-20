import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MASK_VARIANTS } from '../src/data/YautjaContentCatalog.js';
import {
  createBiomaskSculpt,
  createBiomaskInserts,
  createCraniumSculpt,
  createHandSculpt,
  createMandibleSculpt,
} from '../src/entities/HeroSculptGeometry.js';

function connectedSurfaceCount(geometry) {
  const position = geometry.attributes.position, byPosition = new Map(), ids = [];
  for (let i = 0; i < position.count; i++) {
    const key = [position.getX(i), position.getY(i), position.getZ(i)].map((value) => Math.round(value * 100000)).join(',');
    if (!byPosition.has(key)) byPosition.set(key, byPosition.size);
    ids.push(byPosition.get(key));
  }
  const parent = Array.from({ length: byPosition.size }, (_, index) => index);
  const find = (id) => { while (parent[id] !== id) { parent[id] = parent[parent[id]]; id = parent[id]; } return id; };
  const indices = geometry.index?.array ?? Array.from({ length: position.count }, (_, index) => index);
  for (let i = 0; i < indices.length; i += 3) {
    const a = find(ids[indices[i]]), b = find(ids[indices[i + 1]]), c = find(ids[indices[i + 2]]);
    parent[b] = a; parent[c] = a;
  }
  return new Set(ids.map(find)).size;
}

test('les deux orbites et huit évents sont des ouvertures traversantes avec inserts en retrait', () => {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const ray = new THREE.Raycaster();
  for (const shape of ['classic', 'bone', 'celtic']) {
    const definition = MASK_VARIANTS.find((entry) => entry.shape === shape);
    assert.ok(definition, shape);
    const shell = createBiomaskSculpt(definition), inserts = createBiomaskInserts(definition);
    try {
      const shellMesh = new THREE.Mesh(shell, material);
      shellMesh.updateMatrixWorld(true);
      for (const [centers, backing] of [[shell.userData.eyeSocketCenters, inserts.visor], [shell.userData.ventSlotCenters, inserts.vents]]) {
        const insertMesh = new THREE.Mesh(backing, material);
        insertMesh.updateMatrixWorld(true);
        for (const center of centers) {
          ray.set(new THREE.Vector3(center[0], center[1], center[2] + 1), new THREE.Vector3(0, 0, -1));
          assert.equal(ray.intersectObject(shellMesh).length, 0, `${shape}: l'ouverture ne contient pas de face opaque`);
          const hits = ray.intersectObject(insertMesh);
          assert.ok(hits.length > 0, `${shape}: l'insert ferme la cavité en retrait`);
          assert.ok(hits[0].distance > 1 + 0.1 * (definition.scale ?? 1), `${shape}: l'insert ne flotte pas devant la coque`);
          assert.ok(Math.abs(hits[0].distance - 1 - shell.userData.visorInset) < 0.02);
        }
      }
      const uv = shell.attributes.uv.array;
      assert.ok([...uv].every((value) => Number.isFinite(value) && value >= -0.001 && value <= 1.001));
    } finally {
      shell.dispose(); Object.values(inserts).forEach((geometry) => geometry.dispose());
    }
  }
  material.dispose();
});

test('la paume, les commissures et les cinq doigts forment une seule surface anatomique', () => {
  for (const side of [-1, 1]) {
    const hand = createHandSculpt(side);
    try {
      assert.equal(hand.skin.userData.digitCount, 5);
      assert.equal(hand.skin.userData.authoredSurface, 'continuous_anatomical_field');
      assert.equal(hand.skin.userData.uvLayout, 'front_back_anatomical_charts');
      assert.equal(connectedSurfaceCount(hand.skin), 1);
      assert.ok(hand.skin.userData.anatomicalFeatures.includes('palm_webbing'));
      for (const attribute of Object.values(hand.skin.attributes)) assert.ok([...attribute.array].every(Number.isFinite));
      assert.ok(hand.skin.index.count / 3 < 25000);
    } finally {
      hand.skin.dispose(); hand.claws.dispose();
    }
  }
});

test('le crâne continu expose ses cavités et les retours de cache peuvent être modifiés sans affecter les suivants', () => {
  const first = createCraniumSculpt();
  const originalX = first.attributes.position.getX(0);
  first.attributes.position.setX(0, 1000);
  first.dispose();
  const second = createCraniumSculpt();
  try {
    assert.equal(second.attributes.position.getX(0), originalX);
    assert.equal(connectedSurfaceCount(second), 1);
    assert.ok(second.userData.anatomicalFeatures.includes('orbital_cavities'));
    assert.ok(second.userData.anatomicalFeatures.includes('oral_cavity'));
    assert.ok(second.index.count / 3 < 35000);
  } finally { second.dispose(); }
});

test('les quatre mandibules possèdent un tissu courbe et une dentine séparée en repère tête', () => {
  for (const side of [-1, 1]) for (const upper of [-1, 1]) {
    const { tissue, tusk } = createMandibleSculpt(side, upper);
    try {
      assert.equal(tissue.userData.authoredSurface, 'curved_articulated_mandible');
      assert.equal(tusk.userData.authoredSurface, 'curved_dentine_tusk');
      tissue.computeBoundingBox(); tusk.computeBoundingBox();
      assert.ok(tissue.boundingBox.min.z > 0.2);
      assert.ok(tusk.boundingBox.max.z > 1);
      assert.ok([...tissue.attributes.position.array, ...tusk.attributes.position.array].every(Number.isFinite));
    } finally { tissue.dispose(); tusk.dispose(); }
  }
});

// Ratio of the principal lengths of a world-space patch represented by a square
// in texture space. A side projected onto X/Y approaches infinity at the temple.
function uvStretch(points, mapped) {
  const edge1 = points[1].clone().sub(points[0]), edge2 = points[2].clone().sub(points[0]);
  const uv1 = mapped[1].clone().sub(mapped[0]), uv2 = mapped[2].clone().sub(mapped[0]);
  const determinant = uv1.x * uv2.y - uv1.y * uv2.x;
  if (Math.abs(determinant) < 1e-14) return Infinity;
  const tangentU = edge1.clone().multiplyScalar(uv2.y).addScaledVector(edge2, -uv1.y).divideScalar(determinant);
  const tangentV = edge2.clone().multiplyScalar(uv1.x).addScaledVector(edge1, -uv2.x).divideScalar(determinant);
  const a = tangentU.lengthSq(), b = tangentU.dot(tangentV), c = tangentV.lengthSq();
  const gap = Math.hypot(a - c, 2 * b);
  return Math.sqrt((a + c + gap) / (a + c - gap));
}

test('la texture des tempes garde des texels proportionnés sans projection latérale écrasée', () => {
  const head = createCraniumSculpt(), triangles = head.toNonIndexed();
  try {
    const { position, normal, uv } = triangles.attributes;
    const stretches = [];
    for (let first = 0; first < position.count; first += 3) {
      const points = [0, 1, 2].map(corner => new THREE.Vector3().fromBufferAttribute(position, first + corner));
      const center = points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / 3);
      const facing = [0, 1, 2].reduce((sum, corner) =>
        sum.add(new THREE.Vector3().fromBufferAttribute(normal, first + corner)), new THREE.Vector3()).normalize();
      if (Math.abs(center.x) < 0.64 || center.y < -0.25 || center.y > 0.7 || Math.abs(center.z) > 0.35 || Math.abs(facing.x) < 0.8) continue;
      const mapped = [0, 1, 2].map(corner => new THREE.Vector2().fromBufferAttribute(uv, first + corner));
      stretches.push(uvStretch(points, mapped));
    }
    assert.ok(stretches.length > 1000, 'Les deux tempes doivent être couvertes par la mesure');
    stretches.sort((a, b) => a - b);
    assert.ok(stretches[Math.floor(stretches.length * 0.95)] < 1.6, 'Les pores ne doivent pas devenir des stries sur 95 % des tempes');
    assert.ok(stretches.at(-1) < 2.2, 'Aucune face temporale ne doit perdre sa largeur UV');
  } finally { triangles.dispose(); head.dispose(); }
});

test('le crâne ferme sa couture périodique à l’arrière sans interpolation à travers les tempes', () => {
  const head = createCraniumSculpt();
  try {
    assert.equal(head.userData.uvLayout, 'ellipsoidal_cranium_rear_seam');
    const { position, uv } = head.attributes, byPosition = new Map();
    let seamVertices = 0;
    for (let index = 0; index < position.count; index++) {
      const x = position.getX(index), y = position.getY(index), z = position.getZ(index);
      const key = `${x},${y},${z}`, previous = byPosition.get(key);
      assert.ok(Number.isFinite(uv.getX(index)) && Number.isFinite(uv.getY(index)));
      if (previous === undefined) { byPosition.set(key, index); continue; }
      const deltaU = Math.abs(uv.getX(index) - uv.getX(previous));
      if (deltaU < 1e-6) continue;
      seamVertices++;
      assert.ok(Math.abs(deltaU - 2) < 1e-6, 'Les deux bords doivent échantillonner le même point du motif répétable');
      assert.equal(uv.getY(index), uv.getY(previous));
      assert.ok(Math.abs(x) < 0.07, 'La couture doit rester sur le méridien arrière, loin des tempes');
      const polarCap = Math.hypot(x, z + 0.09) < 0.08 && (y > 0.95 || y < -0.65);
      assert.ok(z < -0.089 || polarCap, 'Seuls les pôles peuvent prolonger la couture au-delà de la moitié arrière');
    }
    assert.ok(seamVertices > 10);
    const indices = head.index.array;
    for (let triangle = 0; triangle < indices.length; triangle += 3) {
      const corners = [indices[triangle], indices[triangle + 1], indices[triangle + 2]];
      const longitude = corners.map(index => uv.getX(index));
      const span = Math.max(...longitude) - Math.min(...longitude);
      assert.ok(span <= 1.000001, 'Une face ne doit pas interpoler au travers de toute la texture');
      if (corners.some(index => Math.hypot(position.getX(index), position.getZ(index) + 0.09) < 0.15)) continue;
      assert.ok(span < 0.15, 'Hors pôles, chaque face doit rester dans un petit voisinage UV continu');
    }
  } finally { head.dispose(); }
});
