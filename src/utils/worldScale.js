import * as THREE from 'three';

// The existing hunter is 7.2 units tall for a nominal 2.4 m stature. World
// navigation, the hub doors and imported encounter measurements share this unit.
export const WORLD_UNITS_PER_METER = 3;
export const metersToWorldUnits = (meters) => Number(meters) * WORLD_UNITS_PER_METER;

/** Visible geometry bounds, including actual instances and deformed skin. */
export function getVisualBounds(root, { local = false, includeHidden = false } = {}) {
  const bounds = new THREE.Box3();
  if (!root?.isObject3D) return bounds;
  root.updateWorldMatrix(true, false);
  root.updateMatrixWorld(true);
  const inverse = local ? root.matrixWorld.clone().invert() : null;
  const inspect = (object) => {
    if (!object.isMesh || !object.geometry?.attributes.position) return;
    let box;
    if (object.isSkinnedMesh) {
      object.skeleton?.update();
      object.computeBoundingBox();
      box = object.boundingBox;
    } else if (object.isInstancedMesh) {
      object.computeBoundingBox();
      box = object.boundingBox;
    } else {
      object.geometry.computeBoundingBox();
      box = object.geometry.boundingBox;
    }
    if (!box || box.isEmpty()) return;
    const transform = inverse ? inverse.clone().multiply(object.matrixWorld) : object.matrixWorld;
    bounds.union(box.clone().applyMatrix4(transform));
  };
  if (includeHidden) root.traverse(inspect);
  else root.traverseVisible(inspect);
  return bounds;
}

export function getVisualCenter(root, target = new THREE.Vector3()) {
  const bounds = getVisualBounds(root, { includeHidden: true });
  return bounds.isEmpty() ? root.getWorldPosition(target) : bounds.getCenter(target);
}

const profile = (meters, dimension = 'height', catalogId = null, poseRatio = 1) => Object.freeze({
  meters, dimension, catalogId, poseRatio,
  provenance: catalogId ? 'documented_catalog_nominal_dimension' : 'authored_nominal_not_certified_canon',
});

// Values copied from the named catalogue entries are nominal dimensions, not
// measurements of film props. Original fauna and generic human roles retain an
// explicit authored reference instead of claiming an exact canon measurement.
export const NPC_PHYSICAL_PROFILES = Object.freeze({
  xeno_drone: profile(2.1, 'height', 'prey_xeno_drone_1979'),
  xeno_warrior: profile(2.3, 'height', 'prey_xeno_warrior'),
  // A crouching runner must not have the full standing height of a biped.
  xeno_runner: profile(2.1, 'height', 'prey_xeno_runner', 0.55),
  xeno_facehugger: profile(0.9, 'length', 'prey_facehugger_standard'),
  hunting_hound: profile(1.4, 'height', 'prey_hell_hound_tracker'),
  hell_hound_alpha: profile(1.4, 'height', 'prey_hell_hound_tracker'),
  modified_predator_hound: profile(1.1, 'height', 'prey_yautja_war_hound_armored'),
  river_ghost: profile(2, 'height', 'prey_river_ghost'),
  combat_synthetic: profile(1.85, 'height', 'prey_weyland_combat_android'),
  colonial_marine_smartgunner: profile(1.85, 'height', 'prey_colonial_marine_heavy'),
  grizzly_territorial: profile(1.5),
  genna_stalker: profile(1.8),
  genna_grazer: profile(2),
  genna_sporeback: profile(2.1),
  clan_sentry_drone: profile(0.9, 'width'),
});

const HUMAN_REFERENCE = profile(1.8);

function shapeHumanoid(root, type) {
  // Human builders formerly shared the hunter's old four-head proportions.
  // Keep their weapons/feet intact while narrowing the stance and resizing the
  // skull, helmet and the facial instances together around the same pivot.
  const headY = type === 'era_wartime_pilot' ? 1.95 : 2.04;
  const headScale = 0.62;
  let localHeadTop = 0;
  let localHeadBottom = Infinity;
  const inverse = root.matrixWorld.clone().invert();
  const box = new THREE.Box3();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
  root.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry.computeBoundingBox();
    if (object.isInstancedMesh) {
      for (let index = 0; index < object.count; index++) {
        object.getMatrixAt(index, matrix);
        matrix.decompose(position, rotation, scale);
        if (position.y < 1.88 || Math.abs(position.x) > 0.43) continue;
        position.set(position.x * headScale, headY + (position.y - headY) * headScale, position.z * headScale);
        scale.multiplyScalar(headScale);
        matrix.compose(position, rotation, scale);
        object.setMatrixAt(index, matrix);
        box.copy(object.geometry.boundingBox).applyMatrix4(matrix);
        localHeadTop = Math.max(localHeadTop, box.max.y);
      }
      object.instanceMatrix.needsUpdate = true;
      object.boundingBox = null;
      object.boundingSphere = null;
    } else if (object.position.y >= 1.88 && Math.abs(object.position.x) <= 0.43) {
      object.position.set(object.position.x * headScale, headY + (object.position.y - headY) * headScale, object.position.z * headScale);
      object.scale.multiplyScalar(headScale);
      object.userData.physicalPart = 'head';
      object.updateWorldMatrix(true, false);
      matrix.multiplyMatrices(inverse, object.matrixWorld);
      box.copy(object.geometry.boundingBox).applyMatrix4(matrix);
      localHeadTop = Math.max(localHeadTop, box.max.y);
      localHeadBottom = Math.min(localHeadBottom, box.min.y);
    }
  });
  const torso = root.children.find((child) => child.isMesh && !child.isInstancedMesh && child.userData.physicalPart !== 'head');
  if (torso && Number.isFinite(localHeadBottom)) {
    torso.updateWorldMatrix(true, false);
    matrix.multiplyMatrices(inverse, torso.matrixWorld);
    box.copy(torso.geometry.boundingBox).applyMatrix4(matrix);
    const gap = localHeadBottom - box.max.y;
    if (gap > 0.02) {
      const face = root.children.find((child) => child.name.endsWith(':face-and-ears'));
      const head = root.children.find((child) => child.userData.physicalPart === 'head');
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.13, gap + 0.12, 10), face?.material ?? head.material);
      neck.name = `anatomy:${type}:neck`;
      neck.position.y = (localHeadBottom + box.max.y) * 0.5;
      neck.castShadow = neck.receiveShadow = true;
      root.add(neck);
    }
  }
  root.scale.x *= 0.72;
  return localHeadTop;
}

/** Fit a factory model to a documented nominal dimension without moving its origin. */
export function applyNpcWorldScale(root, type, family) {
  root.updateMatrixWorld(true);
  const humanoid = family === 'humanoid';
  let localHeadTop = humanoid ? shapeHumanoid(root, type) : null;
  const physical = NPC_PHYSICAL_PROFILES[type] ?? HUMAN_REFERENCE;
  let bounds = getVisualBounds(root, { local: true });
  const groundOffset = family === 'drone' ? 0 : -bounds.min.y;
  if (groundOffset !== 0) {
    for (const child of root.children) child.position.y += groundOffset;
    if (Number.isFinite(localHeadTop)) localHeadTop += groundOffset;
  }
  bounds = getVisualBounds(root, { local: true });
  const size = bounds.getSize(new THREE.Vector3());
  const dimension = physical.dimension;
  const authoredSpan = dimension === 'length' ? size.z : dimension === 'width' ? size.x
    : humanoid && localHeadTop > 0 ? localHeadTop : size.y;
  const originalScale = dimension === 'length' ? root.scale.z : dimension === 'width' ? root.scale.x : root.scale.y;
  const target = metersToWorldUnits(physical.meters * physical.poseRatio);
  const factor = target / Math.max(0.001, authoredSpan * originalScale);
  root.scale.multiplyScalar(factor);
  root.updateMatrixWorld(true);
  const metadata = {
    unitsPerMeter: WORLD_UNITS_PER_METER, nominalMeters: physical.meters, dimension,
    poseRatio: physical.poseRatio, targetWorldSpan: target, factor,
    catalogId: physical.catalogId, provenance: physical.provenance,
    groundOffset, localHeadTop,
    localBounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
  };
  root.userData.worldScale = metadata;
  return metadata;
}
