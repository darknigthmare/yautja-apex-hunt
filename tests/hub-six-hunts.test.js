import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('le vaisseau-mère expose et déverrouille tous les trophées de chasse', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const huntCount = Object.keys(HUNT_DEFINITIONS).length;
  assert.equal(hub.trophyDisplays.size, huntCount);
  assert.ok(hub.trophyDisplays.has('feral_predator'));
  assert.ok(hub.trophyDisplays.has('wolf_cleaner'));
  assert.ok(hub.trophyDisplays.has('kalisk'));
  assert.equal(hub.animatedProps.filter(({ huntId }) => huntId && huntId !== 'forge').length, huntCount);

  hub.setTrophyState(['feral_predator']);
  const feral = hub.trophyDisplays.get('feral_predator');
  const goliath = hub.trophyDisplays.get('goliath');
  assert.equal(feral.material.opacity, 1);
  assert.equal(feral.material.wireframe, false);
  assert.equal(goliath.material.opacity, 0.28);
  assert.equal(goliath.material.wireframe, true);
  const gallery = hub.getZones().find(zone => zone.id === 'trophy-vault');
  for (const [huntId, trophy] of hub.trophyDisplays) {
    assert.ok(trophy.position.x > gallery.bounds.minX + 1.35 && trophy.position.x < gallery.bounds.maxX - 1.35,
      `${huntId}: le trophée sort du mur du vaisseau`);
  }
  hub.dispose();
});
