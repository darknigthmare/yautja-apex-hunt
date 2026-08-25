import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_TEXTURES,
  HuntNPC,
  V110_HUNT_NPC_ARCHETYPES,
  resolveHuntNpcType,
} from '../src/entities/HuntNPC.js';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';
import {
  getHuntDirective,
  getDirectiveSchedule,
} from '../src/gameplay/HuntDirectiveSystem.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

const CITY_TYPES = [
  'urban_cartel_enforcer',
  'subway_armed_hunter',
  'owlf_cryo_commando',
];

function findSignal(signals, type) {
  return signals.find((signal) => signal.type === type);
}

test('la vague LA 1997 expose trois silhouettes et comportements urbains réellement jouables', () => {
  assert.deepEqual(Object.keys(V110_HUNT_NPC_ARCHETYPES), CITY_TYPES);
  const silhouettes = new Set();
  const behaviors = new Set();

  for (const type of CITY_TYPES) {
    const archetype = V110_HUNT_NPC_ARCHETYPES[type];
    assert.equal(AVAILABLE_HUNT_NPC_ARCHETYPES[type], archetype);
    assert.equal(HUNT_NPC_TEXTURES[type], '/assets/textures/los-angeles-heatwave-urban.webp');
    assert.equal(resolveHuntNpcType(type), type);

    const npc = new HuntNPC(type, { id: `v110-${type}` });
    assert.equal(npc.mesh.userData.silhouette, type);
    assert.equal(npc.mesh.userData.behaviorKind, archetype.behaviorKind);
    assert.ok(npc.mesh.children.length >= 10, `${type}: modèle procédural trop simple`);
    silhouettes.add(npc.mesh.userData.silhouette);
    behaviors.add(npc.behaviorKind);
    npc.dispose();
  }

  assert.equal(silhouettes.size, 3);
  assert.deepEqual([...behaviors], ['cover_burst', 'suppressor', 'net_reposition']);
});

test('le commando OWLF tire un filet cryogénique, brouille l’énergie puis se repositionne', () => {
  const commando = new HuntNPC('owlf_cryo_commando', {
    id: 'v110-owlf-runtime',
    position: [0, 0, 0],
  });
  const player = { position: new THREE.Vector3(0, 0, 15) };

  const attack = findSignal(commando.update(0, { player }), 'attack_player');
  assert.ok(attack);
  assert.equal(attack.damageType, 'disruption');
  assert.equal(attack.status, 'energy_jam');
  assert.equal(attack.energyDrain, 20);
  assert.equal(attack.netProjectile, true);
  assert.equal(attack.repositionAfterShot, true);

  const before = commando.position.clone();
  const move = findSignal(commando.update(0.5, { player }), 'tactical_move');
  assert.equal(move?.mode, 'net_reposition');
  assert.ok(commando.position.distanceTo(player.position) > before.distanceTo(player.position));
  commando.dispose();
});

test('le directeur de niveau distribue les renforts, le véhicule et la cache propres à LA 1997', () => {
  const director = new LevelEventDirector(new THREE.Scene(), { schedule: [] });
  director.start({
    huntId: 'city_hunter',
    biomeId: 'los_angeles_1997',
    directiveId: 'urban_heatwave_hunt',
  });

  assert.deepEqual([1, 2, 3].map((ordinal) => director.selectEnemyType(ordinal)), CITY_TYPES);
  assert.equal(director.selectMigratingPreyType(), 'subway_armed_hunter');
  assert.deepEqual(director.selectTerritoryFactions(), CITY_TYPES.slice(0, 2));
  assert.equal(director.selectVehicleType(), 'clan_interceptor');
  assert.equal(director.selectCacheType(), 'owlf_cold_cache');
  assert.equal(director.dispose(), true);
});

test('la directive Canicule urbaine programme les trois rôles et trois objectifs mesurables', () => {
  const directive = getHuntDirective('urban_heatwave_hunt');
  assert.equal(directive.recommendedBiomeId, 'los_angeles_1997');
  assert.equal(directive.objectives.length, 3);
  assert.equal(directive.rewardMultiplier, 1.5);

  const schedule = getDirectiveSchedule(directive.id);
  assert.deepEqual(schedule.map((event) => event.at), [9, 35, 61]);
  assert.deepEqual(schedule.flatMap((event) => event.enemyTypes), CITY_TYPES);
});

test('la fusée de poignet applique une explosion horizontale avec falloff et ignore les cibles hors rayon', () => {
  const game = Object.create(Game.prototype);
  const hitLog = [];
  const makeTarget = (id, position, colliderRadius = 1) => ({
    id,
    isDead: false,
    colliderRadius,
    position: new THREE.Vector3(...position),
    takeDamage(damage) {
      hitLog.push([id, damage]);
      return { killed: false };
    },
  });
  const boss = makeTarget('city-hunter', [0, 0, 0], 4.8);
  const near = makeTarget('cartel-near', [7, 12, 0], 1);
  const far = makeTarget('owlf-far', [18, 0, 0], 1);

  game.activeBoss = boss;
  game.activeEnemies = [near, far];
  game.player = { addHonor() {} };
  game.spawnBloodSpatterVFX = () => {};
  game.spawnPlasmaShockwaveVFX = () => {};
  game.getTargetBloodColor = () => 0xb41616;
  game.handleNpcDefeat = () => {};
  game.hud = { showLogMessage() {} };

  const outcomes = game.applyPlayerBlastDamage(
    { type: 'wrist_rocket', damage: 96, blastRadius: 7.5 },
    new THREE.Vector3(0, 0, 0),
  );

  assert.deepEqual(hitLog.map(([id]) => id), ['city-hunter', 'cartel-near']);
  assert.equal(outcomes.length, 2);
  assert.equal(hitLog[0][1], 96);
  assert.ok(hitLog[1][1] < 96 && hitLog[1][1] >= 1, 'la cible périphérique subit un falloff réel');
});
