import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// These seven roles carry generic modern firearms authored for this game.
// Historical weapons, the Colonial smartgun and fictional net/cryo weapons
// retain their own geometry; this is not an exact reconstruction of a firearm.
export const GENERIC_NPC_FIREARM_TYPES = Object.freeze([
  'human_fireteam', 'jungle_scout', 'stargazer_rifleman', 'urban_cartel_enforcer',
  'subway_armed_hunter', 'weyland_expedition_guard', 'gunnison_national_guard',
]);

const genericTypes = new Set(GENERIC_NPC_FIREARM_TYPES);

function buildFirearmGeometry(bounds, shotgun) {
  const envelope = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const width = Math.min(envelope.x, 0.18), height = envelope.y, length = envelope.z;
  const pieces = [], names = [];
  const add = (name, geometry, x, y, z, rotation = null) => {
    const part = geometry.index ? geometry.toNonIndexed() : geometry;
    if (part !== geometry) geometry.dispose();
    if (rotation) part.rotateX(rotation);
    part.translate(center.x + x, center.y + y, center.z + z);
    pieces.push(part); names.push(name);
  };
  const box = (name, sx, sy, sz, x, y, z) => add(name,
    new RoundedBoxGeometry(sx, sy, sz, 1, Math.min(sx, sy, sz) * 0.12), x, y, z);
  const cylinder = (name, radius, distance, y, z) => add(name,
    new THREE.CylinderGeometry(radius, radius, distance, 10, 1, false), 0, y, z, Math.PI / 2);

  box('shoulder-stock', width * 0.9, height * 0.62, length * 0.2, 0, 0, -length * 0.4);
  box('butt-pad', width, height * 0.72, length * 0.025, 0, 0, -length * 0.4875);
  cylinder('stock-tube', Math.min(width, height) * 0.12, length * 0.14, height * 0.04, -length * 0.25);
  box('receiver', width * 0.74, height * 0.4, length * 0.33, 0, 0, -length * 0.115);
  box('top-rail', width * 0.48, height * 0.065, length * 0.46, 0, height * 0.2425, length * 0.015);
  box('handguard', width * 0.72, height * 0.31, length * 0.28, 0, 0, length * 0.17);

  const boreRadius = Math.min(width, height) * 0.1;
  cylinder('barrel', boreRadius, length * 0.19, 0, length * 0.405);
  cylinder('muzzle-collar', boreRadius * 1.28, length * 0.035, 0, length * 0.4825);
  box('front-sight', width * 0.13, height * 0.225, length * 0.025, 0, height * 0.3875, length * 0.3);
  box('rear-sight', width * 0.28, height * 0.15, length * 0.03, 0, height * 0.35, -length * 0.2);

  if (shotgun) {
    // Separate tube and sliding fore-end keep this original civilian role
    // visually distinct from the magazine-fed rifles.
    cylinder('magazine-tube', boreRadius * 0.9, length * 0.38, -height * 0.2, length * 0.22);
    box('pump-fore-end', width * 0.8, height * 0.27, length * 0.16, 0, -height * 0.12, length * 0.16);
  } else {
    box('magazine-well', width * 0.63, height * 0.18, length * 0.125, 0, -height * 0.22, -length * 0.01);
    const magazine = new RoundedBoxGeometry(width * 0.5, height * 0.29, length * 0.105, 1, height * 0.035);
    // A shallow rake supplies a recognizable magazine silhouette without
    // extending below the old weapon block's collision/aim envelope.
    magazine.rotateX(-0.12);
    const magazineBounds = new THREE.Box3().setFromBufferAttribute(magazine.attributes.position);
    const lowest = magazineBounds.min.y;
    add('detachable-magazine', magazine, 0, -height * 0.5 - lowest, -length * 0.005);
  }
  box('pistol-grip', width * 0.43, height * 0.34, length * 0.085, 0, -height * 0.33, -length * 0.205);
  box('trigger-guard-bottom', width * 0.32, height * 0.045, length * 0.12, 0, -height * 0.3475, -length * 0.11);
  box('trigger-guard-front', width * 0.32, height * 0.2, length * 0.025, 0, -height * 0.27, -length * 0.0625);
  const trigger = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -height * 0.19, -length * 0.15),
    new THREE.Vector3(0, -height * 0.28, -length * 0.12),
    new THREE.Vector3(0, -height * 0.3, -length * 0.145),
  );
  add('trigger', new THREE.TubeGeometry(trigger, 5, Math.min(width, height) * 0.025, 5, false), 0, 0, 0);
  for (let groove = 0; groove < 4; groove++) {
    box(`handguard-rib-${groove}`, width * 0.76, height * 0.055, length * 0.014,
      0, -height * 0.145, length * (0.08 + groove * 0.055));
  }

  const merged = mergeGeometries(pieces, false);
  pieces.forEach(piece => piece.dispose());
  merged.computeBoundingBox(); merged.computeBoundingSphere();
  merged.userData.firearmParts = names;
  return merged;
}

export function refineGenericNpcFirearms(root, type) {
  if (!genericTypes.has(type)) return 0;
  let replaced = 0;
  for (const node of root.children) {
    if (!node.isMesh || node.isInstancedMesh || node.userData.npcFirearm || node.geometry?.type !== 'BoxGeometry') continue;
    if (node.position.z <= 0.3 || node.position.y < 1.1 || node.position.y > 1.6) continue;
    node.geometry.computeBoundingBox();
    const original = node.geometry.boundingBox.clone();
    const size = original.getSize(new THREE.Vector3());
    if (size.z < 0.9 || size.z < size.x * 2 || size.z < size.y * 3) continue;
    const previousGeometry = node.geometry;
    node.geometry = buildFirearmGeometry(original, type === 'subway_armed_hunter');
    previousGeometry.dispose();
    node.name = `equipment:${type}:generic-firearm`;
    node.userData.npcFirearm = {
      modelStatus: 'original_generic_firearm', fidelityVerified: false,
      kind: type === 'subway_armed_hunter' ? 'pump_shotgun' : 'rifle',
      originalBounds: { min: original.min.toArray(), max: original.max.toArray() },
      muzzleLocal: [0, 0, original.max.z],
    };
    replaced++;
  }
  return replaced;
}
