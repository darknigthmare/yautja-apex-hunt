import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { HUDManager } from '../src/HUDManager.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

test('HTML ids are unique and tab controls target existing panels', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  assert.deepEqual([...new Set(duplicates)], []);
  for (const [, target] of html.matchAll(/\baria-controls="([^"]+)"/g)) {
    assert.ok(ids.includes(target), `Missing aria-controls target: ${target}`);
  }
  assert.match(html, /id="setting-hud-scale"[^>]+min="0\.85"[^>]+max="1\.25"/);
});

test('all runtime texture references resolve to optimized WebP files', () => {
  const sourceFiles = walk(join(ROOT, 'src')).filter((file) => extname(file) === '.js');
  const references = sourceFiles.flatMap((file) => [
    ...readFileSync(file, 'utf8').matchAll(/['"](\/assets\/textures\/[^'"]+)['"]/g),
  ]).map((match) => match[1]);

  assert.ok(references.length >= 6, 'Expected environment and prop texture references');
  for (const reference of new Set(references)) {
    assert.equal(extname(reference), '.webp', `Runtime texture must be WebP: ${reference}`);
    assert.ok(existsSync(join(ROOT, 'public', reference)), `Missing public asset: ${reference}`);
  }

  const publicPngs = walk(join(ROOT, 'public')).filter((file) => extname(file).toLowerCase() === '.png');
  assert.deepEqual(publicPngs, []);
});

test('public metadata and Vercel configuration are valid', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  const vercel = JSON.parse(read('vercel.json'));

  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(Array.isArray(vercel.headers));
  const globalHeaders = vercel.headers.find(({ source }) => source === '/(.*)')?.headers ?? [];
  const csp = globalHeaders.find(({ key }) => key === 'Content-Security-Policy')?.value;

  assert.ok(csp, 'Missing Content-Security-Policy');
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /unpkg\.com/);
  for (const file of ['public/favicon.svg', 'public/robots.txt', 'public/sitemap.xml']) {
    assert.ok(existsSync(join(ROOT, file)), `Missing public metadata: ${file}`);
  }
});

test('HUD updates stay cached, compositor-safe and accessible', () => {
  const hud = read('src/HUDManager.js');
  const professionalCss = read('src/professional.css');

  assert.match(hud, /renderCache = new WeakMap\(\)/);
  assert.match(hud, /'role', 'progressbar'/);
  assert.match(hud, /'aria-valuenow'/);
  assert.match(hud, /'aria-pressed'/);
  assert.match(hud, /translate3d\(/);
  assert.doesNotMatch(hud, /\.style\.left\s*=/);
  assert.doesNotMatch(hud, /\.style\.top\s*=/);

  assert.match(professionalCss, /zoom:\s*min\(var\(--hud-scale\),\s*1\)/);
  assert.match(professionalCss, /@media \(forced-colors: active\)/);
  assert.match(professionalCss, /@media \(prefers-contrast: more\)/);
  assert.match(professionalCss, /button,\s*select\s*\{\s*min-height:\s*44px/);
});

test('HUD meter cache clamps values and suppresses steady-state mutations', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.renderCache = new WeakMap();

  const mutations = { attributes: 0, style: 0, text: 0 };
  const attributes = {};
  const meter = {
    setAttribute(name, value) {
      mutations.attributes += 1;
      attributes[name] = value;
    },
  };
  const fill = { style: {} };
  let width = '';
  Object.defineProperty(fill.style, 'width', {
    get: () => width,
    set(value) {
      mutations.style += 1;
      width = value;
    },
  });
  const output = {};
  let outputText = '';
  Object.defineProperty(output, 'textContent', {
    get: () => outputText,
    set(value) {
      mutations.text += 1;
      outputText = value;
    },
  });

  hud.updateMeter(fill, output, meter, 150, 100);
  const afterFirstRender = { ...mutations };
  hud.updateMeter(fill, output, meter, 150, 100);

  assert.equal(width, '100%');
  assert.equal(outputText, '100 / 100');
  assert.equal(attributes['aria-valuenow'], '100');
  assert.deepEqual(mutations, afterFirstRender);
});

test('HUD target lock stays inside a narrow mobile viewport', () => {
  const previousWidth = globalThis.innerWidth;
  const previousHeight = globalThis.innerHeight;
  globalThis.innerWidth = 390;
  globalThis.innerHeight = 844;

  try {
    const hud = Object.create(HUDManager.prototype);
    hud.triLaser = { style: {} };
    hud.lockonBracket = { style: {} };
    hud.lockonDistance = {};
    hud.weakpointTag = {};
    hud.setClassState = () => {};
    hud.setStyle = (element, property, value) => {
      element.style[property] = value;
    };
    hud.setText = (element, value) => {
      element.textContent = value;
    };

    hud.updateTriLaserPosition({ x: 720, y: -200 }, 42.25, true);

    assert.match(hud.triLaser.style.transform, /translate3d\(294px, 96px, 0\)/);
    assert.equal(hud.lockonBracket.style.transform, hud.triLaser.style.transform);
    assert.equal(hud.lockonDistance.textContent, '42.3m - SIGNAL THERMIQUE');
  } finally {
    if (previousWidth === undefined) delete globalThis.innerWidth;
    else globalThis.innerWidth = previousWidth;
    if (previousHeight === undefined) delete globalThis.innerHeight;
    else globalThis.innerHeight = previousHeight;
  }
});

test('portrait mobile HUD keeps vital panels and touch controls in dedicated bands', () => {
  const professionalCss = read('src/professional.css');
  const contentCss = read('src/content-pass.css');

  assert.match(professionalCss, /@media \(max-width: 430px\)/);
  assert.match(professionalCss, /#weapon-selector\s*\{[\s\S]*?flex-wrap:\s*nowrap;[\s\S]*?overflow-x:\s*auto;/);
  assert.match(professionalCss, /#weakpoint-tag\s*\{\s*display:\s*none;/);
  assert.match(professionalCss, /:has\(\.touch-hub-controls:not\(\.hidden\)\) #gadget-rack/);
  assert.match(contentCss, /#gadget-rack\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\);[\s\S]*?position:\s*fixed;/);
  assert.match(contentCss, /\.gadget-status\s*\{[\s\S]*?min-height:\s*44px;/);
});
