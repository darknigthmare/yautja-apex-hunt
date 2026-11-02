import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json' with { type: 'json' };
import { YautjaPlayer } from '../entities/YautjaPlayer.js';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';
import { PLAYABLE_WEAPONS } from '../data/RuntimeEquipment.js';
import { applySurfaceDetail } from '../utils/surfaceDetail.js';
import { createHubPanelGeometry } from '../utils/hubSurfaceDetail.js';
import { createShipTrophyGeometry } from './ShipTrophyGeometry.js';
export { getNearbyShipDisplay } from './ShipDisplayInspection.js';

const font = new FontLoader().parse(helvetiker);
const modelFor = (itemId) => PLAYABLE_WEAPONS.find(item => item.id === itemId);

export const SHIP_EQUIPMENT_DISPLAY_ITEMS = Object.freeze([
  { itemId: 'combi_stick', label: 'Combi-stick', engraving: '03  COMBI-STICK', modelBuilder: 'fireCombiStick', source: 'YautjaPlayer.fireCombiStick', position: [-0.85, 4.8, -6.4], orientation: 'vertical', labelY: 1.1 },
  { itemId: 'wristblades', label: 'Lames de poignet — paire standard', engraving: '01  LAMES DE POIGNET', modelBuilder: 'createWristbladeAssembly', source: 'YautjaPlayer.createWristbladeAssembly', position: [-0.85, 6.6, -3.9], orientation: 'vertical', labelY: 3.5 },
  { itemId: 'smart_disc', label: 'Disque intelligent', engraving: '04  DISQUE INTELLIGENT', modelBuilder: 'fireSmartDisc', source: 'YautjaPlayer.fireSmartDisc', position: [-0.85, 6.8, -0.8], orientation: 'front', labelY: 5.2 },
  { itemId: 'netgun', label: 'Filet de capture déployé — échantillon du lance-filet', engraving: '05  FILET DE CAPTURE', modelBuilder: 'fireNetgun', source: 'YautjaPlayer.fireNetgun', position: [-0.9, 3.0, -0.8], orientation: 'front', labelY: 0.55 },
  { itemId: 'plasmacaster_single', label: 'Canon à plasma et servo-monture', engraving: '02  CANON A PLASMA', modelBuilder: 'createPlasmaCasterAssembly', source: 'YautjaPlayer.createPlasmaCasterAssembly', position: [-0.85, 6.2, 4.1], orientation: 'side', labelY: 5.0 },
  { itemId: 'wrist_shield', variantId: 'variant_feral_bone_shield', label: 'Bouclier segmenté du Feral', engraving: 'FERAL  BOUCLIER SEGMENTE', source: 'MothershipHub.createWeaponRack / variant_feral_bone_shield', position: [-0.85, 3.0, 5.0], orientation: 'side', labelY: 1.3 },
].map(item => Object.freeze({ ...item, position: Object.freeze(item.position) })));

function mergedParts(parts) {
  const result = mergeGeometries(parts, false); parts.forEach(part => part.dispose());
  result.computeBoundingBox(); result.computeBoundingSphere();
  return result;
}

function bakedGeometry(geometry, matrix) {
  const result = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  result.clearGroups(); result.applyMatrix4(matrix); return result;
}

function nativeWeapon(item, hub) {
  const prototype = YautjaPlayer.prototype;
  const context = {
    scene: { add() {} }, mesh: new THREE.Object3D(), projectiles: [],
    tagPlayerMesh: prototype.tagPlayerMesh, createArmorPlateGeometry: prototype.createArmorPlateGeometry,
    getWeaponRuntimeProfile: () => ({ damageMultiplier: 1, projectileSpeedMultiplier: 1, rangeMultiplier: 1, snareDurationMultiplier: 1 }),
  };
  const armor = hub.createAlloyMaterial(0x54656a), accent = hub.createAlloyMaterial(0x9c8050), blade = hub.createAlloyMaterial(0xb5c2c7);
  let source;
  if (item.modelBuilder === 'createWristbladeAssembly') source = prototype.createWristbladeAssembly.call(context, 1, armor, accent, blade);
  else if (item.modelBuilder === 'createPlasmaCasterAssembly') source = prototype.createPlasmaCasterAssembly.call(context, armor, accent);
  else {
    prototype[item.modelBuilder].call(context, new THREE.Vector3(0, 4, 10));
    source = context.projectiles.at(-1).mesh;
  }
  source.position.set(0, 0, 0); source.quaternion.identity(); source.updateMatrixWorld(true);
  const byMaterial = new Map(), features = new Set(), sourceGeometries = new Set();
  const inverse = source.matrixWorld.clone().invert(), instance = new THREE.Matrix4();
  source.traverse(node => { if (node.geometry) sourceGeometries.add(node.geometry); });
  source.traverseVisible(node => {
    if (!node.isMesh) return;
    const material = node.material;
    if (!byMaterial.has(material)) byMaterial.set(material, []);
    if (node.userData.detailRole) features.add(node.userData.detailRole);
    const base = inverse.clone().multiply(node.matrixWorld);
    if (node.isInstancedMesh) for (let index = 0; index < node.count; index++) {
      node.getMatrixAt(index, instance); byMaterial.get(material).push(bakedGeometry(node.geometry, base.clone().multiply(instance)));
    } else byMaterial.get(material).push(bakedGeometry(node.geometry, base));
  });
  const model = new THREE.Group();
  for (const [material, parts] of byMaterial) {
    applySurfaceDetail(material, { kind: material.roughness > 0.6 ? 'fabric' : 'metal', repeat: [2, 2], normalStrength: 0.25 });
    const mesh = new THREE.Mesh(mergedParts(parts), material);
    mesh.castShadow = mesh.receiveShadow = true; model.add(mesh);
  }
  // The source was only a short-lived geometry builder. Its materials now live
  // on the fused display; cloned source geometries can be freed immediately.
  sourceGeometries.forEach(geometry => geometry.dispose()); source.clear();
  model.userData.runtimeGeometryFeatures = [...features];
  model.userData.modelStatus = 'runtime_weapon_geometry';
  return model;
}

function labelGeometry(text, size = 0.21, maxWidth = 3.2) {
  const geometry = new THREE.ShapeGeometry(font.generateShapes(text, size), 3);
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox, width = bounds.max.x - bounds.min.x;
  const fit = Math.min(1, maxWidth / Math.max(0.001, width));
  geometry.translate(-(bounds.min.x + bounds.max.x) / 2, -bounds.min.y, 0);
  geometry.scale(fit, fit, 1); return geometry;
}

function freeRetiredResources(roots, hub) {
  const retired = new Set(), live = new Set(), oldMaterials = new Set(), liveMaterials = new Set();
  const inspect = (root, geometries, materials) => root.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    const source = Array.isArray(node.material) ? node.material : [node.material];
    source.filter(Boolean).forEach(material => materials.add(material));
  });
  roots.forEach(root => inspect(root, retired, oldMaterials));
  inspect(hub.group, live, liveMaterials);
  retired.forEach(geometry => { if (!live.has(geometry)) geometry.dispose(); });
  for (const material of oldMaterials) if (!liveMaterials.has(material)) {
    // A cached material retired with the old rack must not remain as a stale,
    // undisposed cache entry, nor be returned later after being disposed.
    for (const [key, value] of hub.materialCache ?? []) if (value === material) hub.materialCache.delete(key);
    material.dispose();
  }
}

function attachArmory(hub, registry) {
  const rack = hub.group.getObjectByName('forge-weapon-rack');
  if (!rack) return;
  const shield = rack.getObjectByName('rack-feral-shield');
  shield?.removeFromParent();
  const retired = [...rack.children]; retired.forEach(child => rack.remove(child));
  const back = new THREE.Mesh(createHubPanelGeometry(0.55, 9.4, 16, 0.1), hub.createAlloyMaterial(0x27343d));
  back.position.y = 4.8; back.name = 'armory-equipment-backed-cabinet'; rack.add(back);
  const supports = [], engravings = [];
  const transform = new THREE.Object3D();
  const vertical = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0));
  for (const item of SHIP_EQUIPMENT_DISPLAY_ITEMS) {
    if (!item.modelBuilder && !shield) continue;
    const model = item.modelBuilder ? nativeWeapon(item, hub) : shield;
    model.position.set(...item.position); model.quaternion.identity(); model.scale.set(1, 1, 1);
    if (item.orientation === 'vertical') model.quaternion.setFromRotationMatrix(vertical);
    else if (item.orientation === 'front') model.rotation.y = -Math.PI / 2;
    model.name = `ship-equipment:${item.itemId}`;
    const reference = modelFor(item.itemId);
    const metadata = {
      id: `equipment:${item.itemId}`, itemId: item.itemId, variantId: item.variantId ?? null, label: item.label, source: item.source,
      sources: [...(reference?.sources ?? ['prey2022'])], sourceTier: reference?.sourceTier ?? 'SCREEN',
      modelStatus: item.modelBuilder ? 'runtime_weapon_geometry' : 'existing_equipment_display_geometry',
      modelSourceTier: 'ORIGINAL', fidelityVerified: false,
      unitScale: item.modelBuilder ? 'same_as_playable_equipment' : 'authored_ship_display_units', inspectionType: 'equipment',
      zone: 'armory-forge', role: 'equipment-exhibit', inspectionRange: 7,
    };
    Object.assign(model.userData, metadata); rack.add(model);
    hub.registerProp?.(model, 'armory-forge', 'equipment-exhibit', metadata);
    registry.entries.push({ ...metadata, object: model });
    for (const dy of [-0.3, 0.3]) {
      transform.position.set(-0.48, item.position[1] + dy, item.position[2]);
      transform.rotation.set(0, 0, Math.PI / 2); transform.scale.set(1, 1, 1); transform.updateMatrix();
      const peg = new THREE.CylinderGeometry(0.065, 0.065, 0.72, 8);
      supports.push(bakedGeometry(peg, transform.matrix)); peg.dispose();
    }
    const text = labelGeometry(item.engraving);
    text.rotateY(-Math.PI / 2); text.translate(-0.3, item.labelY, item.position[2]); engravings.push(text);
  }
  const pegMesh = new THREE.Mesh(mergedParts(supports), hub.createAlloyMaterial(0x8b9898));
  pegMesh.name = 'armory-equipment-retention-clamps'; rack.add(pegMesh);
  const lettering = new THREE.Mesh(mergedParts(engravings), new THREE.MeshBasicMaterial({ color: 0xc2e5da }));
  lettering.name = 'armory-equipment-identification-engraving'; rack.add(lettering);
  rack.userData.displayItemIds = registry.entries.filter(entry => entry.inspectionType === 'equipment').map(entry => entry.itemId);
  freeRetiredResources(retired, hub);
}

function attachTrophyStudies(hub, registry) {
  const labels = [];
  for (const [huntId, trophy] of hub.trophyDisplays ?? []) {
    const definition = HUNT_DEFINITIONS[huntId];
    if (!definition) continue;
    const oldGeometry = trophy.geometry, oldChildren = [...trophy.children];
    oldChildren.forEach(child => trophy.remove(child));
    const geometry = createShipTrophyGeometry(definition.bossType);
    trophy.geometry = geometry; trophy.material.vertexColors = true; trophy.material.needsUpdate = true;
    trophy.scale.set(1, 1, 1); trophy.userData.baseDisplayScale = [1, 1, 1];
    const metadata = {
      id: `trophy:${huntId}`, itemId: huntId, huntId, sourceBossType: definition.bossType, label: definition.bossType === 'kalisk' ? 'Étude de la carapace du Kalisk' : `Étude crânienne — ${definition.name}`,
      source: definition.continuity, sources: [...(definition.sources ?? [])], sourceTier: definition.sourceTier,
      referenceTier: definition.basisTier ?? definition.sourceTier, modelSourceTier: 'ORIGINAL',
      modelStatus: geometry.userData.modelStatus, artifactStatus: geometry.userData.artifactStatus,
      displayScale: 'normalized_study', fidelityVerified: false, inspectionType: 'trophy',
      role: 'hunt-trophy', zone: 'trophy-vault', inspectionRange: 8,
    };
    Object.assign(trophy.userData, metadata);
    registry.entries.push({ ...metadata, object: trophy, get unlocked() { return trophy.userData.unlocked === true; } });
    oldGeometry.dispose(); freeRetiredResources(oldChildren, hub);
    const text = labelGeometry(`${String(registry.entries.filter(entry => entry.inspectionType === 'trophy').length).padStart(2, '0')}  ${huntId.replaceAll('_', ' ').toUpperCase()}`, 0.18, 2.55);
    // Vault displays remain in their parent's local frame, including a later
    // room relocation. Labels are one merged draw for the entire archive.
    const point = trophy.position.clone(); point.y -= 1.8; point.z += 0.28;
    text.translate(point.x, point.y, point.z); labels.push(text);
    const projection = hub.group.getObjectByName(`hologram-${huntId}`);
    if (projection) {
      projection.geometry.dispose(); projection.geometry = geometry;
      projection.material.wireframe = false; projection.material.transparent = true;
      projection.material.opacity = 0.6; projection.material.depthWrite = false;
      projection.material.vertexColors = true; projection.material.needsUpdate = true;
      const projectionMetadata = { ...metadata, id: `contract_projection:${huntId}`, inspectionType: 'contract_projection', role: 'contract-projection', zone: 'mission-nexus' };
      projection.userData = { ...projection.userData, ...projectionMetadata };
      registry.entries.push({ ...projectionMetadata, object: projection });
    }
  }
  const vault = hub.landmarks?.get('trophy-vault');
  if (labels.length && vault) {
    const engraving = new THREE.Mesh(mergedParts(labels), new THREE.MeshBasicMaterial({ color: 0xc1d5cc }));
    engraving.name = 'trophy-study-identification-engraving'; vault.add(engraving);
  }
}

/** All returned objects belong to hub.group and use its normal resource owner. */
export function attachShipEquipmentDisplays(hub) {
  if (!hub?.group?.isObject3D || hub.disposed) throw new TypeError('Ship equipment displays require a live constructed hub.');
  if (hub.shipEquipmentDisplays) return hub.shipEquipmentDisplays;
  const registry = { root: hub.group, entries: [], clear() { this.entries.length = 0; } };
  attachArmory(hub, registry); attachTrophyStudies(hub, registry);
  hub.shipEquipmentDisplays = registry;
  return registry;
}
