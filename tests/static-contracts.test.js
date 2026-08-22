import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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
  for (const file of ['public/favicon.svg', 'public/robots.txt', 'public/sitemap.xml']) {
    assert.ok(existsSync(join(ROOT, file)), `Missing public metadata: ${file}`);
  }
});
