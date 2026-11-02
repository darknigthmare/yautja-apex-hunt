import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { applySurfaceDetail } from '../utils/surfaceDetail.js';
import { createHubPanelGeometry, createShipTerminalAtlas } from '../utils/hubSurfaceDetail.js';
import { applyShipArtDirection } from './ShipArtDirection.js';

const ROOM_NAMES = {
  'bridge-cockpit': 'NAVIGATION STELLAIRE', 'trophy-vault': 'ARCHIVES DE CHASSE',
  'mission-nexus': 'NEXUS DES CONTRATS', 'armory-forge': 'FORGE ET ARMURERIE',
  'cryo-gallery': 'GALERIE DE CRYOSTASE', 'escape-pod-bay': 'PODS DE TRAQUE',
  'cleaner-medbay': 'LABORATOIRE CLEANER', 'vehicle-hangar': 'HANGAR DE CHASSE',
  'engine-core': 'NOYAU ENERGETIQUE', 'rear-airlock': 'SAS ARRIERE', 'spine-corridor': 'COURSIVE CENTRALE',
};
const COOL_ROOMS = new Set(['bridge-cockpit', 'cryo-gallery', 'cleaner-medbay', 'vehicle-hangar']);

function bake(parts) {
  const result = mergeGeometries(parts, false); parts.forEach(geometry => geometry.dispose()); return result;
}

function bar(position, size, angle = 0) {
  const geometry = new THREE.BoxGeometry(...size); geometry.rotateZ(angle); geometry.translate(...position); return geometry;
}

function grilleGeometry() {
  const parts = [bar([-0.71, 0, 0], [0.08, 1.62, 0.055]), bar([0.71, 0, 0], [0.08, 1.62, 0.055]),
    bar([0, -0.77, 0], [1.4, 0.08, 0.055]), bar([0, 0.77, 0], [1.4, 0.08, 0.055])];
  for (const y of [-0.4, 0, 0.4]) parts.push(bar([0, y, 0], [1.25, 0.10, 0.04], 0.18));
  parts.push(bar([0, 0, 0.015], [0.08, 1.42, 0.065]));
  return bake(parts);
}

function vaultGeometry() {
  const vertices = [], uvs = [], indices = [], steps = 16;
  for (let face = 0; face < 2; face++) for (let row = 0; row <= steps; row++) {
    const x = -1 + row / steps * 2, y = (1 - x * x) * 0.95 + face * 0.055;
    vertices.push(x, y, -1, x, y, 1); uvs.push(row / steps * 4, 0, row / steps * 4, 4);
    if (row < steps) {
      const a = face * (steps + 1) * 2 + row * 2;
      if (face === 0) indices.push(a, a + 2, a + 1, a + 2, a + 3, a + 1);
      else indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }
  // Four perimeter skirts close the roof rather than relying on a single plane.
  const stride = (steps + 1) * 2;
  for (let row = 0; row < steps; row++) for (const end of [0, 1]) {
    const a = row * 2 + end, b = a + 2; indices.push(a, a + stride, b, b, a + stride, b + stride);
  }
  for (const row of [0, steps]) {
    const a = row * 2; indices.push(a, a + 1, a + stride, a + 1, a + stride + 1, a + stride);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices);
  geometry.computeVertexNormals(); return geometry;
}

function archGeometry(vault = false) {
  const points = [[-1, 0, 0], [-0.93, 0.53, 0], [-0.72, 0.88, 0], [-0.37, 1.06, 0],
    [0, 1.11, 0], [0.37, 1.06, 0], [0.72, 0.88, 0], [0.93, 0.53, 0], [1, 0, 0]];
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(([x, y, z]) =>
    new THREE.Vector3(x, vault ? (1 - x * x) * 0.95 : y, z))), 24, 0.028, 8, false);
}

function cableGeometry() {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -0.5), new THREE.Vector3(0.24, -0.14, -0.25),
    new THREE.Vector3(0.32, -0.20, 0.05), new THREE.Vector3(0, 0, 0.5),
  ]), 16, 0.13, 6, false);
}

function panelCasingGeometry() {
  const outer = new THREE.Shape();
  const outline = [[-0.5, -0.34], [-0.34, -0.5], [0.34, -0.5], [0.5, -0.30],
    [0.5, 0.34], [0.34, 0.5], [-0.34, 0.5], [-0.5, 0.30]];
  outline.forEach(([x, y], index) => index ? outer.lineTo(x, y) : outer.moveTo(x, y)); outer.closePath();
  const hole = new THREE.Path();
  [...outline].reverse().forEach(([x, y], index) => index ? hole.lineTo(x * 0.64, y * 0.69) : hole.moveTo(x * 0.64, y * 0.69));
  hole.closePath(); outer.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(outer, { depth: 0.18, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.035, bevelThickness: 0.06 });
  geometry.translate(0, 0, -0.09); return geometry;
}

function material(hub, color, kind = 'metal', roughness = 0.48, metalness = 0.72) {
  return applySurfaceDetail(new THREE.MeshStandardMaterial({ color, map: hub.alloyTexture,
    roughness, metalness, emissive: color, emissiveIntensity: 0.015 }),
  { kind, repeat: [3, 3], normalStrength: 0.20, roughnessStrength: 0.32 });
}

function recolorLight(hub, name, color, intensity, position) {
  const light = hub.group.getObjectByName(name); if (!light?.isLight) return;
  light.color.setHex(color); light.intensity = intensity;
  if (position) light.position.set(...position);
}

function discardUnusedCachedMaterials(hub) {
  const used = new Set(); hub.group.traverse(node => (Array.isArray(node.material) ? node.material : [node.material]).filter(Boolean).forEach(value => used.add(value)));
  for (const [key, value] of hub.materialCache ?? []) if (!used.has(value)) { value.dispose(); hub.materialCache.delete(key); }
}

function triangulateFastenerCaps(mesh) {
  const geometry = mesh?.geometry;
  if (geometry?.type !== 'CylinderGeometry' || geometry.parameters.radialSegments !== 6 || geometry.userData.compactCaps) return;
  const position = geometry.attributes.position, normal = geometry.attributes.normal;
  const indices = [], side = geometry.groups.find(group => group.materialIndex === 0);
  for (let index = side.start; index < side.start + side.count; index++) indices.push(geometry.index.getX(index));
  for (const sign of [-1, 1]) {
    const rim = [], unique = new Set();
    for (let index = 0; index < position.count; index++) {
      if (normal.getY(index) * sign < 0.99 || Math.hypot(position.getX(index), position.getZ(index)) < 0.001) continue;
      const key = `${Math.round(position.getX(index) * 100000)}:${Math.round(position.getZ(index) * 100000)}`;
      if (!unique.has(key)) { unique.add(key); rim.push(index); }
    }
    rim.sort((a, b) => Math.atan2(position.getZ(a), position.getX(a)) - Math.atan2(position.getZ(b), position.getX(b)));
    for (let index = 1; index < rim.length - 1; index++) {
      if (sign > 0) indices.push(rim[0], rim[index + 1], rim[index]);
      else indices.push(rim[0], rim[index], rim[index + 1]);
    }
  }
  geometry.setIndex(indices); geometry.clearGroups(); geometry.userData.compactCaps = true;
}

/** Architecture is original ship design; this does not certify a film-set copy.
 * Call after createGameplayLayout. All new solid surfaces stay above the highest
 * perch + standing hunter; low decorations reuse existing solid wall envelopes. */
export function attachShipInteriorDetail(hub) {
  if (hub.shipInteriorDetail && !hub.shipInteriorDetail.disposed) return hub.shipInteriorDetail;
  const group = new THREE.Group(); group.name = 'ship-interior-detail';
  const ownedGeometries = new Set(), ownedMaterials = new Set();
  const palettes = { shell: material(hub, 0x303d42), bronze: material(hub, 0x75604a),
    dark: material(hub, 0x111d23, 'metal', 0.62, 0.52), steel: material(hub, 0x647477, 'metal', 0.38, 0.82),
    cable: material(hub, 0x252923, 'skin', 0.68, 0.12) };
  Object.values(palettes).forEach(value => ownedMaterials.add(value));
  const signal = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }); ownedMaterials.add(signal);
  const batch = (name, geometry, surface, transforms, solid = false) => {
    ownedGeometries.add(geometry); if (!transforms.length) return null;
    const mesh = new THREE.InstancedMesh(geometry, surface, transforms.length), transform = new THREE.Object3D();
    transforms.forEach((entry, index) => {
      transform.position.fromArray(entry.position); transform.scale.fromArray(entry.scale ?? [1, 1, 1]);
      transform.rotation.set(...(entry.rotation ?? [0, 0, 0])); transform.updateMatrix(); mesh.setMatrixAt(index, transform.matrix);
      if (entry.color != null) mesh.setColorAt(index, new THREE.Color(entry.color));
    });
    mesh.name = name; mesh.receiveShadow = true; mesh.castShadow = false;
    mesh.userData = { instanceCount: transforms.length, cameraOcclusion: solid, visualOnly: !solid, shipInterior: true };
    mesh.computeBoundingSphere(); group.add(mesh); hub.registerProp?.(mesh, 'hub', name, { instanceCount: transforms.length }); return mesh;
  };

  // Spend the old microgeometry budget on room silhouettes, not thousands of
  // rounded floor corners or circular loops which read as exposed deck hoops.
  const oldGrille = hub.group.getObjectByName('perforated-deck-grille-instances');
  if (oldGrille) { oldGrille.geometry.dispose(); oldGrille.geometry = grilleGeometry(); oldGrille.userData.pattern = 'recessed-slotted-deck'; }
  triangulateFastenerCaps(hub.group.getObjectByName('ship-captive-fasteners'));
  const servicePanels = hub.group.getObjectByName('bulkhead-service-panels');
  if (servicePanels) { servicePanels.geometry.dispose(); servicePanels.geometry = panelCasingGeometry(); }

  const zones = hub.getZones?.() ?? hub.zones ?? [], roofs = [], ribs = [], cables = [], couplings = [], vents = [], trims = [], lamps = [], doorHoods = [];
  for (const zone of zones) {
    if (zone.id === 'spine-corridor') continue;
    const b = zone.bounds, cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
    const width = b.maxX - b.minX - 2.4, depth = b.maxZ - b.minZ - 2.4;
    const large = zone.id === 'mission-nexus' || zone.id === 'vehicle-hangar' || zone.id === 'engine-core';
    const cool = COOL_ROOMS.has(zone.id), accent = cool ? 0x7ca9a8 : 0xb59565;
    if (zone.id !== 'bridge-cockpit') roofs.push({ position: [cx, 16.4, cz], scale: [width / 2, large ? 5.5 : 3.5, depth / 2], color: cool ? 0x99b0b1 : 0xb4a18a });
    const count = Math.max(2, Math.floor(depth / 9));
    for (let index = 0; index < count; index++) {
      const z = b.minZ + 3.6 + index * (depth - 4.8) / Math.max(1, count - 1);
      ribs.push({ position: [cx, 16.15, z], scale: [width / 2, large ? 5.5 : 3.5, 6.5] });
      for (const side of [-1, 1]) {
        trims.push({ position: [cx + side * width * 0.46, 15.2, z], scale: [0.55, 0.42, 1.7] });
        lamps.push({ position: [cx + side * width * 0.46, 15.0, z], scale: [0.35, 0.08, 1.32], color: accent });
      }
    }
    for (const side of [-1, 1]) for (let line = 0; line < 2; line++) {
      const x = cx + side * (width / 2 - 0.45 - line * 0.5), y = 15.4 + line * 0.46;
      cables.push({ position: [x, y, cz], scale: [1, 1, depth] });
      for (let offset = -depth / 2 + 2; offset < depth / 2; offset += 5) couplings.push({ position: [x, y, cz + offset], rotation: [Math.PI / 2, 0, 0], scale: [0.25, 0.25, 0.18] });
    }
  }
  for (const door of hub.getDoors?.() ?? []) {
    if (door.state === 'sealed') continue;
    doorHoods.push({ position: [door.position.x, (door.clearance ?? 10.2) + 0.15, door.position.z],
      rotation: [0, door.axis === 'z' ? Math.PI / 2 : 0, 0], scale: [door.width / 2 + 0.5, 2.4, 7] });
  }
  for (const collider of hub.getColliders?.() ?? []) {
    if (collider.type !== 'box' || !/(bulkhead|divider)/.test(collider.id)) continue;
    const alongX = collider.halfWidth > collider.halfDepth, halfLength = alongX ? collider.halfWidth : collider.halfDepth;
    for (let offset = -halfLength + 3; offset < halfLength - 1; offset += 5) for (const face of [-1, 1]) {
      vents.push({ position: [collider.x + (alongX ? offset : face * (collider.halfWidth + 0.09)), 8.6,
        collider.z + (alongX ? face * (collider.halfDepth + 0.09) : offset)], rotation: [0, alongX ? 0 : Math.PI / 2, 0], scale: [1.8, 1.15, 1] });
    }
  }
  const keyDirection = new THREE.Vector3(9, -19, -14).normalize();
  const keyOrientation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), keyDirection));
  const keyPosition = new THREE.Vector3(-8, 19, 10), casingPosition = keyPosition.clone().addScaledVector(keyDirection, -0.18);
  trims.push({ position: casingPosition.toArray(), rotation: keyOrientation.toArray(), scale: [2.8, 0.28, 3.4] });
  lamps.push({ position: keyPosition.toArray(), rotation: keyOrientation.toArray(), scale: [2.35, 0.08, 2.9], color: 0xd8b086 });
  batch('ship-room-vault-shells', vaultGeometry(), palettes.shell, roofs, true);
  batch('ship-room-transverse-ribs', archGeometry(true), palettes.bronze, ribs, true);
  batch('ship-pressure-door-crowns', archGeometry(), palettes.steel, doorHoods, true);
  batch('ship-suspended-service-cables', cableGeometry(), palettes.cable, cables);
  batch('ship-conduit-retainer-collars', new THREE.TorusGeometry(1, 0.13, 6, 10), palettes.steel, couplings);
  batch('ship-bulkhead-service-grilles', grilleGeometry(), palettes.dark, vents);
  batch('ship-overhead-light-casings', createHubPanelGeometry(1, 1, 1, 0.08), palettes.dark, trims);
  batch('ship-overhead-light-diffusers', new THREE.BoxGeometry(1, 1, 1), signal, lamps);

  // Consolidate the six tiny console LEDs without changing any station group,
  // collider, control panel or animated prop. Instance colors retain their hues.
  const indicators = []; hub.group.updateMatrixWorld(true); const inverse = hub.group.matrixWorld.clone().invert();
  hub.group.traverse(node => {
    const p = node.geometry?.parameters;
    if (node.parent?.userData.role === 'interactive-console' && p?.width === 0.22 && p.height === 0.06 && p.depth === 0.12) indicators.push(node);
  });
  const ledTransforms = indicators.map(node => {
    const matrix = inverse.clone().multiply(node.matrixWorld), position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale); const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return { position: position.toArray(), rotation: [euler.x, euler.y, euler.z], scale: scale.toArray(), color: node.material.color.getHex() };
  });
  indicators.forEach(node => { node.removeFromParent(); node.geometry.dispose(); });
  batch('ship-console-status-leds', new THREE.BoxGeometry(0.22, 0.06, 0.12), signal, ledTransforms);

  const terminalZones = zones.map(zone => ({ id: zone.id, label: ROOM_NAMES[zone.id] ?? zone.label }));
  const atlas = createShipTerminalAtlas(terminalZones), screenParts = [], frames = [], controls = [], screenPlacements = [];
  const placements = [
    ['bridge-cockpit', -17, 5.8, -51.1, 0], ['trophy-vault', -20, 5.5, -31.05, 0],
    ['mission-nexus', 35.2, 5.6, -6, -Math.PI / 2], ['cryo-gallery', -36.8, 5.6, -38, -Math.PI / 2],
    ['cleaner-medbay', 36.8, 5.6, -38, Math.PI / 2], ['escape-pod-bay', -36.8, 5.6, -5, -Math.PI / 2],
    ['armory-forge', 36.8, 5.6, -5, Math.PI / 2], ['vehicle-hangar', -50, 5.6, 40.8, 0],
    ['engine-core', 50, 5.6, 40.8, 0], ['rear-airlock', 14.2, 5.6, 73, -Math.PI / 2],
    ['spine-corridor', -35.2, 5.6, -6, Math.PI / 2],
  ];
  for (const [zoneId, fallbackX, fallbackY, fallbackZ, fallbackYaw] of placements) {
    const index = terminalZones.findIndex(zone => zone.id === zoneId); if (index < 0) continue;
    const station = hub.getStations?.().find(entry => entry.zoneId === zoneId && entry.consolePosition && entry.interactionType !== 'mission_contract');
    const yaw = station?.consoleYaw ?? fallbackYaw, pitch = station?.consolePitch ?? 0;
    const origin = station?.consolePosition;
    const x = origin?.x ?? fallbackX, y = origin?.y ?? fallbackY, z = origin?.z ?? fallbackZ;
    const width = station ? 2.6 : 5.5, height = station ? 1.25 : 2.6, transform = new THREE.Object3D();
    transform.position.set(x, y, z); transform.rotation.set(pitch, yaw, 0, 'YXZ'); transform.translateZ(station ? 0.12 : 0); transform.updateMatrix();
    const geometry = new THREE.PlaneGeometry(width, height), uv = geometry.attributes.uv;
    for (let vertex = 0; vertex < uv.count; vertex++) uv.setXY(vertex, (index % 4 + uv.getX(vertex)) / 4, 1 - (Math.floor(index / 4) + 1 - uv.getY(vertex)) / 4);
    geometry.applyMatrix4(transform.matrix); screenParts.push(geometry); screenPlacements.push({ zoneId, x, y, z, yaw, pitch, width, height, stationId: station?.id ?? null });
    for (const [dx, dy, w, h] of [[0, -height / 2 - 0.14, width + 0.38, 0.24], [0, height / 2 + 0.14, width + 0.38, 0.24],
      [-width / 2 - 0.14, 0, 0.24, height], [width / 2 + 0.14, 0, 0.24, height]]) {
      const point = new THREE.Vector3(dx, dy, -0.1).applyMatrix4(transform.matrix);
      frames.push({ position: point.toArray(), rotation: [pitch, yaw, 0, 'YXZ'], scale: [w, h, 0.28] });
    }
    const point = new THREE.Vector3(0, -height / 2 - 0.46, 0.03).applyMatrix4(transform.matrix);
    controls.push({ position: point.toArray(), rotation: [pitch, yaw, 0, 'YXZ'], scale: [Math.min(3.6, width * 0.8), 0.15, 0.12], color: COOL_ROOMS.has(zoneId) ? 0x7ca9a8 : 0xb59565 });
  }
  batch('ship-terminal-armored-bezels', createHubPanelGeometry(1, 1, 1, 0.08), palettes.bronze, frames);
  batch('ship-terminal-liaison-indicators', new THREE.BoxGeometry(1, 1, 1), signal, controls);
  if (screenParts.length) {
    const geometry = bake(screenParts), surface = new THREE.MeshBasicMaterial({ map: atlas.texture, toneMapped: false });
    ownedGeometries.add(geometry); ownedMaterials.add(surface);
    const screens = new THREE.Mesh(geometry, surface); screens.name = 'ship-live-terminal-screens';
    screens.userData = { cameraOcclusion: false, visualOnly: true, shipInterior: true, screenPlacements };
    group.add(screens); hub.registerProp?.(screens, 'hub', 'live-ship-terminals', { screenCount: screenPlacements.length, contextual: true });
  }
  hub.group.add(group); hub.registerProp?.(group, 'hub', 'compartment-interior-detail', { originalDesign: true, minimumCeiling: 16.4 });
  recolorLight(hub, 'hub-readability-ambient-light', 0xa6bcc1, 0.9);
  recolorLight(hub, 'hub-ambient-fill-light', 0x9bbec5, 1.1);
  recolorLight(hub, 'hub-warm-key-light', 0xffba79, 5.3);
  recolorLight(hub, 'hangar-cool-fill-light', 0x77bec7, 4.2, [-42, 12, 60]);
  recolorLight(hub, 'trophy-vault-fill-light', 0xcdb18c, 3.1, [0, 11, -28]);
  recolorLight(hub, 'forge-local-light', 0xffad54, 4.4);
  const artDirection = applyShipArtDirection(hub, { group, batch, ownedGeometries, ownedMaterials });
  discardUnusedCachedMaterials(hub); hub.cameraOcclusion = null;
  const api = { group, atlas, screenPlacements, disposed: false,
    updateTerminalContext(context = {}) {
      if (api.disposed) return false;
      if (Object.prototype.hasOwnProperty.call(context, 'stationId')) artDirection.setActiveStation(context.stationId);
      const changed = atlas.update(context); if (changed) artDirection.refreshCasters(); return changed;
    },
    setNavigationRoute: route => atlas.update({ routeLabel: route?.label ?? route?.targetLabel ?? '' }),
    setShadowQuality: quality => api.disposed ? false : artDirection.setShadowQuality(quality),
    refreshShadowCasters: () => artDirection.refreshCasters(),
    shadow: artDirection.shadow,
    metrics: { addedBatches: group.children.filter(node => node.isMesh).length, roofCount: roofs.length, ribCount: ribs.length,
      minimumCeiling: 16.4, roomCount: zones.length, liveTerminalCount: screenPlacements.length,
      consolidatedConsoleLeds: indicators.length, deckFinishPanelCounts: artDirection.deckCounts, shadow: artDirection.shadow },
    dispose() {
      if (api.disposed) return; api.disposed = true; group.removeFromParent();
      artDirection.dispose();
      ownedGeometries.forEach(geometry => geometry.dispose()); ownedMaterials.forEach(surface => surface.dispose()); atlas.dispose(); group.clear();
    },
  };
  hub.shipInteriorDetail = api; return api;
}
