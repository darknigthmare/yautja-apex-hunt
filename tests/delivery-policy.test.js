import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const { headers } = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

// These routes deliberately use only regular-expression sources. Apply matching
// headers in order, as Vercel does when several header routes match one asset.
function responseHeaders(pathname) {
  const result = new Map();
  for (const route of headers) {
    if (!new RegExp(`^${route.source}$`).test(pathname)) continue;
    for (const { key, value } of route.headers) result.set(key.toLowerCase(), value);
  }
  return result;
}

test('texture replacements are revalidated on a new deployment', () => {
  for (const name of ['gunnison-rain-urban.webp', 'yautja-alloy.webp']) {
    const policy = responseHeaders(`/assets/textures/${name}`).get('cache-control');
    assert.match(policy, /max-age=0/);
    assert.match(policy, /must-revalidate/);
    assert.doesNotMatch(policy, /immutable|stale-while-revalidate/);
  }
});

test('only content-hashed bundles and local fonts receive immutable caching', () => {
  for (const name of [
    'index-DC3LAalj.js',
    'three-DKid6_SR.js',
    'index-Dn1jXRWO.css',
    'orbitron-latin-700-normal-4jsRXGGJ.woff2',
    'rajdhani-latin-600-normal-Dx02qI2_.woff',
  ]) {
    assert.match(responseHeaders(`/assets/${name}`).get('cache-control'), /max-age=31536000, immutable/);
  }
  for (const pathname of ['/', '/index.html', '/assets/runtime.js', '/assets/brand.css', '/assets/brand.woff2']) {
    assert.doesNotMatch(responseHeaders(pathname).get('cache-control') ?? '', /immutable/);
  }
});
