import * as THREE from 'three';

/**
 * Find a rendered surface within the weapon's reach from the hunter's striking
 * height. Per-mesh bounds only reject distant geometry: a long tail's empty
 * enclosing box must not make its whole footprint a valid melee target.
 * This runs on an attack, never once per rendered frame.
 */
export function resolveMeleeTargetContact(target, feet, range, { strikeHeight = 4.8 } = {}) {
  if (!feet?.isVector3 || !Number.isFinite(range) || range < 0 || !Number.isFinite(strikeHeight)) return null;
  const origin = feet.clone().add(new THREE.Vector3(0, strikeHeight, 0));
  const limitSquared = Math.max(0, range) ** 2;
  const root = target?.mesh;
  let contact = null;
  const point = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const triangle = new THREE.Triangle(a, b, c);
  const bounds = new THREE.Box3(), transform = new THREE.Matrix4(), instance = new THREE.Matrix4();
  if (root?.isObject3D) {
    root.parent?.updateWorldMatrix(true, false);
    // SkinnedMesh.updateMatrixWorld refreshes the attached bind inverse too;
    // updateWorldMatrix alone leaves moved skins in their former bind space.
    root.updateMatrixWorld(true);
    root.traverseVisible(object => {
      if (contact || !object.isMesh || !object.geometry?.attributes.position) return;
      if (Array.isArray(object.material) ? object.material.every(material => material.visible === false) : object.material?.visible === false) return;
      const geometry = object.geometry;
      const positions = geometry.attributes.position, index = geometry.index;
      const count = index?.count ?? positions.count;
      if (count < 3) return;
      if (object.isSkinnedMesh) {
        object.skeleton?.update();
        object.computeBoundingBox();
      } else if (!geometry.boundingBox) geometry.computeBoundingBox();
      const localBounds = object.isSkinnedMesh ? object.boundingBox : geometry.boundingBox;
      const first = Math.max(0, geometry.drawRange.start || 0);
      const end = Math.min(count, first + geometry.drawRange.count);
      const ranges = Array.isArray(object.material)
        ? geometry.groups.filter(group => object.material[group.materialIndex] && object.material[group.materialIndex].visible !== false)
          .map(group => [Math.max(first, group.start), Math.min(end, group.start + group.count)])
        : [[first, end]];
      const vertex = (vertexIndex, destination) => {
        const attributeIndex = index ? index.getX(vertexIndex) : vertexIndex;
        if (object.getVertexPosition) object.getVertexPosition(attributeIndex, destination);
        else destination.fromBufferAttribute(positions, attributeIndex);
        destination.applyMatrix4(transform);
      };
      for (let item = 0; item < (object.isInstancedMesh ? object.count : 1); item++) {
        transform.copy(object.matrixWorld);
        if (object.isInstancedMesh) {
          object.getMatrixAt(item, instance);
          transform.multiply(instance);
        }
        bounds.copy(localBounds).applyMatrix4(transform);
        if (bounds.distanceToPoint(origin) > range) continue;
        for (const [from, to] of ranges) {
          for (let offset = from; offset + 2 < to; offset += 3) {
            vertex(offset, a); vertex(offset + 1, b); vertex(offset + 2, c);
            triangle.closestPointToPoint(origin, point);
            const distanceSquared = point.distanceToSquared(origin);
            if (distanceSquared <= limitSquared + 1e-8) {
              contact = { distance: Math.sqrt(distanceSquared), point: point.clone() };
              return;
            }
          }
        }
      }
    });
  }
  if (contact) return contact;
  // Non-rendered fixtures/legacy targets retain their historical root distance.
  if (!root?.isObject3D && target?.position?.isVector3) {
    const distance = feet.distanceTo(target.position);
    return distance <= range ? { distance, point: target.position.clone() } : null;
  }
  return null;
}
