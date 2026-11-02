import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { HuntNPC } from '../src/entities/HuntNPC.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { resolveMeleeTargetContact } from '../src/gameplay/TargetReach.js';
import { installCraftedDamageHook } from '../src/gameplay/CraftedEquipmentRuntime.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import { BIOME_PROP_CATALOG } from '../src/data/BiomePropCatalog.js';
import { Environment } from '../src/world/Environment.js';
import { YautjaTrophyCraftsmanshipForgeSystem } from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function meleeGame(target) {
  const game = Object.assign(Object.create(Game.prototype), {
    isGameStarted: true, isPaused: false, gameState: 'HUNT',
    activeBoss: target, activeEnemies: [], impacts: [],
    player: { position: target.position.clone().add(new THREE.Vector3(0, 0, 1)),
      selectedWeapon: 1, health: 100, meleeDamageMultiplier: 1, wristbladeRangeMultiplier: 1,
      attack: () => 'wristblades', addHonor: amount => amount },
    hud: { showLogMessage() {} },
    spawnBloodSpatterVFX(point) { this.impacts.push(point.clone()); },
  });
  return game;
}

test('standard wristblades hit the rendered body of four large bosses from legal collider contact', () => {
  for (const type of ['rhynth_titan', 'vydrach_prime', 'xeno_king', 'kalisk']) {
    const target = createBoss(new THREE.Scene(), HUNT_DEFINITIONS[type]);
    try {
      target.mesh.position.copy(target.position);
      const game = meleeGame(target);
      game.handlePhysicalCollisions();
      const rootDistance = game.player.position.distanceTo(target.position);
      assert.ok(rootDistance >= target.colliderRadius + 1.8 - 1e-6);
      assert.ok(rootDistance > 8.5, `${type} fixture should reproduce the old unreachable attack`);
      const previousHealth = target.health;
      game.performAttack();
      assert.ok(target.health < previousHealth, `${type} can never be struck at legal contact`);
      assert.equal(game.impacts.length, 1);
      assert.ok(game.impacts[0].distanceTo(game.player.position.clone().add(new THREE.Vector3(0, 4.8, 0))) <= 8.5 + 1e-6);

      game.player.position.copy(target.position).add(new THREE.Vector3(0, 0, 150));
      const afterHit = target.health;
      game.performAttack();
      assert.equal(target.health, afterHit, `${type} gained an unlimited melee reach`);
      assert.equal(game.impacts.length, 1);
    } finally { target.dispose(); }
  }
});

test('empty space between distant body parts and geometry above the blade never count as contact', () => {
  const target = { position: new THREE.Vector3(), mesh: new THREE.Group(), isDead: false,
    health: 100, takeDamage(amount) { this.health -= amount; } };
  const material = new THREE.MeshBasicMaterial();
  for (const x of [-20, 20]) {
    const part = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), material);
    part.position.set(x, 4.8, 0); target.mesh.add(part);
  }
  const wing = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), material);
  wing.position.y = 20; target.mesh.add(wing);
  const game = meleeGame(target);
  game.player.position.set(0, 0, 0);
  try {
    assert.equal(resolveMeleeTargetContact(target, game.player.position, 8.5), null);
    game.performAttack();
    assert.equal(target.health, 100, 'an overall AABB would falsely permit this strike');
    assert.equal(game.impacts.length, 0);
    wing.position.y = 4.8;
    game.performAttack();
    assert.ok(target.health < 100, 'the same real part must become hittable when brought to striking height');
  } finally { disposeObject3D(target.mesh); }
});

test('instance transforms and visibility determine melee contact instead of the uninstanced origin', () => {
  const instances = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial(), 2);
  instances.setMatrixAt(0, new THREE.Matrix4().makeTranslation(50, 4.8, 0));
  instances.setMatrixAt(1, new THREE.Matrix4().makeTranslation(0, 4.8, 5));
  const target = { position: new THREE.Vector3(), mesh: instances };
  try {
    assert.ok(resolveMeleeTargetContact(target, new THREE.Vector3(), 8.5));
    instances.visible = false;
    // A rendered but hidden body must not fall back to its root position.
    assert.equal(resolveMeleeTargetContact(target, new THREE.Vector3(), 8.5), null);
  } finally { disposeObject3D(instances); }
});

test('deformed skin determines melee contact after a joint moves the visible surface', () => {
  const geometry = new THREE.BoxGeometry(2, 2, 1);
  const vertices = geometry.attributes.position.count;
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(vertices * 4), 4));
  const weights = new Float32Array(vertices * 4);
  for (let index = 0; index < vertices; index++) weights[index * 4] = 1;
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
  const skin = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial());
  const bone = new THREE.Bone(); skin.add(bone); skin.bind(new THREE.Skeleton([bone]));
  skin.position.set(0, 4.8, 5);
  const target = { position: new THREE.Vector3(), mesh: skin };
  try {
    assert.ok(resolveMeleeTargetContact(target, new THREE.Vector3(), 8.5));
    // No render/update tick between moving/rotating the root and querying it.
    skin.position.x = 12; skin.rotation.y = Math.PI / 2;
    assert.ok(resolveMeleeTargetContact(target, new THREE.Vector3(12, 0, 0), 8.5));
    assert.equal(resolveMeleeTargetContact(target, new THREE.Vector3(), 8.5), null);
    bone.position.y = 30;
    assert.equal(resolveMeleeTargetContact(target, new THREE.Vector3(12, 0, 0), 8.5), null,
      'an authored bind-pose box must not hit a surface moved far above the blade');
  } finally { disposeObject3D(skin); }
});

test('actual synthetic energy shots and human bullets use their own equipped resistance through Game', () => {
  for (const [type, expected] of [['combat_synthetic', 3], ['human_fireteam', 0.9]]) {
    const player = new YautjaPlayer(new THREE.Scene());
    const enemy = new HuntNPC(type, { position: new THREE.Vector3(0, 0, 8) });
    const perks = { energyResistanceRatio: 0.75, ballisticResistanceRatio: 0.9 };
    const game = Object.assign(Object.create(Game.prototype), {
      player, activeEnemies: [enemy], activeBoss: null, activeHazard: null,
      trophyCraftForge: { getActiveCraftedPerks: () => perks },
      environment: { sampleHeight: () => 0, resolveProjectileCoverImpact: () => null },
      hud: { showLogMessage() {} },
      retryPendingDirectiveWaves() {}, updateExtractionObjective() {}, updateTerritoryClashes() {},
      spawnEnemyTracer() {}, spawnBloodSpatterVFX() {},
    });
    player.position.set(0, 0, 0); player.health = 100;
    installCraftedDamageHook(player, () => game.getCraftedPerks());
    try {
      game.updateEncounterContent(0.01);
      assert.ok(Math.abs((100 - player.health) - expected) < 1e-6,
        `${type} damage family was lost between its real attack signal and the equipped resistance`);
    } finally { enemy.dispose(); disposeObject3D(player.mesh); }
  }
});

function hazardSignal(spec, player) {
  const position = new THREE.Vector3(...spec.position);
  player.position.copy(position);
  const environment = Object.assign(Object.create(Environment.prototype), {
    reducedMotion: true, hazardSignals: [], sampleHeight: () => position.y,
    hazardZones: [{ ...spec, position, cooldown: 0, pulsePhase: 0 }],
  });
  return environment.updateHazardZones(0.01, player)[0];
}

test('catalogue hazards retain their real damage family and status through Environment and Game with existing forged protections', () => {
  const hazards = Object.values(BIOME_PROP_CATALOG).flatMap(plan => plan.hazardZones);
  assert.equal(hazards.length, 20);
  assert.ok(hazards.every(hazard => ['generic', 'acid', 'fire', 'energy', 'plasma'].includes(hazard.damageType)));
  const player = new YautjaPlayer(new THREE.Scene());
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('qa-existing-forged-protections');
  // These specific archival materials cannot be newly farmed. Existing saves
  // retain the already forged armor/shield and must retain their real effects.
  forge.importState({ craftedItemIds: ['craft_shield_engineer_obsidian', 'craft_armor_queen_carapace_cuirass'],
    equippedItemIds: ['craft_shield_engineer_obsidian', 'craft_armor_queen_carapace_cuirass'] });
  const game = Object.assign(Object.create(Game.prototype), { player, trophyCraftForge: forge, hud: { showLogMessage() {} } });
  installCraftedDamageHook(player, () => game.getCraftedPerks());
  game.syncCraftedEquipmentStats();
  try {
    for (const [hazardType, family, multiplier] of [
      ['acid_pool', 'acid', 0], ['heat_vent', 'fire', 0.2],
      ['subway_steam', 'fire', 0.2], ['transformer_arc', 'energy', 0.2], ['plasma_brazier', 'plasma', 0.2],
    ]) {
      const spec = hazards.find(hazard => hazard.type === hazardType);
      player.health = player.maxHealth; player.energy = 100;
      const signal = hazardSignal(spec, player);
      assert.equal(signal.damageType, family);
      assert.equal(game.applyEnvironmentHazardSignal(signal), true);
      assert.ok(Math.abs((player.maxHealth - player.health) - spec.damage * multiplier) < 1e-6,
        `${hazardType} lost its ${family} protection`);
      assert.equal(player.isAcidCorroded, false);
      if (spec.status === 'energy_jam') assert.equal(player.energy, 86, 'resistance must not erase the separate jam status');
    }
  } finally { disposeObject3D(player.mesh); }
});

test('newly craftable physical xeno armor still blocks acid without erasing unrelated snare effects', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('qa-physical-armor');
  forge.setPersistenceHandler(() => true);
  const recipe = forge.getRecipeById('craft_armor_xeno_ribcage_vest');
  player.honorScore = recipe.requiredHonor;
  assert.equal(forge.recordTrophy('xeno_warrior').success, true);
  assert.equal(forge.craftForPlayer(recipe.id, player).success, true);
  const game = Object.assign(Object.create(Game.prototype), { player, trophyCraftForge: forge, hud: { showLogMessage() {} } });
  installCraftedDamageHook(player, () => game.getCraftedPerks());
  game.syncCraftedEquipmentStats();
  try {
    assert.equal(player.maxHealth, 240);
    const spec = BIOME_PROP_CATALOG.hive_lv426.hazardZones[0];
    const signal = hazardSignal(spec, player);
    game.applyEnvironmentHazardSignal(signal);
    assert.equal(player.health, 240);
    assert.equal(player.isAcidCorroded, false);
    const snare = BIOME_PROP_CATALOG.bouvetoya_pyramid.hazardZones.find(hazard => hazard.type === 'resin_snare');
    game.applyEnvironmentHazardSignal(hazardSignal(snare, player));
    assert.equal(player.health, 234);
    assert.ok(player.combatStatusTimers.snare > 0);
  } finally { disposeObject3D(player.mesh); }
});
