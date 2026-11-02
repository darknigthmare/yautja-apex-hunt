import * as THREE from 'three';

/** One bevel segment gives a real highlight edge without subdividing flat faces. */
export function createHubPanelGeometry(width, height, depth, radius = 0.08) {
  const half = [width / 2, height / 2, depth / 2];
  const bevel = Math.max(0.00001, Math.min(radius, Math.min(...half) * 0.95));
  const inner = half.map(value => value - bevel), positions = [], normals = [], uvs = [], indices = [];
  const add = points => {
    let vectors = points.map(point => new THREE.Vector3(...point));
    const normal = vectors[1].clone().sub(vectors[0]).cross(vectors[2].clone().sub(vectors[0])).normalize();
    const center = vectors.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / points.length);
    if (normal.dot(center) < 0) { vectors.reverse(); normal.negate(); }
    const start = positions.length / 3;
    vectors.forEach((point, index) => {
      positions.push(point.x, point.y, point.z); normals.push(normal.x, normal.y, normal.z);
      uvs.push(index === 1 || index === 2 ? 1 : 0, index >= 2 ? 1 : 0);
    });
    for (let index = 1; index < vectors.length - 1; index++) indices.push(start, start + index, start + index + 1);
  };
  for (let axis = 0; axis < 3; axis++) for (const sign of [-1, 1]) {
    const others = [0, 1, 2].filter(value => value !== axis);
    add([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => {
      const point = [0, 0, 0]; point[axis] = sign * half[axis];
      point[others[0]] = a * inner[others[0]]; point[others[1]] = b * inner[others[1]]; return point;
    }));
    for (const a of [-1, 1]) for (const b of [-1, 1]) {
      // Each long edge is emitted once, independently of the face triangulation.
      if (sign !== 1) continue;
      const first = others[0], second = others[1];
      add([[-1, 0], [1, 0], [1, 1], [-1, 1]].map(([along, variant]) => {
        const point = [0, 0, 0]; point[axis] = along * inner[axis];
        point[first] = a * (variant ? inner[first] : half[first]);
        point[second] = b * (variant ? half[second] : inner[second]); return point;
      }));
    }
  }
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    add([[x * half[0], y * inner[1], z * inner[2]], [x * inner[0], y * half[1], z * inner[2]],
      [x * inner[0], y * inner[1], z * half[2]]]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.type = 'HubPanelGeometry'; geometry.parameters = { width, height, depth, radius: bevel };
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices);
  return geometry;
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

const TERMINAL_FONT = {
  A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',
  D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',
  G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'111/010/010/010/010/010/111',
  J:'00111/00010/00010/00010/10010/10010/01100',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',
  M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',
  P:'11110/10001/10001/11110/10000/10000/10000',Q:'01110/10001/10001/10001/10101/10010/01101',R:'11110/10001/10001/11110/10100/10010/10001',
  S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',
  V:'10001/10001/10001/10001/10001/01010/00100',W:'10001/10001/10001/10101/10101/10101/01010',X:'10001/10001/01010/00100/01010/10001/10001',
  Y:'10001/10001/01010/00100/00100/00100/00100',Z:'11111/00001/00010/00100/01000/10000/11111',
  0:'01110/10001/10011/10101/11001/10001/01110',1:'010/110/010/010/010/010/111',2:'01110/10001/00001/00010/00100/01000/11111',
  3:'11110/00001/00001/01110/00001/00001/11110',4:'00010/00110/01010/10010/11111/00010/00010',5:'11111/10000/10000/11110/00001/00001/11110',
  6:'01110/10000/10000/11110/10001/10001/01110',7:'11111/00001/00010/00100/01000/01000/01000',8:'01110/10001/10001/01110/10001/10001/01110',
  9:'01110/10001/10001/01111/00001/00001/01110','-':'000/000/000/111/000/000/000',':':'0/1/0/0/1/0/0','/':'00001/00010/00010/00100/01000/01000/10000',
};

/** One reusable atlas for real ship terminals; no per-frame canvas allocation. */
export function createShipTerminalAtlas(zones) {
  const size = 1024, atlasHeight = 512, cell = 256, cellHeight = 128, data = new Uint8Array(size * atlasHeight * 4);
  let canvas, context;
  if (typeof document !== 'undefined') {
    try { canvas = document.createElement('canvas'); canvas.width = size; canvas.height = atlasHeight; context = canvas.getContext('2d'); }
    catch { context = null; }
  }
  const texture = context ? new THREE.CanvasTexture(canvas) : new THREE.DataTexture(data, size, atlasHeight, THREE.RGBAFormat);
  texture.name = 'ship-live-terminal-atlas'; texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter; texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true; texture.flipY = true; texture.userData.liveTerminal = true;
  let previousKey = '', state = {}, disposed = false;
  const rect = (x, y, width, height, color) => {
    if (context) { context.fillStyle = color; context.fillRect(x, y, width, height); return; }
    const rgb = [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16));
    for (let row = Math.max(0, y); row < Math.min(atlasHeight, y + height); row++) for (let column = Math.max(0, x); column < Math.min(size, x + width); column++) {
      const offset = (row * size + column) * 4; data[offset] = rgb[0]; data[offset + 1] = rgb[1]; data[offset + 2] = rgb[2]; data[offset + 3] = 255;
    }
  };
  const text = (label, x, y, color = '#cbded8', fontSize = 15) => {
    const safe = String(label).toLocaleUpperCase('fr').slice(0, 27);
    if (context) { context.fillStyle = color; context.font = `${fontSize}px monospace`; context.textBaseline = 'top'; context.fillText(safe, x, y, 232); return; }
    let pen = x;
    for (const letter of safe.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
      const glyph = TERMINAL_FONT[letter]?.split('/') ?? ['00000'];
      glyph.forEach((row, v) => [...row].forEach((value, u) => { if (value === '1') rect(pen + u * 2, y + v * 2, 2, 2, color); }));
      pen += (glyph[0].length + 1) * 2;
      if (pen > x + 230) break;
    }
  };
  const finite = value => Number.isFinite(Number(value)) && value != null ? String(Math.round(Number(value))) : '-';
  const update = (next = {}) => {
    if (disposed) return false;
    state = { ...state, ...next };
    const normalized = {
      stationId: String(state.stationId ?? ''), zoneId: String(state.zoneId ?? ''), stationTitle: String(state.stationTitle ?? ''),
      honorScore: finite(state.honorScore), health: finite(state.health), maxHealth: finite(state.maxHealth), energy: finite(state.energy),
      loadoutItems: (Array.isArray(state.loadoutItems) ? state.loadoutItems : []).map(item => String(item)).slice(0, 8),
      targetLabel: String(state.targetLabel || 'Aucune proie engagee'), routeLabel: String(state.routeLabel || 'Aucun guidage actif'),
    };
    const key = JSON.stringify(normalized); if (key === previousKey) return false; previousKey = key;
    rect(0, 0, size, atlasHeight, '#040c10');
    zones.slice(0, 16).forEach((zone, index) => {
      const x = index % 4 * cell, y = Math.floor(index / 4) * cellHeight;
      const active = normalized.zoneId === zone.id || normalized.stationId === zone.id;
      const accent = active ? '#e5b26b' : '#66b8b4';
      rect(x + 4, y + 4, 248, 120, '#0a171c'); rect(x + 8, y + 8, 3, 112, accent);
      for (let line = 10; line < 124; line += 4) rect(x + 14, y + line, 232, 1, '#0d2025');
      text(zone.label, x + 18, y + 10, accent, 15);
      text(active ? normalized.stationTitle || 'Console liee au bio-masque' : 'Terminal du croiseur', x + 18, y + 29, '#92b4b8', 10);
      text(`HON ${normalized.honorScore} PV ${normalized.health}/${normalized.maxHealth} E ${normalized.energy}`, x + 18, y + 45, '#e0d7b8', 12);
      text(normalized.loadoutItems[0] ?? 'Aucun element selectionne', x + 18, y + 65, '#b8d2ce', 12);
      text(normalized.loadoutItems.slice(1).join(' / ') || '-', x + 18, y + 81, '#8caead', 10);
      text(normalized.targetLabel, x + 18, y + 98, '#d3bc91', 11);
      text(normalized.routeLabel, x + 18, y + 114, accent, 9);
    });
    texture.userData.context = normalized; texture.userData.revision = (texture.userData.revision ?? 0) + 1;
    texture.needsUpdate = true; return true;
  };
  update();
  return { texture, zones, update, getContext: () => texture.userData.context,
    dispose() { if (!disposed) { disposed = true; texture.dispose(); } } };
}
