import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_TEXTURES,
  HuntNPC,
} from '../src/entities/HuntNPC.js';

const AMBIENT_TYPES = ['xeno_runner', 'clan_sentry_drone', 'genna_grazer'];

test('les trois archétypes ambiants possèdent des silhouettes et textures runtime distinctes', () => {
  assert.equal(HUNT_NPC_TEXTURES.xeno_runner, '/assets/textures/xeno-carapace.webp');
  assert.equal(HUNT_NPC_TEXTURES.clan_sentry_drone, '/assets/textures/yautja-energy-lattice.webp');
  assert.equal(HUNT_NPC_TEXTURES.genna_grazer, '/assets/textures/deathworld-alien-flora.webp');

  const silhouettes = new Set();
  const partCounts = new Set();
  for (const type of AMBIENT_TYPES) {
    assert.ok(AVAILABLE_HUNT_NPC_ARCHETYPES[type], `${type}: archétype absent`);
    const npc = new HuntNPC(type, { id: `ambient-shape-${type}` });
    silhouettes.add(npc.mesh.userData.silhouette);
    partCounts.add(npc.mesh.children.length);
    assert.equal(npc.mesh.userData.silhouette, type);
    npc.dispose();
  }

  assert.equal(silhouettes.size, AMBIENT_TYPES.length);
  assert.equal(partCounts.size, AMBIENT_TYPES.length, 'les trois silhouettes doivent avoir des constructions différentes');
});

test('une créature ambiante patrouille, s’alerte, poursuit puis respecte sa laisse', () => {
  const npc = new HuntNPC('xeno_runner', {
    id: 'runner-territory-test',
    ambient: true,
    position: [0, 0, 0],
    territoryCenter: [0, 0, 0],
    patrolRadius: 6,
    aggressionRange: 9,
    leashRadius: 12,
  });
  const player = { position: new THREE.Vector3(40, 0, 0) };

  const patrolStart = npc.position.clone();
  const patrolSignals = npc.update(1, { player });
  assert.equal(npc.ambientState, 'patrol');
  assert.ok(npc.position.distanceTo(patrolStart) > 0, 'la patrouille locale doit avancer sans joueur proche');
  assert.ok(npc.position.distanceTo(npc.territoryCenter) <= npc.patrolRadius);
  assert.equal(patrolSignals.some(({ type }) => type === 'attack_player'), false);

  player.position.copy(npc.position).add(new THREE.Vector3(7, 0, 0));
  const chaseDistanceBefore = npc.position.distanceTo(player.position);
  const alertSignals = npc.update(0.35, { player });
  assert.equal(npc.ambientState, 'chase');
  assert.equal(npc.mesh.userData.ambientAlerted, true);
  assert.ok(alertSignals.some(({ type, message }) => type === 'log' && /territoire/i.test(message)));
  assert.ok(npc.position.distanceTo(player.position) < chaseDistanceBefore, 'la créature alertée doit poursuivre le joueur');

  npc.position.set(15, 0, 0);
  player.position.set(15, 0, 1);
  const returnDistanceBefore = npc.position.distanceTo(npc.territoryCenter);
  const returnSignals = npc.update(0.5, { player });
  assert.equal(npc.ambientState, 'return');
  assert.equal(returnSignals.some(({ type }) => type === 'attack_player'), false);
  assert.ok(npc.position.distanceTo(npc.territoryCenter) < returnDistanceBefore, 'la laisse doit ramener la créature au territoire');
  npc.dispose();
});

test('la sentinelle ambiante attaque dans sa zone et la mimique reste prioritaire', () => {
  const sentry = new HuntNPC('clan_sentry_drone', {
    id: 'sentry-alert-test',
    ambient: true,
    position: [0, 0, 0],
    territoryCenter: [0, 0, 0],
    patrolRadius: 8,
    aggressionRange: 20,
    leashRadius: 28,
  });
  const player = { position: new THREE.Vector3(10, 0, 0) };
  const signals = sentry.update(0.1, { player });
  const attack = signals.find(({ type }) => type === 'attack_player');
  assert.equal(sentry.ambientState, 'chase');
  assert.equal(attack?.attackKind, 'projectile');
  assert.equal(attack?.projectile?.speed, 30);
  sentry.dispose();

  const grazer = new HuntNPC('genna_grazer', {
    id: 'grazer-lure-test',
    ambient: true,
    position: [0, 0, 0],
    territoryCenter: [0, 0, 0],
    patrolRadius: 5,
    aggressionRange: 6,
    leashRadius: 10,
  });
  const lure = new THREE.Vector3(8, 0, 0);
  assert.equal(grazer.hearMimicry(lure, 1), true);
  assert.equal(grazer.ambientState, 'investigate');
  grazer.update(0.5, { player: { position: new THREE.Vector3(40, 0, 0) } });
  assert.ok(grazer.position.x > 0, 'la mimique doit rester prioritaire sur la patrouille ambiante');
  assert.equal(grazer.mesh.userData.investigatingLure, true);
  grazer.dispose();
});

test('sans option ambient, la poursuite historique reste inchangée', () => {
  const npc = new HuntNPC('xeno_drone', { id: 'legacy-hostile-test', position: [0, 0, 0] });
  const player = { position: new THREE.Vector3(20, 0, 0) };
  const distanceBefore = npc.position.distanceTo(player.position);

  npc.update(0.5, { player });

  assert.equal(npc.ambient, false);
  assert.equal(npc.ambientState, 'hostile');
  assert.ok(npc.position.distanceTo(player.position) < distanceBefore);
  npc.dispose();
});
