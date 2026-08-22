import * as THREE from 'three';

const textureCache = new Map();

export function getRuntimeTexture(path, { repeat = [1, 1], colorSpace = THREE.SRGBColorSpace } = {}) {
  if (typeof document === 'undefined') return null;
  const cacheKey = `${path}|${repeat[0]}x${repeat[1]}|${colorSpace}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const texture = new THREE.TextureLoader().load(
    path,
    undefined,
    undefined,
    () => console.warn(`Texture runtime indisponible : ${path}`),
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.colorSpace = colorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

export const getRuntimeTextureCacheSize = () => textureCache.size;
