import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  ALL_HUNT_NPC_ARCHETYPES,
  EXPANDED_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_ARCHETYPES,
  HUNT_NPC_TEXTURES,
  HuntNPC,
} from '../src/entities/HuntNPC.js';

const EXPANDED_TYPES = [
  'grizzly_territorial',
  'thermal_trapper',
  'genna_stalker',
  'xeno_warrior',
];

function makePlayer(position = [0, 0, 0]) {
  return { position: new THREE.Vector3(...position) };
}

function findAttack(signals) {
  return signals.find((signal) => signal.type === 'attack_player');
}

test('the expanded roster preserves the legacy registry and exposes four playable archetypes', () => {
  assert.deepEqual(Object.keys(EXPANDED_HUNT_NPC_ARCHETYPES), EXPANDED_TYPES);
  assert.equal(Object.keys(HUNT_NPC_ARCHETYPES).length, 4, 'le contrat historique reste stable');
  assert.equal(Object.keys(ALL_HUNT_NPC_ARCHETYPES).length, 8);

  const silhouettes = new Set();
  const combatReads = new Set();
  for (const type of EXPANDED_TYPES) {
    const npc = new HuntNPC(type);
    assert.equal(npc.type, type);
    assert.ok(npc.mesh.isGroup);
    assert.ok(npc.mesh.children.length >= 8, `${type} doit posséder une silhouette détaillée`);
    assert.equal(npc.mesh.userData.silhouette, type);
    assert.equal(npc.mesh.userData.npcType, type);
    assert.equal(npc.mesh.userData.colliderRadius, npc.colliderRadius);
    silhouettes.add(npc.mesh.userData.silhouette);
    combatReads.add(npc.mesh.userData.combatRead);
    npc.dispose();
  }

  assert.equal(silhouettes.size, 4);
  assert.equal(combatReads.size, 4);
});

test('human, synthetic and thermal trapper share the tactical composite while Genna uses alien flora', () => {
  const tactical = '/assets/textures/stargazer-tactical-composite.webp';
  assert.equal(HUNT_NPC_TEXTURES.human_fireteam, tactical);
  assert.equal(HUNT_NPC_TEXTURES.combat_synthetic, tactical);
  assert.equal(HUNT_NPC_TEXTURES.thermal_trapper, tactical);
  assert.equal(HUNT_NPC_TEXTURES.genna_stalker, '/assets/textures/deathworld-alien-flora.webp');
});

test('the territorial grizzly telegraphs and executes a faster heavy charge', () => {
  const npc = new HuntNPC('grizzly_territorial', { position: [0, 0, 0] });
  const player = makePlayer([0, 0, 10]);
  const pursuitSignals = npc.update(0.2, { player });

  const telegraph = pursuitSignals.find((signal) => signal.type === 'telegraph');
  assert.ok(telegraph);
  assert.equal(telegraph.attackKind, 'charge');
  assert.equal(telegraph.sourceType, 'grizzly_territorial');
  assert.equal(npc.mesh.userData.isCharging, true);
  assert.equal(npc.position.z, 0, 'le grizzly arme sa charge sans avancer pendant le télégraphe');
  assert.equal(findAttack(npc.update(0.2, { player })), undefined);
  assert.equal(npc.position.z, 0);
  assert.equal(findAttack(npc.update(0.25, { player })), undefined);
  assert.equal(npc.position.z, 0, 'la fenêtre annoncée de 0,45 s est entièrement respectée');
  npc.update(0.2, { player });
  assert.ok(npc.position.z > npc.speed * 0.2, 'la charge doit dépasser la vitesse de poursuite normale');

  player.position.set(npc.position.x, npc.position.y, npc.position.z + 2);
  const attack = findAttack(npc.update(0, { player }));
  assert.ok(attack);
  assert.equal(attack.damageType, 'impact');
  assert.equal(attack.attackKind, 'charge');
  assert.equal(attack.damage, 38);
  assert.equal(attack.knockback, 10);
  assert.equal(attack.heavy, true);
  assert.equal(npc.mesh.userData.isCharging, false);
  npc.dispose();
});

test('the original thermal trapper fires an energy-jamming projectile', () => {
  const npc = new HuntNPC('thermal_trapper');
  const attack = findAttack(npc.update(0, { player: makePlayer([0, 0, 10]) }));

  assert.ok(attack);
  assert.equal(attack.attackKind, 'projectile');
  assert.equal(attack.damageType, 'disruption');
  assert.equal(attack.status, 'energy_jam');
  assert.equal(attack.statusDuration, 4);
  assert.equal(attack.energyDrain, 18);
  assert.equal(attack.projectile.speed, 28);
  assert.ok(attack.projectile.origin.isVector3);
  assert.ok(attack.projectile.direction.isVector3);
  npc.dispose();
});

test('the Genna stalker combines corrosion with a venom secondary status', () => {
  const npc = new HuntNPC('genna_stalker');
  const attack = findAttack(npc.update(0, { player: makePlayer([0, 0, 1]) }));

  assert.ok(attack);
  assert.equal(attack.damageType, 'corrosion');
  assert.equal(attack.status, 'corrosion');
  assert.equal(attack.secondaryStatus, 'venom');
  assert.equal(attack.statusDuration, 5);
  npc.dispose();
});

test('the xenomorph warrior is tougher than a drone and retains corrosive melee', () => {
  const warrior = new HuntNPC('xeno_warrior');
  const drone = new HuntNPC('xeno_drone');

  assert.ok(warrior.maxHealth > drone.maxHealth);
  assert.ok(warrior.damage > drone.damage);
  assert.ok(warrior.colliderRadius > drone.colliderRadius);
  const attack = findAttack(warrior.update(0, { player: makePlayer([0, 0, 1]) }));
  assert.ok(attack);
  assert.equal(attack.attackKind, 'melee');
  assert.equal(attack.damageType, 'corrosion');
  assert.equal(attack.status, 'corrosion');
  assert.equal(attack.statusDuration, 4);

  warrior.dispose();
  drone.dispose();
});
