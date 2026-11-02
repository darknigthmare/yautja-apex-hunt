import * as THREE from 'three';

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

function pointSegmentDistanceSquared(x, z, start, end) {
  const dx = end.x - start.x, dz = end.z - start.z;
  const t = Math.max(0, Math.min(1, ((x - start.x) * dx + (z - start.z) * dz) / Math.max(1e-12, dx * dx + dz * dz)));
  return (x - start.x - t * dx) ** 2 + (z - start.z - t * dz) ** 2;
}

function segmentIntersectsBox(start, end, box) {
  let near = 0, far = 1;
  for (const axis of ['x', 'z']) {
    const delta = end[axis] - start[axis];
    if (Math.abs(delta) < 1e-10) {
      if (start[axis] < box[`min${axis.toUpperCase()}`] || start[axis] > box[`max${axis.toUpperCase()}`]) return false;
      continue;
    }
    const a = (box[`min${axis.toUpperCase()}`] - start[axis]) / delta;
    const b = (box[`max${axis.toUpperCase()}`] - start[axis]) / delta;
    near = Math.max(near, Math.min(a, b)); far = Math.min(far, Math.max(a, b));
    if (near > far) return false;
  }
  return true;
}

class Frontier {
  constructor() { this.items = []; }
  push(item) {
    const items = this.items; let index = items.length; items.push(item);
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (items[parent].priority <= item.priority) break;
      items[index] = items[parent]; index = parent;
    }
    items[index] = item;
  }
  pop() {
    const first = this.items[0], last = this.items.pop();
    if (!this.items.length) return first;
    let index = 0;
    while (index * 2 + 1 < this.items.length) {
      let child = index * 2 + 1;
      if (child + 1 < this.items.length && this.items[child + 1].priority < this.items[child].priority) child++;
      if (this.items[child].priority >= last.priority) break;
      this.items[index] = this.items[child]; index = child;
    }
    this.items[index] = last;
    return first;
  }
}

/** Floor navigation uses the actual inflated collision pool, never room centres. */
export class ShipNavigation {
  constructor(bounds, colliders, { radius = 1.8, step = 2 } = {}) {
    this.bounds = bounds;
    this.radius = Number.isFinite(radius) ? Math.max(0.1, radius) : 1.8;
    this.step = Number.isFinite(step) ? Math.max(1, step) : 2;
    this.volumes = colliders.map(collider => {
      const halfX = collider.type === 'box' ? collider.halfWidth : collider.radius;
      const halfZ = collider.type === 'box' ? collider.halfDepth : collider.radius;
      return { collider, minX: collider.x - halfX - this.radius, maxX: collider.x + halfX + this.radius,
        minZ: collider.z - halfZ - this.radius, maxZ: collider.z + halfZ + this.radius };
    });
    this.minX = bounds.minX + this.radius + 0.02;
    this.minZ = bounds.minZ + this.radius + 0.02;
    this.columns = Math.floor((bounds.maxX - this.radius - this.minX) / this.step) + 1;
    this.rows = Math.floor((bounds.maxZ - this.radius - this.minZ) / this.step) + 1;
    this.nodes = Array.from({ length: this.columns * this.rows }, (_, index) => {
      const position = new THREE.Vector3(this.minX + index % this.columns * this.step, 0,
        this.minZ + Math.floor(index / this.columns) * this.step);
      return this.isPointClear(position) ? { position, neighbours: null } : null;
    });
    this.routeQueries = 0;
  }

  isPointClear(point) {
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.z)) return false;
    const { radius, bounds } = this;
    if (point.x < bounds.minX + radius || point.x > bounds.maxX - radius
      || point.z < bounds.minZ + radius || point.z > bounds.maxZ - radius) return false;
    return this.volumes.every(volume => {
      if (point.x <= volume.minX || point.x >= volume.maxX || point.z <= volume.minZ || point.z >= volume.maxZ) return true;
      const collider = volume.collider;
      return collider.type !== 'box'
        && Math.hypot(point.x - collider.x, point.z - collider.z) >= collider.radius + radius;
    });
  }

  isSegmentClear(start, end) {
    if (!this.isPointClear(start) || !this.isPointClear(end)) return false;
    const minX = Math.min(start.x, end.x), maxX = Math.max(start.x, end.x);
    const minZ = Math.min(start.z, end.z), maxZ = Math.max(start.z, end.z);
    return this.volumes.every(volume => {
      if (maxX <= volume.minX || minX >= volume.maxX || maxZ <= volume.minZ || minZ >= volume.maxZ) return true;
      const collider = volume.collider;
      return collider.type === 'box' ? !segmentIntersectsBox(start, end, volume)
        : pointSegmentDistanceSquared(collider.x, collider.z, start, end) >= (collider.radius + this.radius) ** 2;
    });
  }

  getNeighbours(index) {
    const node = this.nodes[index];
    if (node.neighbours) return node.neighbours;
    node.neighbours = [];
    const x = index % this.columns, z = Math.floor(index / this.columns);
    for (const [dx, dz] of DIRECTIONS) {
      if (x + dx < 0 || x + dx >= this.columns || z + dz < 0 || z + dz >= this.rows) continue;
      const other = (z + dz) * this.columns + x + dx;
      if (this.nodes[other] && this.isSegmentClear(node.position, this.nodes[other].position)) {
        node.neighbours.push({ index: other, cost: this.step * Math.hypot(dx, dz) });
      }
    }
    return node.neighbours;
  }

  attach(point) {
    const candidates = [];
    const x = Math.round((point.x - this.minX) / this.step), z = Math.round((point.z - this.minZ) / this.step);
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
      const column = x + dx, row = z + dz;
      if (column < 0 || column >= this.columns || row < 0 || row >= this.rows) continue;
      const index = row * this.columns + column, node = this.nodes[index];
      if (node && this.isSegmentClear(point, node.position)) candidates.push({ index, cost: point.distanceTo(node.position) });
    }
    return candidates.sort((left, right) => left.cost - right.cost).slice(0, 8);
  }

  findRoute(from, to) {
    this.routeQueries++;
    const start = new THREE.Vector3(from.x, 0, from.z), end = new THREE.Vector3(to.x, 0, to.z);
    if (!this.isPointClear(start) || !this.isPointClear(end)) return null;
    if (this.isSegmentClear(start, end)) return [start, end];
    const starts = this.attach(start), goals = new Map(this.attach(end).map(entry => [entry.index, entry.cost]));
    if (!starts.length || !goals.size) return null;
    const costs = new Float64Array(this.nodes.length).fill(Infinity);
    const previous = new Int32Array(this.nodes.length).fill(-1);
    const frontier = new Frontier();
    for (const entry of starts) {
      costs[entry.index] = entry.cost;
      frontier.push({ index: entry.index, cost: entry.cost, priority: entry.cost + this.nodes[entry.index].position.distanceTo(end) });
    }
    let reached = -1;
    while (frontier.items.length) {
      const current = frontier.pop();
      if (current.cost > costs[current.index] + 1e-8) continue;
      if (goals.has(current.index)) { reached = current.index; break; }
      for (const neighbour of this.getNeighbours(current.index)) {
        const cost = current.cost + neighbour.cost;
        if (cost >= costs[neighbour.index]) continue;
        costs[neighbour.index] = cost; previous[neighbour.index] = current.index;
        frontier.push({ index: neighbour.index, cost,
          priority: cost + this.nodes[neighbour.index].position.distanceTo(end) });
      }
    }
    if (reached < 0) return null;
    const path = [end];
    for (let index = reached; index >= 0; index = previous[index]) path.push(this.nodes[index].position.clone());
    path.push(start); path.reverse();
    const smooth = [start];
    for (let index = 0; index < path.length - 1;) {
      let next = path.length - 1;
      while (next > index + 1 && !this.isSegmentClear(path[index], path[next])) next--;
      smooth.push(path[next]); index = next;
    }
    return smooth;
  }

  getMetrics() {
    return { step: this.step, actorRadius: this.radius, gridNodes: this.nodes.length,
      walkableNodes: this.nodes.filter(Boolean).length, routeQueries: this.routeQueries };
  }
}
