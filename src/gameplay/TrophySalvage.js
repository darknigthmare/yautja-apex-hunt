import * as THREE from 'three';
import { PHYSICAL_NPC_TROPHY_SOURCE_IDS } from './CraftRecipeReferences.js';
import { getVisualBounds } from '../utils/worldScale.js';

const sources = new Set(PHYSICAL_NPC_TROPHY_SOURCE_IDS);

/** A bounded set of actual defeated bodies; no material is awarded on a kill. */
export class TrophySalvage {
  constructor({ capacity = 4, lifetime = 90 } = {}) {
    this.capacity = capacity;
    this.lifetime = lifetime;
    this.bodies = [];
    this.registered = new WeakSet();
  }

  register(enemy) {
    if (!enemy?.isDead || !sources.has(enemy.type) || !enemy.mesh?.isObject3D || this.registered.has(enemy)) return false;
    this.registered.add(enemy);
    while (this.bodies.length >= this.capacity) this.bodies.shift().enemy.dispose?.();
    enemy.setVisionMode?.('normal');
    enemy.mesh.rotation.x = Math.PI / 2;
    enemy.mesh.updateMatrixWorld(true);
    const bounds = getVisualBounds(enemy.mesh);
    enemy.mesh.position.y += enemy.position.y - bounds.min.y;
    enemy.mesh.updateMatrixWorld(true);
    enemy.mesh.userData.trophySalvage = true;
    this.bodies.push({ enemy, sourceId: enemy.type, label: enemy.name, remaining: this.lifetime,
      bounds: getVisualBounds(enemy.mesh) });
    return true;
  }

  getNearby(position, range = 7) {
    if (!position?.isVector3) return null;
    return this.bodies.filter(body => body.bounds.distanceToPoint(position) <= range)
      .sort((a, b) => a.bounds.distanceToPoint(position) - b.bounds.distanceToPoint(position))[0] ?? null;
  }

  collect(position, recordMaterial) {
    const body = this.getNearby(position);
    if (!body || typeof recordMaterial !== 'function' || recordMaterial(body.sourceId) !== true) return null;
    this.bodies.splice(this.bodies.indexOf(body), 1);
    body.enemy.dispose?.();
    return { sourceId: body.sourceId, label: body.label };
  }

  update(delta) {
    const elapsed = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    for (let index = this.bodies.length - 1; index >= 0; index--) {
      const body = this.bodies[index];
      body.remaining -= elapsed;
      if (body.remaining <= 0) {
        this.bodies.splice(index, 1);
        body.enemy.dispose?.();
      }
    }
  }

  clear() {
    this.bodies.splice(0).forEach(({ enemy }) => enemy.dispose?.());
  }
}
