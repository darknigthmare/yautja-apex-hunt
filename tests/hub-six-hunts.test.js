import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('le vaisseau-mère expose et déverrouille les six trophées de chasse', () => {
  const hub = new MothershipHub(new THREE.Scene());
  assert.equal(hub.trophyDisplays.size, 6);
  assert.ok(hub.trophyDisplays.has('feral_predator'));
  assert.equal(hub.animatedProps.filter(({ huntId }) => huntId && huntId !== 'forge').length, 6);

  hub.setTrophyState(['feral_predator']);
  const feral = hub.trophyDisplays.get('feral_predator');
  const goliath = hub.trophyDisplays.get('goliath');
  assert.equal(feral.material.opacity, 1);
  assert.equal(feral.material.wireframe, false);
  assert.equal(goliath.material.opacity, 0.28);
  assert.equal(goliath.material.wireframe, true);
  assert.ok(Math.abs(feral.position.x) < 31, 'le sixième trophée reste dans le mur du vaisseau');
});
