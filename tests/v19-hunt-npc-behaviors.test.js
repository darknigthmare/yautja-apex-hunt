import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_TEXTURES,
  HUNT_NPC_TYPE_ALIASES,
  HuntNPC,
  V19_HUNT_NPC_ARCHETYPES,
  resolveHuntNpcType,
} from '../src/entities/HuntNPC.js';

const V19_TYPES = [
  'hell_hound_alpha',
  'river_ghost',
  'colonial_marine_smartgunner',
  'weyland_field_synthetic',
  'xeno_facehugger',
  'stargazer_rifleman',
  'stargazer_net_trapper',
  'modified_predator_hound',
];

function makePlayer(position = [0, 0, 0], overrides = {}) {
  return { position: new THREE.Vector3(...position), ...overrides };
}

function findSignal(signals, type) {
  return signals.find((signal) => signal.type === type);
}

test('the v1.9 roster exposes eight explicit media-inspired roles without changing legacy registries', () => {
  assert.deepEqual(Object.keys(V19_HUNT_NPC_ARCHETYPES), V19_TYPES);
  assert.deepEqual(
    V19_TYPES.map((type) => V19_HUNT_NPC_ARCHETYPES[type].behaviorKind),
    ['pack_leader', 'evasive_prey', 'suppressor', 'combat_support', 'ambush_pounce', 'cover_burst', 'net_reposition', 'pack_charger'],
  );

  const silhouettes = new Set();
  const combatReads = new Set();
  for (const type of V19_TYPES) {
    const archetype = V19_HUNT_NPC_ARCHETYPES[type];
    assert.equal(AVAILABLE_HUNT_NPC_ARCHETYPES[type], archetype);
    assert.ok(HUNT_NPC_TEXTURES[type]?.startsWith('/assets/textures/'));
    const npc = new HuntNPC(type, { id: `v19-shape-${type}` });
    assert.equal(npc.type, type);
    assert.equal(npc.behaviorKind, archetype.behaviorKind);
    assert.equal(npc.mesh.userData.behaviorKind, archetype.behaviorKind);
    assert.equal(npc.mesh.userData.silhouette, type);
    assert.ok(npc.mesh.children.length >= 10, `${type}: silhouette procédurale trop simple`);
    assert.equal(typeof npc.mesh.userData.combatRead, 'string');
    silhouettes.add(npc.mesh.userData.silhouette);
    combatReads.add(npc.mesh.userData.combatRead);
    npc.dispose();
  }
  assert.equal(silhouettes.size, V19_TYPES.length);
  assert.equal(combatReads.size, V19_TYPES.length);
});

test('v1.9 aliases resolve canonically and malformed content never receives a fallback', () => {
  const aliases = {
    hell_hound: 'hell_hound_alpha',
    riverghost: 'river_ghost',
    smartgunner: 'colonial_marine_smartgunner',
    medic_synthetic: 'weyland_field_synthetic',
    facehugger: 'xeno_facehugger',
    sg_rifleman: 'stargazer_rifleman',
    stargazer_trapper: 'stargazer_net_trapper',
    modified_hound: 'modified_predator_hound',
  };
  for (const [alias, canonical] of Object.entries(aliases)) {
    assert.equal(HUNT_NPC_TYPE_ALIASES[alias], canonical);
    assert.equal(resolveHuntNpcType(alias), canonical);
    const npc = new HuntNPC(alias);
    assert.equal(npc.type, canonical);
    npc.dispose();
  }

  assert.equal(resolveHuntNpcType('  RIVER_GHOST  '), 'river_ghost');
  assert.equal(resolveHuntNpcType('missing_excel_enemy'), null);
  assert.throws(() => new HuntNPC('missing_excel_enemy'), /Unknown hunt NPC archetype/);
});

test('the Hell-Hound alpha rallies nearby hounds and converts pack size into real melee damage', () => {
  const alpha = new HuntNPC('hell_hound_alpha', { id: 'alpha-pack', position: [0, 0, 0] });
  const left = new HuntNPC('hunting_hound', { id: 'pack-left', position: [-2, 0, 0] });
  const right = new HuntNPC('hunting_hound', { id: 'pack-right', position: [2, 0, 0] });
  const player = makePlayer([0, 0, 1.5]);

  const signals = alpha.update(0, { player, allies: [alpha, left, right] });
  const rally = findSignal(signals, 'pack_rally');
  const attack = findSignal(signals, 'attack_player');
  assert.ok(rally);
  assert.deepEqual(rally.allyIds, ['pack-left', 'pack-right']);
  assert.equal(rally.packSize, 3);
  assert.equal(alpha.mesh.userData.packSize, 3);
  assert.ok(attack);
  assert.equal(attack.coordinatedPack, true);
  assert.equal(attack.packSize, 3);
  assert.ok(attack.damage > alpha.damage, 'la coordination doit augmenter les dégâts appliqués');

  const packAttack = findSignal(left.update(0, { player }), 'attack_player');
  assert.ok(packAttack);
  assert.equal(packAttack.coordinatedPack, true);
  assert.equal(packAttack.packSize, 3);
  assert.ok(packAttack.damage > left.damage, 'le ralliement doit aussi renforcer les molosses proches');

  alpha.dispose();
  left.dispose();
  right.dispose();
});

test('the River Ghost sidesteps a close hunter then flees instead of attacking when wounded', () => {
  const ghost = new HuntNPC('river_ghost', { id: 'river-evasion', position: [0, 0, 0] });
  const player = makePlayer([0, 0, 5]);
  const initialDistance = ghost.position.distanceTo(player.position);

  const evadeSignals = ghost.update(0.25, { player });
  assert.equal(findSignal(evadeSignals, 'tactical_move')?.mode, 'evade');
  assert.ok(Math.abs(ghost.position.x) > 0.5, 'l’esquive doit déplacer réellement la proie latéralement');
  assert.ok(ghost.position.distanceTo(player.position) > initialDistance);

  ghost.takeDamage(100);
  const beforeFlee = ghost.position.distanceTo(player.position);
  const fleeSignals = ghost.update(2.5, { player });
  assert.equal(findSignal(fleeSignals, 'tactical_move')?.mode, 'flee');
  assert.ok(ghost.position.distanceTo(player.position) > beforeFlee);
  assert.equal(findSignal(fleeSignals, 'attack_player'), undefined);
  ghost.dispose();
});

test('the Colonial smartgunner backpedals at close range and fires a suppressive burst at range', () => {
  const gunner = new HuntNPC('colonial_marine_smartgunner', {
    id: 'smartgun-suppression', position: [0, 0, 0],
  });
  const player = makePlayer([0, 0, 4]);

  const repositionSignals = gunner.update(0.5, { player });
  assert.equal(findSignal(repositionSignals, 'tactical_move')?.mode, 'backpedal');
  assert.ok(gunner.position.z < 0, 'le maintien de distance doit modifier la position runtime');
  assert.equal(findSignal(repositionSignals, 'attack_player'), undefined);

  player.position.set(0, 0, 15);
  const attack = findSignal(gunner.update(0, { player }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.suppression, true);
  assert.equal(attack.suppressionDuration, 2.6);
  assert.equal(attack.burstCount, 4);
  assert.equal(attack.projectile.burstCount, 4);
  assert.equal(attack.projectile.spread, 0.055);
  assert.equal(attack.projectile.speed, 42);
  gunner.dispose();
});

test('the Weyland field synthetic repairs a wounded ally before resuming fire', () => {
  const medic = new HuntNPC('weyland_field_synthetic', { id: 'weyland-medic', position: [0, 0, 0] });
  const ally = new HuntNPC('colonial_marine_smartgunner', {
    id: 'wounded-marine', position: [2, 0, 0], maxHealth: 176, health: 60,
  });
  const player = makePlayer([0, 0, 12]);

  const supportSignals = medic.update(0, { player, allies: [ally] });
  const support = findSignal(supportSignals, 'support_ally');
  assert.ok(support);
  assert.equal(support.targetId, ally.id);
  assert.equal(support.amount, 28);
  assert.equal(ally.health, 88, 'la réparation doit modifier réellement la santé de l’allié');
  assert.equal(findSignal(supportSignals, 'attack_player'), undefined);

  const attack = findSignal(medic.update(0, { player, allies: [ally] }), 'attack_player');
  assert.ok(attack, 'le synthétique doit reprendre son rôle de combattant pendant le rechargement médical');
  assert.equal(attack.damageType, 'energy');
  assert.equal(attack.projectile.speed, 30);

  medic.dispose();
  ally.dispose();
});

test('the facehugger stays concealed, telegraphs proximity, then applies a real pounce attack', () => {
  const facehugger = new HuntNPC('xeno_facehugger', { id: 'facehugger-ambush', position: [0, 0, 0] });
  const player = makePlayer([0, 0, 20]);

  assert.deepEqual(facehugger.update(1, { player }), []);
  assert.deepEqual(facehugger.position.toArray(), [0, 0, 0]);
  assert.equal(facehugger.mesh.userData.ambushState, 'concealed');

  player.position.set(0, 0, 6);
  const warning = findSignal(facehugger.update(0, { player }), 'telegraph');
  assert.ok(warning);
  assert.equal(warning.attackKind, 'ambush');
  assert.equal(warning.duration, 0.32);
  assert.equal(facehugger.mesh.userData.ambushState, 'windup');

  facehugger.update(0.32, { player });
  assert.equal(facehugger.mesh.userData.ambushState, 'pounce');
  assert.ok(facehugger.position.z > 3, 'le bond doit utiliser un multiplicateur de déplacement réel');
  const attack = findSignal(facehugger.update(0, { player }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.ambush, true);
  assert.equal(attack.status, 'disorientation');
  assert.equal(attack.statusDuration, 3.2);
  assert.equal(facehugger.mesh.userData.ambushState, 'engaged');
  facehugger.dispose();
});

test('voice mimicry remains authoritative over all new tactical states', () => {
  const facehugger = new HuntNPC('xeno_facehugger', { id: 'facehugger-lure', position: [0, 0, 0] });
  const player = makePlayer([0, 0, 2]);
  assert.equal(facehugger.hearMimicry([8, 0, 0], 1), true);
  assert.deepEqual(facehugger.update(0.5, { player }), []);
  assert.ok(facehugger.position.x > 0);
  assert.equal(facehugger.position.z, 0);
  assert.equal(facehugger.mesh.userData.ambushState, 'concealed');
  facehugger.dispose();
});

test('the Stargazer rifleman takes deterministic cover before firing a tracked burst', () => {
  const rifleman = new HuntNPC('stargazer_rifleman', {
    id: 'stargazer-cover-rifleman', position: [0, 0, 0],
  });
  const player = makePlayer([0, 0, 18]);
  const start = rifleman.position.clone();

  const coverSignals = rifleman.update(1, { player });
  const coverMove = findSignal(coverSignals, 'tactical_move');
  assert.equal(coverMove?.mode, 'seek_cover');
  assert.ok(coverMove.coverPosition.isVector3);
  assert.ok(rifleman.position.distanceTo(start) > 2.5, 'le fusilier doit réellement gagner sa couverture');
  assert.equal(findSignal(coverSignals, 'attack_player'), undefined);

  const attack = findSignal(rifleman.update(0, { player }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.fromCover, true);
  assert.equal(attack.burstCount, 3);
  assert.equal(attack.projectile.burstCount, 3);
  assert.equal(attack.projectile.spread, 0.035);
  assert.equal(attack.projectile.speed, 39);
  rifleman.dispose();
});

test('the Stargazer net trapper snares first then physically repositions outside the counterattack line', () => {
  const trapper = new HuntNPC('stargazer_net_trapper', {
    id: 'stargazer-net-trapper', position: [0, 0, 0],
  });
  const player = makePlayer([0, 0, 14]);

  const attack = findSignal(trapper.update(0, { player }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.netProjectile, true);
  assert.equal(attack.repositionAfterShot, true);
  assert.equal(attack.status, 'snare');
  assert.equal(attack.snareDuration, 4.2);
  assert.equal(attack.energyDrain, 10);
  assert.equal(attack.projectile.speed, 25);

  const before = trapper.position.clone();
  const repositionSignals = trapper.update(0.5, { player });
  assert.equal(findSignal(repositionSignals, 'tactical_move')?.mode, 'net_reposition');
  assert.ok(trapper.position.distanceTo(before) > 1.5, 'le piégeur doit décrocher après le tir de filet');
  assert.ok(trapper.position.distanceTo(player.position) > before.distanceTo(player.position));
  assert.equal(findSignal(repositionSignals, 'attack_player'), undefined);
  trapper.dispose();
});

test('the modified Predator hound rallies its pack, telegraphs, then executes an augmented charge', () => {
  const modified = new HuntNPC('modified_predator_hound', {
    id: 'modified-hound-charge', position: [0, 0, 0],
  });
  const packMate = new HuntNPC('hunting_hound', {
    id: 'modified-hound-packmate', position: [1, 0, 0],
  });
  const player = makePlayer([0, 0, 9]);
  const allies = [packMate];

  const warningSignals = modified.update(0, { player, allies });
  assert.equal(findSignal(warningSignals, 'pack_rally')?.packSize, 2);
  const warning = findSignal(warningSignals, 'telegraph');
  assert.ok(warning);
  assert.equal(warning.attackKind, 'charge');
  assert.equal(modified.position.z, 0);

  modified.update(0.45, { player, allies });
  modified.update(0.2, { player, allies });
  assert.ok(modified.position.z > modified.speed * 0.2, 'la charge modifiée doit dépasser la poursuite normale');

  player.position.copy(modified.position).add(new THREE.Vector3(0, 0, 2));
  const attack = findSignal(modified.update(0, { player, allies }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.attackKind, 'charge');
  assert.equal(attack.heavy, true);
  assert.equal(attack.knockback, 5);
  assert.equal(attack.coordinatedPack, true);
  assert.equal(attack.packSize, 2);

  modified.dispose();
  packMate.dispose();
});
