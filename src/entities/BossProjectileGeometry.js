import * as THREE from 'three';
import { getVisualBounds, getVisualCenter } from '../utils/worldScale.js';

export function containsBossPartImpact(part, point, padding = 0.2) {
  if (!part || !point?.isVector3) return false;
  const box = getVisualBounds(part, { local: true, includeHidden: true });
  return box.expandByScalar(padding).containsPoint(part.worldToLocal(point.clone()));
}

/**
 * Sweep the finite travelled segment through rendered part volumes. A forward
 * alignment may let a shot continue toward an exposed internal weakpoint; it
 * must never award that impact before the projectile has actually reached it.
 */
export function resolveBossGeometryImpact(root, start, end, projectileRadius = 0, weakParts = []) {
  if (!start?.isVector3 || !end?.isVector3) return null;
  const padding = Math.max(0, Number(projectileRadius) || 0);
  root.updateWorldMatrix(true, true);
  const direction = end.clone().sub(start);
  const length = direction.length();
  if (length > 0) direction.divideScalar(length);
  const ray = new THREE.Ray(start, direction);
  const intersect = (box, finite = true) => {
    box.expandByScalar(padding);
    if (box.containsPoint(start)) return start.clone();
    if (length === 0) return null;
    const point = ray.intersectBox(box, new THREE.Vector3());
    return point && (!finite || point.distanceTo(start) <= length + 1e-7) ? point : null;
  };
  const parts = weakParts.filter((part) => part && part.visible !== false);
  const boxes = parts.map((part) => getVisualBounds(part));
  for (let index = 0; index < parts.length; index++) {
    if (intersect(boxes[index].clone())) return getVisualCenter(parts[index]);
  }
  // Geometry for an intact torso surrounds some core weakpoints. Defer its
  // broad contact when aiming at that part, then test the next finite segment.
  if (boxes.some((box) => intersect(box.clone(), false))) return null;
  let closest = null;
  let closestDistance = Infinity;
  root.traverseVisible((object) => {
    if (!object.isMesh || !object.geometry?.attributes.position) return;
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld);
    const point = intersect(box);
    const distance = point?.distanceToSquared(start) ?? Infinity;
    if (distance < closestDistance) { closestDistance = distance; closest = point; }
  });
  return closest;
}
