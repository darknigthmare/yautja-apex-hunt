import * as THREE from 'three';

// Display meshes are static, fused geometry. A small cached triangle hierarchy
// avoids scanning their thousands of vertices every time the bio-mask asks
// for a nearby object. Animation/locked-state changes only transform the tree.
const geometryCache = new WeakMap();
const boundsCache = new WeakMap();
const instanceCache = new WeakMap();

function geometryBounds(geometry) {
  const position = geometry?.attributes?.position;
  if (!position) return null;
  const previous = boundsCache.get(geometry);
  if (previous?.position === position && previous.version === position.version) return previous.box;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox.clone();
  boundsCache.set(geometry, { position, version: position.version, box });
  return box;
}

function geometryTree(geometry) {
  const position = geometry?.attributes?.position;
  if (!position) return null;
  const index = geometry.index, previous = geometryCache.get(geometry);
  if (previous?.position === position && previous.positionVersion === position.version &&
    previous.index === index && previous.indexVersion === index?.version) return previous;
  const vertex = new THREE.Vector3();
  const vertexIndex = offset => index ? index.getX(offset) : offset;
  const vertexAt = (offset, target) => target.fromBufferAttribute(position, vertexIndex(offset));
  const triangleCount = Math.floor((index?.count ?? position.count) / 3);
  const centers = new Float32Array(triangleCount * 3);
  const bounds = Array.from({ length: triangleCount }, (_, triangle) => {
    const box = new THREE.Box3();
    for (let corner = 0; corner < 3; corner++) box.expandByPoint(vertexAt(triangle * 3 + corner, vertex));
    box.getCenter(vertex).toArray(centers, triangle * 3); return box;
  });
  const build = triangles => {
    const box = new THREE.Box3(); triangles.forEach(triangle => box.union(bounds[triangle]));
    if (triangles.length <= 12) return { box, triangles };
    const size = box.getSize(vertex), axis = size.x >= size.y && size.x >= size.z ? 0 : size.y >= size.z ? 1 : 2;
    triangles.sort((a, b) => centers[a * 3 + axis] - centers[b * 3 + axis]);
    const middle = Math.floor(triangles.length / 2);
    return { box, left: build(triangles.slice(0, middle)), right: build(triangles.slice(middle)) };
  };
  const result = { position, positionVersion: position.version, index, indexVersion: index?.version,
    root: triangleCount ? build(Array.from({ length: triangleCount }, (_, i) => i)) : null, vertexAt };
  geometryCache.set(geometry, result); return result;
}

function isAttachedAndVisible(object, hubRoot) {
  let node = object, attached = false;
  while (node) {
    if (!node.visible) return false;
    if (node === hubRoot) attached = true;
    node = node.parent;
  }
  return attached;
}

function visitMeshInstances(object, callback) {
  const instance = new THREE.Matrix4();
  object.traverseVisible(mesh => {
    if (!mesh.isMesh || !mesh.geometry?.attributes?.position) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (!materials.some(material => material && material.visible !== false && material.opacity > 0)) return;
    const bounds = geometryBounds(mesh.geometry); if (!bounds || bounds.isEmpty()) return;
    if (mesh.isInstancedMesh) {
      let cached = instanceCache.get(mesh);
      if (!cached || cached.version !== mesh.instanceMatrix.version || cached.count !== mesh.count) {
        cached = { version: mesh.instanceMatrix.version, count: mesh.count, matrices: [] };
        for (let index = 0; index < mesh.count; index++) {
          mesh.getMatrixAt(index, instance); cached.matrices.push(instance.clone());
        }
        instanceCache.set(mesh, cached);
      }
      for (const matrix of cached.matrices) callback(mesh.geometry, bounds, mesh.matrixWorld.clone().multiply(matrix));
    } else callback(mesh.geometry, bounds, mesh.matrixWorld);
  });
}

function modelBounds(object) {
  const bounds = new THREE.Box3(), box = new THREE.Box3();
  visitMeshInstances(object, (geometry, local, matrix) => bounds.union(box.copy(local).applyMatrix4(matrix)));
  return bounds;
}

function nearestSurface(object, origin, maximumSquared) {
  const triangle = new THREE.Triangle(), point = new THREE.Vector3(), bestPoint = new THREE.Vector3();
  const box = new THREE.Box3();
  let bestSquared = maximumSquared, found = false;
  visitMeshInstances(object, (geometry, bounds, matrix) => {
    const tree = geometryTree(geometry); if (!tree?.root) return;
    const lowerBound = node => box.copy(node.box).applyMatrix4(matrix).distanceToPoint(origin) ** 2;
    const visit = node => {
      if (lowerBound(node) > bestSquared + 1e-10) return;
      if (node.triangles) {
        for (const index of node.triangles) {
          tree.vertexAt(index * 3, triangle.a).applyMatrix4(matrix);
          tree.vertexAt(index * 3 + 1, triangle.b).applyMatrix4(matrix);
          tree.vertexAt(index * 3 + 2, triangle.c).applyMatrix4(matrix);
          triangle.closestPointToPoint(origin, point);
          const squared = point.distanceToSquared(origin);
          if (squared <= bestSquared + 1e-10) { bestSquared = squared; bestPoint.copy(point); found = true; }
        }
      } else {
        const leftDistance = lowerBound(node.left), rightDistance = lowerBound(node.right);
        if (leftDistance <= rightDistance) { visit(node.left); visit(node.right); }
        else { visit(node.right); visit(node.left); }
      }
    };
    visit(tree.root);
  });
  return found ? { point: bestPoint, squared: bestSquared } : null;
}

/**
 * Find a readable exhibit from the hunter's feet position. `lineOfSight` may
 * be true (hub's normal solid-geometry check), or a callback receiving
 * {hub, entry, origin, point, distanceUs}. False/omitted performs no LOS test.
 * This only returns inspection information; it never awards a trophy/item.
 */
export function getNearbyShipDisplay(hub, position, options = {}) {
  const { maxDistance = 7, gazeHeight = 4.8, lineOfSight = false } = options ?? {};
  if (!hub?.group?.visible || hub.disposed || ![position?.x, position?.y, position?.z].every(Number.isFinite)) return null;
  if ((maxDistance !== Infinity && !Number.isFinite(maxDistance)) || maxDistance < 0) return null;
  const entries = hub.shipEquipmentDisplays?.entries;
  if (!Array.isArray(entries) || !entries.length) return null;
  hub.group.updateMatrixWorld(true);
  const origin = new THREE.Vector3(position.x, position.y + (Number.isFinite(gazeHeight) ? gazeHeight : 4.8), position.z);
  const candidates = [];
  for (const entry of entries) {
    if (!entry?.object?.isObject3D || !isAttachedAndVisible(entry.object, hub.group)) continue;
    const bounds = modelBounds(entry.object);
    if (bounds.isEmpty()) continue;
    const distance = bounds.distanceToPoint(origin);
    if (distance <= maxDistance) candidates.push({ entry, lowerBound: distance });
  }
  candidates.sort((a, b) => a.lowerBound - b.lowerBound);
  let closest = null, maximumSquared = maxDistance ** 2;
  for (const { entry, lowerBound } of candidates) {
    if (lowerBound ** 2 > maximumSquared) break;
    const result = nearestSurface(entry.object, origin, maximumSquared);
    if (!result) continue;
    const distanceUs = Math.sqrt(result.squared);
    if (typeof lineOfSight === 'function') {
      if (lineOfSight({ hub, entry, origin: origin.clone(), point: result.point.clone(), distanceUs }) === false) continue;
    } else if (lineOfSight === true && typeof hub.resolveCameraObstruction === 'function') {
      // The point is on the target's actual nearest triangle. Its own surface
      // cannot be a closer obstruction; leave a small numerical tolerance for
      // the independent renderer raycast and use no camera padding.
      const obstruction = hub.resolveCameraObstruction(origin, result.point, 0);
      if (obstruction?.isVector3 && origin.distanceTo(obstruction) < distanceUs - 0.08) continue;
    }
    closest = { entry, distanceUs, distanceUnits: distanceUs, point: result.point, gaze: origin.clone() };
    maximumSquared = result.squared;
  }
  return closest;
}
