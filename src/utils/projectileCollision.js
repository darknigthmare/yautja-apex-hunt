import * as THREE from 'three';

function validVector(value) {
  return value?.isVector3 === true;
}

/**
 * Renvoie le point du segment le plus proche du centre si le volume sphérique
 * est traversé. Le rayon inclut déjà celui du projectile appelant.
 */
export function resolveSegmentSphereImpact(start, end, center, radius) {
  if (!validVector(start) || !validVector(end) || !validVector(center)) return null;
  const safeRadius = Math.max(0, Number(radius) || 0);
  const segment = end.clone().sub(start);
  const lengthSquared = segment.lengthSq();
  const progress = lengthSquared > 0
    ? THREE.MathUtils.clamp(center.clone().sub(start).dot(segment) / lengthSquared, 0, 1)
    : 0;
  const closestPoint = start.clone().addScaledVector(segment, progress);
  return closestPoint.distanceToSquared(center) <= safeRadius * safeRadius ? closestPoint : null;
}

/**
 * Vérifie si la trajectoire avant du projectile est réellement alignée sur un
 * volume. Cela permet de viser un point faible interne sans que la sphère du
 * corps n'absorbe d'abord le projectile.
 */
export function forwardRayIntersectsSphere(start, end, center, radius) {
  if (!validVector(start) || !validVector(end) || !validVector(center)) return false;
  const direction = end.clone().sub(start);
  if (direction.lengthSq() === 0) {
    return start.distanceToSquared(center) <= Math.max(0, Number(radius) || 0) ** 2;
  }
  direction.normalize();
  const toCenter = center.clone().sub(start);
  const forwardDistance = toCenter.dot(direction);
  if (forwardDistance < 0) return false;
  const closestPoint = start.clone().addScaledVector(direction, forwardDistance);
  const safeRadius = Math.max(0, Number(radius) || 0);
  return closestPoint.distanceToSquared(center) <= safeRadius * safeRadius;
}
