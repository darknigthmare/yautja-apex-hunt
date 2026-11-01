/** Resolve one upright actor against a vertically bounded world volume. */
export function resolveActorObstacle(position, radius, height, obstacle, terrainY = 0) {
  if (!position || !obstacle || obstacle.blocksActors === false) return false;
  const base = Number.isFinite(obstacle.baseY) ? obstacle.baseY : terrainY;
  const top = Number.isFinite(obstacle.height) ? base + obstacle.height : Infinity;
  if (position.y >= top - 1e-6 || position.y + height <= base + 1e-6) return false;
  const dx = position.x - obstacle.x, dz = position.z - obstacle.z;
  if (obstacle.shape === 'box' && obstacle.halfWidth > 0 && obstacle.halfDepth > 0) {
    const cosine = Math.cos(obstacle.yaw || 0), sine = Math.sin(obstacle.yaw || 0);
    let x = cosine * dx - sine * dz, z = sine * dx + cosine * dz;
    const nearestX = Math.max(-obstacle.halfWidth, Math.min(obstacle.halfWidth, x));
    const nearestZ = Math.max(-obstacle.halfDepth, Math.min(obstacle.halfDepth, z));
    const vx = x - nearestX, vz = z - nearestZ;
    const distance = Math.hypot(vx, vz);
    if (distance >= radius) return false;
    if (distance > 1e-8) {
      x += vx / distance * (radius - distance);
      z += vz / distance * (radius - distance);
    } else if (obstacle.halfWidth - Math.abs(x) < obstacle.halfDepth - Math.abs(z)) {
      x = (x < 0 ? -1 : 1) * (obstacle.halfWidth + radius);
    } else z = (z < 0 ? -1 : 1) * (obstacle.halfDepth + radius);
    position.x = obstacle.x + cosine * x + sine * z;
    position.z = obstacle.z - sine * x + cosine * z;
    return true;
  }
  const distance = Math.hypot(dx, dz);
  const reach = radius + Math.max(0, Number(obstacle.radius) || 0);
  if (distance >= reach) return false;
  const nx = distance > 1e-8 ? dx / distance : 1;
  const nz = distance > 1e-8 ? dz / distance : 0;
  position.x += nx * (reach - distance);
  position.z += nz * (reach - distance);
  return true;
}

/** Earliest impact on a vertical body capsule, including its head and legs. */
export function resolvePlayerCapsuleImpact(start, end, feet, height = 7.2, bodyRadius = 1.8, projectileRadius = 0) {
  if (![start, end, feet].every(value => value?.isVector3)) return null;
  const physicalRadius = Math.min(bodyRadius, height / 2);
  const radius = physicalRadius + Math.max(0, projectileRadius);
  const bottom = feet.y + physicalRadius, top = feet.y + height - physicalRadius;
  const nearestY = Math.max(bottom, Math.min(top, start.y));
  if ((start.x - feet.x) ** 2 + (start.z - feet.z) ** 2 + (start.y - nearestY) ** 2 <= radius ** 2) return start.clone();
  const delta = end.clone().sub(start);
  const lengthSquared = delta.lengthSq();
  if (lengthSquared < 1e-12) return null;
  const times = [];
  const add = (time, checkHeight = false) => {
    if (time < 0 || time > 1) return;
    const y = start.y + delta.y * time;
    if (!checkHeight || (y >= bottom && y <= top)) times.push(time);
  };
  for (const y of [bottom, top]) {
    const relative = start.clone().sub(feet); relative.y = start.y - y;
    const b = 2 * relative.dot(delta), c = relative.lengthSq() - radius ** 2;
    const discriminant = b ** 2 - 4 * lengthSquared * c;
    if (discriminant >= 0) {
      add((-b - Math.sqrt(discriminant)) / (2 * lengthSquared));
      add((-b + Math.sqrt(discriminant)) / (2 * lengthSquared));
    }
  }
  const a = delta.x ** 2 + delta.z ** 2;
  const dx = start.x - feet.x, dz = start.z - feet.z;
  const b = 2 * (dx * delta.x + dz * delta.z), c = dx ** 2 + dz ** 2 - radius ** 2;
  const discriminant = b ** 2 - 4 * a * c;
  if (a > 1e-12 && discriminant >= 0) {
    add((-b - Math.sqrt(discriminant)) / (2 * a), true);
    add((-b + Math.sqrt(discriminant)) / (2 * a), true);
  }
  return times.length ? start.clone().addScaledVector(delta, Math.min(...times)) : null;
}
