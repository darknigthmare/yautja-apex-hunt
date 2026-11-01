/** XZ broad phase. Each volume is indexed in every cell its footprint touches. */
export class ObstacleSpatialIndex {
  constructor(cellSize = 64) {
    this.cellSize = Number.isFinite(cellSize) && cellSize >= 8 ? cellSize : 64;
    this.cells = new Map();
    this.order = new Map();
    this.totalCount = 0;
    this.queryCount = 0;
    this.lastCandidateCount = 0;
    this.lastResultCount = 0;
    this.maxCandidateCount = 0;
  }

  rebuild(colliders) {
    this.cells.clear();
    this.order.clear();
    for (const collider of new Set(colliders)) {
      if (!Number.isFinite(collider.x) || !Number.isFinite(collider.z)) continue;
      this.order.set(collider, this.order.size);
      const radius = Number.isFinite(collider.radius) ? Math.max(0, collider.radius) : 0;
      const minX = Math.floor((collider.x - radius) / this.cellSize);
      const maxX = Math.floor((collider.x + radius) / this.cellSize);
      const minZ = Math.floor((collider.z - radius) / this.cellSize);
      const maxZ = Math.floor((collider.z + radius) / this.cellSize);
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          const key = `${x}:${z}`;
          if (!this.cells.has(key)) this.cells.set(key, []);
          this.cells.get(key).push(collider);
        }
      }
    }
    this.totalCount = this.order.size;
    this.queryCount = 0;
    this.lastCandidateCount = 0;
    this.lastResultCount = 0;
    this.maxCandidateCount = 0;
    return this;
  }

  query(position, searchRadius = 0, { includeProjectileOnly = false } = {}) {
    if (!Number.isFinite(position?.x) || !Number.isFinite(position?.z)) return [];
    const radius = Number.isFinite(searchRadius) ? Math.max(0, searchRadius) : 0;
    const candidates = new Set();
    const minX = Math.floor((position.x - radius) / this.cellSize);
    const maxX = Math.floor((position.x + radius) / this.cellSize);
    const minZ = Math.floor((position.z - radius) / this.cellSize);
    const maxZ = Math.floor((position.z + radius) / this.cellSize);
    // A long ray must not iterate millions of empty cells outside the level.
    if ((maxX - minX + 1) * (maxZ - minZ + 1) > this.cells.size) {
      for (const collider of this.order.keys()) candidates.add(collider);
    } else {
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          for (const collider of this.cells.get(`${x}:${z}`) || []) candidates.add(collider);
        }
      }
    }
    this.queryCount++;
    this.lastCandidateCount = candidates.size;
    this.maxCandidateCount = Math.max(this.maxCandidateCount, candidates.size);
    const results = [...candidates].filter(collider => (
      (includeProjectileOnly || collider.blocksActors !== false)
      && Math.hypot(position.x - collider.x, position.z - collider.z) <= radius + Math.max(0, Number(collider.radius) || 0)
    )).sort((left, right) => this.order.get(left) - this.order.get(right));
    this.lastResultCount = results.length;
    return results;
  }

  getMetrics() {
    return { cellSize: this.cellSize, totalCount: this.totalCount, cellCount: this.cells.size, queryCount: this.queryCount, lastCandidateCount: this.lastCandidateCount, lastResultCount: this.lastResultCount, maxCandidateCount: this.maxCandidateCount };
  }
}
