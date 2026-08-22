export function captureBaseMaterials(root) {
  root?.traverse((object) => {
    if (object.isMesh && !object.userData.baseMaterial) {
      object.userData.baseMaterial = object.material;
    }
  });
}

export function overrideMaterials(root, material, predicate = () => true) {
  root?.traverse((object) => {
    if (!object.isMesh || !predicate(object)) return;
    if (!object.userData.baseMaterial) object.userData.baseMaterial = object.material;
    object.material = material;
  });
}

export function restoreBaseMaterials(root) {
  root?.traverse((object) => {
    if (object.isMesh && object.userData.baseMaterial) {
      object.material = object.userData.baseMaterial;
    }
  });
}

export function disposeObject3D(root, { disposeBaseMaterials = true } = {}) {
  if (!root || root.userData?.disposeComplete) return false;

  const disposedGeometries = new Set();
  const disposedMaterials = new Set();
  root?.traverse((object) => {
    if (object.geometry?.dispose && !disposedGeometries.has(object.geometry)) {
      disposedGeometries.add(object.geometry);
      object.geometry.dispose();
    }
    if (!object.material) return;

    const materials = [
      ...(Array.isArray(object.material) ? object.material : [object.material]),
      ...(disposeBaseMaterials && object.userData.baseMaterial
        ? (Array.isArray(object.userData.baseMaterial) ? object.userData.baseMaterial : [object.userData.baseMaterial])
        : []),
    ];

    materials.filter(Boolean).forEach((material) => {
      if (disposedMaterials.has(material)) return;
      disposedMaterials.add(material);
      material.dispose?.();
    });
  });

  // Textures are deliberately preserved because loaders and scene objects can share them.
  root.parent?.remove(root);
  root.userData.disposeComplete = true;
  return true;
}
