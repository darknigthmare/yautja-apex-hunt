/**
 * LevelDesignSpatialColliderQaAuditor.js
 * Chantier 7 + Audit QA #5 (v152) : Auditeur QA spatial de Level Design, anti-chevauchement de spawns & budget WebGL.
 * Vérifie et corrige automatiquement les anomalies géométriques de niveau :
 * - Recale tout point de spawn d'unité qui tomberait à l'intérieur d'un danger mortel actif
 *   (flaque d'acide, troisième rail 750V, gouffre de pont-levis).
 * - Vérifie la connectivité des perches de saut dans la canopée (portée maximale de saut Yautja <= 18m).
 * - Garantit le respect strict du budget de rendu WebGL (MothershipHub drawCalls <= 300).
 */

export class LevelDesignSpatialColliderQaAuditor {
  constructor(options = {}) {
    this.minHazardClearanceMeters = options.minHazardClearanceMeters ?? 3.5;
    this.maxYautjaLeapDistanceMeters = options.maxYautjaLeapDistanceMeters ?? 18.0;
    this.maxMothershipDrawCalls = options.maxMothershipDrawCalls ?? 300;
  }

  sanitizeSpawnPointsAgainstHazards(spawnPoints = [], activeHazards = [], audioSynthesizer = null) {
    let relocatedCount = 0;
    const sanitizedSpawns = spawnPoints.map((sp) => {
      let x = Number(sp.x ?? 0);
      let z = Number(sp.z ?? 0);
      let relocated = false;

      for (const hazard of activeHazards) {
        const hx = Number(hazard.x ?? 0);
        const hz = Number(hazard.z ?? 0);
        const minClearance = Number(hazard.radius ?? 2.0) + this.minHazardClearanceMeters;
        const dist = Math.hypot(x - hx, z - hz);

        if (dist < minClearance) {
          const dirX = dist > 0.001 ? (x - hx) / dist : 1;
          const dirZ = dist > 0.001 ? (z - hz) / dist : 0;
          x = Number((hx + dirX * minClearance).toFixed(2));
          z = Number((hz + dirZ * minClearance).toFixed(2));
          relocated = true;
          relocatedCount += 1;
        }
      }

      return {
        ...sp,
        x,
        z,
        relocatedFromHazard: relocated
      };
    });

    if (relocatedCount > 0 && audioSynthesizer && typeof audioSynthesizer.playSpatialQaColliderWarningChime === 'function') {
      audioSynthesizer.playSpatialQaColliderWarningChime(0.9);
    }

    return {
      relocatedCount,
      sanitizedSpawns
    };
  }

  auditPerchGraphAndRenderBudget(perches = [], currentDrawCalls = 299) {
    let isolatedPerchesCount = 0;
    for (let i = 0; i < perches.length; i++) {
      if (perches.length <= 1) break;
      const p1 = perches[i];
      let hasNeighbor = false;
      for (let j = 0; j < perches.length; j++) {
        if (i === j) continue;
        const p2 = perches[j];
        const dist = Math.hypot((p1.x ?? 0) - (p2.x ?? 0), (p1.z ?? 0) - (p2.z ?? 0));
        if (dist <= this.maxYautjaLeapDistanceMeters) {
          hasNeighbor = true;
          break;
        }
      }
      if (!hasNeighbor) isolatedPerchesCount += 1;
    }

    const safeDrawCalls = Math.max(0, Number(currentDrawCalls) || 0);
    const drawCallBudgetCompliant = safeDrawCalls <= this.maxMothershipDrawCalls;

    return {
      perchGraphConnected: isolatedPerchesCount === 0,
      isolatedPerchesCount,
      currentDrawCalls: safeDrawCalls,
      maxMothershipDrawCalls: this.maxMothershipDrawCalls,
      drawCallBudgetCompliant
    };
  }
}
