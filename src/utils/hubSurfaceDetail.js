import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** One bevel segment gives a real highlight edge without subdividing flat faces. */
export function createHubPanelGeometry(width, height, depth, radius = 0.08) {
  return new RoundedBoxGeometry(width, height, depth, 1, radius);
}

/** A compact, deterministic instrument display shared by every ship console.
 * Built as data so the same geometry/material contracts work without a DOM. */
export function createHubInstrumentTexture() {
  const width = 256;
  const height = 128;
  const data = new Uint8Array(width * height * 4);
  const pixel = (x, y, value) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const offset = (Math.floor(y) * width + Math.floor(x)) * 4;
    data[offset] = data[offset + 1] = data[offset + 2] = value;
    data[offset + 3] = 255;
  };
  const rect = (x, y, w, h, value) => {
    for (let v = y; v < y + h; v += 1) for (let u = x; u < x + w; u += 1) pixel(u, v, value);
  };
  const line = (x0, y0, x1, y1, value) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i += 1) pixel(Math.round(THREE.MathUtils.lerp(x0, x1, i / Math.max(1, steps))), Math.round(THREE.MathUtils.lerp(y0, y1, i / Math.max(1, steps))), value);
  };
  rect(0, 0, width, height, 8);
  for (let y = 4; y < height; y += 4) rect(0, y, width, 1, 15);
  rect(4, 4, 248, 2, 155);
  rect(4, 122, 248, 2, 120);
  rect(4, 4, 2, 120, 120);
  rect(250, 4, 2, 120, 120);
  line(136, 12, 136, 115, 100);
  for (const radius of [17, 32, 47]) {
    for (let step = 0; step < 192; step += 1) {
      const angle = step * Math.PI * 2 / 192;
      pixel(Math.round(70 + Math.cos(angle) * radius), Math.round(64 + Math.sin(angle) * radius), 115);
    }
  }
  line(17, 64, 123, 64, 55);
  line(70, 12, 70, 115, 55);
  line(70, 64, 111, 35, 235);
  for (const [x, y] of [[44, 43], [98, 87], [80, 35]]) {
    rect(x - 2, y - 2, 5, 5, 230);
    rect(x - 4, y - 4, 1, 9, 150);
  }
  for (let row = 0; row < 6; row += 1) {
    const y = 18 + row * 15;
    rect(145, y, 12, 7, 60);
    line(148, y + 2, 154, y + 4, 225);
    rect(166, y, 74, 3, 40);
    rect(166, y, 24 + ((row * 19) % 50), 3, 150 + (row % 2) * 70);
    rect(166, y + 6, 47 - (row % 3) * 8, 1, 85);
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.name = 'hub-navigation-instrument-display';
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
