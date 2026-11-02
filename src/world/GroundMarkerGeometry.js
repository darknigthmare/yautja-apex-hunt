import * as THREE from 'three';

/** Drape an existing warning boundary over the same terrain it describes. */
export function conformGroundMarker(mesh, sampleHeight, groundY, { cloneGeometry = true } = {}) {
  const source = mesh?.geometry?.getAttribute('position');
  if (!source || typeof sampleHeight !== 'function' || mesh.userData.terrainConformed) return false;
  mesh.updateWorldMatrix(true, false);
  const world = new THREE.Vector3();
  let lowestOffset = Infinity;
  for (let index = 0; index < source.count; index++) {
    world.fromBufferAttribute(source, index).applyMatrix4(mesh.matrixWorld);
    lowestOffset = Math.min(lowestOffset, world.y - groundY);
  }
  // Keep the underside visible without flattening the thickness of a torus.
  const lift = Math.max(0, 0.08 - lowestOffset);
  if (cloneGeometry) mesh.geometry = mesh.geometry.clone();
  const vertices = mesh.geometry.getAttribute('position');
  const inverse = mesh.matrixWorld.clone().invert();
  for (let index = 0; index < vertices.count; index++) {
    world.fromBufferAttribute(source, index).applyMatrix4(mesh.matrixWorld);
    world.y += sampleHeight(world.x, world.z) - groundY + lift;
    world.applyMatrix4(inverse);
    vertices.setXYZ(index, world.x, world.y, world.z);
  }
  vertices.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeBoundingSphere();
  mesh.userData.terrainConformed = true;
  return true;
}
