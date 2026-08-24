import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('le vaisseau-mère expose et déverrouille les huit trophées de chasse', () => {
  const hub = new MothershipHub(new THREE.Scene());
  assert.equal(hub.trophyDisplays.size, 8);
  assert.ok(hub.trophyDisplays.has('feral_predator'));
  assert.ok(hub.trophyDisplays.has('wolf_cleaner'));
  assert.ok(hub.trophyDisplays.has('kalisk'));
  assert.equal(hub.animatedProps.filter(({ huntId }) => huntId && huntId !== 'forge').length, 8);

  hub.setTrophyState(['feral_predator']);
  const feral = hub.trophyDisplays.get('feral_predator');
  const goliath = hub.trophyDisplays.get('goliath');
  assert.equal(feral.material.opacity, 1);
  assert.equal(feral.material.wireframe, false);
  assert.equal(goliath.material.opacity, 0.28);
  assert.equal(goliath.material.wireframe, true);
  for (const [huntId, trophy] of hub.trophyDisplays) {
    assert.ok(Math.abs(trophy.position.x) <= 28, `${huntId}: le trophée sort du mur du vaisseau`);
  }
});
