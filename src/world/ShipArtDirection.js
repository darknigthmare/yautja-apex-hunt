import * as THREE from 'three';
import { applySurfaceDetail } from '../utils/surfaceDetail.js';

const AMBER = 0xc49a62, CYAN = 0x68a8aa;

function tint(material, color, opacity) {
  material.color?.setHex(color); material.emissive?.setHex(color);
  if (material.emissiveIntensity != null) material.emissiveIntensity = 0.3;
  if (opacity != null) { material.opacity = opacity; material.transparent = opacity < 1; material.depthWrite = opacity >= 1; }
  material.needsUpdate = true;
}

function contactTexture() {
  const size = 64, data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const radius = Math.hypot((x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1);
    const alpha = Math.round((1 - THREE.MathUtils.smoothstep(radius, 0.2, 1)) * 255);
    const offset = (y * size + x) * 4;
    data[offset] = data[offset + 1] = data[offset + 2] = alpha; data[offset + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.name = 'ship-static-contact-approximation'; texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true; return texture;
}

function floorFinish(hub, color, roughness, metalness) {
  return applySurfaceDetail(new THREE.MeshStandardMaterial({ color, map: hub.alloyTexture, roughness, metalness,
    emissiveIntensity: 0, envMapIntensity: 0.3 }),
  { kind: 'metal', repeat: [1.5, 1.5], normalStrength: 0.13, roughnessStrength: 0.25 });
}

function shadowCandidate(node) {
  if (node.userData.visualOnly || /(pressurized-hull|deck|grille|floor|ceiling|hull-spines|ship-room|structural|fastener|vent|trim|light|engraving|identification|navigation|coupler|conduit|pipe|cable|beacon|signal)/.test(node.name)) return false;
  const materials = Array.isArray(node.material) ? node.material : [node.material];
  return materials.every(material => material?.isMeshStandardMaterial && material.opacity >= 0.98
    && !material.wireframe && material.depthWrite !== false
    && Math.max(material.emissive.r, material.emissive.g, material.emissive.b) * material.emissiveIntensity < 0.08);
}

/** Curated ship palette and one bounded real shadow. Contact decals elsewhere
 * approximate static ambient occlusion; they are not extra shadow-map passes. */
export function applyShipArtDirection(hub, { group, batch, ownedGeometries, ownedMaterials }) {
  const stationMaterials = new Map();
  hub.group.traverse(node => {
    if (!node.name.startsWith('mission-station-')) return;
    const materials = [];
    node.traverse(mesh => {
      if (!mesh.isMesh) return;
      if (mesh.name.startsWith('mission-rings-')) {
        // The ring remains outside the detail group: the hub owns its clone.
        mesh.material = mesh.material.clone(); tint(mesh.material, AMBER, 0.36); materials.push(mesh.material);
      } else if (mesh.name.startsWith('hologram-')) { tint(mesh.material, AMBER, 0.32); materials.push(mesh.material); }
      else if (mesh.geometry?.type === 'CylinderGeometry' && mesh.material.isMeshBasicMaterial && mesh.material.transparent) {
        tint(mesh.material, AMBER, 0.04); materials.push(mesh.material);
      }
    });
    stationMaterials.set(`contract-console-${node.userData.huntId}`, materials);
  });
  const bridge = hub.group.getObjectByName('bridge-stellar-hologram');
  if (bridge) {
    bridge.scale.setScalar(0.64);
    bridge.traverse(node => { if (node.material) tint(node.material, CYAN, node.material.wireframe ? 0.45 : 0.30); });
  }
  for (const name of ['structural-slit-instances', 'ceiling-strip-instances', 'navigation-route-instances',
    'pressure-door-teeth', 'extended-utility-couplers', 'vault-frame-rails-even', 'vault-frame-rails-odd', 'vault-trophy-uplights']) {
    const node = hub.group.getObjectByName(name); if (node?.material) tint(node.material, AMBER, 0.44);
  }
  for (const name of ['corridor-biometric-light-instances', 'cryo-pod-window-instances', 'cryo-hatch-ring-instances', 'escape-pod-seal-rings']) {
    const node = hub.group.getObjectByName(name); if (node?.material) tint(node.material, CYAN, 0.26);
  }
  const vault = hub.landmarks.get('trophy-vault');
  vault?.traverse(node => {
    if (node.material?.emissiveIntensity > 0.5 && node.material.transparent && node.material.opacity > 0.5) tint(node.material, AMBER, 0.44);
  });
  const routes = hub.group.getObjectByName('floor-navigation-routes');
  routes?.children.filter(node => node.name !== 'navigation-route-instances').forEach(node => { if (node.material) tint(node.material, CYAN, 0.38); });

  const oldDeck = hub.group.getObjectByName('segmented-deck-plates');
  const deckCounts = [];
  if (oldDeck?.isInstancedMesh) {
    const geometry = oldDeck.geometry.clone(), uv = geometry.attributes.uv;
    for (let index = 0; index < uv.count; index++) uv.setXY(index, uv.getX(index) / 3, uv.getY(index) / 3);
    const finishes = [floorFinish(hub, 0x30383b, 0.64, 0.55), floorFinish(hub, 0x364b50, 0.46, 0.42), floorFinish(hub, 0x252e31, 0.74, 0.5)];
    finishes.forEach(material => ownedMaterials.add(material));
    const transforms = [[], [], []], matrix = new THREE.Matrix4();
    const position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
    for (let index = 0; index < oldDeck.count; index++) {
      oldDeck.getMatrixAt(index, matrix); matrix.decompose(position, quaternion, scale);
      const zone = hub.getZoneAt(position)?.id;
      const finish = ['cleaner-medbay', 'cryo-gallery', 'bridge-cockpit'].includes(zone) ? 1
        : ['vehicle-hangar', 'engine-core', 'armory-forge', 'escape-pod-bay'].includes(zone) ? 2 : 0;
      const euler = new THREE.Euler().setFromQuaternion(quaternion);
      const variation = new THREE.Color(0xffffff).multiplyScalar(0.92 + ((index * 37) % 17) / 200);
      transforms[finish].push({ position: position.toArray(), rotation: [euler.x, euler.y, euler.z], scale: scale.toArray(), color: variation });
    }
    oldDeck.removeFromParent(); oldDeck.geometry.dispose();
    const registryIndex = hub.propRegistry.indexOf(oldDeck); if (registryIndex >= 0) hub.propRegistry.splice(registryIndex, 1);
    transforms.forEach((entries, index) => {
      const mesh = batch(index === 0 ? 'segmented-deck-plates' : `ship-deck-finish-${index}`, geometry, finishes[index], entries);
      if (mesh) { mesh.receiveShadow = true; mesh.userData.role = 'floor-panels'; deckCounts.push(entries.length); }
    });
    ownedGeometries.add(geometry);
  }
  const contacts = [];
  for (const collider of hub.getColliders()) {
    if (!/(mission-pedestal|forge-core|forge-control-console|hangar-(scout|shuttle|pod|heavy|clan|drop)|cryo-pod|escape-pod|cleaner-surgery|engine-reactor|bridge-pilot|service-console)/.test(collider.id)) continue;
    const width = collider.type === 'box' ? collider.halfWidth * 2 : collider.radius * 2;
    const depth = collider.type === 'box' ? collider.halfDepth * 2 : collider.radius * 2;
    contacts.push({ position: [collider.x, 0.087, collider.z], rotation: [-Math.PI / 2, 0, 0], scale: [width + 0.9, depth + 0.9, 1] });
  }
  const contactMap = contactTexture(), contactMaterial = new THREE.MeshBasicMaterial({ color: 0x03090c, alphaMap: contactMap,
    transparent: true, opacity: 0.28, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1 });
  ownedMaterials.add(contactMaterial);
  const contactMesh = batch('ship-static-ambient-contact-decals', new THREE.PlaneGeometry(1, 1), contactMaterial, contacts);
  if (contactMesh) contactMesh.userData.contactApproximation = true;

  const ambient = hub.group.getObjectByName('hub-readability-ambient-light'); if (ambient) ambient.intensity = 0.42;
  const hemi = hub.group.getObjectByName('hub-ambient-fill-light'); if (hemi) hemi.intensity = 0.72;
  const fill = hub.group.getObjectByName('hub-warm-key-light'); if (fill) fill.intensity = 1.4;
  const key = new THREE.SpotLight(0xffd4a0, 90, 65, 0.88, 0.45, 1.5);
  key.name = 'ship-nexus-shadow-key'; key.position.set(-8, 19, 10); key.target.position.set(1, 0, -4);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.near = 2;
  key.shadow.camera.far = 65; key.shadow.normalBias = 0.035; key.shadow.bias = -0.00015;
  key.shadow.radius = 3; group.add(key, key.target);
  const shadow = { enabled: true, quality: 'high', mapSize: 1024, maximumShadowPasses: 1, casterCandidates: 0,
    contactDecalCount: contacts.length, contactDecalsAreApproximate: true, measuredGpuDraws: null };
  const refreshCasters = () => {
    shadow.casterCandidates = 0;
    hub.group.traverse(node => {
      if (!node.isMesh) return;
      node.castShadow = shadowCandidate(node);
      if (node.castShadow) shadow.casterCandidates++;
      if (node.material?.isMeshStandardMaterial) { node.receiveShadow = true; node.material.envMapIntensity = Math.min(node.material.envMapIntensity, 0.65); }
    });
  };
  refreshCasters();
  return { key, shadow, deckCounts,
    refreshCasters,
    setActiveStation(stationId) {
      for (const [id, materials] of stationMaterials) for (const material of materials) {
        material.color.setHex(id === stationId ? CYAN : AMBER); material.emissive?.setHex(id === stationId ? CYAN : AMBER);
      }
    },
    setShadowQuality(quality) {
      refreshCasters();
      const enabled = quality !== 'performance'; shadow.quality = quality; shadow.enabled = enabled; key.castShadow = enabled;
      shadow.maximumShadowPasses = enabled ? 1 : 0;
      if (!enabled) {
        key.shadow.dispose(); key.shadow.map = null; key.shadow.mapPass = null;
      } else key.shadow.needsUpdate = true;
      return enabled;
    },
    dispose() { shadow.enabled = false; shadow.maximumShadowPasses = 0; key.castShadow = false;
      key.dispose(); key.removeFromParent(); key.target.removeFromParent(); contactMap.dispose(); },
  };
}
