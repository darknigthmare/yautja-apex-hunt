import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const YAUTJA_TYPES = new Set(['badBlood', 'superPredator', 'feralPredator', 'wolfCleaner', 'upgradePredator', 'cityHunter', 'jungleHunter']);
const XENO_TYPES = new Set(['xenoQueen', 'gridAlien', 'predalien', 'xenoKing']);
export const SHIP_TROPHY_BOSS_TYPES = Object.freeze([...YAUTJA_TYPES, ...XENO_TYPES, 'megafauna', 'kalisk', 'vydrach', 'rhynth']);

/** Cranial studies of the game's bosses; original reconstructions, not scans. */
export function createShipTrophyGeometry(bossType) {
  if (!SHIP_TROPHY_BOSS_TYPES.includes(bossType)) throw new RangeError(`Unknown trophy boss type: ${bossType}`);
  const parts = [], features = [];
  const add = (name, geometry, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], shade = 1) => {
    const baked = geometry.index ? geometry.toNonIndexed() : geometry;
    if (baked !== geometry) geometry.dispose();
    baked.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), new THREE.Vector3(...scale)));
    const colors = new Float32Array(baked.attributes.position.count * 3); colors.fill(shade);
    baked.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    parts.push(baked); features.push(name);
  };
  const sphere = (name, position, scale, shade = 1, segments = 12) => add(name,
    new THREE.SphereGeometry(1, segments, 8), position, scale, undefined, shade);
  const tube = (name, points, radius, shade = 1, segments = 6, sides = 5) => add(name,
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, sides, false),
    undefined, undefined, undefined, shade);
  const cone = (name, position, radius, height, rotation = [0, 0, 0]) => add(name,
    new THREE.ConeGeometry(radius, height, 5, 1), position, undefined, rotation);
  const teeth = (count, width, front, upperY, lowerY) => {
    for (let index = 0; index < count; index++) {
      const x = (index / Math.max(1, count - 1) - 0.5) * width;
      cone('upper-tooth', [x, upperY, front], 0.045, 0.15, [0, 0, Math.PI]);
      cone('lower-tooth', [x, lowerY, front + 0.015], 0.04, 0.13);
    }
  };
  const mandibles = (width = 0.52) => {
    for (const side of [-1, 1]) for (const upper of [-1, 1]) {
      const y = upper > 0 ? 0.12 : -0.29;
      tube('paired-mandible-bone', [[side * width, y, 0.35], [side * (width + 0.17), y - 0.1, 0.68],
        [side * (width - 0.1), y - 0.24, 0.92]], 0.075, 0.92, 4);
      cone('mandible-tusk', [side * (width - 0.13), y - 0.14, 0.96], 0.05, 0.24, [0.2, 0, side * -0.45]);
    }
  };
  const openJaw = (width = 0.48, front = 0.58) => {
    tube('open-mandibular-arch', [[-width, -0.11, front - 0.1], [-width * 0.94, -0.46, front],
      [0, -0.63, front + 0.08], [width * 0.94, -0.46, front], [width, -0.11, front - 0.1]], 0.085, 0.94, 10);
    sphere('oral-cavity', [0, -0.28, front - 0.06], [width * 0.75, 0.23, 0.04], 0.045, 8);
    teeth(5, width * 1.3, front + 0.1, -0.17, -0.47);
  };

  if (YAUTJA_TYPES.has(bossType)) {
    const broad = bossType === 'superPredator' || bossType === 'upgradePredator';
    const width = broad ? 0.76 : bossType === 'feralPredator' ? 0.7 : 0.63;
    sphere('cranial-case', [0, 0.35, -0.18], [width, 0.72, 0.66]);
    for (const side of [-1, 1]) {
      sphere('orbital-cavity', [side * 0.3, 0.22, 0.46], [0.21, 0.21, 0.055], 0.035, 8);
      tube('supraorbital-brow', [[side * 0.08, 0.38, 0.53], [side * 0.32, 0.47, 0.56],
        [side * 0.54, 0.32, 0.43]], 0.09, 1, 5);
      tube('zygomatic-arch', [[side * 0.55, 0.24, 0.39], [side * 0.52, -0.02, 0.6],
        [side * 0.23, -0.16, 0.62]], 0.075, 0.93, 4);
    }
    sphere('maxillary-bridge', [0, -0.1, 0.55], [0.28, 0.17, 0.16], 0.96, 8);
    sphere('nasal-aperture', [0, 0.04, 0.69], [0.09, 0.14, 0.025], 0.055, 8);
    openJaw(broad ? 0.54 : 0.47); mandibles(broad ? 0.6 : 0.5);
    const crests = bossType === 'feralPredator' ? 3 : broad ? 4 : 2;
    for (let ridge = 0; ridge < crests; ridge++) {
      const x = (ridge - (crests - 1) / 2) * 0.22;
      tube('cranial-suture-ridge', [[x, 0.66, 0.22], [x * 1.1, 1.01, -0.12], [x * 0.8, 0.77, -0.63]], 0.035, 0.87, 5, 4);
    }
    if (bossType === 'wolfCleaner') tube('asymmetric-bone-fracture', [[-0.5, 0.7, 0.12], [-0.4, 0.31, 0.49], [-0.52, 0.08, 0.52]], 0.022, 0.12, 4, 3);
    if (bossType === 'cityHunter') tube('sagittal-suture', [[0, 0.96, 0.05], [0, 1.07, -0.3], [0, 0.71, -0.73]], 0.035, 0.86, 5, 4);
  } else if (XENO_TYPES.has(bossType)) {
    sphere('eyeless-elongated-cranium', [0, 0.32, -0.48], [0.53, 0.45, 1.26], 0.97, 18);
    sphere('frontal-maxilla', [0, -0.02, 0.58], [0.37, 0.23, 0.34], 0.9, 8);
    openJaw(0.41, 0.75);
    tube('inner-jaw-sheath', [[0, -0.28, 0.58], [0, -0.28, 0.88], [0, -0.23, 1.04]], 0.055, 0.7, 4);
    for (const side of [-1, 1]) tube('temporal-conduit', [[side * 0.44, 0.08, 0.52], [side * 0.47, -0.03, -0.18],
      [side * 0.35, 0.06, -1.18]], 0.047, 0.78, 7);
    if (bossType === 'predalien') mandibles(0.49);
    if (bossType === 'xenoQueen' || bossType === 'xenoKing') {
      const crest = new THREE.Shape();
      crest.moveTo(-0.5, 0); crest.lineTo(-1.04, 0.22); crest.lineTo(-0.86, 0.84);
      crest.lineTo(-0.34, 1.05); crest.lineTo(0, 0.85); crest.lineTo(0.34, 1.05);
      crest.lineTo(0.86, 0.84); crest.lineTo(1.04, 0.22); crest.lineTo(0.5, 0); crest.closePath();
      add('cranial-crown-fan', new THREE.ExtrudeGeometry(crest, { depth: 0.1, bevelEnabled: false, curveSegments: 1 }), [0, 0.5, -0.75]);
      if (bossType === 'xenoKing') for (let spike = -2; spike <= 2; spike++)
        cone('royal-crown-spine', [spike * 0.31, 1.48 - Math.abs(spike) * 0.1, -0.7], 0.075, 0.45);
    }
    if (bossType === 'gridAlien') {
      for (const x of [-0.22, 0, 0.22]) tube('grid-scar-reference', [[x, 0.61, 0.3], [x, 0.77, -0.4], [x, 0.6, -1.2]], 0.022, 0.18, 4, 3);
      for (const z of [-0.1, -0.55, -0.95]) tube('grid-scar-reference', [[-0.38, 0.61, z], [0, 0.77, z], [0.38, 0.61, z]], 0.022, 0.18, 4, 3);
    }
  } else if (bossType === 'kalisk') {
    add('adaptive-carapace-fragment', new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.67),
      [0, 0.08, -0.12], [0.95, 0.8, 0.82], [0.2, 0, 0]);
    for (let rib = -2; rib <= 2; rib++) tube('carapace-segment', [[rib * 0.27, -0.3, 0.51], [rib * 0.31, 0.42, 0.55],
      [rib * 0.24, 0.8, -0.06]], 0.055, 0.8, 5);
    sphere('exposed-core-socket', [0, 0.06, 0.67], [0.3, 0.35, 0.06], 0.06, 8);
    for (const side of [-1, 1]) cone('carapace-edge-spine', [side * 0.72, 0.7, 0.08], 0.11, 0.6, [0, 0, side * -0.5]);
  } else {
    const reptile = bossType === 'vydrach';
    sphere('cranial-vault', [0, 0.28, -0.3], [reptile ? 0.58 : 0.75, 0.6, 0.75]);
    sphere('projecting-snout', [0, -0.03, 0.48], [reptile ? 0.32 : 0.48, 0.25, reptile ? 0.84 : 0.5], 0.95);
    for (const side of [-1, 1]) {
      sphere('orbital-cavity', [side * 0.48, 0.28, 0.18], [0.13, 0.19, 0.15], 0.04, 8);
      tube('orbital-rim', [[side * 0.36, 0.51, 0.31], [side * 0.6, 0.47, 0.2], [side * 0.58, 0.13, 0.24]], 0.075, 1, 4);
      tube('horn-core', [[side * 0.5, 0.58, -0.15], [side * 0.78, 0.88, -0.34], [side * 0.81, 1.32, -0.48]], 0.1, 0.88, 5);
    }
    openJaw(reptile ? 0.34 : 0.48, reptile ? 1.0 : 0.67);
    if (bossType === 'rhynth') cone('frontal-rhynth-horn', [0, 0.55, 0.63], 0.17, 0.85, [0.36, 0, 0]);
    if (bossType === 'megafauna') for (const side of [-1, 1]) cone('goliath-brow-horn', [side * 0.3, 0.67, 0.31], 0.12, 0.67, [0.2, 0, side * -0.3]);
    if (reptile) for (let crest = 0; crest < 3; crest++) cone('vydrach-crest-spine', [0, 0.91, -0.1 - crest * 0.28], 0.075, 0.44);
  }
  const geometry = mergeGeometries(parts, false); parts.forEach(part => part.dispose());
  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new THREE.Vector3());
  const center = geometry.boundingBox.getCenter(new THREE.Vector3());
  const fit = Math.min(2.65 / size.x, 2.8 / size.y, 2.75 / size.z);
  geometry.translate(-center.x, -center.y, -center.z); geometry.scale(fit, fit, fit);
  geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  geometry.userData = { sourceBossType: bossType, modelStatus: 'procedural_trophy_interpretation',
    artifactStatus: bossType === 'kalisk' ? 'carapace_study' : 'cranial_study', fidelityVerified: false,
    displayScale: 'normalized_study', features: [...new Set(features)] };
  return geometry;
}
