import * as THREE from 'three';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY, PREY_FACTIONS } from '../data/PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS } from '../data/CrossoverUniverseEncounters.js';
import { getSquadById } from '../data/SquadEncountersCatalog.js';
import { getVisualBounds, metersToWorldUnits } from '../utils/worldScale.js';
import { getPreySimulationModelReference, getDocumentedPreySubjectModelId } from '../data/PreyReferenceMetadata.js';

/** A dossier selects a training proxy, never impersonates the referenced model. */
export function resolveSimulationSelection(context) {
  if (!context || !['prey', 'crossover', 'squad'].includes(context.kind)) return null;
  if (context.kind === 'squad') {
    const squad = getSquadById(context.id);
    if (!squad) return null;
    const huntType = squad.biomeId === 'hive_lv426' ? 'grid_alien'
      : squad.biomeId === 'bouvetoya_pyramid' ? 'grid_alien'
      : squad.biomeId === 'stargazer_blacksite' ? 'upgrade_predator'
      : squad.biomeId === 'los_angeles_1997' ? 'city_hunter'
      : 'jungle_hunter_1987';
    const planetType = squad.biomeId === 'colony' ? 'hive_lv426' : squad.biomeId;
    return {
      kind: 'squad',
      target: {
        ...squad,
        sizeMeters: 1.88,
        encounterTier: 'MOYEN',
      },
      huntType,
      planetType,
      directiveId: squad.id,
    };
  }
  const entries = context.kind === 'prey' ? CANON_PREY_CATALOG
    : [...MULTIVERSE_CROSSOVER_PREY, ...CROSSOVER_UNIVERSE_ENCOUNTERS];
  const target = entries.find(entry => entry.id === context.id);
  if (!target) return null;
  const { huntType, planetType } = getPreySimulationModelReference(target, { kind: context.kind, factions: PREY_FACTIONS });
  if (!HUNT_DEFINITIONS[huntType]) return null;
  return { kind: context.kind, target, huntType, planetType };
}

/** Match the dossier's nominal dimension in the game's shared unit system. */
export function applySimulationReferenceScale(boss, target, { training = true } = {}) {
  if (!boss?.mesh || !Number.isFinite(target?.sizeMeters) || target.sizeMeters <= 0) return null;
  const mesh = boss.mesh;
  const before = getVisualBounds(mesh);
  if (before.isEmpty()) return null;
  const size = before.getSize(new THREE.Vector3());
  const axis = target.sizeDimension === 'length' ? 'z'
    : target.sizeDimension === 'width' ? 'x' : target.sizeDimension === 'height' ? 'y'
      : ['x', 'y', 'z'].reduce((largest, key) => size[key] > size[largest] ? key : largest, 'y');
  const expected = metersToWorldUnits(target.sizeMeters);
  const factor = expected / size[axis];
  if (!Number.isFinite(factor) || factor <= 0) return null;
  const baseCollider = Number.isFinite(boss.colliderRadius) ? boss.colliderRadius : 5;
  mesh.scale.multiplyScalar(factor);
  mesh.updateMatrixWorld(true);
  const scaled = getVisualBounds(mesh);
  // The logical ground position must stay the same when animation copies it.
  const localGroundOffset = (scaled.min.y - mesh.getWorldPosition(new THREE.Vector3()).y) / mesh.scale.y;
  const visual = new THREE.Group();
  visual.name = 'simulation:grounded_visual';
  const children = [...mesh.children];
  mesh.add(visual);
  children.forEach(child => visual.add(child));
  visual.position.y = -localGroundOffset;
  boss.baseSimulationColliderRadius = baseCollider;
  boss.colliderRadius = baseCollider * factor;
  boss.simulationScaleFactor = factor;
  const reference = {
    targetId: target.id, nominalMeters: target.sizeMeters, dimensionAxis: axis,
    dimensionStatus: target.dimensionStatus ?? 'catalogue_estimate', factor,
    modelStatus: training ? 'training_proxy' : 'original_specimen', fidelityVerified: false,
    matchedRuntimeSubjectId: training ? getDocumentedPreySubjectModelId(target) : null,
    subjectModelStatus: training && getDocumentedPreySubjectModelId(target)
      ? 'matching_subject_adaptation' : training ? 'generic_proxy' : 'original_specimen',
  };
  mesh.userData[training ? 'simulationReference' : 'specimenReference'] = reference;
  mesh.updateMatrixWorld(true);

  // Existing boss hit volumes use authored radii. For resized training proxies,
  // intersect the visible geometry over the actual travelled segment instead.
  boss.resolveProjectileImpact = (position, radius = 0.35, previousPosition = position) => {
    if (!position?.isVector3 || !previousPosition?.isVector3) return null;
    mesh.updateMatrixWorld(true);
    const bounds = getVisualBounds(mesh).expandByScalar(Math.max(0, radius));
    const direction = position.clone().sub(previousPosition);
    const length = direction.length();
    if (length < 1e-8) return bounds.containsPoint(position) ? position.clone() : null;
    direction.divideScalar(length);
    const ray = new THREE.Ray(previousPosition, direction);
    const entry = ray.intersectBox(bounds, new THREE.Vector3());
    if (!entry || entry.distanceTo(previousPosition) > length + Math.max(0, radius)) return null;
    const raycaster = new THREE.Raycaster(previousPosition, direction, 0, length + Math.max(0, radius));
    const hit = raycaster.intersectObject(mesh, true).find(({ object }) => {
      for (let parent = object; parent; parent = parent.parent) if (!parent.visible) return false;
      return true;
    });
    return hit?.point?.clone() ?? (bounds.containsPoint(previousPosition) ? position.clone() : null);
  };
  return reference;
}
