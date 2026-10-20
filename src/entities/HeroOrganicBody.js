import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BODY_URL = '/assets/models/hero-organic-body.glb';
let bodyPromise;

/** Restore glTF joint names without reordering their skinIndex slots. */
export function resolveOrganicBodyBoneNames(bones, authored = {}, parser) {
  const names = authored.boneNames ?? Object.keys(authored.restPositions ?? {});
  const originalBySanitized = new Map(names.map((name) => [THREE.PropertyBinding.sanitizeNodeName(name), name]));
  return bones.map((bone) => {
    const association = parser?.associations?.get(bone);
    const source = parser?.json?.nodes?.[association?.nodes]?.name ?? bone.userData?.name;
    return source ?? originalBySanitized.get(bone.name) ?? bone.name;
  });
}

/** Browser-only, session-cached anatomical asset; no SSR/network work in Node. */
export function loadHeroOrganicBody() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !window.location?.origin) return Promise.resolve(null);
  if (!bodyPromise) {
    bodyPromise = new GLTFLoader().loadAsync(BODY_URL).then((gltf) => {
      let source;
      gltf.scene.traverse((object) => {
        if (!source && object.isSkinnedMesh) source = object;
      });
      if (!source) throw new Error('Organic hero GLB contains no skinned surface.');
      const geometry = source.geometry;
      for (const name of ['position', 'normal', 'uv', 'skinIndex', 'skinWeight']) {
        if (!geometry.getAttribute(name)) throw new Error(`Organic hero GLB is missing ${name}.`);
      }

      const triangles = (geometry.index?.count ?? geometry.getAttribute('position').count) / 3;
      if (triangles < 20000 || triangles > 70000) throw new Error(`Organic hero topology outside its 20–70k budget: ${triangles}.`);
      const metadata = source.userData.organicBodyMetrics;
      let authored = {};
      if (typeof metadata === 'string') authored = JSON.parse(metadata);
      else if (metadata && typeof metadata === 'object') authored = metadata;
      const boneNames = resolveOrganicBodyBoneNames(source.skeleton.bones, authored, gltf.parser);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      geometry.userData.authoredSurface = 'continuous_anatomical_voxel_sculpt';
      geometry.userData.organicBody = true;
      const material = Array.isArray(source.material) ? source.material[0] : source.material;
      material.roughness = 0.66;
      material.metalness = 0;
      if (material.aoMap) material.aoMapIntensity = 0.8;
      const metrics = {
        ...authored,
        triangles,
        vertices: geometry.getAttribute('position').count,
        boneCount: boneNames.length,
        assetUrl: BODY_URL,
        bounds: { min: geometry.boundingBox.min.toArray(), max: geometry.boundingBox.max.toArray() },
      };
      return { geometry, boneNames, material, metrics };
    }).catch((error) => {
      bodyPromise = undefined;
      throw error;
    });
  }
  return bodyPromise;
}

/**
 * Bind the baked mesh directly to the game's animated joint Groups.
 * The root's rest coordinates are Y-up/game units, facing +Z. Existing hand, head,
 * foot and equipment assemblies stay on their own joints. Call after creating
 * the final rig proportions; hide legacy body surfaces only after this resolves.
 */
export async function createOrganicBodyMesh(player, material) {
  const asset = await loadHeroOrganicBody();
  if (!asset) return null;
  const root = player?.mesh;
  if (!root?.isObject3D) throw new Error('Organic hero requires the completed player mesh.');
  root.updateMatrixWorld(true);
  const joints = asset.boneNames.map((name) => {
    const joint = root.getObjectByName(name);
    if (!joint) throw new Error(`Organic hero joint is missing: ${name}.`);
    return joint;
  });
  // The asset can finish loading during an idle animation. Bind from declared
  // rest positions, not the currently rotated elbow/hip matrices. Compensate
  // for authored joint scales (notably the separately resized head Group).
  const inverses = joints.map((joint) => {
    const restPosition = asset.metrics.restPositions?.[joint.name];
    if (!restPosition) return joint.matrixWorld.clone().invert();
    const scale = new THREE.Vector3(1, 1, 1);
    for (let ancestor = joint; ancestor && ancestor !== root; ancestor = ancestor.parent) scale.multiply(ancestor.scale);
    const rest = new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z);
    rest.setPosition(...restPosition);
    return rest.premultiply(root.matrixWorld).invert();
  });
  const skinMaterial = material ?? asset.material.clone();
  if (material) {
    // Keep the caller's shader hooks, palette and authored surface controls.
    skinMaterial.map ??= asset.material.map;
    skinMaterial.normalMap ??= asset.material.normalMap;
    skinMaterial.aoMap ??= asset.material.aoMap;
  }
  skinMaterial.userData.materialIdentity = 'baked_anatomical_organic_skin';
  const mesh = new THREE.SkinnedMesh(asset.geometry.clone(), skinMaterial);
  mesh.name = 'anatomy:organic_body';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  mesh.userData.appearanceChannel = 'skin';
  mesh.userData.detailRole = 'anatomy_continuous_organic_body';
  mesh.userData.baseMaterial = skinMaterial;
  mesh.userData.organicBodyMetrics = asset.metrics;
  const skeleton = new THREE.Skeleton(joints, inverses);
  root.add(mesh);
  root.updateMatrixWorld(true);
  mesh.bindMode = THREE.AttachedBindMode;
  mesh.bind(skeleton, mesh.matrixWorld);
  skeleton.update();
  return mesh;
}
