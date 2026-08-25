import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const TEXTURE_FILE = 'public/assets/textures/los-angeles-heatwave-urban.webp';

function readWebpDimensions(buffer) {
  assert.equal(buffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(buffer.subarray(8, 12).toString('ascii'), 'WEBP');
  const chunk = buffer.subarray(12, 16).toString('ascii');

  if (chunk === 'VP8X') {
    return {
      width: buffer.readUIntLE(24, 3) + 1,
      height: buffer.readUIntLE(27, 3) + 1,
    };
  }
  if (chunk === 'VP8 ') {
    assert.deepEqual([...buffer.subarray(23, 26)], [0x9d, 0x01, 0x2a]);
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === 'VP8L') {
    assert.equal(buffer[20], 0x2f);
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >>> 14) & 0x3fff) + 1,
    };
  }
  throw new Error(`Chunk WebP non pris en charge: ${chunk}`);
}

test('la matière urbaine OpenAI est un vrai WebP 1536 carré et non un fichier renommé', () => {
  const texture = readFileSync(TEXTURE_FILE);
  assert.equal(texture.length, 846_546);
  assert.deepEqual(readWebpDimensions(texture), { width: 1536, height: 1536 });
});
